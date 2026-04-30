import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";
import { subscribeEmail } from "./src/mailchimp.js";
import CityMap from "./src/CityMap.jsx";
import LOCATIONS from "./src/locations.json";
import PageMeta from "./src/PageMeta.jsx";

const CITY_PHOTOS = PHOTOS["las-vegas"] || {};
const CITY_LOCATIONS = LOCATIONS["las-vegas"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "The Strip", "Downtown", "Chinatown", "Arts District", "Henderson", "Summerlin", "Westside", "UNLV", "Boulder City", "Spring Mountains", "Off-Strip"];

const ENTRIES = [
  {
    id: 1,
    name: "Lotus of Siam",
    category: "Eat",
    neighborhood: "Chinatown",
    description: "The Northern Thai restaurant that put Vegas dining on the serious-food map decades before the city had a serious-food map. Saipin Chutima's khao soi, drunken noodles, and crispy beef are the kind of dishes that travel writers fly in to eat. The Sahara location is a strip-mall room with no business looking this unassuming and serving food this important.",
    signature: "The crispy beef, the duck khao soi, and the nam kao tod are non-negotiable. Order extra rice — you'll want it for the leftovers.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 2,
    name: "Raku",
    category: "Eat",
    neighborhood: "Chinatown",
    description: "The late-night Japanese izakaya every Vegas chef goes to after their own shift ends. Mitsuo Endo's small, focused menu of robata-grilled meats, agedashi tofu, homemade tofu, and seasonal sashimi is built on Tokyo-trained technique and ingredients flown in from Japan. The room is tiny, the wait is long, and the meal is one of the city's most quietly important dining experiences.",
    signature: "Reserve weeks in advance. Order the chef's tasting if it's offered. Don't skip the homemade tofu — it's why this place exists.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "Esther's Kitchen",
    category: "Eat",
    neighborhood: "Arts District",
    description: "James Trees's Italian restaurant put the Arts District on the dining map and never gave back the spotlight. Hand-rolled pasta, wood-fired pizza, and a bread program serious enough to stand on its own — all served in a room that feels worn-in despite being relatively new. Reservations are essential. So is the bread basket.",
    signature: "The agnolotti and the carbonara are the moves. Sit at the bar if you can't get a table — you'll see the kitchen work and meet half the Arts District.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 4,
    name: "Carbone",
    category: "Eat",
    neighborhood: "The Strip",
    description: "The Major Food Group's Italian-American dining room at Aria — red sauce reimagined as theater, with Caesar salads tossed tableside and lobster ravioli that costs what lobster ravioli costs in 2026. It's loud, it's expensive, and it's somehow exactly what people want from a Strip dining experience. The spicy rigatoni vodka is so famous it has its own social media accounts.",
    signature: "Order the spicy rigatoni vodka — yes, it's worth the hype — and the veal parmesan to share. Reservations open 30 days out and disappear in minutes.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 5,
    name: "Bazaar Meat by José Andrés",
    category: "Eat",
    neighborhood: "The Strip",
    description: "José Andrés's wood-fire steakhouse at the Sahara is the most theatrical meat-eating experience in Vegas. The whole suckling pig is carved tableside with a plate (yes, a plate); the cotton candy foie gras is exactly as ridiculous as it sounds; and the menu is built to be eaten in waves over three hours. Come hungry, come patient, come ready to spend.",
    signature: "Order the suckling pig if your party is big enough. The cotton candy foie gras is the photo. The bone-in ribeye is the meal.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 6,
    name: "Wing Lei",
    category: "Eat",
    neighborhood: "The Strip",
    description: "The only Forbes Five-Star Chinese restaurant in North America, tucked inside the Wynn. The Cantonese-leaning menu is built around peerless ingredients — Peking duck served three ways, abalone, lobster — and a wine list that knows what to pour next to all of it. The room is hushed and unironically luxurious; the pacing is slow on purpose.",
    signature: "The Peking duck three ways must be ordered when you reserve. Pair it with the wine pairing — they take it seriously.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 7,
    name: "Carson Kitchen",
    category: "Eat",
    neighborhood: "Downtown",
    description: "Founded by the late Kerry Simon as part of his vision for Downtown's reinvention, Carson Kitchen is still the gastropub Fremont East needed — a tight menu of small plates, a great burger, and a rooftop patio that catches Vegas sunsets perfectly. The room feels like it grew up here. It did.",
    signature: "The bacon jam and the Carson burger. Sit on the rooftop if it's open and the weather cooperates — it rarely doesn't.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 8,
    name: "The Golden Steer Steakhouse",
    category: "Eat",
    neighborhood: "Off-Strip",
    description: "Open since 1958 and the only Vegas steakhouse where you can sit in the booth Sinatra sat in, the same booth Elvis sat in, the same booth half of Old Hollywood passed through. The steaks are old-school — bone-in ribeye, prime, perfectly seared — and the room is dim, red, and unironically frozen in 1965. Tableside Caesar. Bananas Foster. The works.",
    signature: "Request the Sinatra booth (#22) when you reserve. Order the chateaubriand for two and the tableside Caesar.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 9,
    name: "Yui Edomae Sushi",
    category: "Eat",
    neighborhood: "Chinatown",
    description: "A 12-seat omakase counter in a Chinatown strip mall serving the kind of edomae sushi people fly to Japan for. Chef Gen Mizoguchi sources from Toyosu Market in Tokyo three times a week, the rice is seasoned aggressively the way Edo-period purists insisted, and the cadence is fast and unhurried at the same time. One of the great quiet Vegas dining experiences.",
    signature: "Sit at the counter. Order the omakase. Let the chef pace it. Bring sake or trust the pairing.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 10,
    name: "Tacos El Gordo",
    category: "Eat",
    neighborhood: "The Strip",
    description: "The Tijuana taco institution that opened a Strip outpost and immediately became the city's best 2 a.m. meal. Adobada off the spit, suadero, lengua, cabeza — all served on hand-pressed tortillas, fast, cheap, and indifferent to the absurd hours casino eaters keep. There's no sit-down. There's no need.",
    signature: "Order at the adobada window first, then move to the suadero window. Get extra tortillas. The bag will smell like victory all the way home.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "Pho Kim Long",
    category: "Eat",
    neighborhood: "Chinatown",
    description: "A 24-hour pho shop on Spring Mountain Road that's been feeding the Vegas service industry for decades. The broth is deep, the cuts of beef are honest, the herb plate is generous, and the room is fluorescent-lit and exactly as comforting as a 4 a.m. bowl of soup needs to be. This is the food of the city's actual nighttime workforce.",
    signature: "Order pho dac biet (special, with everything). Add the bird's-eye chili from the condiment caddy. Tear up the Thai basil and stir it in.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 12,
    name: "Sparrow + Wolf",
    category: "Eat",
    neighborhood: "Chinatown",
    description: "Brian Howard's modern American restaurant in a Chinatown strip mall makes the case that Vegas dining doesn't need a Strip address to matter. The menu reads as global — Hong Kong-style snapper, lamb dumplings, wagyu beef gnocchi — and the cooking is precise without ever feeling fussy. James Beard nominees know this address.",
    signature: "The lamb dumplings and the dry-aged duck. Sit at the chef's counter if you can — best seats in the house.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 13,
    name: "Echo & Rig",
    category: "Eat",
    neighborhood: "Henderson",
    description: "A butcher shop in front, a steakhouse in back. Sam Marvin's Tivoli Village restaurant takes meat seriously enough to age and butcher in-house, and the menu reads accordingly — cuts you don't usually see on menus, prepared simply, priced fairly for the quality. The Henderson location is worth the drive from anywhere in town.",
    signature: "Order something off-menu — the butcher specials change daily and they're where the kitchen has the most fun. The hanger steak is a perennial.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 14,
    name: "Bouchon",
    category: "Eat",
    neighborhood: "The Strip",
    description: "Thomas Keller's French bistro at the Venetian is what every Strip restaurant should aspire to be — perfectly executed roast chicken, croque madame, steak frites, and an oyster bar that tastes like a brasserie in the 9th arrondissement. The room is bright and beautiful, the service is unhurried, and it's somehow not impossible to get into.",
    signature: "Brunch is the move. Order the croque madame and a side of steak frites. Sit on the patio if the weather isn't too Vegas.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 15,
    name: "Sage",
    category: "Eat",
    neighborhood: "The Strip",
    description: "Shawn McClain's modern American restaurant at Aria is the Strip's most quietly excellent fine-dining room — a James Beard winner cooking with seasonal vegetables and house-made pastas in a space that feels like it could be in Chicago or San Francisco. No theatrics, no tableside flair, just careful, confident food.",
    signature: "The foie gras crème brûlée — a signature dish since the restaurant opened, still one of the best plates on the Strip. Pair with the wine flight.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 16,
    name: "Frankie's Tiki Room",
    category: "Drink",
    neighborhood: "Downtown",
    description: "A 24-hour tiki bar on Charleston Boulevard with handmade carvings, custom mugs, and rum drinks served strong — it's the only 24-hour tiki bar in the world, which is exactly the kind of distinction Vegas should hold. Go at 3 a.m. The crowd is half service-industry coming off shift, half curious tourists who heard the legend.",
    signature: "Order the Bearded Clam in a mug you'll want to take home — you can buy them. Get a second one. The room earns repeat visits.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 17,
    name: "Atomic Liquors",
    category: "Drink",
    neighborhood: "Downtown",
    description: "Las Vegas's oldest freestanding bar, open since 1952. The neon outside has been there since the era when patrons would gather on the roof to watch atomic-bomb tests in the desert (hence the name). It's been carefully restored without losing its soul — warm wood, old bottles, real regulars — and it's the closest thing Vegas has to a museum that also pours bourbon.",
    signature: "Order a classic — old fashioned, Manhattan, Sazerac. Read the framed history on the walls. Pretend it's still 1958.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 18,
    name: "Velveteen Rabbit",
    category: "Drink",
    neighborhood: "Arts District",
    description: "A sister-owned cocktail bar in the Arts District where the menu rotates seasonally and the drinks are genuinely inventive — herb-forward, low-ABV, never gimmicky. The room is warm, the patio is shaded, and the crowd skews local. It's the kind of bar that quietly makes a city's drink scene.",
    signature: "Tell them what you usually drink and let them work. The seasonal menu is where the kitchen flexes; the off-menu requests are where the bartenders do.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 19,
    name: "Herbs & Rye",
    category: "Drink",
    neighborhood: "Westside",
    description: "Nectaly Mendoza's serious cocktail bar on Sahara Avenue — half a steakhouse, half a 1920s parlor, all built around a back-bar that knows exactly what era of cocktail you came for. Specific cocktails for specific decades; classic technique done correctly. James Beard recognized for a reason.",
    signature: "Order from the historical menu — they organize cocktails by decade. Sit at the bar; ask for whatever they're enthusiastic about that night.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Park on Fremont",
    category: "Drink",
    neighborhood: "Downtown",
    description: "A two-story restaurant and bar on Fremont East with a patio that's earned its place as one of Downtown's most reliable hangouts. The cocktail program leans Old Vegas with a few modern twists, the food is better than it needs to be, and the back patio under string lights is exactly where you want to spend a warm Vegas evening.",
    signature: "Sit on the back patio. Order an old fashioned and the burger. Let the night get a little long.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "Oddfellows",
    category: "Drink",
    neighborhood: "Arts District",
    description: "An Arts District cocktail bar inside the Arts Factory complex — a long bar, dim lighting, mid-century everything, and a menu that does classics correctly without showing off. The vibe is patient and grown-up; the kind of place you go before or after First Friday rather than during.",
    signature: "The negroni is a benchmark. Sit at the end of the bar — best people-watching in the Arts District.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 22,
    name: "The Sand Dollar Lounge",
    category: "Drink",
    neighborhood: "Westside",
    description: "A Spring Valley dive that's been pulling in local musicians, off-shift cocktail bartenders, and people who heard about it from a friend since 1976. Live music most nights, no cover, a cocktail program that's better than the room suggests, and a feel that's pure unrenovated Vegas. The kind of bar that makes the city's myth a little more real.",
    signature: "Catch the late show. Order something simple. Tip the band.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 23,
    name: "Double Down Saloon",
    category: "Drink",
    neighborhood: "UNLV",
    description: "A punk dive on Paradise Road with the slogan 'You puke, you clean.' Bacon martinis. Ass juice (don't ask). A jukebox built for the kind of night that's already in motion by the time you walk in. It's been here since 1992 and shows no sign of becoming anything other than what it is.",
    signature: "Don't order the ass juice unless you mean it. The bacon martini is the photo. Tip well.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 24,
    name: "Vesta Coffee Roasters",
    category: "Coffee",
    neighborhood: "Arts District",
    description: "An Arts District micro-roaster pulling some of the most precise espresso in the city. The space is bright, the bar is glass-fronted so you can watch the work, and the staff treats the menu like a conversation rather than a transaction. Single-origin pour-overs are where Vesta really shows off.",
    signature: "Ask the barista what came in this week. Get whatever they're excited about as a pour-over.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 25,
    name: "Mothership Coffee Roasters",
    category: "Coffee",
    neighborhood: "Downtown",
    description: "A Henderson-born roaster with a Downtown outpost at the Beat that became the coffee shop of record for the Fremont East tech-and-art crowd. Beans are roasted in-house in Henderson; the espresso is balanced, the cold brew is dialed-in, and the staff actually wants to talk about it.",
    signature: "Get the cortado and ask what's just been roasted. The seasonal tasting flights are where the roasters have fun.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 26,
    name: "PublicUs",
    category: "Coffee",
    neighborhood: "UNLV",
    description: "A bright, plant-filled coffee shop and cafe on Fremont Street that draws an actual cross-section of the city — students, freelancers, families, the occasional politician. The coffee is well-pulled, the food is plant-forward and good enough to skip lunch elsewhere, and the room is built for staying.",
    signature: "Order the avocado toast and a cortado. Bring a laptop if you're working — the wifi is fast and the seat will be there in an hour.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 27,
    name: "Makers & Finders",
    category: "Coffee",
    neighborhood: "Arts District",
    description: "A Latin American-influenced coffee and breakfast shop in the Arts District that does both halves of the equation seriously. The coffee program leans toward Colombian and Brazilian beans, the food menu reads like a Pan-American brunch, and the patio fills up by 10 a.m. on weekends.",
    signature: "Get the avocado toast or the Colombian eggs Benedict. Sit on the patio. Save room for a guava pastry.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 28,
    name: "Bad Owl Coffee",
    category: "Coffee",
    neighborhood: "Summerlin",
    description: "A Harry Potter-inspired coffee shop in Summerlin that turned out to take its coffee genuinely seriously despite the theming. Multiple locations now, but the original is the one with the most personality — and the cold brews and signature lattes are what brings the regulars back.",
    signature: "The Butter Beer Latte is the Instagram order; the cortado is the actual coffee order. Get both if you're with a friend.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "Wynn Las Vegas",
    category: "Stay",
    neighborhood: "The Strip",
    description: "Steve Wynn's masterpiece on the north Strip remains the gold standard for Vegas luxury — vast, immaculately maintained, and home to a restaurant program that's still arguably the city's best. The pool deck is one of the few on the Strip that feels like a destination on its own. Rooms are large, beds are great, and the staff knows the difference between attentive and obsequious.",
    signature: "Book a Tower Suite if you can. Eat at SW Steakhouse and Lakeside at least once each. Walk through the conservatory at night.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 30,
    name: "The Cosmopolitan of Las Vegas",
    category: "Stay",
    neighborhood: "The Strip",
    description: "The hipper alternative to the Wynn — sleeker, younger, more interested in design than in spectacle. The terrace suites have wraparound balconies that make all other Strip rooms feel claustrophobic, and the lobby's eight-pillar Bond Bar is one of the best happy-hour rooms in the city. The Chandelier Bar is three stories of crystal and bourbon.",
    signature: "Book a terrace suite — the wraparound balcony is the play. Get a drink at the Bond Bar before dinner. Climb the Chandelier.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 31,
    name: "El Cortez Hotel & Casino",
    category: "Stay",
    neighborhood: "Downtown",
    description: "The oldest continuously-operating hotel-casino in Las Vegas, opened in 1941 and never imploded — which makes it functionally a working museum of pre-corporate Vegas. The rooms are simple, the casino still uses real felt, and the entire place has an unironic charm that the Strip can't manufacture. It's not luxury. It's history you can sleep in.",
    signature: "Book a Pavilion or Cabana suite. Eat at Siegel's 1941 — diner of the gods. Play 21 in the original casino.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 32,
    name: "Red Rock Casino Resort & Spa",
    category: "Stay",
    neighborhood: "Summerlin",
    description: "The off-Strip resort locals pick when family flies in. Twenty minutes from the Strip, fifteen from Red Rock Canyon, and built around an enormous pool deck that feels like a mid-century desert resort more than a casino. The rooms are spacious, the spa is real, and the views of the actual red rocks at sunset are the kind of Vegas you don't realize you came for.",
    signature: "Book a room with a Red Rock view. Use the property as a base for hiking the canyon in the morning and the Strip at night.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 33,
    name: "Red Rock Canyon National Conservation Area",
    category: "Experience",
    neighborhood: "Summerlin",
    description: "Twenty minutes from the Strip and you're walking through 600-foot red sandstone cliffs that look like they were designed by a special-effects department. The 13-mile scenic loop is one of the most spectacular drives in the country; the hikes range from easy half-mile boardwalks to all-day climbs. Go early to beat heat and crowds.",
    signature: "Book a scenic-loop reservation in advance — required most of the year. Drive at golden hour. Hike Calico Tanks if you want a real workout.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 34,
    name: "Hoover Dam",
    category: "Experience",
    neighborhood: "Boulder City",
    description: "A Depression-era engineering miracle that holds back the Colorado River and powers most of southern Nevada. The 35-minute Powerplant Tour gets you down into the dam itself; the Dam Tour gets you deeper still, through tunnels and ventilation shafts that feel like a Tom Clancy novel. The scale is impossible to grasp from photos. Go.",
    signature: "Book the Dam Tour, not just the Powerplant Tour — it's the one that takes you deep. Drive across the dam, then walk the Mike O'Callaghan-Pat Tillman Bridge for the view.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 35,
    name: "Valley of Fire State Park",
    category: "Experience",
    neighborhood: "Boulder City",
    description: "An hour northeast of the Strip and you're inside a 40,000-acre badland of red sandstone that looks like Mars on a generous day. The Fire Wave is the famous photo, but the entire park rewards exploration — petroglyphs, slot canyons, an empty drive that ends at a sandstone cathedral. Closed midday in summer for good reason.",
    signature: "Drive out for sunrise; hike Fire Wave and White Domes; be back at the Strip by lunch. Bring more water than you think you need.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 36,
    name: "The Neon Museum",
    category: "Experience",
    neighborhood: "Downtown",
    description: "An outdoor 'boneyard' of salvaged Vegas signs — the Stardust, the Sahara, the Moulin Rouge — restored or left to age, depending. Walking tours after dark, when select pieces are re-lit, are the best way to see the collection. It's the closest thing the city has to a memorial of itself.",
    signature: "Book the after-dark Brilliant! light show. Daytime tours are good; night tours are the experience.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 37,
    name: "The Mob Museum",
    category: "Experience",
    neighborhood: "Downtown",
    description: "A surprisingly serious museum of organized crime and law enforcement, housed in the actual federal courthouse where the Kefauver Committee held mob hearings in 1950. The exhibits are unflinching, the artifacts are real, and the basement speakeasy and distillery — yes, a working distillery — is the smartest gift-shop equivalent in any museum in America.",
    signature: "Take the audio tour seriously — the testimony recordings are the highlight. Save time for the speakeasy in the basement after.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 38,
    name: "Atomic Museum",
    category: "Experience",
    neighborhood: "UNLV",
    description: "A Smithsonian-affiliated museum on Flamingo Road that tells the story of the Nevada Test Site, where the U.S. detonated nuclear weapons above ground from 1951 to 1962 — close enough that Strip casinos sold 'atomic breakfast' dawn-viewing packages. The Ground Zero theater puts you in a fallout shelter. Dark, unflinching, essential.",
    signature: "Allow at least two hours. The Ground Zero theater experience and the Trinity site exhibit are the centerpieces.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 39,
    name: "Sphere",
    category: "Experience",
    neighborhood: "The Strip",
    description: "Yes, it's the giant orb. Yes, you should go inside. The 366-foot LED dome is the most ambitious entertainment venue built in the last 50 years — the Postcard from Earth show is the easiest entry point, but the U2-and-other-residency concerts are where the Sphere becomes truly singular. The exterior light show alone is worth a Strip walk.",
    signature: "If a residency is running, splurge on those tickets. Otherwise, book Postcard from Earth — wear comfortable shoes; the seats are on a steep rake.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 40,
    name: "Bellagio Conservatory & Botanical Gardens",
    category: "Experience",
    neighborhood: "The Strip",
    description: "A free, 14,000-square-foot indoor garden inside the Bellagio that gets reimagined five times a year by a team of horticulturists working with what feels like an unlimited budget. The seasonal installations are genuinely spectacular — and the room is open 24 hours, which is a pleasant Vegas-specific use of the phrase. Walk through at 3 a.m. with a coffee.",
    signature: "Visit twice if you can — once during the day, once after midnight when the crowd thins. Each season's installation runs 6-8 weeks.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 41,
    name: "Mount Charleston Lodge",
    category: "Experience",
    neighborhood: "Spring Mountains",
    description: "Forty-five minutes from the Strip and you're in alpine forest at 8,000 feet — bristlecone pines, snow in winter, 30 degrees cooler than the city in summer. The hikes range from family-easy meadow walks to brutal day climbs to the 11,918-foot summit. Most Vegas locals know about it; most visitors never do.",
    signature: "Drive up in summer when the desert hits 110. The Cathedral Rock trail (3 miles round-trip) is the introduction; Mary Jane Falls is the day hike.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 42,
    name: "Springs Preserve",
    category: "Experience",
    neighborhood: "Westside",
    description: "A 180-acre cultural and botanical complex on the original springs that gave Las Vegas its name (yes, there used to be water here). The Origen Museum walks through the city's actual history; the gardens showcase what desert landscaping should look like; and the trails connect to a real wetland in the middle of the city. It's the most quietly thoughtful place in Las Vegas.",
    signature: "Combine with the Nevada State Museum on the same campus — same admission. The gardens are best in spring; the museums in summer.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 43,
    name: "The Arts Factory",
    category: "Experience",
    neighborhood: "Arts District",
    description: "A converted 1940s warehouse complex on Charleston Boulevard that anchors the 18b Arts District — a clutch of galleries, studios, a cocktail bar, and the working hub of First Friday, the Arts District's monthly open-studio night. Walk through any time; come back for First Friday for the full effect.",
    signature: "Visit on a First Friday evening for the full Arts District experience — galleries open late, food trucks line the streets, music spills from doorways. Otherwise, weekday afternoons.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 44,
    name: "The Smith Center for the Performing Arts",
    category: "Experience",
    neighborhood: "Downtown",
    description: "An Art Deco-revival concert hall that gave Las Vegas the proper performing-arts venue it had always lacked — Reynolds Hall is acoustically excellent, the smaller Cabaret Jazz room is intimate enough for the kind of acts that play one-night stands. National Broadway tours, the Las Vegas Philharmonic, and a serious jazz program. Real culture, downtown.",
    signature: "The Cabaret Jazz programming is where the Smith Center is at its best — small room, big-name jazz, no bad seat in the house.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 45,
    name: "The Writer's Block",
    category: "Shop",
    neighborhood: "Downtown",
    description: "A Fremont East independent bookstore that famously installs an artificial bird sanctuary above the shelves — origami birds drop from the ceiling on strings — and runs a tight, opinionated selection of literary fiction, poetry, and Las Vegas writers. The kind of bookstore that makes a city feel more like a city.",
    signature: "Ask for the staff picks shelf — it's where the personality is. The Las Vegas writers section is small and excellent.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "Zia Records",
    category: "Shop",
    neighborhood: "UNLV",
    description: "A Maryland Parkway record store that's been serving Vegas music nerds since 1980. Vinyl, CDs, used inventory deep enough to dig in, and a staff that knows the catalog. The Sahara location is bigger; the Maryland location is the spiritual home — close enough to UNLV that it's still where the city's serious record collectors come.",
    signature: "Browse the used vinyl bins — that's where the finds are. Ask the staff what just came in.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 47,
    name: "Retro Vegas",
    category: "Shop",
    neighborhood: "Arts District",
    description: "A mid-century modern furniture and decor shop on Main Street that does the Palm Springs aesthetic better than most places in Palm Springs. Eames chairs, Danish-modern credenzas, brass lamps, ceramic ashtrays from a more glamorous era — all carefully sourced, fairly priced, and the kind of inventory that turns over every visit.",
    signature: "Even if you're not buying, browse for the education. The brass section in the back has the kind of pieces you don't see anywhere else.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "Bauman Rare Books",
    category: "Shop",
    neighborhood: "The Strip",
    description: "A rare-books gallery inside the Palazzo with first editions, signed copies, and antiquarian holdings serious enough to make you forget you're in a Strip mall. Hemingway, Joyce, Wharton, the occasional Audubon — the kind of inventory that's normally in a research library, here for sale. Browse with reverence.",
    signature: "Ask the staff to walk you through the rotating display case — the featured items are usually the most spectacular pieces in the room.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "Glam Factory Vintage",
    category: "Shop",
    neighborhood: "Arts District",
    description: "An Arts District vintage clothing store with a costume-y, drag-friendly bent that the rest of the city's vintage scene quietly admires. Sequined gowns, leather everything, a wig wall, and an editing eye that pulls only the pieces with real character. Worth a visit even if you're not shopping.",
    signature: "Visit before First Friday — you'll see half the people who come through here later in costume. The wig wall is the social-media moment.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "Patina Décor",
    category: "Shop",
    neighborhood: "Arts District",
    description: "A Vegas decor shop dealing in carefully-chosen mid-century furniture, vintage industrial pieces, and the kind of accent objects that make a room interesting. Smaller and more curated than Retro Vegas — they complement each other if you're shopping the Arts District seriously.",
    signature: "Stop here after Retro Vegas if you're hunting decor. The smaller-object inventory — lamps, ceramics, brass — is where Patina shines.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

const getCategoryColor = (cat) => {
  const map = {
    Coffee: { bg: "rgb(150,100,55)", text: "#fff" },
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

const PlaceholderImage = ({ index, size = "full", photo, entry }) => {
  if (photo?.src) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#eee" }}>
        <img
          src={photo.src}
          alt={entry ? `${entry.name} — ${entry.category} in ${entry.neighborhood}` : ""}
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
        <button type="button" onClick={() => document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit", letterSpacing: "inherit", cursor: "pointer" }}>Newsletter</button>
      </div>
    </nav>

    {/* Hero content */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 56px", zIndex: 5 }}>
      <div style={{ maxWidth: 800 }}>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "rgba(245,240,232,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
          Las Vegas, Nevada
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Las Vegas
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Beyond the Strip. Yes, there's a real city here — and these are the fifty places that make it real.
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
        <PlaceholderImage index={index} size="thumb" photo={CITY_PHOTOS[entry.id]} entry={entry} />
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
        <PlaceholderImage index={index} photo={CITY_PHOTOS[entry.id]} entry={entry} />
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
    { name: "New York", tagline: "You already know. But not like this." },
    { name: "Nashville", tagline: "Past the neon. Here's what's real." },
    { name: "Chicago", tagline: "The great American city, distilled." },
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 40px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "'Georgia', serif", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
          The Fifty
        </span>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "About", to: "/about" },
            { label: "Methodology", to: "/methodology" },
            { label: "Photo Credits", to: "/photo-credits" },
            { label: "Privacy", to: "/privacy" },
            { label: "Terms", to: "/terms" },
            { label: "Contact", href: "mailto:hello@thefiftylist.com" },
          ].map((item) => {
            const style = { fontFamily: "system-ui, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: 0.5, textTransform: "uppercase" };
            return item.to ? (
              <Link key={item.label} to={item.to} style={style}>{item.label}</Link>
            ) : (
              <a key={item.label} href={item.href} style={style}>{item.label}</a>
            );
          })}
        </div>
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
                aria-label="Email address for newsletter"
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
              color: "#8C6534", margin: 0,
            }}>
              You're on the list. We'll let you know when the next city drops.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LasVegasCityPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeNeighborhood, setActiveNeighborhood] = useState("All Neighborhoods");
  const [view, setView] = useState("list");

  const filtered = ENTRIES.filter((e) => {
    const catMatch = activeCategory === "All" || e.category === activeCategory;
    const nMatch = activeNeighborhood === "All Neighborhoods" || e.neighborhood === activeNeighborhood;
    return catMatch && nMatch;
  });

  return (
    <>
      <PageMeta page="city" citySlug="las-vegas" entries={ENTRIES} />
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

      <CityMap entries={ENTRIES} locations={CITY_LOCATIONS} cityName="Las Vegas" />
      <Footer />
    </div>
    </>
  );
}