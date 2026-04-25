# The Fifty — Pre-Launch Checklist

A 4-week, week-by-week checklist for a bootstrap soft launch.
Companion to `LAUNCH_PLAN.md`.

Mark items as you go: `[ ]` → `[x]`.

---

## Week 1 — Foundations (no public-facing changes yet)

### Site / engineering

- [ ] Decide deploy target: Vercel **or** GitHub Pages (recommendation: Vercel). Remove the unused config. Confirm `thefiftylist.com` resolves to the chosen target.
- [ ] Pre-render the 12 routes (homepage, methodology, 10 cities). Easiest path: install `vite-plugin-prerender` or migrate to Astro. This is the single most important engineering task.
- [ ] Add `react-helmet-async` (or equivalent) so each page can set its own `<title>` and `<meta name="description">`.
- [ ] Add a favicon set (`favicon.ico`, `apple-touch-icon.png`, 512px PNG). Drop into `/public/`.
- [ ] Add a `robots.txt` allowing all crawlers, pointing to `/sitemap.xml`.
- [ ] Generate `sitemap.xml` listing all 12 routes with `lastmod` dates.
- [ ] Cache the homepage Unsplash photos locally to `/public/images/cities/` (16 images). Update homepage to reference local paths. (Optional but reduces external dependencies.)
- [ ] Add analytics (Plausible or GA4). Test that pageviews fire on route changes (SPA navigation).

### SEO metadata (per page)

- [ ] Homepage: title `The Fifty — A City Guide for People Who Don't Need a Guide`, description ~155 chars, OG image (custom 1200×630 with logo + tagline).
- [ ] Methodology: title `Methodology — The Fifty`, description, OG image.
- [ ] Each city page: title `The 50 Best Things to Do in {City} — The Fifty`, description ~155 chars summarizing the city's character, OG image (city-specific 1200×630).
- [ ] Add `<link rel="canonical">` to every page pointing at the bare path (no trailing slash, no UTM params).
- [ ] Add `<meta property="og:type" content="website">` (homepage) / `"article"` (city pages).
- [ ] Add `<meta name="twitter:card" content="summary_large_image">` everywhere.

### Structured data (JSON-LD)

