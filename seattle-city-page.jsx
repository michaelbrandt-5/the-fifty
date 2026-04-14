import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "Capitol Hill", "Ballard", "Fremont", "Pioneer Square", "Queen Anne", "Georgetown", "Columbia City", "Wallingford", "International District", "West Seattle"];

const ENTRIES = [
  {
    id: 1,
    name: "Canlis",
    category: "Eat",
    neighborhood: "Queen Anne",
    description: "The restaurant that's been Seattle's finest since 1950 and still earns it every single night. Perched above Lake Union in a midcentury masterpiece by Roland Terry, Canlis is the rare fine-dining institution that never coasts on reputation. The kitchen under Brady Williams is restless and precise, the service is warm without being fussy, and that view — the lake, the Cascades, the city below — is the kind of thing that makes you rethink what a restaurant can be.",
    signature: "Book the window table on a clear evening. Order the Canlis salad — it's been on the menu since 1950, and it's still perfect.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 2,
    name: "Storyville Coffee",
    category: "Coffee",
    neighborhood: "Capitol Hill",
    description: "A roaster that treats coffee like wine — origin-specific, meticulously roasted, and served in a space that feels like a velvet-lined living room. The Pike Place location gets the tourists, but the Capitol Hill outpost is where you settle in with a pour-over and watch the neighborhood wake up. The beans are consistently some of the best in a city that takes its coffee personally.",
    signature: "The single-origin pour-over, whatever they're featuring. Ask the barista which origin they're most excited about right now.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 3,
    name: "The Walrus and the Carpenter",
    category: "Eat",
    neighborhood: "Ballard",
    description: "Renee Erickson's oyster bar in Ballard is the plate that launched an empire. The space is small, the wait is real, and the oysters — briny, pristine, shucked with surgical precision — are the best in the city. The menu beyond bivalves is just as sharp: steak tartare, roasted bone marrow, a perfect butter lettuce salad. It's the kind of place that makes you want to eat seafood every day for the rest of your life.",
    signature: "Go at 4pm on a weekday when the doors open. Skip the reservation and sit at the bar. Order a dozen oysters and the citrus salad.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 4,
    name: "Ace Hotel Seattle",
    category: "Stay",
    neighborhood: "Capitol Hill",
    description: "Before the Ace became a global brand, it was this — a converted flophouse on First Avenue that paired Pendleton blankets with army surplus cots and somehow invented a whole aesthetic. The Seattle original still has that scrappy energy, plus a location that puts you steps from Pike Place and Pioneer Square. It's not the fanciest hotel in town, but it might be the most Seattle.",
    signature: "Book a standard room with shared bath if you want the original experience. It's cheaper and more authentic than you'd expect.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 5,
    name: "Pike Place Market",
    category: "Experience",
    neighborhood: "Pioneer Square",
    description: "Yes, it's on every tourist list. No, you haven't actually done it right. Skip the fish-throwing and the first Starbucks line. Go downstairs — the lower levels are a labyrinth of vintage shops, comic stores, and the best cheap lunch counters in the city. The farmers market is where Seattle's best chefs shop on Saturdays before 9am. This place has been here since 1907 because it's the real thing.",
    signature: "The DownUnder shops on the lower floors. Find the magic shop and the vintage poster dealers. Budget an hour you didn't plan for.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 6,
    name: "Elm Coffee Roasters",
    category: "Coffee",
    neighborhood: "Capitol Hill",
    description: "A minimalist temple to light-roast coffee in a soaring Capitol Hill space with concrete floors and double-height ceilings. The roasting happens on-site, the espresso is dialed to an almost absurd degree of precision, and the vibe is more design studio than coffeehouse. If you care about extraction and origin, this is your church.",
    signature: "The espresso. Single origin, rotating constantly. Stand at the bar and watch them pull it — the latte art is genuine craft.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "Canon",
    category: "Drink",
    neighborhood: "Capitol Hill",
    description: "A whiskey bar with over 4,000 bottles and a cocktail program that treats mixology like a graduate thesis. The space is dark, layered, and unapologetically nerdy — bookshelves of rare spirits, antique barware on display, bartenders who can discourse on pre-Prohibition rye for an hour if you let them. It's been called the best bar in America, and on a good night, it's hard to argue.",
    signature: "Ask for the bartender's choice and name a spirit you love. They'll build something you've never had and can't forget.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 8,
    name: "Joule",
    category: "Eat",
    neighborhood: "Capitol Hill",
    description: "Rachel Yang and Seif Chirchi's Korean-meets-everything restaurant in a converted auto body shop. The galbi short ribs with smoked salt are the signature for a reason — charred, sweet, impossibly tender — but the whole menu swings between Korean comfort and French technique with a confidence that makes fusion feel like a dirty word for lesser kitchens. The late-night happy hour is one of Capitol Hill's best secrets.",
    signature: "The kalbi steak and the congee. Go on a weeknight after 9pm for the late-night menu — half the price, all the flavor.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 9,
    name: "Chihuly Garden and Glass",
    category: "Experience",
    neighborhood: "Queen Anne",
    description: "Dale Chihuly is Seattle's artist laureate, and this permanent installation at the base of the Space Needle is his masterwork. The Glasshouse alone — a 40-foot structure filled with a suspended red-and-orange sculpture — justifies the admission. The outdoor garden, where blown glass erupts from beds of flowers and native plantings, is genuinely otherworldly. Even the cynics leave impressed.",
    signature: "Go at dusk. The garden is illuminated at night, and the glass takes on an entirely different life in artificial light.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 10,
    name: "Serious Pie",
    category: "Eat",
    neighborhood: "Capitol Hill",
    description: "Tom Douglas got serious about pizza and the city never recovered. The dough is impossibly blistered and chewy, the toppings are restrained and perfect — chanterelle with truffle oil, clam with pancetta, a simple margherita that proves the basics matter most. The original downtown location is a wood-paneled cave with a roaring oven at its heart. Order a pizza, order a second pizza. Nobody's judging.",
    signature: "The mushroom pizza with truffle oil. It's been on since day one and it's the one everyone orders for a reason.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "Elliott Bay Book Company",
    category: "Shop",
    neighborhood: "Capitol Hill",
    description: "Seattle's cathedral of books. Moved from Pioneer Square to Capitol Hill in 2010 and somehow got even better — 20,000 square feet of handpicked inventory, a staff whose recommendations you can trust with your life, and a reading series that pulls authors other cities only dream about. The exposed wood beams, the creaky floors, the smell of paper — this is what a bookstore is supposed to feel like.",
    signature: "Ask at the front desk for the staff picks shelf. Then go downstairs to the basement for the bargain section — it's curated, not dumped.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 12,
    name: "Bateau",
    category: "Eat",
    neighborhood: "Capitol Hill",
    description: "A whole-animal restaurant where every cut comes from a single steer, sourced from a single ranch, broken down in-house. The chalkboard menu changes based on what's available — you might get hanger steak one night and beef cheek the next. The cooking is simple, the sourcing is obsessive, and the result is beef that tastes like beef used to taste before feedlots ruined everything.",
    signature: "The daily steak, whatever cut they're running. Ask the server what came in today and trust their recommendation.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 13,
    name: "Discovery Park",
    category: "Experience",
    neighborhood: "Queen Anne",
    description: "Five hundred acres of old-growth forest, sea cliffs, and sandy beaches inside the city limits. The loop trail to the lighthouse takes about two hours and feels like you've left Seattle entirely — eagles overhead, ships passing through Puget Sound, the Olympics glowing across the water. It's the hike every Seattleite takes their visitors on, and every time it delivers.",
    signature: "Take the South Beach trail to the lighthouse. Go on a clear day and bring binoculars — you can see Mount Rainier from the bluffs.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 14,
    name: "Fremont Brewing",
    category: "Drink",
    neighborhood: "Fremont",
    description: "A neighborhood brewery with communal tables, a family-friendly patio, and some of the best IPAs in the Pacific Northwest. Fremont doesn't do food, so you bring your own or grab from one of the nearby trucks. The Urban Pale Ale is a gateway drug; the bourbon-barrel-aged dark beers are where they really flex. Unpretentious, democratic, and consistently excellent.",
    signature: "The Lush IPA on a warm afternoon at the outdoor tables. Bring a dog, bring a kid, bring a pizza from down the street.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 15,
    name: "Salumi",
    category: "Eat",
    neighborhood: "Pioneer Square",
    description: "The Batali family cured-meat shop that turned a Pioneer Square alley into a pilgrimage site. The hot sandwiches — porchetta, meatball, lamb — come on Fiore bakery bread and are absurdly, almost unfairly good. The line moves fast, the portions are generous, and the culatello hanging in the window is a reminder that real craft still matters. Cash only, no substitutions, no apologies.",
    signature: "The hot porchetta sandwich. Tuesday through Friday only — they're closed weekends, which only adds to the mystique.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 16,
    name: "Museum of Pop Culture",
    category: "Experience",
    neighborhood: "Queen Anne",
    description: "Frank Gehry's crumpled-metal building at the foot of the Space Needle houses one of the best music and sci-fi collections in the country. The Hendrix exhibit is permanent and essential. The indie game design wing is surprisingly deep. The Sound Lab, where you can play instruments in soundproof rooms, is the most fun you'll have at any museum in Seattle. Skip the gift shop, spend the time in the Fantasy exhibit instead.",
    signature: "The Sound Lab on the third floor. Grab a guitar, close the door, and play for as long as you want. Nobody's listening.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 17,
    name: "Altura",
    category: "Eat",
    neighborhood: "Capitol Hill",
    description: "A tiny, intensely personal Italian restaurant on Capitol Hill where chef Nathan Lockwood cooks a multi-course tasting menu that changes nightly based on what walked in the door. The space seats maybe 30 people. The pasta is hand-rolled. The wine list is all Italian and all interesting. It's the kind of place that reminds you that fine dining doesn't have to mean formal — it just has to mean someone cares.",
    signature: "The tasting menu, always. Let them pair the wines. The handmade pasta course is always the peak.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 18,
    name: "Glasswing",
    category: "Drink",
    neighborhood: "Capitol Hill",
    description: "A cocktail bar that feels like someone's immaculate apartment — blush tones, low light, plants everywhere, and a menu of drinks so pretty you'll photograph them before tasting them. But the beauty isn't hollow. The cocktails are technically sharp and balanced, the bartenders are warm, and the small-plates menu holds its own. It's Capitol Hill at its most polished without losing its soul.",
    signature: "The dealer's choice. Tell them your mood and a flavor you're craving. They'll nail it every time.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 19,
    name: "Volunteer Park Conservatory",
    category: "Experience",
    neighborhood: "Capitol Hill",
    description: "A Victorian-era glass greenhouse on Capitol Hill filled with orchids, cacti, bromeliads, and a humid warmth that feels like a miracle on a February afternoon. It's been here since 1912, it's free, and it's the most underrated ten minutes you can spend in Seattle. The surrounding park — with its water tower lookout and the Seattle Asian Art Museum — makes it a full morning if you let it.",
    signature: "Climb the water tower steps for a 360-degree view of the city and the mountains. It's free and almost nobody does it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Archipelago",
    category: "Eat",
    neighborhood: "Georgetown",
    description: "Filipino food elevated without being sanitized. Chef Aaron Verzosa and Amber Manuguid are telling the story of Filipino cuisine through technique and memory — the kare-kare is rich with tradition, the lumpia are impossibly crisp, and every dish feels like it's carrying something personal. Georgetown is worth the trip for this alone.",
    signature: "The tasting menu is the way to go. Let them walk you through the courses — each one has a story worth hearing.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 21,
    name: "Broadcast Coffee",
    category: "Coffee",
    neighborhood: "Capitol Hill",
    description: "A third-wave roaster with multiple locations, but the Capitol Hill shop on East Union is the flagship and the best. The coffee is roasted in small batches with a light hand, the space is sun-drenched and minimal, and the baristas are the kind of people who actually enjoy explaining the difference between a natural and a washed process. Neighborhood coffee at its best.",
    signature: "The cortado made with their rotating single-origin espresso. Sit by the window — the people-watching on Union is unbeatable.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 22,
    name: "Ballard Locks",
    category: "Experience",
    neighborhood: "Ballard",
    description: "The Hiram M. Chittenden Locks connect Puget Sound to Lake Union and Lake Washington, and watching boats rise and fall in the lock chambers is hypnotic in a way you don't expect. The real draw, though, is the fish ladder — an underwater window where you can watch salmon fighting upstream during the summer runs. Free, fascinating, and weirdly moving.",
    signature: "Visit between June and September during salmon season. The fish ladder viewing window is underground — follow the signs past the botanical garden.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 23,
    name: "Kamonegi",
    category: "Eat",
    neighborhood: "Fremont",
    description: "A soba noodle shop in Fremont where the noodles are hand-cut to order and the tempura is some of the lightest, crispiest you'll find outside of Tokyo. Chef Mutsuko Soma learned her craft in Japan and brought it to a tiny Fremont storefront that's become one of the most beloved restaurants in Seattle. The menu is short because everything on it is perfect.",
    signature: "The duck soba and the seasonal tempura. Whatever vegetable they're frying right now, order it. They know what they're doing.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 24,
    name: "Hotel Sorrento",
    category: "Stay",
    neighborhood: "Capitol Hill",
    description: "A 1909 Italianate hotel on First Hill that feels like it belongs in a black-and-white film. The Fireside Room — all dark wood and leather — is one of the best cocktail bars in the city even if you're not a guest. The rooms have been updated without losing their character, and the location, perched above downtown with views of Elliott Bay, makes you feel like you're in on something the rest of the city forgot about.",
    signature: "Drinks in the Fireside Room on a rainy night. The mahogany bar, the fireplace, a Manhattan — that's the whole plan.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 25,
    name: "Zig Zag Café",
    category: "Drink",
    neighborhood: "Pioneer Square",
    description: "Hidden at the bottom of the Pike Place Market stairs, Zig Zag has been one of the most important cocktail bars in the country for over two decades. Murray Stenson mixed the modern Aviation here — the drink that helped launch the cocktail revival. The bar is intimate, the bartenders are craftsmen, and every drink arrives with the quiet confidence of a place that knows its own legacy.",
    signature: "The Last Word — gin, green chartreuse, maraschino, lime. It was revived here and it's still the move.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 26,
    name: "Jade Garden",
    category: "Eat",
    neighborhood: "International District",
    description: "The dim sum spot that locals protect like a state secret. Weekends bring a cart-service chaos that's part of the charm — point at what looks good, say yes more than no, and end up with a table full of har gow, siu mai, and turnip cakes that cost less than a single cocktail across town. The space is fluorescent-lit and no-frills, and that's exactly the point.",
    signature: "Go before 11am on a Saturday. The har gow and the egg custard tarts, straight from the cart. Don't overthink it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 27,
    name: "Victrola Coffee Roasters",
    category: "Coffee",
    neighborhood: "Capitol Hill",
    description: "One of Seattle's original third-wave roasters, and still one of the best. The Capitol Hill shop on 15th has been a neighborhood anchor for over twenty years — the kind of place where baristas know regulars by name and the pour-over is treated with reverence but not pretension. The roasting is nuanced and consistent, and the public cuppings on Wednesdays are a masterclass in what coffee can be.",
    signature: "The Wednesday public cupping at the roastery. Free, educational, and the best way to understand what makes their coffee different.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 28,
    name: "Westland Distillery",
    category: "Drink",
    neighborhood: "Georgetown",
    description: "An American single-malt whiskey distillery in Georgetown that's rewriting the rules of what whiskey can be in the Pacific Northwest. The peat comes from Shelton, Washington. The barley is local. The Garryana expression — aged in native Oregon white oak — is unlike anything being made anywhere else. The tasting room is industrial-chic and the tours are worth every minute.",
    signature: "The Garryana single malt. It's made with oak that only grows in the Pacific Northwest. Nothing else tastes like this.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "Olympic Sculpture Park",
    category: "Experience",
    neighborhood: "Queen Anne",
    description: "A nine-acre waterfront park that zigzags from the city down to the shoreline, with large-scale sculptures dotting the landscape the whole way. Calder's Eagle is the icon, but the Richard Serra piece and the Typewriter Eraser are quietly stunning. On a clear day, the Olympic Mountains frame every view. Free, always open, and one of the best walks in the city.",
    signature: "Walk it north to south, ending at the beach. On a clear day, the view of the Olympics from the lower meadow is staggering.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 30,
    name: "Ba Bar",
    category: "Eat",
    neighborhood: "Capitol Hill",
    description: "A Vietnamese restaurant that serves the kind of pho you reorganize your day around. The broth simmers for 12 hours, the herbs are piled high, and the menu stretches from banh mi to clay pot catfish with the easy confidence of a kitchen that knows this food cold. The Capitol Hill location hums on weekend mornings with the hungover and the hungry, and both leave happy.",
    signature: "The pho tai with rare beef and the fresh spring rolls. Simple, perfect, under fifteen dollars.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 31,
    name: "Filson",
    category: "Shop",
    neighborhood: "Georgetown",
    description: "The Seattle outfitter has been making rugged gear since 1897, and the flagship store in Georgetown is a temple to the brand's heritage. Tin cloth jackets, waxed canvas bags, wool shirts — everything is built to outlast you. The store itself is beautiful, with vintage photos and original garments on display. You're buying a piece of Pacific Northwest history, and it'll last long enough to pass down.",
    signature: "The Rugged Twill Tote. It's the bag every Seattleite secretly owns. Check the seconds rack in the back for discounts on cosmetically imperfect pieces.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 32,
    name: "Seattle Art Museum",
    category: "Experience",
    neighborhood: "Pioneer Square",
    description: "The main branch on First Avenue has a permanent collection that punches well above the city's weight — strong in Native American, Asian, and modern art, with temporary exhibitions that consistently surprise. The Hammering Man out front is a Seattle landmark, but the real draws are inside: the Kehinde Wiley painting, the Pacific Northwest Native galleries, and a photography collection that deserves more attention.",
    signature: "First Thursdays are free. Go straight to the Native American galleries on the third floor — they're world-class and often empty.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 33,
    name: "Manolin",
    category: "Eat",
    neighborhood: "Fremont",
    description: "A ceviche-and-raw-bar restaurant in Fremont that makes Pacific Northwest seafood feel tropical. The ceviche flights let you taste three preparations side by side — each one a little revelation. The fried chicken sandwich at lunch is a sleeper hit, and the natural wine list is short, smart, and reasonably priced. It's the kind of place that makes you eat lighter and feel better about it.",
    signature: "The ceviche flight and a glass of whatever orange wine they're pouring. Lunch at the counter is the move.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 34,
    name: "Ada's Technical Books and Café",
    category: "Shop",
    neighborhood: "Capitol Hill",
    description: "A bookshop-café hybrid that caters to the scientifically curious and the deeply nerdy. The shelves are stacked with coding manuals, design monographs, speculative fiction, and the kind of obscure technical texts you didn't know you needed. The café serves solid espresso and the Wi-Fi is fast. It's a love letter to Seattle's tech culture without the venture-capital energy.",
    signature: "The science fiction section in the back. Curated by people who actually read the genre, not an algorithm.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 35,
    name: "The Whale Wins",
    category: "Eat",
    neighborhood: "Wallingford",
    description: "Renee Erickson's vegetable-forward restaurant in a light-filled Wallingford warehouse. The wood-fired oven does most of the heavy lifting — roasted carrots that taste like candy, blistered flatbreads with seasonal toppings, whole fish that arrives crackling and golden. The space is airy and Scandinavian in spirit, with long communal tables and a menu that makes you forget you're barely eating meat.",
    signature: "The roasted carrots and the flatbread with whatever's seasonal. Sit at the communal table — it's how the room is meant to be experienced.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 36,
    name: "Fremont Sunday Market",
    category: "Shop",
    neighborhood: "Fremont",
    description: "Every Sunday, year-round, Fremont fills with vendors selling everything from vintage furniture to handmade jewelry to the kind of random antiques that demand a story. It's smaller and scrappier than Pike Place, which is exactly the point. The food stalls are solid, the people-watching is excellent, and you'll always leave with something you didn't know existed an hour ago.",
    signature: "Get there by 10am for the best vintage finds. The food trucks on the south end are better than you'd expect — try the tamales.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Rob Roy",
    category: "Drink",
    neighborhood: "Capitol Hill",
    description: "A dark, low-ceilinged cocktail bar on Capitol Hill that feels like a speakeasy without ever using the word. The cocktails are spirit-forward and expertly stirred, the music is good without being obnoxious, and the crowd is a mix of industry people and regulars who just want a well-made drink in a room that doesn't try too hard. It's the bar other bartenders drink at, which tells you everything.",
    signature: "A Negroni at the back booth. It's one of the best-made in the city, and the booth gives you the whole room.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 38,
    name: "Kerry Park",
    category: "Experience",
    neighborhood: "Queen Anne",
    description: "The postcard view. The Space Needle, the skyline, Mount Rainier floating behind it all — this is the photograph that sells the city. It's a tiny pocket park on the south slope of Queen Anne, and on a clear day, there is no better view in the Pacific Northwest. Go at sunset if you want drama. Go at dawn if you want it to yourself.",
    signature: "Dawn on a clear morning after rain. Rainier comes out like a painting and you'll have the park to yourself.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 39,
    name: "Café Besalu",
    category: "Coffee",
    neighborhood: "Ballard",
    description: "A tiny French bakery in Ballard that makes croissants so flaky and butter-rich they could make a Parisian nod with respect. The line out the door on Saturday mornings is a neighborhood ritual. The coffee is fine — you're here for the pastry. The sweet and savory options rotate, but the plain croissant is the benchmark, and it's among the best on the West Coast.",
    signature: "The plain croissant and an Americano. Arrive before 9am on weekends or accept that the croissants will be gone.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 40,
    name: "Georgetown Records",
    category: "Shop",
    neighborhood: "Georgetown",
    description: "A vinyl-only record shop in an industrial pocket of Georgetown that feels like a time capsule. The bins are deep and well-organized, the prices are fair, and the staff has the kind of knowledge that makes Discogs feel impersonal. The emphasis is on punk, indie, metal, and Pacific Northwest music, but the jazz and soul sections are worth digging through too.",
    signature: "The local section. Georgetown Records stocks more Pacific Northwest bands than anywhere else in the city. Ask the staff — they're walking encyclopedias.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 41,
    name: "The Inn at the Market",
    category: "Stay",
    neighborhood: "Pioneer Square",
    description: "The only hotel inside Pike Place Market, and it earns the location. The rooms are comfortable rather than flashy, the rooftop deck overlooks Elliott Bay, and waking up to the sound of the market coming alive below your window is something no other hotel in Seattle can offer. It's a boutique property that trades on proximity and charm, and both pay off.",
    signature: "Request a bay-view room on an upper floor. Morning coffee on the rooftop deck, watching the ferries cross Elliott Bay.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 42,
    name: "Bait Shop",
    category: "Drink",
    neighborhood: "Capitol Hill",
    description: "A natural wine bar and bottle shop on Capitol Hill that feels like drinking in your cool friend's apartment. The selection is small, interesting, and constantly rotating — mostly European producers with a soft spot for low-intervention everything. The snacks are simple and good, the playlist is always right, and the staff will happily talk wine without a trace of snobbery.",
    signature: "Buy a bottle to take home and drink a glass to stay. Tell them what you like and what you want to spend — they'll steer you right.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 43,
    name: "Paseo",
    category: "Eat",
    neighborhood: "Fremont",
    description: "A Caribbean sandwich shop that inspires the kind of devotion usually reserved for sports teams. The roasted pork sandwich — caramelized onions, aioli, cilantro, pressed onto a toasted baguette — is a transcendent object. The Fremont original is a walk-up window with a small patio, and the line snakes around the block, but it moves fast and every second of waiting is justified.",
    signature: "The Caribbean Roast. No substitutions, no modifications, no thinking. It's been perfect for years.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 44,
    name: "Washington Park Arboretum",
    category: "Experience",
    neighborhood: "Capitol Hill",
    description: "Two hundred acres of curated forest and wetlands that connect Capitol Hill to the shores of Lake Washington. The Japanese Garden is a masterpiece of contemplative design — raked gravel, koi ponds, perfectly placed stones. The Azalea Way in spring is a tunnel of color. And the Foster Island trail, a boardwalk over the marsh, feels like leaving the city entirely without ever starting your car.",
    signature: "The Japanese Garden in October. The maples turn, the light goes golden, and it's one of the most beautiful places in the Pacific Northwest.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 45,
    name: "Revel",
    category: "Eat",
    neighborhood: "Fremont",
    description: "Rachel Yang's other restaurant, and some nights the better one. The menu is Korean at its core but borrows freely from wherever it wants — rice bowls with short rib, dumplings with unexpected fillings, pancakes that shatter when you bite them. The space is bright and energetic, the prices are fair, and the noodles alone are worth crossing town for.",
    signature: "The short rib rice bowl and the scallion pancake. Lunch is less crowded and just as good as dinner.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "Glasybaby",
    category: "Shop",
    neighborhood: "Capitol Hill",
    description: "Hand-blown glass votives made in Seattle since 2001, each one unique, each one named. The flagship store on Madrona is a kaleidoscope of color — hundreds of glowing votives lining the walls and shelves. It's a genuine Seattle original, and the company donates a portion of every sale to charities. Buy one and light it at home — it becomes the best lamp you own.",
    signature: "Pick one in person — the colors look different with a candle inside. The workshop in Madrona sometimes offers blow-your-own sessions.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 47,
    name: "Fremont Troll",
    category: "Experience",
    neighborhood: "Fremont",
    description: "An 18-foot concrete troll clutching a real Volkswagen Beetle under the Aurora Bridge. It's public art at its most delightfully weird — a 1990 neighborhood project that became an icon. You'll see it, take a photo, and spend about five minutes there. But those five minutes are pure Seattle: strange, charming, and completely uninterested in impressing you.",
    signature: "Walk under the bridge to see the full scale of it. Then walk two blocks to the Lenin statue, because of course Fremont has one.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "Thompson Seattle",
    category: "Stay",
    neighborhood: "Pioneer Square",
    description: "A design hotel on First Avenue with clean lines, floor-to-ceiling windows, and a rooftop bar that might have the best view in the neighborhood. The rooms are modern without being cold, the location is central to everything, and the Nest rooftop lounge — all glass and skyline — is a destination even for non-guests. It's the hotel for people who want something sharper than a chain but less fussy than a boutique.",
    signature: "A drink at the Nest rooftop bar at sunset. The view of Elliott Bay and the Olympic Mountains is the kind of thing that makes you rethink moving here.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 49,
    name: "Kedai Makan",
    category: "Eat",
    neighborhood: "Capitol Hill",
    description: "A Malaysian restaurant on Capitol Hill that serves the kind of food you can't find anywhere else in the city. The nasi lemak is fragrant and perfectly composed, the roti canai comes with curry that demands to be sopped up, and the laksa is a coconut-rich bowl of warmth that feels like medicine on a gray Seattle day. Small, personal, and absolutely essential.",
    signature: "The nasi lemak and a teh tarik. Go on a weeknight to avoid the wait. This place doesn't take reservations and it's always full for a reason.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "Alki Beach",
    category: "Experience",
    neighborhood: "West Seattle",
    description: "Seattle's original landing point and still its best beach — a 2.5-mile strip of sand and boardwalk facing the downtown skyline across Elliott Bay. On a summer evening, the whole city seems to migrate here: bonfires on the sand, volleyball games, the skyline glowing orange in the sunset. It's not Hawaii and it's not trying to be. It's a Pacific Northwest beach, and on the right day, there's nowhere better.",
    signature: "Sunset on a clear summer evening. Bring wood for the fire pits on the north end. The skyline view across the water is the best free show in town.",
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
      background: "linear-gradient(135deg, #2a3035 0%, #3a4a55 25%, #2a4040 50%, #4a5a55 75%, #2a3530 100%)",
    }}>
      {/* Abstract city-light shapes */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(150,200,220,0.12) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "40%", right: "15%", width: 400, height: 250, background: "radial-gradient(ellipse, rgba(120,180,160,0.08) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 350, height: 180, background: "radial-gradient(ellipse, rgba(160,180,200,0.06) 0%, transparent 70%)" }} />
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
          Seattle, Washington
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Seattle
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Rain or shine. Mostly rain. Always worth it.
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
          {entry.signature.length > 90 ? entry.signature.slice(0, 90) + "..." : entry.signature}
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
  const entry = ENTRIES[2]; // The Walrus and the Carpenter
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
            <PlaceholderImage index={2} />
            <div style={{
              position: "absolute", bottom: 12, left: 14,
              fontFamily: "'Georgia', serif", fontSize: 48, fontWeight: 400,
              color: "rgba(255,255,255,0.9)", lineHeight: 1,
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}>
              03
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
            <span style={{ fontFamily: "'Georgia', serif", fontSize: 28, color: "rgba(0,0,0,0.12)" }}>04</span>
            <div>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: "#1a1a1a" }}>Ace Hotel Seattle</span>
              <span style={{ display: "block", fontSize: 11, color: "#999", marginTop: 2 }}>Stay · Capitol Hill</span>
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
    { name: "Portland", tagline: "The other one. The weird one. The good one." },
    { name: "San Francisco", tagline: "Fog, hills, and the best food in America." },
    { name: "Los Angeles", tagline: "Sprawl with soul. You just have to know where." },
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

export default function SeattleCityPage() {
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
