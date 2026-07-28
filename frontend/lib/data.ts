// ---------------------------------------------------------------------------
// Placeholder content for Dacan Tour.
// In production this data comes from Directus (CMS). Shapes mirror the design
// doc's data model (Trip, Category, Destination, Departure). Swap the imagery
// and copy for real Kyrgyzstan photography via the CMS at launch.
//
// Images use picsum.photos seeds so the site always renders — replace with real
// trip photography (next/image works the same with any host).
// ---------------------------------------------------------------------------

export const img = (seed: string, w = 1600, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export type Country = "KG" | "US";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  icon: "horse" | "trek" | "history" | "city" | "scenic" | "ski";
};

export type Destination = {
  slug: string;
  name: string;
  country: Country;
  region: string;
  intro: string;
  description: string;
  heroImage: string;
  gallery: string[];
};

export type Departure = {
  id?: string;
  startDate: string;
  endDate: string;
  capacity: number;
  spotsTaken: number;
  status: "open" | "full" | "closed";
};

export type ItineraryDay = { day: number; title: string; text: string };

export type Trip = {
  slug: string;
  title: string;
  country: Country;
  region: string;
  categories: string[]; // category slugs
  summary: string;
  description: string;
  heroImage: string;
  gallery: string[];
  durationDays: number;
  priceFrom: number;
  currency: "USD";
  difficulty: "Easy" | "Moderate" | "Challenging";
  groupSizeMax: number;
  featured: boolean;
  highlights: string[];
  itinerary: ItineraryDay[];
  departures: Departure[]; // empty for US trips (custom-scheduled)
};

// --- Categories -----------------------------------------------------------

export const categories: Category[] = [
  {
    slug: "horse-riding",
    name: "Horse Riding",
    blurb: "Ride the Silk Road across high summer pastures to Song-Köl.",
    icon: "horse",
  },
  {
    slug: "trekking",
    name: "Trekking",
    blurb: "Cross alpine passes to glacier lakes like Ala-Kul and Kel-Suu.",
    icon: "trek",
  },
  {
    slug: "scenic",
    name: "Scenic & Nature",
    blurb: "The country's most cinematic lakes, canyons and valleys.",
    icon: "scenic",
  },
  {
    slug: "historic",
    name: "Historic & Silk Road",
    blurb: "Caravanserais, petroglyphs and towers of the ancient route.",
    icon: "history",
  },
  {
    slug: "city",
    name: "City & Culture",
    blurb: "Bishkek bazaars, yurt life and nomad craft.",
    icon: "city",
  },
  {
    slug: "ski",
    name: "Ski & Snow",
    blurb: "Powder days in Karakol and the northern ranges.",
    icon: "ski",
  },
];

// --- Kyrgyzstan destinations ----------------------------------------------

