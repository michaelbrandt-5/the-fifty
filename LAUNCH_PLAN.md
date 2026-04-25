# The Fifty — Soft Launch Plan

**Target window:** 2–4 weeks from today (2026-04-25)
**Budget posture:** Bootstrap / organic only
**Domain:** thefiftylist.com
**Status at start:** Site is functional behind a password gate. Ten city pages and a methodology page are built. Mailchimp signup is wired. Most foundational SEO and shareability work has not yet been done.

This plan is organized into three parts:

1. **Pre-launch gaps** — what must be added or fixed before the gate comes down.
2. **SEO audit & fixes** — what's actually in the code today, what's missing, and what to do.
3. **Traffic playbook** — bootstrap tactics to get The Fifty in front of the right readers.

A companion file, `PRELAUNCH_CHECKLIST.md`, breaks this into a week-by-week checklist with checkboxes.

---

## Part 1 — Pre-launch gaps

A walk through the repo turned up the following must-fix or should-fix items before opening the doors. These are grouped by severity.

### Must fix before public launch

**Remove the password gate.** `src/PasswordGate.jsx` currently wraps the whole app with the password `cities`. Either remove `<PasswordGate>` from `src/main.jsx` on launch day, or convert it to a feature-flagged "coming soon" splash for users who land on the domain too early. Recommendation: keep the file in the repo but stop wrapping the app in it.

**Pick one deploy target.** The repo has both `vercel.json` and a GitHub Actions workflow (`.github/workflows/deploy.yml`) targeting GitHub Pages, plus a `CNAME` file for `thefiftylist.com`. Two deploy paths is one too many — decide GitHub Pages or Vercel and remove the other. Vercel is the better bet for a content site (faster cold starts, edge caching, easier Open Graph image generation later, free tier covers this).

**Add analytics.** Nothing is tracking traffic today. Without analytics you can't tell which acquisition tactics work. Add Plausible (paid, $9/mo, privacy-friendly, simple) or GA4 (free, more complicated). For a bootstrap launch, Plausible Lite or self-hosted Umami is a good fit; GA4 is acceptable if you'll already use Google Search Console.

**Add a privacy page.** Mailchimp requires it for compliant signups, and most email clients flag senders without one. A short, plain-English page is fine for a soft launch. Same for a one-page Terms.

**Add a favicon.** `index.html` has none. Browsers will show a generic globe icon in tabs, bookmarks, and shared links — it looks unfinished.

### Should fix before driving real traffic

**Pre-render or statically generate pages.** This is a Vite + React Router SPA. The HTML served from `dist/index.html` contains an empty `<div id="root">` — every word of every city page is hydrated by JavaScript. Two consequences:

- Google can crawl JS-rendered content in 2026, but it's still slower and less reliable than static HTML.
- Social previews (iMessage, Slack, Twitter, LinkedIn, Facebook, WhatsApp) use a much simpler crawler that **does not run JavaScript**. Today, every link to thefiftylist.com — anywhere on the internet — will preview as the bare title "The Fifty" with no description, no image. That's a launch-killer for an editorially driven site whose growth depends on people sharing links.

The fix: switch to `vite-plugin-ssg` or migrate the project to Next.js / Astro. Astro is the lowest-friction option since the components are already self-contained JSX with inline styles. If a full migration is too big a lift in the launch window, a temporary fix is to pre-render only the homepage and 10 city pages with `vite-plugin-prerender` — that hits 90% of the value with maybe a half-day of work.

**Wire up Open Graph and per-page metadata.** Required for any social preview to look right. See SEO section below.

**Photo rights.** The homepage uses 16+ Unsplash hotlinks. Unsplash's license allows commercial use without attribution, but hotlinking to `images.unsplash.com` puts you at the mercy of their CDN and policy changes. Options: (1) keep Unsplash but cache copies in `/public/images/cities/`, (2) commission or license proper hero photography for each city, (3) shoot it yourself if you're going to be in those cities anyway. Option 1 is the bootstrap move.

**Photo credits and alt text on every image.** Photo credits are present on entry images via the `photo.credit` field — good. Alt text is empty everywhere. This is both an accessibility issue (screen readers say nothing) and an SEO issue (Google reads alt text for image search). Set `alt={\`${entry.name} — ${entry.category}\`}` at minimum.

**Per-city content count audit.** CLAUDE.md mandates exactly 50 entries per city with a target category mix. Spot-check that every city actually hits 50 and that no city is wildly off the category targets (~15 Eat, ~8 Drink, ~5 Coffee, ~4 Stay, ~12 Experience, ~6 Shop). This is editorial table stakes given the brand promise.

