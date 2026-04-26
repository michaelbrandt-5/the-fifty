// /terms — Terms of Service.

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
        <Link to="/" style={{
          fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
          color: "#1A1A1A", textDecoration: "none", letterSpacing: "0.04em",
          textTransform: "uppercase", fontWeight: 500, opacity: 0.7,
        }}>← Home</Link>
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

const sectionH = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 24, fontWeight: 700, color: "#1A1A1A",
  letterSpacing: "-0.01em", marginBottom: 16, marginTop: 40,
};

const para = {
  fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.7,
  color: "rgba(26,26,26,0.85)", marginBottom: 16,
};

const list = {
  fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.7,
  color: "rgba(26,26,26,0.85)", marginBottom: 16,
  paddingLeft: 24,
};

export default function TermsPage() {
  return (
    <>
      <PageMeta page="terms" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #F7F4EE; -webkit-font-smoothing: antialiased; }
      `}</style>
      <div style={{ background: "#F7F4EE", minHeight: "100vh", color: "#1A1A1A" }}>
        <Nav />
        <main style={{ maxWidth: 760, margin: "0 auto", padding: "140px 24px 40px" }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#8C6534", fontWeight: 600, marginBottom: 16,
          }}>Terms of Service</p>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 700,
            color: "#1A1A1A", lineHeight: 1.05, letterSpacing: "-0.02em",
            margin: "0 0 16px",
          }}>
            Terms of Service
          </h1>

          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14,
            color: "rgba(26,26,26,0.65)", marginBottom: 32,
          }}>
            Last updated: April 25, 2026
          </p>

          <p style={para}>
            By using thefiftylist.com (the &ldquo;Site&rdquo;), you agree to these terms. If you don&rsquo;t agree, please don&rsquo;t use the Site. We try to keep things simple here.
          </p>

          <h2 style={sectionH}>What we offer</h2>

          <p style={para}>
            The Fifty publishes editorial city guides — fifty hand-picked places per city, organized into categories. Content is provided as-is for your information and inspiration. Our recommendations reflect editorial judgment, not professional advice; we&rsquo;re telling you where we&rsquo;d send a friend, not endorsing any business.
          </p>

          <h2 style={sectionH}>Use of the Site</h2>

          <p style={para}>
            You may read, share, and link to The Fifty freely. You may not:
          </p>
          <ul style={list}>
            <li>Republish substantial portions of our content without permission.</li>
            <li>Scrape the Site at scale or build derivative products from our content without permission.</li>
            <li>Use our brand, logo, or wordmark in a way that suggests endorsement or affiliation.</li>
            <li>Try to disrupt the Site or harm other users.</li>
          </ul>
          <p style={para}>
            For licensing, syndication, or republication inquiries, email{" "}
            <a href="mailto:hello@thefiftylist.com" style={{ color: "#8C6534", textDecoration: "underline" }}>hello@thefiftylist.com</a>.
          </p>

          <h2 style={sectionH}>Intellectual property</h2>

          <p style={para}>
            All editorial content on the Site — descriptions, signatures, lists, design — is owned by The Fifty and protected by copyright. Photographs are sourced via the Google Places API and credited to their original photographers; see our{" "}
            <Link to="/photo-credits" style={{ color: "#8C6534", textDecoration: "underline" }}>Photo Credits</Link>{" "}
            page for full attribution.
          </p>

          <h2 style={sectionH}>Third-party businesses and links</h2>

          <p style={para}>
            We link to and recommend independently-operated businesses (restaurants, hotels, shops, etc.). We have no control over those businesses, their hours, their menus, or their continued operation. We do our best to keep the lists current, but conditions change — call ahead, check websites, and use your judgment before traveling.
          </p>
          <p style={para}>
            A place being on our list is not a guarantee of quality, availability, or anything else. It&rsquo;s our editorial opinion, nothing more.
          </p>

          <h2 style={sectionH}>No warranties</h2>

          <p style={para}>
            The Site and everything on it is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranty of any kind, express or implied. We don&rsquo;t guarantee that the Site will be uninterrupted, error-free, secure, or that information will be accurate or current.
          </p>

          <h2 style={sectionH}>Limitation of liability</h2>

          <p style={para}>
            To the maximum extent permitted by law, The Fifty and its team are not liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Site or any business you visit based on our recommendations. If something doesn&rsquo;t live up to expectations, that&rsquo;s genuinely on us editorially — but it&rsquo;s not a basis for damages.
          </p>

          <h2 style={sectionH}>Changes to these terms</h2>

          <p style={para}>
            We may update these terms occasionally. The &ldquo;last updated&rdquo; date will reflect any change. Continued use of the Site after a change means you accept the updated terms.
          </p>

          <h2 style={sectionH}>Governing law</h2>

          <p style={para}>
            These terms are governed by the laws of the State of Texas, without regard to conflict-of-law principles. Any disputes will be resolved in the state or federal courts located in Travis County, Texas.
          </p>

          <h2 style={sectionH}>Contact</h2>

          <p style={para}>
            Questions about these terms? Email{" "}
            <a href="mailto:hello@thefiftylist.com" style={{ color: "#8C6534", textDecoration: "underline" }}>hello@thefiftylist.com</a>.
          </p>
        </main>
        <Footer />
      </div>
    </>
  );
}
