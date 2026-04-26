// /about — who we are, why The Fifty exists.

import { Link } from "react-router-dom";
import PageMeta from "./PageMeta.jsx";

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
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <Link to="/#cities" style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
            color: "#1A1A1A", textDecoration: "none", letterSpacing: "0.04em",
            textTransform: "uppercase", fontWeight: 500, opacity: 0.7,
          }}>Cities</Link>
          <Link to="/about" style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
            color: "#8C6534", textDecoration: "none", letterSpacing: "0.04em",
            textTransform: "uppercase", fontWeight: 600, opacity: 1,
          }}>About</Link>
          <Link to="/methodology" style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
            color: "#1A1A1A", textDecoration: "none", letterSpacing: "0.04em",
            textTransform: "uppercase", fontWeight: 500, opacity: 0.7,
          }}>Methodology</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(26,26,26,0.06)",
      padding: "48px 24px", marginTop: 80,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 24,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "baseline", gap: 3, textDecoration: "none" }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 18, fontWeight: 700, color: "#1A1A1A",
          }}>The Fifty</span>
          <span style={{
            width: 5, height: 5, borderRadius: "50%", background: "#B8864E",
            display: "inline-block",
          }} />
        </Link>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "About", to: "/about" },
            { label: "Methodology", to: "/methodology" },
            { label: "Photo Credits", to: "/photo-credits" },
            { label: "Privacy", to: "/privacy" },
            { label: "Terms", to: "/terms" },
            { label: "Contact", href: "mailto:hello@thefiftylist.com" },
          ].map((item) => {
            const style = {
              fontFamily: "'Inter', sans-serif", fontSize: 12,
              color: "rgba(26,26,26,0.65)", textDecoration: "none",
              letterSpacing: "0.04em", textTransform: "uppercase",
            };
            return item.to ? (
              <Link key={item.label} to={item.to} style={style}>{item.label}</Link>
            ) : (
              <a key={item.label} href={item.href} style={style}>{item.label}</a>
            );
          })}
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12,
          color: "rgba(26,26,26,0.25)", margin: 0,
        }}>© 2026 The Fifty. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageMeta page="about" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #F7F4EE; -webkit-font-smoothing: antialiased; }
      `}</style>
      <div style={{ background: "#F7F4EE", minHeight: "100vh", color: "#1A1A1A" }}>
        <Nav />
        <main style={{ maxWidth: 760, margin: "0 auto", padding: "180px 24px 40px" }}>
          <Link to="/" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "rgba(26,26,26,0.65)",
            textDecoration: "none", marginBottom: 32, display: "inline-block",
          }}>← Back to Home</Link>

          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#8C6534", fontWeight: 600, marginBottom: 20,
          }}>About</p>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(44px, 7vw, 80px)", fontWeight: 700,
            color: "#1A1A1A", lineHeight: 1.0, letterSpacing: "-0.03em",
            margin: "0 0 40px",
          }}>
            A city guide for people who don&rsquo;t need a guide.
          </h1>

          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 20, lineHeight: 1.6, color: "#1A1A1A",
          }}>
            <p style={{ marginBottom: 24 }}>
              Most travel guides try to do too much. Two hundred restaurants. Five hundred &ldquo;hidden gems.&rdquo; A list of every coffee shop in a neighborhood. By the time you&rsquo;re done reading, you&rsquo;re less informed than when you started — paralyzed by options, none of them clearly better than the next.
            </p>
            <p style={{ marginBottom: 24 }}>
              The Fifty is the opposite of that.
            </p>
            <p style={{ marginBottom: 24 }}>
              Each city gets exactly fifty picks. Not a top 10, which plays it safe. Not a top 200, which helps no one. Fifty is the number that forces hard choices — and hard choices are what make a list worth trusting. Every entry is a declaration: this is one of the fifty places that matter in this city, full stop.
            </p>
            <p style={{ marginBottom: 24 }}>
              We don&rsquo;t cover chains. The picks are weighted toward how people actually use a city: about fifteen restaurants, eight bars, twelve experiences, with a real spread of neighborhoods and price points. The $4 taco stand sits next to the $200 tasting menu — because that&rsquo;s what a real city looks like.
            </p>
            <p style={{ marginBottom: 24 }}>
              The point isn&rsquo;t to be encyclopedic. The point is to be right.
            </p>
          </div>

          <hr style={{
            border: "none", borderTop: "1px solid rgba(26,26,26,0.1)",
            margin: "56px 0",
          }} />

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 28, fontWeight: 700, color: "#1A1A1A",
            letterSpacing: "-0.01em", marginBottom: 20,
          }}>
            Who&rsquo;s behind this
          </h2>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 18, lineHeight: 1.65, color: "rgba(26,26,26,0.85)",
          }}>
            <p style={{ marginBottom: 16 }}>
              The Fifty is a small editorial project run by people who&rsquo;ve spent years professionally reading menus, walking neighborhoods, and asking locals for the spot they actually go to — not the spot that&rsquo;s easy to recommend.
            </p>
            <p style={{ marginBottom: 16 }}>
              Final cuts and copy are handled by a small editorial team that works city to city.
            </p>
            <p style={{ marginBottom: 16 }}>
              Each city&rsquo;s list is built through deep research — guidebooks, food writers we trust, conversations with locals, and visits when we can make them. We update quarterly as cities change and as our knowledge sharpens.
            </p>
            <p style={{ marginBottom: 16 }}>
              We&rsquo;re independent. We&rsquo;re not funded by tourism boards, hotel groups, or restaurant PR. Revenue comes from subscriptions and the occasional editorial partnership — clearly labeled when it exists, never influencing a pick.
            </p>
          </div>

          <hr style={{
            border: "none", borderTop: "1px solid rgba(26,26,26,0.1)",
            margin: "56px 0",
          }} />

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 28, fontWeight: 700, color: "#1A1A1A",
            letterSpacing: "-0.01em", marginBottom: 20,
          }}>
            Get in touch
          </h2>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 18, lineHeight: 1.65, color: "rgba(26,26,26,0.85)",
          }}>
            <p style={{ marginBottom: 16 }}>
              For editorial questions, corrections, or to suggest a place we missed:{" "}
              <a href="mailto:hello@thefiftylist.com" style={{ color: "#8C6534", textDecoration: "underline" }}>
                hello@thefiftylist.com
              </a>
            </p>
            <p style={{ marginBottom: 16 }}>
              For press inquiries:{" "}
              <a href="mailto:press@thefiftylist.com" style={{ color: "#8C6534", textDecoration: "underline" }}>
                press@thefiftylist.com
              </a>
            </p>
            <p style={{ marginBottom: 16 }}>
              We read everything. The best reader notes shape the next quarterly update.
            </p>
          </div>

          <div style={{
            marginTop: 56, padding: "24px 28px",
            background: "rgba(184,134,78,0.06)",
            borderLeft: "3px solid #8C6534",
          }}>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 17, lineHeight: 1.55, color: "#1A1A1A",
              margin: 0, fontStyle: "italic",
            }}>
              Curious about how the picks are made? Read our{" "}
              <Link to="/methodology" style={{ color: "#8C6534", textDecoration: "underline" }}>methodology</Link>.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
