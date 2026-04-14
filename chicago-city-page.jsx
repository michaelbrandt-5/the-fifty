import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";

const CITY_PHOTOS = PHOTOS["chicago"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "West Loop", "Logan Square", "Wicker Park", "Lincoln Park", "Pilsen", "Hyde Park", "Andersonville", "Old Town", "Bucktown", "Humboldt Park"];

const ENTRIES = [
  {
    id: 1,
    name: "Alinea",
    category: "Eat",
    neighborhood: "Lincoln Park",
    description: "Grant Achatz's three-Michelin-star temple of molecular gastronomy is still the most ambitious restaurant in America. Every course is a provocation — edible balloons, desserts painted directly on the table, flavors you didn't know existed. It's not dinner. It's a performance that happens to involve food, and it will rearrange your understanding of what a restaurant can be.",
    signature: "Book the Gallery kitchen for the full theatrical experience. The balloon course is still pure magic, even if you've seen it on Instagram a hundred times.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 2,
    name: "Joe's Seafood, Prime Steak & Stone Crab",
    category: "Eat",
    neighborhood: "Old Town",
    description: "Not the flashiest name, not the trendiest address, but the stone crab claws flown in from Miami are the real deal and the prime rib is as good as any steakhouse charging twice the price. The dining room has that old-money Chicago energy — white tablecloths, professional service, martinis that arrive cold and correct. A power-lunch institution that earns its reputation nightly.",
    signature: "The stone crab claws with mustard sauce. They're seasonal, they're expensive, and they're worth every cent.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "The Robey",
    category: "Stay",
    neighborhood: "Wicker Park",
    description: "A boutique hotel built into the iconic Coyote Building at the six corners of Wicker Park. The art deco bones are stunning, the rooms are compact but clever, and the rooftop bar — Cabana Club in summer, Up Room year-round — delivers one of the best skyline views in the city. You're steps from the best eating and drinking in Chicago.",
    signature: "Request a corner room with the original arched windows. The Up Room at sunset is a non-negotiable first-night drink.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 4,
    name: "Art Institute of Chicago",
    category: "Experience",
    neighborhood: "West Loop",
    description: "One of the greatest art museums on the planet, and it still doesn't get the credit it deserves outside the Midwest. The Impressionist collection rivals the Musee d'Orsay. The Modern Wing by Renzo Piano is a masterwork of light. You could spend a week and still miss entire galleries. This is the cultural heart of the city, full stop.",
    signature: "Start in Gallery 240 with the Seurat. Then walk to the Thorne Miniature Rooms — tiny, perfect replicas of historical interiors that most visitors walk right past.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 5,
    name: "Avec",
    category: "Eat",
    neighborhood: "West Loop",
    description: "A tiny, loud, communal-table Mediterranean spot that's been one of the best restaurants in Chicago since 2003. The wood-oven is the engine — everything that comes out of it tastes like smoke and intention. The room is narrow, the seats are tight, and nobody cares because the food is that good. Paul Kahan's most soulful restaurant.",
    signature: "The chorizo-stuffed medjool dates. They've been on the menu since opening night, and if they ever remove them, the city will riot.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 6,
    name: "Intelligentsia Coffee",
    category: "Coffee",
    neighborhood: "Logan Square",
    description: "Before third-wave coffee was a phrase anyone used, Intelligentsia was pulling shots in Chicago and changing how Americans thought about beans. The Millennium Park location is a tourist magnet, but the Logan Square coffeebar is the spiritual home — serious baristas, single-origin pour-overs, and the quiet hum of a neighborhood that actually runs on good coffee.",
    signature: "The Black Cat Classic espresso. It's the blend that started an entire movement. Order it as a cortado.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "Girl & The Goat",
    category: "Eat",
    neighborhood: "West Loop",
    description: "Stephanie Izard's flagship is still the most fun you can have at a dinner table in Chicago. The menu is organized by vegetables, fish, and meat, and every section has at least one dish that makes you grab whoever you're with and insist they try it. The goat is in the name for a reason — the wood-oven roasted goat with pickled peppers is a signature that's earned its fame.",
    signature: "Sit at the bar for walk-in seats. Order the kohlrabi salad and the goat empanadas. Let the kitchen surprise you after that.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 8,
    name: "Violet Hour",
    category: "Drink",
    neighborhood: "Wicker Park",
    description: "The cocktail bar that changed drinking in Chicago. There's no sign — just a painted mural on Division Street and a door that opens into a dark, candlelit room with high-backed booths and bartenders who treat every drink like it matters. No standing. No Bud Light. No exceptions. The rules are strict because the cocktails are that good.",
    signature: "Tell your bartender what spirit you like and one adjective for the flavor you want. They'll build something perfect from scratch.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 9,
    name: "Promontory",
    category: "Experience",
    neighborhood: "Hyde Park",
    description: "A multi-level venue in Hyde Park that splits the difference between concert hall, bar, and restaurant — and does all three well. The music programming is excellent and eclectic: jazz one night, Afrobeat the next, a DJ set after that. The space itself is warm and woody, with a mezzanine that gives you the perfect vantage point. Hyde Park's cultural anchor.",
    signature: "Check the calendar for the jazz nights. Grab a spot on the mezzanine balcony with a cocktail and just listen.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 10,
    name: "Publican",
    category: "Eat",
    neighborhood: "West Loop",
    description: "A beer hall for people who take food seriously. The space is cavernous — long communal tables, butcher-paper surfaces, the hum of a room full of people eating well. Chef Paul Kahan's pork-and-oyster obsession is on full display: the whole roasted fish, the charcuterie boards, and the beer list are all best-in-class. Brunch here on a Sunday is a Chicago ritual.",
    signature: "Sunday brunch. The maple-glazed pork belly and a Hefeweizen. Arrive early or prepare to wait — everyone knows.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 11,
    name: "Myopic Books",
    category: "Shop",
    neighborhood: "Wicker Park",
    description: "Three floors of used books in the heart of Wicker Park, with the kind of disorganized charm that makes you want to cancel your afternoon. The fiction section on the second floor is deep, the poetry shelf is oddly excellent, and the whole place smells like old paper and good decisions. It's been here since 1990, outlasting every trend on the strip.",
    signature: "The third floor. It's quieter, the shelves are stranger, and you'll find things you didn't know you were looking for.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 12,
    name: "Big Star",
    category: "Eat",
    neighborhood: "Wicker Park",
    description: "A honky-tonk taqueria at the six corners that's become the definitive casual hang in Wicker Park. The tacos are serious — pork belly al pastor, crispy fish with pickled onion — and the whiskey-and-beer program runs deep. The patio in summer is the center of the neighborhood's social universe. Loud, fun, and consistently excellent since day one.",
    signature: "The pork belly al pastor taco and a shot of bourbon. Sit on the patio if there's even a hint of warmth outside.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 13,
    name: "Stony Island Arts Bank",
    category: "Experience",
    neighborhood: "Hyde Park",
    description: "Theaster Gates turned an abandoned 1923 bank on the South Side into one of the most important cultural spaces in America. It's part gallery, part archive, part community center — housing collections of Ebony and Jet magazine, a vinyl library, and rotating exhibitions. The building itself is the primary artwork: soaring ceilings, marble columns, and the weight of intentional reclamation.",
    signature: "Visit during an open house or exhibition opening. The listening room with the vinyl collection is transcendent — ask to spend time in it.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 14,
    name: "Cafecito",
    category: "Coffee",
    neighborhood: "West Loop",
    description: "A tiny Cuban coffee window that serves cortaditos and pressed sandwiches that punch absurdly above their weight class. The cafe con leche is strong, sweet, and exactly right. The Cubano sandwich — roast pork, ham, Swiss, mustard, pickles, pressed flat — is the best lunch under eight dollars in the Loop. No pretension, no nonsense, just fuel.",
    signature: "The Cubano and a cortadito. That's it. That's the order. Don't overthink it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 15,
    name: "Lost Lake",
    category: "Drink",
    neighborhood: "Logan Square",
    description: "A tiki bar in Logan Square that takes the craft seriously without losing the fun. The drinks are complex — house-made syrups, fresh juices, obscure rums — but the room is pure escapism: bamboo, puffer fish lamps, and a soundtrack that swings between exotica and hip-hop. It's the kind of bar where one drink becomes three and nobody regrets it.",
    signature: "The Jet Pilot or the Zombie. Both are strong enough to be dangerous. Pace yourself; the rum sneaks up.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 16,
    name: "Kasama",
    category: "Eat",
    neighborhood: "Wicker Park",
    description: "A Filipino-American restaurant that earned a Michelin star while still serving a flawless breakfast sandwich in the morning. That duality is the whole point: Tim Flores and Genie Kwon built something that honors tradition and pushes it forward simultaneously. The evening tasting menu is ambitious and beautiful. The morning pastry case is the best in the city.",
    signature: "Morning: the longanisa breakfast sandwich and an ube crinkle cookie. Evening: the full tasting menu — book weeks in advance.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 17,
    name: "National Museum of Mexican Art",
    category: "Experience",
    neighborhood: "Pilsen",
    description: "The largest Latino cultural institution in the country, and it's free. Permanently. The collection spans 3,000 years of Mexican art — pre-Columbian artifacts alongside contemporary installations — and the Day of the Dead exhibition each fall is one of the most powerful museum experiences in Chicago. Pilsen deserves this institution, and this institution deserves your time.",
    signature: "Visit during the annual Day of the Dead exhibition, September through December. It will stay with you.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 18,
    name: "Metric Coffee",
    category: "Coffee",
    neighborhood: "West Loop",
    description: "A roastery and cafe in the Fulton Market District that's become the coffee obsessive's go-to in Chicago. The space is industrial and minimal — concrete floors, a massive Probat roaster visible through glass — and the beans are sourced with the kind of care that justifies the pour-over wait time. They roast in small batches and it shows.",
    signature: "Ask for whatever single-origin they're most excited about that week. The baristas here actually want to talk about it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 19,
    name: "Chicago Riverwalk",
    category: "Experience",
    neighborhood: "West Loop",
    description: "The city's greatest public infrastructure project in a generation, and it keeps getting better. A mile-and-a-half pedestrian path along the main branch of the Chicago River, lined with bars, kayak launches, wine gardens, and some of the most dramatic urban architecture on Earth. Walking this at golden hour, with the bridges lifting and the buildings catching light, is the most Chicago thing you can do.",
    signature: "Start at the lakefront and walk west. Stop at City Winery for a glass on the water. Time it for sunset.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Lula Cafe",
    category: "Eat",
    neighborhood: "Logan Square",
    description: "Logan Square's original anchor restaurant, and after twenty-plus years it still feels essential. Chef Jason Hammel's menu is farm-driven and quietly inventive — the kind of food that sounds simple on paper and arrives tasting like someone put their whole heart into it. The Monday night prix fixe, the Farm Dinner, is a Chicago tradition that's launched a thousand imitations.",
    signature: "The Monday Farm Dinner. Four courses, no menu, total trust in the kitchen. Book it as soon as you know your dates.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 21,
    name: "Soho House Chicago",
    category: "Stay",
    neighborhood: "West Loop",
    description: "The Fulton Market outpost occupies a former belt factory, and the conversion is beautifully done — exposed brick, original timber, that specific Soho House talent for making industrial spaces feel warm. Even if you're not a member, the hotel rooms are open to all, and staying here puts you at the epicenter of Chicago's most exciting neighborhood. The rooftop pool in summer is absurd.",
    signature: "Book a Tiny room if you're budget-conscious — they're small but beautifully designed. The rooftop pool is open to hotel guests regardless of membership.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 22,
    name: "Dove's Luncheonette",
    category: "Eat",
    neighborhood: "Wicker Park",
    description: "A Tex-Mex diner with a vinyl-only sound system and an all-day menu that pivots from migas at breakfast to a transcendent pozole at dinner. The room is small, retro, and perfect — turquoise booths, country music on the turntable, and a mezcal list that has no business being this good in a luncheonette. One Off Hospitality at their most charming.",
    signature: "The migas plate for brunch with a Paloma. If it's dinner, the pozole rojo and a pour of mezcal. Sit at the counter.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 23,
    name: "Reckless Records",
    category: "Shop",
    neighborhood: "Wicker Park",
    description: "Chicago's best record store since 1989, and the Wicker Park location is the flagship. The bins are deep, the staff knows their stuff without being snobs about it, and the used section regularly turns up gems that would cost three times as much online. If you care about music — and in Chicago, you should — this is a pilgrimage.",
    signature: "Hit the dollar bins in the back first. Then work your way to the curated staff picks wall near the register.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 24,
    name: "Parachute",
    category: "Eat",
    neighborhood: "Logan Square",
    description: "A Korean-American restaurant by husband-and-wife team Johnny Clark and Beverly Kim that's been a Michelin-starred cornerstone of Logan Square since 2014. The bing bread — a flaky, scallion-loaded flatbread with sour cream — is the most famous single dish in the neighborhood. The rest of the menu moves between Korean tradition and Midwestern comfort with effortless confidence.",
    signature: "The bing bread. It arrives first and it sets the tone. After that, trust the seasonal specials — the kitchen doesn't miss.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 25,
    name: "Parlor Pizza Bar",
    category: "Eat",
    neighborhood: "Wicker Park",
    description: "Forget deep dish for a minute. Chicago's thin-crust tavern-style pizza is the local's pizza, and Parlor does a beautiful version alongside wood-fired Neapolitan pies. The rooftop is enormous and one of the best warm-weather hangs in Wicker Park. The vibe is loud, social, and exactly what a Friday night should feel like.",
    signature: "The rooftop, a tavern-style sausage and giardiniera pie, and a local IPA. That's a Friday night.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 26,
    name: "Cindy's",
    category: "Drink",
    neighborhood: "West Loop",
    description: "A rooftop bar atop the Chicago Athletic Association hotel, overlooking Millennium Park and the lake. The room is gorgeous — terrazzo floors, arched windows, and a terrace that makes you feel like you own the city. The cocktails are polished, the wine list is smart, and the view is genuinely one of the best in Chicago. Come at golden hour and stay through dark.",
    signature: "Grab a seat on the terrace before sunset. Order the house martini and watch the sky turn over the lake.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 27,
    name: "Chicago Athletic Association",
    category: "Stay",
    neighborhood: "West Loop",
    description: "A Venetian Gothic landmark from 1893, reborn as the most architecturally significant hotel in the city. Every room is different, the public spaces are jaw-dropping — cherry game room, the Drawing Room lobby, Cindy's on the roof — and you're staring directly at Millennium Park. It's the kind of hotel where the building is the attraction.",
    signature: "Book a park-view room and leave the curtains open. The cherry game room downstairs has shuffleboard and bocce — yes, in a hotel.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 28,
    name: "S.K.Y.",
    category: "Eat",
    neighborhood: "Pilsen",
    description: "Chef Stephen Gillanders draws from Korean, Japanese, and Midwestern traditions to create plates that are precise, beautiful, and full of surprise. The Pilsen location is warm and understated — exposed brick, soft light, a calm that lets the food do the talking. This is one of those restaurants where every dish arrives and you wonder why you haven't been here before.",
    signature: "The duck confit dumplings and the hamachi crudo. Start there. End with the signature bao dessert — it's better than it sounds.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 29,
    name: "Whistler",
    category: "Drink",
    neighborhood: "Logan Square",
    description: "Part cocktail bar, part art gallery, part music venue — and somehow all three work. The space is narrow and intimate, the cocktails are seasonal and inventive, and the back room hosts everything from experimental jazz to film screenings. Logan Square's cultural nerve center, and the kind of place that reminds you why neighborhoods matter.",
    signature: "Check the weekly calendar. The DJ nights and live sets are free, and the cocktail of the night is always built to match the mood.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 30,
    name: "Pilsen Vintage & Thrift",
    category: "Shop",
    neighborhood: "Pilsen",
    description: "A sprawling vintage store on 18th Street that's become one of the best thrift destinations in the city. The inventory turns over constantly — leather jackets, vintage band tees, old denim, Mexican folk art, furniture — and the prices haven't caught up to the hype yet. Pilsen's creative energy lives in shops like this.",
    signature: "Go on a weekday when the bins aren't picked over. The denim section and the vintage jacket rack are where the real finds hide.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 31,
    name: "Millennium Park",
    category: "Experience",
    neighborhood: "West Loop",
    description: "Yes, the Bean. But beyond it: Frank Gehry's soaring Pritzker Pavilion, the Lurie Garden's hidden prairie, and one of the most ambitious pieces of urban planning in modern history. Free concerts in summer, ice skating in winter, and year-round proof that public space can be extraordinary when a city commits to it. Skip the selfie and actually explore.",
    signature: "The Lurie Garden on the south end. It's quieter than the Bean plaza and genuinely beautiful — native prairie plants framed by the skyline.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 32,
    name: "Half Acre Beer Company",
    category: "Drink",
    neighborhood: "Lincoln Park",
    description: "One of Chicago's original craft breweries, and the Lincoln Park taproom is a neighborhood institution. The Daisy Cutter pale ale is a Chicago classic — bright, hoppy, and endlessly drinkable. The taproom rotates seasonal and experimental batches that never make it to distribution. Come for the beer, stay for the food truck in the lot and the easy neighborhood energy.",
    signature: "The Daisy Cutter on draft and whatever seasonal one-off they're pouring that week. The beer garden out back is summer perfection.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 33,
    name: "Galerie F",
    category: "Shop",
    neighborhood: "Humboldt Park",
    description: "A printmaking gallery and shop in Humboldt Park that specializes in gig posters, screen prints, and street art. The walls rotate constantly, showcasing Chicago and international artists who work in the space where punk, hip-hop, and fine art collide. Everything on the wall is for sale, and the prices are surprisingly reasonable for original art.",
    signature: "Ask about the Chicago artist prints. The gig posters from local venues are collectible and start around twenty bucks.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 34,
    name: "Portillo's",
    category: "Eat",
    neighborhood: "Old Town",
    description: "A Chicago institution that breaks the no-chains rule because it started here and it belongs here. The Italian beef — dipped, with hot giardiniera — is the canonical Chicago sandwich, and the chocolate cake shake is an act of joyful excess. The neon-lit dining room is loud and chaotic and perfect. This is fast food elevated to civic identity.",
    signature: "Italian beef, dipped, with hot giardiniera. A chocolate cake shake if you're feeling reckless. Accept the mess.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 35,
    name: "Quimby's Bookstore",
    category: "Shop",
    neighborhood: "Wicker Park",
    description: "The Wicker Park bookstore that's been fueling Chicago's zine, comics, and small-press underground since 1991. The shelves lean weird — experimental literature, graphic novels, political tracts, art books from presses you've never heard of — and the staff actually reads what they stock. It's what an independent bookstore is supposed to feel like.",
    signature: "The zine wall by the register is the best in the Midwest. Ask what's new from local Chicago presses and you'll walk out with something you didn't know you wanted.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 36,
    name: "Headquarters Beercade",
    category: "Drink",
    neighborhood: "Old Town",
    description: "A bar filled with vintage arcade games and pinball machines — all free to play. The beer list is long and well-curated, the games are immaculately maintained, and the whole thing has the energy of someone's coolest basement scaled up to bar size. It's not trying to be a serious cocktail bar, and that's exactly the point.",
    signature: "The pinball machines in the back room are the real draw. Grab a local craft beer and see how long you can hold the table.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Second City",
    category: "Experience",
    neighborhood: "Old Town",
    description: "The comedy theater that launched Belushi, Fey, Murray, and half the SNL cast for the last fifty years. The mainstage show is consistently strong, but the real move is the late-night improv set — rawer, riskier, and often funnier than the polished production. This is where American comedy was invented, and the room still crackles with that energy.",
    signature: "The late-night improv set after the mainstage show. It's cheaper, looser, and sometimes transcendent. Sit in the first three rows.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 38,
    name: "Aya Pastry",
    category: "Coffee",
    neighborhood: "West Loop",
    description: "A Turkish-inspired pastry shop in the West Loop that doubles as one of the most beautiful coffee stops in the city. The pastries are architectural — layers of phyllo, pistachio cream, and rose that look too good to eat and taste even better. The coffee program is strong, but you're here for the intersection of sugar and craftsmanship.",
    signature: "The pistachio croissant and a Turkish coffee. Sit at the marble counter and watch them assemble the pastry case.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 39,
    name: "606 Trail",
    category: "Experience",
    neighborhood: "Bucktown",
    description: "An elevated rail trail that runs 2.7 miles from Bucktown to Humboldt Park, converting an abandoned rail line into one of the best urban walks in the Midwest. You're above street level the whole way — eye-level with second-floor apartments, treetops, and murals. It's Chicago's answer to the High Line, but quieter, longer, and flanked by real neighborhoods instead of luxury condos.",
    signature: "Enter at the Walsh Park trailhead in Bucktown and walk west toward Humboldt Park. The sunset from the Humboldt Park end is spectacular.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 40,
    name: "La Michoacana Premium",
    category: "Shop",
    neighborhood: "Pilsen",
    description: "A paleta shop on 18th Street that serves some of the best Mexican ice pops and ice cream in the city. The flavors are traditional and vivid — mango con chile, tamarind, guava, coconut — and the prices are a fraction of any artisanal ice cream shop in Wicker Park. It's a Pilsen staple, and on a hot summer day, the line out the door is the only endorsement you need.",
    signature: "The mango con chile paleta. Simple, spicy, and the best three dollars you'll spend in Pilsen.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 41,
    name: "Chicago Architecture Center River Cruise",
    category: "Experience",
    neighborhood: "West Loop",
    description: "The single best thing a visitor can do in Chicago on their first day. A ninety-minute boat tour narrated by trained docents who explain how this city invented the skyscraper and kept pushing architecture forward for a century and a half. The buildings look different from the water — you see the whole riverfront as a living timeline of ambition.",
    signature: "Book the first morning departure for smaller crowds and the best light. Sit on the upper deck, port side.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 42,
    name: "Bavette's Bar & Boeuf",
    category: "Eat",
    neighborhood: "West Loop",
    description: "A steakhouse that looks like a Prohibition-era supper club and delivers on every promise the room makes. Red leather booths, dim lighting, jazz on the speakers, and a bone-in ribeye that is among the best in a city with no shortage of great steaks. The shrimp de Jonghe is old-school Chicago, and the double-cut bacon appetizer is legendary.",
    signature: "The double-cut bacon appetizer and the bone-in ribeye. Sit in the back room — it's darker and more intimate.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 43,
    name: "Museum of Science and Industry",
    category: "Experience",
    neighborhood: "Hyde Park",
    description: "Housed in the last remaining building from the 1893 World's Fair, this is the largest science museum in the Western Hemisphere. The U-505 submarine exhibit — a real captured German U-boat — is worth the trip alone. The coal mine, the mirror maze, the full-size 727 hanging from the ceiling. It's overwhelming in the best way, and it makes you twelve years old again.",
    signature: "The U-505 submarine guided tour. It costs extra and it's worth every penny. Book in advance — it sells out.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 44,
    name: "Three Dots and a Dash",
    category: "Drink",
    neighborhood: "Old Town",
    description: "A subterranean tiki bar hidden in a River North alley, and one of the best cocktail experiences in the city. The drinks are elaborate — served in custom vessels with fire, smoke, and garnishes that border on sculptural — and the recipes are meticulously researched from classic tiki canon. The room is dark and tropical and feels a thousand miles from Michigan Avenue.",
    signature: "The namesake Three Dots and a Dash — a rum punch that won a Navy commendation in WWII. It arrives in a custom mug. You'll want to keep it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 45,
    name: "Empty Bottle",
    category: "Experience",
    neighborhood: "Humboldt Park",
    description: "Chicago's most important independent music venue, full stop. The room is small, the sound is excellent, and the booking consistently surfaces bands six months before they blow up. The bar is cheap, the crowd is there for the music, and the energy on a packed Wednesday night rivals any arena show. If you care about live music, this is your church.",
    signature: "Check the calendar and just go to whatever's on. The Monday night free shows are a Chicago institution.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 46,
    name: "Andersonville Galleria",
    category: "Shop",
    neighborhood: "Andersonville",
    description: "A multi-vendor marketplace in Andersonville that houses dozens of independent artists and makers under one roof. Vintage clothing, handmade jewelry, letterpress cards, local art — it's the kind of place where every booth is someone's small business and every purchase feels like it matters. Andersonville's creative economy in miniature.",
    signature: "Browse the full second floor. The vintage home goods and the letterpress stationery are the standouts.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 47,
    name: "Longman & Eagle",
    category: "Drink",
    neighborhood: "Logan Square",
    description: "A Michelin-starred restaurant that's also a whiskey bar that's also a six-room inn. The whiskey list is one of the deepest in the city — hundreds of bottles, organized by region, with a staff that can guide you through all of it. The food is rustic and refined in equal measure. It's Logan Square's original anchor, and it still feels like the center of the neighborhood.",
    signature: "The whiskey flight curated by the bartender. Tell them what you usually drink and let them expand your horizons. The bone marrow is non-negotiable.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "Garfield Park Conservatory",
    category: "Experience",
    neighborhood: "Humboldt Park",
    description: "One of the largest conservatories in the country, and it's free. Step out of a Chicago winter into rooms of tropical palms, desert cacti, and ferns that make you forget what month it is. The Palm House is cathedral-scale — glass and steel arching over towering plants — and the Children's Garden is quietly one of the most joyful spaces in the city.",
    signature: "Visit in January or February, when you need it most. The Palm House on a gray winter day is genuine therapy.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "Hopleaf",
    category: "Drink",
    neighborhood: "Andersonville",
    description: "A Belgian beer bar in Andersonville with one of the most thoughtful tap lists in the Midwest. The frites with aioli are famous, the mussels are excellent, and the beer selection — heavy on Belgian ales, farmhouse styles, and sours — is curated by someone who clearly loves what they do. It's warm, it's neighborhood-y, and it's exactly the bar Chicago deserves.",
    signature: "The CB&J — cashew butter and cherry preserves on a pretzel roll with Stilton. It sounds insane. It's perfect. Pair it with a Belgian dubbel.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "Publishing House Bed & Breakfast",
    category: "Stay",
    neighborhood: "West Loop",
    description: "A converted 1909 printing house in the West Loop turned into an eleven-room B&B with industrial bones and warm, eclectic interiors. Every room is different — exposed brick, original timber, clawfoot tubs — and breakfast is included and actually good. It's the anti-hotel hotel: personal, quiet, and tucked into a neighborhood that puts you within walking distance of half this list.",
    signature: "Book the Loft Suite for the most dramatic ceilings. Breakfast in the communal dining room feels like staying at a very stylish friend's house.",
    action: "Book",
    actionType: "book",
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
        <span style={{ cursor: "pointer" }}>Newsletter</span>
      </div>
    </nav>

    {/* Hero content */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 56px", zIndex: 5 }}>
      <div style={{ maxWidth: 800 }}>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "rgba(245,240,232,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
          Chicago, Illinois
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Chicago
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          The real list. Deep dish not required.
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
  const entry = ENTRIES[1]; // Joe's Seafood
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
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: "#1a1a1a" }}>The Robey</span>
              <span style={{ display: "block", fontSize: 11, color: "#999", marginTop: 2 }}>Stay · Wicker Park</span>
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
    { name: "Austin", tagline: "Still weird. Still worth it." },
    { name: "Nashville", tagline: "Past the neon. Here's what's real." },
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

export default function ChicagoCityPage() {
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

      {/* Mobile Preview Section */}
      <div style={{ backgroundColor: "#f2ede6", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <MobilePreview />
      </div>

      <Footer />
    </div>
  );
}
