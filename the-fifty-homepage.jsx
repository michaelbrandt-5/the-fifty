import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeEmail } from "./src/mailchimp.js";
import PageMeta from "./src/PageMeta.jsx";

const CITIES = [
  { name: "New York", slug: "new-york", tagline: "The definitive 50", region: "Northeast", img: "/images/cities/new-york.jpg" },
  { name: "Austin", slug: "austin", tagline: "Beyond the hype", region: "Texas", img: "/images/cities/austin.jpg" },
  { name: "Nashville", slug: "nashville", tagline: "Past the neon", region: "Southeast", img: "/images/cities/nashville.jpg" },
  { name: "Chicago", slug: "chicago", tagline: "The real list", region: "Midwest", img: "/images/cities/chicago.jpg" },
  { name: "Los Angeles", slug: "los-angeles", tagline: "Worth the drive", region: "West Coast", img: "/images/cities/los-angeles.jpg" },
  { name: "Seattle", slug: "seattle", tagline: "Rain or shine", region: "Pacific NW", img: "/images/cities/seattle.jpg" },
  { name: "San Francisco", slug: "san-francisco", tagline: "Seven miles square", region: "West Coast", img: "/images/cities/san-francisco.jpg" },
  { name: "Miami", slug: "miami", tagline: "Past the velvet rope", region: "Southeast", img: "/images/cities/miami.jpg" },
  { name: "Portland", slug: "portland", tagline: "Still keeping it weird", region: "Pacific NW", img: "/images/cities/portland.jpg" },
  { name: "Denver", slug: "denver", tagline: "Mile high standards", region: "Mountain West", img: "/images/cities/denver.jpg" },
];

const SAMPLE_PICKS = [
  {
    number: "07",
    name: "Cervo's",
    category: "Restaurant",
    neighborhood: "Lower East Side",
    description: "A Mediterranean wine bar where the grilled fish is perfect, the natural wine list is deep, and the backyard feels like a secret the whole city somehow already knows.",
  },
  {
    number: "12",
    name: "Devoción",
    category: "Coffee",
    neighborhood: "Williamsburg",
    description: "Colombian single-origin roasted in a greenhouse-like space that smells like it. The cortado here is a benchmark.",
  },
  {
    number: "23",
    name: "The Noguchi Museum",
    category: "Experience",
    neighborhood: "Long Island City",
    description: "A sculptor's personal museum in a converted factory with a garden that makes you forget you're in Queens. Go on a weekday morning.",
  },
  {
    number: "38",
    name: "Attaboy",
    category: "Bar",
    neighborhood: "Lower East Side",
    description: "No menu. Tell them what you like, and they'll make something better than what you'd have ordered. The unmarked door is part of the charm.",
  },
];

const CATEGORY_COLORS = {
  Restaurant: { bg: "#F3EDE4", text: "#8B6914" },
  Coffee: { bg: "#EBF0EC", text: "#4A6741" },
  Experience: { bg: "#EDE8F0", text: "#6B5278" },
  Bar: { bg: "#F0EAEB", text: "#8B4553" },
};

