import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";
import { subscribeEmail } from "./src/mailchimp.js";
import CityMap from "./src/CityMap.jsx";
import LOCATIONS from "./src/locations.json";

const CITY_PHOTOS = PHOTOS["san-francisco"] || {};
const CITY_LOCATIONS = LOCATIONS["san-francisco"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "Mission District", "Hayes Valley", "NoPa", "North Beach", "Chinatown", "Nob Hill", "Pacific Heights", "Inner Sunset", "Dogpatch", "Noe Valley", "SoMa"];

const ENTRIES = [
  {
    id: 1,
    name: "Tartine Bakery",
    category: "Coffee",
    neighborhood: "Mission District",
    description: "The line out the door at 18th and Guerrero is a San Francisco institution for a reason. Chad Robertson's bread changed the way a generation thinks about flour and water, and the morning bun — caramelized orange sugar, shatteringly crisp — is the single best pastry in the city. The space is tiny. The wait is real. None of that matters once you're holding that first bite.",
    signature: "Get there at 7:30am on a weekday. The morning bun sells out by 10. Pair it with a cappuccino and stand outside — the Mission light does the rest.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 2,
    name: "Zuni Café",
    category: "Eat",
    neighborhood: "Hayes Valley",
    description: "The roast chicken for two at Zuni is the most famous dish in San Francisco, and it deserves every word ever written about it. Order it first — it takes an hour — then eat the Caesar and oysters while you wait. The copper bar is one of the great seats in American dining. Judy Rodgers built this place, and even after her passing it remains immaculate.",
    signature: "The roast chicken with bread salad, obviously. Order it the moment you sit down, then let the kitchen set the pace.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "City Lights Booksellers",
    category: "Shop",
    neighborhood: "North Beach",
    description: "Lawrence Ferlinghetti's cathedral of independent thought has been on Columbus Avenue since 1953. The poetry room upstairs is sacred ground — a low-ceilinged space with a sign that reads 'I sit here and am content.' The curated shelves are still defiantly literary, political, and strange in the best way. This is not a bookstore. It's a manifesto with a cash register.",
    signature: "Go upstairs to the poetry room. Sit in the chair by the window. Read something you wouldn't normally pick up.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 4,
    name: "Golden Gate Park",
    category: "Experience",
    neighborhood: "Inner Sunset",
    description: "Bigger than Central Park and wilder in every sense. The western end is fog and cypress and emptiness — you can walk for an hour and barely see another person. The eastern end has world-class museums, a botanical garden, and bison. Yes, bison. A city park that contains genuine wilderness, art, and large mammals. San Francisco in a nutshell.",
    signature: "Rent a bike and ride from the Panhandle to Ocean Beach. Stop at the bison paddock. Nobody believes it's real until they see it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 5,
    name: "State Bird Provisions",
    category: "Eat",
    neighborhood: "Pacific Heights",
    description: "Dim sum service meets California cooking in a tiny Fillmore Street storefront that redefined how San Francisco eats. The kitchen sends out trays of small plates — quail with stewed onions, sesame pancakes, garlic bread with burrata — and you point at what you want. It's controlled chaos and every single thing is thrilling. The reservation is the hardest in the city. Keep trying.",
    signature: "Say yes to the state bird — the fried quail with provisions. It's the namesake dish and worth the entire visit.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 6,
    name: "Trick Dog",
    category: "Drink",
    neighborhood: "Mission District",
    description: "A cocktail bar that reinvents its menu every six months around a different theme — a pantone chart, a children's book, a high school yearbook. The gimmick could be exhausting but it's not, because the drinks are deadly serious underneath the wit. The room is casual, the bartenders are fast, and the back patio is one of the best outdoor drinking spots in the city.",
    signature: "Sit at the bar. Tell them what spirits you lean toward and let them choose. The off-menu riffs are better than most bars' entire programs.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "The Hotel Vitale",
    category: "Stay",
    neighborhood: "SoMa",
    description: "Now operating as 1 Hotel San Francisco, this waterfront property on the Embarcadero wakes you up with bay views and the sound of the Ferry Building market stirring to life next door. The rooms are calm, the rooftop soaking tubs are real, and the location — steps from the water, the ferries, and the best farmers market in California — is unbeatable.",
    signature: "Book a bay-view room on a high floor. Walk to the Ferry Building for coffee before the city wakes up.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 8,
    name: "Bi-Rite Creamery",
    category: "Eat",
    neighborhood: "Mission District",
    description: "A scoop shop on 18th Street that somehow makes ice cream that tastes like the actual fruit it's named after. The salted caramel is a modern San Francisco icon — sweet, bitter, saline, perfect. The line wraps around the corner on summer weekends and nobody complains because everyone knows it moves fast and the reward is worth the wait.",
    signature: "Salted caramel in a cup. Honey lavender if you're feeling adventurous. Take it across the street to Dolores Park.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 9,
    name: "Tosca Cafe",
    category: "Drink",
    neighborhood: "North Beach",
    description: "This North Beach saloon has been pouring since 1919, and the red leather booths and jukebox full of opera still feel like a movie set from a better era. The house cappuccino is spiked with brandy and chocolate — no coffee at all — and it's been warming up San Franciscans since Prohibition. Ken Friedman's revival added a serious kitchen, but the bar remains the soul of the place.",
    signature: "The house cappuccino — brandy, chocolate, steamed milk, no coffee. It sounds wrong. It's perfect.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 10,
    name: "Sightglass Coffee",
    category: "Coffee",
    neighborhood: "SoMa",
    description: "The SoMa flagship is a cathedral of coffee — soaring ceilings, an in-house roaster you can watch turning, and natural light that would make an architect weep. The Affogato Bar upstairs is a quiet revelation. Brothers Jerad and Justin Morrison built this from a garage roastery and you can taste the obsession in every cup. This is third-wave coffee that doesn't need to explain itself.",
    signature: "Go upstairs to the Affogato Bar. The espresso over vanilla bean ice cream is transcendent, morning or afternoon.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "Lazy Bear",
    category: "Eat",
    neighborhood: "Mission District",
    description: "A dinner party disguised as a restaurant. You gather in an upstairs loft for cocktails, then descend to communal tables for a multi-course tasting menu that's simultaneously highbrow and deeply Californian. Chef David Barzelay's food is technically brilliant but served with a warmth that makes two Michelin stars feel like a house party. There are no substitutions. Just trust.",
    signature: "The communal seating is the point, not a compromise. Talk to the strangers next to you — half the regulars met their best friends here.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 12,
    name: "Dolores Park",
    category: "Experience",
    neighborhood: "Mission District",
    description: "San Francisco's living room. On a sunny afternoon — and in the Mission, there are more than you'd think — the entire city decamps to this south-facing hillside with blankets, speakers, and whatever the corner store had on sale. The downtown skyline view is cinematic, the people-watching is Olympic-level, and the energy is pure communal joy. Bring a jacket for when the fog rolls in at 4pm.",
    signature: "Grab supplies at Bi-Rite Market across the street. Stake out the upper southwest corner for the best view and the most sun.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 13,
    name: "Swan Oyster Depot",
    category: "Eat",
    neighborhood: "Nob Hill",
    description: "Eighteen stools at a marble counter. That's it. That's been it since 1912. The brothers behind the bar shuck oysters, crack crab, and ladle chowder with a speed and humor that makes you feel like you've wandered into someone's private fishing club. There's no reservation, no app, no workaround — just a line that starts forming at 9am for an 10:30 open. The combination crab salad is the best thing you'll eat standing up.",
    signature: "Get in line by 9:30am. Order the combination plate and a Dungeness crab back. Bring cash — they don't take cards.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 14,
    name: "Ritual Coffee Roasters",
    category: "Coffee",
    neighborhood: "Mission District",
    description: "The Valencia Street original that helped kickstart San Francisco's specialty coffee scene. Ritual was doing single-origin pour-overs before most people knew what that meant, and the roasting program remains one of the most precise in the country. The café itself is a social hub — laptops, conversations, the particular hum of the Mission in motion.",
    signature: "The seasonal single-origin pour-over, whatever it is. Ask the barista what just came in — they're genuinely excited to tell you.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 15,
    name: "Ferry Building Marketplace",
    category: "Experience",
    neighborhood: "SoMa",
    description: "The Beaux-Arts clock tower on the waterfront houses the best food hall in America. Cowgirl Creamery, Acme Bread, Hog Island Oysters, Blue Bottle's first brick-and-mortar — it's a murderer's row of Northern California producers under one roof. On Saturday mornings the outdoor farmers market transforms the surrounding plaza into a temple of seasonal abundance. Come hungry, leave slowly.",
    signature: "Saturday morning farmers market. Start with oysters and Champagne at Hog Island, then graze your way through every stall.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 16,
    name: "Mister Jiu's",
    category: "Eat",
    neighborhood: "Chinatown",
    description: "Brandon Jew's Chinatown restaurant sits in the space that once housed Four Seas, a banquet hall where his grandparents celebrated their wedding. The food honors that lineage while pushing in every direction — Dungeness crab rice noodles, smoked quail, a hot-and-sour soup that rewires your understanding of the dish. It's Chinese-American fine dining that feels both deeply rooted and entirely new.",
    signature: "The cheung fun with Dungeness crab and the whole roasted duck are the moves. Don't skip the sesame balls for dessert.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 17,
    name: "Alcatraz Island",
    category: "Experience",
    neighborhood: "North Beach",
    description: "Yes, it's the most famous thing in the bay. Yes, it's still worth going. The audio tour — narrated by former guards and inmates — is genuinely gripping, the views of the city from the cellblock are staggering, and the gardens planted by prisoners' families are unexpectedly moving. Book the night tour if you can; the island at dusk, with the city lights across the water, is hauntingly beautiful.",
    signature: "Book the night tour at least two weeks in advance. The evening ferry crossing alone is worth the price.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 18,
    name: "Nopa",
    category: "Eat",
    neighborhood: "NoPa",
    description: "A wood-fired neighborhood restaurant on Divisadero that's been quietly essential since 2006. The organic, wood-oven cooking turns simple ingredients into something that tastes like the best version of itself — a pork chop, a flatbread, a plate of vegetables that makes you reconsider vegetables. The late-night kitchen, open until 1am, is a godsend in a city that used to shut down early.",
    signature: "The wood-oven-roasted pork chop with apple and radicchio. Go after 10pm on a weeknight when the room loosens up.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 19,
    name: "Amoeba Music",
    category: "Shop",
    neighborhood: "Hayes Valley",
    description: "The Haight Street location is a warehouse-sized temple of music — new and used vinyl, CDs, DVDs, and memorabilia spread across a floor plan that demands exploration. The prices are fair, the staff actually knows music, and the in-store performances draw real acts. In a city that keeps losing its cultural infrastructure, Amoeba endures as proof that physical media still matters.",
    signature: "Check the events calendar for free in-store performances. The used vinyl bins in the back are where the real finds live.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Lands End Trail",
    category: "Experience",
    neighborhood: "Inner Sunset",
    description: "A coastal trail along the city's wild northwest edge that feels like it belongs on the Big Sur coastline, not inside city limits. Rugged cliffs, cypress groves, the ruins of the Sutro Baths, and a view of the Golden Gate Bridge that earns every step. On a foggy morning, the foghorn sound and the crashing surf below create something close to sacred. This is the San Francisco tourists never see.",
    signature: "Start at the Sutro Baths ruins and walk east. The Labyrinth at Eagle Point — a rock spiral on the cliff's edge — is a hidden gem within a hidden gem.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "The Interval at Long Now",
    category: "Drink",
    neighborhood: "SoMa",
    description: "A bar and café inside the headquarters of the Long Now Foundation, a nonprofit dedicated to long-term thinking. The space houses a prototype of a 10,000-year clock, a library curated to last centuries, and a cocktail menu that's more thoughtful than most philosophy departments. It's the most intellectually stimulating place to drink in San Francisco, possibly anywhere.",
    signature: "Order the manual of civilizations — a cocktail menu organized by era. Sit near the clock prototype and think about deep time.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 22,
    name: "Che Fico",
    category: "Eat",
    neighborhood: "Noe Valley",
    description: "David Nayfeld's Italian restaurant on Divisadero is the kind of place that makes you wonder why every city doesn't have a wood-fired, handmade-pasta joint this good. The cacio e pepe is impossibly silky, the wood-oven pizzas crackle, and the salumi program — cured in-house — could stand alongside anything in Emilia-Romagna. The room runs loud and warm and that's part of the deal.",
    signature: "The focaccia di Recco with stracchino cheese is the best thing to order first. Then the cacio e pepe. Then whatever they tell you to get.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 23,
    name: "Tartine Manufactory",
    category: "Eat",
    neighborhood: "Dogpatch",
    description: "The big sister to the Mission bakery — a full restaurant, ice cream counter, and coffee bar inside a converted warehouse in Dogpatch. The space is industrial and gorgeous, the bread program is as flawless as ever, and the dinner menu leans Mediterranean in a way that feels exactly right for Northern California. It's Tartine grown up, not sold out.",
    signature: "The smorrebrods at lunch — open-faced tartines on Tartine bread with seasonal toppings. The simplest things here are the best.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 24,
    name: "ABV",
    category: "Drink",
    neighborhood: "Mission District",
    description: "A cocktail bar on 16th Street that takes its spirits as seriously as a Michelin kitchen takes its produce. The menu is encyclopedic — organized by spirit, era, and flavor profile — and the bartenders can riff on a classic or build you something entirely new without breaking stride. The bar snacks are absurdly good for a place that's technically not a restaurant.",
    signature: "The bar snacks menu is secretly one of the best in the Mission. The fried chicken sandwich at a cocktail bar shouldn't be this good.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 25,
    name: "San Francisco Museum of Modern Art",
    category: "Experience",
    neighborhood: "SoMa",
    description: "SFMOMA's 2016 expansion tripled the gallery space and made it one of the largest modern art museums in the country. The photography collection is world-class, the Fisher Collection fills entire floors with blue-chip contemporary work, and the living wall on the third-floor terrace is a vertical garden that stops you mid-step. Free to the public on the first floor — including a Richard Serra you can walk through.",
    signature: "Start on the first floor for free — the Serra sculpture and the rotating installations are worth the visit alone. Then buy a ticket and head up.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 26,
    name: "Four Barrel Coffee",
    category: "Coffee",
    neighborhood: "Mission District",
    description: "Now operating as Tide Coffee, this Valencia Street roaster remains one of the finest in the city. The high-ceilinged industrial space is beautiful, the espresso is pulled with an intensity that borders on ritual, and the single-origin options rotate with a roaster's curiosity that keeps regulars coming back. No Wi-Fi, by design — this is a place for drinking coffee, not working.",
    signature: "The espresso. Just the espresso. Drink it at the bar, standing up, the way it was meant to be consumed.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 27,
    name: "Liholiho Yacht Club",
    category: "Eat",
    neighborhood: "Nob Hill",
    description: "Chef Ravi Kapur's love letter to his Hawaiian-Indian-Chinese-San Franciscan upbringing. The name sounds like a tiki bar but the food is dead serious — bossam with kimchi, beef tongue fried rice, tuna poke that recalibrates what you think poke can be. The room is loud, the cocktails are tropical without being silly, and nothing else in the city tastes remotely like this.",
    signature: "The bossam and the tuna poke are non-negotiable starters. Trust the kitchen on everything else.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 28,
    name: "Smuggler's Cove",
    category: "Drink",
    neighborhood: "Hayes Valley",
    description: "A three-story tiki bar on Gough Street that houses over 400 rums and serves cocktails that trace the entire history of rum across the Caribbean, the Pacific, and beyond. The room is dark, nautical, and wonderfully theatrical — shipwreck wood, flickering candles, the occasional flaming drink. Martin Cate literally wrote the book on tiki, and this is his masterpiece.",
    signature: "Order the Chartreuse Swizzle if the rum list overwhelms you. Then ask Martin or the bartender to guide you through a rum flight.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "The Cavalier",
    category: "Eat",
    neighborhood: "SoMa",
    description: "A British-inflected brasserie in the Hotel Zetta that manages to make things like deviled eggs, fish and chips, and steak tartare feel both classic and entirely modern. The room is gorgeous — tufted leather, brass fixtures, a long bar made for lingering. Anna Weinberg and Jennifer Puccio built a restaurant that feels like it's been here for decades, which is the highest compliment.",
    signature: "The burger at lunch is one of the best in SoMa. The sticky toffee pudding at dinner is mandatory.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 30,
    name: "Hotel Drisco",
    category: "Stay",
    neighborhood: "Pacific Heights",
    description: "A 48-room boutique hotel in a 1903 Edwardian building on one of the most beautiful residential blocks in the city. The views of the Presidio and the bay from the upper floors are staggering. The service is old-school in the best way — evening wine hour, complimentary town car, staff who remember your name. It's like staying at a wealthy aunt's house, if your aunt had impeccable taste.",
    signature: "Request a room with a bay view. The complimentary evening wine and cheese hour in the parlor is not to be missed.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 31,
    name: "Burma Superstar",
    category: "Eat",
    neighborhood: "Inner Sunset",
    description: "The restaurant that introduced San Francisco to Burmese food, and the tea leaf salad that launched a thousand imitations. The rainbow salad — fermented tea leaves, fried garlic, peanuts, sesame, dried shrimp, tossed tableside — is one of the most-ordered dishes in the city for a reason. The Clement Street original still has lines, but the food is worth every minute.",
    signature: "The tea leaf salad and the coconut chicken noodle soup. Together. That's the meal. Don't complicate it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 32,
    name: "The Battery",
    category: "Experience",
    neighborhood: "North Beach",
    description: "A private members' club in a converted 1907 Barbary Coast building, but the ground-floor restaurant and bar are open to hotel guests. The penthouse rooftop has one of the most stunning views in the city — the Transamerica Pyramid, the bay, and Coit Tower framed like a postcard. The cultural programming — film screenings, author talks, art shows — punches well above its weight.",
    signature: "If you can get in, the rooftop at sunset. If not, book a room and gain access to the restaurant and rooftop that way.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 33,
    name: "Coit Tower",
    category: "Experience",
    neighborhood: "North Beach",
    description: "The art deco column on Telegraph Hill is worth the climb for the WPA murals alone — Depression-era frescoes that tell the story of California labor, agriculture, and industry with a political edge that still feels urgent. The 360-degree view from the top is the best panorama in the city. The wild parrots that live on the hill are a bonus you didn't know you needed.",
    signature: "Walk up the Filbert Steps from Levi's Plaza. The gardens are stunning and you'll arrive at the tower from the most beautiful angle.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 34,
    name: "Noe Valley Bakery",
    category: "Coffee",
    neighborhood: "Noe Valley",
    description: "A neighborhood bakery that's been on 24th Street since 1994, turning out some of the most honest pastries and breads in the city. No Instagram gimmicks, no fusion experiments — just perfectly laminated croissants, fruit tarts made with whatever's at the market, and sourdough that could hold its own against anyone in town. This is the kind of place that makes a neighborhood feel like a village.",
    signature: "The morning croissant and a drip coffee. Eat it on the bench outside and watch 24th Street come alive.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 35,
    name: "Whitechapel",
    category: "Drink",
    neighborhood: "SoMa",
    description: "A gin bar built inside a decommissioned Victorian tube station. That sounds absurd, and it is — brass fittings, tiled arches, the whole London Underground fantasy rendered in obsessive detail beneath the streets of SoMa. The gin collection is one of the largest in the world, and the cocktails range from perfectly classic to wildly inventive. It's theatrical without being corny.",
    signature: "Ask the bartender for a gin flight based on style — London Dry, Old Tom, genever. They'll build you a tour of the entire spirit.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 36,
    name: "Heath Ceramics",
    category: "Shop",
    neighborhood: "Dogpatch",
    description: "Edith Heath started making her modernist ceramics in Sausalito in 1948, and the Dogpatch showroom and factory — where you can watch the pieces being made — is a pilgrimage site for anyone who cares about design. The glazes are iconic, the seconds sales are legendary, and buying a Heath mug is the moment you realize you care about pottery. Welcome to that life.",
    signature: "Visit the factory floor — the free self-guided tour lets you watch every stage of production. The seconds sale happens a few times a year; sign up for the mailing list.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Presidio Tunnel Tops",
    category: "Experience",
    neighborhood: "Pacific Heights",
    description: "The newest addition to the Presidio — 14 acres of parkland built on top of the tunnels connecting the Golden Gate Bridge to the city. The views of the bridge, the bay, and Alcatraz are postcard-perfect, there's a nature playground that makes every kid in the city lose their mind, and the Field Station restaurant serves excellent food with some of the best outdoor seating in San Francisco.",
    signature: "Sunday morning. Bring a coffee, find a spot on the lawn facing the bridge. The Crissy Field trail connects directly if you want to extend the walk.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 38,
    name: "Benu",
    category: "Eat",
    neighborhood: "SoMa",
    description: "Corey Lee's three-Michelin-star tasting menu restaurant is the most technically accomplished kitchen in San Francisco. The food draws from Lee's Korean heritage, his years at The French Laundry, and a restless creativity that makes every visit feel like the first. The faux shark fin soup — a vegetarian riff on a controversial classic — is a masterclass in culinary commentary. This is fine dining at its most thoughtful.",
    signature: "Book the counter seats facing the kitchen if available. The choreography of the plating is half the experience.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 39,
    name: "Golden Gate Bridge",
    category: "Experience",
    neighborhood: "Pacific Heights",
    description: "Walk it. Don't just photograph it from a scenic overlook and move on. The 1.7-mile crossing takes thirty minutes and puts you face-to-face with the engineering, the wind, the fog rolling through the towers, and the terrifying, exhilarating drop to the water below. It's the most iconic bridge in the world and it earns the title step by step.",
    signature: "Walk from the San Francisco side to the Vista Point on the Marin side. Turn around. The city view from the north tower is the one they put on postcards.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 40,
    name: "El Farolito",
    category: "Eat",
    neighborhood: "Mission District",
    description: "At 2am on a Friday, there's a line out the door at 24th and Mission, and everyone in it knows exactly what they want: the super burrito or the quesadilla suiza. El Farolito is the late-night taqueria that every other late-night taqueria wishes it could be. The al pastor is smoky and perfect, the salsa verde could strip paint in the best way, and the fluorescent-lit room is a cathedral of no-nonsense satisfaction.",
    signature: "The super burrito with al pastor, or the quesadilla suiza. After midnight, when the room is full of people who've made the same correct decision.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 41,
    name: "The Line SF",
    category: "Stay",
    neighborhood: "SoMa",
    description: "Housed in a 1907 building that was one of the first constructed after the earthquake, The Line channels that resilience into a design hotel with serious cultural programming. The ground-floor restaurant, Alfred's Steakhouse, is a San Francisco institution reborn. The rooms are minimal, the art rotates, and the location — Tenderloin-adjacent, walking distance to everything — puts you in the real city, not the tourist version.",
    signature: "Request a corner room on a high floor. The city views and natural light make the minimal design sing.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 42,
    name: "Dandelion Chocolate",
    category: "Shop",
    neighborhood: "Mission District",
    description: "A bean-to-bar chocolate factory on Valencia Street where you can watch every step of the process — from roasting cacao beans to wrapping finished bars — through a glass wall while you drink some of the best hot chocolate on the West Coast. The single-origin bars taste like the places they come from, and the factory tour is a quiet education in obsession.",
    signature: "The hot chocolate with house-made marshmallow. Then buy a Mission de San Jose bar — their signature origin — to take home.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 43,
    name: "Nopalito",
    category: "Eat",
    neighborhood: "Inner Sunset",
    description: "A modern Mexican restaurant from the Nopa team that sources organic ingredients with the same obsessiveness but serves them in a casual, counter-service-adjacent format. The pozole is deeply comforting, the carnitas are braised to obscene tenderness, and the horchata tastes like it was made by someone's grandmother who happened to attend culinary school. Both locations are excellent; the Inner Sunset spot is quieter.",
    signature: "The pozole rojo and a house horchata. On a foggy Inner Sunset afternoon, there's nothing better within a mile of the park.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 44,
    name: "The Exploratorium",
    category: "Experience",
    neighborhood: "SoMa",
    description: "A hands-on science museum on Pier 15 that's equally beloved by seven-year-olds and stoned adults, and that's not an insult — it's the highest compliment. The Tactile Dome, the fog bridge, the tinkering studio — every exhibit assumes you're curious and smart and willing to touch things. Thursday night After Dark sessions turn it into the best adults-only night out in the city.",
    signature: "Thursday night After Dark: 18+, cocktails, all the exhibits. It's a date night that makes you both smarter.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 45,
    name: "Gravel & Gold",
    category: "Shop",
    neighborhood: "Mission District",
    description: "A tiny shop on 21st Street that blends handmade clothing, small-press art books, ceramics, and oddities into a collection that feels like browsing someone's impossibly cool apartment. Everything is made by independent artists and small producers, and the rotating gallery in the back adds a layer of discovery that makes every visit feel different.",
    signature: "The hand-printed textiles and the zine rack by the register. You'll walk out with something small and perfect you didn't know existed.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "House of Shields",
    category: "Drink",
    neighborhood: "SoMa",
    description: "A 1908 saloon across from the Palace Hotel that somehow never got polished into a theme bar. The tin ceiling is original, the mahogany bar has been standing longer than most of the city, and the bartenders pour proper cocktails without a lecture. It's SF bar history you can drink in.",
    signature: "Order a Sazerac and sit at the bar. Ask about the statues in the wall niches — there's a legend involving a body once hidden there, and someone will tell it to you.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 47,
    name: "Cable Cars",
    category: "Experience",
    neighborhood: "Nob Hill",
    description: "The last manually operated cable car system in the world, and riding one is the rare tourist experience that delivers exactly what it promises. The Powell-Hyde line climbs Nob Hill and descends toward the bay with a view that makes your stomach drop. Yes, the lines are long. Ride it anyway. Grip the pole, lean out, and let the city rush past. Some clichés are clichés because they're perfect.",
    signature: "Take the Powell-Hyde line. Stand on the running board, not inside the car. The descent toward Aquatic Park is the money shot.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 48,
    name: "Alexander Book Company",
    category: "Shop",
    neighborhood: "SoMa",
    description: "Three floors of independent bookselling on 2nd Street that's survived downtown's every transformation for over 30 years. The selection is deep and sharp — serious literature on one floor, children's and art on another — and the staff actually reads the books they recommend. In a neighborhood overrun by chains and tech offices, it's a reminder of what retail used to feel like.",
    signature: "The staff picks shelf near the front door is always worth a look. If you have a specific book in mind, they'll find it or order it — the kind of service most bookstores forgot how to do.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "The Proper Hotel",
    category: "Stay",
    neighborhood: "SoMa",
    description: "Kelly Wearstler designed the interiors of this 131-room hotel in a 1904 flatiron building, and every floor has a different aesthetic — Parisian salon, Scandinavian lodge, Moroccan riad. The rooftop bar, Charmaine's, has panoramic city views and cocktails worth the elevator ride. It's a design statement that never forgets it's supposed to be a place where you sleep well.",
    signature: "Book through the hotel directly for a Wearstler-designed floor. Drinks at Charmaine's rooftop bar at sunset are obligatory.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 50,
    name: "Park Life",
    category: "Shop",
    neighborhood: "Inner Sunset",
    description: "Part gallery, part bookshop, part design store on Clement Street that stocks the kind of objects, art prints, and publications that make you realize most gift shops have been lying to you. The gallery in the back rotates shows from emerging and mid-career artists, and the book selection — heavy on art, design, photography, and counterculture — is curated with serious intent.",
    signature: "The limited-edition art prints in the back gallery. They rotate frequently and sell out fast — if you see something you love, buy it then.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

const getCategoryColor = (cat) => {
  const map = {
    Coffee: { bg: "rgb(180,130,80)", text: "#fff" },
    Eat: { bg: "rgb(168,60,50)", text: "#fff" },
    Stay: { bg: "rgb(55,90,100)", text: "#fff" },
    Experience: { bg: "rgb(90,110,70)", text: "#fff" },
    Shop: { bg: "rgb(140,100,130)", text: "#fff" },
    Drink: { bg: "rgb(150,80,90)", text: "#fff" },
  };
  return map[cat] || { bg: "#555", text: "#fff" };
};

const getActionLabel = (type) => {
  const map = { reserve: "Reserve a Table", book: "Book a Room", directions: "Get Directions", learn: "Learn More" };
  return map[type] || "Learn More";
};

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 7h12M8 2l5 5-5 5" />
  </svg>
);

const GridIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={active ? "#1a1a1a" : "#999"} strokeWidth="1.5">
    <rect x="1" y="1" width="6" height="6" rx="1" />
    <rect x="11" y="1" width="6" height="6" rx="1" />
    <rect x="1" y="11" width="6" height="6" rx="1" />
    <rect x="11" y="11" width="6" height="6" rx="1" />
  </svg>
);

const ListIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={active ? "#1a1a1a" : "#999"} strokeWidth="1.5">
    <line x1="1" y1="3" x2="17" y2="3" />
    <line x1="1" y1="7.5" x2="17" y2="7.5" />
    <line x1="1" y1="12" x2="17" y2="12" />
    <line x1="1" y1="16.5" x2="17" y2="16.5" />
  </svg>
);

// ─── Image Placeholders (using colored SVGs) ────────────────────────────────

const PlaceholderImage = ({ index, size = "full", photo }) => {
  if (photo?.src) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#eee" }}>
        <img
          src={photo.src}
          alt=""
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {photo.credit && (
          <div style={{
            position: "absolute",
            bottom: 4,
            right: 6,
            fontSize: 9,
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 1px 2px rgba(0,0,0,0.7)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: 0.3,
            pointerEvents: "none",
          }}>
            Photo: {photo.credit}
          </div>
        )}
      </div>
    );
  }
  const palettes = [
    { bg: "#C4A882", accent: "#A68B6B" },
    { bg: "#8B9DAF", accent: "#6E839A" },
    { bg: "#A89B8C", accent: "#8D7F6F" },
    { bg: "#7A9B8E", accent: "#5F8474" },
    { bg: "#B8967A", accent: "#9D7B5F" },
    { bg: "#9A8BA0", accent: "#7F7088" },
    { bg: "#88A0A8", accent: "#6D8790" },
    { bg: "#B0927A", accent: "#957760" },
    { bg: "#8CA88E", accent: "#718F73" },
    { bg: "#A8988A", accent: "#8D7D6F" },
    { bg: "#96A0B8", accent: "#7B85A0" },
    { bg: "#A8907A", accent: "#8D7560" },
  ];
  const p = palettes[index % palettes.length];
  const w = size === "thumb" ? 120 : 400;
  const h = size === "thumb" ? 120 : 260;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: p.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -20, right: -20, width: w * 0.6, height: w * 0.6, borderRadius: "50%", backgroundColor: p.accent, opacity: 0.4 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "'Georgia', serif", letterSpacing: 1, textTransform: "uppercase" }}>
        photo
      </div>
    </div>
  );
};

