// <PageMeta /> — single source of truth for per-page <head> tags.
// Renders title, description, canonical, OG, Twitter card, and JSON-LD.

import { Helmet } from "react-helmet-async";
import { SITE, ROUTES, CITIES, categoryToSchemaType } from "./seo.js";
import LOCATIONS from "./locations.json";

function absUrl(path) {
  if (!path) return SITE.baseUrl;
  if (path.startsWith("http")) return path;
  return `${SITE.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

// ─── JSON-LD builders ───────────────────────────────────────────────────────

function buildOrgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.baseUrl,
    logo: absUrl(SITE.organizationLogo),
    description: SITE.description,
  };
}

// WebSite + SearchAction → can earn a sitelinks search box in Google SERP.
function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.baseUrl,
    description: SITE.description,
  };
}

// BreadcrumbList → renders "thefiftylist.com > Austin" path in SERP.
function buildBreadcrumbJsonLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

function buildCityItemListJsonLd(citySlug, cityName, entries) {
  const cityUrl = `${SITE.baseUrl}/${citySlug}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `The 50 Best Things to Do in ${cityName}`,
    description: CITIES[citySlug]?.description || "",
    url: cityUrl,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${cityUrl}#${entry.id}`,
      name: entry.name,
    })),
  };
}

function buildEntryJsonLdGraph(citySlug, cityName, entries) {
  const cityLocations = LOCATIONS[citySlug] || {};
  const graph = entries
    .map((entry) => {
      const loc = cityLocations[entry.id];
      const node = {
        "@type": categoryToSchemaType(entry.category),
        "@id": `${SITE.baseUrl}/${citySlug}#${entry.id}`,
        name: entry.name,
        description: entry.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: cityName,
          addressRegion: entry.neighborhood,
        },
      };
      if (loc) {
        node.geo = {
          "@type": "GeoCoordinates",
          latitude: loc.lat,
          longitude: loc.lng,
        };
      }
      return node;
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Props:
 *   page: "home" | "methodology" | "photo-credits" | "about" | "privacy" | "terms" | "city" | "entry"
 *   citySlug: string (required when page === "city")
 *   entries: array (required when page === "city")
 *   entryData: object (required when page === "entry") — { title, description, canonical,
 *              ogImage, citySlug, cityName, entry }
 */
export default function PageMeta({ page, citySlug, entries, entryData }) {
  let title;
  let description;
  let canonical;
  let ogImage;
  let ogType;
  const jsonLdBlocks = [];

  // Breadcrumbs: always start with Home.
  const crumbs = [{ name: "Home", url: SITE.baseUrl }];

  if (page === "entry") {
    if (!entryData) return null;
    title = entryData.title;
    description = entryData.description;
    canonical = `${SITE.baseUrl}${entryData.canonical}`;
    ogImage = entryData.ogImage || absUrl(SITE.defaultOgImage);
    ogType = "article";

    // Breadcrumb: Home → City → Entry
    const cityUrl = `${SITE.baseUrl}/${entryData.citySlug}`;
    crumbs.push({ name: entryData.cityName, url: cityUrl });
    crumbs.push({ name: entryData.entry.name, url: canonical });
    jsonLdBlocks.push(buildBreadcrumbJsonLd(crumbs));

    // LocalBusiness JSON-LD for the single entry
    const schemaType = categoryToSchemaType(entryData.entry.category);
    const loc = (LOCATIONS[entryData.citySlug] || {})[entryData.entry.id];
    const placeNode = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: entryData.entry.name,
      description: entryData.entry.description,
      url: canonical,
      address: {
        "@type": "PostalAddress",
        addressLocality: entryData.cityName,
        addressRegion: entryData.entry.neighborhood,
      },
    };
    if (loc) {
      placeNode.geo = { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng };
    }
    if (ogImage) placeNode.image = ogImage;
    jsonLdBlocks.push(placeNode);
  } else if (page === "city") {
    const city = CITIES[citySlug];
    if (!city) return null;
    title = city.title;
    description = city.description;
    canonical = `${SITE.baseUrl}/${citySlug}`;
    ogImage = absUrl(city.ogImage);
    ogType = "article";

    crumbs.push({ name: city.cityName, url: canonical });
    jsonLdBlocks.push(buildBreadcrumbJsonLd(crumbs));

    if (Array.isArray(entries) && entries.length > 0) {
      jsonLdBlocks.push(buildCityItemListJsonLd(citySlug, city.cityName, entries));
      jsonLdBlocks.push(buildEntryJsonLdGraph(citySlug, city.cityName, entries));
    }
  } else {
    const route = ROUTES[page];
    if (!route) return null;
    title = route.title;
    description = route.description;
    canonical = `${SITE.baseUrl}${route.path === "/" ? "" : route.path}`;
    ogImage = absUrl(route.ogImage);
    ogType = route.ogType || "website";

    if (page === "home") {
      jsonLdBlocks.push(buildOrgJsonLd());
      jsonLdBlocks.push(buildWebSiteJsonLd());
    } else {
      // For non-home, non-city pages, add a 2-level breadcrumb
      const pageName = route.title.split(" — ")[0]; // "Methodology" from "Methodology — The Fifty"
      crumbs.push({ name: pageName, url: canonical });
      jsonLdBlocks.push(buildBreadcrumbJsonLd(crumbs));
    }
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {/* Robots — explicitly opt in to indexing + allow Google's larger SERP image previews */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_US" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      {/* JSON-LD */}
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
