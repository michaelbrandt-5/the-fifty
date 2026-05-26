// Central data registry for all city entries.
// Imported by <EntryPage /> to look up entries by city + slug.

import { toEntrySlug } from "../utils/slug.js";

import { ENTRIES as austinEntries }        from "../../austin-city-page.jsx";
import { ENTRIES as newYorkEntries }       from "../../new-york-city-page.jsx";
import { ENTRIES as nashvilleEntries }     from "../../nashville-city-page.jsx";
import { ENTRIES as chicagoEntries }       from "../../chicago-city-page.jsx";
import { ENTRIES as losAngelesEntries }    from "../../los-angeles-city-page.jsx";
import { ENTRIES as seattleEntries }       from "../../seattle-city-page.jsx";
import { ENTRIES as sanFranciscoEntries }  from "../../san-francisco-city-page.jsx";
import { ENTRIES as miamiEntries }         from "../../miami-city-page.jsx";
import { ENTRIES as portlandEntries }      from "../../portland-city-page.jsx";
import { ENTRIES as denverEntries }        from "../../denver-city-page.jsx";
import { ENTRIES as lasVegasEntries }      from "../../las-vegas-city-page.jsx";

export const CITY_DATA = {
  austin:          { entries: austinEntries,       name: "Austin",        state: "Texas" },
  "new-york":      { entries: newYorkEntries,       name: "New York",      state: "New York" },
  nashville:       { entries: nashvilleEntries,     name: "Nashville",     state: "Tennessee" },
  chicago:         { entries: chicagoEntries,       name: "Chicago",       state: "Illinois" },
  "los-angeles":   { entries: losAngelesEntries,    name: "Los Angeles",   state: "California" },
  seattle:         { entries: seattleEntries,       name: "Seattle",       state: "Washington" },
  "san-francisco": { entries: sanFranciscoEntries,  name: "San Francisco", state: "California" },
  miami:           { entries: miamiEntries,         name: "Miami",         state: "Florida" },
  portland:        { entries: portlandEntries,      name: "Portland",      state: "Oregon" },
  denver:          { entries: denverEntries,        name: "Denver",        state: "Colorado" },
  "las-vegas":     { entries: lasVegasEntries,      name: "Las Vegas",     state: "Nevada" },
};

/** Returns the city data object or null if slug is unknown. */
export function getCityData(citySlug) {
  return CITY_DATA[citySlug] || null;
}

/** Returns { entry, cityData } for a given city + entry slug, or null. */
export function lookupEntry(citySlug, entrySlug) {
  const cityData = getCityData(citySlug);
  if (!cityData) return null;
  const entry = cityData.entries.find(
    (e) => toEntrySlug(e.name) === entrySlug
  );
  if (!entry) return null;
  return { entry, cityData };
}

/** Returns up to `count` related entries from the same city (excluding current entry id). */
export function getRelatedEntries(citySlug, currentId, count = 3) {
  const cityData = getCityData(citySlug);
  if (!cityData) return [];
  return cityData.entries
    .filter((e) => e.id !== currentId)
    .slice(0, count);
}

/**
 * Returns up to `count` { entry, citySlug, cityData } objects from OTHER cities
 * in the same category.  Uses entryId as a deterministic offset so different
 * entries surface different cities (good for internal link diversity).
 */
export function getCrossCityEntries(currentCitySlug, category, entryId, count = 2) {
  const otherCities = Object.entries(CITY_DATA).filter(
    ([slug]) => slug !== currentCitySlug
  );
  // Rotate the city list so each entry shows a different pair of cities
  const offset = (entryId - 1) % otherCities.length;
  const rotated = [
    ...otherCities.slice(offset),
    ...otherCities.slice(0, offset),
  ];

  const results = [];
  for (const [citySlug, cityData] of rotated) {
    const matching = cityData.entries.filter((e) => e.category === category);
    if (matching.length === 0) continue;
    // Pick a specific matching entry using entryId for variety across pages
    const pick = matching[entryId % matching.length];
    results.push({ entry: pick, citySlug, cityData });
    if (results.length >= count) break;
  }
  return results;
}
