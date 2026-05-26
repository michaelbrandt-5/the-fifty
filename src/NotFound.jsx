// 404 — shown for any URL that doesn't match a known route.
// Client-side only (React Router catch-all). The brand voice applies here too.

import { Link } from "react-router-dom";

const CITIES = [
  { name: "Austin",        slug: "austin" },
  { name: "New York",      slug: "new-york" },
  { name: "Nashville",     slug: "nashville" },
  { name: "Chicago",       slug: "chicago" },
  { name: "Los Angeles",   slug: "los-angeles" },
  { name: "Seattle",       slug: "seattle" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "Miami",         slug: "miami" },
  { name: "Portland",      slug: "portland" },
  { name: "Denver",        slug: "denver" },
  { name: "Las Vegas",     slug: "las-vegas" },
];

export default function NotFound() {
  return (
    <div style={{ background: "#F7F4EE", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{
        backgroundColor: "#1a1a1a",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 64,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link to="/" style={{
          fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 400,
          color: "#f5f0e8", textDecoration: "none", letterSpacing: 0.5,
        }}>
          The Fifty
        </Link>
        <Link to="/" style={{
          color: "rgba(255,255,255,0.45)", textDecoration: "none",
          fontFamily: "system-ui, sans-serif", fontSize: 12,
          fontWeight: 500, letterSpacing: 0.3,
        }}>
          ← All cities
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 40px 60px" }}>
        <div style={{ maxWidth: 560, textAlign: "center" }}>

          {/* Big number */}
          <p style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(80px, 18vw, 160px)",
            fontWeight: 400,
            color: "rgba(0,0,0,0.06)",
            lineHeight: 1,
            margin: "0 0 -24px",
            letterSpacing: -4,
          }}>
            404
          </p>

          <div style={{ width: 40, height: 1, backgroundColor: "#B8864E", margin: "0 auto 28px" }} />

          <h1 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 400,
            color: "#1a1a1a",
            margin: "0 0 16px",
            lineHeight: 1.15,
          }}>
            This page didn't make the list.
          </h1>

          <p style={{
            fontFamily: "'Georgia', serif",
            fontSize: 17,
            color: "#777",
            lineHeight: 1.65,
            margin: "0 0 40px",
            fontStyle: "italic",
          }}>
            We're picky about what we put on here. Apparently this URL didn't meet the bar either.
          </p>

          <Link to="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 28px",
            background: "#1a1a1a", color: "#f5f0e8",
            borderRadius: 6, textDecoration: "none",
            fontFamily: "system-ui, sans-serif", fontSize: 13, fontWeight: 600,
            letterSpacing: 0.3,
            transition: "background 0.15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
          >
            Back to The Fifty
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 7h12M8 2l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>

      {/* City links — helps crawlers find the real pages */}
      <section style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "40px 40px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{
            fontFamily: "system-ui, sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: 2, textTransform: "uppercase", color: "#aaa",
            textAlign: "center", marginBottom: 24,
          }}>
            Our cities
          </p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "12px 24px",
            justifyContent: "center",
          }}>
            {CITIES.map((city) => (
              <Link key={city.slug} to={`/${city.slug}`} style={{
                fontFamily: "'Georgia', serif", fontSize: 15,
                color: "#555", textDecoration: "none",
                transition: "color 0.15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; }}
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#1a1a1a", padding: "32px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>
          © {new Date().getFullYear()} The Fifty. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
