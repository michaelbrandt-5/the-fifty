import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";
import { subscribeEmail } from "./src/mailchimp.js";
import CityMap from "./src/CityMap.jsx";
import LOCATIONS from "./src/locations.json";
import PageMeta from "./src/PageMeta.jsx";

const CITY_PHOTOS = PHOTOS["portland"] || {};
const CITY_LOCATIONS = LOCATIONS["portland"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "Alberta Arts District", "Division", "Hawthorne", "Pearl District", "Mississippi", "Sellwood", "Northwest", "St. Johns", "Foster-Powell", "Montavilla", "NE Portland"];

const ENTRIES = [
  {
    id: 1,
    name: "Stumptown Coffee Roasters",
    category: "Coffee",
    neighborhood: "Division",
    description: "The roastery that launched Portland's third-wave coffee obsession and never stopped pushing. The Division Street location is where the magic happens — beans roasted on-site, baristas who can explain terroir like sommeliers, and a stripped-back space that lets the coffee do all the talking. Twenty-plus years in, Stumptown still sets the bar.",
    signature: "Order the Hair Bender as a pour-over. It's their flagship blend, and tasting it here — feet from where it was roasted — is a different experience entirely.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 2,
    name: "Canard",
    category: "Eat",
    neighborhood: "Division",
    description: "The wine bar next door to Le Pigeon that might actually be better for a Tuesday night. Small plates, natural wines, and a buzzy counter-seating energy that makes you feel like you're in on something. The menu changes constantly, but the duck — this is a duck-focused restaurant, after all — is always worth ordering in whatever form it takes.",
    signature: "The duck confit fried rice is a legend for a reason. Pair it with whatever orange wine they're pouring tonight.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "Ace Hotel Portland",
    category: "Stay",
    neighborhood: "Pearl District",
    description: "The hotel that invented the modern boutique hotel playbook — repurposed vintage furniture, a lobby full of freelancers, and a turntable in every room. The Portland outpost was the original, and it still has a lived-in warmth that the imitators can't replicate. Stumptown in the lobby, Pepe Le Moko in the basement. You could spend a whole trip without leaving the building.",
    signature: "Book a deluxe king with the clawfoot tub. Grab a coffee downstairs before the lobby crowd arrives around 9am.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 4,
    name: "Forest Park",
    category: "Experience",
    neighborhood: "Northwest",
    description: "Five thousand acres of temperate rainforest inside city limits. That's not a typo. The Wildwood Trail stretches over thirty miles through old-growth Douglas firs, and on a weekday morning you can hike for an hour without seeing another soul. This is the thing that makes Portland Portland — a world-class city that keeps wilderness within arm's reach.",
    signature: "Enter at the Lower Macleay trailhead and hike to the Witch's Castle — a mossy, abandoned stone structure about a mile in. Go after rain when the green is electric.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 5,
    name: "Le Pigeon",
    category: "Eat",
    neighborhood: "Division",
    description: "Gabriel Rucker's flagship remains one of the most exciting restaurants on the West Coast. The menu reads like a dare — foie gras profiteroles, beef cheek bourguignon, a burger that costs more than it should and is worth every cent. The room is tiny, the counter seats face the open kitchen, and every plate arrives looking like controlled chaos. This is Portland fine dining at its most unruly and brilliant.",
    signature: "Sit at the chef's counter. Order the tasting menu and let the kitchen run. The burger, if it's available, is non-negotiable.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 6,
    name: "Powell's City of Books",
    category: "Shop",
    neighborhood: "Pearl District",
    description: "An entire city block of new and used books, color-coded by room, organized by an internal logic that rewards wandering. Powell's is the largest independent bookstore in the world, and browsing it feels less like shopping and more like getting lost in someone's impossibly vast personal library. You will leave with more books than you intended. Everyone does.",
    signature: "Start in the Gold Room — rare books and first editions behind glass. Then let yourself drift. The staff picks are uniformly excellent.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "Heart Coffee Roasters",
    category: "Coffee",
    neighborhood: "Alberta Arts District",
    description: "Light roasts done with Japanese precision. Heart sources some of the most remarkable single-origin lots in the city and roasts them just enough to let the bean speak. The Alberta location is bright and minimal — white walls, blond wood, no distractions from what's in the cup. If you think light roast means weak, Heart will change your mind.",
    signature: "Ask for the single-origin pour-over of whatever just came in from Ethiopia. They rotate frequently and the baristas know every lot personally.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 8,
    name: "Mississippi Studios",
    category: "Experience",
    neighborhood: "Mississippi",
    description: "A 200-capacity music venue in a converted church on Mississippi Avenue. The sound is pristine, the sightlines are intimate, and the booking leans toward the kind of acts that are about to break or already should have. This is the room where Portland's music culture lives — up close, a little loud, and always worth checking the calendar.",
    signature: "Check their calendar weekly and grab tickets early — the good shows sell out fast. The attached Bar Bar has solid food and a killer patio for pre-show drinks.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 9,
    name: "Hat Yai",
    category: "Eat",
    neighborhood: "NE Portland",
    description: "Earl Ninsom's southern Thai spot has done what no one in Portland thought possible after Pok Pok closed — it took the city's complicated, hard-earned love for serious Thai food and gave it a new home. The fried chicken with sticky rice and curry is the best version of itself you'll find outside Hat Yai. The roti stays crisp under the curry, which is the test.",
    signature: "Get the fried chicken set with sticky rice and the southern curry. Half order of khanom jeen if you're with a group.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 10,
    name: "Tusk",
    category: "Eat",
    neighborhood: "Division",
    description: "Middle Eastern-inspired vegetable cooking that makes you forget you haven't eaten meat in two hours. The room is beautiful — arched doorways, natural light, a long communal table — and the plates are built around whatever produce is peaking that week. Portland has a hundred restaurants that claim to be vegetable-forward. Tusk is the one that actually means it.",
    signature: "The fried chickpea bowl with zhug and pickled turnips. Add a soft egg. Trust the wine pairings — they know what they're doing.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 11,
    name: "Multnomah Whiskey Library",
    category: "Drink",
    neighborhood: "Pearl District",
    description: "A members-only whiskey bar that also takes walk-ins if there's room — and the room is worth waiting for. Two stories of floor-to-ceiling spirits behind a rolling library ladder, leather club chairs, and bartenders in vests who take their brown liquor dead seriously. It looks like a Wes Anderson set crossed with an Edwardian gentleman's club, and somehow it works.",
    signature: "Put your name on the walk-in list early. Once seated, ask the bartender to build a flight around a region or style — they'll curate something memorable.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 12,
    name: "Lan Su Chinese Garden",
    category: "Experience",
    neighborhood: "Pearl District",
    description: "A walled classical Chinese garden in the middle of Old Town, built by artisans from Portland's sister city, Suzhou. Covered walkways, a central lake, scholar's rocks, and a teahouse that serves traditional gongfu-style tea. It's one of the most authentic Suzhou-style gardens outside of China, and stepping through the gate feels like stepping out of Portland entirely.",
    signature: "Visit on a weekday morning before the tours arrive. Take tea in the Tower of Cosmic Reflections — it's the most serene hour you'll spend in the city.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 13,
    name: "Ava Gene's",
    category: "Eat",
    neighborhood: "Division",
    description: "Italian cooking built on the backbone of Oregon's absurd produce. The pasta is handmade, the vegetables are treated with the reverence usually reserved for prime cuts, and the room — a converted warehouse with soaring ceilings and an open kitchen — hums with a confident energy. Ava Gene's doesn't try to be Rome. It tries to be the best version of what Italian food can become in the Pacific Northwest.",
    signature: "Start with whatever raw vegetable plate they're running — it changes daily and it's always a showcase. The cacio e pepe is a benchmark.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 14,
    name: "Kachka",
    category: "Eat",
    neighborhood: "Division",
    description: "A Russian-inspired restaurant that feels like stepping into someone's grandmother's apartment — if that grandmother had impeccable taste and a serious vodka collection. The zakuski (small plates) are the move: pickled everything, smoked fish, pelmeni that could make you cry. Chef Bonnie Morales brings a deeply personal, joyful energy to a cuisine that American restaurants rarely touch.",
    signature: "Order the pelmeni and the herring under a fur coat. Pair with a horseradish vodka infusion from their house collection. Say da to everything.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 15,
    name: "Coava Coffee Roasters",
    category: "Coffee",
    neighborhood: "Hawthorne",
    description: "Housed in a shared space with bamboo bike frame builders — which tells you everything about the Portland-ness of it all. Coava roasts light and precise, focusing on single-origin coffees that highlight distinct flavor profiles. The flagship on Hawthorne is airy and industrial, with a massive Probat roaster you can watch in action. Some of the cleanest, most transparent coffee in the city.",
    signature: "Try whatever single-origin they're featuring on the Chemex. The baristas will walk you through the tasting notes without being precious about it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 16,
    name: "Ox Restaurant",
    category: "Eat",
    neighborhood: "Alberta Arts District",
    description: "An Argentine-inspired wood-fire grill that's quietly one of the best steakhouses on the West Coast. The asado-style cooking produces meats with a smoky depth that gas grills can't touch, and the South American wine list is deep and smartly priced. The room is warm and unpretentious — white tablecloths would feel wrong here, and they know it.",
    signature: "The bone-in ribeye with chimichurri is the signature, but the grilled octopus starter is the thing people talk about for weeks.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 17,
    name: "Lardo",
    category: "Eat",
    neighborhood: "Hawthorne",
    description: "A sandwich shop that treats the humble sub like a culinary art form. Everything here revolves around pork in its most glorious preparations — braised, smoked, fried, pulled. The Hawthorne location has a great patio and a draft list that goes well beyond the expected IPAs. Come hungry. Leave slow.",
    signature: "The dirty fries with pork scraps, marinated peppers, and fried herbs. They're a side dish that routinely upstages the sandwich.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 18,
    name: "Apotheke",
    category: "Drink",
    neighborhood: "Division",
    description: "A cocktail bar disguised as an old apothecary, where the drinks are organized by their purported effects — euphoric, stimulating, calming. The bartenders mix with a chemist's precision and an herbalist's curiosity, pulling from house-made tinctures and bitters that line the shelves. The space is dark and moody, with vintage medical cabinets and just enough candlelight to read the menu.",
    signature: "Tell the bartender your mood and let them prescribe something. The house tinctures are where the real magic lives.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 19,
    name: "Pip's Original Doughnuts",
    category: "Eat",
    neighborhood: "Alberta Arts District",
    description: "Tiny, made-to-order doughnuts served with a rotating cast of dipping sauces — honey, Nutella, raw cane sugar, seasonal specials. They're not much bigger than a golf ball, they come out of the fryer every few minutes, and the experience of eating one that's still warm is genuinely revelatory. This is not Voodoo Doughnut. This is better.",
    signature: "Order a flight of all the sauces. The chai dipping sauce, when available, is the move. Pair with their house-made chai.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Pittock Mansion",
    category: "Experience",
    neighborhood: "Northwest",
    description: "A 1914 French Renaissance mansion perched on a thousand-foot hill overlooking the city. The house itself is a time capsule of early Portland wealth, but the real draw is the view — Mount Hood, Mount St. Helens, and the downtown skyline spread out below you like a postcard. The grounds are free to wander, and the hike up from Lower Macleay Park is one of the best urban trails in the city.",
    signature: "Hike up from the Wildwood Trail rather than driving. The view hits harder when you've earned it. Go on a clear day for the full Cascade panorama.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "Screen Door",
    category: "Eat",
    neighborhood: "Alberta Arts District",
    description: "Southern comfort food in a city not exactly known for it, and that's precisely why it works. The brunch line is legendary — sometimes an hour on weekends — but the fried chicken, biscuits, and shrimp and grits justify every minute of standing on the sidewalk. Dinner is less crowded and just as good, with a quieter, candlelit energy that feels like a different restaurant entirely.",
    signature: "Go for dinner instead of brunch and skip the line entirely. The praline bacon is better by candlelight anyway.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 22,
    name: "Too Soon",
    category: "Drink",
    neighborhood: "NE Portland",
    description: "A small, intentional cocktail bar on NE 28th Avenue — Earl Ninsom's most recent project, with the kind of seasonal menu and Asian-leaning drinks that make Portland's bar scene feel like its own distinct thing. The room is intimate and warm, the menu rotates with what's growing, and the bartenders will happily build you something off-script if you tell them your mood.",
    signature: "Tell them you want something stirred and herbaceous. Order whatever snack is being run that night — they only do a few and they're good.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 23,
    name: "Cathedral Park",
    category: "Experience",
    neighborhood: "St. Johns",
    description: "The Gothic arches of the St. Johns Bridge soar overhead like a cathedral nave, and the park beneath it is one of Portland's most quietly stunning public spaces. On a foggy morning, the bridge disappears into the mist and the whole scene looks like something out of a fairy tale. Bring a blanket, bring a book, bring nothing at all. Just sit under those arches and look up.",
    signature: "Go at dawn on a foggy morning. The bridge emerging from the mist is one of the most photogenic moments in the city, and you'll have the park to yourself.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 24,
    name: "Nostrana",
    category: "Eat",
    neighborhood: "Division",
    description: "Cathy Whims has been making some of Portland's best Italian food for two decades, and Nostrana is her masterwork. The wood-fired oven produces blistered, chewy pizzas that rival anything in Brooklyn, the seasonal pastas are textbook, and the wine list is deep with Italian bottles you won't find anywhere else in the city. It's a grown-up restaurant that never feels stuffy.",
    signature: "The margherita pizza from the wood oven is a litmus test. If you're with a group, the whole roasted fish is a showstopper.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 25,
    name: "Loyal Legion",
    category: "Drink",
    neighborhood: "Division",
    description: "Ninety-nine taps of exclusively Oregon beer. That's not a gimmick — it's a mission statement. Loyal Legion is a beer hall built to showcase the absurd depth of Oregon's craft brewing scene, and the industrial-chic space with long communal tables feels like the right room for that argument. No food kitchen, but they partner with rotating food carts parked outside.",
    signature: "Ask for a flight of whatever's new from the smaller Oregon breweries. The bartenders know the state's beer scene encyclopedically.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 26,
    name: "Holdfast",
    category: "Eat",
    neighborhood: "Division",
    description: "A twelve-seat chef's counter serving a multi-course tasting menu that changes nightly based on what the kitchen sources that day. It's intimate in a way that most tasting-menu restaurants only pretend to be — you can watch every plate come together, ask the chefs questions, and feel like you're eating dinner at a friend's house. If that friend happened to be one of the most talented cooks in Portland.",
    signature: "Book the counter. There's literally nowhere else to sit. Bring someone you want to talk to — the pacing between courses invites conversation.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 27,
    name: "Hey Love",
    category: "Drink",
    neighborhood: "Division",
    description: "A cocktail bar and restaurant housed in the Jupiter NEXT hotel that manages to feel like neither a hotel bar nor a sceney lounge. The drinks are inventive without being fussy, the space is gorgeous — all terrazzo floors and arched windows — and the crowd is a mix of everyone. Late nights here have a particular magic, when the music gets louder and the room loosens up.",
    signature: "The frozen drinks in summer are some of the best in the city. Grab a booth by the window and settle in for the evening.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 28,
    name: "Tilt",
    category: "Drink",
    neighborhood: "Mississippi",
    description: "A neighborhood wine bar on Mississippi that pours natural wines with zero pretension and maximum enthusiasm. The list changes constantly, the pours are generous, and the backyard patio is one of the most pleasant places to spend a summer evening in Portland. No wine list intimidation here — just good bottles, friendly bartenders, and an effortlessly cool Mississippi Avenue vibe.",
    signature: "Ask what just arrived. The turnover is fast and the staff gets genuinely excited about new bottles. Grab a seat in the backyard.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "Never Coffee",
    category: "Coffee",
    neighborhood: "Alberta Arts District",
    description: "A tiny, design-forward coffee shop that looks like it was airlifted from Tokyo. The menu is short — espresso drinks, a few pastries, done. But the execution is flawless, the beans rotate from top-tier roasters, and the space itself is a masterclass in minimalist design. In a city drowning in coffee shops, Never stands out by doing less, better.",
    signature: "The cortado. Clean, balanced, no nonsense. Drink it at the window bar and watch Alberta Avenue go by.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 30,
    name: "Portland Art Museum",
    category: "Experience",
    neighborhood: "Pearl District",
    description: "The oldest art museum in the Pacific Northwest, with a permanent collection that spans Native American art, Impressionism, contemporary photography, and a robust Asian art wing. The building itself is a graceful blend of historic and modern galleries. It's criminally under-visited by tourists, who somehow always end up at the Saturday Market instead.",
    signature: "The Center for Native American Art on the ground floor is world-class and often empty. Give it an hour. The first Thursday of every month is free admission after 5pm.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 31,
    name: "Nong's Khao Man Gai",
    category: "Eat",
    neighborhood: "Pearl District",
    description: "One dish. Poached chicken over rice with a ginger-chile sauce. That's it. Nong Poonsukwattana built an empire on doing one thing perfectly, and the simplicity is the whole point. The chicken is silky, the rice is fragrant, and the sauce — her grandmother's recipe — ties it together with a clarity that makes everything else feel overcomplicated.",
    signature: "Order the original. Don't add anything. Don't change anything. It's already perfect.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 32,
    name: "Jacobsen Salt Co.",
    category: "Shop",
    neighborhood: "Pearl District",
    description: "A salt company that hand-harvests sea salt from Netarts Bay on the Oregon coast. The Pearl District shop doubles as a tasting room where you can sample infused salts, salt-preserved honey, and salt caramels that will ruin you for the commercial stuff. It's the kind of place that makes you realize you've been seasoning wrong your entire life.",
    signature: "The salt tasting flight. Try the pure flake, the black garlic, and the ghost chile side by side. The infused honey makes an unreasonably good gift.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 33,
    name: "McMenamins Kennedy School",
    category: "Stay",
    neighborhood: "Alberta Arts District",
    description: "A former elementary school converted into a hotel, brewery, movie theater, and soaking pool complex. You sleep in old classrooms, drink beer in the former boiler room, and watch movies in the auditorium. It sounds absurd because it is — and it's one of the most purely Portland experiences you can have. Every hallway is painted with murals, and the grounds feel like a slightly surreal summer camp for adults.",
    signature: "Book a classroom room. Take a soak in the saltwater pool on the old school grounds. Catch a movie in the auditorium with a pint from the on-site brewery.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 34,
    name: "Hotel deLuxe",
    category: "Stay",
    neighborhood: "Pearl District",
    description: "A Golden Age Hollywood-themed boutique hotel that gets the balance right between themed and tasteful. The rooms are plush without being fussy, the Driftwood Room bar is a proper cocktail lounge, and the location puts you within walking distance of both downtown and the Pearl. Old-school glamour meets Pacific Northwest warmth.",
    signature: "The Driftwood Room for a nightcap. Order a classic martini and pretend you're in a 1940s film. The Spiritual Menu on the nightstand — a curated reading list — is a charming touch.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 35,
    name: "International Rose Test Garden",
    category: "Experience",
    neighborhood: "Northwest",
    description: "Over ten thousand rose bushes spread across four acres on a hillside above the city. Portland earned its City of Roses nickname honestly, and this garden — operating since 1917 — is the proof. Peak bloom is June, when the fragrance alone is worth the trip. The view of Mount Hood rising above the city skyline is one of those moments that makes you understand why people move here.",
    signature: "Visit in early June during peak bloom. The Shakespeare Garden section is the most romantic corner. Go in the morning before the tour buses.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 36,
    name: "Prost! Marketplace",
    category: "Eat",
    neighborhood: "Mississippi",
    description: "A German-style biergarten anchoring a rotating food cart pod on Mississippi. The beer selection is deep, the communal tables encourage conversation with strangers, and the covered outdoor seating means rain is never an excuse to stay home. The food carts change, but the energy stays the same — lively, casual, and exactly the kind of place you end up staying longer than planned.",
    signature: "Grab a boot of German lager and graze your way through whatever carts are set up that week. The covered patio is Portland outdoor drinking at its finest.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Tender Loving Empire",
    category: "Shop",
    neighborhood: "Hawthorne",
    description: "Part record label, part retail shop, stocking handmade goods from over 200 Pacific Northwest artists and makers. The mix is impeccable — screen-printed posters, hand-poured candles, locally pressed vinyl, small-batch ceramics. Everything here has a story and a maker's name attached. It's the anti-Amazon, and buying something here feels like investing in the creative ecosystem that makes Portland, Portland.",
    signature: "Browse the vinyl section for releases on their own label. The screen-printed Portland posters make perfect gifts that don't feel generic.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 38,
    name: "Tom McCall Waterfront Park",
    category: "Experience",
    neighborhood: "Pearl District",
    description: "A two-mile park along the Willamette River that replaced an actual freeway in the 1970s — one of the first cities in America to tear down a highway in favor of public space. Walk it end to end. Watch the bridges lift for passing ships. See the Burnside Skatepark under the bridge. The park is a living argument for what a city can be when it prioritizes people over cars.",
    signature: "Walk the full length at sunset, south to north. The Steel Bridge at dusk, with the lights reflecting off the Willamette, is the quiet showstopper.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 39,
    name: "Paxton Gate",
    category: "Shop",
    neighborhood: "Mississippi",
    description: "A cabinet of curiosities disguised as a retail shop. Taxidermy, terrariums, fossils, botanical prints, insect specimens under glass, and garden supplies that lean toward the gothic. It's equal parts science museum, garden center, and oddity shop. If you've ever wanted a framed beetle or a carnivorous plant, this is your place.",
    signature: "The back garden section has rare plants you won't find at any nursery. Ask the staff about the mounted specimen collection — they love talking about it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 40,
    name: "Portland Japanese Garden",
    category: "Experience",
    neighborhood: "Northwest",
    description: "Considered one of the most authentic Japanese gardens outside of Japan, redesigned with a cultural village by Kengo Kuma. Five distinct garden styles unfold across twelve acres on a hillside in Washington Park. The attention to detail is extraordinary — every stone placement, every pruned branch, every water feature is intentional. It's a place that demands you slow down, and rewards you completely when you do.",
    signature: "Go on a rainy weekday. Seriously. The garden was designed for rain — the moss glows, the stone darkens, and the crowds thin to almost nothing.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 41,
    name: "Rum Club",
    category: "Drink",
    neighborhood: "Alberta Arts District",
    description: "A dimly lit cocktail bar with an encyclopedic rum collection and bartenders who can navigate it blindfolded. The space is intimate — low ceilings, candlelight, a handful of stools — and the cocktails are built with a precision that belies the casual neighborhood bar exterior. Don't be fooled by the unassuming facade. This is one of the best bars in Portland, full stop.",
    signature: "Ask the bartender to build you a daiquiri with something unusual. They'll reach for a bottle you've never heard of and it'll be the best daiquiri of your life.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 42,
    name: "Sellwood Antique Row",
    category: "Shop",
    neighborhood: "Sellwood",
    description: "A stretch of SE 13th Avenue lined with antique shops, vintage stores, and curiosity dealers. Each shop has its own personality — mid-century modern at one, Victorian oddities at the next, vintage clothes at a third. You can lose an entire afternoon wandering from storefront to storefront, and the neighborhood's quiet residential streets make it feel like a treasure hunt in a small town.",
    signature: "Start at Stars Antique Mall and work your way south. Budget at least two hours. The vintage kitchenware and old Oregon ephemera are the standout finds.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 43,
    name: "Departure",
    category: "Drink",
    neighborhood: "Pearl District",
    description: "A rooftop bar and restaurant atop The Nines hotel with a panoramic view of Pioneer Courthouse Square and the hills beyond. The Asian-fusion menu is solid, but the real draw is sitting on the outdoor terrace at dusk with a cocktail, watching the city shift from day to night. It's one of the few Portland spots with a genuine skyline view, and on a clear evening, it's unbeatable.",
    signature: "Go for drinks only, on the terrace, at sunset. Order the Departure sour and watch Mount Hood turn pink.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 44,
    name: "Tin Shed Garden Cafe",
    category: "Eat",
    neighborhood: "Alberta Arts District",
    description: "A neighborhood breakfast spot on Alberta that's earned its weekend line through sheer consistency. The portions are enormous, the ingredients are local and organic where it counts, and the dog-friendly patio — complete with a separate dog menu — is peak Portland. It's comfort food with a conscience, served in a space that feels like your coolest neighbor's backyard.",
    signature: "The Potato and Brie scramble or the fried chicken Benedict. Ask for the patio and bring your dog — they'll get their own menu.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 45,
    name: "Clinton Street Theater",
    category: "Experience",
    neighborhood: "Division",
    description: "A 1915 movie palace that's been running the Rocky Horror Picture Show every Saturday night since 1978 — the longest-running screening in the world. Beyond the midnight madness, Clinton Street programs indie films, documentaries, and the kind of repertory screenings that make you feel like cinema still matters. The seats creak, the popcorn is basic, and the vibe is irreplaceable.",
    signature: "Saturday night Rocky Horror if you've never been. Otherwise, check the weekly schedule — their repertory picks are consistently surprising and excellent.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 46,
    name: "The Society Hotel",
    category: "Stay",
    neighborhood: "Pearl District",
    description: "A restored 1881 sailor's boardinghouse turned boutique hotel with a rooftop bar and a range of rooms from bunk-style hostel accommodations to proper suites. The history is baked into the bones — exposed brick, original timber — and the rooftop space has one of the better downtown views in Portland. It's the rare hotel that works for both the budget traveler and the design snob.",
    signature: "The rooftop for evening drinks even if you're not staying. If you are, the private rooms with original brick walls are worth the upgrade from bunks.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 47,
    name: "Hawthorne Boulevard",
    category: "Experience",
    neighborhood: "Hawthorne",
    description: "Portland's most walkable commercial strip, running from 30th to 50th with a density of vintage shops, bookstores, cafes, and restaurants that makes it feel like the city in miniature. It's where old Portland and new Portland overlap most visibly — a head shop next to a natural wine bar next to a used bookstore. Walk it end to end. Let it tell you what Portland is.",
    signature: "Start at 30th and walk east. Stop at Movie Madness for the museum of film props, Bagdad Theater for a beer and a movie, and any vintage shop that catches your eye.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "Alma Chocolate",
    category: "Shop",
    neighborhood: "Mississippi",
    description: "Bean-to-bar chocolate made in small batches in the back of the shop. Sarah Hart sources cacao directly from farms and produces chocolates with a clarity of flavor that mass-produced chocolate can't touch. The tasting experience is more akin to wine than candy — origin matters, processing matters, and each bar tells a different story. It's a Portland treasure.",
    signature: "The single-origin dark chocolate bars. Ask for a tasting if it's not busy — Sarah or her team will walk you through the flavor differences between origins.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "Urdaneta",
    category: "Eat",
    neighborhood: "Alberta Arts District",
    description: "A Basque-inspired pintxos bar on Alberta that feels like a sliver of San Sebastian transplanted to Northeast Portland. The counter is lined with small bites on toothpicks, the txakoli pours from height, and the whole experience encourages grazing, drinking, and talking. It's joyful food in a joyful room, and it fills a niche no other Portland restaurant occupies.",
    signature: "Stand at the bar. Order a few pintxos, a pour of txakoli, and the croquetas. Add more as the mood strikes. That's the Basque way.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "Willamette Valley Vineyards Tasting Room",
    category: "Experience",
    neighborhood: "Pearl District",
    description: "Oregon Pinot Noir is world-class, and you don't need to drive an hour to taste it. This Pearl District tasting room brings Willamette Valley wines to the city, with knowledgeable staff who can walk you through the differences between Dundee Hills and Eola-Amity without making you feel like you're back in school. It's a gateway to one of America's greatest wine regions without leaving downtown.",
    signature: "Ask for a vertical tasting of their estate Pinot Noir across vintages. The differences year to year are a masterclass in terroir.",
    action: "Learn More",
    actionType: "learn",
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
      background: "linear-gradient(135deg, #2a3530 0%, #3a4a40 25%, #4a5545 50%, #3a4535 75%, #2a3025 100%)",
    }}>
      {/* Abstract city-light shapes */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(160,200,160,0.12) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "40%", right: "15%", width: 400, height: 250, background: "radial-gradient(ellipse, rgba(180,200,180,0.08) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 350, height: 180, background: "radial-gradient(ellipse, rgba(200,220,200,0.06) 0%, transparent 70%)" }} />
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
          Portland, Oregon
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Portland
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Still keeping it weird. Here's the proof.
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
    { name: "Seattle", tagline: "Rain-soaked, caffeinated, and quietly brilliant." },
    { name: "San Francisco", tagline: "The city that reinvents itself every decade." },
    { name: "Denver", tagline: "A mile high and rising fast." },
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

export default function PortlandCityPage() {
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
      <PageMeta page="city" citySlug="portland" entries={ENTRIES} />
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

      <CityMap entries={ENTRIES} locations={CITY_LOCATIONS} cityName="Portland" />
      <Footer />
    </div>
    </>
  );
}