- [ ] Homepage: `Organization` schema for The Fifty (name, url, logo, sameAs links to social).
- [ ] Each city page: `ItemList` schema enumerating the 50 entries with `position`, `name`, `url` (anchor link to entry).
- [ ] Each entry: `LocalBusiness` (or `Restaurant` / `LodgingBusiness` / `BarOrPub` based on category) with name, address, neighborhood, geo from `locations.json`. Use the geocoded data already in `src/locations.json`.
- [ ] Validate every page's JSON-LD with [Google's Rich Results Test](https://search.google.com/test/rich-results) before launch.

### Accessibility / image SEO

- [ ] Replace every `alt=""` with descriptive alt text. For entry images: `alt={\`${entry.name} — ${entry.category} in ${entry.neighborhood}\`}`.
- [ ] Confirm color contrast on category badges meets WCAG AA (the gold and warm-tone badges may fail on cream backgrounds).
- [ ] Test full keyboard navigation through the homepage and one city page.

### Content QA

- [ ] Verify every city has exactly 50 entries (script: `grep -c "id:" *-city-page.jsx`).
- [ ] Verify category mix per city is roughly within target (~15 Eat, ~8 Drink, ~5 Coffee, ~4 Stay, ~12 Experience, ~6 Shop).
- [ ] Spot-check 5 entries per city for: business is still open, address is correct, signature tip is current.
- [ ] Confirm photo credits are present and correct on every photographed entry.
- [ ] Run a spell + grammar pass on homepage and all city pages.

---

## Week 2 — Trust, supporting pages, and launch artifacts

### Pages to add

- [ ] **Privacy policy** at `/privacy` (Mailchimp + email collection compliance). A short, plain-English version is fine. Include: what you collect, how you use it, third parties (Mailchimp, analytics provider), how to unsubscribe, contact email.
- [ ] **Terms of service** at `/terms`. One page. Use a generator (e.g., termly.io) for the bones, then edit for voice.
- [ ] **About** at `/about`. One paragraph minimum. Who's behind this, why it exists, contact email. Link from the footer.
- [ ] **Contact** — at minimum a `hello@thefiftylist.com` mailbox set up via Cloudflare Email Routing or Google Workspace ($6/mo). Add it to the footer and the About page.
- [ ] **Press kit** at `/press` (or a downloadable PDF). One-pager with: 100-word description, 200-word about, founder bio, brand assets (logo PNG/SVG), contact for press inquiries, link to sample city.

### Brand / launch assets

- [ ] Design 11 OG images (homepage + 10 cities) at 1200×630, using brand fonts. Canva works. Each city image: city name in Playfair Display, "50" in the gold accent, a photo of the city in muted treatment.
- [ ] Design a press-kit-friendly logo set: SVG, PNG (white bg), PNG (transparent), at multiple sizes.
- [ ] Write press release / pitch email template. One per outlet category (food, travel, design, local).
- [ ] Build a simple "Coming this week" landing page or banner — keeps the password gate optional rather than a hard wall. Even a single line at the top of the homepage helps.

### Email infrastructure

- [ ] Set up a welcome email in Mailchimp triggered on signup. Voice-aligned. Include: thanks, when to expect mail, link to flagship city.
- [ ] Confirm DKIM, SPF, and DMARC records are configured for the sending domain. Send a test to `mail-tester.com` and aim for 9+/10.
- [ ] Draft launch-day broadcast email. ~250 words. Subject line: tested at least 3 variants.

### Monetization decision

- [ ] Decide: free at launch or affiliate/paid? If affiliate (e.g., reservation links earning commission), add a single-line FTC disclosure to the footer and a longer one to the privacy/terms page.
- [ ] If staying free at launch, add a soft "support us" link or paid newsletter teaser to the footer for later.

---

## Week 3 — Build the press list and partner outreach

### Press list (target: 30–40 contacts)

- [ ] 8–10 Austin-specific outlets (Austin Monthly, Austin Chronicle, Eater Austin, Austin360, Texas Monthly, KUT, KUTX, Tribeza, Do512).
- [ ] 5–6 second-flagship-city outlets (whichever you pick).
- [ ] 8–10 national food/travel writers (Eater national, Bon Appétit, Punch, Resy editorial, Conde Nast Traveler, Skift, Afar, NYT Travel).
- [ ] 5–8 design/lifestyle/general-interest newsletters (Why is this interesting?, The Browser, Read Max, Today in Tabs, Dense Discovery).
- [ ] For each: name, outlet, beat, email, last relevant story they wrote, your one-line pitch.

### Outreach emails

- [ ] Draft and personalize all 30–40 outreach emails. Don't send yet.
- [ ] Identify the **single** outlet you'll offer a 48-hour exclusive to. (Recommendation: strongest local Austin outlet, likely Eater Austin or Austin Monthly.)
- [ ] Send the exclusive offer 5–7 days before launch. Honor the embargo.

### Featured-business outreach

- [ ] Compile contact info for all 50 Austin businesses (and 50 for the second city). Public website contact forms or info@ emails are fine.
- [ ] Draft the "you're on our list" email template. Include: link, the exact quote you wrote about them, an embed badge (HTML snippet), your contact.
- [ ] Send to all 50 the day before public launch. ~10–20% will reshare; that's the expected hit rate.

### Newsletter cross-promo

- [ ] Reach out to 5–10 newsletter operators in the food/travel/design space. Offer reciprocal mention or guest post.
- [ ] Confirm 2–3 of them for launch week.

### Social account warmup

- [ ] Create / claim handles: Instagram, TikTok, Threads, BlueSky, X (defensive), Pinterest. Use `@thefiftylist` or `@thefifty` if available.
- [ ] Post 3–5 pieces of pre-launch content on Instagram/Threads (behind-the-curation, "why exactly 50?", a teaser pick from Austin). Build a small organic audience before launch day.
- [ ] Add a link-in-bio (Linktree or a simple `/links` page) pointing to homepage, Austin, methodology, signup.

---

## Week 4 — Launch week

### Monday (T-2)

- [ ] Final QA pass: Lighthouse score, PageSpeed Insights, Mobile-Friendly Test, Rich Results Test.
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools.
- [ ] Verify analytics is firing on a fresh incognito session.
- [ ] Stage the launch broadcast email in Mailchimp. Send a test to yourself.
- [ ] Last spell-check on homepage and Austin.

### Tuesday or Wednesday (Launch day)

- [ ] Remove `<PasswordGate>` from `src/main.jsx`. Push to main. Verify production deploy.
- [ ] Exclusive press piece goes live (your partner outlet publishes).
- [ ] Send launch broadcast to Mailchimp list.
- [ ] Send 50 featured-business emails (Austin batch).
- [ ] Publish 3–5 social posts (Instagram reel, TikTok narration, Threads pick, Pinterest pin, X thread).
- [ ] Personally text/DM 20 friends and ask them to share. (This is allowed and expected; do not skip it.)
- [ ] Monitor analytics in real time. Note which channels actually drive traffic.

### Thursday (T+1)

- [ ] Send the remaining 20–30 press emails (non-exclusive outlets).
- [ ] Submit "Show HN" post (only if pre-rendering is live). Title: `Show HN: The Fifty — an opinionated 50-place guide to 10 US cities`.
- [ ] Engage in 5+ relevant Reddit threads (r/Austin, r/AskAustin, r/foodNYC, etc.). Substantive answers, no spam.
- [ ] Reach out to any place you missed in Austin who DM'd asking how to be added. Don't add them yet — manage expectations.

### Friday (T+2)

- [ ] Capture early metrics: signups, top entries, referrers, search impressions. Save to a `LAUNCH_METRICS.md` for retrospectives.
- [ ] Publish a short "thank you / what's next" post on Threads or your existing platform.
- [ ] Schedule second-flagship-city launch for 10–14 days out.

### Sunday (T+4) — first retrospective

- [ ] Send a follow-up email to the list: "Here's what happened, here's what's coming." Include the second city's launch date.
- [ ] Write down what worked, what didn't. Keep the press list updated with who did and didn't cover.
- [ ] If a piece of press blew up, capitalize: pitch a follow-up to that writer for the second city.

---

## Recurring (post-launch, weekly)

- [ ] One Substack/journal post per month (see content cadence in LAUNCH_PLAN.md).
- [ ] Three social posts per week per platform, focused on the current flagship city.
- [ ] Five Reddit / forum substantive comments per week.
- [ ] One newsletter cross-promo per month.
- [ ] Monthly metrics review. Compare against the targets in LAUNCH_PLAN.md Part 3.

---

## Definition of "ready to launch"

The site is ready to come off the password gate when:

- All Critical SEO items in `LAUNCH_PLAN.md` Part 2 are fixed.
- Pre-rendering (or SSG) is in place. Social previews work — test with the [Open Graph debugger](https://www.opengraph.xyz/) on every public URL.
- Analytics is live and verified.
- Privacy, terms, and about pages exist and link from the footer.
- A launch-day press piece is committed and scheduled.
- The Mailchimp welcome email and launch broadcast are staged.

Anything below this bar is fine to ship after launch. Anything above is gold-plating.