// ─── Hero ────────────────────────────────────────────────────────────────────

const Hero = () => (
  <header style={{ position: "relative", width: "100%", height: "min(75vh, 680px)", overflow: "hidden" }}>
    {/* Cinematic background */}
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(135deg, #3a3025 0%, #5a4535 25%, #4a5540 50%, #6a5a45 75%, #3a3530 100%)",
    }}>
      {/* Abstract city-light shapes */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(255,200,120,0.12) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "40%", right: "15%", width: 400, height: 250, background: "radial-gradient(ellipse, rgba(200,160,100,0.08) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 350, height: 180, background: "radial-gradient(ellipse, rgba(180,200,160,0.06) 0%, transparent 70%)" }} />
      {/* Texture grain overlay */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
    </div>

    {/* Gradient overlay for text legibility */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(30,26,22,0.85) 0%, rgba(30,26,22,0.3) 50%, rgba(30,26,22,0.15) 100%)" }} />

    {/* Nav bar */}
    <nav className="fifty-nav" style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 40px" }}>
      <Link to="/" style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 400, color: "#f5f0e8", letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>
        The Fifty
      </Link>
      <div style={{ display: "flex", gap: 28, fontSize: 13, color: "rgba(245,240,232,0.7)", letterSpacing: 0.5 }}>
        <Link to="/#cities" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>Cities</Link>
        <Link to="/#how-it-works" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>About</Link>
        <span style={{ cursor: "pointer" }} onClick={() => document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })}>Newsletter</span>
      </div>
    </nav>

    {/* Hero content */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 56px", zIndex: 5 }}>
      <div style={{ maxWidth: 800 }}>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "rgba(245,240,232,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
          San Francisco, California
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          San Francisco
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Seven miles square. Infinite depth.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "rgba(245,240,232,0.45)", letterSpacing: 0.5 }}>
          <span>50 curated picks</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "rgba(245,240,232,0.3)" }} />
          <span>Last updated April 2026</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "rgba(245,240,232,0.3)" }} />
          <span>Maintained by the editors</span>
        </div>
      </div>
    </div>
  </header>
);

