// Fetches Google Places photos for each entry in scripts/places-input.json.
// Resumable: skips entries whose image file already exists.
// Usage:
//   node scripts/fetch-photos.mjs                     # all 500
//   node scripts/fetch-photos.mjs --city austin       # just austin
//   node scripts/fetch-photos.mjs --city austin --limit 5
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
const limit = Number(arg("--limit")) || Infinity;
const maxWidth = Number(arg("--max-width")) || 1200;

// --- Load entries ----------------------------------------------------------
let entries = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts", "places-input.json"), "utf8")
);
if (cityFilter) entries = entries.filter((e) => e.city === cityFilter);
entries = entries.slice(0, limit);

console.log(
  `Fetching photos for ${entries.length} entries${
    cityFilter ? ` (city=${cityFilter})` : ""
  } at maxWidth=${maxWidth}px`
);

// --- Load existing manifest (resumable) -----------------------------------
const manifestPath = path.join(ROOT, "src", "photos.json");
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

// --- Main loop -------------------------------------------------------------
const failures = [];
let fetched = 0;
let skipped = 0;
let totalBytes = 0;

for (const entry of entries) {
  const imgDir = path.join(ROOT, "public", "images", entry.city);
  const imgPath = path.join(imgDir, `${entry.id}.jpg`);

  if (fs.existsSync(imgPath)) {
    skipped++;
    continue;
  }
  fs.mkdirSync(imgDir, { recursive: true });

  try {
    // Nudge Google away from matching neighborhood entities etc. by appending
    // a category hint to the text query.
    const categoryHint = {
      Eat: "restaurant",
      Drink: "bar",
      Coffee: "coffee",
      Stay: "hotel",
    }[entry.category];
    const textQuery = categoryHint
      ? `${entry.name} ${categoryHint}, ${entry.cityName}`
      : `${entry.name}, ${entry.cityName}`;

    // 1. Text Search for the place
    const searchRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.photos",
        },
        body: JSON.stringify({
          textQuery,
          maxResultCount: 1,
        }),
      }
    );

    if (!searchRes.ok) {
      const err = await searchRes.text();
      console.error(
        `  ❌ ${entry.city}/${entry.id} "${entry.name}": search HTTP ${searchRes.status} — ${err.slice(0, 180)}`
      );
      failures.push({ ...entry, error: "search_http", status: searchRes.status, detail: err });
      continue;
    }

    const searchData = await searchRes.json();
    const place = searchData.places?.[0];
    if (!place?.photos?.length) {
      console.warn(
        `  ⚠️  ${entry.city}/${entry.id} "${entry.name}": no photos (matched: ${place?.displayName?.text ?? "nothing"})`
      );
      failures.push({
        ...entry,
        error: "no_photos",
        matchedName: place?.displayName?.text ?? null,
      });
      continue;
    }

    // 2. Pick a photo — prefer landscape (cards render landscape).
    // Google returns photos in its own ranked order; we take the first one
    // that meets our quality bar (landscape + decent resolution).
    const MIN_ASPECT = 1.2; // width / height
    const MIN_WIDTH = 1000;
    const candidates = place.photos || [];
    const landscape = candidates.filter(
      (p) => p.widthPx && p.heightPx && p.widthPx / p.heightPx >= MIN_ASPECT && p.widthPx >= MIN_WIDTH
    );
    const photo = landscape[0] || candidates[0];
    const photoPickReason = landscape[0]
      ? `landscape ${photo.widthPx}x${photo.heightPx}`
      : `fallback (no landscape; ${candidates.length} candidates)`;
    const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=${maxWidth}`;
    const photoRes = await fetch(photoUrl, {
      headers: { "X-Goog-Api-Key": API_KEY },
      redirect: "follow",
    });

    if (!photoRes.ok) {
      const err = await photoRes.text();
      console.error(
        `  ❌ ${entry.city}/${entry.id}: photo HTTP ${photoRes.status} — ${err.slice(0, 180)}`
      );
      failures.push({ ...entry, error: "photo_http", status: photoRes.status, detail: err });
      continue;
    }

    const buf = Buffer.from(await photoRes.arrayBuffer());
    fs.writeFileSync(imgPath, buf);
    totalBytes += buf.length;

    // 3. Record manifest entry
    const attr = photo.authorAttributions?.[0] || {};
    manifest[entry.city] = manifest[entry.city] || {};
    manifest[entry.city][entry.id] = {
      src: `/images/${entry.city}/${entry.id}.jpg`,
      credit: attr.displayName || "Google",
      creditUrl: attr.uri || null,
      placeId: place.id,
      matchedName: place.displayName?.text ?? null,
    };

    fetched++;
    const sizeKb = (buf.length / 1024).toFixed(0);
    const matched =
      place.displayName?.text && place.displayName.text !== entry.name
        ? ` [matched: "${place.displayName.text}"]`
        : "";
    console.log(
      `  ✅ ${entry.city}/${entry.id} "${entry.name}" → ${sizeKb}KB · ${photoPickReason} · ${attr.displayName || "?"}${matched}`
    );

    // Persist manifest incrementally (so we don't lose state if interrupted)
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    // Polite throttle
    await new Promise((r) => setTimeout(r, 120));
  } catch (err) {
    console.error(`  ❌ ${entry.city}/${entry.id}: ${err.message}`);
    failures.push({ ...entry, error: "exception", detail: err.message });
  }
}

// --- Write outputs ---------------------------------------------------------
if (failures.length) {
  fs.writeFileSync(
    path.join(ROOT, "scripts", "photo-failures.json"),
    JSON.stringify(failures, null, 2)
  );
}

const manifestCount = Object.values(manifest).reduce(
  (s, c) => s + Object.keys(c).length,
  0
);
const totalMb = (totalBytes / 1024 / 1024).toFixed(1);
console.log(
  `\nDone. Fetched: ${fetched}, skipped (already cached): ${skipped}, failed: ${failures.length}`
);
console.log(
  `This run downloaded ${totalMb}MB. Manifest now: ${manifestCount} photos across ${Object.keys(manifest).length} cities.`
);
if (failures.length) {
  console.log(`Failures written to scripts/photo-failures.json`);
}