const PHILOSOPHY = [
  {
    number: "01",
    title: "Exactly fifty. No exceptions.",
    body: "Not a top 10 that plays it safe. Not a sprawling list of 200 that helps no one. Fifty is the number that forces hard choices — and hard choices are what make a list worth trusting.",
  },
  {
    number: "02",
    title: "Opinionated by design.",
    body: "Every pick is a declaration. We don't hedge with \"also consider\" or \"honorable mentions.\" If it's on the list, we're telling you to go. If it's not, we're telling you something too.",
  },
  {
    number: "03",
    title: "Curated by locals, edited like a magazine.",
    body: "Our lists start with people who actually live in these cities — then get shaped by editors who've spent careers knowing the difference between good and worth-your-time.",
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
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em",
          }}>The Fifty</span>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#B8864E",
            display: "inline-block", marginLeft: 1, marginBottom: 2,
          }} />
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            { label: "Cities", href: "#cities" },
            { label: "About", href: "#how-it-works" },
            { label: "Methodology", to: "/methodology" },
          ].map((item) => {
            const sharedStyle = {
              fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
              color: "#1A1A1A", textDecoration: "none", letterSpacing: "0.04em",
              textTransform: "uppercase", fontWeight: 500, opacity: 0.7,
              transition: "opacity 0.2s",
            };
            const onEnter = (e) => e.target.style.opacity = 1;
            const onLeave = (e) => e.target.style.opacity = 0.7;
            return item.to ? (
              <Link key={item.label} to={item.to} style={sharedStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} style={sharedStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                {item.label}
              </a>
            );
          })}
          <button style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12,
            padding: "8px 20px", background: "#1A1A1A", color: "#F7F4EE",
            border: "none", letterSpacing: "0.06em", textTransform: "uppercase",
            fontWeight: 500, cursor: "pointer",
          }} onClick={() => document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" })}>Subscribe</button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "120px 24px 80px", position: "relative",
    }}>
      <div style={{
        position: "absolute", top: "15%", left: "8%", width: 180, height: 240,
        background: `url(/images/cities/hero-1.jpg) center/cover`,
        opacity: 0.12, filter: "grayscale(30%)",
      }} />
      <div style={{
        position: "absolute", bottom: "18%", right: "10%", width: 150, height: 200,
        background: `url(/images/cities/hero-2.jpg) center/cover`,
        opacity: 0.1, filter: "grayscale(30%)",
      }} />
      <p style={{
        fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12,
        letterSpacing: "0.2em", textTransform: "uppercase", color: "#8C6534",
        marginBottom: 32, fontWeight: 600,
      }}>A City Guide for People Who Don't Need a Guide</p>
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(64px, 12vw, 140px)", fontWeight: 700,
        color: "#1A1A1A", lineHeight: 0.9, letterSpacing: "-0.03em",
        margin: 0, position: "relative",
      }}>
        The Fifty
        <span style={{
          display: "inline-block", width: "clamp(10px, 2vw, 18px)",
          height: "clamp(10px, 2vw, 18px)", borderRadius: "50%",
          background: "#B8864E", marginLeft: 4, verticalAlign: "super",
          position: "relative", top: "-0.1em",
        }} />
      </h1>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(20px, 3vw, 32px)", color: "#1A1A1A",
        marginTop: 28, maxWidth: 620, lineHeight: 1.35,
        fontWeight: 400, fontStyle: "italic", opacity: 0.8,
      }}>
        Fifty things. One city. No filler.
      </p>
      <p style={{
        fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15,
        color: "#1A1A1A", opacity: 0.5, marginTop: 48, maxWidth: 440,
        lineHeight: 1.65,
      }}>
        The only list that forces hard choices so you don't have to.
        Every city, distilled to the 50 places that actually matter.
      </p>
      <div style={{ marginTop: 56, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <a href="#cities" style={{
          fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
          padding: "14px 36px", background: "#1A1A1A", color: "#F7F4EE",
          border: "none", letterSpacing: "0.08em", textTransform: "uppercase",
          fontWeight: 500, cursor: "pointer", transition: "background 0.2s",
          textDecoration: "none", display: "inline-block",
        }}
        onMouseEnter={(e) => e.target.style.background = "#333"}
        onMouseLeave={(e) => e.target.style.background = "#1A1A1A"}
        >Explore Cities</a>
        <a href="#how-it-works" style={{
          fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
          padding: "14px 36px", background: "transparent", color: "#1A1A1A",
          border: "1px solid rgba(26,26,26,0.2)", letterSpacing: "0.08em",
          textTransform: "uppercase", fontWeight: 500, cursor: "pointer",
          textDecoration: "none", display: "inline-block",
        }}>How It Works</a>
      </div>
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: 0.3,
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 32, background: "#1A1A1A" }} />
      </div>
    </section>
  );
}

