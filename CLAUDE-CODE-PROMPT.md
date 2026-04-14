# Prompt for Claude Code

Copy everything below the line into Claude Code as your first message:

---

Read the CLAUDE.md file in this project first — it has all the context you need.

I'm building "The Fifty," a curated city guide site. I have two files already built:
- `the-fifty-homepage.jsx` — the homepage
- `austin-city-page.jsx` — a fully built Austin city page with 12 of 50 entries

I need you to do three things, in this order:

## 1. Complete the Austin city page
Austin currently has 12 entries. Add entries 13–50 to complete it. Follow the exact same data structure and voice as entries 1–12. Maintain category balance per the CLAUDE.md guidelines. Use real Austin establishments only.

## 2. Build the 9 remaining city pages
Create these files, each using `austin-city-page.jsx` as the structural template:
- `new-york-city-page.jsx`
- `nashville-city-page.jsx`
- `chicago-city-page.jsx`
- `los-angeles-city-page.jsx`
- `seattle-city-page.jsx`
- `san-francisco-city-page.jsx`
- `miami-city-page.jsx`
- `portland-city-page.jsx`
- `denver-city-page.jsx`

Each city page needs:
- All 50 entries with real places, written in the same opinionated insider voice as Austin
- A `NEIGHBORHOODS` array with 8-10 real neighborhoods for that city
- A unique hero section (city name, tagline, intro paragraph, stats)
- The same component structure, styling, and interactivity as Austin

## 3. Update the homepage
Update `the-fifty-homepage.jsx` to:
- Show all 10 launch cities (currently only 6)
- Add taglines for the 4 new cities (San Francisco, Miami, Portland, Denver)
- Use working Unsplash image URLs for all 10 cities
- Ensure the grid layout works well with 10 cards

Work through this one city at a time. After each city, briefly confirm what you built before moving to the next.
