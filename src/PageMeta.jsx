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
          // We don't have street addresses programmatically, but neighborhood is
          // useful and crawlers accept it.
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
 *   page: "home" | "methodology" | "photo-credits" | "city"
 *   citySlug: string (required when page === "city")
 *   entries: array (required when page === "city")
 */
export default function PageMeta({ page, citySlug, entries }) {
  let title;
  let description;
  let canonical;
  let ogImage;
  let ogType;
  const jsonLdBlocks = [];

  if (page === "city") {
    const city = CITIES[citySlug];
    if (!city) return null;
    title = city.title;
    description = city.description;
    canonical = `${SITE.baseUrl}/${citySlug}`;
    ogImage = absUrl(city.ogImage);
    ogType = "article";

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
    }
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE.name} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {/* JSON-LD */}
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
