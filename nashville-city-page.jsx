import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";
import { subscribeEmail } from "./src/mailchimp.js";
import CityMap from "./src/CityMap.jsx";
import LOCATIONS from "./src/locations.json";

const CITY_PHOTOS = PHOTOS["nashville"] || {};
const CITY_LOCATIONS = LOCATIONS["nashville"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "East Nashville", "Germantown", "12 South", "The Gulch", "Hillsboro Village", "Marathon Village", "Wedgewood-Houston", "Sylvan Park", "Music Row", "Berry Hill"];

const ENTRIES = [
  {
    id: 1,
    name: "Prince's Hot Chicken Shack",
    category: "Eat",
    neighborhood: "East Nashville",
    description: "The place that started it all. Prince's has been serving Nashville hot chicken since the 1940s, and everything else in town is a footnote. The heat levels are real — medium here would be extra-hot anywhere else. The room is no-frills, the wait can be long, and none of that matters once you bite in. This is ground zero.",
    signature: "Order medium your first time. If you think you can handle hot, you're wrong. The white bread and pickles underneath aren't garnish — they're survival tools.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 2,
    name: "Audrey",
    category: "Eat",
    neighborhood: "East Nashville",
    description: "Sean Brock's love letter to Southern Appalachian cooking, served in a converted house with a garden out back that supplies half the menu. This isn't nostalgia food — it's painstaking research into heirloom ingredients and forgotten techniques, plated with a precision that makes every course feel like a thesis defense. The tasting menu is the move.",
    signature: "Reserve the chef's counter if available. The garden tour before dinner is offered quietly — ask for it.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "The Hermitage Hotel",
    category: "Stay",
    neighborhood: "Germantown",
    description: "Nashville's only Beaux-Arts hotel, open since 1910 and still the most elegant room in the city. The lobby ceiling alone is worth a visit — barrel-vaulted stained glass that makes you stand a little straighter. The rooms have been updated without losing the gravitas. The men's restroom downstairs won an award. No, really.",
    signature: "Drinks at the Oak Bar on a weeknight. The bourbon list is a textbook, and the room feels like old Nashville money at its most civilized.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 4,
    name: "Ryman Auditorium",
    category: "Experience",
    neighborhood: "Music Row",
    description: "The Mother Church of Country Music, and the most perfect listening room in America. Built as a tabernacle in 1892, the Ryman's wooden pews and stained glass windows give every show the feeling of a sacred event — because in Nashville, music is sacred. The sound is immaculate at every seat. If you see one show in this city, see it here.",
    signature: "Book a self-guided backstage tour during the day. Stand on the circle of wood where Johnny Cash stood. Then come back for a show that night.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 5,
    name: "Barista Parlor",
    category: "Coffee",
    neighborhood: "East Nashville",
    description: "The Gallatin Avenue flagship occupies a gorgeous old auto shop — soaring ceilings, concrete floors, vintage motorcycles parked between the tables. The coffee program is meticulous without being precious, and the space has this effortless cool that East Nashville does better than anywhere. It's where the neighborhood comes to think, work, and linger.",
    signature: "The cortado is perfectly pulled every time. Grab the long communal table by the garage door when the weather's right.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 6,
    name: "City House",
    category: "Eat",
    neighborhood: "Germantown",
    description: "Tandy Wilson's Germantown mainstay has been quietly running one of the best kitchens in the South for over fifteen years. The food is Italian by way of Tennessee — house-made pastas, wood-fired pizzas, and proteins sourced from farms close enough to visit. The belly ham pizza is legendary. The wine list is deep and smart.",
    signature: "The belly ham pizza with an egg on top. Sit at the bar if you're solo — the bartenders know everything on the menu and most of the farmers by name.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 7,
    name: "Attaboy",
    category: "Drink",
    neighborhood: "East Nashville",
    description: "The Nashville outpost of the legendary New York speakeasy, tucked behind an unmarked door in East Nashville. No menu — you tell the bartender what you like and they build something from scratch. The room is tiny, dark, and electric with conversation. Every drink is a one-off, and every one is flawless.",
    signature: "Tell them your spirit and your mood. Trust the process. If you like bitter and stirred, say so and prepare to be amazed.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 8,
    name: "The Frist Art Museum",
    category: "Experience",
    neighborhood: "The Gulch",
    description: "A stunning Art Deco building — the former main post office — that hosts rotating exhibitions of national and international caliber. The Frist doesn't have a permanent collection, which means every visit is different and every show feels like an event. The Martin ArtQuest Gallery downstairs is genuinely fun for all ages, not just a kids' afterthought.",
    signature: "Check the exhibition calendar before you go. The blockbuster shows sell timed tickets, and weekday mornings are the sweet spot for quiet viewing.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 9,
    name: "Henrietta Red",
    category: "Eat",
    neighborhood: "Germantown",
    description: "A seafood-driven restaurant in Germantown that feels like it was airlifted from coastal Maine and reassembled with Southern grace. The oyster bar is one of the best in the region, the pastas are refined, and the room — all white tile and natural light — is one of the prettiest dining spaces in Nashville. Chef Julia Sullivan cooks with restraint and confidence.",
    signature: "Start at the oyster bar with a half dozen and a glass of Muscadet. The ricotta dumpling is the dish people come back for.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 10,
    name: "Grimey's New & Preloved Music",
    category: "Shop",
    neighborhood: "Berry Hill",
    description: "Nashville's essential record store, now in a sprawling Berry Hill space that feels like a music lover's warehouse. The vinyl selection is deep and obsessively curated, the staff knows more about every genre than most critics, and the in-store performances have hosted everyone from Jack White to Jason Isbell. This is where Nashville's musical soul lives on shelves.",
    signature: "Check the in-store event schedule — free performances happen regularly. The back room's used section is where the real digging happens.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "Martin's Bar-B-Que Joint",
    category: "Eat",
    neighborhood: "Berry Hill",
    description: "Whole-hog barbecue cooked over hickory in a cinderblock pit, the way West Tennessee has done it for generations. Pat Martin brought that tradition to Nashville, and it's a revelation — the shoulder meat pulls apart in your hands, the bark is black and crackling, and the cornbread is made in a cast-iron skillet that probably hasn't been washed since opening day.",
    signature: "The whole hog plate with a side of redneck tacos. The banana pudding is an institution — get it before it runs out.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 12,
    name: "Crema",
    category: "Coffee",
    neighborhood: "The Gulch",
    description: "Nashville's original specialty coffee roaster, still going strong in a bright, airy Gulch space that manages to feel neighborhood-y despite the tourists. The beans are roasted in-house, the espresso program is tight, and the baristas are genuine coffee nerds who'll talk origins with you without a trace of condescension. Serious coffee, zero attitude.",
    signature: "The single-origin pour-over is the way to go. Ask which roast is freshest that day.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 13,
    name: "The Bluebird Cafe",
    category: "Experience",
    neighborhood: "Berry Hill",
    description: "A 90-seat listening room in a strip mall that changed the course of country music. The Bluebird is where songwriters play their own songs in the round, and where careers have been born — Taylor Swift, Garth Brooks, Faith Hill all had defining moments here. It's intimate in a way that makes every show feel like you're eavesdropping on genius.",
    signature: "Book online well in advance for the in-the-round shows. Sunday open mic nights are first-come, but the early-show songwriter rounds are the real draw.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 14,
    name: "Bastion",
    category: "Eat",
    neighborhood: "Wedgewood-Houston",
    description: "A 24-seat restaurant hidden behind a cocktail bar, serving a set multi-course menu that changes constantly. Chef Josh Habiger built this as an antidote to conventional fine dining — no white tablecloths, no formality, just extraordinary food in a room so small you can watch every plate being finished. The intimacy is the point.",
    signature: "Reserve weeks in advance. The cocktail bar up front — The 404 Kitchen's satellite — is excellent if you're waiting or didn't score a table.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 15,
    name: "White's Mercantile",
    category: "Shop",
    neighborhood: "12 South",
    description: "Holly Williams — yes, Hank's granddaughter — built a general store for the modern South. The 12 South flagship stocks everything from hand-poured candles and vintage denim to artisan pantry goods and coffee table books about Nashville. It's beautifully merchandised, deeply personal, and the kind of shop where you buy gifts for everyone including yourself.",
    signature: "The Nashville-made candles and the curated vintage denim rack in the back. Ask about their quarterly artist collaborations.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 16,
    name: "Bolton's Spicy Chicken & Fish",
    category: "Eat",
    neighborhood: "East Nashville",
    description: "Bolton's doesn't get the hype machine that Prince's does, and that's fine — the regulars prefer it that way. The hot chicken here has a cayenne-forward burn that builds slow and lingers. The hot fish is the sleeper — a crispy, fiery catfish filet that's arguably better than the bird. The space is tiny, the sides are simple, and the flavor is enormous.",
    signature: "The hot fish sandwich. It's the reason people who know Nashville argue that Bolton's is the real hot chicken king.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 17,
    name: "Shelby Bottoms Greenway",
    category: "Experience",
    neighborhood: "East Nashville",
    description: "A 960-acre nature area along the Cumberland River, connected by paved and unpaved trails that make you forget you're minutes from downtown. Herons wade in the wetlands, deer graze at dusk, and the pedestrian bridge connecting it to East Nashville is one of the best urban walks in the South. This is Nashville's backyard, and it's spectacularly uncommercial.",
    signature: "Enter from the Shelby Avenue pedestrian bridge at golden hour. Bike the five-mile loop to Lockeland Springs and back.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 18,
    name: "Husk",
    category: "Eat",
    neighborhood: "The Gulch",
    description: "The Nashville outpost of Sean Brock's Southern ingredient manifesto. The rule is simple: if it didn't come from the South, it doesn't come through the door. The result is a menu that reads like a love letter to the region's farmers and producers — cheeseburger at lunch, something transcendent at dinner. The cornbread alone is worth the trip.",
    signature: "Lunch is the insider move — the cheeseburger is famously one of the best in Nashville, and you'll skip the dinner wait.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 19,
    name: "Robert's Western World",
    category: "Experience",
    neighborhood: "Music Row",
    description: "The last real honky-tonk on Lower Broadway. While the rest of the strip has devolved into party barns and rooftop DJ sets, Robert's keeps it pure — live country music, cold beer, a fried bologna sandwich, and boots for sale on the wall. No cover, no gimmick, just the thing Nashville used to be on every block.",
    signature: "Go on a weeknight after 9pm. The house band, Brazilbilly, plays classic country with a rockabilly edge that'll ruin you for every other Broadway bar.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Frothy Monkey",
    category: "Coffee",
    neighborhood: "12 South",
    description: "The 12 South original has the best patio on the strip — a long, shaded sidewalk situation that's basically the neighborhood's living room. The coffee is consistently good, the food menu goes well beyond pastries into legitimate breakfast and lunch territory, and the vibe is relaxed in a way that only a place that's been here since before 12 South was cool can pull off.",
    signature: "Morning latte on the patio, watching 12 South wake up. The breakfast sandwich with pimento cheese is a Nashville original.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "The Patterson House",
    category: "Drink",
    neighborhood: "Hillsboro Village",
    description: "Nashville's original craft cocktail bar, and still one of the best rooms for a serious drink. The house rules are posted at the door — no standing, no loud talking, no Bachelorette parties. The cocktails are precise, seasonal, and built with the kind of care that makes you put your phone away and just taste. Dim lighting, leather banquettes, zero pretension despite the rules.",
    signature: "The bartender's choice is always the right call. Tell them your base spirit and let them work. The Improved Whiskey Cocktail is a house classic.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 22,
    name: "Parnassus Books",
    category: "Shop",
    neighborhood: "Berry Hill",
    description: "Co-owned by novelist Ann Patchett, Parnassus is the independent bookstore Nashville deserves. The selection is fiercely curated — heavy on literary fiction, Southern writers, and the kind of staff picks that actually make you buy the book. It's small, warm, and run by people who believe a good bookstore is a public utility.",
    signature: "Ask the staff what's new and local. The signed first editions shelf is always worth checking.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 23,
    name: "Mas Tacos Por Favor",
    category: "Eat",
    neighborhood: "East Nashville",
    description: "A tiny, cash-only taco shop in East Nashville that started as a food truck and graduated to a walk-up window with a few picnic tables. The fried chicken tacos are transcendent — crispy, tangy, with a slaw that ties everything together. The elote is perfect. The tortilla soup on a cold day is medicine. Nothing costs more than a few dollars, and everything tastes like it was made for you personally.",
    signature: "The fried chicken taco and a cup of the tortilla soup, regardless of the weather. Cash only — there's an ATM next door.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 24,
    name: "Country Music Hall of Fame",
    category: "Experience",
    neighborhood: "The Gulch",
    description: "Skip it if you want, but you'd be wrong. The permanent collection traces country music from its Appalachian roots through the Outlaw movement to today, and the depth of the archive is staggering — handwritten lyrics, rhinestone suits, instruments that changed the sound of American music. The rotating exhibitions are consistently museum-quality, not tourist-grade.",
    signature: "The RCA Studio B tour is an add-on that's absolutely worth it. You'll stand where Elvis and Dolly recorded, and the guide will play you the original tracks in the room.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 25,
    name: "Folk",
    category: "Eat",
    neighborhood: "East Nashville",
    description: "A small, elegant restaurant doing progressive Southern food with Asian and global influences. Chef Philip Krajeck works with local farms and lets the season dictate the menu entirely — what's on the plate Tuesday might be gone by Friday. The tasting menu format keeps things tight and surprising. One of the quieter, more serious kitchens in town.",
    signature: "The tasting menu is the way to experience this kitchen. Let them pair wines — the sommelier has a knack for unexpected matches.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 26,
    name: "Pinewood Social",
    category: "Drink",
    neighborhood: "The Gulch",
    description: "Part coffee shop, part cocktail bar, part bowling alley, part pool — Pinewood Social is Nashville's ultimate all-day hangout. The space is a converted trolley barn with soaring ceilings and a warmth that comes from being perpetually full of people having a good time. The cocktails are solid, the brunch is strong, and the outdoor pool in summer is an actual scene.",
    signature: "Bowl a few frames with a cocktail in hand after dinner. The six-lane alley in the back is first-come, first-served and worth the wait.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 27,
    name: "Cheekwood Estate & Gardens",
    category: "Experience",
    neighborhood: "Sylvan Park",
    description: "A 55-acre botanical garden and art museum built on the grounds of a 1930s Georgian mansion. The gardens are gorgeous year-round — the spring tulip display is Nashville's version of cherry blossom season. The mansion houses a small but strong American art collection, and the sculpture trail through the woods is meditative in a way the city rarely offers.",
    signature: "Visit during Cheekwood in Bloom in spring or the holiday light installation in December. Weekday mornings are peaceful and nearly empty.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 28,
    name: "Eighth & Roast",
    category: "Coffee",
    neighborhood: "Berry Hill",
    description: "A no-nonsense roaster-cafe in Berry Hill with some of the most consistent espresso in Nashville. The space is modern and unfussy — concrete, wood, good light — and the baristas pull shots with quiet precision. They roast their own beans on-site, and you can taste the difference. This is where Nashville's coffee people come on their days off.",
    signature: "The house espresso as a macchiato. Simple, perfect, and proof that great coffee doesn't need to be complicated.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "The 5 Spot",
    category: "Experience",
    neighborhood: "East Nashville",
    description: "East Nashville's neighborhood bar and live music venue, with a calendar that swings wildly between motown dance nights, indie rock shows, and honky-tonk throwbacks. The room is divey in the best way — cheap drinks, sticky floors, and a dance floor that gets packed by 10pm. Monday's Motown night is a Nashville institution that no one who's been to will ever skip again.",
    signature: "Monday Night Motown. Get there by 9 or you won't get in. Wear shoes you can dance in.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 30,
    name: "Loveless Cafe",
    category: "Eat",
    neighborhood: "Sylvan Park",
    description: "Twenty minutes from downtown, at the head of the Natchez Trace Parkway, sits a 1951 roadside motel turned breakfast institution. The biscuits are the reason you drive — hand-made, fluffy, served with house-made preserves that they also sell in jars because people beg for them. The fried chicken and country ham are old-school and unapologetic. Nashville starts here.",
    signature: "The biscuits with homemade peach preserves. Get there early on weekends — the wait can stretch past an hour, and it's worth every minute.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 31,
    name: "Corsair Distillery",
    category: "Drink",
    neighborhood: "Marathon Village",
    description: "A craft distillery in Marathon Village making some of the most inventive spirits in the country. Triple smoke whiskey, quinoa whiskey, hopped whiskey — Corsair treats distilling the way a punk band treats songwriting, with just enough irreverence to be brilliant. The taproom is relaxed, the tours are genuine, and the flights are a masterclass in thinking differently about whiskey.",
    signature: "The tasting flight of experimental whiskeys. The triple smoke is the flagship, but the rotating experimental releases are where the magic is.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 32,
    name: "Two Ten Jack",
    category: "Eat",
    neighborhood: "East Nashville",
    description: "A Japanese izakaya in East Nashville that's dark, moody, and completely transportive. The ramen is excellent — rich tonkotsu broth that simmers for hours — but the small plates are where the kitchen shines. Yakitori skewers over binchotan charcoal, okonomiyaki, and a sake list that rewards exploration. It's the restaurant East Nashville didn't know it needed.",
    signature: "Sit at the bar overlooking the open kitchen. Order the chicken yakitori and the tonkotsu ramen. Finish with a cold sake.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 33,
    name: "Imogene + Willie",
    category: "Shop",
    neighborhood: "12 South",
    description: "A custom denim shop in a converted gas station on 12 South that became one of Nashville's most iconic brands. The jeans are cut and sewn in-house, and the fit is impeccable — they'll tailor a pair to your exact measurements. The shop also carries a curated selection of leather goods, boots, and basics that share the same philosophy: buy less, buy better.",
    signature: "Get a pair of custom jeans. It takes a few minutes for the fitting, a few weeks for delivery, and they'll last you a decade.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 34,
    name: "The Station Inn",
    category: "Experience",
    neighborhood: "The Gulch",
    description: "The world's greatest bluegrass venue, tucked into a cinderblock building near the Gulch that looks like nothing from the outside. Inside, it's 200 seats of pure acoustic music — the best pickers in Nashville rotate through nightly, and the Sunday night showcase is where you'll hear musicians who could headline anywhere choosing to play here because the room is that good.",
    signature: "Sunday night bluegrass jam. Arrive early, grab a seat near the stage, and prepare to have your definition of virtuosity recalibrated.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 35,
    name: "Urban Grub",
    category: "Eat",
    neighborhood: "12 South",
    description: "A Southern seafood and smokehouse that doesn't fit neatly into any box, and that's the point. The raw bar is excellent, the smoked meats are legit, and the brunch situation — complete with a Bloody Mary bar — is one of the best on 12 South. The space is big and warm, with a patio that fills up fast for good reason.",
    signature: "The smoked trout dip to start, then the shrimp and grits. The Bloody Mary bar at brunch is build-your-own and dangerously fun.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 36,
    name: "Draper James",
    category: "Shop",
    neighborhood: "12 South",
    description: "Reese Witherspoon's ode to Southern style, housed in a beautiful blue-and-white storefront on 12 South. The clothes and accessories are feminine, preppy, and unapologetically Southern — think the woman who brings deviled eggs to the party and also runs the meeting. Whether or not it's your personal style, the shop itself is worth a browse for the interiors alone.",
    signature: "The tote bags and small accessories make excellent gifts. The seasonal dresses are the real draw if you're shopping for yourself.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Lyra",
    category: "Eat",
    neighborhood: "The Gulch",
    description: "A Middle Eastern restaurant from the Husk team that brings the same obsessive sourcing and technique to a completely different cuisine. The hummus is silky, the lamb kebabs are smoky and tender, and the pita comes puffy and warm from a wood-fired oven. The dining room is dramatic — soaring ceilings, an open hearth — and the energy matches.",
    signature: "The mixed grill platter and the whipped feta with honey. Sit where you can see the wood-fired oven — the pita show alone is worth the visit.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 38,
    name: "Percy Warner Park",
    category: "Experience",
    neighborhood: "Sylvan Park",
    description: "Over 2,600 acres of old-growth forest and rolling hills just southwest of downtown. The trails range from gentle strolls to serious hill climbs, and the deep woods section feels like Appalachian backcountry despite being twenty minutes from Broadway. The stone steps trail is iconic — a WPA-era stone staircase carved into the hillside that rewards you with sweeping valley views.",
    signature: "The stone steps trail from the main entrance. It's a workout, but the view from the top is the best in Davidson County.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 39,
    name: "Steadfast Coffee",
    category: "Coffee",
    neighborhood: "The Gulch",
    description: "Tucked inside the ground floor of a Gulch building, Steadfast is small and serious about coffee. They roast their own beans, the espresso is dialed tight, and the space is minimal in a way that puts all the focus on what's in the cup. No gimmicks, no sprawling food menu — just excellent coffee made by people who clearly think about it all day.",
    signature: "The house drip is always solid, but the single-origin espresso is the reason to come. Ask what's on the hopper today.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 40,
    name: "The Listening Room Cafe",
    category: "Experience",
    neighborhood: "The Gulch",
    description: "A purpose-built listening room where Nashville's songwriters play their own material in an intimate, respectful setting. Unlike the Broadway honky-tonks, the audience here actually listens. The format is usually three or four writers trading songs in the round, telling the stories behind each one. You'll hear future hits being road-tested before they belong to anyone famous.",
    signature: "The songwriters in the round format. Book a table, order dinner, and let someone play you a song they wrote in their kitchen last week.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 41,
    name: "Dino's",
    category: "Drink",
    neighborhood: "East Nashville",
    description: "A dive bar that serves some of the best burgers in Nashville — that sentence tells you everything you need to know about East Nashville. Dino's is dark, loud, and perpetually crowded with people who appreciate a double cheeseburger on a paper plate with their Tecate. The jukebox is solid, the patios are scruffy, and the whole place feels like a secret everybody knows.",
    signature: "The double cheeseburger, smashed and greasy, with a cold Tecate. Don't ask for modifications. Just trust it.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 42,
    name: "The 506 Lofts",
    category: "Stay",
    neighborhood: "East Nashville",
    description: "A boutique guesthouse in the heart of East Nashville with just a handful of beautifully designed loft-style suites. Each unit has its own kitchen, curated vintage furniture, and the kind of local art on the walls that you'll want to buy. It feels less like a hotel and more like borrowing a very cool apartment from someone with impeccable taste. Walking distance to everything on the east side.",
    signature: "Book the upstairs loft with the private rooftop deck. Morning coffee up there with the East Nashville skyline is hard to beat.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 43,
    name: "The 404 Kitchen",
    category: "Eat",
    neighborhood: "The Gulch",
    description: "Matt Bolus cooks refined Southern food in a sleek Gulch space that manages to feel both special-occasion and neighborhood regular. The menu moves with the seasons, the charcuterie program is house-made and excellent, and the burger — ground from dry-aged trim — is the best fine-dining burger in the city. The wine and cocktail programs are equally thoughtful.",
    signature: "The 404 burger at lunch. It's ground from dry-aged beef trim and served on a brioche bun that barely holds together. That's how you know it's right.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 44,
    name: "Old Glory",
    category: "Drink",
    neighborhood: "Germantown",
    description: "A cocktail bar in Germantown built around a massive copper still and an obsession with doing things from scratch. They make their own bitters, tinctures, and syrups, and the results are cocktails with a depth that's hard to replicate at home. The space is industrial-chic, the bartenders are encyclopedic, and the vibe is that perfect balance between serious and fun.",
    signature: "The seasonal menu rotates quarterly, but anything stirred and whiskey-based is a safe bet. The smoked cocktails are a house specialty.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 45,
    name: "The Parthenon",
    category: "Experience",
    neighborhood: "Hillsboro Village",
    description: "A full-scale replica of the Athenian Parthenon, sitting in the middle of a Nashville park because this city calls itself the Athens of the South and means it. Inside stands a 42-foot gilded statue of Athena — the largest indoor sculpture in the Western world. It's weird, wonderful, and entirely Nashville — a city that builds temples to culture in public parks.",
    signature: "Go inside and stand beneath Athena. The scale is genuinely awe-inspiring. The surrounding Centennial Park is perfect for a post-visit walk.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "Noelle Nashville",
    category: "Stay",
    neighborhood: "Music Row",
    description: "A boutique hotel in a restored 1930 Printers Alley building that manages to feel both luxurious and lived-in. The rooms are thoughtfully designed — warm textures, local art, excellent beds — and the ground floor houses a coffee shop, a cocktail bar, a restaurant, and a library bar that's one of the coziest rooms in the city. It's a hotel that understands Nashville.",
    signature: "Drinks at the rooftop bar, Rare Bird. The view of the downtown skyline at sunset is the best you'll get without a drone.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 47,
    name: "Nashville Farmers' Market",
    category: "Shop",
    neighborhood: "Germantown",
    description: "An open-air market near the state capitol with local farmers, artisans, and a food hall that punches well above typical market weight. The produce is Tennessee-grown, the vendors are the actual growers, and the international food stalls in the Market House — Jamaican, Kurdish, Mexican — are some of the most honest cooking in the city. Come hungry.",
    signature: "Saturday morning for the full farmer experience. The Market House food stalls for lunch — the Jamaican spot is outstanding.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "Rosemary & Beauty Queen",
    category: "Drink",
    neighborhood: "Germantown",
    description: "A cozy Germantown wine and cocktail bar with a menu that rotates seasonally and a staff that genuinely cares whether you're enjoying yourself. The space is small and candlelit, the wine list leans natural and interesting, and the food menu — while short — hits every note. It's the kind of place that becomes your regular within two visits.",
    signature: "Sit at the bar and ask for a wine recommendation. They'll pour you something unexpected and exactly right.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "Urban Cowboy Nashville",
    category: "Stay",
    neighborhood: "East Nashville",
    description: "A Victorian mansion in East Nashville converted into a boutique hotel that feels like crashing at the home of your most stylish friend. Each room is individually designed with vintage furniture and original art. The communal spaces — a wraparound porch, a garden with a fire pit, a sauna — encourage the kind of lingering that hotels usually discourage. This is East Nashville in architectural form.",
    signature: "Book a room in the main house, not the annex. Morning coffee on the wraparound porch is the closest Nashville gets to a Southern novel.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 50,
    name: "Third Man Records",
    category: "Shop",
    neighborhood: "Marathon Village",
    description: "Jack White's record label, pressing plant, and storefront — all in one building in Marathon Village. The store sells Third Man releases on vinyl, the novelty recording booth lets you cut your own record, and the live venue in back hosts intimate shows that sell out in minutes. It's part museum, part shop, part love letter to the physical medium of music. Nashville doesn't get more Nashville than this.",
    signature: "Cut a record in the vintage 1947 Voice-o-Graph booth. Six bucks for a one-of-a-kind 6-inch vinyl. It's the best souvenir in the city.",
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
          Nashville, Tennessee
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Nashville
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Past the neon. Here's where the locals actually go.
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

// ─── Footer ──────────────────────────────────────────────────────────────────

const Footer = () => {
  const cities = [
    { name: "New York", tagline: "You already know. But not like this." },
    { name: "Austin", tagline: "Still weird. Still worth it." },
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

export default function NashvilleCityPage() {
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

      <CityMap entries={ENTRIES} locations={CITY_LOCATIONS} cityName="Nashville" />
      <Footer />
    </div>
  );
}
