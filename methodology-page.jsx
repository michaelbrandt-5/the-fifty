import { Link } from "react-router-dom";

const PRINCIPLES = [
  {
    number: "01",
    title: "Exactly fifty. No exceptions.",
    body: "Not a top 10 that plays it safe. Not a sprawling list of 200 that helps no one. Fifty is the number that forces hard choices — and hard choices are what make a list worth trusting. Every city gets fifty picks, no more, no less. If something new earns its spot, something else comes off.",
  },
  {
    number: "02",
    title: "Opinionated by design.",
    body: "Every pick is a declaration. We don't hedge with \"also consider\" or \"honorable mentions.\" If it's on the list, we're telling you to go. If it's not, we're telling you something too. We'd rather be wrong than bland.",
  },
  {
    number: "03",
    title: "Curated by locals, edited like a magazine.",
    body: "Our lists start with people who actually live in these cities — then get shaped by editors who've spent careers knowing the difference between good and worth-your-time. No press junkets. No paid placements. No \"sponsored picks\" dressed up as editorial.",
  },
  {
    number: "04",
    title: "Balanced, not symmetrical.",
    body: "Every list covers six categories — Eat, Drink, Coffee, Stay, Experience, Shop — weighted toward how people actually use a city. Roughly fifteen restaurants. Eight bars. Twelve experiences. A spread of neighborhoods. A spread of price points. The $4 taco stand sits next to the $200 tasting menu, because that's what a real city looks like.",
  },
  {
    number: "05",
    title: "Updated quarterly. Without apology.",
    body: "Cities change. A place that earned its spot in March can drift by September. Every list is reviewed every three months — things come off, things go on. You'll always see the last updated date at the top of each city.",
  },
  {
    number: "06",
    title: "No chains. Rare exceptions for icons.",
    body: "You won't find Starbucks on any of our lists. You won't find Marriott. The only time a national name makes it in is when a specific outpost is genuinely the best version of itself anywhere — and those exceptions are rare enough to count on one hand.",
  },
];

const PROCESS = [
  {
    step: "1",
    title: "Scout",
    body: "We start with people who live there — writers, chefs, bartenders, shop owners, long-time residents. Not tourists. Not influencers. They build the first draft: two hundred candidates, roughly.",
  },
  {
    step: "2",
    title: "Visit",
    body: "Editors fly in. They eat, drink, stay, browse, and walk the neighborhoods anonymously. No press dinners. No PR-arranged meetings. Every place on the final list has been visited at least twice, at different times of day.",
  },
  {
    step: "3",
    title: "Cut",
    body: "Two hundred becomes fifty. This is the hard part — and the point. Categories stay balanced. Neighborhoods stay spread out. Price points stay mixed. Every cut is a judgment call, made by people willing to be held to it.",
  },
  {
    step: "4",
    title: "Publish",
    body: "Each pick gets a description, a signature insider tip, and a clear action — reserve, book, directions, or learn more. Nothing longer than it needs to be. Every word has to earn its place, same as every pick.",
  },
];