export const destinations: Destination[] = [
  {
    slug: "kel-suu",
    name: "Kel-Suu Lake",
    country: "KG",
    region: "Naryn",
    intro: "A hidden fjord-like lake at 3,500m near the Chinese border.",
    description:
      "Kel-Suu is the reward at the end of a long, wild drive through the Naryn highlands — a slender turquoise lake pinched between sheer granite walls, its far end disappearing into flooded side-canyons you can only reach by raft. Few places on earth feel this remote, this untouched. The light here changes by the minute.",
    heroImage: img("kelsuu-hero", 2000, 1200),
    gallery: [img("kelsuu-1"), img("kelsuu-2"), img("kelsuu-3"), img("kelsuu-4")],
  },
  {
    slug: "song-kol",
    name: "Song-Köl Lake",
    country: "KG",
    region: "Naryn",
    intro: "High-alpine lake, summer yurt camps and Silk Road horse trails.",
    description:
      "At 3,016m, Song-Köl is where nomadic life still runs on the rhythm of the seasons. Families bring their herds up for the short summer, pitching yurts on grass that rolls unbroken to the horizon. Sleep under more stars than you knew existed, wake to horses at the water's edge, and ride the same passes Silk Road caravans once crossed.",
    heroImage: img("songkol-hero", 2000, 1200),
    gallery: [img("songkol-1"), img("songkol-2"), img("songkol-3"), img("songkol-4")],
  },
  {
    slug: "ala-kul",
    name: "Ala-Kul Lake",
    country: "KG",
    region: "Issyk-Kul",
    intro: "A glacier lake above Karakol, the classic Tian Shan trek.",
    description:
      "The trek to Ala-Kul climbs through pine forest and glacial valleys to a lake that glows an impossible milky blue beneath the peaks. Cross the 3,900m pass and drop to the Altyn-Arashan hot springs on the far side — the most loved multi-day trek in the country.",
    heroImage: img("alakul-hero", 2000, 1200),
    gallery: [img("alakul-1"), img("alakul-2"), img("alakul-3"), img("alakul-4")],
  },
  {
    slug: "issyk-kul",
    name: "Issyk-Kul",
    country: "KG",
    region: "Issyk-Kul",
    intro: "The world's second-largest alpine lake — warm, salty, immense.",
    description:
      "Ringed by snow peaks yet never freezing, Issyk-Kul is the beating heart of Kyrgyz summer. Its southern shore hides red-rock canyons, hot springs and quiet beaches; the north has the towns and the road that connects everything.",
    heroImage: img("issykkul-hero", 2000, 1200),
    gallery: [img("issykkul-1"), img("issykkul-2"), img("issykkul-3"), img("issykkul-4")],
  },
  {
    slug: "jeti-oguz",
    name: "Jeti-Ögüz",
    country: "KG",
    region: "Issyk-Kul",
    intro: "The 'Seven Bulls' — a wall of blazing red sandstone cliffs.",
    description:
      "A row of red sandstone ridges that catch fire at sunset, above green valleys grazed by horses. Short walks and long ones, all of them beautiful, a quick drive from Karakol.",
    heroImage: img("jetioguz-hero", 2000, 1200),
    gallery: [img("jetioguz-1"), img("jetioguz-2"), img("jetioguz-3"), img("jetioguz-4")],
  },
  {
    slug: "skazka-canyon",
    name: "Skazka Canyon",
    country: "KG",
    region: "Issyk-Kul",
    intro: "'Fairytale' canyon of wind-carved red and orange rock.",
    description:
      "On the south shore of Issyk-Kul, Skazka is a maze of ridges eroded into dragons, castles and waves of colour. Golden hour turns the whole canyon to embers.",
    heroImage: img("skazka-hero", 2000, 1200),
    gallery: [img("skazka-1"), img("skazka-2"), img("skazka-3"), img("skazka-4")],
  },
  {
    slug: "tash-rabat",
    name: "Tash Rabat",
    country: "KG",
    region: "Naryn",
    intro: "A stone caravanserai from the Silk Road, alone in the mountains.",
    description:
      "A 15th-century stone waystation set deep in a green valley near the Torugart pass — once shelter for merchants and monks, now one of the most atmospheric places to stay in a yurt under the stars.",
    heroImage: img("tashrabat-hero", 2000, 1200),
    gallery: [img("tashrabat-1"), img("tashrabat-2"), img("tashrabat-3"), img("tashrabat-4")],
  },
  {
    slug: "burana-tower",
    name: "Burana Tower",
    country: "KG",
    region: "Chüy",
    intro: "An 11th-century minaret and field of stone warriors near Bishkek.",
    description:
      "All that remains of the Silk Road city of Balasagun: a weathered brick minaret you can climb, surrounded by balbals — carved stone figures that have watched the steppe for a thousand years. An easy day trip from Bishkek.",
    heroImage: img("burana-hero", 2000, 1200),
    gallery: [img("burana-1"), img("burana-2"), img("burana-3"), img("burana-4")],
  },
];

// --- Kyrgyzstan trips (fixed departures) ----------------------------------

