// Generate favicon set: favicon.ico, apple-touch-icon.png, icon-{192,512}.png, favicon.svg
// Uses @resvg/resvg-js for rasterization and sharp for ICO assembly.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public");

const CREAM = "#F7F4EE";
const TEXT = "#1A1A1A";
const GOLD = "#B8864E";

// Square favicon: just "50•" — clean, recognizable, even at 16x16.
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="${TEXT}"/>
  <text x="50%" y="63%" text-anchor="middle"
        font-family="Playfair Display, Georgia, serif"
        font-size="36" font-weight="700"
        fill="${CREAM}">50</text>
  <circle cx="48" cy="22" r="4" fill="${GOLD}"/>
</svg>`;

const appleSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="32" fill="${TEXT}"/>
  <text x="50%" y="60%" text-anchor="middle"
        font-family="Playfair Display, Georgia, serif"
        font-size="100" font-weight="700"
        fill="${CREAM}">50</text>
  <circle cx="135" cy="62" r="10" fill="${GOLD}"/>
</svg>`;

async function rasterize(svg, size) {
  const r = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    font: { loadSystemFonts: true },
    background: "rgba(0,0,0,0)",
  });
  return r.render().asPng();
}

async function main() {
  // Modern SVG favicon (browsers that support it)
  fs.writeFileSync(path.join(OUT, "favicon.svg"), faviconSvg);
  console.log("  ✓ /public/favicon.svg");

  // PNG icons for various sizes
  const png16 = await rasterize(faviconSvg, 16);
  const png32 = await rasterize(faviconSvg, 32);
  const png48 = await rasterize(faviconSvg, 48);
  const png192 = await rasterize(faviconSvg, 192);
  const png512 = await rasterize(faviconSvg, 512);

  fs.writeFileSync(path.join(OUT, "icon-192.png"), png192);
  fs.writeFileSync(path.join(OUT, "icon-512.png"), png512);
  console.log("  ✓ /public/icon-192.png");
  console.log("  ✓ /public/icon-512.png");

  // Apple touch icon (180x180, no rounded corners — iOS adds them)
  const appleRaw = await rasterize(appleSvg, 180);
  fs.writeFileSync(path.join(OUT, "apple-touch-icon.png"), appleRaw);
  console.log("  ✓ /public/apple-touch-icon.png");

  // favicon.ico — sharp will write a multi-size .ico when given an array of buffers,
  // but simpler & widely-supported: just a 32x32 PNG inside an ICO container. Sharp
  // doesn't natively write ICO; we build it manually.
  // ICO format: 6-byte header, 16-byte directory entry per image, then PNG data.
  function buildIco(pngBuffers) {
    // pngBuffers: [{ buf, size }]
    const count = pngBuffers.length;
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type: 1 = ICO
    header.writeUInt16LE(count, 4); // count

    const entries = [];
    let offset = 6 + 16 * count;
    for (const { buf, size } of pngBuffers) {
      const e = Buffer.alloc(16);
      e.writeUInt8(size === 256 ? 0 : size, 0); // width (0 = 256)
      e.writeUInt8(size === 256 ? 0 : size, 1); // height
      e.writeUInt8(0, 2); // color palette
      e.writeUInt8(0, 3); // reserved
      e.writeUInt16LE(1, 4); // color planes
      e.writeUInt16LE(32, 6); // bpp
      e.writeUInt32LE(buf.length, 8); // size of bitmap data
      e.writeUInt32LE(offset, 12); // offset
      entries.push(e);
      offset += buf.length;
    }
    return Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.buf)]);
  }

  const ico = buildIco([
    { buf: png16, size: 16 },
    { buf: png32, size: 32 },
    { buf: png48, size: 48 },
  ]);
  fs.writeFileSync(path.join(OUT, "favicon.ico"), ico);
  console.log("  ✓ /public/favicon.ico (16/32/48 multi-res)");

  // Web manifest
  const manifest = {
    name: "The Fifty",
    short_name: "The Fifty",
    description: "Hand-picked 50-place guides to America's best cities.",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#1A1A1A",
    background_color: "#F7F4EE",
    display: "standalone",
    start_url: "/",
  };
  fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify(manifest, null, 2));
  console.log("  ✓ /public/site.webmanifest");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
