// Patch all 11 city pages for deep-URL support:
//   1. Add `export` to `const ENTRIES`
//   2. Insert `const CITY_SLUG = "…"` right above the ENTRIES declaration
//   3. Add `import { toEntrySlug } from "./src/utils/slug.js";` to imports
//   4. Wrap entry names (h2) in <a> links to the deep URL
//      – ListEntry  (fontSize 22)
//      – GridEntry  (fontSize 19)
//
// Run once: node scripts/patch-city-pages.mjs
// Idempotent — already-patched files produce no further changes.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  { file: "austin-city-page.jsx",       slug: "austin" },
  { file: "new-york-city-page.jsx",      slug: "new-york" },
  { file: "nashville-city-page.jsx",     slug: "nashville" },
  { file: "chicago-city-page.jsx",       slug: "chicago" },
  { file: "los-angeles-city-page.jsx",   slug: "los-angeles" },
  { file: "seattle-city-page.jsx",       slug: "seattle" },
  { file: "san-francisco-city-page.jsx", slug: "san-francisco" },
  { file: "miami-city-page.jsx",         slug: "miami" },
  { file: "portland-city-page.jsx",      slug: "portland" },
  { file: "denver-city-page.jsx",        slug: "denver" },
  { file: "las-vegas-city-page.jsx",     slug: "las-vegas" },
];

function patch(filePath, slug) {
  let code = fs.readFileSync(filePath, "utf8");
  const orig = code;

  // ── 1. Export ENTRIES ───────────────────────────────────────────────────
  code = code.replace(/^(const ENTRIES\s*=)/m, "export $1");

  // ── 2. Insert CITY_SLUG constant before ENTRIES (guard against re-run) ─
  if (!code.includes("const CITY_SLUG")) {
    code = code.replace(
      /^(export const ENTRIES\s*=)/m,
      `const CITY_SLUG = "${slug}";\n\n$1`
    );
  }

  // ── 3. Add toEntrySlug import (after the last existing import line) ────
  if (!code.includes("toEntrySlug")) {
    code = code.replace(
      /(import PHOTOS from "\.\/src\/photos\.json";)/,
      `$1\nimport { toEntrySlug } from "./src/utils/slug.js";`
    );
  }

  // ── 4a. Link entry name in ListEntry (h2 fontSize 22) ──────────────────
  // The h2 currently contains just `{entry.name}`.  Wrap it in an <a>.
  const listH2Open = `<h2 style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>`;
  const listH2Linked = `<h2 style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>
            <a href={\`/\${CITY_SLUG}/\${toEntrySlug(entry.name)}\`} style={{ color: "inherit", textDecoration: "none" }}>`;
  // Only patch if not already linked
  if (code.includes(listH2Open) && !code.includes(listH2Linked)) {
    code = code.replace(
      new RegExp(
        escRe(listH2Open) +
          /\s*\{entry\.name\}\s*<\/h2>/.source,
        "g"
      ),
      listH2Linked + "\n              {entry.name}\n            </a>\n          </h2>"
    );
  }

  // ── 4b. Link entry name in GridEntry (h2 fontSize 19) ──────────────────
  const gridH2Open = `<h2 style={{ fontFamily: "'Georgia', serif", fontSize: 19, fontWeight: 400, color: "#1a1a1a", margin: "0 0 10px", lineHeight: 1.25 }}>`;
  const gridH2Linked = `<h2 style={{ fontFamily: "'Georgia', serif", fontSize: 19, fontWeight: 400, color: "#1a1a1a", margin: "0 0 10px", lineHeight: 1.25 }}>
          <a href={\`/\${CITY_SLUG}/\${toEntrySlug(entry.name)}\`} style={{ color: "inherit", textDecoration: "none" }}>`;
  if (code.includes(gridH2Open) && !code.includes(gridH2Linked)) {
    code = code.replace(
      new RegExp(
        escRe(gridH2Open) +
          /\s*\{entry\.name\}\s*<\/h2>/.source,
        "g"
      ),
      gridH2Linked + "\n            {entry.name}\n          </a>\n        </h2>"
    );
  }

  if (code === orig) {
    console.log(`  — ${path.basename(filePath)}  (no changes)`);
    return;
  }
  fs.writeFileSync(filePath, code);
  console.log(`  ✓ ${path.basename(filePath)}`);
}

// Escape string for use as a regex literal
function escRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

console.log("Patching city pages for deep-URL support…\n");
for (const { file, slug } of PAGES) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) {
    console.warn(`  ⚠ ${file} — not found`);
    continue;
  }
  patch(fp, slug);
}
console.log("\n✅  Done.");
