// Entry detail page — /austin/houndstooth-coffee
// Renders full entry details with photo hero, description, signature tip,
// action button, and a "More in [City]" related-entries grid.

import { useParams, Link } from "react-router-dom";
import { CITIES, SITE, categoryToSchemaType } from "./seo.js";
import { lookupEntry, getRelatedEntries } from "./data/cities.js";
import { toEntrySlug } from "./utils/slug.js";
import PHOTOS from "./photos.json";
import PageMeta from "./PageMeta.jsx";

// ─── Category colors (matches CLAUDE.md) ─────────────────────────────────────

const CAT_COLORS = {
  Coffee:     { bg: "rgb(180,130,80)",  text: "#fff" },
  Eat:        { bg: "rgb(168,60,50)",   text: "#fff" },
  Stay:       { bg: "rgb(55,90,100)",   text: "#fff" },
  Experience: { bg: "rgb(90,110,70)",   text: "#fff" },
  Shop:       { bg: "rgb(140,100,130)", text: "#fff" },
  Drink:      { bg: "rgb(150,80,90)",   text: "#fff" },
};

// ─── Action button ────────────────────────────────────────────────────────────

function getActionUrl(entry, cityName, state) {
  const query = encodeURIComponent(`${entry.name} ${cityName} ${state}`);
  switch (entry.actionType) {
    case "directions":
      return `https://www.google.com/maps/search/?api=1&query=${query}`;
    case "reserve":
      return `https://www.google.com/search?q=${query}+reservation`;
    case "book":
      return `https://www.google.com/search?q=${query}+book+room`;
    case "learn":
    default:
      return `https://www.google.com/search?q=${query}`;
  }
}

function getActionLabel(actionType) {
  switch (actionType) {
    case "reserve":  return "Make a Reservation";
    case "book":     return "Book a Room";
    case "directions": return "Get Directions";
    default:         return "Learn More";
  }
}

// ─── Related entry card ───────────────────────────────────────────────────────