**Real-place verification on each city.** CLAUDE.md says "real, currently operating establishments." For a launch where a journalist might pick a single entry to write about, getting one wrong (closed, renamed, moved) is a credibility hit. Skim each list and verify any place that opened or closed in the last 18 months. The Austin list reads as the most carefully curated; treat it as the QA baseline.

### Nice-to-have before launch (not blocking)

**An About page.** Even one paragraph: who's behind this, why it exists, how to reach you. Builds trust with both readers and journalists. Right now Methodology is the closest thing.

**Contact / press email.** A `hello@thefiftylist.com` or `press@thefiftylist.com` mailbox, even if it forwards to your personal inbox. Anyone who wants to write about the site needs somewhere to go.

**A copy-link or share button on each entry.** People sharing a single restaurant pick is the highest-leverage organic distribution this site has. Make it one tap.

**A "save this list" or PDF export.** Travelers genuinely use city guides offline. A "print this page" optimized stylesheet or a downloadable PDF is a delight feature with a low build cost — and a great email-capture moment if gated behind the signup.

**Error states.** Test what happens with no JS, slow networks, and on the GitHub Pages 404 fallback. The SPA redirect logic in `public/404.html` is clever but worth verifying after the deploy migration.

---

## Part 2 — SEO assessment

### Where the site stands today

**The good:** Clean URLs (`/austin`, `/new-york`, etc.). One semantic `<h1>` per page. Real, deeply written editorial copy — the kind of long-form prose Google rewards. A single-domain structure with all city pages on the apex.

**The gaps — by severity:**

**Critical.** Every page in the SPA shares the single `<title>The Fifty</title>` from `index.html` and a single empty meta description. Search engines and social platforms see exactly the same metadata for the homepage as they do for `/austin`, `/new-york`, and so on. This single issue caps the site's organic ceiling at roughly zero. Fix: per-page `<title>` and `<meta name="description">` injected at build time (via `react-helmet-async` if you stay on Vite, or natively if you migrate to Astro/Next).

**Critical.** No Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) and no Twitter Card metadata. As noted above, this means every shared link previews as a bare title. For a site whose growth model depends on people sharing picks, this is the highest-ROI fix on the entire list.

**Critical.** No `robots.txt`, no `sitemap.xml`. Search engines will eventually find the pages, but a sitemap accelerates indexing dramatically — especially for a brand-new domain with low crawl budget. Generate a sitemap with all 12 routes (homepage, methodology, 10 cities) and submit it via Google Search Console and Bing Webmaster Tools on launch day.

**Critical.** No structured data. The site is *literally* a curated list of local businesses across multiple cities — one of the highest-value structured-data opportunities on the web. Add `ItemList` schema for each city page and `LocalBusiness` schema for each entry. This is what makes The Fifty eligible for rich results in Google ("Best of Austin" carousels, etc.). It's also what AI search engines (Perplexity, ChatGPT search, Google AI Overviews) read first.

**Critical.** Empty `alt` attributes everywhere. Audit confirms every `<img>` in every city page sets `alt=""`. Set descriptive alt text from the entry data.

**High.** Client-side rendering. Already covered above. Pre-rendering or SSG is the single biggest unlock for both SEO and shareability.

**High.** No canonical URLs. With the SPA's catch-all `vercel.json` rewrite, it's possible for the same page to be reachable at multiple URLs (with/without trailing slash, `?utm` params, etc.). Set `<link rel="canonical">` on every page to the bare path.

**Medium.** Internal linking. The homepage links into each city, but city pages don't link to each other or back to thematic content. Add a "More cities" rail at the bottom of each city page (already a UX nicety; the SEO benefit is a bonus). Once you have any other content (blog posts, "the best 10 coffee shops across all 50 cities" pieces), interlink heavily.

**Medium.** Heading hierarchy. The Austin template uses one `<h1>` (good) but the entry cards use `<h3>`/`<div>` for place names — verify each city page has clean `h1 → h2 → h3` flow. Google uses heading structure to understand topic relationships.

**Medium.** Page speed. Inline styles are fine for SEO but Vite's bundle ships every page's data on first load (10 cities × 50 entries × prose = a lot of JSON in the JS bundle). Pre-rendering helps; code-splitting per route helps more. Run PageSpeed Insights once the deploy stabilizes.

**Low.** Anchor text in nav. "Cities" / "About" / "Methodology" — fine, but the city grid uses image links with no descriptive anchor text. The image cards carry "New York / The definitive 50" overlay text inside a `<Link>`, which Google should be able to parse, but a literal `aria-label` on each link removes ambiguity.

