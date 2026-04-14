import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";

const CITY_PHOTOS = PHOTOS["new-york"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "West Village", "Lower East Side", "Williamsburg", "SoHo", "Greenpoint", "Fort Greene", "Harlem", "Chelsea", "Nolita", "Bushwick"];

const ENTRIES = [
  {
    id: 1,
    name: "Di An Di",
    category: "Eat",
    neighborhood: "Greenpoint",
    description: "A Vietnamese restaurant in Greenpoint that treats pho like a religion and the dining room like a greenhouse. The space is all exposed brick and trailing plants, and the food has a precision that elevates every bowl without losing the soul of the cooking. The brunch crowd is real, but dinner is where the kitchen stretches.",
    signature: "The coconut cold brew is iconic, but the lemongrass chicken over broken rice at dinner is the real move.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 2,
    name: "Dhamaka",
    category: "Eat",
    neighborhood: "Lower East Side",
    description: "Indian food that has nothing to do with the butter chicken you grew up ordering. Chintan Pandya's menu pulls from the rural corners of India that most restaurants ignore — goat brain, rabbit kidney, offal in ways that would make a French chef jealous. The room on Essex Street is loud and joyful and smells like someone cracked open a spice cabinet the size of a continent.",
    signature: "The Champaran meat, slow-cooked in an earthen pot sealed with dough. Order it the moment you sit down — it takes time.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "The NoMad Hotel",
    category: "Stay",
    neighborhood: "Chelsea",
    description: "A grand Beaux-Arts building where every floor feels like a different chapter of the same beautiful novel. The rooms are layered with books, velvet, and the kind of considered detail that makes you want to cancel your plans and just stay in. The rooftop is a scene, but the library is the real living room of this hotel.",
    signature: "Ask for a room on a high floor facing Broadway. The city noise fades and the light is extraordinary at dawn.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 4,
    name: "The High Line",
    category: "Experience",
    neighborhood: "Chelsea",
    description: "A mile-and-a-half-long elevated park built on abandoned freight rail tracks on Manhattan's west side. You already know about it. What you might not know is that the northern section near the Hudson Yards end is dramatically less crowded, the plantings change seasonally, and the sunset views over the Hudson from the 14th Street passage are staggering.",
    signature: "Enter at Gansevoort Street and walk north. Go on a Tuesday evening in summer around 7pm — golden hour, half the crowd.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 5,
    name: "Superiority Burger",
    category: "Eat",
    neighborhood: "Lower East Side",
    description: "Brooks Headley's vegetarian burger shop is one of the best restaurants in New York, period. Not best vegetarian restaurant — best restaurant. The space on East 9th Street is tiny and the menu changes constantly, but the namesake burger and the rotating salads are proof that constraints breed creativity. The line moves fast. The food is cheap. There is no catch.",
    signature: "The burnt broccoli salad, whatever today's version looks like. And the gelato — Headley was a pastry chef at Del Posto.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 6,
    name: "Attaboy",
    category: "Drink",
    neighborhood: "Lower East Side",
    description: "No menu, no sign, no pretense — just a tiny bar on Eldridge Street where the bartenders ask what you like and make you something perfect. It's the spiritual successor to Milk & Honey, and the craft here is absurd. Every drink feels like it was invented for you specifically, because in a way it was.",
    signature: "Tell them your favorite spirit and one flavor you love. Then sit back and let them work. Trust is the whole point.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "Abraço",
    category: "Coffee",
    neighborhood: "Lower East Side",
    description: "A storefront espresso bar on East 7th Street that has been pulling some of the best shots in the city since 2007. Jamie McCormick treats espresso like craft and pastry like art — the olive oil cake is legendary, and the cortado is a benchmark. There are no seats. You stand at the counter, drink your coffee, and leave better than you arrived.",
    signature: "The cortado, full stop. And whatever pastry they baked this morning — the olive oil cake if it's there.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 8,
    name: "Brooklyn Museum",
    category: "Experience",
    neighborhood: "Fort Greene",
    description: "The second-largest art museum in New York, and the one most visitors skip in favor of the Met. That's their loss. The Egyptian collection is world-class, the American art wing is deeply considered, and the first-Saturday-of-the-month free party is one of the best cultural events in the city — live music, DJs, dancing among the galleries.",
    signature: "First Saturdays, 5-11pm, free admission. Arrive by 6 before the line builds. Head straight to the Egyptian wing.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 9,
    name: "Lucien",
    category: "Eat",
    neighborhood: "Lower East Side",
    description: "A French bistro on First Avenue that has somehow resisted every trend for over two decades. The steak frites are perfect, the escargot arrives bubbling, and the room at midnight on a Friday feels like the last outpost of a version of New York that everyone says is dead but clearly isn't. Lucien is proof.",
    signature: "Go after 10pm. Sit at the bar. Order the roast chicken and a carafe of the house red. You're home.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 10,
    name: "McNally Jackson Books",
    category: "Shop",
    neighborhood: "Nolita",
    description: "The independent bookstore that Nolita deserves. The curation leans literary and international in a way that feels personal, not algorithmic. The staff picks are actually trustworthy, the design section in the basement is superb, and there's an Espresso Book Machine that can print you a bound copy of nearly any public-domain title while you wait.",
    signature: "The basement level — design, architecture, and art books you won't find at the chains. Budget more time than you think.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "Gage & Tollner",
    category: "Eat",
    neighborhood: "Fort Greene",
    description: "A 19th-century chophouse on Fulton Street that closed in 2004, reopened in 2021, and came back swinging. The gaslit dining room is drop-dead gorgeous — original mahogany, velvet banquettes, and enough atmosphere to make you forget which century you're in. The menu walks a line between classic and modern that most restaurants fumble. Gage & Tollner does not fumble.",
    signature: "The baked Alaska for the table. It arrives flaming and theatrical and tastes as good as it looks.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 12,
    name: "Prospect Park",
    category: "Experience",
    neighborhood: "Fort Greene",
    description: "Olmsted and Vaux's masterpiece — the same duo that designed Central Park, but this was the one they preferred. The Long Meadow is the longest uninterrupted green space in any urban park in America. The Ravine feels like upstate. The Boathouse is stunning. And on any given Saturday, half of Brooklyn is here, living their best life with picnics and boomboxes.",
    signature: "Enter at Grand Army Plaza. Walk the full Long Meadow to the Boathouse. Bring a blanket and something to read.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 13,
    name: "Cervo's",
    category: "Eat",
    neighborhood: "Lower East Side",
    description: "A tiny Portuguese-inflected seafood restaurant on Canal Street that feels like a beach bar that wandered into the Lower East Side and decided to stay. The tinned fish is exceptional, the grilled whole fish is the move, and the natural wine list is short and smart. The back patio in summer is one of the great outdoor dining experiences in the city.",
    signature: "The grilled prawns and a glass of vinho verde on the patio. If it's cold, the octopus inside is just as good.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 14,
    name: "Café Integral",
    category: "Coffee",
    neighborhood: "Nolita",
    description: "Nicaraguan-sourced specialty coffee served from a tiny counter inside the Freehand hotel lobby. The beans are direct-trade from owner Cesar Vega's family connections, and the roasting is meticulous. The café con leche is rich and nuanced — nothing like the sugary bodega version. It's a reminder that great coffee starts with great sourcing.",
    signature: "The café con leche, made with their signature Nicaraguan blend. Drink it standing at the counter like you're in Managua.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 15,
    name: "Lilia",
    category: "Eat",
    neighborhood: "Williamsburg",
    description: "Missy Robbins' Williamsburg pasta temple is the hardest reservation in Brooklyn for good reason. The handmade pastas — agnolotti, mafaldine, cacio e pepe fritti — are among the best in the country, served in a converted auto body shop that somehow feels like the coziest room in the neighborhood. If you eat pasta in New York, you eat here.",
    signature: "The mafaldine with pink peppercorns is the signature, but the agnolotti changes with the seasons and is almost always the dish of the night. Book exactly 30 days out at midnight.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 16,
    name: "Nowadays",
    category: "Experience",
    neighborhood: "Bushwick",
    description: "An outdoor venue in Ridgewood that straddles the line between beer garden, dance club, and community space. In summer, the garden is massive and the DJ lineups pull from the deep end of house and techno. In winter, the indoor space keeps the party going. It's one of the few nightlife spots in the city that feels genuinely inclusive and genuinely good.",
    signature: "Sunday afternoon dance parties in the garden, May through September. Bring sunscreen and comfortable shoes.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 17,
    name: "The Wythe Hotel",
    category: "Stay",
    neighborhood: "Williamsburg",
    description: "A converted 1901 cooperage on the Williamsburg waterfront that set the template for Brooklyn's boutique hotel scene. The exposed brick and factory windows are original, the rooms are airy and restrained, and the rooftop bar has Manhattan skyline views that feel like a movie set. It's the hotel that made people believe Brooklyn could be a destination.",
    signature: "Book a corner king with a Manhattan view. The rooftop at sunset is compulsory, but go on a weeknight to avoid the crowds.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 18,
    name: "Tatiana by Kwame Onwuachi",
    category: "Eat",
    neighborhood: "Harlem",
    description: "Kwame Onwuachi's restaurant inside Lincoln Center is a love letter to the African diaspora told through food that is technically dazzling and deeply soulful. The suya-spiced lamb, the egusi soup, the jollof rice — every dish connects continents and centuries. The room is beautiful, the service is warm, and the cooking is among the most important in America right now.",
    signature: "The egusi pepper soup is a must. Pair it with whatever the sommelier pours — the wine program is exceptional.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 19,
    name: "Peoples Wine",
    category: "Drink",
    neighborhood: "Williamsburg",
    description: "A natural wine bar on Wythe Avenue with a list that's deep, nerdy, and surprisingly approachable. The space is small and the vibe is low-key — think neighborhood locals on a first-name basis with the staff. The by-the-glass selection rotates constantly, and the food menu of small snacks is genuinely good, not an afterthought.",
    signature: "Ask for something skin-contact from a producer you've never heard of. They'll nail it every time.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Sahadi's",
    category: "Shop",
    neighborhood: "Fort Greene",
    description: "A Middle Eastern grocery and specialty food store that's been on Atlantic Avenue since 1948 and still feels essential. The bulk spices, dried fruits, and house-made hummus are legendary. The prepared foods counter at the Industry City outpost is a lunch destination in its own right. This is immigrant New York at its most delicious and enduring.",
    signature: "The house-made hummus by the pound and the dried apricots. Stock up — you'll be back for more within the week.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "Russ & Daughters",
    category: "Eat",
    neighborhood: "Lower East Side",
    description: "An appetizing store that's been on Houston Street since 1914, and the smoked fish is still the best in the city. The nova is silky, the sable is transcendent, and the cream cheeses are made in-house. This isn't nostalgia — it's a family business that has stayed excellent across four generations. The café around the corner serves the same product with table service.",
    signature: "The classic board with nova, sable, sturgeon, cream cheese, and a toasted everything bagel. Split it or don't.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 22,
    name: "Dante",
    category: "Drink",
    neighborhood: "West Village",
    description: "A century-old café on MacDougal Street reborn as one of the best cocktail bars on earth. The Negroni variations are the headliners, but the garibaldi — fluffy, bright, bitter orange — is the drink that made this place famous again. The Italian aperitivo menu is smart, the room is beautiful, and the sidewalk tables in summer are peak Greenwich Village.",
    signature: "The garibaldi at an outside table around 5pm. It's the simplest cocktail in the house and the most perfect.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 23,
    name: "Partners Coffee",
    category: "Coffee",
    neighborhood: "Williamsburg",
    description: "A Williamsburg roaster that's been quietly excellent since its early days as Toby's Estate. The flagship on North 6th has big tables, natural light, and the kind of espresso program that rewards attention. The seasonal blends are consistently interesting, and the baristas actually want to talk about what they're pulling.",
    signature: "The flat white, made with their seasonal espresso blend. Grab a bag of the single-origin filter roast on your way out.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 24,
    name: "Via Carota",
    category: "Eat",
    neighborhood: "West Village",
    description: "Jody Williams and Rita Sodi's Italian restaurant on Grove Street is the most beloved restaurant in New York, and the wait for a walk-in table is proof. The carciofi fritti are perfect, the pastas are textbook, and the room has a warmth that no amount of design can manufacture — it comes from the people running it. No reservations. Worth every minute in line.",
    signature: "Go at 5:15 for a Tuesday dinner. Put your name in, walk to the corner, and come back when they text. The insalata verde is non-negotiable.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 25,
    name: "Diamond Horseshoe at the Paramount Hotel",
    category: "Experience",
    neighborhood: "Chelsea",
    description: "The Metropolitan Museum of Art needs no introduction, but most people visit it wrong. Skip the front entrance crowds and enter through the less-trafficked 81st Street door. The Temple of Dendur at golden hour is transcendent. The rooftop garden — open spring through fall — offers cocktails and one of the most cinematic views of Central Park you'll find anywhere.",
    signature: "The Cantor Roof Garden Bar, open May through October. Arrive at 4:30 on a Friday for the best light over the park.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 26,
    name: "The Metropolitan Museum of Art",
    category: "Experience",
    neighborhood: "Harlem",
    description: "The Met is a city within a city — encyclopedic, overwhelming, and endlessly rewarding. Don't try to see everything. Pick one wing, one era, one idea, and go deep. The American Wing's courtyard is stunning. The Egyptian galleries are world-class. And the rooftop sculpture garden in warm months serves cocktails against a Central Park backdrop that makes you forgive the crowds.",
    signature: "Enter at 81st Street to avoid the main steps. Go straight to the American Wing courtyard, then up to the roof.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 27,
    name: "Rough Trade",
    category: "Shop",
    neighborhood: "Williamsburg",
    description: "The Williamsburg outpost of London's legendary record shop. The vinyl selection is massive and meticulously organized, the staff actually listen to the music they're selling, and the in-store performance space hosts acts you'll brag about seeing in a room this small. It's the kind of record store that makes streaming feel inadequate.",
    signature: "Check the events calendar — the in-stores are free, intimate, and consistently excellent. Browse the staff picks wall while you're there.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 28,
    name: "Maison Premiere",
    category: "Drink",
    neighborhood: "Williamsburg",
    description: "A New Orleans-style oyster bar and absinthe parlor on Bedford Avenue that transports you to another century. The oyster selection is one of the deepest in the city, the cocktails are built with a mixologist's precision and a historian's curiosity, and the garden in back is one of Brooklyn's best-kept warm-weather secrets.",
    signature: "A dozen oysters, a sazerac, and a seat in the garden. This is the correct order of operations.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 29,
    name: "Devoción",
    category: "Coffee",
    neighborhood: "Williamsburg",
    description: "A Colombian roaster operating out of a jaw-dropping Williamsburg space — soaring ceilings, a living green wall, and natural light that photographers plan their days around. But the real story is the supply chain: beans sourced directly from Colombian farms and roasted within days of arrival. The result is coffee with a freshness you can taste, vibrant and alive.",
    signature: "The single-origin pour-over, whatever's freshest that week. Drink it black to actually taste what they're doing.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 30,
    name: "Prince Street Pizza",
    category: "Eat",
    neighborhood: "Nolita",
    description: "A tiny slice shop on Prince Street that does exactly one thing better than nearly anyone in the city: the pepperoni square. The small, crisp-edged pepperoni cups pool with oil, the cheese is thick and molten, and the square Sicilian crust has a crunch that haunts you. The line wraps around the block for a reason.",
    signature: "The spicy spring pepperoni square. Only the square. Get two slices — you'll regret stopping at one.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 31,
    name: "Casa Enrique",
    category: "Eat",
    neighborhood: "Greenpoint",
    description: "A Michelin-starred Mexican restaurant in Long Island City that feels nothing like a Michelin-starred restaurant. The mole is a week-long project and tastes like it. The enfrijoladas are the quiet star of the menu. The margaritas are perfect. And the price point — for this level of cooking — is shockingly reasonable. Cosme gets the press. Casa Enrique gets the love.",
    signature: "The chicken mole. It's the dish that earned the star and it's worth crossing the river for.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 32,
    name: "The Cloisters",
    category: "Experience",
    neighborhood: "Harlem",
    description: "A branch of the Met built from pieces of five medieval European monasteries, perched on a hill in Fort Tryon Park overlooking the Hudson. The Unicorn Tapestries alone are worth the trip. The herb garden is planted from medieval manuscripts. The whole place feels impossible — a 12th-century cloister reassembled stone by stone in upper Manhattan. Most visitors never make it this far north. That's the point.",
    signature: "Take the A train to 190th Street. Walk through Fort Tryon Park to the entrance. The Unicorn Tapestries room, in silence.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 33,
    name: "Roberta's",
    category: "Eat",
    neighborhood: "Bushwick",
    description: "The Bushwick pizza restaurant that helped put the neighborhood on the map and still delivers one of the best pies in the city. The wood-fired oven turns out blistered, chewy Neapolitan-style pizzas in a space that still feels like the warehouse party it evolved from. The Bee Sting — hot honey and sopressata — is a modern classic.",
    signature: "The Bee Sting pizza. Sit in the back garden if weather allows. Go at an off-hour — 3pm on a weekday is ideal.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 34,
    name: "Bemelmans Bar",
    category: "Drink",
    neighborhood: "Harlem",
    description: "The bar inside the Carlyle Hotel with original Ludwig Bemelmans murals on every wall — the same artist who created Madeline. Live jazz nightly, a crowd that actually dresses up, and martinis served with the kind of quiet ceremony that makes you understand why people loved old New York. It's expensive. It's worth it once.",
    signature: "Go on a weeknight at 8pm. Order a martini. Listen to the piano. Look at the murals. This is the city at its most elegant.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 35,
    name: "Marlow & Sons",
    category: "Eat",
    neighborhood: "Williamsburg",
    description: "The restaurant that helped define the farm-to-table Brooklyn movement before that phrase became a parody. Andrew Tarlow's original spot on Broadway still serves a daily-changing menu of simply prepared, sourced-with-obsession dishes. The oysters are impeccable. The roast chicken is the kind of thing that makes you wonder why anyone complicates chicken.",
    signature: "The roast chicken, whatever preparation they're running tonight. And a dozen oysters to start. Classic for a reason.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 36,
    name: "Green-Wood Cemetery",
    category: "Experience",
    neighborhood: "Fort Greene",
    description: "A 478-acre National Historic Landmark in the heart of Brooklyn that doubles as one of the city's most beautiful parks. The rolling hills, glacial ponds, and Gothic Revival gatehouse make Central Park feel manicured by comparison. The parrots nesting in the main gate are real. The sunset views of the harbor are staggering. Come for history, stay for the beauty.",
    signature: "Enter through the main Gothic arch. Walk to Battle Hill — the highest point in Brooklyn — for views of the harbor and the Statue of Liberty.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Olive's Vintage",
    category: "Shop",
    neighborhood: "Williamsburg",
    description: "A Williamsburg vintage shop with a ruthlessly curated selection of 70s-through-90s clothing that feels more like a stylist's closet than a thrift store. The owner has an eye that separates genuine finds from costume-shop filler. Prices are fair, the turnover is fast, and you'll walk out wearing something that gets compliments within the hour.",
    signature: "Check the leather jacket rack first — they source exceptional ones. Go midweek when the weekend picks haven't been raided.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 38,
    name: "The Tenement Museum",
    category: "Experience",
    neighborhood: "Lower East Side",
    description: "A museum built inside an actual 1863 tenement building at 97 Orchard Street. The guided tours walk you through painstakingly recreated apartments of real immigrant families — Irish, German, Italian, Chinese — who lived here across a century. It's the most intimate, human telling of the American immigration story you'll find anywhere. You will leave changed.",
    signature: "Book the 'Hard Times' or 'Sweatshop Workers' tour. They sell out — reserve online a week in advance.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 39,
    name: "Sunday in Brooklyn",
    category: "Eat",
    neighborhood: "Williamsburg",
    description: "A three-floor Williamsburg restaurant that earned its name from its legendary brunch, but the dinner service is where the kitchen really sings. The malted pancake with hazelnut praline is the most Instagrammed dish in the neighborhood for a reason — it's genuinely one of the best pancakes in America. But the savory menu has a quiet depth that the brunch fame overshadows.",
    signature: "The malted pancake at brunch, obviously. At dinner, the roasted carrots with whipped feta are the sleeper hit.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 40,
    name: "The Freehand New York",
    category: "Stay",
    neighborhood: "Nolita",
    description: "A design hotel on Lexington that splits the difference between boutique and budget without sacrificing personality. The George Washington Bar is a stunner — all hand-painted murals and low light — and the Roman & Williams interiors make even the compact rooms feel considered. It's the hotel you recommend to the friend who wants to stay somewhere interesting without spending four figures a night.",
    signature: "Drinks at the George Washington Bar on a weeknight. The murals alone are worth the visit even if you're not a guest.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 41,
    name: "Smorgasburg",
    category: "Experience",
    neighborhood: "Williamsburg",
    description: "The open-air food market that launched a thousand food careers. Every Saturday on the Williamsburg waterfront, 100-plus vendors serve everything from Ramen burgers to Jamaican jerk to Taiwanese bao. It's crowded, it's chaotic, and on a sunny Saturday with the Manhattan skyline behind you and a perfect arepa in your hand, it's the most New York thing you can do for free.",
    signature: "Go hungry. Walk the full market once before buying anything. The Colombian arepas and the dumplings are consistent every week.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 42,
    name: "Dear Irving on Hudson",
    category: "Drink",
    neighborhood: "Chelsea",
    description: "A cocktail bar on the 40th floor of the Aliz Hotel with panoramic views that make every other rooftop bar in the city feel like it's trying too hard. The cocktails are organized by era — Prohibition, Jazz Age, Mod — and the execution matches the ambition. On a clear night, with the city spread out below you, the drinks almost feel secondary. Almost.",
    signature: "A seat by the west-facing windows at sunset. Order from the Mod section — the bartenders' favorites live there.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 43,
    name: "Archestratus Books + Foods",
    category: "Shop",
    neighborhood: "Greenpoint",
    description: "A bookshop-meets-café in Greenpoint dedicated entirely to food and cooking. The shelves are stocked with cookbooks, food writing, and culinary zines curated by people who clearly cook from these books themselves. The sandwiches and pastries are made in-house, and you can eat lunch surrounded by more cookbooks than most restaurant libraries own.",
    signature: "Browse the zine section — small-batch food writing you won't find anywhere else. Grab a sandwich and a book and settle in.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 44,
    name: "Brooklyn Bridge Park",
    category: "Experience",
    neighborhood: "Fort Greene",
    description: "An 85-acre waterfront park stretching from Atlantic Avenue to the Manhattan Bridge. The views of lower Manhattan from Pier 1 are the most photographed in the borough, but the park's genius is in its variety — kayak launches, a pop-up pool in summer, Jane's Carousel, and rock-scrambling playgrounds. It's civic design at its best, and it just keeps getting better.",
    signature: "Pier 6 at sunset, facing Manhattan. Bring takeout from Sahadi's. The free kayaking on summer weekends is legitimately great.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 45,
    name: "Joe's Pizza",
    category: "Eat",
    neighborhood: "West Village",
    description: "A slice shop on Carmine Street that has been serving the platonic ideal of a New York cheese slice since 1975. Thin, foldable, properly greasy, with a char on the bottom that crackles. No gimmicks, no artisanal toppings, no precious sourdough crust. Just pizza the way this city invented it, executed perfectly for fifty years.",
    signature: "A plain cheese slice, folded. That's it. Eat it standing on the sidewalk. This is the experience.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "Café Mogador",
    category: "Drink",
    neighborhood: "Lower East Side",
    description: "A Moroccan café on St. Marks Place that's been the East Village's living room since 1983. The tagines are fragrant and generous, but it's the outdoor tables on a warm evening that make Mogador irreplaceable. Two generations of New Yorkers have had first dates, breakups, and reunions at these tables. The place has absorbed more stories than most novels.",
    signature: "The lamb tagine on the sidewalk patio. Arrive before 7 on a Friday to get an outdoor table without waiting.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 47,
    name: "The 1 Hotel Brooklyn Bridge",
    category: "Stay",
    neighborhood: "Fort Greene",
    description: "A waterfront hotel at the edge of Brooklyn Bridge Park with the kind of Manhattan views that stop conversations mid-sentence. The rooms are all reclaimed wood and organic linens, the rooftop pool is an event, and waking up to the sight of the Brooklyn Bridge and lower Manhattan skyline is worth the premium. Sustainable design that doesn't sacrifice luxury.",
    signature: "A river-view room on a high floor. Morning coffee on the balcony watching the ferries cross — you'll never want to leave.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 48,
    name: "Artists & Fleas",
    category: "Shop",
    neighborhood: "Williamsburg",
    description: "A curated indoor market on North 7th Street featuring local designers, vintage dealers, and makers. Unlike the bigger Brooklyn flea markets, this one is compact and consistently high-quality — hand-poured candles, independent jewelry designers, vintage Levi's, and small-batch ceramics. It's the best place to buy a gift that doesn't look like it came from a gift shop.",
    signature: "The jewelry vendors rotate — go with an open mind. The vintage eyewear dealers are consistently excellent.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "Long Island Bar",
    category: "Drink",
    neighborhood: "Fort Greene",
    description: "A 1951 bar in Cobble Hill that was beautifully restored and reopened with a serious cocktail program and the original neon sign intact. The room is a time capsule — Formica countertops, chrome barstools, a curved bar that's pure mid-century Brooklyn. The martini is textbook. The burger is one of the best bar burgers in the city. It feels like a place that always existed and always should.",
    signature: "The martini, up, with a twist. Sit at the bar and order the burger. This is the platonic ideal of a New York bar.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "St. Ann's Warehouse",
    category: "Experience",
    neighborhood: "Fort Greene",
    description: "A performing arts space in a converted tobacco warehouse under the Brooklyn Bridge. The programming is fearless — experimental theater, avant-garde music, boundary-pushing dance — and the building itself is extraordinary, with soaring ceilings and the bridge visible through the glass wall. It's the kind of venue that makes you proud to live in a city that supports work this ambitious.",
    signature: "Check the calendar and go to whatever's playing. The programming is curated by people with impeccable taste — trust them.",
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
      background: "linear-gradient(135deg, #2a2a30 0%, #3a3540 25%, #2e3545 50%, #4a4035 75%, #2a2530 100%)",
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
          New York, New York
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          New York
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          The definitive 50. Every borough, every vibe, no filler.
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
          {entry.signature.length > 90 ? entry.signature.slice(0, 90) + "\u2026" : entry.signature}
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
  const entry = ENTRIES[1]; // Dhamaka
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
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: "#1a1a1a" }}>The NoMad Hotel</span>
              <span style={{ display: "block", fontSize: 11, color: "#999", marginTop: 2 }}>Stay · Chelsea</span>
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
    { name: "Austin", tagline: "Still weird. Still worth it." },
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
          &copy; 2026. All recommendations earned.
        </span>
      </div>
    </footer>
  );
};

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function NewYorkCityPage() {
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
            : `${filtered.length} ${filtered.length === 1 ? "pick" : "picks"} in ${activeCategory !== "All" ? activeCategory : ""} ${activeNeighborhood !== "All Neighborhoods" ? "\u00b7 " + activeNeighborhood : ""}`.trim()
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
