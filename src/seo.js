// Centralized SEO metadata for all 12 routes.
// Used by <PageMeta /> to render <title>, <meta>, OG, Twitter, canonical, JSON-LD.

export const SITE = {
  name: "The Fifty",
  baseUrl: "https://thefiftylist.com",
  twitter: "@thefiftylist", // update if/when handle changes
  defaultOgImage: "/og/home.png",
  organizationLogo: "/og/logo-square.png",
  description:
    "Hand-picked 50-place guides to America's best cities. No chains, no tourist traps — only the spots locals actually love.",
};

// Per-route metadata. Keys match the route path (without leading slash for cities).
export const ROUTES = {
  home: {
    path: "/",
    title: "The Fifty — A City Guide for People Who Don't Need a Guide",
    description:
      "Hand-picked 50-place guides to America's best cities. No chains, no tourist traps — only the spots locals actually love. Eat, drink, sleep, do.",
    ogImage: "/og/home.png",
    ogType: "website",
  },
  methodology: {
    path: "/methodology",
    title: "Methodology — The Fifty",
    description:
      "How we pick exactly 50. Our editorial standards, why no top-200 lists, and the local-first reporting that goes into every city guide.",
    ogImage: "/og/methodology.png",
    ogType: "article",
  },
  "photo-credits": {
    path: "/photo-credits",
    title: "Photo Credits — The Fifty",
    description:
      "Photo attributions and image credits for The Fifty. All photographs sourced via Google Places and credited to their original photographers.",
    ogImage: "/og/home.png",
    ogType: "article",
  },
  about: {
    path: "/about",
    title: "About — The Fifty",
    description:
      "Why The Fifty exists, who's behind it, and how to reach us. A small editorial project run by people who actually live in the cities they cover.",
    ogImage: "/og/home.png",
    ogType: "article",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy — The Fifty",
    description:
      "What information The Fifty collects, how we use it, and the choices you have. Plain English, no dark patterns. We try to collect as little as possible.",
    ogImage: "/og/home.png",
    ogType: "article",
  },
  terms: {
    path: "/terms",
    title: "Terms of Service — The Fifty",
    description:
      "The terms governing use of The Fifty. What we offer, what you can and can't do with our content, and the standard legal protections.",
    ogImage: "/og/home.png",
    ogType: "article",
  },
};

// Cities — keyed by slug. `cityName` is the display name, `headerTagline` is the
// short editorial pitch already used in nav/cards. `metaIntro` is the ~155-char SEO
// description (visible in search snippets).
export const CITIES = {
  "new-york": {
    cityName: "New York",
    title: "The 50 Best Things to Do in New York — The Fifty",
    description:
      "50 hand-picked New York spots beyond the tourist traps: the bagel shops, jazz dives, walk-in restaurants, and small museums real New Yorkers swear by.",
    ogImage: "/og/new-york.png",
  },
  austin: {
    cityName: "Austin",
    title: "The 50 Best Things to Do in Austin — The Fifty",
    description:
      "An insider's 50-spot Austin guide: the breakfast tacos, dive bars, hill country swimming holes, and live music venues that locals actually love.",
    ogImage: "/og/austin.png",
  },
  nashville: {
    cityName: "Nashville",
    title: "The 50 Best Things to Do in Nashville — The Fifty",
    description:
      "Past the neon: 50 Nashville spots beyond Broadway. The hot chicken joints, songwriter rounds, dive bars, and meat-and-threes locals actually visit.",
    ogImage: "/og/nashville.png",
  },
  chicago: {
    cityName: "Chicago",
    title: "The 50 Best Things to Do in Chicago — The Fifty",
    description:
      "50 Chicago picks from people who live here: Italian beef, Hyde Park bookstores, dive bars, lakefront jaunts, and neighborhood gems beyond the Loop.",
    ogImage: "/og/chicago.png",
  },
  "los-angeles": {
    cityName: "Los Angeles",
    title: "The 50 Best Things to Do in Los Angeles — The Fifty",
    description:
      "An LA guide for people who actually drive here: 50 spots from Highland Park taco trucks to Mid-Wilshire haunts. Worth every freeway mile.",
    ogImage: "/og/los-angeles.png",
  },
  seattle: {
    cityName: "Seattle",
    title: "The 50 Best Things to Do in Seattle — The Fifty",
    description:
      "50 Seattle picks for rain or shine: third-wave coffee, Pike Place sleeper hits, Ballard dive bars, and hidden Cascade trails locals love.",
    ogImage: "/og/seattle.png",
  },
  "san-francisco": {
    cityName: "San Francisco",
    title: "The 50 Best Things to Do in San Francisco — The Fifty",
    description:
      "Seven miles square, perfectly distilled: 50 SF spots from Mission burritos to North Beach old guard, with the Outer Sunset gems most guides miss.",
    ogImage: "/og/san-francisco.png",
  },
  miami: {
    cityName: "Miami",
    title: "The 50 Best Things to Do in Miami — The Fifty",
    description:
      "Past the velvet rope: 50 Miami picks beyond South Beach. The Cuban coffee windows, Allapattah galleries, and Little River dive bars locals love.",
    ogImage: "/og/miami.png",
  },
  portland: {
    cityName: "Portland",
    title: "The 50 Best Things to Do in Portland — The Fifty",
    description:
      "Still keeping it weird: 50 Portland spots from food cart pods to Powell's marathons, divey beer bars to Forest Park trails. By someone who lives here.",
    ogImage: "/og/portland.png",
  },
  denver: {
    cityName: "Denver",
    title: "The 50 Best Things to Do in Denver — The Fifty",
    description:
      "Mile-high standards: 50 Denver picks from RiNo breweries to Cap Hill dive bars to Front Range trailheads. The list locals send to their friends.",
    ogImage: "/og/denver.png",
  },
};

// Map a category to the most specific Schema.org LocalBusiness subtype.
export function categoryToSchemaType(category) {
  switch (category) {
    case "Eat":
      return "Restaurant";
    case "Drink":
      return "BarOrPub";
    case "Coffee":
      return "CafeOrCoffeeShop";
    case "Stay":
      return "LodgingBusiness";
    case "Shop":
      return "Store";
    case "Experience":
      return "TouristAttraction";
    default:
      return "LocalBusiness";
  }
}