function RelatedCard({ entry, citySlug, cityName }) {
  const photo = (PHOTOS[citySlug] || {})[entry.id];
  const cat = CAT_COLORS[entry.category] || { bg: "#888", text: "#fff" };

  return (
    <a
      href={`/${citySlug}/${toEntrySlug(entry.name)}`}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s",
        background: "#fff",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Thumbnail */}
      <div style={{ height: 160, overflow: "hidden", background: "#ddd", position: "relative" }}>
        {photo?.src ? (
          <img
            src={photo.src}
            alt={entry.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: cat.bg, opacity: 0.6 }} />
        )}
      </div>
      {/* Content */}
      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{
            padding: "2px 9px", borderRadius: 100,
            backgroundColor: cat.bg, color: cat.text,
            fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
            textTransform: "uppercase", fontFamily: "system-ui, sans-serif",
          }}>
            {entry.category}
          </span>
          <span style={{ fontSize: 11, color: "#888", fontFamily: "system-ui, sans-serif" }}>
            {entry.neighborhood}
          </span>
        </div>
        <p style={{
          fontFamily: "'Georgia', serif",
          fontSize: 16,
          fontWeight: 400,
          color: "#1a1a1a",
          margin: "0 0 6px",
          lineHeight: 1.3,
        }}>
          {entry.name}
        </p>
        <p style={{
          fontFamily: "'Georgia', serif",
          fontSize: 12.5,
          color: "#777",
          margin: 0,
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {entry.description}
        </p>
      </div>
    </a>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EntryPage() {
  const { citySlug, entrySlug } = useParams();
  const result = lookupEntry(citySlug, entrySlug);

  // Not found
  if (!result) {
    return (
      <div style={{ background: "#F7F4EE", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, padding: 40, textAlign: "center" }}>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#999", margin: 0 }}>
          404
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: 0 }}>
          Pick not found
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: "#666", margin: 0, maxWidth: 400, lineHeight: 1.6 }}>
          This entry may have been retired or the URL may have changed.
        </p>
        <Link to={citySlug ? `/${citySlug}` : "/"} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 20px", borderRadius: 6,
          border: "1px solid #1a1a1a", color: "#1a1a1a",
          fontFamily: "system-ui, sans-serif", fontSize: 13,
          fontWeight: 500, textDecoration: "none",
        }}>
          ← Back to {citySlug ? (CITIES[citySlug]?.cityName || citySlug) : "home"}
        </Link>
      </div>
    );
  }

  const { entry, cityData } = result;
  const cityMeta = CITIES[citySlug] || {};
  const photo = (PHOTOS[citySlug] || {})[entry.id];
  const cat = CAT_COLORS[entry.category] || { bg: "#888", text: "#fff" };
  const actionUrl = getActionUrl(entry, cityData.name, cityData.state);
  const related = getRelatedEntries(citySlug, entry.id, 3);

  const pageTitle = `${entry.name} — ${cityData.name} — The Fifty`;
  const pageDesc = entry.description.slice(0, 155).trimEnd() + (entry.description.length > 155 ? "…" : "");
  const canonicalPath = `/${citySlug}/${entrySlug}`;

  return (
    <>
      <PageMeta
        page="entry"
        entryData={{
          title: pageTitle,
          description: pageDesc,
          canonical: canonicalPath,
          ogImage: photo?.src ? `${SITE.baseUrl}${photo.src}` : (cityMeta.ogImage ? `${SITE.baseUrl}${cityMeta.ogImage}` : null),
          citySlug,
          cityName: cityData.name,
          entry,
        }}
      />

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 64,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Back link */}
        <Link to={`/${citySlug}`} style={{
          display: "flex", alignItems: "center", gap: 8,
          color: "rgba(255,255,255,0.7)", textDecoration: "none",
          fontFamily: "system-ui, sans-serif", fontSize: 13, fontWeight: 500,
          transition: "color 0.15s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
          {cityData.name}
        </Link>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 400,
          color: "#f5f0e8", textDecoration: "none", letterSpacing: 0.5,
        }}>
          The Fifty
        </Link>

        {/* Utility nav */}
        <div style={{ display: "flex", gap: 28 }}>
          {[["Methodology", "/methodology"], ["About", "/about"]].map(([label, href]) => (
            <Link key={href} to={href} style={{
              color: "rgba(255,255,255,0.45)", textDecoration: "none",
              fontFamily: "system-ui, sans-serif", fontSize: 12,
              fontWeight: 500, letterSpacing: 0.3,
              transition: "color 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Hero photo ────────────────────────────────────────────────────── */}
      <header style={{
        position: "relative",
        height: "65vh",
        minHeight: 400,
        maxHeight: 680,
        backgroundColor: "#1a1a1a",
        overflow: "hidden",
      }}>
        {photo?.src && (
          <img
            src={photo.src}
            alt={entry.name}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: 0.75,
            }}
          />
        )}
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.75) 100%)",
        }} />

        {/* Hero text */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 48px 48px",
          maxWidth: 900,
        }}>
          {/* Meta badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{
              padding: "4px 12px", borderRadius: 100,
              backgroundColor: cat.bg, color: cat.text,
              fontSize: 11, fontWeight: 600, letterSpacing: 0.8,
              textTransform: "uppercase", fontFamily: "system-ui, sans-serif",
            }}>
              {entry.category}
            </span>
            <span style={{
              fontFamily: "system-ui, sans-serif", fontSize: 12,
              color: "rgba(255,255,255,0.65)", letterSpacing: 0.5,
            }}>
              {entry.neighborhood}
            </span>
            <span style={{
              fontFamily: "'Georgia', serif", fontSize: 12,
              color: "rgba(255,255,255,0.4)",
            }}>
              #{String(entry.id).padStart(2, "0")} of 50
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(36px, 5.5vw, 72px)",
            fontWeight: 400,
            color: "#f5f0e8",
            lineHeight: 1.05,
            margin: "0 0 8px",
          }}>
            {entry.name}
          </h1>

          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
            letterSpacing: 0.3,
          }}>
            {cityData.name}, {cityData.state}
          </p>
        </div>

        {/* Photo credit */}
        {photo?.credit && (
          <div style={{
            position: "absolute", bottom: 12, right: 16,
            fontSize: 10, color: "rgba(255,255,255,0.4)",
            fontFamily: "system-ui, sans-serif",
          }}>
            Photo: {photo.creditUrl
              ? <a href={photo.creditUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>{photo.credit}</a>
              : photo.credit}
          </div>
        )}
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <main style={{ background: "#F7F4EE" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 40px 80px" }}>

          {/* Description */}
          <p style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(16px, 1.8vw, 19px)",
            lineHeight: 1.75,
            color: "#1a1a1a",
            margin: "0 0 40px",
          }}>
            {entry.description}
          </p>

          {/* Signature tip */}
          <div style={{
            borderLeft: "3px solid #B8864E",
            paddingLeft: 24,
            marginBottom: 40,
          }}>
            <p style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#B8864E",
              margin: "0 0 10px",
            }}>
              Insider tip
            </p>
            <p style={{
              fontFamily: "'Georgia', serif",
              fontSize: 16,
              fontStyle: "italic",
              color: "#555",
              lineHeight: 1.7,
              margin: 0,
            }}>
              {entry.signature}
            </p>
          </div>

          {/* Action button */}
          <a
            href={actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              background: "#1a1a1a",
              color: "#f5f0e8",
              borderRadius: 6,
              fontFamily: "system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.3,
              textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
          >
            {getActionLabel(entry.actionType)}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 7h12M8 2l5 5-5 5" />
            </svg>
          </a>

          {/* Back to city link */}
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
            <Link to={`/${citySlug}`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "system-ui, sans-serif", fontSize: 13, fontWeight: 500,
              color: "#666", textDecoration: "none",
              transition: "color 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2L4 7l5 5" />
              </svg>
              See all 50 picks in {cityData.name}
            </Link>
          </div>
        </div>

        {/* ── Related entries ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <section style={{
            background: "#fff",
            borderTop: "1px solid rgba(0,0,0,0.07)",
            padding: "56px 40px",
          }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <p style={{
                fontFamily: "system-ui, sans-serif", fontSize: 11, fontWeight: 600,
                letterSpacing: 2, textTransform: "uppercase", color: "#999",
                marginBottom: 8,
              }}>
                More in {cityData.name}
              </p>
              <h2 style={{
                fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400,
                color: "#1a1a1a", margin: "0 0 32px",
              }}>
                You might also like
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
              }}>
                {related.map((e) => (
                  <RelatedCard
                    key={e.id}
                    entry={e}
                    citySlug={citySlug}
                    cityName={cityData.name}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ background: "#1a1a1a", padding: "48px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "'Georgia', serif", fontSize: 20, color: "#f5f0e8", margin: 0 }}>
            The Fifty
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {[["About", "/about"], ["Methodology", "/methodology"], ["Photo Credits", "/photo-credits"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([label, href]) => (
              <Link key={href} to={href} style={{
                color: "rgba(255,255,255,0.35)", textDecoration: "none",
                fontFamily: "system-ui, sans-serif", fontSize: 12, letterSpacing: 0.3,
                transition: "color 0.15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >
                {label}
              </Link>
            ))}
          </div>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>
            © {new Date().getFullYear()} The Fifty. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