export const kgTrips: Trip[] = [
  {
    slug: "song-kol-horse-riding",
    title: "Song-Köl Silk Road Horse Trek",
    country: "KG",
    region: "Naryn",
    categories: ["horse-riding", "historic", "scenic"],
    summary:
      "Eight days on horseback across high summer pastures to the shores of Song-Köl, sleeping in nomad yurts along a living Silk Road.",
    description:
      "This is the trip that captures the soul of Kyrgyzstan. You'll ride sturdy mountain horses over 3,000m passes, following trails used by herders and Silk Road caravans for centuries. Nights are spent in family yurt camps on the shore of Song-Köl, where the Milky Way spills across the whole sky and the only sound is horses at the water. Our on-the-ground team handles every detail — guides, horses, cooks, permits — so you just ride.",
    heroImage: img("trip-songkol-hero", 2000, 1200),
    gallery: [
      img("trip-songkol-1"),
      img("trip-songkol-2"),
      img("trip-songkol-3"),
      img("trip-songkol-4"),
      img("trip-songkol-5"),
      img("trip-songkol-6"),
    ],
    durationDays: 8,
    priceFrom: 1490,
    currency: "USD",
    difficulty: "Moderate",
    groupSizeMax: 12,
    featured: true,
    highlights: [
      "Two nights in nomad yurt camps on Song-Köl lake",
      "Ride Silk Road passes with local herder-guides",
      "Home-cooked Kyrgyz meals and an evening around the fire",
      "Small group, capped at 12 riders",
    ],
    itinerary: [
      { day: 1, title: "Bishkek → Kochkor", text: "Meet the team, drive south into the mountains, and settle into a family guesthouse. Trip briefing and dinner." },
      { day: 2, title: "Meet the horses", text: "Short drive to the trailhead, meet your horse and guides, and ride into the first valley. Camp among the pastures." },
      { day: 3, title: "Over the pass", text: "Climb your first high pass with wide views of the Tian Shan, descending toward Song-Köl." },
      { day: 4, title: "Song-Köl shore", text: "Arrive at the lake. Yurt camp, free afternoon to ride, walk or simply watch the light." },
      { day: 5, title: "Around the lake", text: "A long, beautiful loop along the shoreline, past herder camps and grazing horses." },
      { day: 6, title: "High country", text: "Ride back toward the ridges, camping one last night under the stars." },
      { day: 7, title: "Descent", text: "Down through flower meadows to the valley floor and a warm guesthouse." },
      { day: 8, title: "Return to Bishkek", text: "Scenic drive back to the capital. Farewell dinner." },
    ],
    departures: [
      { id: "sk-jun", startDate: "2026-06-14", endDate: "2026-06-21", capacity: 12, spotsTaken: 5, status: "open" },
      { id: "sk-jul", startDate: "2026-07-12", endDate: "2026-07-19", capacity: 12, spotsTaken: 9, status: "open" },
      { id: "sk-aug", startDate: "2026-08-09", endDate: "2026-08-16", capacity: 12, spotsTaken: 12, status: "full" },
      { id: "sk-sep", startDate: "2026-09-06", endDate: "2026-09-13", capacity: 12, spotsTaken: 3, status: "open" },
    ],
  },
  {
    slug: "kel-suu-expedition",
    title: "Kel-Suu Hidden Lake Expedition",
    country: "KG",
    region: "Naryn",
    categories: ["scenic", "trekking"],
    summary:
      "A seven-day overland expedition to one of Central Asia's most remote and dramatic lakes, deep in the Naryn highlands.",
    description:
      "Kel-Suu is not easy to reach, and that's exactly the point. This expedition takes you far off the tourist map, over rough tracks and high plateaus, to a lake most travelers never see. We raft into its flooded canyons, camp beneath granite walls, and share the valley with only herders and marmots. A trip for those who want the real, wild edge of Kyrgyzstan.",
    heroImage: img("trip-kelsuu-hero", 2000, 1200),
    gallery: [
      img("trip-kelsuu-1"),
      img("trip-kelsuu-2"),
      img("trip-kelsuu-3"),
      img("trip-kelsuu-4"),
      img("trip-kelsuu-5"),
    ],
    durationDays: 7,
    priceFrom: 1690,
    currency: "USD",
    difficulty: "Challenging",
    groupSizeMax: 10,
    featured: true,
    highlights: [
      "Reach remote Kel-Suu lake at 3,500m",
      "Raft into the hidden flooded canyons",
      "Wild camping in the Naryn highlands",
      "Visit the Tash Rabat caravanserai en route",
    ],
    itinerary: [
      { day: 1, title: "Bishkek → Naryn", text: "Drive south across the mountains to the town of Naryn." },
      { day: 2, title: "Tash Rabat", text: "Visit the ancient stone caravanserai and stay in a valley yurt camp." },
      { day: 3, title: "Into the highlands", text: "Long overland drive onto the high plateau toward Kel-Suu." },
      { day: 4, title: "Kel-Suu", text: "Reach the lake, raft into the canyons, and camp on the shore." },
      { day: 5, title: "Explore", text: "A full day to hike the side valleys and photograph the changing light." },
      { day: 6, title: "Return drive", text: "Back across the plateau to Naryn for a hot shower and a bed." },
      { day: 7, title: "Return to Bishkek", text: "Scenic drive north to the capital." },
    ],
    departures: [
      { id: "ks-jul", startDate: "2026-07-05", endDate: "2026-07-11", capacity: 10, spotsTaken: 4, status: "open" },
      { id: "ks-aug", startDate: "2026-08-02", endDate: "2026-08-08", capacity: 10, spotsTaken: 7, status: "open" },
      { id: "ks-aug2", startDate: "2026-08-23", endDate: "2026-08-29", capacity: 10, spotsTaken: 2, status: "open" },
    ],
  },
  {
    slug: "ala-kul-trek",
    title: "Ala-Kul & Altyn-Arashan Trek",
    country: "KG",
    region: "Issyk-Kul",
    categories: ["trekking", "scenic"],
    summary:
      "The classic five-day Tian Shan trek: glacier lakes, a 3,900m pass, and the Altyn-Arashan hot springs.",
    description:
      "Kyrgyzstan's most famous trek for good reason. From Karakol you climb through pine forest and glacial valleys to Ala-Kul, a lake that glows electric blue below the peaks. Cross the high pass, then descend to the wooden bathhouses and open-air hot springs of Altyn-Arashan. Porters carry the heavy loads; you carry a day pack.",
    heroImage: img("trip-alakul-hero", 2000, 1200),
    gallery: [
      img("trip-alakul-1"),
      img("trip-alakul-2"),
      img("trip-alakul-3"),
      img("trip-alakul-4"),
    ],
    durationDays: 5,
    priceFrom: 890,
    currency: "USD",
    difficulty: "Challenging",
    groupSizeMax: 12,
    featured: true,
    highlights: [
      "Ala-Kul glacier lake at 3,500m",
      "Cross the 3,900m Ala-Kul pass",
      "Soak in the Altyn-Arashan hot springs",
      "Supported trekking with porters and a cook",
    ],
    itinerary: [
      { day: 1, title: "Karakol → Sirota", text: "Drive to the trailhead and trek up the valley to the first camp." },
      { day: 2, title: "To Ala-Kul", text: "Climb through the valley to camp near the shore of the lake." },
      { day: 3, title: "The pass", text: "Cross the 3,900m Ala-Kul pass and descend to Altyn-Arashan." },
      { day: 4, title: "Hot springs", text: "A slow morning in the springs, then trek down the valley." },
      { day: 5, title: "Return to Karakol", text: "Final descent and transfer back to town." },
    ],
    departures: [
      { id: "ak-jun", startDate: "2026-06-21", endDate: "2026-06-25", capacity: 12, spotsTaken: 6, status: "open" },
      { id: "ak-jul", startDate: "2026-07-19", endDate: "2026-07-23", capacity: 12, spotsTaken: 11, status: "open" },
      { id: "ak-aug", startDate: "2026-08-16", endDate: "2026-08-20", capacity: 12, spotsTaken: 8, status: "open" },
    ],
  },
  {
    slug: "silk-road-highlights",
    title: "Silk Road Highlights & Southern Shore",
    country: "KG",
    region: "Issyk-Kul & Naryn",
    categories: ["historic", "city", "scenic"],
    summary:
      "A relaxed nine-day loop of the country's greatest hits — Burana, Issyk-Kul, Skazka canyon, Jeti-Ögüz and Bishkek.",
    description:
      "Perfect for a first visit or travelers who prefer comfortable lodges to tents. This overland journey links the icons: the Burana minaret, the red canyons of the southern shore, the seven-bull cliffs of Jeti-Ögüz, and the markets of Bishkek and Karakol. Plenty of short walks, culture and colour, at an easy pace.",
    heroImage: img("trip-silkroad-hero", 2000, 1200),
    gallery: [
      img("trip-silkroad-1"),
      img("trip-silkroad-2"),
      img("trip-silkroad-3"),
      img("trip-silkroad-4"),
    ],
    durationDays: 9,
    priceFrom: 1350,
    currency: "USD",
    difficulty: "Easy",
    groupSizeMax: 14,
    featured: false,
    highlights: [
      "Burana Tower and the stone warriors",
      "Skazka 'fairytale' canyon at golden hour",
      "The red cliffs of Jeti-Ögüz",
      "Comfortable guesthouses and lodges throughout",
    ],
    itinerary: [
      { day: 1, title: "Bishkek", text: "Arrival, city walk, welcome dinner." },
      { day: 2, title: "Burana → Issyk-Kul", text: "The Silk Road minaret, then east to the great lake." },
      { day: 3, title: "Southern shore", text: "Skazka canyon and quiet beaches." },
      { day: 4, title: "Jeti-Ögüz", text: "The seven-bull cliffs and valley walks." },
      { day: 5, title: "Karakol", text: "Wooden mosque, market and museum." },
      { day: 6, title: "Highlands", text: "Drive into the mountains toward Naryn." },
      { day: 7, title: "Tash Rabat", text: "Silk Road caravanserai and a night in a yurt." },
      { day: 8, title: "Return north", text: "Scenic drive back toward Bishkek." },
      { day: 9, title: "Departure", text: "Farewell and airport transfer." },
    ],
    departures: [
      { id: "sr-may", startDate: "2026-05-24", endDate: "2026-06-01", capacity: 14, spotsTaken: 4, status: "open" },
      { id: "sr-sep", startDate: "2026-09-13", endDate: "2026-09-21", capacity: 14, spotsTaken: 6, status: "open" },
    ],
  },
  {
    slug: "karakol-ski-week",
    title: "Karakol Powder Week",
    country: "KG",
    region: "Issyk-Kul",
    categories: ["ski", "scenic"],
    summary:
      "Seven days chasing dry Tian Shan powder above Karakol, with lake views and hot springs to end each day.",
    description:
      "Kyrgyzstan's best-kept winter secret. Karakol's slopes sit high above Issyk-Kul with long, empty runs and famously dry snow. We ski the resort and, for the confident, add guided backcountry and cat-skiing options — then soak tired legs in the Altyn-Arashan springs. Small group, big mountains, almost no lift lines.",
    heroImage: img("trip-ski-hero", 2000, 1200),
    gallery: [
      img("trip-ski-1"),
      img("trip-ski-2"),
      img("trip-ski-3"),
      img("trip-ski-4"),
    ],
    durationDays: 7,
    priceFrom: 1250,
    currency: "USD",
    difficulty: "Moderate",
    groupSizeMax: 10,
    featured: false,
    highlights: [
      "Dry Tian Shan powder above Issyk-Kul",
      "Optional guided backcountry days",
      "Hot springs and lakeside lodging",
      "Small group with a local mountain guide",
    ],
    itinerary: [
      { day: 1, title: "Bishkek → Karakol", text: "Transfer along the north shore of Issyk-Kul." },
      { day: 2, title: "Resort day", text: "Warm up on Karakol's runs and get your legs." },
      { day: 3, title: "Powder", text: "Chase fresh snow across the mountain." },
      { day: 4, title: "Backcountry option", text: "Guided touring or another resort day." },
      { day: 5, title: "Cat-ski option", text: "Add-on cat-skiing for untracked lines." },
      { day: 6, title: "Springs", text: "Ski the morning, soak in Altyn-Arashan by afternoon." },
      { day: 7, title: "Return", text: "Transfer back to Bishkek." },
    ],
    departures: [
      { id: "ski-jan", startDate: "2027-01-17", endDate: "2027-01-23", capacity: 10, spotsTaken: 3, status: "open" },
      { id: "ski-feb", startDate: "2027-02-14", endDate: "2027-02-20", capacity: 10, spotsTaken: 5, status: "open" },
    ],
  },
];

