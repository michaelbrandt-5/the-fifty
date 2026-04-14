import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "East Austin", "Downtown", "South Congress", "South Lamar", "West Campus", "Zilker", "Rainey St", "North Loop", "Mueller", "West Austin"];

const ENTRIES = [
  {
    id: 1,
    name: "Houndstooth Coffee",
    category: "Coffee",
    neighborhood: "West Campus",
    description: "Skip the line at whatever everyone's posting about this week. Houndstooth has been quietly doing single-origin pour-overs better than anyone in the city for over a decade. The West Campus location has this perfect mid-morning light that makes you want to stay for a second cup.",
    signature: "Order the Tweed — their signature cold brew blend. It's not on every menu board, but it's always available.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 2,
    name: "Uchi",
    category: "Eat",
    neighborhood: "South Lamar",
    description: "Tyson Cole's flagship is still the best meal in Austin, full stop. This isn't a sushi restaurant — it's a Japanese farmhouse that happens to serve the most inventive raw fish in the Southwest. The omakase is worth every dollar, but honestly the à la carte hot tastings are where the kitchen really shows off.",
    signature: "The maguro sashimi with goat cheese and cracked pepper has been on the menu since day one. There's a reason.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "Hotel Saint Cecilia",
    category: "Stay",
    neighborhood: "South Congress",
    description: "Named after the patron saint of music and poetry, and it earns both. This is a 14-room estate hidden behind a wall of bamboo on South Congress. No lobby, no check-in desk, no corporate anything. Just a pool, a record collection, and the distinct feeling that you're staying at a very cool friend's house.",
    signature: "Ask for one of the poolside bungalows. The vinyl turntable in every room isn't decorative — use it.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 4,
    name: "Barton Springs Pool",
    category: "Experience",
    neighborhood: "Zilker",
    description: "A 68-degree natural spring-fed swimming pool in the middle of the city. It's three acres of crystal-clear water that stays cold year-round, and Austinites treat it like church. Go early on a weekday morning before the crowds. Float on your back and stare at the sky. This is the thing people mean when they talk about old Austin.",
    signature: "The south side is free and less maintained — that's where the locals go.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 5,
    name: "Emmer & Rye",
    category: "Eat",
    neighborhood: "Rainey St",
    description: "A pasta restaurant that mills its own grain and sends dim-sum-style carts through the dining room. That sounds like a gimmick until you taste the food. Chef Kevin Fink is obsessed with whole grains and fermentation in a way that makes every plate feel like it has a backstory. The menu changes constantly — just trust whatever they're pushing tonight.",
    signature: "When the cart comes by with the off-menu snacks, say yes to everything. Especially the fried okra.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 6,
    name: "Loro",
    category: "Eat",
    neighborhood: "South Lamar",
    description: "What happens when the Uchi team collides with Aaron Franklin's pitmaster DNA. The answer is a smoked-meat-meets-Southeast-Asian situation that shouldn't work but absolutely does. The brisket is Texas canon. The Thai-style larb with smoked lamb is something else entirely. Grab a picnic table, order a frozen sake, and settle in.",
    signature: "The smoked turkey breast with Thai herbs. Nobody else in the state is doing anything close to this.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "Meteor",
    category: "Coffee",
    neighborhood: "East Austin",
    description: "Part café, part bar, part neighborhood living room. Meteor is the kind of place where you come for a cortado at 9am and end up staying for a natural wine at 5pm. The space is gorgeous — soaring ceilings, great light, indoor-outdoor flow that makes every season feel right. East Austin's best all-day spot, not close.",
    signature: "The weekend brunch is unannounced but consistent. Show up Saturday around 11.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 8,
    name: "The Continental Club",
    category: "Experience",
    neighborhood: "South Congress",
    description: "Austin's greatest music venue isn't the big room with the marquee — it's this narrow, sweaty, 200-capacity honky-tonk that's been on South Congress since 1955. No cover most nights. The best guitarists in Texas rotate through the weekly residencies. Stand near the stage. Bring cash for the tip jar. This is the real thing.",
    signature: "Tuesday night: the Dale Watson residency. If he's in town, you should be too.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 9,
    name: "Odd Duck",
    category: "Eat",
    neighborhood: "South Lamar",
    description: "Farm-to-table without the precious energy. Odd Duck sources almost everything from Texas farms and manages to make that feel like a flex, not a constraint. The plates are meant to share, the wine list is short and thoughtful, and the kitchen has a quiet confidence that comes from knowing exactly who they are. One of the few restaurants in Austin that's gotten better every year.",
    signature: "The roasted bone marrow with smoked marmalade is a signature for a reason. Don't overthink it — order it first.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 10,
    name: "South Congress Books",
    category: "Shop",
    neighborhood: "South Congress",
    description: "A small, perfectly curated bookshop on the strip that somehow survived the rent tsunami. The selection is personal and opinionated — heavy on Texas lit, photography, design, and the kind of novels your smartest friend would hand you. They don't try to be everything. They just try to be right.",
    signature: "Ask whoever's behind the counter what they're reading. They always have an answer and it's always good.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "Small Victory",
    category: "Drink",
    neighborhood: "East Austin",
    description: "A wine bar that feels like it was airlifted from a side street in Marseille and dropped into an East Austin strip mall. The list skews natural and Old World, the snacks are perfect (the anchovy toast is non-negotiable), and the room is tiny enough that you'll end up talking to strangers. Best date spot in the city.",
    signature: "Sit at the bar. Let them pour you something you wouldn't have picked yourself.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 12,
    name: "Mount Bonnell",
    category: "Experience",
    neighborhood: "West Austin",
    description: "A hundred stone steps up to the highest point in the city. The view of Lake Austin and the Hill Country beyond it is the kind of thing that reminds you Texas isn't all flat. Go at sunset, obviously. It's a cliché because it works. Bring water, skip the selfie stick, and just stand there for a minute.",
    signature: "Go on a weekday evening. Weekends are a zoo. The light is the same either way.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 13,
    name: "Franklin Barbecue",
    category: "Eat",
    neighborhood: "East Austin",
    description: "Yes, the line. Yes, it's worth it. Aaron Franklin turned a backyard hobby into the most famous barbecue in America, and somehow the brisket still tastes like someone cares about you personally. The bark is black as midnight and the fat renders into something spiritual. Bring a chair, bring a cooler, make friends. The wait is half the experience.",
    signature: "Get there by 8am on a Saturday. Order the moist brisket and a side of espresso banana pudding. You won't regret a single minute.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 14,
    name: "Suerte",
    category: "Eat",
    neighborhood: "East Austin",
    description: "Elevated Mexican fare in a space that feels like a gallery crossed with a hacienda. Chef Fermin Nunez cooks with the reverence of a grandmother and the ambition of a modernist. The masa is nixtamalized in-house, the mole is a multi-day project, and every plate arrives looking like something you should photograph but will eat too fast to bother.",
    signature: "The suadero tacos with salsa bruja are the sleeper hit. Order them alongside the bone marrow tostada.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 15,
    name: "Justine's Brasserie",
    category: "Eat",
    neighborhood: "East Austin",
    description: "A late-night French brasserie in East Austin that shouldn't work and absolutely does. The steak frites are textbook, the croque madame at midnight is a revelation, and the patio — strung with lights and packed with people who look like they're having the best night of their lives — is peak Austin energy. Opens at 6pm, peaks at 11.",
    signature: "Go after 10pm on a weeknight. Sit on the patio. Order the duck confit and a carafe of Beaujolais.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 16,
    name: "Launderette",
    category: "Eat",
    neighborhood: "East Austin",
    description: "Built in a converted washateria, which sounds gimmicky until you taste the food. Chef Rene Ortiz runs a menu that pivots from wood-fired pizzas to Southeast Asian noodles without breaking a sweat. The brunch is legendary — the kind where you show up at 10 and leave at 2 without meaning to.",
    signature: "The green curry mussels and the brown butter chocolate chunk cookie. Non-negotiable duo.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 17,
    name: "Nixta Taqueria",
    category: "Eat",
    neighborhood: "East Austin",
    description: "A tiny taqueria doing things with heirloom corn that would make your abuela proud and a little jealous. Chef Edgar Rico nixtamalizes rare corn varieties and turns them into tortillas so good they could stand alone. The duck carnitas taco might be the single best bite in Austin under ten dollars.",
    signature: "The duck carnitas taco with mole amarillo. It sells out — go early or go hungry.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 18,
    name: "Lenoir",
    category: "Eat",
    neighborhood: "South Congress",
    description: "A restaurant that calls itself a 'wine salon' and means it. The garden patio is where you want to be — candlelit, intimate, with live oaks overhead and a tasting menu that's quietly one of the most creative in the city. Chef Todd Duplechan's food is Southern at its roots, global at its edges, and personal in a way that's hard to fake.",
    signature: "Book the garden table for two. Let them run the tasting menu with wine pairings.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 19,
    name: "Dai Due",
    category: "Eat",
    neighborhood: "East Austin",
    description: "A butcher shop and restaurant that sources everything from Texas ranches and Hill Country farms. Jesse Griffiths hunts, fishes, and forages half the menu himself. The sausages are house-made, the venison is wild, and the whole operation feels like what farm-to-table was supposed to be before it became a marketing term.",
    signature: "The breakfast tacos on Saturday mornings. Made with their own sausage, eggs from local farms, and tortillas pressed to order.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Veracruz All Natural",
    category: "Eat",
    neighborhood: "East Austin",
    description: "A food truck that became an institution. The migas taco — scrambled eggs with crispy tortilla strips, pico, cheese, and avocado — is the breakfast taco against which all others in Austin are measured. Reina and Maritza Vazquez built this from nothing, and every bite tastes like someone's putting their whole self into it.",
    signature: "The migas taco, obviously. But also the green sauce — ask for extra and put it on everything.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "Salty Sow",
    category: "Eat",
    neighborhood: "East Austin",
    description: "A gastropub that takes its pig seriously. The pork belly is a fixture, the deviled eggs with pork belly crumbles are a cult item, and the covered patio is one of the nicest casual dinner spots on the east side. They rotate seasonal dishes with a quiet confidence that suggests the kitchen knows exactly what it's doing.",
    signature: "The Tuesday night board — a changing charcuterie situation with whatever they're curing that week.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 22,
    name: "Drink Well",
    category: "Drink",
    neighborhood: "North Loop",
    description: "A neighborhood cocktail bar in North Loop that doesn't try to impress you and impresses you anyway. The bartenders are serious about their craft without being precious about it. The menu changes seasonally, the space is small and warm, and it's the kind of place where you walk in for one drink and stay for three.",
    signature: "Ask for the bartender's choice. They'll ask you two questions and hand you something perfect.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 23,
    name: "Whisler's",
    category: "Drink",
    neighborhood: "East Austin",
    description: "An East Austin cocktail bar built into a 1950s storefront that nails the line between dive and craft. Downstairs is the main bar — exposed brick, good music, bartenders who can talk you into something you've never tried. Upstairs is Mezcalería Tobalá, a mezcal-focused rooftop that feels like a secret within a secret.",
    signature: "Start downstairs. End upstairs at Mezcalería Tobalá with a smoky pour of Tobala mezcal.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 24,
    name: "Garage",
    category: "Drink",
    neighborhood: "Downtown",
    description: "A low-key cocktail bar above a parking garage downtown. It sounds like a joke but the space is beautiful — midcentury modern, great sight lines, floor-to-ceiling windows overlooking Congress Avenue. The cocktails are clean and well-built, the crowd is mixed, and nobody's trying too hard. That's the whole point.",
    signature: "Grab a window seat at golden hour. Order a Paloma and watch Congress Avenue light up.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 25,
    name: "Firehouse Lounge",
    category: "Drink",
    neighborhood: "Downtown",
    description: "Hidden behind a bookshelf in a former fire station on Congress Avenue. You push through the shelf and step into a moody, candlelit cocktail bar with brick walls and a vibe that says 1920s speakeasy without shouting it. The cocktails are classic-leaning and well-executed. The novelty of the entrance never gets old.",
    signature: "The Old Fashioned here is a benchmark. Ask them to make it with rye.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 26,
    name: "Roosevelt Room",
    category: "Drink",
    neighborhood: "Downtown",
    description: "Austin's most ambitious cocktail bar, and it delivers. The menu is organized by era — pre-Prohibition, Golden Age, Modern — and the bartenders treat each drink like a small performance. The room is dark, handsome, and serious in the best way. Come when you want a cocktail that makes you sit up a little straighter.",
    signature: "Order from the Pre-Prohibition section. The Martinez is flawless.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 27,
    name: "Better Half",
    category: "Drink",
    neighborhood: "East Austin",
    description: "A coffee-shop-by-day, wine-and-cocktails-by-night situation that manages to be excellent at both. The patio is huge and shaded, the wine list is short and smart, and the frozen cocktails in summer are genuinely some of the best in the city. It's the rare place that's perfect for a 9am meeting and a 9pm date.",
    signature: "The frozen Negroni in summer. Trust.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 28,
    name: "The Driskill Bar",
    category: "Drink",
    neighborhood: "Downtown",
    description: "The bar inside Austin's oldest hotel, and it still feels like the most grown-up room in town. Dark wood, stained glass, leather everything. Live music most nights — usually a solo guitarist or pianist who sounds like they've been playing here for decades. This is where you come when you want a proper drink in a proper room.",
    signature: "A whiskey neat at the bar on a Tuesday night. Let the music fill the room.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "Cosmic Coffee + Beer Garden",
    category: "Coffee",
    neighborhood: "South Congress",
    description: "Part coffee shop, part beer garden, part urban oasis. There are food trucks, a massive shaded patio, a chicken coop, and — improbably — a butterfly garden. The coffee is good, the vibe is better, and it's the kind of place that makes you wonder why every coffee shop in America doesn't have a beer garden attached.",
    signature: "Morning: a pour-over on the back patio. Afternoon: a local craft beer by the butterfly garden. Plan to stay.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 30,
    name: "Fleet Coffee",
    category: "Coffee",
    neighborhood: "East Austin",
    description: "A tiny coffee trailer that punches absurdly above its weight. The espresso program is dialed, the rotating single-origin pour-overs are thoughtful, and the whole thing operates out of a space smaller than most bathrooms. Fleet proves you don't need square footage to make great coffee — you just need to care.",
    signature: "The cortado. Simple, precise, and better than it has any right to be from a trailer.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 31,
    name: "Cuvée Coffee",
    category: "Coffee",
    neighborhood: "East Austin",
    description: "Austin's original third-wave roaster, and they still set the standard for nitro cold brew. The flagship bar on East Sixth is a clean, bright space where the baristas know their origins and will walk you through the menu without a hint of condescension. Serious coffee, approachable people.",
    signature: "Their nitro cold brew — Black & Blue — was one of the first canned nitro coffees in the country. It's still one of the best.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 32,
    name: "Hotel San José",
    category: "Stay",
    neighborhood: "South Congress",
    description: "Liz Lambert turned a 1930s motor court into the coolest hotel in Austin, and twenty years later it still feels like a secret. The rooms are minimal — Japanese-inspired, with concrete floors and Malin+Goetz products — and the courtyard pool is where half of Austin's creative class pretends to run into each other by accident.",
    signature: "Book a poolside room if you can. The courtyard bar on a warm night is Austin at its effortless best.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 33,
    name: "The Line Austin",
    category: "Stay",
    neighborhood: "Downtown",
    description: "A lakefront hotel in a converted 1960s jazz club that nails the balance between design hotel and actually comfortable. Arlo Grey, the ground-floor restaurant by Top Chef's Kristen Kish, is worth a visit even if you're not staying. The pool deck overlooks Lady Bird Lake, and the rooms have the kind of understated cool that makes you want to rearrange your apartment when you get home.",
    signature: "Request a lake-view room on a high floor. Breakfast at Arlo Grey on the terrace is non-negotiable.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 34,
    name: "Carpenter Hotel",
    category: "Stay",
    neighborhood: "South Congress",
    description: "A 93-room hotel from the Lake | Flato architects, all Texas limestone and live-edge wood. It feels like a modern ranch house that happens to be on South Congress. The lobby doubles as a co-working space, Hot L Coffee inside is a perfect morning stop, and the whole thing has this quiet, grounded energy that makes you not want to leave.",
    signature: "The patio at Hot L Coffee, early morning. Watch South Congress wake up with an excellent drip in hand.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 35,
    name: "Blanton Museum of Art",
    category: "Experience",
    neighborhood: "Downtown",
    description: "The largest university art museum in the country, and criminally under-visited by tourists. The Latin American collection is world-class, the Ellsworth Kelly chapel — Austin — is a permanent installation of colored glass and stone that stops you in your tracks. It's on the UT campus, it's free on Thursdays, and it will change how you think about Austin's cultural depth.",
    signature: "Go straight to the Ellsworth Kelly building. Sit in silence for five minutes. You'll understand.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 36,
    name: "Zilker Botanical Garden",
    category: "Experience",
    neighborhood: "Zilker",
    description: "Thirty acres of curated gardens tucked into the hillside above Barton Creek. The Japanese garden is the jewel — koi ponds, stone bridges, a tea house — but the prehistoric garden with its dinosaur-era plants is strangely wonderful too. Come on a weekday when it's just you and the hummingbirds.",
    signature: "The Taniguchi Japanese Garden in late afternoon light. Bring a book and find the bench overlooking the lower pond.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Broken Spoke",
    category: "Experience",
    neighborhood: "South Lamar",
    description: "The last true Texas honky-tonk in Austin. It's been here since 1964, and the developers circling the lot only make it feel more essential. The dance floor is warped, the chicken-fried steak is enormous, and on any given Tuesday you might two-step next to a 75-year-old who's been coming here since opening night. This is sacred ground.",
    signature: "Wednesday and Saturday night live music. Learn the two-step before you go, or learn it on the floor. Nobody judges.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 38,
    name: "Lady Bird Lake Trail",
    category: "Experience",
    neighborhood: "Downtown",
    description: "A 10-mile hike-and-bike trail that loops around Lady Bird Lake in the heart of the city. It's where Austin runs, walks, paddles, and people-watches. The section between the Pfluger Pedestrian Bridge and the Lamar bridge is the sweet spot — wide paths, good shade, the skyline reflected in still water at dawn.",
    signature: "Sunrise on the south shore trail heading east from Zilker. You'll have it nearly to yourself before 7am.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 39,
    name: "The Contemporary Austin — Laguna Gloria",
    category: "Experience",
    neighborhood: "West Austin",
    description: "An outdoor sculpture park on the shores of Lake Austin, set on the grounds of a 1916 Italianate villa. The permanent collection lives among old-growth trees and lake views, and the temporary installations are consistently some of the most interesting art you'll see in Texas. It's a museum that feels like a walk in the woods.",
    signature: "The Betty and Edward Marcus Sculpture Park trail. Give yourself an hour and follow the path all the way to the lake.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 40,
    name: "Paramount Theatre",
    category: "Experience",
    neighborhood: "Downtown",
    description: "A 1915 movie palace on Congress Avenue that's been beautifully preserved and still hosts live shows, film screenings, and the kind of events that make you feel like you're in a city with taste. The ceiling alone is worth the visit — a painted sky of stars and clouds that makes every show feel slightly more magical.",
    signature: "Catch a classic film screening. They project on the original screen, and the organ sometimes makes an appearance.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 41,
    name: "McKinney Falls State Park",
    category: "Experience",
    neighborhood: "Mueller",
    description: "A state park inside the city limits that most visitors never find. Two waterfalls, swimming holes, miles of hiking trails, and a quiet that feels impossible given that you're ten minutes from the airport. The upper falls are dramatic after rain; the lower falls have a wide, shallow pool that's perfect for wading.",
    signature: "The Onion Creek trail to the lower falls, early morning. Bring water shoes for the rocks.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 42,
    name: "Congress Avenue Bridge Bats",
    category: "Experience",
    neighborhood: "Downtown",
    description: "Every evening from March to October, 1.5 million Mexican free-tailed bats emerge from under the Congress Avenue Bridge in a dark, swirling cloud that takes your breath away. It's one of the largest urban bat colonies in the world, and watching them stream out against a sunset sky is the most Austin thing you can do that costs nothing.",
    signature: "Stand on the southeast side of the bridge, facing east, about 20 minutes before sunset. The bats fly east.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 43,
    name: "The Moody Center",
    category: "Experience",
    neighborhood: "Downtown",
    description: "Austin's newest arena, and it's actually good. The sight lines are intimate for a 15,000-seat venue, the sound system is state-of-the-art, and it's brought acts to Austin that used to skip the city entirely. It's not a dive bar and it's not trying to be — it's a proper concert experience that respects the city's music legacy.",
    signature: "Floor seats for anything. The bowl is steep enough that there's not a bad seat, but the floor energy is unmatched.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 44,
    name: "Uncommon Objects",
    category: "Shop",
    neighborhood: "South Congress",
    description: "A sprawling antique and curiosity shop on South Congress that's been a treasure hunt since 1991. Twenty-plus dealers share the space, and the inventory is wonderfully chaotic — vintage taxidermy next to mid-century lamps next to old Austin concert posters next to things you can't identify but suddenly need. You will leave with something you didn't plan to buy.",
    signature: "The back room with the vintage photography and old Texas maps. Budget an hour minimum.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 45,
    name: "Waterloo Records",
    category: "Shop",
    neighborhood: "Downtown",
    description: "Austin's definitive record store since 1982. The vinyl section is deep, the staff picks are trustworthy, and the in-store performances have hosted everyone from Willie Nelson to Spoon. In a city that calls itself the Live Music Capital, this is the physical manifestation of that claim — a place where the culture lives on shelves.",
    signature: "Check the in-store event calendar. Free live performances happen regularly, and they're always worth rearranging your day for.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "Parts & Labour",
    category: "Shop",
    neighborhood: "East Austin",
    description: "A design shop that stocks the kind of objects you see in magazines and actually want to own. Think ceramics from Texas makers, Japanese kitchen knives, small-batch candles, and perfectly curated home goods. It's a gift shop for people who hate gift shops — everything is beautiful, functional, and chosen with real taste.",
    signature: "The ceramics wall. Everything on it is made by independent Texas and Southwest potters.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 47,
    name: "Helm Boots",
    category: "Shop",
    neighborhood: "East Austin",
    description: "A boot company that designs in Austin and builds by hand in the U.S. The flagship shop is a clean, warm space where you can try on everything from classic leather boots to modern sneaker-boot hybrids. These are the boots you buy once and wear for ten years. Texas heritage without the costume energy.",
    signature: "The Muller boot in natural leather. It ages beautifully and fits like it was made for your foot after a week.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "Blue Genie Art Bazaar",
    category: "Shop",
    neighborhood: "Mueller",
    description: "A pop-up market that runs November through December featuring 200+ local Austin artists and makers. Jewelry, prints, ceramics, textiles, leather goods — all made by hand, all from here. It's the single best place to buy gifts that don't feel generic, and it's proof that Austin's creative economy is alive and thriving.",
    signature: "Go the first week it opens for the best selection. The hand-printed art posters sell out fast.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 49,
    name: "Treaty Oak Distilling",
    category: "Drink",
    neighborhood: "West Austin",
    description: "A craft distillery in Dripping Springs — just outside town — that's doing some of the best spirits in Texas. The ranch is gorgeous, the tasting room is relaxed, and the ghost hill bourbon has won enough awards to justify the drive. It's less a distillery tour and more a lazy afternoon in the Hill Country with great whiskey.",
    signature: "The Red Handed bourbon and a seat on the patio overlooking the ranch. Saturday afternoons are ideal.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "Peter Pan Mini-Golf",
    category: "Experience",
    neighborhood: "Zilker",
    description: "Austin's most beloved piece of kitsch — a 1946 mini-golf course on Barton Springs Road with hand-painted obstacles and a Zilker-adjacent location that makes it the perfect add-on to a day at the springs. It's $5, it's BYOB, and it's been here longer than most of the buildings around it. Old Austin in its purest, most playful form.",
    signature: "Bring a six-pack. Play the south course — it's harder and funnier. Go at dusk when the neon comes on.",
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

const PlaceholderImage = ({ index, size = "full" }) => {
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
    <nav style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 40px" }}>
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 400, color: "#f5f0e8", letterSpacing: 2, textTransform: "uppercase" }}>
        The Fifty
      </div>
      <div style={{ display: "flex", gap: 28, fontSize: 13, color: "rgba(245,240,232,0.7)", letterSpacing: 0.5 }}>
        <span style={{ cursor: "pointer" }}>Cities</span>
        <span style={{ cursor: "pointer" }}>About</span>
        <span style={{ cursor: "pointer" }}>Newsletter</span>
      </div>
    </nav>

    {/* Hero content */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 56px", zIndex: 5 }}>
      <div style={{ maxWidth: 800 }}>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "rgba(245,240,232,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
          Austin, Texas
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Austin
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Still weird. Still worth it. Here's where to actually spend your time.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "rgba(245,240,232,0.45)", letterSpacing: 0.5 }}>
          <span>50 curated picks</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "rgba(245,240,232,0.3)" }} />
          <span>Last updated March 2026</span>
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
    <article style={{
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
      <div style={{ paddingRight: 32 }}>
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
      <div style={{
        width: 180,
        height: 140,
        borderRadius: 8,
        overflow: "hidden",
        flexShrink: 0,
      }}>
        <PlaceholderImage index={index} size="thumb" />
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
        <PlaceholderImage index={index} />
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

// ─── Mobile Entry Preview ────────────────────────────────────────────────────

const MobilePreview = () => {
  const entry = ENTRIES[1]; // Uchi
  const catColor = getCategoryColor(entry.category);
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
          Mobile Experience
        </p>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: 0 }}>
          Designed for the sidewalk
        </h2>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: "#888", marginTop: 12, fontStyle: "italic" }}>
          Because the best recommendations are the ones you can use right now.
        </p>
      </div>

      {/* Phone frame */}
      <div style={{ width: 375, margin: "0 auto", borderRadius: 40, border: "8px solid #1a1a1a", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", backgroundColor: "#FAF7F2" }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 24px 8px", fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>
          <span>9:41</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 11 }}>●●●●</span>
            <span style={{ fontSize: 11 }}>WiFi</span>
            <span style={{ fontSize: 11 }}>100%</span>
          </div>
        </div>

        {/* Mini nav */}
        <div style={{ padding: "8px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"><path d="M12 1L5 9l7 8" /></svg>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: "#1a1a1a" }}>The Fifty</span>
          <div style={{ width: 18 }} />
        </div>

        {/* Scrollable mobile filter pills */}
        <div style={{ padding: "12px 20px", display: "flex", gap: 6, overflowX: "auto" }}>
          {["All", "Eat", "Drink", "Coffee"].map((c, i) => (
            <span key={c} style={{
              padding: "6px 14px", borderRadius: 100, whiteSpace: "nowrap",
              border: i === 0 ? "1.5px solid #1a1a1a" : "1.5px solid rgba(0,0,0,0.1)",
              backgroundColor: i === 0 ? "#1a1a1a" : "transparent",
              color: i === 0 ? "#f5f0e8" : "#777",
              fontSize: 12, fontWeight: 500,
            }}>
              {c}
            </span>
          ))}
          <span style={{ padding: "6px 14px", borderRadius: 100, border: "1.5px solid rgba(0,0,0,0.1)", fontSize: 12, color: "#777", whiteSpace: "nowrap" }}>Stay</span>
        </div>

        {/* Mobile entry */}
        <div style={{ padding: "8px 20px 24px" }}>
          {/* Image */}
          <div style={{ width: "100%", height: 200, borderRadius: 12, overflow: "hidden", marginBottom: 16, position: "relative" }}>
            <PlaceholderImage index={1} />
            <div style={{
              position: "absolute", bottom: 12, left: 14,
              fontFamily: "'Georgia', serif", fontSize: 48, fontWeight: 400,
              color: "rgba(255,255,255,0.9)", lineHeight: 1,
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}>
              02
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              padding: "3px 10px", borderRadius: 100,
              backgroundColor: catColor.bg, color: catColor.text,
              fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
              textTransform: "uppercase",
            }}>
              {entry.category}
            </span>
            <span style={{ fontSize: 12, color: "#999" }}>{entry.neighborhood}</span>
          </div>

          {/* Name */}
          <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 400, color: "#1a1a1a", margin: "0 0 10px" }}>
            {entry.name}
          </h3>

          {/* Description */}
          <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, lineHeight: 1.65, color: "#555", margin: "0 0 12px" }}>
            {entry.description}
          </p>

          {/* Signature */}
          <p style={{
            fontFamily: "'Georgia', serif", fontSize: 12.5, fontStyle: "italic", color: "#999",
            margin: "0 0 18px", lineHeight: 1.5,
            paddingLeft: 14, borderLeft: "2px solid rgba(0,0,0,0.06)",
          }}>
            {entry.signature}
          </p>

          {/* Action button */}
          <button style={{
            width: "100%", padding: "14px 0", borderRadius: 10,
            border: "none", backgroundColor: "#1a1a1a", color: "#f5f0e8",
            fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase",
            cursor: "pointer", fontFamily: "system-ui, sans-serif",
          }}>
            {getActionLabel(entry.actionType)}
          </button>
        </div>

        {/* Peek at next entry */}
        <div style={{ padding: "0 20px 20px", opacity: 0.4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <span style={{ fontFamily: "'Georgia', serif", fontSize: 28, color: "rgba(0,0,0,0.12)" }}>03</span>
            <div>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: "#1a1a1a" }}>Hotel Saint Cecilia</span>
              <span style={{ display: "block", fontSize: 11, color: "#999", marginTop: 2 }}>Stay · South Congress</span>
            </div>
          </div>
        </div>
      </div>
    </section>
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 400, color: "#f5f0e8", margin: "0 0 8px" }}>
            New cities are coming
          </h3>
          <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>
            We'll let you know when we publish the next one. Nothing else.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1, padding: "14px 18px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "#f5f0e8", fontSize: 14,
                fontFamily: "system-ui, sans-serif",
                outline: "none",
              }}
            />
            <button style={{
              padding: "14px 28px", borderRadius: 8,
              border: "none", backgroundColor: "#f5f0e8",
              color: "#1a1a1a", fontSize: 13, fontWeight: 600,
              letterSpacing: 0.5, cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
            }}>
              Notify Me
            </button>
          </div>
        </div>
      </div>

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

export default function AustinCityPage() {
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
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 80px" }}>
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

      {/* Mobile Preview Section */}
      <div style={{ backgroundColor: "#f2ede6", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <MobilePreview />
      </div>

      <Footer />
    </div>
  );
}