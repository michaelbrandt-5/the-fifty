// Generate 1200x630 OG images for the homepage, methodology, and 10 cities.
// Uses @resvg/resvg-js to render SVG → PNG.
// Output: /public/og/{home,methodology,austin,...}.png

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "og");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { slug: "home", title: "The Fifty", tagline: "A city guide for people who don't need a guide.", eyebrow: "Hand-picked. Locally curated." },
  { slug: "methodology", title: "Methodology", tagline: "Exactly fifty. No exceptions.", eyebrow: "How we pick" },
  { slug: "austin", title: "Austin", tagline: "Beyond the hype.", eyebrow: "The 50 best things to do" },
  { slug: "new-york", title: "New York", tagline: "The definitive 50.", eyebrow: "The 50 best things to do" },
  { slug: "nashville", title: "Nashville", tagline: "Past the neon.", eyebrow: "The 50 best things to do" },
  { slug: "chicago", title: "Chicago", tagline: "The real list.", eyebrow: "The 50 best things to do" },
  { slug: "los-angeles", title: "Los Angeles", tagline: "Worth the drive.", eyebrow: "The 50 best things to do" },
  { slug: "seattle", title: "Seattle", tagline: "Rain or shine.", eyebrow: "The 50 best things to do" },
  { slug: "san-francisco", title: "San Francisco", tagline: "Seven miles square.", eyebrow: "The 50 best things to do" },
  { slug: "miami", title: "Miami", tagline: "Past the velvet rope.", eyebrow: "The 50 best things to do" },
  { slug: "portland", title: "Portland", tagline: "Still keeping it weird.", eyebrow: "The 50 best things to do" },
  { slug: "denver", title: "Denver", tagline: "Mile high standards.", eyebrow: "The 50 best things to do" },
];

// Brand
const CREAM = "#F7F4EE";
const TEXT = "#1A1A1A";
const GOLD = "#B8864E";

// XML escape
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function buildSvg({ title, tagline, eyebrow, isHome }) {
  const W = 1200;
  const H = 630;
  // Type sizes scale by length; titles up to ~14 chars look great at 132px.
  const titleSize = title.length > 13 ? 100 : title.length > 9 ? 120 : 132;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @font-face { font-family: 'Playfair Display'; src: local('Playfair Display'); }
      @font-face { font-family: 'Inter'; src: local('Inter'); }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${CREAM}"/>

  <!-- Subtle right-side accent column -->
  <rect x="${W - 16}" y="0" width="16" height="${H}" fill="${GOLD}" fill-opacity="0.9"/>

  <!-- Wordmark "The Fifty" top-left -->
  <g transform="translate(80, 100)">
    <text x="0" y="0"
          font-family="Playfair Display, Georgia, serif"
          font-size="32" font-weight="700"
          fill="${TEXT}"
          letter-spacing="-0.5">The Fifty</text>
    <circle cx="148" cy="-8" r="5" fill="${GOLD}"/>
  </g>

  <!-- Eyebrow -->
  <text x="80" y="${H / 2 - 60}"
        font-family="Inter, system-ui, sans-serif"
        font-size="20" font-weight="600"
        fill="${GOLD}"
        letter-spacing="4"
        text-transform="uppercase">${esc(eyebrow.toUpperCase())}</text>

  <!-- Title -->
  <text x="80" y="${H / 2 + titleSize / 2}"
        font-family="Playfair Display, Georgia, serif"
        font-size="${titleSize}" font-weight="700"
        fill="${TEXT}"
        letter-spacing="-2">${esc(title)}${isHome ? "" : ""}</text>

  <!-- Gold dot after title -->
  ${isHome ? `<circle cx="${80 + title.length * (titleSize * 0.46) + 14}" cy="${H / 2 + titleSize / 2 - titleSize * 0.62}" r="${titleSize * 0.07}" fill="${GOLD}"/>` : ""}

  <!-- Divider -->
  <rect x="80" y="${H / 2 + titleSize / 2 + 36}" width="120" height="2" fill="${TEXT}" fill-opacity="0.85"/>

  <!-- Tagline -->
  <text x="80" y="${H / 2 + titleSize / 2 + 96}"
        font-family="Playfair Display, Georgia, serif"
        font-size="32" font-style="italic"
        fill="${TEXT}" fill-opacity="0.7">${esc(tagline)}</text>

  <!-- Bottom-right "50•" badge -->
  <g transform="translate(${W - 220}, ${H - 100})">
    <text x="0" y="0"
          font-family="Playfair Display, Georgia, serif"
          font-size="92" font-weight="700"
          fill="${TEXT}">50</text>
    <circle cx="115" cy="-22" r="11" fill="${GOLD}"/>
  </g>
</svg>`;
}

async function main() {
  let written = 0;
  for (const page of PAGES) {
    const svg = buildSvg({ ...page, isHome: page.slug === "home" });
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
      font: { loadSystemFonts: true },
      background: CREAM,
    });
    const png = resvg.render().asPng();
    const out = path.join(OUT_DIR, `${page.slug}.png`);
    fs.writeFileSync(out, png);
    written++;
    console.log(`  ✓ /public/og/${page.slug}.png  (${(png.length / 1024).toFixed(1)} KB)`);
  }

  // Also write a square logo for Organization JSON-LD
  const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${CREAM}"/>
  <text x="50%" y="58%" text-anchor="middle"
        font-family="Playfair Display, Georgia, serif"
        font-size="220" font-weight="700"
        fill="${TEXT}">50</text>
  <circle cx="380" cy="170" r="22" fill="${GOLD}"/>
</svg>`;
  const logoResvg = new Resvg(logoSvg, { fitTo: { mode: "width", value: 512 }, font: { loadSystemFonts: true }, background: CREAM });
  fs.writeFileSync(path.join(OUT_DIR, "logo-square.png"), logoResvg.render().asPng());
  written++;
  console.log(`  ✓ /public/og/logo-square.png`);

  console.log(`\nWrote ${written} files to /public/og/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