// --- US trips (trust-builders, custom-scheduled) --------------------------

export const usTrips: Trip[] = [
  {
    slug: "alaska-northern-lights",
    title: "Alaska: Northern Lights & Snow",
    country: "US",
    region: "Alaska",
    categories: ["scenic", "ski"],
    summary:
      "Chase the aurora over Fairbanks, ski fresh snow, and soak in Arctic hot springs on our signature winter trip.",
    description:
      "Our longest-running winter trip and a favorite of the Dacan Tour community. Nights under dancing green aurora, days on the snow, and evenings in Chena hot springs. This is the trip that started it all — proof of the experiences we build.",
    heroImage: img("us-alaska-hero", 2000, 1200),
    gallery: [img("us-alaska-1"), img("us-alaska-2"), img("us-alaska-3"), img("us-alaska-4")],
    durationDays: 6,
    priceFrom: 1600,
    currency: "USD",
    difficulty: "Easy",
    groupSizeMax: 16,
    featured: true,
    highlights: ["Aurora viewing nights", "Skiing and snow activities", "Chena hot springs", "Small, friendly group"],
    itinerary: [],
    departures: [],
  },
  {
    slug: "colorado-ski",
    title: "Colorado Ski Escape",
    country: "US",
    region: "Colorado",
    categories: ["ski"],
    summary: "Rocky Mountain powder, mountain towns and a community of young travelers who become friends.",
    description:
      "A long weekend (or more) of skiing in the Colorado Rockies. Great slopes for every level, cozy lodging, and the social, welcoming Dacan Tour crowd that keeps people coming back season after season.",
    heroImage: img("us-colorado-hero", 2000, 1200),
    gallery: [img("us-colorado-1"), img("us-colorado-2"), img("us-colorado-3"), img("us-colorado-4")],
    durationDays: 4,
    priceFrom: 850,
    currency: "USD",
    difficulty: "Moderate",
    groupSizeMax: 20,
    featured: true,
    highlights: ["Rocky Mountain skiing", "All levels welcome", "Mountain-town evenings", "Gear rental support"],
    itinerary: [],
    departures: [],
  },
  {
    slug: "hawaii-islands",
    title: "Hawaii: Islands & Ocean",
    country: "US",
    region: "Hawaii",
    categories: ["scenic"],
    summary: "Volcanoes, waterfalls and warm Pacific water — a bright escape with the Dacan Tour community.",
    description:
      "Hike to waterfalls, snorkel clear reefs, watch a volcano glow at night, and end each day on the beach. One of our most-loved US trips and a reminder that Dacan Tour is about the people as much as the places.",
    heroImage: img("us-hawaii-hero", 2000, 1200),
    gallery: [img("us-hawaii-1"), img("us-hawaii-2"), img("us-hawaii-3"), img("us-hawaii-4")],
    durationDays: 6,
    priceFrom: 1450,
    currency: "USD",
    difficulty: "Easy",
    groupSizeMax: 18,
    featured: false,
    highlights: ["Volcano and waterfall hikes", "Snorkeling", "Beach days", "Island-hopping"],
    itinerary: [],
    departures: [],
  },
  {
    slug: "arizona-utah-canyons",
    title: "Arizona & Utah Canyons",
    country: "US",
    region: "Arizona / Utah",
    categories: ["scenic", "trekking"],
    summary: "Antelope Canyon, the Grand Canyon and Utah's red-rock parks on an unforgettable desert road trip.",
    description:
      "A road trip through the American Southwest's greatest landscapes — slot canyons, sandstone arches and the vast rim of the Grand Canyon. Big skies, big rock, and the golden light photographers dream about.",
    heroImage: img("us-canyons-hero", 2000, 1200),
    gallery: [img("us-canyons-1"), img("us-canyons-2"), img("us-canyons-3"), img("us-canyons-4")],
    durationDays: 5,
    priceFrom: 1100,
    currency: "USD",
    difficulty: "Moderate",
    groupSizeMax: 14,
    featured: false,
    highlights: ["Antelope Canyon", "Grand Canyon rim", "Utah red-rock parks", "Desert road trip"],
    itinerary: [],
    departures: [],
  },
  {
    slug: "california-big-sur",
    title: "California: Big Sur & the Coast",
    country: "US",
    region: "California",
    categories: ["scenic"],
    summary: "The Pacific Coast Highway, redwoods and the cliffs of Big Sur on a classic West Coast drive.",
    description:
      "Drive one of the world's great coastal roads, walk among giant redwoods, and watch the sun drop into the Pacific from the Big Sur cliffs. A relaxed, scenic favorite for our West Coast community.",
    heroImage: img("us-bigsur-hero", 2000, 1200),
    gallery: [img("us-bigsur-1"), img("us-bigsur-2"), img("us-bigsur-3"), img("us-bigsur-4")],
    durationDays: 4,
    priceFrom: 950,
    currency: "USD",
    difficulty: "Easy",
    groupSizeMax: 14,
    featured: false,
    highlights: ["Pacific Coast Highway", "Redwood forests", "Big Sur cliffs", "Coastal towns"],
    itinerary: [],
    departures: [],
  },
];

