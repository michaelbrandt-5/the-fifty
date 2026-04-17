import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PHOTOS from "./src/photos.json";
import { subscribeEmail } from "./src/mailchimp.js";

const CITY_PHOTOS = PHOTOS["miami"] || {};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];
const NEIGHBORHOODS = ["All Neighborhoods", "Wynwood", "Little Havana", "Design District", "Coconut Grove", "Coral Gables", "South Beach", "Downtown", "Little Haiti", "Upper East Side"];

const ENTRIES = [
  {
    id: 1,
    name: "Joe's Stone Crab",
    category: "Eat",
    neighborhood: "South Beach",
    description: "Open since 1913 and still the most essential meal in Miami. The stone crabs arrive cracked, chilled, and served with Joe's legendary mustard sauce that no one has successfully replicated in over a century. The line is absurd and reservations are only for dinner, but that's because everyone in this city knows: this is the real thing.",
    signature: "Go for lunch without a reservation. The wait moves fast. Order the medium claws — better meat-to-shell ratio than the jumbos.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 2,
    name: "Ariete",
    category: "Eat",
    neighborhood: "Coconut Grove",
    description: "Chef Michael Beltran cooks the food of his Cuban-American childhood through a fine-dining lens, and every plate feels like a love letter to the city. The croqueta prep is a masterclass. The oxtail with bone marrow is obscenely good. Coconut Grove needed a restaurant this serious, and Ariete delivered.",
    signature: "The croqueta prep — a tasting of three styles of croqueta — is the most Miami dish in Miami. Start there, always.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 3,
    name: "The Surf Club Restaurant by Thomas Keller",
    category: "Eat",
    neighborhood: "South Beach",
    description: "Thomas Keller took over the dining room of a 1930s members-only beach club in Surfside, and the result is transportive. The room is all terrazzo floors, arched windows, and ocean light. The food is classic American-French — roast chicken, Dover sole, pristine salads — executed with the precision you'd expect from the man behind The French Laundry.",
    signature: "Request a table in the original ballroom, not the terrace. Order the roast chicken for two — carved tableside.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 4,
    name: "Versailles",
    category: "Eat",
    neighborhood: "Little Havana",
    description: "The cathedral of Cuban-American cuisine. Versailles has been the political, social, and culinary heart of Miami's exile community since 1971. The food is comfort in its purest form — ropa vieja, vaca frita, platanos maduros — and the ventanita window for cafecito is a daily ritual for half the city. Skip the trendy spots. This is Miami's soul on a plate.",
    signature: "Order a cafecito at the ventanita and a medianoche sandwich. Eat standing up. That's how it's done.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 5,
    name: "Mandolin Aegean Bistro",
    category: "Eat",
    neighborhood: "Design District",
    description: "A Greek-Turkish restaurant set in a 1940s bungalow with a courtyard that feels like the Aegean Islands decided to relocate to Miami. The mezze spread is the move — hummus, grilled octopus, lamb chops, pita that arrives puffy and warm. The light filters through the trees and for a moment you forget you're five minutes from a Balenciaga store.",
    signature: "Sit in the garden. Order the mixed mezze for two and add the grilled branzino. Lunch is better than dinner here.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 6,
    name: "Boia De",
    category: "Eat",
    neighborhood: "Upper East Side",
    description: "A tiny, no-reservations restaurant in a strip mall that became the most talked-about opening in Miami. Chefs Luciana Giangrandi and Alex Meyer cook Italian-influenced food with a punk-rock energy — handmade pasta, wood-fired duck, a burrata that makes you reconsider every burrata you've had before. The wait is brutal. The food justifies all of it.",
    signature: "Put your name in early and walk the neighborhood. The duck with crispy skin and the cacio e pepe are non-negotiable.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 7,
    name: "Enriqueta's Sandwich Shop",
    category: "Eat",
    neighborhood: "Wynwood",
    description: "A cash-only Cuban lunch counter that's been feeding Wynwood since before the murals arrived. The breakfast is enormous, the cafe con leche is industrial-strength, and the crowd is construction workers, gallery owners, and everyone in between. No pretense, no Instagram wall, just honest food at honest prices in a neighborhood that desperately needs both.",
    signature: "The pan con bistec with a cortadito. Arrive before 9am on weekdays to beat the rush.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 8,
    name: "KYU",
    category: "Eat",
    neighborhood: "Wynwood",
    description: "A wood-fired Asian restaurant in Wynwood that turned heads from day one and never let up. The roasted cauliflower with shishito and goat cheese became a citywide obsession — the kind of dish people order at every table. The short rib is smoked for twelve hours and falls apart at the suggestion of a fork. Come hungry.",
    signature: "The roasted cauliflower and the Korean fried chicken. Don't skip the coconut sticky rice dessert — it's a sleeper.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 9,
    name: "Los Fuegos by Francis Mallmann",
    category: "Eat",
    neighborhood: "South Beach",
    description: "Francis Mallmann's wood-fire temple inside the Faena Hotel. Everything is cooked over open flames — whole fish, rib-eye, vegetables charred to perfection. The dining room opens onto the ocean and the primal drama of the kitchen is part of the show. This isn't a quiet dinner. It's a performance, and the food is the star.",
    signature: "The whole-roasted fish for the table. Ask for it with chimichurri. Sit outside if the weather cooperates.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 10,
    name: "Zak the Baker",
    category: "Eat",
    neighborhood: "Wynwood",
    description: "Zak Stern bakes sourdough that would hold its own in San Francisco and pastries that draw lines down the block every weekend. The bakery-cafe is bright, the sandwiches are built on house bread that makes the fillings almost secondary, and the chocolate babka has ruined all other babkas for everyone who's tried it.",
    signature: "The everything croissant and a cortado. Saturday mornings are chaotic but worth it for the full pastry selection.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 11,
    name: "Beaker & Gray",
    category: "Eat",
    neighborhood: "Wynwood",
    description: "Brian Nasajon's Wynwood gastropub has been an anchor of the neighborhood since 2015 — which in Miami years is basically forever. The menu bounces between Latin, Asian, and American influences with a coherence most fusion kitchens can't pull off, and the bar program is one of the city's most ambitious. The kind of place you come for drinks and stay until the kitchen closes.",
    signature: "Start with the bao buns and let the bartender build you something off-menu. The late-night happy hour is one of Miami's best-kept secrets.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 12,
    name: "Casablanca Seafood Bar",
    category: "Eat",
    neighborhood: "Upper East Side",
    description: "A no-frills seafood spot on the Miami River where the fish is so fresh it might have been swimming that morning. The setting is pure Old Miami — plastic chairs, paper plates, boats pulling up to the dock. The whole fried snapper is the order, and eating it while watching freighters glide past is one of the most honest dining experiences in the city.",
    signature: "The whole fried yellowtail snapper with tostones. Grab a table on the river deck at sunset.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 13,
    name: "Cvi.che 105",
    category: "Eat",
    neighborhood: "Downtown",
    description: "Juan Chipoco's Peruvian restaurant downtown serves ceviche that rivals anything in Lima. The leche de tigre is bright and electric, the lomo saltado is perfectly wok-charred, and the pisco sours flow like water. It's loud, it's packed, and it's the kind of place where everyone at the table orders something different and shares everything.",
    signature: "Start with the ceviche clasico and a pisco sour. The aji de gallina is the sleeper pick on the menu.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 14,
    name: "Stubborn Seed",
    category: "Eat",
    neighborhood: "South Beach",
    description: "Jeremy Ford's South Beach restaurant is what happens when a Top Chef winner decides to stop playing it safe. The tasting menu is constantly evolving, technically demanding, and genuinely surprising — you'll eat things here you've never encountered before and spend the next week thinking about them. The a la carte is strong, but the tasting is the real show.",
    signature: "Commit to the tasting menu. The foie gras course, whatever form it takes this season, is always the standout.",
    action: "Reserve",
    actionType: "reserve",
    image: null,
  },
  {
    id: 15,
    name: "Jaguar Sun",
    category: "Eat",
    neighborhood: "Downtown",
    description: "A slender bar-restaurant downtown that feels like it belongs in a Hemingway novel set in the tropics. The pasta is handmade daily and rivals anything in the Design District at a fraction of the price. The amaro collection is deep, the lighting is perpetually golden hour, and the whole place hums with the energy of people who know they've found somewhere special.",
    signature: "The hand-torn pasta special, whatever it is today. Follow it with an amaro nightcap chosen by the bartender.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 16,
    name: "Sweet Liberty",
    category: "Drink",
    neighborhood: "South Beach",
    description: "The best cocktail bar on the beach, and it's not particularly close. John Lermayer built a bar that's serious about its craft without being remotely pretentious — the drinks are perfectly balanced, the crowd is mixed, and the energy is pure South Beach without the bottle-service nonsense. It's won every award that matters and still feels like your neighborhood spot.",
    signature: "The Miami Vice — half pina colada, half strawberry daiquiri, all frozen, zero irony. Trust the process.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 17,
    name: "Bar Lab at Broken Shaker",
    category: "Drink",
    neighborhood: "South Beach",
    description: "Hidden in the courtyard of a hostel on Indian Creek, Broken Shaker launched the cocktail careers of two of America's best bartenders. The space is lush, tropical, and a little ramshackle in the best way. Cocktails are inventive and seasonal — think charred pineapple, coconut fat-washing, things you won't find anywhere else. It's where Miami's bar industry comes to drink after their shifts.",
    signature: "Sit in the back garden by the pool. Order whatever seasonal special is on the board — that's where the creativity lives.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 18,
    name: "Cafe La Trova",
    category: "Drink",
    neighborhood: "Little Havana",
    description: "Julio Cabrera — one of the world's great bartenders — built a cantina on Calle Ocho that channels 1950s Havana with live music, mojitos made the old way, and a daiquiri program that will ruin you for lesser versions. The dining room serves serious Cuban food, but the real magic happens at the bar, where the cantineros perform with the showmanship of a lost era.",
    signature: "Sit at the bar and order a daiquiri. The classic, no fruit, no blender. Watch them make it. That's the show.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 19,
    name: "The Anderson",
    category: "Drink",
    neighborhood: "Upper East Side",
    description: "A neighborhood bar in the Upper East Side that combines a proper cocktail program with a dive-bar sensibility. There's a hidden speakeasy in the back called The Upstairs, which is accessed through a payphone. The duality is the point — PBR tallboys in the front room, barrel-aged Negronis in the back. Miami contains multitudes.",
    signature: "Start in the front room. When the bartender trusts you, ask about The Upstairs. The payphone is the key.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 20,
    name: "Margot Natural Wine",
    category: "Drink",
    neighborhood: "Wynwood",
    description: "A tiny natural wine bar in Wynwood that feels like it was transplanted from a Parisian side street. The list is thoughtful, rotating, and refreshingly unpretentious. The snacks are perfect — tinned fish, good bread, a few composed plates that punch above their weight. It's the antidote to everything loud and bottle-service about Miami nightlife.",
    signature: "Ask the sommelier for a glass of something funky and orange. Pair it with whatever tinned fish special they're running.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 21,
    name: "Esotico Miami",
    category: "Drink",
    neighborhood: "Downtown",
    description: "A tiki bar downtown that takes Polynesian cocktail culture deadly seriously. The rum list is encyclopedic, the cocktails are layered and complex, and the bamboo-and-rattan room transports you somewhere far from Biscayne Boulevard. It's kitschy in the best tradition — every detail considered, every drink built with precision disguised as fun.",
    signature: "The Zombie. It's the benchmark drink here and it's made with five different rums. One is enough.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 22,
    name: "Mayami",
    category: "Drink",
    neighborhood: "Wynwood",
    description: "A Japanese-influenced cocktail bar in Wynwood where every drink feels like a small sculpture. The bartenders use Japanese technique — clear ice, precise pours, obsessive attention to dilution — in a room that's dark, quiet, and deliberate. It's the opposite of a Wynwood party bar, which is exactly why it works.",
    signature: "The highball. Japanese whisky, soda, clear ice, perfect proportions. Simple things done right.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 23,
    name: "Gramps",
    category: "Drink",
    neighborhood: "Wynwood",
    description: "The dive bar that anchors Wynwood's creative class. Gramps has a backyard with a projector screen, a pizza window from the restaurant next door, rotating local DJs, and the kind of unpretentious energy that made Wynwood interesting in the first place. It's cheap, it's weird, and it's where the neighborhood actually hangs out after the galleries close.",
    signature: "Grab a beer and head to the back patio. Check the calendar — the themed movie nights and drag shows are legendary.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 24,
    name: "Panther Coffee",
    category: "Coffee",
    neighborhood: "Wynwood",
    description: "Miami's original third-wave roaster and still the standard-bearer. Panther roasts its own beans, pulls shots with conviction, and operates out of a Wynwood warehouse that predates the neighborhood's gallery explosion. The pour-over is patient and precise, the cold brew is dangerously smooth, and the crowd is a cross-section of everyone who makes this neighborhood tick.",
    signature: "The single-origin pour-over, brewed slow. Ask what just came in from their latest sourcing trip.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 25,
    name: "All Day",
    category: "Coffee",
    neighborhood: "Design District",
    description: "A coffee shop and eatery in the Design District that lives up to its name — morning espresso, midday lunch, late-afternoon pastry. The space is airy and white-walled with just enough design-world edge to fit the neighborhood. The coffee program sources from top roasters and the rotating food menu is several notches above typical cafe fare.",
    signature: "The oat milk latte and the avocado toast with chili oil. Basic on paper, perfect in execution.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 26,
    name: "Vice City Bean",
    category: "Coffee",
    neighborhood: "Little Haiti",
    description: "A community-focused roaster in Little Haiti that's quietly become one of the best cups in the city. The beans are sourced with care, roasted in-house, and the baristas know their craft. The space doubles as a neighborhood gathering point — art on the walls, a backyard for events, and the sense that this place exists for the people who live here, not just the ones passing through.",
    signature: "Try their Haitian coffee when it's available — a direct tribute to the neighborhood. Ask for it as a pour-over.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 27,
    name: "Threefold Cafe",
    category: "Coffee",
    neighborhood: "Coral Gables",
    description: "An Australian-style cafe in Coral Gables that brought the flat white to Miami before it was a Starbucks menu item. The coffee is sourced from top roasters, the food menu is brunch-caliber all day, and the vibe is relaxed in a way that Coral Gables doesn't always manage. Sit on the patio, order something with avocado, and pretend you're in Melbourne.",
    signature: "The flat white, obviously. Pair it with the smashed avocado toast with feta and chili flakes.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 28,
    name: "Bebito's Cafe",
    category: "Coffee",
    neighborhood: "Little Havana",
    description: "A ventanita-style coffee window in Little Havana where the cafecito is brewed thick, sweet, and with the kind of practiced hand that only comes from decades of repetition. This isn't specialty coffee — it's Cuban coffee, which is its own tradition and its own art form. Two dollars gets you a shot of espuma-topped cortadito that will rewire your entire afternoon.",
    signature: "A colada to share. They'll give you the little plastic cups. Pass them around like a local.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 29,
    name: "The Faena Hotel",
    category: "Stay",
    neighborhood: "South Beach",
    description: "Alan Faena and Baz Luhrmann designed a hotel that feels like a fever dream in the best possible way. Gold columns, a Damien Hirst mammoth in the lobby, a theater that hosts actual performances. The rooms are maximalist and cinematic, the pool is a scene, and the whole property operates on the principle that more is more. This is Miami at its most audacious.",
    signature: "Book an oceanfront room and have breakfast at the pool. Catch whatever's on at the Faena Theater — it's always unexpected.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 30,
    name: "The Setai",
    category: "Stay",
    neighborhood: "South Beach",
    description: "An Asian-influenced luxury hotel that's the antidote to South Beach maximalism. Three infinity pools descend toward the ocean, the spa draws from Eastern traditions, and the rooms are done in dark wood and warm stone. It's quiet, immaculate, and deliberate — the kind of place where the staff remembers your name by the second morning.",
    signature: "Request a high-floor ocean suite. Use all three pools — each one is a different temperature. The top pool at sunset is the move.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 31,
    name: "Life House, Little Havana",
    category: "Stay",
    neighborhood: "Little Havana",
    description: "A boutique hotel that planted itself in the heart of Little Havana and actually respects the neighborhood. The design is warm and local-inflected — terrazzo, tropical plants, vintage furniture — and the price point makes it accessible in a way that most Miami boutique hotels are not. Walking distance to Calle Ocho, Domino Park, and the best ventanitas in the city.",
    signature: "Book the courtyard room if you can. Walk to Versailles for breakfast and Ball & Chain for a nightcap.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 32,
    name: "The Standard Spa",
    category: "Stay",
    neighborhood: "South Beach",
    description: "On Belle Isle, between Miami Beach and the mainland, The Standard occupies a mid-century motel that's been transformed into a spa hotel with a sense of humor. The hydrotherapy pool is the centerpiece — hot tub, cold plunge, hamam, all overlooking Biscayne Bay. It's the rare Miami hotel that encourages you to slow down, and it's better for it.",
    signature: "Spend a half day at the spa. The Biscayne Bay pool at golden hour, with a drink from the bar, is pure bliss.",
    action: "Book",
    actionType: "book",
    image: null,
  },
  {
    id: 33,
    name: "Vizcaya Museum and Gardens",
    category: "Experience",
    neighborhood: "Coconut Grove",
    description: "An Italian Renaissance villa built on Biscayne Bay in 1916 by an industrialist who wanted to live inside a European fantasy. The result is 43 acres of formal gardens, grottoes, and a house filled with art and furniture spanning four centuries. It's surreal, it's gorgeous, and it's the single best argument that Miami has been culturally ambitious for longer than anyone thinks.",
    signature: "Go in the morning before the tour buses. The view from the south terrace over the bay is the best photo in Miami.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 34,
    name: "Wynwood Walls",
    category: "Experience",
    neighborhood: "Wynwood",
    description: "The outdoor museum that turned a warehouse district into a global art destination. The murals are curated and rotate with fresh commissions, featuring heavy hitters like Shepard Fairey and Os Gemeos alongside emerging artists. Yes, it's on every tourist list. It earned its place there. The art is genuinely world-class, and the surrounding streets have spawned an entire neighborhood of galleries.",
    signature: "Go on a weekday morning for photos without the crowds. Then walk the surrounding blocks — the best murals are outside the walls.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 35,
    name: "Perez Art Museum Miami (PAMM)",
    category: "Experience",
    neighborhood: "Downtown",
    description: "Herzog & de Meuron designed this waterfront museum and it shows — the building itself is a work of art, with hanging gardens, a stilt-supported canopy, and views of Biscayne Bay that compete with the collection inside. The permanent collection focuses on 20th and 21st-century international art, and the temporary exhibitions are consistently ambitious.",
    signature: "Start on the terrace for the bay view, then work your way inside. The museum store is genuinely excellent.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 36,
    name: "Everglades National Park",
    category: "Experience",
    neighborhood: "Coral Gables",
    description: "A 1.5-million-acre subtropical wilderness at the edge of the city. This is one of the most unique ecosystems on Earth — sawgrass prairies, mangrove tunnels, alligators floating like logs, and a silence that makes Miami feel like a distant memory. The Shark Valley bike trail and the Anhinga Trail are the best entry points for a half-day visit.",
    signature: "Rent a bike at Shark Valley and ride the 15-mile loop. The observation tower at the halfway point is worth every pedal stroke.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 37,
    name: "Ball & Chain",
    category: "Experience",
    neighborhood: "Little Havana",
    description: "A Calle Ocho institution that first opened in 1935, closed, and was reborn as a live-music venue and bar that honors the building's jazz and Latin roots. The pineapple-shaped back bar is an architectural wonder, the live salsa bands play most nights, and the crowd is a genuine mix of locals and visitors who came for the music, not the scene.",
    signature: "Thursday through Saturday nights for live salsa. If you can dance, dance. If you can't, nobody cares — everyone's moving.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 38,
    name: "Bill Baggs Cape Florida State Park",
    category: "Experience",
    neighborhood: "Coral Gables",
    description: "At the southern tip of Key Biscayne, a state park with a lighthouse, an undeveloped beach, and some of the clearest water you'll find in mainland Florida. The beach is consistently rated among the best in the country, and it's blissfully uncrowded compared to South Beach. The lighthouse dates to 1825 and the climb to the top offers views that stretch to the horizon.",
    signature: "Rent bikes and ride to the lighthouse. The beach on the west side is the quiet one — that's where the locals lay out.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 39,
    name: "Institute of Contemporary Art (ICA) Miami",
    category: "Experience",
    neighborhood: "Design District",
    description: "A free contemporary art museum in the Design District that punches miles above its weight. The Aranguren + Gallegos-designed building is beautiful, the collection includes major works from the Rubell family's holdings, and the sculpture garden is one of the loveliest outdoor spaces in the neighborhood. Free admission means no excuses.",
    signature: "The sculpture garden first, then the second floor. Check what's in the project room — it's where emerging artists get their spotlight.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 40,
    name: "Domino Park",
    category: "Experience",
    neighborhood: "Little Havana",
    description: "Officially Maximo Gomez Park, this pocket park on Calle Ocho is where the older men of Little Havana gather daily to play dominoes, argue about politics, and drink cafecito. It's a living, breathing piece of cultural heritage, not a museum exhibit. Watch respectfully, buy a coffee from the nearest ventanita, and let the rhythm of the game pull you in.",
    signature: "Go late morning on a weekday. Don't interrupt a game. Just watch, listen, and soak in a tradition that predates you.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 41,
    name: "The Wolfsonian-FIU",
    category: "Experience",
    neighborhood: "South Beach",
    description: "A museum of design and propaganda housed in a 1927 Mediterranean Revival building on Washington Avenue. The collection spans 1885 to 1945 and covers industrial design, political art, and material culture in ways that feel shockingly relevant today. It's the most intellectually stimulating museum in Miami and almost nobody visits it. Their loss.",
    signature: "The permanent collection on the upper floors — especially the propaganda posters and Art Deco furniture. Budget an hour minimum.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 42,
    name: "Oleta River State Park",
    category: "Experience",
    neighborhood: "Upper East Side",
    description: "The largest urban park in Florida, tucked behind a strip mall in North Miami Beach. Miles of mountain bike trails wind through mangrove forests, there's a quiet beach on Biscayne Bay, and you can kayak through tidal creeks without seeing another soul. It's the Miami that existed before the condos, preserved in amber and accessible by city bus.",
    signature: "Rent a kayak and paddle the mangrove trails. The morning light through the tunnels is otherworldly.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 43,
    name: "Coral Castle Museum",
    category: "Experience",
    neighborhood: "Coral Gables",
    description: "Between 1923 and 1951, a Latvian immigrant named Edward Leedskalnin single-handedly carved and moved over 1,100 tons of coral rock into a sculpture garden and dwelling. How he did it remains genuinely mysterious. The nine-ton gate swings with a finger push. It's weird, it's wonderful, and it's the kind of place that makes you believe in obsessive devotion.",
    signature: "Take the guided tour — the story is as remarkable as the structure. The revolving gate is the must-see moment.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 44,
    name: "History Miami Museum",
    category: "Experience",
    neighborhood: "Downtown",
    description: "Miami's story is wilder than most cities twice its age — Tequesta Indians, Spanish explorers, wreckers, railroad tycoons, rum runners, Cold War exiles, cocaine cowboys. This museum tells all of it with surprising depth and honesty. The permanent exhibition on South Florida's multicultural history is the best crash course on why this city is the way it is.",
    signature: "The South Florida Folklife Collection — maps, oral histories, and photographs that reveal a Miami most visitors never imagined.",
    action: "Learn More",
    actionType: "learn",
    image: null,
  },
  {
    id: 45,
    name: "Books & Books",
    category: "Shop",
    neighborhood: "Coral Gables",
    description: "The independent bookstore that became the literary heart of South Florida. The Coral Gables flagship is set in a Mediterranean courtyard with an outdoor cafe, and the programming — author readings, book clubs, community events — is the connective tissue of Miami's literary culture. The selection is curated with real taste, and the staff reads everything.",
    signature: "Check the events calendar. The author readings in the courtyard are worth rearranging your evening for.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 46,
    name: "The Salty Donut",
    category: "Shop",
    neighborhood: "Wynwood",
    description: "A gourmet donut shop in Wynwood that started as a pop-up and became a destination. The flavors rotate monthly and lean ambitious — brown butter and salt, guava and cheese, maple bacon. The dough is brioche-based and made from scratch daily. It's the rare sweet spot where Instagram-worthy appearance meets actual substance.",
    signature: "The traditional glazed is the test of any donut shop, and this one passes. Then try whatever monthly special involves tropical fruit.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 47,
    name: "Nomad Tribe",
    category: "Shop",
    neighborhood: "Wynwood",
    description: "A vintage and curated clothing store in Wynwood that mixes deadstock finds, independent designers, and a rotating selection of vintage denim and leather that's been hand-picked with an editor's eye. The owners travel to source their inventory and it shows — every rack tells a story. It's fashion retail as personal expression, not mass consumption.",
    signature: "The vintage denim section in the back. Ask the staff about new arrivals — the best pieces don't hit the floor for long.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 48,
    name: "Sweat Records",
    category: "Shop",
    neighborhood: "Little Haiti",
    description: "An independent record store, vegan cafe, and community hub in Little Haiti that embodies everything great about Miami's underground. The vinyl selection is deep in punk, electronic, hip-hop, Latin, and Caribbean music. The in-store shows are intimate and legendary. There's a vegan smoothie bar called Lester's attached, because of course there is.",
    signature: "Dig through the local section — Miami artists you won't find anywhere else. Check the marquee for in-store performances.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 49,
    name: "The Webster",
    category: "Shop",
    neighborhood: "South Beach",
    description: "A multi-brand luxury boutique in a restored 1939 Art Deco building on Collins Avenue. Laure Heriard Dubreuil curates a selection that mixes established houses with emerging designers in a space that feels like a private residence. The building alone is worth the visit — original terrazzo, curved staircases, and natural light that makes everything look better.",
    signature: "The second floor for menswear. The rooftop for the view. The ground floor for the architecture.",
    action: "Get Directions",
    actionType: "directions",
    image: null,
  },
  {
    id: 50,
    name: "Havana Collection",
    category: "Shop",
    neighborhood: "Little Havana",
    description: "A small shop on Calle Ocho that sells handmade guayaberas, Cuban art, and cigar accessories sourced from families with deep roots in the exile community. It's not a tourist trap — the guayaberas are tailored with care, the art is by local Cuban-American painters, and the owner will talk your ear off about the history behind every piece if you let him. You should let him.",
    signature: "Get fitted for a custom guayabera. It takes a few days but you'll own the most Miami garment that exists.",
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
      background: "linear-gradient(135deg, #1a3a4a 0%, #2a5a5a 25%, #3a6a6a 50%, #4a7a6a 75%, #2a4a5a 100%)",
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
          Miami, Florida
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, color: "#f5f0e8", lineHeight: 0.95, margin: "0 0 24px" }}>
          Miami
        </h1>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(245,240,232,0.85)", lineHeight: 1.5, maxWidth: 560, margin: "0 0 28px", fontStyle: "italic" }}>
          Past the velvet rope. The real Magic City.
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
  const entry = ENTRIES[1]; // Ariete
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
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: "#1a1a1a" }}>The Surf Club Restaurant</span>
              <span style={{ display: "block", fontSize: 11, color: "#999", marginTop: 2 }}>Eat · South Beach</span>
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

export default function MiamiCityPage() {
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
