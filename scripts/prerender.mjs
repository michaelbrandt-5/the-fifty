// Custom prerender — works both locally and on Vercel's build sandbox.
//
// Locally: uses regular `puppeteer` (which bundles its own Chromium).
// On Vercel: uses `puppeteer-core` + `@sparticuz/chromium-min`. Vercel's
// build sandbox is missing the system libs (libnspr4 etc.) that bundled
// Chromium needs; @sparticuz/chromium ships a Chromium build that has them.

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

// Vercel sets VERCEL=1 in the build environment.
const IS_VERCEL = !!process.env.VERCEL;

// Pinned to match @sparticuz/chromium-min major version (147.0.2 at time of writing).
const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v147.0.2/chromium-v147.0.2-pack.x64.tar";

async function getBrowser() {
  if (IS_VERCEL) {
    const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
      import("@sparticuz/chromium-min"),
      import("puppeteer-core"),
    ]);
    return puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: chromium.headless,
    });
  }
  const { default: puppeteer } = await import("puppeteer");
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const PORT = 4173;
const ORIGIN = `http://localhost:${PORT}`;

const ROUTES = [
  "/",
  "/methodology",
  "/photo-credits",
  "/austin",
  "/new-york",
  "/nashville",
  "/chicago",
  "/los-angeles",
  "/seattle",
  "/san-francisco",
  "/miami",
  "/portland",
  "/denver",
];

// Static server — serves files from dist/. For any HTML route (/, /austin, etc.)
// it returns the ORIGINAL pre-prerender SPA shell, never any HTML we may have
// written during this prerender pass. This prevents stale Helmet tags from a
// previously-snapshotted route from contaminating the next snapshot.
function startServer(spaShell) {
  const mime = {
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webmanifest": "application/manifest+json",
    ".xml": "application/xml",
    ".txt": "text/plain; charset=utf-8",
  };
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const ext = path.extname(urlPath).toLowerCase();

    // For any route without a file extension (or .html), serve the SPA shell.
    if (!ext || ext === ".html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(spaShell);
      return;
    }

    // Otherwise serve the file from disk.
    const filePath = path.join(DIST, urlPath);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end();
      return;
    }
    const type = mime[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function snapshotRoute(browser, route) {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (compatible; PrerenderBot/1.0; +https://thefiftylist.com)"
  );
  await page.setViewport({ width: 1280, height: 1024 });

  const url = `${ORIGIN}${route}`;

  // Listen for the 'render-event' our app dispatches once React+Helmet have flushed.
  const renderEvent = page.evaluateOnNewDocument(() => {
    window.__RENDER_EVENT_FIRED__ = false;
    document.addEventListener("render-event", () => {
      window.__RENDER_EVENT_FIRED__ = true;
    });
  });

  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

  // Wait for our render event (or 8s timeout)
  await page
    .waitForFunction(() => window.__RENDER_EVENT_FIRED__ === true, {
      timeout: 8000,
    })
    .catch(() => {
      console.warn(`  ⚠️  ${route}: render-event timeout — using current DOM`);
    });

  const html = await page.content();
  await page.close();
  return dedupeHeadTags(html);
}

// Helmet (and our index.html fallbacks) can leave duplicate head tags after a
// puppeteer snapshot. Keep only the FIRST occurrence of each unique tag —
// react-helmet-async writes its tags before any defaults that our shell preserves.
function dedupeHeadTags(html) {
  const headStart = html.indexOf("<head>");
  const headEnd = html.indexOf("</head>");
  if (headStart < 0 || headEnd < 0) return html;
  const before = html.slice(0, headStart + 6);
  let head = html.slice(headStart + 6, headEnd);
  const after = html.slice(headEnd);

  // Strip HTML comments from the head before any regex matching — comments
  // can contain literal `<title>` etc. that confuses our deduper.
  head = head.replace(/<!--[\s\S]*?-->/g, "");

  // Keep the FIRST <title>
  const titleRe = /<title[^>]*>[\s\S]*?<\/title>/gi;
  const titles = [...head.matchAll(titleRe)];
  if (titles.length > 1) {
    const first = titles[0][0];
    head = head.replace(titleRe, "");
    head = first + "\n  " + head;
  }

  // Dedupe meta/link tags by their identifying attribute — keep the first one.
  const dedupeBy = (regex) => {
    const matches = [...head.matchAll(regex)];
    if (matches.length === 0) return;
    const seen = new Map();
    for (const m of matches) {
      const id = m[1];
      if (!seen.has(id)) seen.set(id, m[0]); // first wins
    }
    if (matches.length > seen.size) {
      head = head.replace(regex, "");
      const kept = [...seen.values()].join("\n  ");
      head = kept + "\n  " + head;
    }
  };

  dedupeBy(/<meta name="(description|twitter:[^"]+)"[^>]*>/gi);
  dedupeBy(/<meta property="(og:[^"]+)"[^>]*>/gi);
  dedupeBy(/<link rel="(canonical)"[^>]*>/gi);

  return before + head + after;
}

async function main() {
  const shellPath = path.join(DIST, "index.html");
  if (!fs.existsSync(shellPath)) {
    console.error("dist/index.html not found. Run `vite build` first.");
    process.exit(1);
  }

  // Capture the SPA shell ONCE before we start writing prerendered output.
  // The server returns this for every HTML route — guarantees each route's
  // snapshot starts from a clean shell with no stale Helmet tags.
  const spaShell = fs.readFileSync(shellPath, "utf8");

  const server = await startServer(spaShell);
  console.log(`Static server listening on ${ORIGIN} (env: ${IS_VERCEL ? "vercel" : "local"})`);

  const browser = await getBrowser();

  let succeeded = 0;
  let failed = 0;
  for (const route of ROUTES) {
    try {
      const html = await snapshotRoute(browser, route);
      const outDir =
        route === "/" ? DIST : path.join(DIST, route.replace(/^\//, ""));
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, "index.html");
      fs.writeFileSync(outPath, html);
      const sizeKb = (Buffer.byteLength(html) / 1024).toFixed(1);
      console.log(`  ✓ ${route.padEnd(20)} → ${path.relative(ROOT, outPath)}  (${sizeKb} KB)`);
      succeeded++;
    } catch (err) {
      console.error(`  ✗ ${route}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPrerender complete. ${succeeded} succeeded, ${failed} failed.`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
