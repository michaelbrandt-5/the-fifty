// Lightweight spell + grammar pass.
// Extracts user-facing text from .jsx files (descriptions, signatures, taglines)
// and runs it through a curated list of common typos/grammar issues.
//
// Output: a list of file/line/snippet results for human review. Does NOT auto-edit.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Common typos and stylistic issues to flag.
// Keep these conservative — we want true positives, not noise.
const PATTERNS = [
  // Common misspellings
  { regex: /\bteh\b/gi, hint: "teh → the" },
  { regex: /\brecieve/gi, hint: "recieve → receive" },
  { regex: /\bseperate/gi, hint: "seperate → separate" },
  { regex: /\boccured\b/gi, hint: "occured → occurred" },
  { regex: /\bdefinately\b/gi, hint: "definately → definitely" },
  { regex: /\baccomodat/gi, hint: "accomodat* → accommodat*" },
  { regex: /\bgaurantee/gi, hint: "gaurantee → guarantee" },
  { regex: /\boccassion/gi, hint: "occassion → occasion" },
  { regex: /\bpriviledge/gi, hint: "priviledge → privilege" },
  { regex: /\bcalender\b/gi, hint: "calender → calendar (unless software)" },
  { regex: /\bjudgement\b/gi, hint: "judgement → judgment (US)" },
  { regex: /\btravelling\b/gi, hint: "travelling → traveling (US)" },
  { regex: /\bcancelled\b/gi, hint: "cancelled → canceled (US)" },
  { regex: /\bgrey\b/gi, hint: "grey → gray (US)" },
  // Grammar / spacing / punctuation issues
  { regex: / {2,}/g, hint: "double space" },
  { regex: /\.\./g, hint: "double period (..) — use ellipsis '…'" },
  { regex: /[a-zA-Z],[a-zA-Z]/g, hint: "missing space after comma" },
  { regex: /[a-zA-Z]\.\s+[a-z]/g, hint: "lowercase after period (sentence start?)" },
  { regex: /\s+,/g, hint: "space before comma" },
  { regex: /\s+\./g, hint: "space before period" },
  // Style: "alot" / "a lot"
  { regex: /\balot\b/gi, hint: "alot → a lot" },
  { regex: /\beachother\b/gi, hint: "eachother → each other" },
  { regex: /\bevery one\b/gi, hint: "every one → everyone (usually)" },
  // Tense / phrasing
  { regex: /\bcould of\b/gi, hint: "could of → could have" },
  { regex: /\bshould of\b/gi, hint: "should of → should have" },
  { regex: /\bwould of\b/gi, hint: "would of → would have" },
  // Quotes — flag straight quotes inside descriptions (we have curly elsewhere)
  // (Skipped — straight quotes are fine in JSX strings)
];

// Files to scan
const FILES = [
  "the-fifty-homepage.jsx",
  "methodology-page.jsx",
  "austin-city-page.jsx",
  "new-york-city-page.jsx",
  "nashville-city-page.jsx",
  "chicago-city-page.jsx",
  "los-angeles-city-page.jsx",
  "seattle-city-page.jsx",
  "san-francisco-city-page.jsx",
  "miami-city-page.jsx",
  "portland-city-page.jsx",
  "denver-city-page.jsx",
];

// Extract human-facing strings from descriptions/signatures/taglines (skip JSX attributes & code).
// We include any string literal inside `description: "..."`, `signature: "..."`, `tagline: "..."`,
// `body: "..."`, `title: "..."`, etc. plus all top-level paragraph-like JSX text content.
function extractCandidateLines(src, filename) {
  const lines = src.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match string literal assigned to a content-like property
    // e.g.   description: "Some text...",
    const propMatch = line.match(/^\s*(description|signature|tagline|body|title|name|intro|paragraph|text):\s*"([^"\\]+(?:\\.[^"\\]*)*)"/);
    if (propMatch) {
      out.push({ line: i + 1, text: propMatch[2], file: filename });
      continue;
    }
    // Match JSX text content between tags: >some text content here<
    // Only keep lines that are obviously prose (>=3 words and start with capital or quote)
    const jsxMatch = line.match(/>\s*([A-Z'"][^<>{}]{20,})\s*</);
    if (jsxMatch) {
      out.push({ line: i + 1, text: jsxMatch[1].trim(), file: filename });
    }
  }
  return out;
}

const findings = [];
let totalLines = 0;

for (const file of FILES) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) continue;
  const src = fs.readFileSync(filePath, "utf8");
  const candidates = extractCandidateLines(src, file);
  totalLines += candidates.length;

  for (const cand of candidates) {
    for (const { regex, hint } of PATTERNS) {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(cand.text)) !== null) {
        findings.push({
          file: cand.file,
          line: cand.line,
          hint,
          match: m[0],
          context: cand.text.length > 100 ? cand.text.slice(0, 100) + "…" : cand.text,
        });
      }
    }
  }
}

console.log(`\nScanned ${totalLines} text lines across ${FILES.length} files.`);
if (findings.length === 0) {
  console.log("✅ No common typos/grammar issues detected by automated patterns.\n");
  console.log("Note: this is a regex-based pass. It catches common typos but not all errors.");
  console.log("For a thorough check, paste content into a tool like Grammarly or LanguageTool.");
} else {
  console.log(`\n⚠️  ${findings.length} potential issue(s):\n`);
  // Group by file
  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  for (const [file, items] of byFile) {
    console.log(`\n  ${file}:`);
    for (const it of items) {
      console.log(`    line ${it.line}  [${it.hint}]  found: "${it.match}"`);
      console.log(`              in: "${it.context}"`);
    }
  }
}
