// Convert all public/images/**/*.jpg → WebP at 800px max-width.
// Deletes the originals after conversion. Updates photos.json and the homepage
// CITIES array so all src references point to .webp files.
//
// Run once:  node scripts/convert-images.mjs
// Safe to re-run — skips files that are already .webp.

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const PHOTOS_JSON = path.join(ROOT, "src", "photos.json");
const HOMEPAGE = path.join(ROOT, "the-fifty-homepage.jsx");

// ─── Convert one JPG file ────────────────────────────────────────────────────

async function convertFile(jpgPath) {
  const webpPath = jpgPath.replace(/\.(jpg|jpeg)$/i, ".webp");
  if (fs.existsSync(webpPath)) {
    fs.unlinkSync(jpgPath); // already converted — just remove the stale JPG
    return;
  }
  await sharp(jpgPath)
    .resize(800, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(webpPath);
  fs.unlinkSync(jpgPath);
}

// ─── Walk a directory and convert in parallel ────────────────────────────────

async function convertDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const promises = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await convertDir(fullPath);
    } else if (/\.(jpg|jpeg)$/i.test(entry.name)) {
      promises.push(
        convertFile(fullPath)
          .then(() => process.stdout.write("."))
          .catch((err) => console.error(`\n  ✗ ${fullPath}: ${err.message}`))
      );
    }
  }
  await Promise.all(promises);
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log("Converting images to 800px WebP (q=82)…");
await convertDir(IMAGES_DIR);
console.log(" done.\n");

// Update photos.json (entry card images)
console.log("Patching photos.json…");
const photos = JSON.parse(fs.readFileSync(PHOTOS_JSON, "utf8"));
let photoCount = 0;
for (const city of Object.values(photos)) {
  for (const photo of Object.values(city)) {
    if (photo.src && /\.jpe?g$/i.test(photo.src)) {
      photo.src = photo.src.replace(/\.jpe?g$/i, ".webp");
      photoCount++;
    }
  }
}
fs.writeFileSync(PHOTOS_JSON, JSON.stringify(photos, null, 2) + "\n");
console.log(`  ✓ ${photoCount} src paths updated (.jpg → .webp)\n`);

// Update homepage CITIES array (/images/cities/*.jpg → .webp)
console.log("Patching the-fifty-homepage.jsx…");
let homepage = fs.readFileSync(HOMEPAGE, "utf8");
const hpBefore = homepage;
homepage = homepage.replace(/\/images\/cities\/([^"]+)\.jpg/g, "/images/cities/$1.webp");
const hpChanges = (hpBefore.match(/\/images\/cities\/[^"]+\.jpg/g) || []).length;
fs.writeFileSync(HOMEPAGE, homepage);
console.log(`  ✓ ${hpChanges} city card image references updated\n`);

console.log("✅  All done. Commit public/images/, src/photos.json, and the-fifty-homepage.jsx.");
