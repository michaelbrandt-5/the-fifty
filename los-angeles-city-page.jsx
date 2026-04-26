import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";
import { subscribeEmail } from "./src/mailchimp.js";
import CityMap from "./src/CityMap.jsx";
import LOCATIONS from "./src/locations.json";
import PageMeta from "./src/PageMeta.jsx";

const CITY_PHOTOS = PHOTOS["los-angeles"] || {};
const CITY_LOCATIONS = LOCATIONS["los-angeles"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "Silver Lake", "Echo Park", "Los Feliz", "Arts District", "Venice", "Highland Park", "Santa Monica", "West Hollywood", "Koreatown", "Culver City", "Downtown"];

const ENTRIES = [
  {
    id: 1,
    name: "Sqirl",
    category: "Eat",
    neighborhood: "Silver Lake",
    description: "The ricotta toast that launched a thousand Instagram accounts, yes. But Sqirl is more than that — it's a tiny, sun-drenched kitchen turning out some of the most thoughtful grain bowls and seasonal plates on the east side. Jessica Koslow's preserves are legendary for a reason. The line moves fast. The food is worth the wait.",
    signature: "The sorrel pesto rice bowl with a poached egg. Get the house-made hot sauce on the side and use all of it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 2,
    name: "Bestia",
    category: "Eat",
    neighborhood: "Arts District",
    description: "The restaurant that put the Arts District on the culinary map and somehow hasn't lost a step in over a decade. Ori Menashe's Italian cooking is muscular and unapologetic — house-made salumi, wood-fired pizzas, pastas that could make a Bolognese weep. The room is industrial-gorgeous, loud in the best way, and impossible to get into on short notice. Plan ahead.",
    signature: "The spaghetti rustichella with dungeness crab. Reserve at least two weeks out — cancellations drop on the app around 9am.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "The Broad",
    category: "Experience",
    neighborhood: "Arts District",
    description: "Eli and Edythe Broad's contemporary art museum is free, stunning, and houses one of the most important postwar collections in the world. Basquiat, Koons, Ruscha, Haring — all under one vaulted honeycomb roof designed by Diller Scofidio + Renfro. The infinity mirror room still draws lines, but the permanent collection alone justifies the visit.",
    signature: "Book the Yayoi Kusama Infinity Mirrored Room tickets online in advance — they're timed and free but disappear fast.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 4,
    name: "Intelligentsia Coffee",
    category: "Coffee",
    neighborhood: "Silver Lake",
    description: "The Silver Lake outpost of the pioneering third-wave roaster is still one of the best coffee experiences in LA. The bar is long, the baristas are precise without being pretentious, and the space has this mid-century Californian ease that makes a twenty-minute espresso session feel like self-care. They helped invent direct trade. You can taste the conviction.",
    signature: "The black cat espresso pulled long. Sit at the bar and watch them work — it's a masterclass in extraction.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 5,
    name: "Petit Trois",
    category: "Eat",
    neighborhood: "Highland Park",
    description: "Ludo Lefebvre's no-reservations French bistro is a love letter to the kind of Paris meal you can't believe costs this little. The counter seats thirteen, the menu is short, and every single thing on it — from the omelette to the double cheeseburger — is executed with a precision that borders on obsessive. This is French food that doesn't need a white tablecloth to prove anything.",
    signature: "The burgundy truffle mashed potatoes. You will think about them for days.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 6,
    name: "Griffith Observatory",
    category: "Experience",
    neighborhood: "Los Feliz",
    description: "Every city has an icon. This one earns it. Perched on the south slope of Mount Hollywood, the observatory offers the single best free view in Los Angeles — the basin sprawling to the Pacific on one side, the Hollywood sign close enough to feel personal on the other. Come at sunset, stay for the telescope. The planetarium shows are quietly world-class.",
    signature: "Tuesday through Friday evenings, the Zeiss telescope on the roof is free and open to the public. The line is worth it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "Bar Flores",
    category: "Drink",
    neighborhood: "Echo Park",
    description: "A mezcal-forward bar in Echo Park that feels like drinking in someone's exceptionally cool backyard. The patio is strung with lights, the cocktails are agave-centric and bracingly good, and the vibe splits the difference between neighborhood local and destination bar. The food menu — tacos, tostadas, elote — is better than it needs to be.",
    signature: "The spicy mezcal margarita on the back patio. Thursday nights have a DJ who actually reads the room.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 8,
    name: "Bavel",
    category: "Eat",
    neighborhood: "Arts District",
    description: "Ori Menashe's second act — a Middle Eastern restaurant that might actually be better than Bestia. The lamb neck shawarma is transcendent, the hummus is impossibly smooth, and the pita arrives puffed and blistered from a wood-burning oven. The dining room is a desert oasis of hanging plants and warm light. Every bite feels like the product of deep, personal knowledge.",
    signature: "The malawach with grated tomato. And the lamb neck shawarma — share it with the table or don't share it at all.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 9,
    name: "Aesther Coffee Roasters",
    category: "Coffee",
    neighborhood: "West Hollywood",
    description: "A minimalist temple to single-origin coffee tucked into a West Hollywood side street. The space is all clean lines and natural light, the baristas treat every pour-over like a small ceremony, and the rotating roasts are sourced with an obsessive's eye. It's the kind of place that makes you realize you've been drinking bad coffee your whole life.",
    signature: "Ask for the single-origin pour-over of the day. They'll walk you through the tasting notes without making you feel like a student.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 10,
    name: "Gjusta",
    category: "Eat",
    neighborhood: "Venice",
    description: "A bakery-deli-smokehouse-restaurant that defies categorization and excels at all of it. The pastries are extraordinary, the sandwiches are stacked with house-smoked fish and cured meats, and the outdoor seating — picnic tables in a Venice alley — is peak LA casual. Travis Lett built a food hall before food halls were a thing, and it still feels ahead of the curve.",
    signature: "The smoked salmon toast and a cardamom morning bun. Go before 10am on a weekday or prepare to wait.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "The Getty Center",
    category: "Experience",
    neighborhood: "Santa Monica",
    description: "Richard Meier's white travertine campus sits on a hilltop above the 405, and the architecture alone is worth the tram ride up. The gardens are immaculate, the views stretch from the mountains to the sea, and the collection — Van Gogh's Irises, manuscripts, photography — is staggering and free. This is a place that makes you proud of what a city can build.",
    signature: "The Central Garden designed by Robert Irwin. Walk the azalea maze, then find the terrace overlooking the Pacific. Free parking after 3pm.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 12,
    name: "Jeon Ju",
    category: "Eat",
    neighborhood: "Koreatown",
    description: "A 24-hour Korean restaurant in the heart of K-Town that specializes in hand-pulled noodles and massive shareable plates. The galbi-jjim — braised short ribs falling off the bone in a sweet-savory sauce — is some of the best comfort food in the city. Fluorescent lights, no frills, incredible food at 2am. This is what Koreatown is about.",
    signature: "The kalguksu — hand-cut knife noodles in anchovy broth. Order it with the seafood pancake. Go after midnight.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 13,
    name: "Chateau Marmont",
    category: "Stay",
    neighborhood: "West Hollywood",
    description: "The most storied hotel in Los Angeles, perched above Sunset like a Gothic sentinel. The rooms are deliberately un-renovated, the lobby bar is where half the deals in Hollywood get made, and the bungalows have housed everyone from Garbo to Warhol. It's not the fanciest hotel in the city. It's the one with a soul.",
    signature: "The garden restaurant for a late dinner. Request a corner table and order the roast chicken. Don't gawk — everyone here is pretending not to look.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 14,
    name: "Republique",
    category: "Eat",
    neighborhood: "West Hollywood",
    description: "Walter and Margarita Manzke's all-day restaurant in a gorgeous 1929 Charlie Chaplin building. The pastry program is among the best in the country — the croissants alone are worth a detour. Dinner pivots to refined French-Californian cooking that's polished without being stiff. The building does a lot of work, but the food does more.",
    signature: "Weekend brunch: the kimchi fried rice with pork belly and a sunny egg. Arrive by 9:30 or face the consequences.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 15,
    name: "Skylight Books",
    category: "Shop",
    neighborhood: "Los Feliz",
    description: "Los Feliz's beloved independent bookstore has been the literary nerve center of the east side since 1996. The selection is impeccable — strong on fiction, poetry, LA history, and small press. The staff picks are genuinely trustworthy, the author events draw serious names, and the whole place has the quiet authority of a shop that knows exactly what it's doing.",
    signature: "The used section in the back room. Check the staff picks shelf by the register — they've never steered anyone wrong.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 16,
    name: "The Wolves Downtown",
    category: "Drink",
    neighborhood: "Arts District",
    description: "A cocktail bar in the Arts District that takes the craft seriously without the speakeasy cosplay. The menu is inventive and seasonal, the bartenders are among the best in the city, and the room — raw concrete, candlelight, a long marble bar — sets the mood without trying too hard. This is where you come when you want a drink made by someone who cares.",
    signature: "The bartender's choice. Tell them what spirits you like and let them work. You won't be disappointed.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 17,
    name: "Guelaguetza",
    category: "Eat",
    neighborhood: "Koreatown",
    description: "An Oaxacan institution in Koreatown that's been serving some of the most authentic moles in America for over two decades. The Lopez family brought seven moles from Oaxaca and they make every one from scratch. The tlayuda is the size of a hubcap and tastes like a revelation. This is the kind of restaurant where the food connects you to a place thousands of miles away.",
    signature: "The mole negro with chicken. It takes days to make and you can taste every hour. Pair it with a mezcal from their Oaxacan-focused bar.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 18,
    name: "Runyon Canyon",
    category: "Experience",
    neighborhood: "West Hollywood",
    description: "The most accessible hike in LA, and the views earn every drop of sweat. The trail climbs from Hollywood up to a ridgeline with 360-degree views of the basin, the Hollywood sign, and on clear days, Catalina. It's a scene — dogs, influencers, serious hikers, casual walkers — but the panorama from the top is democratic. Everyone gets the same jaw-drop.",
    signature: "Enter from the Fuller Avenue gate for fewer crowds. Go early morning or late afternoon — midday sun is punishing.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 19,
    name: "Destroyer",
    category: "Eat",
    neighborhood: "Culver City",
    description: "Jordan Kahn's daytime-only restaurant is deceptively minimalist. The plates look like small works of art — a smear of walnut, a tangle of herbs, a perfect egg — but they're deeply satisfying in a way that surprises you. The space is clean and bright, the menu changes constantly, and every visit feels like Kahn is cooking something he discovered that morning. Dinner is for amateurs; this is where lunch becomes an event.",
    signature: "The granola with house-made yogurt and seasonal fruit. It sounds simple. It is not.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Mohawk General Store",
    category: "Shop",
    neighborhood: "Silver Lake",
    description: "A carefully curated boutique that splits the difference between gallery and retail. The clothing is all independent labels — Japanese denim, Scandinavian knits, California-made basics — and the home goods section is dangerous for anyone with taste and a credit card. It's the rare shop where everything on the rack feels like a considered choice.",
    signature: "The back wall of Japanese ceramics and the selection of Visvim. Budget more than you planned.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "Kismet",
    category: "Eat",
    neighborhood: "Los Feliz",
    description: "Sara Kramer and Sarah Hymanson's Middle Eastern-inflected California restaurant is a Los Feliz essential. The cooking is bright, vegetable-forward without being preachy, and draws on a pantry that stretches from Tel Aviv to Oaxaca. The room is small and lovely, the wine list is fun, and the whole experience has an ease that feels distinctly Angeleno.",
    signature: "The Turkish-style eggs with labne, brown butter, and Aleppo pepper. Weekend brunch only — go early.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 22,
    name: "Hollywood Forever Cemetery",
    category: "Experience",
    neighborhood: "Silver Lake",
    description: "A working cemetery that doubles as one of LA's most unique cultural venues. The grounds are beautiful and surreal — peacocks wander past the graves of Hollywood legends. In summer, Cinespia screens classic films on the side of a mausoleum while thousands picnic on the lawn. It's morbid and magical and completely, perfectly Los Angeles.",
    signature: "Cinespia screenings on summer Saturday nights. Bring a blanket, a bottle of wine, and arrive an hour early for a good spot.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 23,
    name: "Wanderlust Creamery",
    category: "Shop",
    neighborhood: "Arts District",
    description: "An ice cream shop that treats flavors like a passport. Ube malted crunch, Japanese black sesame, mango sticky rice, pandan — every scoop reflects a cuisine and a culture. Adrienne Borlongan draws on her Filipino heritage and global travels, and the result is ice cream that tells a story. It's the best scoop in a city that takes dessert seriously.",
    signature: "The ube malted crunch. It's the signature for a reason. Double scoop with mango sticky rice if you're feeling bold.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 24,
    name: "The Normandie Club",
    category: "Drink",
    neighborhood: "Koreatown",
    description: "A dimly lit cocktail bar inside the Hotel Normandie in Koreatown. The drinks are serious — spirit-forward, well-balanced, and served with zero fanfare. The room has a prohibition-era mood without the costume, and the late-night crowd is a mix of bartenders off shift and people who know their way around a Sazerac. This is a proper bar.",
    signature: "The Normandie Old Fashioned — their house riff with a smoked walnut bitters. Sit at the bar, not a table.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 25,
    name: "Kato",
    category: "Eat",
    neighborhood: "Downtown",
    description: "Jonathan Yao's Taiwanese-American tasting menu and the most consequential restaurant in Los Angeles right now. Two Michelin stars, a James Beard award, and a kitchen that translates a Taipei-American childhood into food no one else is making. The room is small, the courses move fast, and every plate is built around an obsessive attention to one or two ingredients done perfectly.",
    signature: "The bar seats are the move — you watch the kitchen and the courses come fast. Reservations open monthly and disappear in minutes.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 26,
    name: "Maru Coffee",
    category: "Coffee",
    neighborhood: "Los Feliz",
    description: "A pristine little coffee bar on Hillhurst that does a few things perfectly. The espresso is dialed, the pastries rotate daily, and the space is minimal enough that you focus on what matters — the cup in your hand. Korean-born owner Jiyoon Han brings a quiet intensity to the sourcing and roasting that shows in every sip.",
    signature: "The cortado with their seasonal single-origin. Take it to the bench out front and watch Los Feliz go by.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 27,
    name: "Hotel Figueroa",
    category: "Stay",
    neighborhood: "Arts District",
    description: "A 1926 Spanish Colonial hotel in downtown LA that was one of the first hotels built by women for women. The pool deck is a Moroccan-tiled oasis, the lobby bar has the kind of moody grandeur that makes you want to order a gin and tonic and write a letter, and the rooms are stylish without being sterile. It's got history and it wears it well.",
    signature: "The pool bar for a cocktail at sunset. The Veranda restaurant for dinner — request the patio overlooking Figueroa Street.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 28,
    name: "Amoeba Music",
    category: "Shop",
    neighborhood: "West Hollywood",
    description: "The last of the great American record stores. Amoeba's Hollywood location is a cathedral of music — new and used vinyl, CDs, DVDs, and memorabilia in a space so large you can get lost for hours. The selection is exhaustive, the prices are fair, and the staff knows more about music than any algorithm ever will. If this place didn't exist, you'd have to invent it.",
    signature: "The used vinyl jazz section in the back left corner. Arrive with a want list and budget two hours minimum.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "Venice Canals",
    category: "Experience",
    neighborhood: "Venice",
    description: "A quiet residential neighborhood of footbridges and still waterways that feels completely disconnected from the chaos of the boardwalk a few blocks away. Abbot Kinney built these canals in 1905 as a Venice, Italy fantasy, and somehow they survived a century of LA development. Walk the bridges at golden hour. Watch the ducks. Breathe.",
    signature: "Enter from Venice Boulevard. Walk the eastern canal loop first — the light is better and the homes are more interesting.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 30,
    name: "Night + Market Song",
    category: "Eat",
    neighborhood: "Silver Lake",
    description: "Kris Yenbamroong's Thai restaurant is loud, bold, and unapologetically spicy. The larb is incendiary, the drinking food — sai krok, fried chicken, crispy rice salad — is built for a group with cold beers, and the whole experience has a punk-rock energy that most Thai restaurants lack. This isn't polite Thai food. It's the real thing, cranked up.",
    signature: "The pad kee mao (drunken noodles) and the fried chicken skins. Say yes when they ask if you want it spicy.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 31,
    name: "The Last Bookstore",
    category: "Shop",
    neighborhood: "Arts District",
    description: "A bookstore that earns its dramatic name. Set in a massive former bank vault downtown, it's part bookshop, part art installation — tunnels made of books, a second-floor labyrinth of vinyl and vintage, and the kind of soaring ceilings that make you look up and smile. The selection is vast and well-organized, and the building itself is worth the trip.",
    signature: "The upstairs crime fiction section and the book tunnel photo op. Skip the weekend if you can — weekday mornings are blissfully quiet.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 32,
    name: "Cha Cha Cha",
    category: "Drink",
    neighborhood: "Silver Lake",
    description: "A late-night Caribbean-inspired bar on Glendale Boulevard that's been a Silver Lake staple for decades. The frozen margaritas are dangerously easy to drink, the jerk chicken is solid, and the patio has a tiki-adjacent vibe that never takes itself too seriously. It's the neighborhood bar everyone wishes they had.",
    signature: "Frozen margarita on the patio, any night of the week. It's cash only — the ATM is inside.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 33,
    name: "Palihotel Culver City",
    category: "Stay",
    neighborhood: "Culver City",
    description: "A boutique hotel in the heart of Culver City's restaurant row that gets the balance right — stylish without being precious, comfortable without being boring. The rooms are eclectic and warm, the lobby feels like a well-designed living room, and you're steps from some of the best eating in the city. It's what every neighborhood hotel should be.",
    signature: "Request a room facing the courtyard. Walk to Hayden Tract for coffee, then Destroyer for lunch.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 34,
    name: "Howlin' Ray's",
    category: "Eat",
    neighborhood: "Arts District",
    description: "Nashville hot chicken, perfected in a Chinatown stall and graduated to a brick-and-mortar that still draws lines around the block. Johnny Ray Zone trained in Nashville and brought back the fire — literally. The spice levels go from Country (mild) to Howlin' (call your next of kin), and even the medium will make you sweat. The slaw and white bread are load-bearing.",
    signature: "Go medium your first time. The line moves faster than you think. Get extra pickles — they cut the heat.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 35,
    name: "Ace Hotel Downtown Los Angeles",
    category: "Stay",
    neighborhood: "Arts District",
    description: "The Ace took the historic United Artists building — a 1927 movie palace designed in Spanish Gothic — and turned it into a hotel that feels like the creative center of downtown. The rooftop pool has the best skyline view in the city, the lobby is a de facto co-working space for half of DTLA, and the theater hosts everything from film festivals to live shows.",
    signature: "The rooftop bar at sunset. Order the house Negroni and face west. The theater downstairs hosts screenings most weekends — check the calendar.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 36,
    name: "Go Get Em Tiger",
    category: "Coffee",
    neighborhood: "Los Feliz",
    description: "Kyle Glanville's coffee project started in Larchmont and spread across the city, but the Los Feliz location captures the brand at its best — bright, communal, and relentlessly focused on making excellent coffee accessible. The almond macadamia latte put them on the map, but the straight espresso program is where the real craft shows.",
    signature: "The GGET latte with their house-made almond macadamia milk. It's not a gimmick — it's genuinely the best version of this drink in the city.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Langer's Delicatessen",
    category: "Eat",
    neighborhood: "Koreatown",
    description: "The number 19 pastrami sandwich at Langer's is, by reasonable estimation, the best sandwich in America. Hand-cut pastrami, Swiss cheese, coleslaw, and Russian dressing on twice-baked rye bread. The place has been here since 1947, the neighborhood has changed around it a dozen times, and the sandwich hasn't budged. Some things don't need improving.",
    signature: "The number 19. Don't get creative. The pastrami is hand-cut to order — that's the whole point.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 38,
    name: "The Huntington",
    category: "Experience",
    neighborhood: "Highland Park",
    description: "A sprawling estate in San Marino with one of the finest botanical gardens in the world, a serious art museum, and a rare book library that houses a Gutenberg Bible. The Chinese Garden is a masterwork, the desert garden is hallucinatory, and the whole 120-acre campus has a serenity that makes you forget you're in LA. It's the city's best-kept secret among people who don't live near it.",
    signature: "The Chinese Garden — Liu Fang Yuan — in the morning. Walk the full loop, cross the stone bridge, and find the Tea House for a proper service.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 39,
    name: "Jeni's Splendid Ice Creams",
    category: "Shop",
    neighborhood: "Arts District",
    description: "Jeni Britton Bauer's ice cream empire started in Ohio but the Arts District scoop shop feels native to LA. The flavors are inventive without being gimmicky — brown butter almond brittle, salty caramel, wildberry lavender — and the texture is impossibly smooth. It's ice cream made by someone who understands that great dessert is about restraint as much as indulgence.",
    signature: "Brown butter almond brittle in a waffle cone. Ask for a taste of the brambleberry crisp while you're deciding.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 40,
    name: "The Echo & Echoplex",
    category: "Experience",
    neighborhood: "Echo Park",
    description: "The twin venues that have been the beating heart of LA's independent music scene for two decades. The Echo is upstairs — intimate, sweaty, 350 capacity. The Echoplex is downstairs — bigger, louder, with a stage that's launched a hundred bands you now see in arenas. The booking is fearless and the sound is excellent. If you care about live music, you end up here.",
    signature: "Check the calendar for Funky Sole on Saturday nights at the Echo. Best soul and funk DJ night in the city.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 41,
    name: "Botanica",
    category: "Eat",
    neighborhood: "Silver Lake",
    description: "A plant-forward restaurant and market on Silver Lake Boulevard that makes vegetable cooking feel exciting rather than virtuous. The plates are bright, seasonal, and draw from a global pantry — turmeric-laced soups, grain bowls with unexpected textures, salads that could convert a steak person. The adjacent market stocks the kind of provisions you wish your pantry had.",
    signature: "The grain bowl with whatever seasonal vegetables they're running. Grab a jar of their house chili oil from the market on your way out.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 42,
    name: "Jumbo's Clown Room",
    category: "Experience",
    neighborhood: "Highland Park",
    description: "A dive bar on Hollywood Boulevard that's been hosting burlesque and go-go dancing since 1970. The performers are athletes and artists, the jukebox is flawless, and the room has a sweaty, joyful energy that's completely unique in a city of manufactured nightlife. No cover, two-drink minimum, and a vibe that feels like the last outpost of old Hollywood.",
    signature: "Cash only. Sit near the stage and tip generously. The performers make this place what it is.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 43,
    name: "Cookbook",
    category: "Drink",
    neighborhood: "Highland Park",
    description: "A natural wine bar and market on a leafy stretch of Highland Park that feels like the neighborhood's living room. The wines are organic, biodynamic, or natural — sourced with a real point of view — and the food is simple and good. The patio is shaded and unhurried, and the bottle shop means you can take something home when you find a wine you love.",
    signature: "A glass of whatever orange wine they're pouring and the cheese plate on the back patio. Sunday afternoons are ideal.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 44,
    name: "LACMA",
    category: "Experience",
    neighborhood: "West Hollywood",
    description: "The largest art museum in the western United States, and it's as sprawling and eclectic as the city it represents. The collection spans 6,000 years and every continent, from ancient Korean ceramics to Rothko's late canvases. Chris Burden's Urban Light installation — 202 restored street lamps — has become the city's most photographed landmark. The museum is mid-transformation, but what's open is extraordinary.",
    signature: "Urban Light at dusk — the lamps glow amber and the crowd thins. Then go inside to the Japanese Pavilion, which is almost always empty.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 45,
    name: "Venice Beach Boardwalk",
    category: "Experience",
    neighborhood: "Venice",
    description: "Yes, it's a circus. That's the point. The boardwalk is two miles of street performers, bodybuilders, muralists, psychics, and skaters against a backdrop of palm trees and Pacific Ocean. It's the most democratic public space in LA — everyone is welcome, nothing is curated, and the people-watching is unrivaled. Come with no plan. Let the boardwalk happen to you.",
    signature: "Walk south from the skate park toward the Venice Pier. Stop at Muscle Beach to watch the gymnastics rings. Sunday afternoons are peak energy.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "Verve Coffee Roasters",
    category: "Coffee",
    neighborhood: "Arts District",
    description: "The Santa Cruz-born roaster's Arts District flagship — a wide, sun-drenched bar inside ROW DTLA where the coffee program is as serious as anywhere in the city. Single-origin pour-overs from Burundi to Costa Rica, an excellent espresso, and a refusal to follow trends just because they're trends. The kind of place where the barista will actually talk to you about what you're tasting.",
    signature: "Get the seasonal pour-over and ask what the roaster's been working on lately.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 47,
    name: "El Matador Beach",
    category: "Experience",
    neighborhood: "Santa Monica",
    description: "A hidden cove in Malibu with sea stacks, rock arches, and the kind of golden light that makes you understand why people move to California. The stairs down are steep, the parking lot is tiny, and the beach itself is small enough to feel private. At low tide, you can walk between the rock formations. At sunset, the light hits the cliffs and turns everything amber. This is the beach LA doesn't show tourists.",
    signature: "Go at low tide, an hour before sunset. Bring a blanket and stay through golden hour. The parking lot fills fast — arrive early or walk from the PCH shoulder.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "A.P.C. Surplus",
    category: "Shop",
    neighborhood: "Silver Lake",
    description: "The LA outpost of the Parisian basics brand doubles as a surplus store, which means you'll find past-season pieces at serious discounts alongside the current collection. The raw selvedge denim is the draw, but the whole aesthetic — clean, understated, perfectly cut — is the antidote to LA's louder tendencies. It's fashion that whispers.",
    signature: "The Petit New Standard jean in raw indigo. Buy it a size down and let it break in. Check the surplus rack first — sometimes last season's identical.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "Everson Royce Bar",
    category: "Drink",
    neighborhood: "Arts District",
    description: "An indoor-outdoor bar in the Arts District with a sprawling patio, a smartly curated beer and wine list, and some of the best bar food downtown. The space is industrial but warm — string lights, concrete, communal tables — and the crowd is the after-work Arts District set who've earned a cold one. It's unpretentious in a neighborhood that sometimes isn't.",
    signature: "The smash burger and a draft beer on the patio. Thursday evenings have the best energy.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "Watts Towers",
    category: "Experience",
    neighborhood: "Highland Park",
    description: "Seventeen interconnected sculptural towers built by one man — Simon Rodia — over 33 years using steel, mortar, and found objects. Bottle caps, broken tiles, seashells, pottery shards — all assembled into soaring spires that reach nearly 100 feet. It's outsider art at its most monumental, a UNESCO-recognized folk art masterpiece, and one of the most extraordinary things any single person has ever built. Nothing else in LA is like it.",
    signature: "Book the guided tour — the docents explain details you'd miss on your own. The towers catch the light differently depending on the hour. Morning is best.",
    action: "Learn More",
    actionType: "learn",
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
        <span style={{ cursor: "pointer" }} onClick={() => document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })}>Newsletter</span>
      </div>
    </nav>

    {/* Hero content */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 56px", zIndex: 5 }}>
      <div style={{ maxWidth: 800 }}>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "rgba(245,240,232,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
          Los Angeles, California
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Los Angeles
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Worth the drive. Every single one.
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
// ─── Footer ──────────────────────────────────────────────────────────────────

const Footer = () => {
  const cities = [
    { name: "New York", tagline: "You already know. But not like this." },
    { name: "San Francisco", tagline: "Fog, hills, and the best food in the West." },
    { name: "Seattle", tagline: "Grey skies, bright flavors." },
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

export default function LosAngelesCityPage() {
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
      <PageMeta page="city" citySlug="los-angeles" entries={ENTRIES} />
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

      <CityMap entries={ENTRIES} locations={CITY_LOCATIONS} cityName="Los Angeles" />
      <Footer />
    </div>
    </>
  );
}
