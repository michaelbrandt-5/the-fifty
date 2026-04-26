# Pre-Launch QA — Results

Generated: 2026-04-25

## Summary

| Check | Result |
|-------|--------|
| JSON-LD validation (21 blocks across 13 routes) | ✅ All valid, all required Schema.org fields present |
| Spell + grammar pass (1,561 text lines, 12 files) | ✅ Zero real typos (5 false positives) |
| Business status (500 entries via Google Places API) | ⚠️ **35 entries flagged** (see below) |

## Business status breakdown

| Status | Count | Action needed |
|--------|-------|---------------|
| ✅ OPERATIONAL | 451 | None |
| ❌ CLOSED_PERMANENTLY | 28 | **Replace** |
| ⚠️ CLOSED_TEMPORARILY | 7 | **Verify** (may reopen) |
| ? Unknown / no status | 14 | **Likely fine** — most are parks/trails/landmarks |
| Errors | 0 | — |

## CLOSED_PERMANENTLY — 28 entries (need replacement)

Grouped by city:

### Austin (3)
- 10 — South Congress Books (Shop, South Congress)
- 46 — Nannie Inez (Shop, East Austin)
- 47 — Helm Boots (Shop, East Austin)

### New York (3)
- 19 — Peoples Wine (Drink, Lower East Side)
- 35 — Marlow & Sons (Eat, Williamsburg)
- 37 — Olive's Vintage (Shop, Lower East Side)

### Chicago (5)
- 8 — Violet Hour (Drink, Wicker Park)
- 9 — Promontory (Eat, Hyde Park)
- 15 — Lost Lake (Drink, Logan Square)
- 33 — Galerie F (Shop, Logan Square)
- 38 — Aya Pastry (Coffee, West Loop)

### Los Angeles (2)
- 25 — Shibumi (Eat, Downtown)
- 46 — Stumptown Coffee Roasters (Coffee, Arts District)

### Seattle (3)
- 33 — Manolin (Eat, Fremont)
- 35 — The Whale Wins (Eat, Wallingford)
- 39 — Besalu (Coffee, Ballard)

### San Francisco (1)
- 48 — Alexander Book Company (Shop, Financial District)

### Miami (8) — biggest cluster
- 11 — Beaker & Gray (Eat, Wynwood)
- 15 — Jaguar Sun (Drink, Downtown)
- 19 — The Anderson (Drink, MiMo)
- 20 — Margot Bar & Bistro (Drink, Coconut Grove)
- 21 — Esotico Miami (Drink, Edgewater)
- 23 — Gramps (Drink, Wynwood)
- 28 — Bebito's Cafe (Coffee, Little Havana)
- 31 — La Havana Colonial (Stay, Little Havana)

### Portland (1)
- 9 — Pok Pok (Eat, SE Division)

### Denver (2)
- 28 — Ste Ellie (Drink, RiNo)
- 44 — Cry Baby Ranch (Shop, LoDo)

### Nashville (0)
✅ Clean

---

## CLOSED_TEMPORARILY — 7 entries (verify)

These may reopen or be on extended hiatus. Need individual research.

- austin/48 — Blue Genie Art Bazaar (seasonal — only opens Nov–Dec)
- austin/49 — Treaty Oak Distilling (recent financial issues; may have reopened)
- nashville/45 — The Parthenon (Centennial Park building, likely renovation)
- chicago/13 — Stony Island Arts Bank
- seattle/6 — Elm Coffee Roasters
- portland/22 — Expatriate
- denver/36 — Middleman

---

## Unknown status — 14 entries (likely fine, non-business landmarks)

These returned no `businessStatus` because they're not classified as businesses. Spot-check a few to confirm.

- austin/12 — Mount Bonnell (overlook/park)
- austin/38 — Lady Bird Lake Trail
- nashville/17 — Shelby Bottoms Greenway
- chicago/19 — Chicago Riverwalk
- los-angeles/18 — Runyon Canyon Road (trail)
- seattle/5 — Pike Place Market
- san-francisco/20 — Lands End Trail
- portland/4 — Forest Park
- portland/23 — Cathedral Park
- portland/47 — Southeast Hawthorne Boulevard
- denver/14 — Union Station
- denver/30 — City Park
- denver/43 — Cherry Creek Trail
- denver/50 — Lookout Mountain

These are real and operating; they just don't fit Google's "business" classification.

---

## Recommended approach

**Option 1 — Block launch on replacements (safest)**
- Have me research candidate replacements for all 28 permanently-closed entries
- Present them as a batch for your approval
- Replace, re-fetch photos + geocode, deploy
- Estimated time: 1–2 hours of research + your review

**Option 2 — Launch now, fix in week 1**
- Note the 35 flagged entries in a TODO
- Launch as-is; fix the 28 closures in week 1 post-launch
- Risk: some early visitors hit dead picks (28/500 = 5.6% bad rate)

**Option 3 — Hybrid (recommended)**
- I research replacements NOW for the 28 permanently-closed
- We launch with replacements done
- Week 1, manually verify the 7 temporarily-closed (may need follow-up)
- The 14 no-status entries are spot-checked manually but presumed fine
