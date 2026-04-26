// For every entry, look up its Google Place by placeId and check business_status.
// Flags entries that are CLOSED_PERMANENTLY or CLOSED_TEMPORARILY.
// Reads existing placeIds from src/photos.json (no extra geocoding needed).
//
// Cost: ~$0.017 per call × 500 entries ≈ $8.50.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

const PHOTOS = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "photos.json"), "utf8"));

let total = 0;
let operational = 0;
let closed = 0;
let temporarilyClosed = 0;
let unknown = 0;
let errors = 0;

const flagged = [];

async function checkOne(city, id, photo) {
  const placeId = photo.placeId;
  if (!placeId) {
    unknown++;
    return;
  }
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": "id,displayName,businessStatus",
        },
      }
    );
    if (!res.ok) {
      errors++;
      flagged.push(`${city}/${id} ${photo.matchedName}: HTTP ${res.status}`);
      return;
    }
    const data = await res.json();
    const status = data.businessStatus;
    if (status === "OPERATIONAL") {
      operational++;
    } else if (status === "CLOSED_PERMANENTLY") {
      closed++;
      flagged.push(`❌ CLOSED_PERMANENTLY  ${city}/${id} "${photo.matchedName}"`);
    } else if (status === "CLOSED_TEMPORARILY") {
      temporarilyClosed++;
      flagged.push(`⚠️  CLOSED_TEMPORARILY ${city}/${id} "${photo.matchedName}"`);
    } else {
      unknown++;
      flagged.push(`?  ${status || "no status"} ${city}/${id} "${photo.matchedName}"`);
    }
  } catch (err) {
    errors++;
    flagged.push(`${city}/${id} ${photo.matchedName}: ${err.message}`);
  }
}

const queue = [];
for (const city of Object.keys(PHOTOS)) {
  for (const id of Object.keys(PHOTOS[city])) {
    queue.push({ city, id, photo: PHOTOS[city][id] });
  }
}

console.log(`Checking business_status for ${queue.length} entries…\n`);

// Process with light concurrency (5 at a time) to be polite to the API.
const CONCURRENCY = 5;
let cursor = 0;
async function worker() {
  while (cursor < queue.length) {
    const job = queue[cursor++];
    total++;
    await checkOne(job.city, job.id, job.photo);
    if (total % 50 === 0) {
      process.stdout.write(`  …${total}/${queue.length}\n`);
    }
  }
}
await Promise.all(Array(CONCURRENCY).fill(0).map(worker));

console.log(`\n=== Summary ===`);
console.log(`  Total checked:        ${total}`);
console.log(`  ✅ OPERATIONAL:        ${operational}`);
console.log(`  ❌ CLOSED_PERMANENTLY: ${closed}`);
console.log(`  ⚠️  CLOSED_TEMPORARILY: ${temporarilyClosed}`);
console.log(`  ?  Unknown/missing:   ${unknown}`);
console.log(`  ⚠  Errors:            ${errors}`);

if (flagged.length > 0) {
  console.log(`\n=== Flagged (${flagged.length}) ===`);
  flagged.forEach((f) => console.log(`  ${f}`));
} else {
  console.log(`\n🎉 All ${operational} entries are OPERATIONAL.`);
}
