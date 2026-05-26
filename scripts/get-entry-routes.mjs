// Returns all /:citySlug/:entrySlug route paths for use by build-sitemap.mjs
// and prerender.mjs.  Extracts entry names from city-page source files via
// regex — no JSX transpiler needed in a Node build script.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CITIES = [
  "austin",
  "new-york",
  "nashville",
  "chicago",
  "los-angeles",
  "seattle",
  "san-francisco",
  "miami",
  "portland",
  "denver",
  "las-vegas",
];

function toEntrySlug(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getEntryRoutes() {
  const routes = [];
  for (const citySlug of CITIES) {
    const filePath = path.join(ROOT, `${citySlug}-city-page.jsx`);
    if (!fs.existsSync(filePath)) continue;
    const src = fs.readFileSync(filePath, "utf8");
    // Match every `  name: "…",` line inside the ENTRIES array
    const names = [...src.matchAll(/^\s+name:\s+"([^"]+)",?\s*$/gm)].map(
      (m) => m[1]
    );
    for (const name of names) {
      routes.push(`/${citySlug}/${toEntrySlug(name)}`);
    }
  }
  return routes;
}