### Keyword strategy (organic content)

Even with perfect on-page SEO, this site won't rank for "best restaurants in New York" — that SERP is owned by NYT, Eater, Time Out, Resy, and a wall of long-tail content. The site **can** rank for:

- **Branded:** "The Fifty Austin," "the fifty list" — these are yours from day one.
- **Long-tail intent:** "where to drink natural wine in Austin," "best omakase in Austin under $200," "Austin coffee shops worth the drive." These are the queries the site's editorial voice is already perfectly written for. Each entry's signature tip is essentially a long-tail SEO snippet — it just needs surfacing.
- **Comparison and discovery queries:** "what to do in Austin instead of 6th Street," "Portland alternatives to Voodoo Donuts." Off-the-beaten-path framing matches the brand voice and faces less keyword competition.
- **Newsletter-driven brand search.** The most defensible long-term traffic source for an opinionated guide is people typing "the fifty austin" directly into Google. That comes from being good, being shared, and being remembered — not from keyword optimization.

### Suggested ongoing content cadence

A short monthly editorial post — *not* part of the 50 — keeps the domain fresh in Google's eyes and gives you new things to send to the email list. Examples: "Five places we almost added to Austin (and why we didn't)," "What we got wrong: the first six months." 800–1,200 words, one per month, indexed in `/journal/` or `/notes/`.

---

## Part 3 — Bootstrap traffic playbook

The traffic strategy is built around three principles:

1. **The list is the bait.** Every tactic should give people a reason to read, save, or share a *specific* pick. Generic "check out our city guide" links convert poorly; "the single best taco in Austin under $5" converts.
2. **Cities are launch units.** Don't promote all ten cities equally. Pick two strong cities (Austin and one other — see below) and concentrate every channel on them for the first 30 days. Once those have momentum, the rest can ride the email list and PR coverage.
3. **Email is the moat.** Every channel below should feed the Mailchimp list. Once a reader is on the list, you own the relationship, and a single send can drive thousands of pageviews to whatever city launches next.

### Pick a flagship city

Austin is the most polished page (CLAUDE.md flags it as the template) and the audience is naturally social-media-adjacent (food media, design Twitter, the SXSW press orbit). New York is tempting but the SEO and PR competition is brutal. **Recommendation: Austin as the flagship, Portland or Nashville as the second city.** Both are smaller media markets where a single piece of local press goes a long way.

### Channels — ranked by bootstrap ROI

**1) Press / earned media (highest leverage).**
A well-written magazine-style city guide is exactly the kind of thing food and travel writers cover when they're looking for a hook. Outreach plan:

- Compile a press list of 30–40 contacts: local food/culture editors at *Austin Monthly*, *Texas Monthly*, *Austin Chronicle*, *Eater Austin*, *Austin360*, plus 8–10 national writers who cover travel/food (Bon Appétit, Eater national, Conde Nast Traveler, Punch, the Skift Daily). Use Muckrack free trial or just LinkedIn + journalist Twitter.
- Pitch a single, specific angle, not "we launched a thing." Best angle: *"A new opinionated city guide that picks exactly 50 places and stops there."* The constraint is the story.
- Offer a 48-hour exclusive to the strongest local outlet ("we're launching publicly Tuesday — would you like first look?").
- Don't pitch all ten cities. Pitch Austin. Then pitch the second city two weeks later as the follow-up.

**2) Reddit, niche forums, and city subreddits.**
Reddit is the single highest-quality bootstrap traffic source for opinionated content, *if* you don't burn the community by posting links. Approach:

- Don't drop links in r/Austin or r/AskNYC. You'll get banned and the post will be removed.
- Instead, comment substantively on questions like "best date spot in Austin" or "where should I take my parents" — give a real, specific recommendation in your voice — and link to the city page only when it adds context, not as the entire reply. Aim for ten high-value comments per week per city, not one self-promotional post.
- The Hacker News launch ("Show HN: An opinionated 50-place city guide") is worth one shot, but only after pre-rendering is done — HN traffic will hammer a CSR site.

**3) Newsletter cross-promotion.**
Other independent newsletter writers will trade promo for promo, and many in the food/travel/design space have between 5K and 50K engaged readers. Targets:

- *The Browser*, *The Sample*, *Why is this interesting?*, *Today in Tabs*, *Read Max* — for breadth.
- *The Infatuation*'s newsletter, *Resy's editorial* — for direct food-media adjacency.
- Local lifestyle newsletters in each city: *Austin Kernel*, *6AM City* (Austin/Charlotte/Portland), *Tribeza* — these are who locals actually read.

