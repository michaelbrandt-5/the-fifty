// Geocodes each entry using Google Places Text Search to get lat/lng.
// Outputs src/locations.json: { [city]: { [id]: { lat, lng } } }
// Resumable: skips entries already in the output file.
// Usage:
//   node scripts/geocode-entries.mjs                   # all cities
//   node scripts/geocode-entries.mjs --city austin      # just austin
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// --- Load .env -------------------------------------------------------------
const env = {};
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
}
const API_KEY = env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY in .env");
  process.exit(1);
}

// --- Parse args ------------------------------------------------------------
const args = process.argv.slice(2);
function arg(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}
const cityFilter = arg("--city");

// --- Load entries ----------------------------------------------------------
let entries = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts", "places-input.json"), "utf8")
);
if (cityFilter) entries = entries.filter((e) => e.city === cityFilter);

console.log(`Geocoding ${entries.length} entries${cityFilter ? ` (city=${cityFilter})` : ""}`);

// --- Load existing locations (resumable) -----------------------------------
const locPath = path.join(ROOT, "src", "locations.json");
const locations = fs.existsSync(locPath)
  ? JSON.parse(fs.readFileSync(locPath, "utf8"))
  : {};

// --- Category hints (same as fetch-photos) ---------------------------------
const categoryHint = {
  Eat: "restaurant",
  Drink: "bar",
  Coffee: "coffee",
  Stay: "hotel",
};

// --- Main loop -------------------------------------------------------------
let fetched = 0;
let skipped = 0;
let failed = 0;

for (const entry of entries) {
  // Skip if already geocoded
  if (locations[entry.city]?.[entry.id]) {
    skipped++;
    continue;
  }

  const hint = categoryHint[entry.category];
  const textQuery = hint
    ? `${entry.name} ${hint}, ${entry.cityName}`
    : `${entry.name}, ${entry.cityName}`;

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": "places.location,places.displayName",
        },
        body: JSON.stringify({ textQuery, maxResultCount: 1 }),
      }
    );

    if (!res.ok) {
      console.error(`  ❌ ${entry.city}/${entry.id} "${entry.name}": HTTP ${res.status}`);
      failed++;
      continue;
    }

    const data = await res.json();
    const place = data.places?.[0];
    if (!place?.location) {
      console.warn(`  ⚠️  ${entry.city}/${entry.id} "${entry.name}": no location`);
      failed++;
      continue;
    }

    locations[entry.city] = locations[entry.city] || {};
    locations[entry.city][entry.id] = {
      lat: place.location.latitude,
      lng: place.location.longitude,
    };

    const matched = place.displayName?.text || "?";
    console.log(
      `  ✅ ${entry.city}/${entry.id} "${entry.name}" → ${place.location.latitude.toFixed(4)}, ${place.location.longitude.toFixed(4)} [${matched}]`
    );
    fetched++;

    // Save incrementally
    fs.writeFileSync(locPath, JSON.stringify(locations, null, 2));

    // Throttle
    await new Promise((r) => setTimeout(r, 80));
  } catch (err) {
    console.error(`  ❌ ${entry.city}/${entry.id}: ${err.message}`);
    failed++;
  }
}

const totalEntries = Object.values(locations).reduce(
  (s, c) => s + Object.keys(c).length,
  0
);
console.log(`\nDone. Fetched: ${fetched}, skipped: ${skipped}, failed: ${failed}`);
console.log(`Locations now: ${totalEntries} entries across ${Object.keys(locations).length} cities.`);
