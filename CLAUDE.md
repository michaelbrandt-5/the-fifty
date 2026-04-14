# The Fifty — Project Guide

## What This Is
"The Fifty" is an opinionated, editorially curated city guide. Each city gets exactly 50 picks — no more, no less. The brand voice is confident, insider-y, and magazine-quality. Think: if Monocle and Eater had a baby that was raised by a local.

## Tech Stack
- React (JSX) single-file components
- Inline styles (no CSS files, no Tailwind)
- Design tokens defined inline (see below)
- No build tooling yet — files are standalone `.jsx` previews
- Platform TBD — likely Next.js eventually, but for now just standalone components

## Design Tokens
- **Background:** `#F7F4EE` (warm cream)
- **Text:** `#1A1A1A`
- **Accent:** `#B8864E` (warm gold)
- **Fonts:** `'Playfair Display', Georgia, serif` for headings; `'Inter', system-ui, sans-serif` for body
- **Category badge colors (solid bg, white text):**
  - Coffee: `rgb(180,130,80)`
  - Eat: `rgb(168,60,50)`
  - Stay: `rgb(55,90,100)`
  - Experience: `rgb(90,110,70)`
  - Shop: `rgb(140,100,130)`
  - Drink: `rgb(150,80,90)`

## The 10 Launch Cities
1. New York
2. Austin
3. Nashville
4. Chicago
5. Los Angeles
6. Seattle
7. San Francisco
8. Miami
9. Portland
10. Denver

## Categories (consistent across ALL cities)
- **Eat** — restaurants, from fine dining to holes in the wall
- **Drink** — bars, wine bars, cocktail spots
- **Coffee** — cafés, roasters, third-wave spots
- **Stay** — hotels, boutique properties, unique accommodations
- **Experience** — museums, parks, live music, outdoors, cultural landmarks, anything you *do*
- **Shop** — bookstores, boutiques, markets, record shops

## Content Rules
1. **Exactly 50 entries per city.** Not 49, not 51.
2. **Category balance target:** ~15 Eat, ~8 Drink, ~5 Coffee, ~4 Stay, ~12 Experience, ~6 Shop (flexible but roughly balanced)
3. **Every entry has:**
   - `id` (1–50)
   - `name` — the place name
   - `category` — one of the six categories above
   - `neighborhood` — specific neighborhood name (use ~8-10 neighborhoods per city)
   - `description` — 2-4 sentences. Opinionated, specific, voice-y. Says WHY this place matters, not just what it is. Written like a trusted friend who lives there telling you where to go.
   - `signature` — 1-2 sentences. A specific insider tip: what to order, when to go, what to ask for, a secret most visitors miss.
   - `action` — button label: "Reserve", "Book", "Get Directions", or "Learn More"
   - `actionType` — one of: `reserve`, `book`, `directions`, `learn`
   - `image` — set to `null` (images TBD)

## Voice & Tone
- **Confident, not arrogant.** "This is the best meal in the city, full stop." not "We think this might be..."
- **Specific, not generic.** Name dishes, describe the light, reference the vibe at a specific time of day.
- **Local, not tourist.** Write like someone who's lived there 5+ years, not someone who visited once.
- **Opinionated, not comprehensive.** Every pick is a declaration. If it's on the list, you're telling them to go.
- **Slightly literary.** Sentences can breathe. Use em dashes, italics-worthy asides, the occasional short sentence for punch.

## File Structure
- `the-fifty-homepage.jsx` — homepage with hero, city grid, sample picks, philosophy, waitlist
- `austin-city-page.jsx` — Austin city page (TEMPLATE — use this as the reference for all other city pages)
- `{city}-city-page.jsx` — one file per city (e.g., `new-york-city-page.jsx`, `nashville-city-page.jsx`)

## Austin Template Reference
The Austin city page (`austin-city-page.jsx`) is the canonical template. It includes:
- Full nav with "Back to Cities" link
- Hero section with city name, tagline, intro paragraph, and stats bar
- Filter bar with category pills and neighborhood dropdown
- Toggle between grid view and list view
- Individual entry cards with number, name, category badge, neighborhood, description, signature tip, and action button
- Placeholder image system using colored SVG patterns
- Footer consistent with homepage
- All 50 entries in a `const ENTRIES` array

When building new city pages, copy the Austin template structure exactly and replace:
1. The `ENTRIES` array with 50 new entries for that city
2. The `NEIGHBORHOODS` array with that city's neighborhoods
3. The hero content (city name, tagline, intro paragraph)
4. The stats in the stats bar

## Homepage Updates Needed
The homepage currently shows 6 cities. Update to show all 10 launch cities with:
- Appropriate taglines for each city
- Proper Unsplash image URLs (use real Unsplash URLs, `w=600&q=80`)
- Grid layout that accommodates 10 cards well

## Quality Bar
- **Real places only.** Every restaurant, bar, hotel, and shop should be a real, currently operating establishment.
- **No chains.** No Starbucks, no Marriott, no national brands (rare exceptions for iconic local outposts).
- **Mix of price points.** Don't make every pick a $200 dinner. Include the $4 taco stand that's better than most sit-down restaurants.
- **Geographic spread.** Don't cluster all 50 picks in one neighborhood. Represent the full character of the city.
- **Temporal mix.** Include institutions (been there 30 years) and newcomers (opened last year and already essential).