// ─── Filter Bar ──────────────────────────────────────────────────────────────

const FilterBar = ({ activeCategory, setActiveCategory, activeNeighborhood, setActiveNeighborhood, view, setView }) => {
  const barRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: [1], rootMargin: "-1px 0px 0px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={barRef} style={{
      position: "sticky", top: 0, zIndex: 50,
      backgroundColor: stuck ? "rgba(250,247,242,0.97)" : "#FAF7F2",
      backdropFilter: stuck ? "blur(12px)" : "none",
      borderBottom: stuck ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        {/* Category pills */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, paddingBottom: 16, gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 100,
                  border: activeCategory === cat ? "1.5px solid #1a1a1a" : "1.5px solid rgba(0,0,0,0.1)",
                  backgroundColor: activeCategory === cat ? "#1a1a1a" : "transparent",
                  color: activeCategory === cat ? "#f5f0e8" : "#555",
                  fontSize: 13,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: 0.2,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px", backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 8 }}>
            <button onClick={() => setView("list")} style={{ padding: 6, borderRadius: 6, border: "none", backgroundColor: view === "list" ? "#fff" : "transparent", cursor: "pointer", display: "flex", boxShadow: view === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
              <ListIcon active={view === "list"} />
            </button>
            <button onClick={() => setView("grid")} style={{ padding: 6, borderRadius: 6, border: "none", backgroundColor: view === "grid" ? "#fff" : "transparent", cursor: "pointer", display: "flex", boxShadow: view === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
              <GridIcon active={view === "grid"} />
            </button>
          </div>
        </div>

        {/* Neighborhood filter */}
        <div style={{ display: "flex", gap: 16, paddingBottom: 16, overflowX: "auto", scrollbarWidth: "none" }}>
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n}
              onClick={() => setActiveNeighborhood(n)}
              style={{
                padding: 0,
                border: "none",
                backgroundColor: "transparent",
                color: activeNeighborhood === n ? "#1a1a1a" : "#999",
                fontSize: 12,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: activeNeighborhood === n ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                letterSpacing: 0.3,
                borderBottom: activeNeighborhood === n ? "1.5px solid #1a1a1a" : "1.5px solid transparent",
                paddingBottom: 4,
                transition: "all 0.2s ease",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── List Entry (Editorial View) ─────────────────────────────────────────────

const ListEntry = ({ entry, index }) => {
  const catColor = getCategoryColor(entry.category);
  return (
    <article className="fifty-list-item" style={{
      display: "grid",
      gridTemplateColumns: "72px 1fr 180px",
      gap: 0,
      padding: "40px 0",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      alignItems: "start",
    }}>
      {/* Number */}
      <div style={{
        fontFamily: "'Georgia', serif",
        fontSize: 42,
        fontWeight: 400,
        color: "rgba(0,0,0,0.08)",
        lineHeight: 1,
        paddingTop: 2,
      }}>
        {String(entry.id).padStart(2, "0")}
      </div>

      {/* Content */}
      <div className="fifty-list-content" style={{ paddingRight: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>
            {entry.name}
          </h3>
          <span style={{
            padding: "3px 10px",
            borderRadius: 100,
            backgroundColor: catColor.bg,
            color: catColor.text,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>
            {entry.category}
          </span>
          <span style={{
            fontSize: 12,
            color: "#999",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>
            {entry.neighborhood}
          </span>
        </div>

        <p style={{
          fontFamily: "'Georgia', serif",
          fontSize: 15,
          lineHeight: 1.7,
          color: "#444",
          margin: "0 0 12px",
          maxWidth: 600,
        }}>
          {entry.description}
        </p>

        <p style={{
          fontFamily: "'Georgia', serif",
          fontSize: 13,
          fontStyle: "italic",
          color: "#888",
          margin: "0 0 16px",
          lineHeight: 1.5,
          paddingLeft: 16,
          borderLeft: "2px solid rgba(0,0,0,0.06)",
        }}>
          {entry.signature}
        </p>

        <a href="#" onClick={(e) => e.preventDefault()} style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 600,
          color: "#1a1a1a",
          textDecoration: "none",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          fontFamily: "system-ui, -apple-system, sans-serif",
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: 2,
        }}>
          {getActionLabel(entry.actionType)}
          <ArrowIcon />
        </a>
      </div>

      {/* Thumbnail */}
      <div className="fifty-list-thumb" style={{
        width: 180,
        height: 140,
        borderRadius: 8,
        overflow: "hidden",
        flexShrink: 0,
      }}>
        <PlaceholderImage index={index} size="thumb" photo={CITY_PHOTOS[entry.id]} />
      </div>
    </article>
  );
};

// ─── Grid Entry (Card View) ─────────────────────────────────────────────────

const GridEntry = ({ entry, index }) => {
  const catColor = getCategoryColor(entry.category);
  return (
    <article style={{
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      transition: "box-shadow 0.3s ease, transform 0.3s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ width: "100%", height: 200, position: "relative" }}>
        <PlaceholderImage index={index} photo={CITY_PHOTOS[entry.id]} />
        {/* Number overlay */}
        <div style={{
          position: "absolute", top: 16, left: 16,
          fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 400,
          color: "rgba(255,255,255,0.85)",
          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          lineHeight: 1,
        }}>
          {String(entry.id).padStart(2, "0")}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{
            padding: "3px 9px", borderRadius: 100,
            backgroundColor: catColor.bg, color: catColor.text,
            fontSize: 9, fontWeight: 600, letterSpacing: 0.8,
            textTransform: "uppercase", fontFamily: "system-ui, sans-serif",
          }}>
            {entry.category}
          </span>
          <span style={{ fontSize: 11, color: "#999", fontFamily: "system-ui, sans-serif" }}>
            {entry.neighborhood}
          </span>
        </div>

        <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 19, fontWeight: 400, color: "#1a1a1a", margin: "0 0 10px", lineHeight: 1.25 }}>
          {entry.name}
        </h3>

        <p style={{
          fontFamily: "'Georgia', serif", fontSize: 13.5, lineHeight: 1.65, color: "#555",
          margin: "0 0 12px",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {entry.description}
        </p>

        <p style={{
          fontFamily: "'Georgia', serif", fontSize: 12, fontStyle: "italic", color: "#999",
          margin: "0 0 16px", lineHeight: 1.5,
        }}>
          {entry.signature.length > 90 ? entry.signature.slice(0, 90) + "…" : entry.signature}
        </p>

        <a href="#" onClick={(e) => e.preventDefault()} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11, fontWeight: 600, color: "#1a1a1a", textDecoration: "none",
          letterSpacing: 0.5, textTransform: "uppercase",
          fontFamily: "system-ui, sans-serif",
          borderBottom: "1px solid #1a1a1a", paddingBottom: 1,
        }}>
          {getActionLabel(entry.actionType)}
          <ArrowIcon />
        </a>
      </div>
    </article>
  );
};
// ─── Footer ──────────────────────────────────────────────────────────────────

const Footer = () => {
  const cities = [
    { name: "Los Angeles", tagline: "Sprawl with purpose. Here's your map." },
    { name: "Seattle", tagline: "Beyond the rain. The real city, revealed." },
    { name: "Portland", tagline: "Still itself. Still worth the trip." },
  ];

  return (
    <footer style={{ backgroundColor: "#1a1a1a" }}>
      {/* Editorial note */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 40, height: 1, backgroundColor: "rgba(255,255,255,0.2)", margin: "0 auto 24px" }} />
          <p style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>
            This list is maintained, not automated. Every entry is visited, revisited, and occasionally retired by our editorial team. No algorithms. No sponsored placements. If something's here, it's because we'd send a friend there.
          </p>
        </div>
      </div>

      {/* Email capture */}
      <NewsletterCapture />

      {/* Other cities */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 40px" }}>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 28 }}>
          Explore other cities
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {cities.map((city, i) => (
            <a
              key={city.name}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                padding: "28px 24px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                backgroundColor: "rgba(255,255,255,0.02)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <h4 style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 400, color: "#f5f0e8", margin: "0 0 6px" }}>
                {city.name}
              </h4>
              <p style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, fontStyle: "italic" }}>
                {city.tagline}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 40px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontFamily: "'Georgia', serif", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
          The Fifty
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          © 2026. All recommendations earned.
        </span>
      </div>
    </footer>
  );
};

// ─── Main Page Component ─────────────────────────────────────────────────────

function NewsletterCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      await subscribeEmail(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="newsletter" style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 400, color: "#f5f0e8", margin: "0 0 8px" }}>
          New cities are coming
        </h3>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>
          We'll let you know when we publish the next one. Nothing else.
        </p>
        {!submitted ? (
          <>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  flex: 1, padding: "14px 18px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  color: "#f5f0e8", fontSize: 14,
                  fontFamily: "system-ui, sans-serif",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: "14px 28px", borderRadius: 8,
                  border: "none", backgroundColor: submitting ? "#d4cfc6" : "#f5f0e8",
                  color: "#1a1a1a", fontSize: 13, fontWeight: 600,
                  letterSpacing: 0.5, cursor: submitting ? "wait" : "pointer",
                  fontFamily: "system-ui, sans-serif",
                  opacity: submitting ? 0.7 : 1, transition: "all 0.2s",
                }}>
                {submitting ? "Subscribing..." : "Notify Me"}
              </button>
            </div>
            {error && (
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: "#e8614d", marginTop: 12 }}>{error}</p>
            )}
          </>
        ) : (
          <div style={{
            padding: "16px 24px",
            background: "rgba(184,134,78,0.15)",
            border: "1px solid rgba(184,134,78,0.25)",
            borderRadius: 8,
          }}>
            <p style={{
              fontFamily: "system-ui, sans-serif", fontSize: 14,
              color: "#B8864E", margin: 0,
            }}>
              You're on the list. We'll let you know when the next city drops.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SanFranciscoCityPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeNeighborhood, setActiveNeighborhood] = useState("All Neighborhoods");
  const [view, setView] = useState("list");

  const filtered = ENTRIES.filter((e) => {
    const catMatch = activeCategory === "All" || e.category === activeCategory;
    const nMatch = activeNeighborhood === "All Neighborhoods" || e.neighborhood === activeNeighborhood;
    return catMatch && nMatch;
  });

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Google Fonts fallback — Georgia is system-available */}
      <Hero />
      <FilterBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeNeighborhood={activeNeighborhood}
        setActiveNeighborhood={setActiveNeighborhood}
        view={view}
        setView={setView}
      />

      {/* Entry count */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 40px 0" }}>
        <p style={{ fontSize: 13, color: "#999", fontFamily: "system-ui, sans-serif" }}>
          {filtered.length === ENTRIES.length
            ? `Showing all ${ENTRIES.length} of 50 picks`
            : `${filtered.length} ${filtered.length === 1 ? "pick" : "picks"} in ${activeCategory !== "All" ? activeCategory : ""} ${activeNeighborhood !== "All Neighborhoods" ? "· " + activeNeighborhood : ""}`.trim()
          }
        </p>
      </div>

      {/* List */}
      <main className="fifty-main" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 80px" }}>
        {view === "list" ? (
          <div>
            {filtered.map((entry, i) => (
              <ListEntry key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
            paddingTop: 16,
          }}>
            {filtered.map((entry, i) => (
              <GridEntry key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}

        {/* End-of-list marker */}
        {filtered.length > 0 && (
          <div style={{ textAlign: "center", padding: "60px 0 20px" }}>
            <div style={{ width: 40, height: 1, backgroundColor: "rgba(0,0,0,0.08)", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "#bbb", fontStyle: "italic" }}>
              {filtered.length === ENTRIES.length
                ? "That's the list. 50 things. No filler."
                : `End of filtered results`
              }
            </p>
          </div>
        )}
      </main>

      <CityMap entries={ENTRIES} locations={CITY_LOCATIONS} cityName="San Francisco" />
      <Footer />
    </div>
  );
}