function CityCard({ city, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/${city.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden", cursor: "pointer",
        aspectRatio: index < 2 ? "4/5" : "3/4",
        background: "#E8E3DB",
        transition: "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "block", textDecoration: "none",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: `url(${city.img}) center/cover`,
        transition: "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        opacity: hovered ? 0.9 : 0.75,
        filter: "contrast(1.05)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.1) 50%, transparent 100%)",
      }} />
      <div style={{
        position: "absolute", top: 20, left: 20,
        fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.15em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontWeight: 500,
      }}>{city.region}</div>
      <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 700,
          color: "#fff", margin: 0, lineHeight: 1.1,
        }}>{city.name}</h3>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: "rgba(255,255,255,0.7)", margin: "8px 0 0", fontStyle: "italic",
        }}>{city.tagline}</p>
        <div style={{
          marginTop: 16, display: "flex", alignItems: "center", gap: 8,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.3s ease",
        }}>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#fff", fontWeight: 500,
          }}>View the fifty</span>
          <span style={{ color: "#fff", fontSize: 14 }}>→</span>
        </div>
      </div>
    </Link>
  );
}

function CitiesSection() {
  return (
    <section id="cities" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 120px", scrollMarginTop: 80 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginBottom: 56, flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#8C6534", fontWeight: 600, marginBottom: 12,
          }}>Now Live</p>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700,
            color: "#1A1A1A", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em",
          }}>Choose Your City</h2>
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 14,
          color: "rgba(26,26,26,0.65)", maxWidth: 320, lineHeight: 1.6, margin: 0,
        }}>
          Each list is independently researched, ruthlessly edited, and updated quarterly.
        </p>
      </div>
      {/* Featured row: first 2 cities */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 20,
        marginBottom: 20,
      }}>
        {CITIES.slice(0, 2).map((city, i) => (
          <CityCard key={city.name} city={city} index={i} />
        ))}
      </div>
      {/* Remaining 8 cities in a 4-column grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 20,
      }}>
        {CITIES.slice(2).map((city, i) => (
          <CityCard key={city.name} city={city} index={i + 2} />
        ))}
      </div>
    </section>
  );
}

function SamplePick({ pick, isActive }) {
  const colors = CATEGORY_COLORS[pick.category] || CATEGORY_COLORS.Restaurant;
  return (
    <div style={{
      padding: "32px 0",
      borderBottom: "1px solid rgba(26,26,26,0.08)",
      display: "grid",
      gridTemplateColumns: "48px 1fr",
      gap: 20,
      opacity: isActive ? 1 : 0.5,
      transition: "opacity 0.3s",
    }}
    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.opacity = 0.5 }}
    >
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 32, fontWeight: 700, color: "rgba(26,26,26,0.12)",
        lineHeight: 1,
      }}>{pick.number}</span>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <h4 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: 0,
          }}>{pick.name}</h4>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 10,
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "4px 10px", fontWeight: 600,
            background: colors.bg, color: colors.text,
          }}>{pick.category}</span>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12,
            color: "rgba(26,26,26,0.4)", fontStyle: "italic",
          }}>{pick.neighborhood}</span>
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15,
          color: "rgba(26,26,26,0.65)", lineHeight: 1.65, margin: 0,
          maxWidth: 600,
        }}>{pick.description}</p>
      </div>
    </div>
  );
}

function SampleSection() {
  return (
    <section style={{
      background: "#fff",
      borderTop: "1px solid rgba(26,26,26,0.06)",
      borderBottom: "1px solid rgba(26,26,26,0.06)",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 24px 80px" }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#8C6534", fontWeight: 600, marginBottom: 12,
          }}>From the New York List</p>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 700,
            color: "#1A1A1A", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
          }}>A Preview of What's Inside</h2>
        </div>
        <div style={{ borderTop: "2px solid #1A1A1A" }}>
          {SAMPLE_PICKS.map((pick, i) => (
            <SamplePick key={pick.number} pick={pick} isActive={i === 0} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 18, color: "rgba(26,26,26,0.4)", fontStyle: "italic",
          }}>…and 46 more you'll wish you knew sooner.</p>
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section id="how-it-works" style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px", scrollMarginTop: 80 }}>
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#8C6534", fontWeight: 600, marginBottom: 12,
        }}>Our Philosophy</p>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 700,
          color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em",
        }}>Why Fifty?</h2>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 48,
      }}>
        {PHILOSOPHY.map((item) => (
          <div key={item.number} style={{ position: "relative" }}>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 64, fontWeight: 700, color: "rgba(26,26,26,0.04)",
              position: "absolute", top: -24, left: -8, lineHeight: 1,
            }}>{item.number}</span>
            <div style={{ position: "relative" }}>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22, fontWeight: 700, color: "#1A1A1A",
                marginBottom: 16, lineHeight: 1.2,
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 15,
                color: "rgba(26,26,26,0.65)", lineHeight: 1.7, margin: 0,
              }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleSubmit = async () => {
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      await subscribeEmail(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const upcomingCities = ["New Orleans", "Charleston", "Philadelphia", "Boston", "Washington D.C.", "Santa Fe"];

  return (
    <section id="subscribe" style={{
      background: "#1A1A1A", color: "#F7F4EE",
      padding: "100px 24px", textAlign: "center",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#8C6534", fontWeight: 600, marginBottom: 12,
        }}>Coming Soon</p>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700,
          margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.1,
        }}>New Cities Are in the Works</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15,
          color: "rgba(247,244,238,0.5)", lineHeight: 1.6, marginBottom: 40,
        }}>
          Get notified when we publish a new city list. No spam, just a single email when the list drops.
        </p>
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: 8, marginBottom: 32,
        }}>
          {upcomingCities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12,
                padding: "8px 16px",
                background: selectedCity === city ? "#B8864E" : "rgba(247,244,238,0.08)",
                color: selectedCity === city ? "#1A1A1A" : "rgba(247,244,238,0.6)",
                border: "1px solid",
                borderColor: selectedCity === city ? "#B8864E" : "rgba(247,244,238,0.1)",
                cursor: "pointer", transition: "all 0.2s",
                letterSpacing: "0.04em", fontWeight: 500,
              }}
            >{city}</button>
          ))}
        </div>
        {!submitted ? (
          <>
            <div style={{
              display: "flex", gap: 0, maxWidth: 460, margin: "0 auto",
            }}>
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address for waitlist"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  flex: 1, padding: "14px 20px",
                  fontFamily: "'Inter', sans-serif", fontSize: 14,
                  background: "rgba(247,244,238,0.06)",
                  border: "1px solid rgba(247,244,238,0.12)",
                  borderRight: "none",
                  color: "#F7F4EE", outline: "none",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12,
                  padding: "14px 28px", background: submitting ? "#9a7040" : "#B8864E", color: "#1A1A1A",
                  border: "none", letterSpacing: "0.08em", textTransform: "uppercase",
                  fontWeight: 600, cursor: submitting ? "wait" : "pointer", whiteSpace: "nowrap",
                  opacity: submitting ? 0.7 : 1, transition: "all 0.2s",
                }}
              >{submitting ? "Joining..." : "Join Waitlist"}</button>
            </div>
            {error && (
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13,
                color: "#e8614d", marginTop: 12,
              }}>{error}</p>
            )}
          </>
        ) : (
          <div style={{
            padding: "16px 24px",
            background: "rgba(184,134,78,0.1)",
            border: "1px solid rgba(184,134,78,0.2)",
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14,
              color: "#8C6534", margin: 0,
            }}>
              You're on the list{selectedCity ? ` for ${selectedCity}` : ""}. We'll be in touch.
            </p>
          </div>
        )}
      </div>
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
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 18, fontWeight: 700, color: "#1A1A1A",
          }}>The Fifty</span>
          <span style={{
            width: 5, height: 5, borderRadius: "50%", background: "#B8864E",
            display: "inline-block",
          }} />
        </div>
        <div style={{ display: "flex", gap: 32 }}>
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

export default function TheFiftyHomepage() {
  return (
    <>
      <PageMeta page="home" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #F7F4EE; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(184,134,78,0.2); }
        input::placeholder { color: rgba(247,244,238,0.3); }
        @media (max-width: 640px) {
          nav > div { padding: 14px 16px !important; }
          nav > div > div:last-child > a { display: none; }
        }
      `}</style>
      <div style={{ background: "#F7F4EE", minHeight: "100vh", color: "#1A1A1A" }}>
        <Nav />
        <Hero />
        <CitiesSection />
        <SampleSection />
        <PhilosophySection />
        <WaitlistSection />
        <Footer />
      </div>
    </>
  );
}