// Extracts id/name/category/neighborhood from each city-page.jsx
// into scripts/places-input.json for the photo fetcher to consume.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CITIES = [
  { slug: "austin",        file: "austin-city-page.jsx",        name: "Austin, Texas" },
  { slug: "new-york",      file: "new-york-city-page.jsx",      name: "New York, NY" },
  { slug: "nashville",     file: "nashville-city-page.jsx",     name: "Nashville, Tennessee" },
  { slug: "chicago",       file: "chicago-city-page.jsx",       name: "Chicago, Illinois" },
  { slug: "los-angeles",   file: "los-angeles-city-page.jsx",   name: "Los Angeles, California" },
  { slug: "seattle",       file: "seattle-city-page.jsx",       name: "Seattle, Washington" },
  { slug: "san-francisco", file: "san-francisco-city-page.jsx", name: "San Francisco, California" },
  { slug: "miami",         file: "miami-city-page.jsx",         name: "Miami, Florida" },
  { slug: "portland",      file: "portland-city-page.jsx",      name: "Portland, Oregon" },
  { slug: "denver",        file: "denver-city-page.jsx",        name: "Denver, Colorado" },
  { slug: "las-vegas",     file: "las-vegas-city-page.jsx",     name: "Las Vegas, Nevada" },
];

// Matches the first four fields of each entry object (always in this order
// in our template). Permissive on whitespace.
const ENTRY_RE =
  /\{\s*id:\s*(\d+),\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*neighborhood:\s*"([^"]+)"/g;

const all = [];
const summary = {};

for (const city of CITIES) {
  const src = fs.readFileSync(path.join(ROOT, city.file), "utf8");
  const entries = [];
  let m;
  ENTRY_RE.lastIndex = 0;
  while ((m = ENTRY_RE.exec(src)) !== null) {
    entries.push({
      city: city.slug,
      cityName: city.name,
      id: Number(m[1]),
      name: m[2],
      category: m[3],
      neighborhood: m[4],
    });
  }
  summary[city.slug] = entries.length;
  all.push(...entries);
}

const out = path.join(ROOT, "scripts", "places-input.json");
fs.writeFileSync(out, JSON.stringify(all, null, 2));

console.log("Extracted entries per city:");
for (const [slug, count] of Object.entries(summary)) {
  const marker = count === 50 ? "✅" : "⚠️ ";
  console.log(`  ${marker} ${slug.padEnd(16)} ${count}`);
}
console.log(`\nTotal: ${all.length} entries → ${path.relative(ROOT, out)}`);
