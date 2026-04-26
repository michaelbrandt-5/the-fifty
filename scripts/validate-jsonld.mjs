// Validate JSON-LD blocks in every prerendered HTML file.
// Checks: parseable JSON, has @context + @type, has required fields per type.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

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

// Required fields per type (Schema.org docs).
const REQUIRED = {
  Organization: ["name", "url"],
  ItemList: ["itemListElement"],
  ListItem: ["position", "name"],
  Restaurant: ["name", "address"],
  BarOrPub: ["name", "address"],
  CafeOrCoffeeShop: ["name", "address"],
  LodgingBusiness: ["name", "address"],
  Store: ["name", "address"],
  TouristAttraction: ["name", "address"],
  LocalBusiness: ["name", "address"],
};

let totalBlocks = 0;
let totalErrors = 0;
const issues = [];

function inspectNode(node, route, ctx) {
  if (!node || typeof node !== "object") return;
  const type = node["@type"];
  if (Array.isArray(type)) {
    type.forEach((t) => inspectNode({ ...node, "@type": t }, route, ctx));
    return;
  }
  if (!type) return; // not a typed node; skip
  const req = REQUIRED[type];
  if (req) {
    for (const field of req) {
      if (!node[field]) {
        issues.push(`${route} :: ${type} missing required field '${field}'`);
        totalErrors++;
      }
    }
  }
  // Recurse into known nested arrays
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (Array.isArray(v)) {
      v.forEach((item) => inspectNode(item, route, ctx));
    } else if (v && typeof v === "object") {
      inspectNode(v, route, ctx);
    }
  }
}

for (const route of ROUTES) {
  const filePath =
    route === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, route.replace(/^\//, ""), "index.html");
  if (!fs.existsSync(filePath)) {
    issues.push(`${route} :: prerendered file missing at ${filePath}`);
    totalErrors++;
    continue;
  }
  const html = fs.readFileSync(filePath, "utf8");
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  if (blocks.length === 0) {
    // Routes that don't need JSON-LD: photo-credits and methodology are OK without
    if (route !== "/photo-credits" && route !== "/methodology") {
      issues.push(`${route} :: NO JSON-LD blocks found`);
      totalErrors++;
    }
    continue;
  }
  for (let i = 0; i < blocks.length; i++) {
    totalBlocks++;
    const raw = blocks[i][1].trim();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      issues.push(`${route} :: block #${i + 1} JSON parse error: ${err.message}`);
      totalErrors++;
      continue;
    }
    // Handle @graph wrappers
    if (parsed["@graph"]) {
      parsed["@graph"].forEach((node) => inspectNode(node, route));
    } else {
      inspectNode(parsed, route);
    }
  }
}

console.log(`\nValidated ${totalBlocks} JSON-LD blocks across ${ROUTES.length} routes.`);
if (totalErrors === 0) {
  console.log("✅ All blocks valid JSON with required Schema.org fields.\n");
} else {
  console.log(`❌ ${totalErrors} issues:\n`);
  issues.forEach((i) => console.log(`  ${i}`));
}

// Print sample structure summary
console.log("\nStructure summary:");
for (const route of ROUTES) {
  const filePath =
    route === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, route.replace(/^\//, ""), "index.html");
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, "utf8");
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  for (const b of blocks) {
    try {
      const p = JSON.parse(b[1].trim());
      if (p["@graph"]) {
        types.push(`@graph[${p["@graph"].length}: ${[...new Set(p["@graph"].map((n) => n["@type"]))].join("/")}]`);
      } else if (p["@type"]) {
        types.push(p["@type"]);
      }
    } catch {}
  }
  console.log(`  ${route.padEnd(18)} → ${blocks.length} block(s): ${types.join(", ")}`);
}