export const allTrips = [...kgTrips, ...usTrips];

export function getTrip(slug: string) {
  return allTrips.find((t) => t.slug === slug);
}
export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// --- Testimonials ---------------------------------------------------------

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
  trip: string;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I'd never been anywhere like Kyrgyzstan and honestly I was nervous booking. Meeting Akan in New York first changed everything — the trip was flawless and the local team felt like family by day two.",
    name: "Sofia R.",
    detail: "Brooklyn, NY",
    trip: "Song-Köl Horse Trek",
    avatar: img("avatar-sofia", 200, 200),
  },
  {
    quote:
      "Did the Colorado ski trip first, loved it, then went to Kel-Suu. Both were run so well. These are the trips you tell everyone about for years.",
    name: "Daniel K.",
    detail: "Chicago, IL",
    trip: "Kel-Suu Expedition",
    avatar: img("avatar-daniel", 200, 200),
  },
  {
    quote:
      "The most beautiful place I have ever put a camera in front of. Small group, real nomad camps, zero tourist traps. Ala-Kul at sunrise is unreal.",
    name: "Lena M.",
    detail: "Berlin, Germany",
    trip: "Ala-Kul Trek",
    avatar: img("avatar-lena", 200, 200),
  },
];

// --- Instagram strip ------------------------------------------------------

export const instagramPosts = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  image: img(`insta-${i}`, 600, 600),
  href: "https://instagram.com",
}));

export const CONTACT = {
  whatsapp: "https://wa.me/10000000000",
  whatsappDisplay: "+1 (000) 000-0000",
  instagram: "https://instagram.com",
  email: "hello@dacantour.com",
  basedIn: "United States",
};
