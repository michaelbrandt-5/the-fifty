// /privacy — Privacy Policy. Plain English; covers what we actually collect.

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

export default function PrivacyPage() {
  return (
    <>
      <PageMeta page="privacy" />
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
          }}>Privacy Policy</p>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 700,
            color: "#1A1A1A", lineHeight: 1.05, letterSpacing: "-0.02em",
            margin: "0 0 16px",
          }}>
            Privacy Policy
          </h1>

          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14,
            color: "rgba(26,26,26,0.65)", marginBottom: 32,
          }}>
            Last updated: April 25, 2026
          </p>

          <p style={para}>
            The Fifty (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates the website at thefiftylist.com. This policy explains, in plain English, what information we collect when you visit our site, how we use it, and the choices you have. We try to collect as little as possible.
          </p>

          <h2 style={sectionH}>What we collect</h2>

          <p style={para}>
            <strong>Email addresses you give us.</strong> If you sign up for our waitlist or newsletter, we ask for your email address. We collect only your email — no name, no address, no phone number — and store it securely with our email service provider, Mailchimp.
          </p>

          <p style={para}>
            <strong>Anonymous usage data.</strong> Like most websites, we use Google Analytics 4 to understand which pages people visit, what city pages are popular, and where our visitors come from (country, broad region). This data is anonymized and aggregated; we cannot identify individual visitors from it.
          </p>

          <p style={para}>
            <strong>Cookies and similar technologies.</strong> Google Analytics sets cookies to remember your visit across pages. Our password gate (when active) uses your browser&rsquo;s session storage to remember that you&rsquo;ve entered the password — this is cleared when you close the tab. We don&rsquo;t use any other tracking, advertising, or fingerprinting tools.
          </p>

          <h2 style={sectionH}>How we use what we collect</h2>

          <ul style={list}>
            <li>To send you the newsletter or city-specific updates you signed up for.</li>
            <li>To understand how the site is used and how to improve it.</li>
            <li>To respond to questions or feedback you send us by email.</li>
          </ul>

          <p style={para}>
            We do not sell your data. We do not share your email with third parties for their marketing. We do not build advertising profiles.
          </p>

          <h2 style={sectionH}>Third parties we use</h2>

          <p style={para}>
            We use a small number of third-party services to operate the site. Each has its own privacy policy:
          </p>
          <ul style={list}>
            <li><strong>Mailchimp</strong> (newsletter delivery) — <a href="https://www.intuit.com/privacy/statement/" target="_blank" rel="noopener noreferrer" style={{ color: "#8C6534", textDecoration: "underline" }}>privacy policy</a></li>
            <li><strong>Google Analytics 4</strong> (anonymous usage analytics) — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#8C6534", textDecoration: "underline" }}>privacy policy</a></li>
            <li><strong>Vercel</strong> (web hosting) — <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#8C6534", textDecoration: "underline" }}>privacy policy</a></li>
            <li><strong>OpenStreetMap / CARTO</strong> (map tiles on city pages) — <a href="https://carto.com/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: "#8C6534", textDecoration: "underline" }}>privacy policy</a></li>
          </ul>

          <h2 style={sectionH}>How to unsubscribe or delete your data</h2>

          <p style={para}>
            Every email we send includes an unsubscribe link at the bottom. Click it once and you&rsquo;re removed from our list, immediately and forever.
          </p>
          <p style={para}>
            You can also email us at{" "}
            <a href="mailto:hello@thefiftylist.com" style={{ color: "#8C6534", textDecoration: "underline" }}>hello@thefiftylist.com</a>{" "}
            and ask us to delete your data. We&rsquo;ll do it within seven days and confirm by reply.
          </p>

          <h2 style={sectionH}>Your rights</h2>

          <p style={para}>
            Depending on where you live, you may have the right to:
          </p>
          <ul style={list}>
            <li>Know what personal data we have about you (it&rsquo;s probably just your email).</li>
            <li>Correct or delete that data.</li>
            <li>Object to or restrict our processing of it.</li>
            <li>Receive a copy of it in a portable format.</li>
          </ul>
          <p style={para}>
            To exercise any of these rights, email us at{" "}
            <a href="mailto:hello@thefiftylist.com" style={{ color: "#8C6534", textDecoration: "underline" }}>hello@thefiftylist.com</a>.
          </p>

          <h2 style={sectionH}>Children&rsquo;s privacy</h2>

          <p style={para}>
            The Fifty is not intended for children under 13. We don&rsquo;t knowingly collect data from anyone under 13. If you believe a child has provided us with their email, please email us and we&rsquo;ll delete it.
          </p>

          <h2 style={sectionH}>Changes to this policy</h2>

          <p style={para}>
            We&rsquo;ll update this page if our practices change. The &ldquo;last updated&rdquo; date at the top will reflect any change. If the change is material, we&rsquo;ll notify newsletter subscribers by email.
          </p>

          <h2 style={sectionH}>Contact</h2>

          <p style={para}>
            Questions about this policy or how we handle your data? Email{" "}
            <a href="mailto:hello@thefiftylist.com" style={{ color: "#8C6534", textDecoration: "underline" }}>hello@thefiftylist.com</a>.
          </p>
        </main>
        <Footer />
      </div>
    </>
  );
}
