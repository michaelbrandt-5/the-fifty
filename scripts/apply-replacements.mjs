// Apply entry replacements from scripts/replacements.json to city page JSX files.
// Each replacement updates the entry's name, category, neighborhood, description,
// signature, action, and actionType for a given (city, id) pair.
//
// After running, also clears the entry from src/photos.json and src/locations.json
// so that fetch-photos.mjs and geocode-entries.mjs will re-fetch fresh data.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replacements = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts", "replacements.json"), "utf8")
);

// Escape a string for use inside a double-quoted JS string literal.
function escapeJs(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const filenames = {
  austin: "austin-city-page.jsx",
  "new-york": "new-york-city-page.jsx",
  nashville: "nashville-city-page.jsx",
  chicago: "chicago-city-page.jsx",
  "los-angeles": "los-angeles-city-page.jsx",
  seattle: "seattle-city-page.jsx",
  "san-francisco": "san-francisco-city-page.jsx",
  miami: "miami-city-page.jsx",
  portland: "portland-city-page.jsx",
  denver: "denver-city-page.jsx",
};

// Group by city
const byCity = new Map();
for (const r of replacements) {
  if (!byCity.has(r.city)) byCity.set(r.city, []);
  byCity.get(r.city).push(r);
}

let totalApplied = 0;
let totalNeighborhoodAdds = 0;

for (const [city, items] of byCity) {
  const file = path.join(ROOT, filenames[city]);
  let src = fs.readFileSync(file, "utf8");

  for (const r of items) {
    // Find the entry block by id.
    // Pattern: an entry object that contains `id: <id>,` and the next blank/closing brace.
    // We replace the whole entry from `{` to its matching `},`.
    const idAnchor = `id: ${r.id},`;
    const idIdx = src.indexOf(idAnchor);
    if (idIdx < 0) {
      console.error(`✗ ${city}/${r.id}: id anchor not found`);
      continue;
    }
    // Walk back to the `{` that opens this entry
    let openIdx = src.lastIndexOf("{", idIdx);
    if (openIdx < 0) {
      console.error(`✗ ${city}/${r.id}: opening brace not found`);
      continue;
    }
    // Walk forward to the matching `}`. Brace-count.
    let depth = 0;
    let closeIdx = -1;
    for (let i = openIdx; i < src.length; i++) {
      const c = src[i];
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          closeIdx = i;
          break;
        }
      }
    }
    if (closeIdx < 0) {
      console.error(`✗ ${city}/${r.id}: closing brace not found`);
      continue;
    }

    // Build the new entry preserving inline-style indentation (4 spaces).
    const newEntry = `{
    id: ${r.id},
    name: "${escapeJs(r.name)}",
    category: "${r.category}",
    neighborhood: "${escapeJs(r.neighborhood)}",
    description: "${escapeJs(r.description)}",
    signature: "${escapeJs(r.signature)}",
    action: "${r.action}",
    actionType: "${r.actionType}",
    image: null,
  }`;

    src = src.slice(0, openIdx) + newEntry + src.slice(closeIdx + 1);
    totalApplied++;

    // If the new neighborhood isn't already in the city's NEIGHBORHOODS array, add it.
    const neighborhoodArrayMatch = src.match(/const NEIGHBORHOODS = \[([\s\S]*?)\];/);
    if (neighborhoodArrayMatch) {
      const arrText = neighborhoodArrayMatch[1];
      const arr = [...arrText.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
      if (!arr.includes(r.neighborhood)) {
        const updatedArr = [...arr, r.neighborhood];
        const newArrText = updatedArr.map((n) => `"${n}"`).join(", ");
        src = src.replace(/const NEIGHBORHOODS = \[[\s\S]*?\];/, `const NEIGHBORHOODS = [${newArrText}];`);
        totalNeighborhoodAdds++;
        console.log(`  + Added neighborhood "${r.neighborhood}" to ${city}'s NEIGHBORHOODS`);
      }
    }
    console.log(`  ✓ ${city}/${r.id} → ${r.name}`);
  }

  fs.writeFileSync(file, src);
}

console.log(`\nApplied ${totalApplied} replacements (${totalNeighborhoodAdds} neighborhoods added).`);

// Clear the replaced IDs from photos.json and locations.json so they'll be re-fetched.
const photosPath = path.join(ROOT, "src", "photos.json");
const locsPath = path.join(ROOT, "src", "locations.json");
const photos = JSON.parse(fs.readFileSync(photosPath, "utf8"));
const locs = JSON.parse(fs.readFileSync(locsPath, "utf8"));

let photosCleared = 0;
let locsCleared = 0;
for (const r of replacements) {
  if (photos[r.city]?.[r.id]) {
    delete photos[r.city][r.id];
    photosCleared++;
  }
  if (locs[r.city]?.[r.id]) {
    delete locs[r.city][r.id];
    locsCleared++;
  }
}
fs.writeFileSync(photosPath, JSON.stringify(photos, null, 2));
fs.writeFileSync(locsPath, JSON.stringify(locs, null, 2));
console.log(`Cleared ${photosCleared} photo entries and ${locsCleared} location entries.`);
console.log(`\nNext: run fetch-photos.mjs and geocode-entries.mjs to re-populate.`);
