// /photo-credits — single page listing every photo and its photographer.
// All photos are sourced via the Google Places API; attribution is required.

import { Link } from "react-router-dom";
import PHOTOS from "./photos.json";
import PageMeta from "./PageMeta.jsx";

const CITY_DISPLAY_NAMES = {
  austin: "Austin",
  "new-york": "New York",
  nashville: "Nashville",
  chicago: "Chicago",
  "los-angeles": "Los Angeles",
  seattle: "Seattle",
  "san-francisco": "San Francisco",
  miami: "Miami",
  portland: "Portland",
  denver: "Denver",
};

const CITY_ORDER = [
  "new-york",
  "austin",
  "nashville",
  "chicago",
  "los-angeles",
  "seattle",
  "san-francisco",
  "miami",
  "portland",
  "denver",
];

function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(247, 244, 238, 0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(26, 26, 26, 0.06)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "18px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "baseline", gap: 3, textDecoration: "none" }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em",
          }}>The Fifty</span>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#B8864E",
            display: "inline-block", marginLeft: 1, marginBottom: 2,
          }} />
        </Link>
        <Link to="/" style={{
          fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
          color: "#1A1A1A", textDecoration: "none", letterSpacing: "0.04em",
          textTransform: "uppercase", fontWeight: 500, opacity: 0.7,
        }}>← Home</Link>
      </div>
    </nav>
  );
}

export default function PhotoCredits() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F4EE; -webkit-font-smoothing: antialiased; font-family: 'Inter', system-ui, sans-serif; }
      `}</style>
      <PageMeta page="photo-credits" />
      <div style={{ background: "#F7F4EE", minHeight: "100vh", color: "#1A1A1A" }}>
        <Nav />
        <main style={{ maxWidth: 880, margin: "0 auto", padding: "140px 24px 80px" }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#B8864E", fontWeight: 600, marginBottom: 16,
          }}>Image attribution</p>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 700, lineHeight: 1.05,
            margin: "0 0 24px", letterSpacing: "-0.02em",
          }}>Photo Credits</h1>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 18, lineHeight: 1.6, color: "rgba(26,26,26,0.65)",
            margin: "0 0 16px", maxWidth: 640,
          }}>
            All photographs on The Fifty are sourced via the Google Places API and credited to their original
            photographers. We're grateful to every contributor whose work helps these places come alive on the page.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.65,
            color: "rgba(26,26,26,0.5)", margin: "0 0 56px", maxWidth: 640,
          }}>
            If you took one of the photos below and would like the credit changed or a photo removed, please email{" "}
            <a href="mailto:hello@thefiftylist.com" style={{ color: "#B8864E", textDecoration: "underline" }}>
              hello@thefiftylist.com
            </a>{" "}
            and we'll respond within 48 hours.
          </p>

          {CITY_ORDER.map((slug) => {
            const cityPhotos = PHOTOS[slug];
            if (!cityPhotos) return null;
            const ids = Object.keys(cityPhotos)
              .map((id) => parseInt(id, 10))
              .sort((a, b) => a - b);

            return (
              <section key={slug} style={{ marginBottom: 64 }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 28, fontWeight: 700, color: "#1A1A1A",
                  letterSpacing: "-0.01em", marginBottom: 24,
                  paddingBottom: 12, borderBottom: "1px solid rgba(26,26,26,0.1)",
                }}>
                  <Link to={`/${slug}`} style={{ color: "#1A1A1A", textDecoration: "none" }}>
                    {CITY_DISPLAY_NAMES[slug]}
                  </Link>
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {ids.map((id) => {
                    const photo = cityPhotos[id];
                    const name = photo.matchedName || `#${id}`;
                    return (
                      <li
                        key={id}
                        style={{
                          padding: "10px 0",
                          borderBottom: "1px solid rgba(26,26,26,0.04)",
                          display: "grid",
                          gridTemplateColumns: "32px 1fr auto",
                          gap: 16,
                          alignItems: "baseline",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        <span style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: 13, color: "rgba(26,26,26,0.3)",
                          fontFeatureSettings: "'tnum'",
                        }}>{String(id).padStart(2, "0")}</span>
                        <span style={{ color: "#1A1A1A" }}>{name}</span>
                        <span style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          color: "rgba(26,26,26,0.55)",
                          textAlign: "right",
                        }}>
                          Photo:{" "}
                          {photo.creditUrl ? (
                            <a
                              href={photo.creditUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#B8864E", textDecoration: "none" }}
                            >
                              {photo.credit}
                            </a>
                          ) : (
                            <span>{photo.credit}</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12,
            color: "rgba(26,26,26,0.35)", marginTop: 64, textAlign: "center",
          }}>
            Photos provided by Google Places API. © 2026 The Fifty.
          </p>
        </main>
      </div>
    </>
  );
}
