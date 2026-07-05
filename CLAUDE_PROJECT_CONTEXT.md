# The Fifty — Project Context & Handoff Document

> **Who this is for:** A Claude Code instance (or human developer) who has never seen this project.
> **Written:** 2026-07-03, at commit `385b4ae`, as part of migrating the project to a new computer.
> **Read this before CLAUDE.md.** CLAUDE.md was written on day one (2026-04-13) and has never been updated; several of its claims are now false. This document tells you which ones (see [Claude Knowledge](#claude-knowledge)).

---

## Project Overview

### What this is

**The Fifty** is a live, public website — [thefiftylist.com](https://thefiftylist.com) — an opinionated, editorially curated city guide. Each city gets exactly 50 picks. No more, no less. The brand voice is confident, insider-y, magazine-quality: "if Monocle and Eater had a baby that was raised by a local." The tagline is *"Fifty things. One city. No filler."*

Every pick falls into one of six categories (consistent across all cities): **Eat, Drink, Coffee, Stay, Experience, Shop**. Every entry has an opinionated 2–4 sentence description plus a 1–2 sentence insider "signature" tip.

### Current status

- **Launched publicly on 2026-05-18** (commit `1a64f79` removed the password gate; the site had been live-but-gated since mid-April).
- **11 cities, 550 entries**: New York, Austin, Nashville, Chicago, Los Angeles, Seattle, San Francisco, Miami, Portland, Denver, and **Las Vegas** (added 2026-04-30 as an 11th city — CLAUDE.md still says 10).
- All 550 entries have real photos (Google Places API, converted to WebP) and lat/lng geocodes feeding per-city Leaflet maps.
- Full SEO infrastructure: prerendered HTML for all 567 routes, JSON-LD structured data, OG images, sitemap, per-entry deep URLs like `/austin/houndstooth-coffee`.
- Last engineering work: 2026-05-25 (post-launch SEO "Phases 1, 2, 3d, 3e, 3f"). The repo has been quiet for ~5 weeks.

### Business context

- **Solo, bootstrap, organic-only.** No budget for paid acquisition. Owner: Michael Brandt (michaelbrandt@gmail.com; site contact addresses are `hello@thefiftylist.com` and `press@thefiftylist.com`).
- The strategy document is [LAUNCH_PLAN.md](LAUNCH_PLAN.md) (2026-04-25): Part 1 (pre-launch engineering gaps) and Part 2 (SEO audit) were essentially fully executed. **Part 3 (the traffic/marketing playbook — press outreach, Reddit, featured-business outreach, newsletter cross-promos) has no evidence of execution in the repo.** Whether it happened off-repo is unknown.
- Analytics: GA4, measurement ID `G-XLTG16BJ0B`. Email capture: Mailchimp (audience "thefiftylist", server `us8`), wired on every page.
- Monetization: undecided (an explicit open question in LAUNCH_PLAN.md, never answered).

### Technical context

- Vite 8 + React 19 single-page app with a custom Puppeteer **prerendering** step that snapshots every route to static HTML at build time — this is what makes social previews and SEO work despite being a SPA.
- Hosted on **Vercel** (Git integration on `origin/main`; pushing to GitHub deploys). GitHub Pages was briefly used and fully retired.
- Remote: `https://github.com/michaelbrandt-5/the-fifty.git`, single branch `main`, 32 commits, clean working tree.
- **No tests, no linter, no TypeScript, no CI.** QA is done via purpose-built scripts in `scripts/` (business-closure audit, spell check, JSON-LD validation).
- Editorial content lives **in the code**: each city page's `ENTRIES` array is the source of truth for that city's 50 picks.

---

## Architecture

### Technologies

| Layer | Choice |
|---|---|
| UI framework | React 19.2 (JSX, no TypeScript) |
| Build | Vite 8 (`@vitejs/plugin-react`) |
| Routing | react-router-dom 7 (client-side, BrowserRouter) |
| Head/SEO | react-helmet-async 3 |
| Maps | Leaflet 1.9 + CartoDB Voyager raster tiles (free) |
| Prerendering | Custom script: Puppeteer locally, `puppeteer-core` + `@sparticuz/chromium-min` on Vercel |
| Image tooling | sharp (WebP conversion), @resvg/resvg-js (favicon/OG generation) |
| Hosting | Vercel (static + SPA rewrite) |
| Analytics | GA4 (gtag.js, injected in `src/main.jsx`) |
| Email | Mailchimp via client-side JSONP (no backend anywhere) |
| Data enrichment | Google Places API (New) — photos, geocodes, closure status |

### File structure

```
/                              # repo root
├── CLAUDE.md                  # day-one project guide — PARTIALLY STALE, see Claude Knowledge
├── CLAUDE_PROJECT_CONTEXT.md  # this file
├── LAUNCH_PLAN.md             # launch strategy (Apr 25) — engineering parts done, marketing parts unknown
├── PRELAUNCH_CHECKLIST.md     # week-by-week checklist — checkboxes were NEVER ticked; ignore its state
├── PRELAUNCH_QA_RESULTS.md    # Apr 25 QA audit results (closures, spelling, JSON-LD)
├── REPLACEMENTS_PROPOSAL.md   # drafted copy for the 28 closed-business replacements (applied)
├── CLAUDE-CODE-PROMPT.md      # historical: the day-one kickoff prompt (obsolete, provenance only)
├── the-fifty-homepage.jsx     # homepage (11-city grid, sample picks, philosophy, waitlist)
├── {city}-city-page.jsx       # × 11 — each ~1,270 lines, self-contained, ENTRIES array inside
├── methodology-page.jsx       # /methodology
├── index.html                 # SPA shell; ALSO holds global mobile/list-view CSS (see Code Patterns)
├── vite.config.js             # minimal; prerender deliberately NOT a Vite plugin
├── vercel.json                # cleanUrls + SPA rewrite fallback
├── package.json               # build = sitemap → vite build → prerender
├── src/
│   ├── main.jsx               # GA4 bootstrap + ALL routes (order is load-bearing)
│   ├── data/cities.js         # central registry: imports ENTRIES from all 11 city files
│   ├── seo.js                 # SITE constants, per-route + per-city meta, category→schema.org map
│   ├── PageMeta.jsx           # Helmet head tags + JSON-LD (home/city/entry/static modes)
│   ├── EntryPage.jsx          # per-entry deep URL page (/:citySlug/:entrySlug)
│   ├── CityMap.jsx            # Leaflet map (lazy-loaded from each city page)
│   ├── NotFound.jsx           # branded 404 (client-side only — serves HTTP 200, a "soft 404")
│   ├── About.jsx / Privacy.jsx / Terms.jsx / PhotoCredits.jsx
│   ├── PasswordGate.jsx       # DEAD CODE — the pre-launch gate, no longer imported anywhere
│   ├── mailchimp.js           # JSONP subscribe (hardcoded list params)
│   ├── utils/slug.js          # toEntrySlug() — DUPLICATED in scripts/get-entry-routes.mjs
│   ├── photos.json            # generated: {city: {id: {src, credit, creditUrl, placeId, matchedName}}}
│   └── locations.json         # generated: {city: {id: {lat, lng}}}
├── scripts/                   # Node ESM data pipeline + QA + codemods (see Common Commands)
├── public/
│   ├── images/{city}/N.webp   # 550 entry photos (WebP, 800px, q82)
│   ├── images/cities/*.webp   # homepage card images
│   ├── og/*.png               # generated OG images (1200×630) per city + home + methodology
│   ├── robots.txt, sitemap.xml, favicons, site.webmanifest
└── .claude/launch.json        # dev-server config — HARDCODES an absolute Node path (fix on new machine)
```

**Unusual but intentional:** page components live at the **repo root**, not in `src/`. This is a holdover from the project's origin as standalone `.jsx` previews. `src/main.jsx` imports them with relative paths (`../austin-city-page.jsx`).

### Build process

`npm run build` runs three steps in sequence:

1. **`scripts/build-sitemap.mjs`** — writes `public/sitemap.xml` AND `dist/sitemap.xml` with 567 URLs (17 static routes + 550 entry deep URLs), `lastmod` = build date. Note: this **dirties the committed `public/sitemap.xml`** on every build.
2. **`vite build`** — standard SPA bundle to `dist/`.
3. **`scripts/prerender.mjs`** — the crown jewel. Spins up a local static server on port 4173 that serves the *pristine* SPA shell for every HTML route (holding it in memory so already-prerendered output can't contaminate later snapshots), drives headless Chrome through all 567 routes, waits for `networkidle0` + a custom `render-event` DOM event dispatched by `src/main.jsx` after React/Helmet flush, dedupes head tags (first `<title>` wins because Helmet writes before shell defaults), and writes `dist/<route>/index.html`. Entry routes run in parallel batches of 5. Exits nonzero on any failure.

Entry-route discovery (`scripts/get-entry-routes.mjs`) **regex-parses the raw city-page JSX** for `name:` lines — no transpilation. It contains its own copy of `toEntrySlug`, which must stay in sync with `src/utils/slug.js`.

### Deployment

- **Vercel, via Git integration**: push to `main` on GitHub → Vercel builds (`npm run build`) → deploys `dist/`. There is no `.vercel/` directory or deploy workflow in the repo; the connection lives in the Vercel dashboard under the owner's account.
- On Vercel, `scripts/prerender.mjs` detects `process.env.VERCEL` and switches to `puppeteer-core` + `@sparticuz/chromium-min` (a Chromium pack downloaded from a **hardcoded GitHub release URL pinned to v147.0.2** — must be updated in lockstep with the `@sparticuz/chromium-min` dependency version). This exists because Vercel's build sandbox lacks system libraries (libnspr4 etc.) that bundled Chromium needs.
- `vercel.json`: `cleanUrls: true`, `trailingSlash: false`, single rewrite `/(.*) → /index.html`. Prerendered files win for known routes; the rewrite is only the fallback — which means **unknown URLs serve the SPA shell with HTTP 200** and the client-side 404 renders (soft 404; a known, accepted tradeoff).

### Local development

```bash
npm install          # needs native builds for sharp/resvg; puppeteer downloads Chromium
npm run dev          # Vite on http://localhost:5173
```

- `.claude/launch.json` defines a `the-fifty-dev` preview server, but it hardcodes `/Users/michaelbrandt/local/nodejs/node-v22.15.0-darwin-arm64/bin/node` — **this path will not exist on a new machine; update it** (or simplify to `npm run dev`).
- Node version is unpinned (no `engines`, no `.nvmrc`). Development happened on Node 22.15 and later Node 24.
- `.env` at repo root (gitignored, **must be copied to the new machine manually**) contains exactly one key: `GOOGLE_PLACES_API_KEY`. It is needed **only by the data scripts** (photos/geocoding/closure checks) — the app itself builds and runs without it.

---

## Decisions We've Made

Each decision below records what was chosen, why, what was rejected, and the tradeoff. (Reconstructed from commit messages, planning docs, and code comments.)

**1. Stay a Vite SPA + custom prerender — not Next.js/Astro.**
LAUNCH_PLAN.md called prerendering "the single biggest unlock" and weighed a full Astro/Next migration vs. a prerender bolt-on. The bolt-on won: 90% of the value for half a day of work in a tight launch window. *Rejected:* framework migration (CLAUDE.md's "likely Next.js eventually" never happened). *Tradeoff:* prerendering is homegrown and has sharp edges (route discovery by regex, head-tag dedup logic, Chromium-on-Vercel workaround).

**2. Custom Puppeteer script — not `vite-plugin-prerender`.**
The plugin ships an ancient bundled Chrome that won't launch on modern systems (comment in `vite.config.js`). *Leftovers:* the plugin is **still listed in `package.json` dependencies (unused)**, and the `render-event` name in `main.jsx` is a holdover from its convention. *Tradeoff:* more control, more maintenance.

**3. Vercel — not GitHub Pages.**
Both existed briefly in April (dual-deploy). LAUNCH_PLAN flagged "two deploy paths is one too many" and recommended Vercel (edge caching, better fit for a content site). Commit `1f62bc3` (Apr 25) deleted the GH Actions workflow, `CNAME`, and `404.html`. The prerender-on-Vercel problem was solved with `@sparticuz/chromium-min`.

**4. GA4 — not Plausible.**
LAUNCH_PLAN preferred Plausible ($9/mo) but allowed GA4; GA4 won (free, pairs with Search Console). The measurement ID is **hardcoded** in `src/main.jsx` with a `VITE_GA4_ID` env override — deliberate, since GA4 IDs are public in served HTML anyway. `send_page_view: false` + a manual `PageviewTracker` component covers SPA navigations.

**5. Google Places photos — not Unsplash hotlinks.**
The original homepage hotlinked Unsplash; entry pages had no photos. Photos for all 550 entries were fetched via the Google Places API (commit `5dd35bc`), stored locally in `public/images/`, with per-photo attribution on `/photo-credits` (and a 48-hour takedown promise). *Why:* rights clarity, no third-party CDN dependency. *Tradeoff:* ~49 MB of images committed to git; photos show whatever Google matched (the `matchedName` field in `photos.json` exists to audit wrong-place matches).

**6. All photos converted to WebP (Phase 2, commit `91a3b03`).**
JPG → WebP at 800px/q82 cut the payload 73% (180 MB → 49 MB). *Side effect:* `fetch-photos.mjs`'s resume check still looks for `.jpg` files — see Known Bugs.

**7. Entry data lives in the city-page JSX files; enrichment joins by numeric id.**
`ENTRIES` arrays (id 1–50) are the editorial source of truth. Photos (`src/photos.json`) and coordinates (`src/locations.json`) are generated artifacts keyed `{citySlug: {id: …}}`. Entry URLs are **computed from names** via `toEntrySlug()` — slugs are not stored. *Tradeoff:* renaming an entry silently changes (breaks) its public URL; the entry `image` field is dead (`null` everywhere) because photos join externally.

**8. Per-entry deep URLs (Phase 3d, commit `804ba9b`).**
`/:citySlug/:entrySlug` routes with a dedicated `EntryPage`, all 550 prerendered and sitemapped. *Why:* 550 indexable long-tail pages instead of 17. This took the sitemap from 17 to 567 URLs.

**9. Closed businesses get replaced, not deleted.**
A Places-API audit (Apr 25) found 28 permanently closed + 7 temporarily closed among the original 500. All 28, plus 4 of the 7 temp-closed, were replaced with curated alternatives (drafted in REPLACEMENTS_PROPOSAL.md, applied via `scripts/apply-replacements.mjs`). Replacement philosophy: favor longtime institutions over trendy newcomers. **42 total entries replaced across 4 commits** over the project's life. The "exactly 50" rule means every removal requires a replacement.

**10. Las Vegas added as the 11th city (Apr 30) — pre-launch, breaking the "50 states × 10 cities" framing.**
Tagline "Beyond the Strip", full 50 entries, photos, geocodes, OG image. *Caveat:* it was added **after** the QA sweep and several scripts were never updated to include it (see Known Bugs).

**11. Password gate for the pre-launch preview; kept as dead code after launch.**
`src/PasswordGate.jsx` (password `cities`, sessionStorage, crawler UA bypass) wrapped the app Apr 16 – May 18. Launch = removing it from `main.jsx` while keeping the file, exactly as LAUNCH_PLAN recommended (in case a private preview is needed again).

**12. WCAG AA compliance changed the brand colors (commit `b991306`).**
The Coffee badge went `rgb(180,130,80)` → `rgb(150,100,55)` and the accent gold `#B8864E` → `#8C6534` for eyebrow/soft text, to meet contrast ratios. **CLAUDE.md still documents the old values.** The fix only landed on the 11 city pages: the map pins in `CityMap.jsx` (`#b48250`) *and* the entry-page badges in `src/EntryPage.jsx` (`CAT_COLORS`, `rgb(180,130,80)` — its comment even says "matches CLAUDE.md") still use the old coffee color — unresolved.

**13. Honesty edit on /about (commits `dd08a4e`, `6ab0481`).**
The About page shipped with claims that were "aspirational, not yet true" ("we don't take press dinners", "visited at least twice anonymously", "editors who actually live in the city") — consciously removed the next morning and replaced with an honest research-process paragraph. **Editorial integrity rule established: don't claim processes that aren't real.**

**14. No backend, ever (so far).**
Mailchimp signup is client-side JSONP with hardcoded list parameters (`u=69853d27c066568d5e7b944ab`, `id=d54d4bc6e1`, server `us8`). *Tradeoff:* nothing secret is possible client-side; the city-interest dropdown on the homepage waitlist is UI-only and never actually sent to Mailchimp.

**15. Only Leaflet is lazy-loaded; city pages are not code-split.**
All 11 city pages (and their 550 entries) are statically imported into the main bundle (~1 MB). Phase 2 lazy-loaded only `CityMap` (Leaflet), trimming ~160 KB. Route-level splitting was considered unnecessary so far.

---

## Current Work

Nothing was mid-flight when work stopped (2026-05-25); the tree is clean and pushed. But there are known bugs, debt, and unexecuted plans.

### Known bugs / hazards (all verified in code)

1. **Las Vegas is missing from three scripts** (it was added after they were written):
   - `scripts/apply-replacements.mjs` — its city→filename map has no `las-vegas`; a replacement for that city would **crash**.
   - `scripts/spell-check.mjs` — FILES list omits `las-vegas-city-page.jsx`; its copy has never been linted.
   - `scripts/validate-jsonld.mjs` — ROUTES list omits `/las-vegas` (and all 550 entry routes); never validated.
   Las Vegas also never went through the business-closure QA that the other 10 cities got.
2. **`scripts/fetch-photos.mjs` resume logic is broken post-WebP.** It skips entries whose `public/images/{city}/{id}.jpg` exists — but the WebP migration **deleted all JPGs**. A bare `node scripts/fetch-photos.mjs` would re-download all 550 photos (real API cost) and reset `photos.json` `src` fields to `.jpg`. **Always run it with `--city`/`--limit` targeting, then re-run `convert-images.mjs`.**
3. **Slug logic duplicated:** `src/utils/slug.js` and `scripts/get-entry-routes.mjs` carry identical `toEntrySlug` copies. If they diverge, prerendered/sitemapped URLs split from the URLs the app generates.
4. **Soft 404s:** unknown URLs return HTTP 200 with client-rendered 404 content. Fine for users, suboptimal for crawlers.
5. **JSON-LD quirk:** `PageMeta.jsx` puts the *neighborhood* in `PostalAddress.addressRegion` (schema.org expects the state).
6. **City-page footer "Explore other cities" cards are dead links** (`href="#"`). Each city page hardcodes its own trio of cities in a local `const cities` array (~line 1018), with inconsistent taglines for the same city across files. Real cross-city links live on entry pages only.
7. **City-page action buttons ("Reserve", "Book"…) are dead** (`href="#"` + preventDefault). Only `EntryPage` builds real (Google search/Maps) URLs from them.
8. **"Related picks" on entry pages are just the first 3 entries of the city array** — every entry page in a city shows nearly the same three.
9. **Build dirties git:** `build-sitemap.mjs` rewrites the committed `public/sitemap.xml` (lastmod = build date) on every build.
10. **Repo health:** `.git` is ~242 MB with 1,633 loose objects and zero packfiles (interrupted operations left 9 `tmp_obj_*` garbage files). `git gc` has never run; full-history `git log --stat` can take minutes.

### Technical debt

- `vite-plugin-prerender` is an unused declared dependency (and mis-filed under runtime deps).
- `src/PasswordGate.jsx` is dead code with a stale comment pointing at `vite.config.js`.
- Category badge colors are duplicated in every city page (`getCategoryColor`), again in `CityMap.jsx`, again in `EntryPage.jsx`, and again in homepage `SAMPLE_PICKS` (which even uses different category *names* — "Restaurant"/"Bar" vs "Eat"/"Drink"). No shared constants module.
- Nav/Footer components are re-implemented per page file rather than shared.
- Stale hardcoded counts in script comments ("all 500", "×500 ≈ $8.50", "10 cities") — actual is 550/11.
- City-page heroes say "Last updated March 2026" on Austin and Los Angeles and "Last updated April 2026" on the other nine cities — hardcoded strings that will silently age.
- The empty `precursor/` directory and `dist/` macOS " 2" duplicate files are cruft.

### Unexecuted plans (from LAUNCH_PLAN.md / PRELAUNCH_CHECKLIST.md)

No repo evidence for any of these (they may have happened off-repo — ask the user before assuming):
- Press kit / `/press` page; press-list outreach (30–40 contacts); launch-day press exclusive.
- Mailchimp welcome email; DKIM/SPF/DMARC on the sending domain; mail-tester score.
- Social handles (Instagram, TikTok, Threads, BlueSky, X, Pinterest).
- Featured-business outreach (emailing all 50 Austin businesses — flagged as "the single highest-conversion organic tactic").
- `LAUNCH_METRICS.md` retrospective; Google Search Console / Bing sitemap submission (status unknown).
- Monetization decision.
- Manual verification of the 3 remaining temporarily-closed picks: **Blue Genie Art Bazaar** (Austin — seasonal, Nov–Dec only), **The Parthenon** (Nashville), **Stony Island Arts Bank** (Chicago); and spot-checks of the 14 "unknown status" entries.

### Next priorities (inferred; confirm with user)

1. Re-run the closure audit — it's been 10 weeks since the last one, and Las Vegas has never been audited.
2. Execute or explicitly drop the marketing playbook.
3. Rewrite CLAUDE.md to match reality (or fold it into this doc).
4. New content cadence: more cities? Entry refreshes? (Open question from launch plan.)

---

## Code Patterns

### Conventions

- **Inline styles everywhere** — style objects in JSX, no CSS files, no Tailwind. **One deliberate exception:** responsive/mobile CSS for the city-page list view and `:focus-visible` styles live as global classes (`.fifty-list-item`, `.fifty-nav`, …) in `index.html`, because media queries can't be inline.
- **Design tokens** (post-WCAG values — trust these over CLAUDE.md): background `#F7F4EE` (homepage; city pages use `#FAF7F2`), text `#1A1A1A`, accent gold `#B8864E` (decorative) / `#8C6534` (text/eyebrows, contrast-safe). Category badges: Coffee `rgb(150,100,55)`, Eat `rgb(168,60,50)`, Stay `rgb(55,90,100)`, Experience `rgb(90,110,70)`, Shop `rgb(140,100,130)`, Drink `rgb(150,80,90)` — these are the city-page values; `EntryPage.jsx` and `CityMap.jsx` still carry the pre-WCAG coffee color (see Known Bugs).
- **Fonts:** homepage and static pages use Playfair Display (headings) + Inter (body) via Google Fonts `@import`. **City pages use plain `'Georgia', serif` + `system-ui`** — a divergence nobody has reconciled; don't "fix" it without asking.
- **Entry shape** (all 550 follow it):
  ```js
  { id: 1..50, name, category, neighborhood, description, signature,
    action: "Reserve"|"Book"|"Get Directions"|"Learn More",
    actionType: "reserve"|"book"|"directions"|"learn", image: null }
  ```
  `image` stays `null` — photos join via `src/photos.json` by id. Keep `export const ENTRIES` as a **named export**; `src/data/cities.js` depends on it.
- **Editorial voice** (CLAUDE.md's voice section is still accurate and actively enforced): confident, specific, local, opinionated, slightly literary. American spelling enforced (gray, canceled, traveling — `spell-check.mjs` checks this). Category balance target per city: ~15 Eat, ~8 Drink, ~5 Coffee, ~4 Stay, ~12 Experience, ~6 Shop.
- **Real places only, no chains, mix of price points, geographic spread** — and when a place closes, it gets *replaced* (list stays at exactly 50).
- **Cross-city codemods live in `scripts/`** — when the same change must hit all 11 city pages, the established pattern is a one-shot idempotent codemod script (see `fix-headings-lazymap.mjs`, `patch-city-pages.mjs`), not 11 hand edits.

### Adding a new city (the full checklist — 8+ places to touch)

1. Copy `austin-city-page.jsx` → `{slug}-city-page.jsx`. Change only: component name, `CITY_SLUG`, `PHOTOS[slug]`/`LOCATIONS[slug]` lookups, `NEIGHBORHOODS` (~8–10), the 50-entry `ENTRIES`, hero kicker/h1/tagline, "Last updated" month, `PageMeta citySlug`, `CityMap cityName`.
2. Register in `src/main.jsx` (import + `<Route>` **before** the `/:citySlug/:entrySlug` route — route order is load-bearing).
3. Register in `src/data/cities.js` (`CITY_DATA`), `src/seo.js` (`CITIES`), `src/NotFound.jsx` (city list), `src/PhotoCredits.jsx` (two lists), homepage `CITIES` array (name/slug/tagline/region/img).
4. Add to `scripts/build-sitemap.mjs` and `scripts/prerender.mjs` STATIC_ROUTES, `scripts/generate-og.mjs` PAGES (tagline is duplicated there), and the **three scripts that Las Vegas was forgotten from**: `apply-replacements.mjs` filename map, `spell-check.mjs` FILES, `validate-jsonld.mjs` ROUTES.
5. Generate data: `node scripts/extract-entries.mjs` → `node scripts/fetch-photos.mjs --city {slug}` → `node scripts/geocode-entries.mjs --city {slug}` → `node scripts/convert-images.mjs` → `node scripts/generate-og.mjs`. Add a homepage card image at `public/images/cities/{slug}.webp`.

### Things to avoid

- Don't run `fetch-photos.mjs` without `--city` (see Known Bugs #2).
- Don't rename an entry casually — its URL is derived from its name.
- Don't add `<h3>`/`<h4>` to city pages and then re-run `fix-headings-lazymap.mjs` (blanket find-replace would mangle them).
- Don't edit the exact inline-style strings of entry-name `<h2>`s if you ever need `patch-city-pages.mjs` again (it anchors on them).
- Don't trust `PRELAUNCH_CHECKLIST.md` checkbox state — it was never maintained.

---

## Important Files

| File | Why it matters |
|---|---|
| `austin-city-page.jsx` | The canonical template every city page was copied from; the most carefully curated list (QA baseline per LAUNCH_PLAN). |
| `src/main.jsx` | All routing (order matters), GA4 bootstrap, prerender `render-event` signal. |
| `scripts/prerender.mjs` | The heart of SEO/social previews; encodes hard-won fixes (head dedup, pristine-shell serving, Vercel Chromium). |
| `scripts/get-entry-routes.mjs` | Route discovery for prerender + sitemap; regex-parses JSX; holds the duplicated slug function. |
| `src/data/cities.js` | Central registry joining all 11 ENTRIES exports; powers entry lookup and cross-city links. |
| `src/PageMeta.jsx` + `src/seo.js` | Every title/description/OG/JSON-LD on the site. |
| `src/EntryPage.jsx` | Renders all 550 deep-URL pages. |
| `src/photos.json` / `src/locations.json` | Generated enrichment data (photos/credits/placeIds, lat/lng). `placeId` is what the closure audit keys on. |
| `scripts/check-business-status.mjs` | The recurring closure audit (~$9 in API cost per full run). |
| `scripts/apply-replacements.mjs` + `scripts/replacements.json` | The machinery for swapping closed picks. |
| `package.json` | The three-step build pipeline definition. |
| `vercel.json` | Why prerendered HTML wins and everything else falls back to the SPA. |
| `LAUNCH_PLAN.md` | Business strategy + the still-relevant traffic playbook + unanswered open questions. |
| `CLAUDE.md` | Brand voice, content rules, category definitions — still authoritative for *editorial* matters; stale on *technical* ones. |
| `.env` (gitignored) | `GOOGLE_PLACES_API_KEY` — **must be manually copied to a new machine.** |
| `.claude/launch.json` | Dev-server config with a **hardcoded absolute Node path** that breaks on a new machine. |

---

## Claude Knowledge

Everything below is NOT obvious from reading the source, reconstructed from history and prior sessions' traces.

### Provenance & history

- **The project predates Claude Code involvement.** `CLAUDE-CODE-PROMPT.md` is the original kickoff prompt (2026-04-13): at that point only the homepage (6 cities) and a 12-entry Austin page existed. Claude completed Austin to 50, built the other 9 cities, and everything since. That's why Austin is "the template."
- **Domain history:** `thefifty.co` was researched first (whois/RDAP lookups in session history) before settling on **thefiftylist.com**. The Twitter handle `@thefiftylist` in `seo.js` is speculative ("update if/when handle changes") — unknown whether it's actually claimed.
- **The GitHub Pages detour (Apr 15–16)** was partly done through the GitHub *web UI* (those commits have committer "GitHub"), which is why the history there looks odd. It was retired 9 days later.
- **The "Phase" numbering mystery:** post-launch SEO commits are labeled Phase 1, 2, 3d, 3e, 3f. **Phases 3a/3b/3c exist nowhere in the repo** — the phased plan lived only in a conversation. They were most likely non-code tasks (e.g., Search Console work) or renumbered; don't go hunting for lost commits.
- **The replacement that got replaced:** Nannie Inez (installed as an Austin replacement Apr 14) was itself found closed and replaced by Take Heart 11 days later. Closure-checking is a treadmill, not a one-time task.
- **The Portland wrong-state bug (commit `acacd13`):** geocoding matched two Portland entries to a Los Angeles hospital and to "HOLDFAST PDX" in Portland, *Maine* — both of which were also closed. After fixing, all 550 entries were cross-checked for wrong-state coordinates. Lesson: **audit `matchedName` in photos.json and sanity-check coordinates** whenever running the Places pipeline; text search happily matches the wrong city.

### Debugging discoveries (don't re-learn these)

- **Prerender title duplication:** Helmet writes its `<title>` *before* the shell's default one, so dedup must keep the **first** match. Also, `<title>` strings inside HTML comments were being matched — comments are stripped first. (`2b2c781`)
- **Prerender contamination:** serving `dist/` during prerendering let already-snapshotted HTML (with baked OG tags) be served for later routes. Fix: the static server holds the pristine SPA shell in memory for all HTML routes. (`2df17fa`)
- **Vercel can't run bundled Chromium** (missing libnspr4 etc.); `@sparticuz/chromium-min` with its pack URL pinned to the dependency's version is the workaround. Upgrading `@sparticuz/chromium-min` requires editing the URL in `prerender.mjs`.
- **Asset generation depends on system fonts.** `generate-og.mjs` and `generate-favicon.mjs` render Playfair Display/Inter via resvg's `loadSystemFonts` — no bundled font files. **A machine without those fonts installed silently produces different-looking assets** (falls back to serif). Install both fonts before regenerating OG images or favicons.

### Environment quirks (migration-relevant)

- The old machine's Node was a **manual tarball install at `~/local/nodejs/node-v22.15.0-darwin-arm64/`** (no Homebrew/nvm at the time), later joined by a system Node 24 at `/usr/local/bin/node`. `.claude/launch.json` still points at the tarball path — **update it on the new machine.**
- `.env` (`GOOGLE_PLACES_API_KEY`) is gitignored — copy it manually or mint a new key (Google Cloud console; the key needs Places API (New) enabled).
- Vercel deploys via Git integration configured in the Vercel dashboard — nothing in the repo controls it. Verify dashboard access from the new machine.
- **The project folder is inside an iCloud-synced path, and it shows.** The " 2" duplicate files in `dist/` (`index 2.html`, `sitemap 2.xml`) are iCloud conflict artifacts, and the `tmp_obj_*` garbage in `.git` is plausibly the same. Treat iCloud as a courier, not a VCS: never work on the repo from two machines concurrently, sync code through GitHub (`git push`/`pull`), verify with `git fsck` after any period where both machines were awake, and delete `dist/` before builds rather than trusting the synced copy.
- Mailchimp: audience "thefiftylist" on server `us8`; the JSONP params in `src/mailchimp.js` are the public embed-form values, not secrets.
- Google Places API cost: ~$0.017/call; a full 550-entry status audit ≈ $9.35, a full photo re-fetch costs real money — hence the `--city`/`--limit` discipline.

### Assumptions & soft spots

- The 3 kept temporarily-closed picks (Blue Genie, The Parthenon, Stony Island Arts Bank) and 14 "unknown status" entries were never re-verified — the docs recommend it, no record says it happened.
- Whether the sitemap was ever submitted to Google Search Console is unrecorded.
- The "Last updated March/April 2026" hero strings are hand-typed, not generated.
- CLAUDE.md's **stale claims** (for quick reference): "No build tooling yet" (false — full Vite/Vercel stack), "10 launch cities" (11), "homepage shows 6 cities" (11), old Coffee badge/accent colors (changed for WCAG), "neighborhood dropdown" (it's a horizontal scrolling filter row), "Back to Cities link" (nav says "Cities"), "images TBD / colored SVG patterns" (real photos everywhere), Playfair/Inter on city pages (they use Georgia/system-ui). Its editorial sections (voice, categories, entry schema, quality bar) remain accurate and in force.

---

## Common Commands

### Development

```bash
npm install                # first-time setup (sharp/resvg native builds, puppeteer Chromium download)
npm run dev                # Vite dev server → http://localhost:5173
npm run build              # FULL build: sitemap → vite build → prerender 567 routes (needs several minutes + Chromium)
npm run build:spa          # quick SPA-only build (no prerender) for sanity checks
npm run prerender          # re-run prerender against an existing dist/
npm run preview            # serve dist/ locally
```

### Content/data pipeline (require `GOOGLE_PLACES_API_KEY` in `.env` where noted)

```bash
node scripts/extract-entries.mjs                     # JSX entries → scripts/places-input.json (+ per-city 50-count check)
node scripts/apply-replacements.mjs                  # apply scripts/replacements.json to city pages; clears stale photo/geo data
node scripts/fetch-photos.mjs --city austin          # [API key] fetch photos — ALWAYS scope with --city (see Known Bugs)
node scripts/geocode-entries.mjs --city austin       # [API key] fetch lat/lng (correctly resumable)
node scripts/convert-images.mjs                      # JPG → WebP, patch photos.json — run after any fetch-photos
node scripts/generate-og.mjs                         # regenerate OG images (needs Playfair/Inter installed)
node scripts/generate-favicon.mjs                    # regenerate favicon set (same font caveat)
```

### QA / maintenance

```bash
node scripts/check-business-status.mjs               # [API key, ~$9] closure audit of all 550 entries
node scripts/spell-check.mjs                         # prose linter (NOTE: doesn't cover Las Vegas yet)
node scripts/validate-jsonld.mjs                     # validate structured data in dist/ (build first; no Las Vegas/entry routes yet)
git gc                                               # overdue — .git has 1,633 loose objects, no packfiles
```

### Deployment

```bash
git push origin main       # that's it — Vercel Git integration builds and deploys
# verify: curl -sI https://thefiftylist.com && curl -s https://thefiftylist.com/austin | head -50
```

---

## Open Questions

Carried forward from LAUNCH_PLAN.md (never answered) plus new ones:

1. **Monetization** — affiliate, sponsorships, paid newsletter, or stay free?
2. **Identity** — is "we/the editors" one person? Press outreach needs a name and a face.
3. **Cadence** — are the 11 cities the whole product, or are cities/entries added on a schedule? (About page claims quarterly updates.)
4. **List maintenance policy** — respond to "you missed X"? Ever re-rank?
5. **Was any of the marketing playbook executed off-repo?** (Search Console submission, press outreach, social handles, Mailchimp welcome email, DKIM/SPF.)
6. **Are the 3 temporarily-closed picks still worth keeping** (Blue Genie / The Parthenon / Stony Island Arts Bank)?
7. **Typography split** — should city pages adopt Playfair/Inter like the rest of the site, or is Georgia intentional?
8. **Coffee color drift** — city-page badges use the WCAG value, but map pins (`CityMap.jsx`) and entry-page badges (`EntryPage.jsx`) still use the old one. Reconcile?
9. **Is `@thefiftylist` (Twitter/X) actually claimed?** `seo.js` assumes it.
10. **Should CLAUDE.md be rewritten** now that most of its technical half is stale?

---

## Recommended Next Steps

If a fresh session takes over tomorrow, in order:

1. **Restore the environment** (30 min). The project folder lives under an iCloud-synced path, so it arrives on the new machine via iCloud — do **not** clone into it. In order:
   - Wait for iCloud to finish, then force-download the whole folder (Finder → right-click → "Download Now"). A partially-synced or evicted `.git` is corruption waiting to happen.
   - Verify the repo before trusting it: `git fsck` and `git log --oneline -3` (HEAD should be `9dc718a` or later). If fsck complains or you find new iCloud conflict files (`* 2.*`), set the synced folder aside, `git clone https://github.com/michaelbrandt-5/the-fifty.git` to a fresh location, and copy `.env` over from the synced copy — **GitHub is the source of truth, iCloud is just the courier.**
   - Confirm `.env` arrived with the folder (it syncs; it contains `GOOGLE_PLACES_API_KEY`). If missing, mint a new key with Places API (New) enabled.
   - `rm -rf node_modules dist && npm install` — never trust iCloud-synced native binaries (sharp, resvg, and puppeteer's Chromium are machine-specific, and iCloud can evict file contents).
   - Fix the hardcoded Node path in `.claude/launch.json`; install Playfair Display + Inter system fonts if asset regeneration is anticipated; confirm Vercel dashboard access and that pushes still deploy.
2. **Verify the site is healthy**: `npm run dev` renders locally; `curl` the live homepage, a city page, and an entry deep URL; check GA4 is receiving data.
3. **Run `git gc`** — the repo is ~242 MB of loose objects and slow. Do this on one machine only, after iCloud sync has fully settled and while the other machine is idle: gc rewrites most of `.git`, and a concurrent iCloud sync of that rewrite is exactly how conflicted-copy corruption happens.
4. **Re-run the closure audit** (`check-business-status.mjs`) — last run 2026-04-25, and Las Vegas has never been audited. Expect a few new closures; use the replacements workflow.
5. **Patch the three Las Vegas script gaps** (apply-replacements map, spell-check FILES, validate-jsonld ROUTES) and fix the fetch-photos `.jpg` resume check — four small, well-understood edits.
6. **Rewrite CLAUDE.md** to match reality (keep the editorial sections verbatim; replace the technical half), so the two context documents stop contradicting each other.
7. **Ask the user the Open Questions** — especially #5 (marketing execution status) before assuming the playbook is untouched, and #1–3 before any new feature work, since they determine what to build next.

*Generated 2026-07-03 from repo state at commit `385b4ae` by Claude Code, from a full read of the repo, its git history, planning documents, and session artifacts.*
