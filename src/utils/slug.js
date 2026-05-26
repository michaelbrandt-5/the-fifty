// Generate a URL-safe slug from an entry name.
// Strips accents, lowercases, removes apostrophes, converts non-alphanum runs to hyphens.
//
// Examples:
//   "Houndstooth Coffee"   → "houndstooth-coffee"
//   "Franklin Barbecue"    → "franklin-barbecue"
//   "Jo's Coffee"          → "jos-coffee"
//   "El Naranjo"           → "el-naranjo"
//   "Bar Agricole"         → "bar-agricole"

export function toEntrySlug(name) {
  return name
    .normalize("NFD")                      // decompose accented chars
    .replace(/[̀-ͯ]/g, "")       // strip combining diacritics
    .toLowerCase()
    .replace(/[''`]/g, "")                 // remove apostrophes
    .replace(/[^a-z0-9]+/g, "-")           // non-alphanum runs → hyphens
    .replace(/^-|-$/g, "");                // trim leading/trailing hyphens
}