const FAQS = [
  {
    q: "Who writes The Fifty?",
    a: "Each city has a lead editor — a writer who lives there, or has lived there recently — plus a rotating bench of local contributors. Our editorial team in New York does the final cuts and the copy pass. Names are on every list.",
  },
  {
    q: "Do you take money from restaurants or hotels?",
    a: "No. We don't take comped meals, press rates, paid placements, affiliate deals that influence picks, or anything else that would compromise the list. Revenue comes from subscriptions and occasional editorial partnerships that are clearly labeled.",
  },
  {
    q: "Why only ten cities to start?",
    a: "Because doing one city right takes months. We'd rather launch ten lists we stand behind than fifty lists we don't. The next six cities are already in the works — you can join the waitlist on the homepage.",
  },
  {
    q: "What if I disagree with a pick?",
    a: "Good. That means the list is doing its job. Email us at editors@thefifty.city — every reader note gets read, and the best ones shape the next quarterly update.",
  },
  {
    q: "Can I submit a place?",
    a: "Yes, and we want you to. Tell us what we missed, what we got wrong, and what's new. The form is at the bottom of every city page.",
  },
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
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <Link to="/#cities" style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
            color: "#1A1A1A", textDecoration: "none", letterSpacing: "0.04em",
            textTransform: "uppercase", fontWeight: 500, opacity: 0.7,
          }}>Cities</Link>
          <Link to="/" style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
            color: "#1A1A1A", textDecoration: "none", letterSpacing: "0.04em",
            textTransform: "uppercase", fontWeight: 500, opacity: 0.7,
          }}>About</Link>
          <Link to="/methodology" style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
            color: "#B8864E", textDecoration: "none", letterSpacing: "0.04em",
            textTransform: "uppercase", fontWeight: 600, opacity: 1,
          }}>Methodology</Link>
          <button style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12,
            padding: "8px 20px", background: "#1A1A1A", color: "#F7F4EE",
            border: "none", letterSpacing: "0.06em", textTransform: "uppercase",
            fontWeight: 500, cursor: "pointer",
          }}>Subscribe</button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section style={{
      maxWidth: 900, margin: "0 auto", padding: "180px 24px 80px",
    }}>
      <Link to="/" style={{
        fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "rgba(26,26,26,0.5)",
        textDecoration: "none", marginBottom: 32, display: "inline-block",
      }}>← Back to Home</Link>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
        textTransform: "uppercase", color: "#B8864E", fontWeight: 600, marginBottom: 20,
      }}>Methodology</p>
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(44px, 7vw, 84px)", fontWeight: 700,
        color: "#1A1A1A", lineHeight: 1.0, letterSpacing: "-0.03em", margin: 0,
      }}>
        How we build<br/>a list worth<br/><em style={{ color: "#B8864E", fontStyle: "italic" }}>trusting</em>.
      </h1>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(18px, 2.2vw, 22px)", color: "rgba(26,26,26,0.7)",
        marginTop: 32, maxWidth: 680, lineHeight: 1.55, fontStyle: "italic",
      }}>
        Fifty picks per city is a constraint, not a slogan. Here's exactly how each list gets made, cut, and held to a standard.
      </p>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { label: "Cities", value: "10" },
    { label: "Picks per city", value: "50" },
    { label: "Categories", value: "6" },
    { label: "Updated", value: "Quarterly" },
  ];
  return (
    <section style={{
      maxWidth: 1200, margin: "0 auto", padding: "40px 24px",
      borderTop: "1px solid rgba(26,26,26,0.08)",
      borderBottom: "1px solid rgba(26,26,26,0.08)",
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 32,
      }}>
        {stats.map((s) => (
          <div key={s.label}>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 40, fontWeight: 700, color: "#1A1A1A",
              margin: 0, lineHeight: 1,
            }}>{s.value}</p>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 11,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "rgba(26,26,26,0.5)", marginTop: 8,
            }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PrinciplesSection() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
      <div style={{ marginBottom: 64, maxWidth: 560 }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#B8864E", fontWeight: 600, marginBottom: 16,
        }}>Editorial Principles</p>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700,
          color: "#1A1A1A", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
        }}>Six rules we won't bend.</h2>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 40,
      }}>
        {PRINCIPLES.map((p) => (
          <div key={p.number} style={{
            borderTop: "1px solid rgba(26,26,26,0.15)", paddingTop: 24,
          }}>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 20, color: "#B8864E", margin: 0, fontStyle: "italic",
            }}>{p.number}</p>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22, fontWeight: 700, color: "#1A1A1A",
              margin: "12px 0 14px", lineHeight: 1.2,
            }}>{p.title}</h3>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14,
              color: "rgba(26,26,26,0.65)", lineHeight: 1.7, margin: 0,
            }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section style={{
      background: "#1A1A1A", color: "#F7F4EE", padding: "100px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, maxWidth: 560 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#B8864E", fontWeight: 600, marginBottom: 16,
          }}>The Process</p>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700,
            margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
          }}>From two hundred candidates to fifty picks.</h2>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
        }}>
          {PROCESS.map((p, i) => (
            <div key={p.step} style={{ position: "relative" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
              }}>
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 56, fontWeight: 700, color: "#B8864E", lineHeight: 1,
                }}>{p.step}</span>
                {i < PROCESS.length - 1 && (
                  <span style={{
                    flex: 1, height: 1, background: "rgba(247,244,238,0.15)",
                  }} />
                )}
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 24, fontWeight: 700, margin: "0 0 12px",
              }}>{p.title}</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14,
                color: "rgba(247,244,238,0.6)", lineHeight: 1.7, margin: 0,
              }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const categories = [
    { name: "Eat", count: "~15", color: "rgb(168,60,50)", note: "Fine dining to hole-in-the-wall." },
    { name: "Drink", count: "~8", color: "rgb(150,80,90)", note: "Bars, wine bars, cocktail rooms." },
    { name: "Coffee", count: "~5", color: "rgb(180,130,80)", note: "Roasters, cafés, third-wave." },
    { name: "Stay", count: "~4", color: "rgb(55,90,100)", note: "Hotels with point of view." },
    { name: "Experience", count: "~12", color: "rgb(90,110,70)", note: "Museums, parks, live music." },
    { name: "Shop", count: "~6", color: "rgb(140,100,130)", note: "Boutiques, bookstores, records." },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
      <div style={{ marginBottom: 56, maxWidth: 560 }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#B8864E", fontWeight: 600, marginBottom: 16,
        }}>The Balance</p>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700,
          color: "#1A1A1A", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
        }}>Six categories. Fifty picks.</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15,
          color: "rgba(26,26,26,0.6)", lineHeight: 1.65, marginTop: 20,
        }}>
          Every city gets the same category weights. The mix reflects how people actually spend time in a place — more meals than hotels, more things to do than things to buy.
        </p>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
      }}>
        {categories.map((c) => (
          <div key={c.name} style={{
            padding: "24px 20px", background: "#fff",
            border: "1px solid rgba(26,26,26,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 10,
                letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
                padding: "4px 10px", background: c.color, color: "#fff",
              }}>{c.name}</span>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 24, fontWeight: 700, color: "#1A1A1A",
              }}>{c.count}</span>
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13,
              color: "rgba(26,26,26,0.55)", lineHeight: 1.55, margin: 0,
            }}>{c.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "100px 24px" }}>
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#B8864E", fontWeight: 600, marginBottom: 16,
        }}>Questions</p>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700,
          color: "#1A1A1A", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
        }}>The honest answers.</h2>
      </div>
      <div>
        {FAQS.map((f, i) => (
          <div key={i} style={{
            padding: "32px 0",
            borderTop: "1px solid rgba(26,26,26,0.1)",
            borderBottom: i === FAQS.length - 1 ? "1px solid rgba(26,26,26,0.1)" : "none",
          }}>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22, fontWeight: 700, color: "#1A1A1A",
              margin: "0 0 14px", lineHeight: 1.3,
            }}>{f.q}</h3>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 15,
              color: "rgba(26,26,26,0.65)", lineHeight: 1.7, margin: 0,
            }}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{
      maxWidth: 900, margin: "0 auto", padding: "100px 24px", textAlign: "center",
    }}>
      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700,
        color: "#1A1A1A", margin: 0, lineHeight: 1.15, letterSpacing: "-0.02em",
      }}>Now, <em style={{ fontStyle: "italic", color: "#B8864E" }}>go use</em> the lists.</h2>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 15,
        color: "rgba(26,26,26,0.55)", lineHeight: 1.65, maxWidth: 520,
        margin: "24px auto 40px",
      }}>
        Ten cities are live. Six more are in the works. Every list holds to the same standard as the one you just read about.
      </p>
      <Link to="/#cities" style={{
        fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
        padding: "14px 36px", background: "#1A1A1A", color: "#F7F4EE",
        letterSpacing: "0.08em", textTransform: "uppercase",
        fontWeight: 500, textDecoration: "none", display: "inline-block",
      }}>Explore the Cities</Link>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(26,26,26,0.06)",
      padding: "48px 24px",
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
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { label: "About", href: "/#how-it-works", isHash: true },
            { label: "Methodology", to: "/methodology" },
            { label: "Contact", href: "#" },
          ].map((item) => {
            const style = {
              fontFamily: "'Inter', sans-serif", fontSize: 12,
              color: "rgba(26,26,26,0.4)", textDecoration: "none",
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

export default function MethodologyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #F7F4EE; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(184,134,78,0.2); }
      `}</style>
      <div style={{ background: "#F7F4EE", minHeight: "100vh", color: "#1A1A1A" }}>
        <Nav />
        <Hero />
        <StatsBar />
        <PrinciplesSection />
        <ProcessSection />
        <CategoriesSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
