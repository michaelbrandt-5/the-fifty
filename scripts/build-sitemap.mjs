// Generate dist/sitemap.xml with today's date as lastmod for every URL.
// Run after vite build, before prerender (or after — doesn't matter, prerender writes HTML, not sitemap).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getEntryRoutes } from "./get-entry-routes.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const today = new Date().toISOString().split("T")[0];

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/austin", priority: 0.9, changefreq: "monthly" },
  { path: "/new-york", priority: 0.9, changefreq: "monthly" },
  { path: "/nashville", priority: 0.9, changefreq: "monthly" },
  { path: "/chicago", priority: 0.9, changefreq: "monthly" },
  { path: "/los-angeles", priority: 0.9, changefreq: "monthly" },
  { path: "/seattle", priority: 0.9, changefreq: "monthly" },
  { path: "/san-francisco", priority: 0.9, changefreq: "monthly" },
  { path: "/miami", priority: 0.9, changefreq: "monthly" },
  { path: "/portland", priority: 0.9, changefreq: "monthly" },
  { path: "/denver", priority: 0.9, changefreq: "monthly" },
  { path: "/las-vegas", priority: 0.9, changefreq: "monthly" },
  { path: "/methodology", priority: 0.7, changefreq: "monthly" },
  { path: "/about", priority: 0.6, changefreq: "monthly" },
  { path: "/photo-credits", priority: 0.3, changefreq: "monthly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
];

// Add all 550 entry deep-URL routes
const entryRoutes = getEntryRoutes().map((p) => ({
  path: p,
  priority: 0.8,
  changefreq: "monthly",
}));

const ROUTES = [...STATIC_ROUTES, ...entryRoutes];

const BASE = "https://thefiftylist.com";

const urls = ROUTES.map(
  (r) =>
    `  <url>\n    <loc>${BASE}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`
).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

// Write to both public/ (committed source) and dist/ (built output) if it exists.
fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), xml);
const distSitemap = path.join(ROOT, "dist", "sitemap.xml");
if (fs.existsSync(path.dirname(distSitemap))) {
  fs.writeFileSync(distSitemap, xml);
}

console.log(`✅ sitemap.xml regenerated with lastmod=${today} (${STATIC_ROUTES.length} static + ${entryRoutes.length} entry URLs = ${ROUTES.length} total)`);