A simple ask: "Mention us once in your next issue and we'll mention you. Or we'll write a guest piece for you." Cost: zero. Conversion: high.

**4) Instagram and TikTok — but only with the editorial voice intact.**
The brand is "Monocle meets Eater raised by a local." Don't post generic food porn. Post:

- 30-second reels narrating a *single* pick in the brand voice ("This is the best omakase in Austin. Here's why.")
- Carousel posts: "5 picks from our Austin 50 you've never heard of."
- Behind-the-curation: "We considered this place. We didn't include it. Here's why."

Post 3x/week per platform, focused on the flagship city. Tag the businesses — many will reshare, which is free distribution to their existing local audiences. Conversion target: bio link → email signup (not direct site traffic).

**5) Local partnerships with the businesses on the list.**
Every place featured on a city list is a free billboard you've already built relationships with implicitly. Email each one:

- "You're on our Austin 50. Here's the link, here's the quote we wrote, here's the embed code for a small badge if you want it."
- ~10% will share it on their own social and link to it from their site. That's organic backlinks (huge SEO boost) and warm referral traffic.
- For the dozen most engaged places, propose a small in-store card ("Voted one of Austin's 50 by The Fifty — see the rest at thefiftylist.com").

This is the single highest-conversion organic tactic on the list. Allocate one full week to executing it for Austin alone.

**6) SEO content compounding.**
Cover this with the keyword strategy in Part 2. The honest framing: SEO will not drive launch traffic. It compounds 3–9 months out, after the domain has trust and the pages are indexed. Set the foundations now, then forget about it for 60 days.

**7) Threads, X, BlueSky.**
Useful for connecting with food/travel writers (who all live there) and for one-off viral picks ("we picked the #50 spot in Austin and we knew it'd be controversial — here it is"). Not a primary traffic driver. Treat it as journalist-relationship infrastructure.

**8) Pinterest.**
Underrated for travel/lifestyle content. A single well-designed pin per pick (50 per city × 10 cities = 500 pins) compounds over 6–18 months. Bootstrap ask: ~20 minutes per pin in Canva, or hire a VA at $100 for 50 pins. Skip in the launch window; revisit at month 3.

**9) Referral and "share a friend" mechanic.**
Add to the email signup: "Refer a friend, get the next city's list a week early." Free, fits the brand, and is the kind of mechanic that early-adopter travel readers love.

### Launch day choreography

A bootstrap launch lives or dies on the first 48 hours. Suggested sequence:

- **T-7 days:** Press exclusive sent to chosen outlet. Email teaser to existing personal/professional network.
- **T-1 day:** Newsletter cross-promo partners primed. Instagram/TikTok content scheduled. Featured-business outreach emails drafted.
- **Day 0 (Tuesday or Wednesday morning, never a Friday):** Exclusive press piece goes live. Social posts go live. Newsletter sends to existing list.
- **Day 1:** Hacker News post (if pre-rendering is in place). Reddit and Threads engagement. Outreach to non-exclusive press.
- **Day 7:** First retrospective email to list — "Here's what happened, here's what's coming."
- **Day 14:** Second flagship city launch, repeats the cycle.

### Metrics to watch (week-by-week)

For a bootstrap launch, the only metrics that matter:

- **Email signups per day.** Target: 50–100/day in launch week, 10–25/day steady state.
- **Returning visitors %.** Target: 25%+ by week 4. Lower than that means the content isn't sticky.
- **Direct + branded search traffic.** Target: trending up week-over-week. This is the brand-equity proxy.
- **Top entry by pageviews.** This tells you which pick to lean into for press and social.
- **Referrer mix.** If 80% of traffic is one channel, you have a fragility problem.

Pageviews are a vanity metric for an editorial site this size. Don't optimize for them.

---

## Open questions before launch

A few decisions that will shape the plan and that are easier to make now than later:

- Will the site monetize at launch (affiliate, sponsorships, paid newsletter), or stay free? Affects whether you need terms-of-service sophistication, FTC disclosures, and a clearer privacy policy.
- Are you the sole editor, or is "we" a team? Press wants a name and a face. Decide what to put on an About page.
- What's the editorial release cadence after launch? Are the 10 cities the whole product for now, or are you adding entries / cities monthly? The press story is much stronger with a clear cadence.
- Will you actively respond to "you missed X" feedback, and will you ever update the list? Defining this upfront avoids a thousand small decisions later.

---

*See `PRELAUNCH_CHECKLIST.md` for the actionable, week-by-week version of this plan.*
