// Fix heading hierarchy + lazy-load CityMap across all 11 city pages.
//
// Heading changes (per WCAG / SEO best practice):
//   h1  City name in hero          → stays h1
//   h3  Entry names (list+grid)    → h2
//   h3  Newsletter section title   → h2
//   h4  "Explore other cities"     → h3
//
// Lazy-load change:
//   static: import CityMap from "./src/CityMap.jsx"
//   lazy:   const CityMap = lazy(() => import("./src/CityMap.jsx"))
//   + add Suspense wrapper around <CityMap … />
//
// Run once: node scripts/fix-headings-lazymap.mjs
// Idempotent — subsequent runs are safe (already-changed lines are no-ops).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CITY_PAGES = [
  "austin-city-page.jsx",
  "new-york-city-page.jsx",
  "nashville-city-page.jsx",
  "chicago-city-page.jsx",
  "los-angeles-city-page.jsx",
  "seattle-city-page.jsx",
  "san-francisco-city-page.jsx",
  "miami-city-page.jsx",
  "portland-city-page.jsx",
  "denver-city-page.jsx",
  "las-vegas-city-page.jsx",
];

function patchFile(filePath) {
  let code = fs.readFileSync(filePath, "utf8");
  const original = code;

  // ── 1. Heading hierarchy ──────────────────────────────────────────────────
  // All h3 in city pages (entry names + newsletter) → h2.
  // All h4 in city pages (city cards in footer)    → h3.
  // The only h1 is the city name; there are no intended h3 or h4 elements.

  code = code.replaceAll("<h3 ", "<h2 ");
  code = code.replaceAll("</h3>", "</h2>");
  code = code.replaceAll("<h4 ", "<h3 ");
  code = code.replaceAll("</h4>", "</h3>");

  // ── 2. React import: add lazy + Suspense ─────────────────────────────────
  // Match the existing named-import line and append if not already present.
  if (!code.includes("lazy,") && !code.includes(", lazy")) {
    code = code.replace(
      /import \{ ([^}]+) \} from "react";/,
      (_, imports) => {
        const list = imports.split(",").map((s) => s.trim());
        if (!list.includes("lazy")) list.push("lazy");
        if (!list.includes("Suspense")) list.push("Suspense");
        return `import { ${list.join(", ")} } from "react";`;
      }
    );
  }

  // ── 3. CityMap: static import → lazy ─────────────────────────────────────
  code = code.replace(
    /import CityMap from "\.\/src\/CityMap\.jsx";/,
    `const CityMap = lazy(() => import("./src/CityMap.jsx"));`
  );

  // ── 4. Wrap <CityMap … /> in <Suspense> ──────────────────────────────────
  // Pattern: <CityMap entries={ENTRIES} locations={CITY_LOCATIONS} cityName="…" />
  // Not already wrapped (guard against double-wrapping on re-run).
  if (!code.includes("<Suspense")) {
    code = code.replace(
      /(\s*)(<CityMap entries=\{ENTRIES\} locations=\{CITY_LOCATIONS\} cityName="[^"]*" \/>)/g,
      (_, indent, tag) =>
        `${indent}<Suspense fallback={<div style={{ height: 400, background: "#e5e7eb", borderRadius: 12 }} />}>\n${indent}  ${tag}\n${indent}</Suspense>`
    );
  }

  if (code === original) {
    console.log(`  — ${path.basename(filePath)} (no changes needed)`);
    return;
  }

  fs.writeFileSync(filePath, code);
  console.log(`  ✓ ${path.basename(filePath)}`);
}

console.log("Fixing heading hierarchy + lazy CityMap…\n");
for (const filename of CITY_PAGES) {
  const filePath = path.join(ROOT, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ ${filename} — not found, skipping`);
    continue;
  }
  patchFile(filePath);
}

console.log("\n✅  Done. Review changes, then build + commit.");
