import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";
import { subscribeEmail } from "./src/mailchimp.js";
import CityMap from "./src/CityMap.jsx";
import LOCATIONS from "./src/locations.json";
import PageMeta from "./src/PageMeta.jsx";

const CITY_PHOTOS = PHOTOS["denver"] || {};
const CITY_LOCATIONS = LOCATIONS["denver"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "RiNo", "LoDo", "Capitol Hill", "Highland", "Five Points", "Baker", "LoHi", "Tennyson", "South Broadway", "Wash Park"];

const ENTRIES = [
  {
    id: 1,
    name: "The Wolf's Tailor",
    category: "Eat",
    neighborhood: "RiNo",
    description: "A grain-forward restaurant from a former Frasca chef that mills its own flour and bakes some of the most extraordinary bread in Colorado. The pasta is hand-pulled and the whole operation runs on a quiet obsession with ancient grains and fermentation. It's ambitious without being fussy, and every plate has a story rooted in the dirt it came from.",
    signature: "The bread service is non-negotiable. Ask for the cultured butter and the house-milled focaccia before you even look at the menu.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 2,
    name: "Beckon",
    category: "Eat",
    neighborhood: "RiNo",
    description: "A hidden tasting-menu restaurant tucked behind Call, its casual sibling. You walk through what looks like a normal restaurant and end up in a 22-seat room where chef Duncan Holmes serves one of the most inventive prix fixe meals between the coasts. It feels like a secret because it basically is one. Denver's most ambitious kitchen, operating in near-silence.",
    signature: "Book weeks in advance. Sit at the counter if you can — watching the plating is half the experience.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "Hotel Clio",
    category: "Stay",
    neighborhood: "Highland",
    description: "A luxury property at the edge of Cherry Creek that feels more like a well-connected friend's penthouse than a hotel. The rooftop pool has unobstructed mountain views, the rooms are clean-lined and warm, and the service walks the line between attentive and invisible. It's the kind of place that makes you wonder why you ever stayed downtown.",
    signature: "Request a west-facing room on a high floor. The sunset over the Front Range from your bed is worth the upgrade.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 4,
    name: "Red Rocks Amphitheatre",
    category: "Experience",
    neighborhood: "South Broadway",
    description: "You already know about Red Rocks. But knowing about it and standing inside it at dusk while the sky turns violet behind the stage are two completely different things. This 9,525-seat amphitheatre carved into 300-million-year-old sandstone is not just Denver's greatest venue — it might be the greatest outdoor music venue on Earth. No hyperbole.",
    signature: "Skip the big headliners if you can. The smaller weeknight shows and Film on the Rocks screenings are when the magic really lands.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 5,
    name: "Hop Alley",
    category: "Eat",
    neighborhood: "RiNo",
    description: "A Sichuan-inflected Chinese restaurant in RiNo that takes the cuisine dead seriously while keeping the vibe loose and loud. Chef Tommy Lee grew up on these flavors and translates them with technical precision and zero compromise on heat. The mapo tofu is a benchmark. The dan dan noodles will recalibrate your spice tolerance.",
    signature: "The kung pao pastrami is the move that locals argue about. Order it and pick a side.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 6,
    name: "Williams & Graham",
    category: "Drink",
    neighborhood: "LoHi",
    description: "Behind a bookcase in what appears to be an old-timey bookshop lies one of the best cocktail bars in the country. That's not an exaggeration — it's been on every important bar list since it opened. The drinks are meticulous, the room is dark and handsome, and the bartenders have the kind of quiet confidence that comes from knowing they're working at the top of their game.",
    signature: "Tell them what spirit you lean toward and let them build you something off-menu. They live for it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "Huckleberry Roasters",
    category: "Coffee",
    neighborhood: "RiNo",
    description: "Denver's most consistent third-wave roaster, operating out of a sun-flooded RiNo space that doubles as the roasting facility. You can smell the beans as they turn. The espresso program is dialed tight, the pour-overs are patient and precise, and the whole operation radiates the kind of earnest quality that makes you root for them.",
    signature: "The Ethiopian single-origin pour-over, whatever the current lot is. They rotate constantly, and it's always interesting.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 8,
    name: "Denver Art Museum",
    category: "Experience",
    neighborhood: "LoDo",
    description: "Daniel Libeskind's titanium-clad building is worth the visit for the architecture alone — angular, aggressive, and unlike anything else on the skyline. But the collections inside match the ambition, especially the Western American and Indigenous art wings. The rotating exhibitions consistently punch above what you'd expect from a mid-sized city museum. Denver's cultural anchor, full stop.",
    signature: "First Saturday of the month is free. Head straight to the Indigenous arts collection on the fourth floor — it's world-class and under-visited.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 9,
    name: "Guard and Grace",
    category: "Eat",
    neighborhood: "LoDo",
    description: "A steakhouse that would hold its own in any city, from a chef who trained under Thomas Keller. The dry-aged cuts are impeccable, the raw bar is surprisingly strong, and the room — all glass and reclaimed wood — has an energy that manages to be celebratory without tipping into bro-culture territory. This is where Denver does power dinner.",
    signature: "The Colorado lamb chops with the bone marrow butter. Skip the sides — that dish is a complete thought.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 10,
    name: "Tattered Cover Book Store",
    category: "Shop",
    neighborhood: "Capitol Hill",
    description: "Denver's legendary independent bookstore has been the city's literary heart for over four decades. The Capitol Hill location carries the torch with overstuffed chairs, a curated selection that rewards browsing, and a staff that actually reads. In an age of algorithmic recommendations, Tattered Cover is a reminder that a good bookseller is still the best search engine.",
    signature: "Ask for the staff picks shelf — it's near the front and changes monthly. Then find a chair and disappear for an hour.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "Safta",
    category: "Eat",
    neighborhood: "RiNo",
    description: "Alon Shaya's Israeli restaurant inside The Source Hotel, and it's magnificent. The hummus alone — silky, warm, pooled with brown butter and served with pillowy house-baked laffa — would justify the trip. But the whole menu sings: lamb shoulder, harissa-roasted cauliflower, shakshuka that makes you want to rethink breakfast entirely. The space is vast and golden-lit, like eating inside a honeycomb.",
    signature: "The hummus with the daily rotation topping. Don't share the laffa — order your own.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 12,
    name: "Death & Co",
    category: "Drink",
    neighborhood: "RiNo",
    description: "The Denver outpost of the legendary New York cocktail bar, and arguably the one with better vibes. The space is moody and multi-roomed — find the back patio in summer or the dim corner booth in winter. The menu is a cocktail education disguised as a night out. Every drink is precise, balanced, and built by people who treat ice as a serious ingredient.",
    signature: "The menu is long and can overwhelm. Pick a spirit, pick a mood — the bartenders will navigate from there.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 13,
    name: "Denver Biscuit Company",
    category: "Eat",
    neighborhood: "Five Points",
    description: "Biscuits the size of your head, made from scratch every morning, stuffed with fried chicken or smothered in sausage gravy. It's not subtle. It's not trying to be. DBC is a hangover cure, a celebration meal, and a reason to skip every other breakfast in the city. The line is real and it moves fast. Get in it.",
    signature: "The Franklin — buttermilk fried chicken, honey, and a biscuit that could anchor a meal by itself.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 14,
    name: "Union Station",
    category: "Experience",
    neighborhood: "LoDo",
    description: "Denver's 1914 Beaux-Arts train station, reborn as the city's great public living room. The main hall is stunning — soaring ceilings, original chandeliers, leather couches where half of Denver comes to work, drink, or people-watch. It's still a working transit hub, which gives it an energy that purely commercial spaces can't fake. The Terminal Bar inside is worth a stop on its own.",
    signature: "Grab a seat in the Great Hall on a weekday afternoon. Order a drink from Terminal Bar and watch the city pass through.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 15,
    name: "Corvus Coffee Roasters",
    category: "Coffee",
    neighborhood: "South Broadway",
    description: "A direct-trade roaster with a deep commitment to sourcing that goes way beyond marketing copy. Corvus roasts in small batches, rotates origins constantly, and has a tasting room on South Broadway where the baristas can tell you the name of the farmer who grew your beans. The espresso is rich and clean, and the space has a neighborhood warmth that chains will never replicate.",
    signature: "Ask for whatever single-origin just dropped that week. They get visibly excited talking about new lots.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 16,
    name: "Linger",
    category: "Eat",
    neighborhood: "LoHi",
    description: "A global street-food restaurant in a converted mortuary — the old sign still reads 'Olinger Mortuaries' with a few letters artfully removed. The rooftop patio has panoramic views of downtown, and the menu zigzags from Saigon to Lima to Mumbai without losing its footing. It's flashy, sure, but the kitchen backs it up with real skill and genuine flavor.",
    signature: "Rooftop at sunset, full stop. Order the bao buns and the satay and let the view do the rest.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 17,
    name: "The Crawford Hotel",
    category: "Stay",
    neighborhood: "LoDo",
    description: "Built into the top floors of Union Station, sleeping here means waking up in one of the most beautiful buildings in Colorado. The rooms range from classic Pullman sleeper-car style to loft suites with exposed brick and soaring ceilings. You're steps from the best bars and restaurants in LoDo, and the Great Hall downstairs is your de facto living room.",
    signature: "Book a loft suite if the budget allows. The ceiling height and the light through those original windows are something else.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 18,
    name: "Denver Central Market",
    category: "Experience",
    neighborhood: "RiNo",
    description: "A European-style food hall in RiNo that brings together some of the city's best food artisans under one roof. Izzio Bakery, Cultura, Green Seed, and a rotating cast of vendors selling everything from house-cured charcuterie to wood-fired pizza. It's not a food court — it's a curated ecosystem where everything is made with visible care.",
    signature: "Start at Izzio for bread, hit Culture Meat for charcuterie, end at Green Seed for a juice. Make a morning of it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 19,
    name: "Ratio Beerworks",
    category: "Drink",
    neighborhood: "RiNo",
    description: "A brewery that feels more like a gallery opening than a taproom. The space is industrial and gorgeous — concrete floors, street art, a sprawling patio that hosts some of RiNo's best people-watching. The beers lean hop-forward but the lager program is quietly excellent. Ratio captures the RiNo energy better than almost anywhere else on the strip.",
    signature: "The Dear You French Saison is a desert-island beer. Grab a pint and claim a spot on the patio.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Nocturne",
    category: "Drink",
    neighborhood: "RiNo",
    description: "A jazz club and cocktail lounge that takes both halves of that equation seriously. The room is intimate and candlelit, the musicians are the real thing, and the cocktails are built with the same precision as the set lists. Live jazz every night, no cover for the bar, and a vibe that makes you feel like you've time-traveled to somewhere better.",
    signature: "Sit at the bar and order the bartender's choice. The music will find you.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "Annette",
    category: "Eat",
    neighborhood: "South Broadway",
    description: "Chef Caroline Glover won a James Beard Award here, and one bite of anything on the menu tells you why. Annette is a wood-fired, farm-driven restaurant that feels like eating at a very talented friend's dinner party. The menu changes with the seasons, the wine list is natural-leaning and smart, and the room has a warmth that expensive restaurants rarely achieve.",
    signature: "Whatever's coming off the wood fire that night. The whole roasted trout, if it's on, is transcendent.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 22,
    name: "Meow Wolf Denver",
    category: "Experience",
    neighborhood: "South Broadway",
    description: "A four-story immersive art experience that's part funhouse, part fever dream, part genuine artistic achievement. Convergence Station is massive — over 70 installations across alien worlds, quantum corridors, and rooms that defy description. Whether you think it's high art or high spectacle, you've never experienced anything quite like it. Budget three hours minimum.",
    signature: "Go on a weekday afternoon to avoid the crowds. The third floor is where the most ambitious installations hide.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 23,
    name: "El Five",
    category: "Eat",
    neighborhood: "LoHi",
    description: "A fifth-floor Mediterranean restaurant with floor-to-ceiling windows and the best downtown views in the city. The mezze platters are generous and well-executed, the lamb is always excellent, and the room glows gold at sunset in a way that makes everyone look better. It's the kind of place that turns a Tuesday dinner into an occasion.",
    signature: "Book a window table for sunset. Order the mezze platter for two and the short rib tagine.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 24,
    name: "Twist & Shout",
    category: "Shop",
    neighborhood: "Capitol Hill",
    description: "Denver's definitive record store, holding it down on Colfax since 1988. The vinyl selection is deep and lovingly organized, the staff knows their catalog cold, and the in-store performances have hosted everyone from local punk bands to touring legends. If Denver has a musical soul, a good chunk of it lives in these bins.",
    signature: "Hit the used vinyl section in the back — the jazz and soul bins are consistently excellent. Bring cash for the dollar bin.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 25,
    name: "Little Owl Coffee",
    category: "Coffee",
    neighborhood: "South Broadway",
    description: "A tiny, immaculate cafe on South Broadway where every drink is prepared with the focus of a watchmaker. The espresso is pulled on a gorgeous Slayer machine, the latte art is genuinely beautiful, and the pastry case — stocked by local bakers — is curated with real taste. It's small enough that you feel like a regular by your second visit.",
    signature: "The cortado. Simple, precise, and the best way to judge any serious coffee shop.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 26,
    name: "Denver Botanic Gardens",
    category: "Experience",
    neighborhood: "Capitol Hill",
    description: "Twenty-four acres of curated gardens in the middle of the city, with a Japanese garden, an alpine rock garden, and one of the best collections of high-altitude plants in the world. It's stunning in every season — the summer concert series is iconic, but the winter lights are quietly becoming a Denver tradition. Come for the plants, stay for the unexpected beauty.",
    signature: "The Japanese Garden in early morning, before the crowds. Or the summer concert series — the setting elevates even mediocre bands.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 27,
    name: "Biker Jim's Gourmet Dogs",
    category: "Eat",
    neighborhood: "LoDo",
    description: "Wild game hot dogs from a former Alaskan mountain bike guide. Elk jalapeno cheddar. Rattlesnake and pheasant. Reindeer. This sounds like a novelty until you taste one — they're legitimately great sausages, charred on a grill outside a brick-and-mortar near Coors Field. Biker Jim's is the kind of place that could only exist in Denver, and the city is better for it.",
    signature: "The elk jalapeno cheddar dog with cream cheese and caramelized onions. Don't ask questions, just order it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 28,
    name: "Death & Co Denver",
    category: "Drink",
    neighborhood: "RiNo",
    description: "The Denver outpost of New York's most influential cocktail bar — a sister to the original on East 6th — set in a corner of the Ramble Hotel in RiNo. The room is dark in the way Death & Co rooms always are, the cocktails cost what cocktails should cost when this is what you're getting, and the program rotates seasonal menus that make most other bars feel like they're not paying attention.",
    signature: "Sit at the bar. Order from the cocktail menu, then ask for an off-menu nightcap. The bartenders here are exceptional.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "The Source Hotel",
    category: "Stay",
    neighborhood: "RiNo",
    description: "A hotel built atop a food market in the heart of RiNo, designed with the neighborhood's industrial-creative DNA in its bones. The rooms are minimal and modern, the rooftop pool has mountain views that feel almost unfair, and downstairs you have Safta, New Belgium, and a handful of artisan vendors at your doorstep. It's the most RiNo thing in RiNo.",
    signature: "The rooftop pool at sunset. Even if you're not staying here, the bar up top is open to the public and worth the elevator ride.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 30,
    name: "City Park",
    category: "Experience",
    neighborhood: "Capitol Hill",
    description: "Denver's great urban park — 330 acres of lakes, gardens, and green space with a view of the skyline that belongs on a postcard. The lake is where half the city comes to run, the pavilion hosts summer concerts, and on a clear day the mountain panorama from the east side is one of the best free views in Colorado. It's Central Park with better weather and bigger skies.",
    signature: "The view from the Ferril Lake pavilion at golden hour — downtown framed by the mountains. Bring a blanket and a bottle of something.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 31,
    name: "Tacos Tequila Whiskey",
    category: "Eat",
    neighborhood: "South Broadway",
    description: "A taqueria that treats every tortilla like it matters, because it does. The corn is nixtamalized in-house, the fillings are creative but grounded, and the mezcal selection is quietly one of the best in the state. The South Broadway location has a patio that fills up fast for good reason — this is the taco spot Denver's restaurant people eat at on their nights off.",
    signature: "The birria tacos with the consomme for dipping. Add a smoky mezcal and you've got the best $20 dinner in town.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 32,
    name: "Improper City",
    category: "Drink",
    neighborhood: "RiNo",
    description: "A massive indoor-outdoor beer garden in RiNo with rotating food trucks, a curated tap list, and enough space to breathe. It's not trying to be a craft cocktail temple — it's a neighborhood gathering spot with great beer, sunshine, and the kind of communal energy that makes you want to pull up a chair and stay. Denver at its most relaxed.",
    signature: "Weekend afternoon, a local IPA, whatever food truck is parked out front. This is the plan.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 33,
    name: "Topo Designs",
    category: "Shop",
    neighborhood: "RiNo",
    description: "Denver's homegrown outdoor brand has gone global, but the Larimer Street flagship still feels like the founding shop — unpretentious, built for people who actually use their gear. The bags and packs are the specialty (the Mountain Pack is a Denver classic), but the flagship also stocks collabs you won't find online and a tight edit of apparel. It's the uniform of the Front Range.",
    signature: "The seconds rack in the back is where their bags go at 30% off — minor cosmetic flaws, same lifetime warranty. Check their events calendar for group runs and rides with local ambassadors.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 34,
    name: "Clyfford Still Museum",
    category: "Experience",
    neighborhood: "LoDo",
    description: "A museum dedicated entirely to a single Abstract Expressionist painter, and it works brilliantly. Clyfford Still donated his entire estate — over 3,000 works — to the city of Denver on the condition that they build a museum just for him. The result is one of the most focused, immersive art experiences in the country. The scale of the paintings in these quiet rooms is staggering.",
    signature: "Go alone. Give yourself an hour. The second-floor galleries with the large-scale canvases are where it hits.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 35,
    name: "Work & Class",
    category: "Eat",
    neighborhood: "RiNo",
    description: "Blue-collar food with white-tablecloth execution. The wood-fired grill drives everything here — meats smoked low and slow, vegetables blistered to perfection, and a general philosophy that the best food is honest food made with exceptional technique. The space is loud, the portions are generous, and the cocktails hit harder than you'd expect.",
    signature: "The pork green chile is the sleeper pick. It's not on the regular menu but ask — they'll take care of you.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 36,
    name: "Whittier Cafe",
    category: "Coffee",
    neighborhood: "Five Points",
    description: "A Five Points coffee shop that's as much community space as it is a café — Black-owned, deeply rooted in the neighborhood, and committed to being a third place for the historically Black community of Five Points. The coffee is solid, the pastries are local, and the walls rotate work from neighborhood artists. Show up with no agenda; leave knowing twenty new people.",
    signature: "Get the cafe au lait and a slice of whatever pie Mary Jane Bakery dropped off that morning. Stay for the conversation.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Larimer Square",
    category: "Experience",
    neighborhood: "LoDo",
    description: "Denver's oldest block, and still its most charming. Victorian buildings from the 1880s now house some of the city's best restaurants and boutiques, and the string lights overhead turn the whole thing into a postcard after dark. It's touristy on the surface but genuinely beautiful underneath — the architecture alone justifies a slow walk through.",
    signature: "Go after dark when the lights are on. Start at one end, walk slowly, and duck into whatever catches your eye.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 38,
    name: "Olive & Finch",
    category: "Eat",
    neighborhood: "Capitol Hill",
    description: "A daytime cafe that does everything well — sandwiches, salads, baked goods, breakfast — without chasing trends or overcomplicating anything. The bread is baked in-house, the ingredients are sourced with care, and the neighborhood regulars who pack this place every morning aren't wrong. Sometimes the best restaurant is the one that just gets it right, every day.",
    signature: "The breakfast sandwich on house-baked bread. Simple, perfect, and the reason people wait in line.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 39,
    name: "Goldspot Brewing",
    category: "Drink",
    neighborhood: "Highland",
    description: "A neighborhood brewery in the Highlands that brews with a global palate. The tap list ranges from German-style lagers to experimental sours to South Asian-inspired ales using cardamom and mango. The taproom is small and friendly, the kind of place where the brewer comes out to talk about what's fermenting. Denver's most interesting small brewery.",
    signature: "The chai milk stout in winter, the mango lassi sour in summer. They brew what they want to drink, and you should too.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 40,
    name: "Kirkland Museum of Fine & Decorative Art",
    category: "Experience",
    neighborhood: "LoDo",
    description: "A jaw-dropping collection of decorative art and design from Art Nouveau through postmodernism, displayed salon-style in rooms so densely packed they feel like walking through an interior design fever dream. Vance Kirkland's own abstract paintings anchor the collection, but the furniture, ceramics, and glass are what stop you in your tracks. Criminally underrated.",
    signature: "The Art Deco room. Stand in the middle and turn slowly. It's one of the most visually overwhelming spaces in any Denver museum.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 41,
    name: "The Molecule Effect",
    category: "Drink",
    neighborhood: "Capitol Hill",
    description: "An alcohol-free cocktail bar on Capitol Hill that's doing some of the most creative drink-making in the city — with zero booze. The menu reads like a proper cocktail list, the techniques are legit (fat-washing, fermentation, shrubs), and the result is a bar experience that doesn't ask you to sacrifice complexity or atmosphere. A quiet revolution.",
    signature: "The Smoke Show — smoked pineapple, chili, and a complexity that makes you forget there's no alcohol.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 42,
    name: "Potager",
    category: "Eat",
    neighborhood: "Capitol Hill",
    description: "A Capitol Hill market-driven restaurant that's been quietly turning out some of Denver's most honest cooking since 1997. The menu changes weekly — sometimes daily — driven entirely by what Chef Teri Rippeto finds at the farmers market that morning. The wood-fired hearth in the open kitchen does most of the heavy lifting, and the wine list is one of the smartest in the city.",
    signature: "The wood-fired whole fish when it's on the menu. Ask what's new from the market — the answer tells you what you should order.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 43,
    name: "Cherry Creek Trail",
    category: "Experience",
    neighborhood: "Wash Park",
    description: "A 40-mile paved trail that runs from Confluence Park downtown all the way into the foothills. The urban stretch through Denver is a masterclass in city planning — cottonwood-lined, creek-adjacent, and connected to parks and neighborhoods the whole way. Run it, bike it, or just walk a stretch. It's how Denver moves, and it's free.",
    signature: "Start at Confluence Park and head south toward Wash Park. The four-mile stretch is flat, shaded, and gorgeous.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 44,
    name: "Rockmount Ranch Wear",
    category: "Shop",
    neighborhood: "LoDo",
    description: "The Denver Western-wear store that invented the snap-button Western shirt in 1946 — a building, a family, and a mythology that's somehow stayed unironic for nearly eighty years. Rockmount shirts are worn by every cowboy and country musician who'd actually know better, plus a steady stream of people who want a piece of authentic Americana that isn't a costume. Three generations of Weils run it from the same LoDo storefront.",
    signature: "Get the diamond-snap shirt in pearl gray or black. They've been making it the same way for eight decades.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 45,
    name: "Cerebral Brewing",
    category: "Drink",
    neighborhood: "Five Points",
    description: "A science-obsessed brewery where the beers are named after neurological concepts and brewed with a precision that borders on academic. The hazy IPAs are routinely ranked among the best in the state, the pastry stouts are decadent without being cloying, and the taproom has an understated cool that reflects the neighborhood's creative energy.",
    signature: "Whatever fresh hazy IPA just dropped. They sell out fast — check their social media before you go.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "The Ramble Hotel",
    category: "Stay",
    neighborhood: "RiNo",
    description: "A literary-themed boutique hotel in RiNo with a lobby bar — Death & Co — that's worth visiting even if you're not a guest. The rooms are moody and well-designed, the neighborhood puts you steps from the best food and art in the city, and the whole property has a creative-class energy that feels authentically Denver rather than imported from Brooklyn.",
    signature: "Book a room with a balcony facing the mountains. Then go downstairs to Death & Co for a nightcap.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 47,
    name: "I Heart Denver Store",
    category: "Shop",
    neighborhood: "LoDo",
    description: "A local goods shop in Union Station that stocks exclusively Colorado-made products. Candles, hot sauces, leather goods, ceramics, prints, and small-batch pantry items — all from makers within the state. It's a gift shop that doesn't feel like one, with a curation eye that ensures everything on the shelf is something you'd actually want to own.",
    signature: "The Colorado hot sauce collection and the locally made candles. Better souvenirs than anything at the airport.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "Sloan's Lake Park",
    category: "Experience",
    neighborhood: "Highland",
    description: "Denver's largest lake, surrounded by a 2.6-mile loop trail with unobstructed views of the skyline and the entire Front Range. It's where the west side of the city comes to run, paddle, and watch the sunset paint the mountains pink. Less famous than City Park, more local, and the views are arguably better. The western edge at golden hour is pure Colorado.",
    signature: "Sunset from the western shore, looking east toward downtown with the mountains behind you catching the alpenglow. Bring a camera.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "Sweet Cow Ice Cream",
    category: "Shop",
    neighborhood: "Tennyson",
    description: "A small-batch ice cream shop on Tennyson Street that makes everything from scratch with Colorado dairy. The flavors rotate constantly — salted Oreo, honey lavender, Mexican hot chocolate — and the texture is dense and creamy in a way that commercial ice cream never achieves. It's a neighborhood institution that happens to make some of the best ice cream in the state.",
    signature: "Whatever the seasonal flavor is. They rotate weekly, and the limited runs sell out for a reason.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "Lookout Mountain",
    category: "Experience",
    neighborhood: "Highland",
    description: "A twenty-minute drive from downtown puts you at the top of Lookout Mountain with a 200-mile view of the Continental Divide that will stop you mid-sentence. Buffalo Bill's grave is up here — worth a look — but the real draw is the drive itself: switchbacks through pine forest that open suddenly onto the vastness of the Front Range. This is what people mean when they talk about Denver's proximity to the mountains.",
    signature: "Drive up Lariat Loop at sunset. Park at the top, face west, and let the silence do the work.",
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
      background: "linear-gradient(135deg, #2a3040 0%, #4a5565 25%, #3a4a55 50%, #5a6a55 75%, #3a4045 100%)",
    }}>
      {/* Abstract city-light shapes */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(200,180,255,0.10) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "40%", right: "15%", width: 400, height: 250, background: "radial-gradient(ellipse, rgba(180,200,220,0.08) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 350, height: 180, background: "radial-gradient(ellipse, rgba(200,220,180,0.06) 0%, transparent 70%)" }} />
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
          Denver, Colorado
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Denver
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Mile high standards. Every single pick.
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

// ─── Footer ──────────────────────────────────────────────────────────────────

const Footer = () => {
  const cities = [
    { name: "Austin", tagline: "Still weird. Still worth it." },
    { name: "Portland", tagline: "The real ones know. Here's where they go." },
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

export default function DenverCityPage() {
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
      <PageMeta page="city" citySlug="denver" entries={ENTRIES} />
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

      <CityMap entries={ENTRIES} locations={CITY_LOCATIONS} cityName="Denver" />
      <Footer />
    </div>
    </>
  );
}
