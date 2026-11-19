// content.ts — all 40 stories, verified Thursday 19 Nov 2026 news.
// Sources: Reuters, AP, AFP, BBC, The Hindu, IMD, NASA, ICJ, Pew + wire reports.
// Every card/brief was checked against web search; stale items from the
// leaders' pages (Bolivia Oct 31, Nature Nov 4, Thimphu Oct 29, Duckett Wed,
// Amazon Tue, Seoul unverified, Deutsche Bank Tue, Modi Wed, Hegseth Wed,
// Nvidia Tue, Kenya unverified, quake Wed, Delhi Tue) were dropped/replaced.

export interface Region {
  name: string;
  count: number;
  color: string;
}

export const REGIONS: Region[] = [
  { name: "EUROPE", count: 9, color: "#2563eb" },
  { name: "THE AMERICAS", count: 12, color: "#16a34a" },
  { name: "ASIA-PACIFIC", count: 5, color: "#dc2626" },
  { name: "MIDEAST", count: 5, color: "#d97706" },
  { name: "AFRICA", count: 4, color: "#92400e" },
  { name: "OCEANIA", count: 2, color: "#7c3aed" },
  { name: "WORLD", count: 3, color: "#6b7280" },
];

export interface Stat {
  num: string;
  caption: string;
}

export const STATS: Stat[] = [
  { num: "$81.3bn", caption: "raised by Anthropic \u2014 the largest IPO on record" },
  { num: "15.9m", caption: "GTA VI pre-orders banked before release day" },
  { num: "204,070", caption: "marked for evacuation ahead of Cyclone Akvan" },
  { num: "$120bn", caption: "a year of adaptation finance unresolved at COP31" },
  { num: "700,000+", caption: "Rohingya who fled in 2017 \u2014 the ICJ case" },
  { num: "13 yrs", caption: "wait since GTA V, ended at midnight" },
];

export interface Card {
  n: number;
  city: string;
  topic: string;
  headline: string;
  body: string;
  art: string; // key into art.ts
  lon: number;
  lat: number;
  dx?: number;
  dy?: number;
}

export const HEROES: Card[] = [
  {
    n: 1,
    city: "SHENZHEN",
    topic: "SUMMIT",
    headline: "Trump, Xi and Putin hold first three-way summit",
    body: "The three nuclear powers meet at APEC in Shenzhen; arms control and the Iran war top the agenda.",
    art: "summit",
    lon: 114.1,
    lat: 22.5,
  },
  {
    n: 2,
    city: "NEW YORK",
    topic: "GAMES",
    headline: "GTA VI arrives after a 13-year wait",
    body: "Rockstar's sequel unlocks at midnight; 15.9m pre-orders banked. $79.99 on PS5 and Xbox. New Zealand played first.",
    art: "gta",
    lon: -74.0,
    lat: 40.7,
    dx: -8,
    dy: -8,
  },
  {
    n: 3,
    city: "NASDAQ",
    topic: "MARKETS",
    headline: "Anthropic debuts in the biggest IPO on record",
    body: "Priced at $83, above its range, the Claude maker raised $81.3bn and is valued near $1.5tn.",
    art: "ipo",
    lon: -74.0,
    lat: 40.7,
    dx: 8,
    dy: 6,
  },
];

export const MEDIUM: Card[] = [
  {
    n: 4,
    city: "THE HAGUE",
    topic: "LAW",
    headline: "World Court rules on Myanmar's Rohingya case",
    body: "The ICJ reads its judgment in The Gambia's case over the 2017 campaign.",
    art: "icj",
    lon: 4.3,
    lat: 52.1,
    dx: -10,
    dy: -8,
  },
  {
    n: 5,
    city: "ANTALYA",
    topic: "CLIMATE",
    headline: "COP31 enters its final 48 hours",
    body: "Ministers take over the text in Antalya; 'phase out' and the $120bn adaptation fund are still open.",
    art: "cop",
    lon: 30.7,
    lat: 36.9,
    dx: 14,
    dy: -6,
  },
  {
    n: 6,
    city: "ODISHA",
    topic: "STORM",
    headline: "Cyclone Akvan bears down on Odisha",
    body: "204,070 marked for evacuation; red alerts up. Landfall near Puri Friday.",
    art: "cyclone",
    lon: 85.8,
    lat: 19.8,
  },
  {
    n: 7,
    city: "KYIV",
    topic: "WAR",
    headline: "Left off the agenda, Ukraine watches Shenzhen",
    body: "The war will not be raised at the summit, the White House says; Kyiv fears carve-up.",
    art: "kyiv",
    lon: 30.5,
    lat: 50.4,
  },
  {
    n: 8,
    city: "SHENZHEN",
    topic: "TRADE",
    headline: "APEC leaders adopt the Shenzhen Declaration",
    body: "Twenty-one economies back digital trade and a roadmap.",
    art: "apec",
    lon: 114.1,
    lat: 22.5,
    dx: 14,
    dy: -12,
  },
  {
    n: 9,
    city: "FLORIDA",
    topic: "WEATHER",
    headline: "Flooded Florida braces for still more rain",
    body: "A foot of rain in Hollywood; 300 rescue calls. Schools shut Thursday.",
    art: "florida",
    lon: -80.1,
    lat: 26.0,
    dx: -13,
    dy: -11,
  },
  {
    n: 10,
    city: "GAZA",
    topic: "WAR",
    headline: "Israeli tanks cross the Yellow Line",
    body: "Hamas calls the rare raid a flagrant truce breach; tanks reach Salah al-Din road.",
    art: "gaza",
    lon: 34.5,
    lat: 31.5,
    dx: -4,
    dy: 4,
  },
  {
    n: 11,
    city: "PARIS",
    topic: "POLITICS",
    headline: "Melenchon could win, says justice minister",
    body: "The hard-left leader is a plausible president, the minister concedes.",
    art: "paris",
    lon: 2.3,
    lat: 48.9,
    dx: 8,
    dy: 8,
  },
  {
    n: 12,
    city: "JAZAN",
    topic: "GULF",
    headline: "Saudi Arabia says danger has passed",
    body: "The all-clear in three cities follows southern alerts after a Houthi missile was downed.",
    art: "saudi",
    lon: 42.5,
    lat: 16.9,
    dx: 0,
    dy: 8,
  },
  {
    n: 13,
    city: "DERNA",
    topic: "CRIME",
    headline: "Cocaine and pills seized in eastern Libya",
    body: "Officials display millions of pills and cocaine, one of the biggest hauls.",
    art: "libya",
    lon: 22.6,
    lat: 32.8,
    dx: -12,
    dy: 14,
  },
];

export interface Brief {
  n: number;
  city: string;
  text: string;
}

// Ordered to fill 3 columns of 9, roughly grouped by region.
export const BRIEFS: Brief[] = [
  { n: 14, city: "GAZA", text: "Four nations urge Israel to let aid reach flooded Gaza." },
  { n: 15, city: "CRIMEA", text: "Bridge attacked again; traffic halted, Russian officials say." },
  { n: 16, city: "JERUSALEM", text: "Herzog asks Eisenkot to form government, not Netanyahu." },
  { n: 17, city: "ABU DHABI", text: "Russia, Ukraine trade drone strikes as talks go on." },
  { n: 18, city: "MEXICO CITY", text: "Banxico minutes: board cut rates to 6.25% on 3-2 vote." },
  { n: 19, city: "OTTAWA", text: "Carney: Canada rethinks China ties, seeking the right US deal." },
  { n: 20, city: "WASHINGTON", text: "Senators warn AI cyber threats are outpacing defences." },
  { n: 21, city: "WASHINGTON", text: "State Dept details $12bn Venezuelan oil, mineral revenue." },
  { n: 22, city: "WASHINGTON", text: "US panel urges China sanctions over Panama ship detentions." },
  { n: 23, city: "WASHINGTON", text: "House Democrats continue leadership elections." },
  { n: 24, city: "LOS ANGELES", text: "Actor Stacy Keach dies at 85." },
  { n: 25, city: "SAN FRANCISCO", text: "Alleged Russian spy held over Silicon Valley tech firm." },
  { n: 26, city: "SACRAMENTO", text: "Atmospheric river rolls on; flood advisories stay up." },
  { n: 27, city: "BOGOTA", text: "Fire and landslide alerts stay active across Colombia." },
  { n: 28, city: "TALLINN", text: "Estonia to close Russia border crossings from December." },
  { n: 29, city: "PRAGUE", text: "Hundreds of thousands protest media law, demand press freedom." },
  { n: 30, city: "MADRID", text: "General strike disrupts ports and factories." },
  { n: 31, city: "BERLIN", text: "Ukrainian-German woman charged as alleged Russian informant." },
  { n: 32, city: "BERLIN", text: "Police warn of rising hybrid threats from cyberattacks." },
  { n: 33, city: "TOKYO", text: "India and Japan review defence ties at 2+2 dialogue." },
  { n: 34, city: "CHENNAI", text: "Design firm declares a holiday for GTA VI launch day." },
  { n: 35, city: "MOGADISHU", text: "Somalia accuses UAE of secret military bases on its soil." },
  { n: 36, city: "ABUJA", text: "Tinubu, Jonathan launch Buhari's authorised biography." },
  { n: 37, city: "SOWETO", text: "Search resumes for girl, 11, swept away in Tuesday's floods." },
  { n: 38, city: "AUCKLAND", text: "New Zealand plays first as GTA VI unlocks at local midnight." },
  { n: 39, city: "WELLINGTON", text: "India leave Siraj, Jadeja out of opening Test." },
  { n: 40, city: "MARKETS", text: "Oil falls as supplies improve despite Gulf tensions." },
];

export const TOTAL_STORIES = 40;

export const DATE_CHECK =
  "DATE CHECK \u2014 FIRST REPORTED WEDNESDAY 18 NOV, SO NOT ON THIS PAGE AS NEWS: the Iranian drone interceptions \u00B7 the EU's proposed \u20AC45bn loan for Ukraine \u00B7 the House Democrats' 251-11 vote nominating Hakeem Jeffries \u00B7 Voyager 1 crossing one light-day, at 10:16 GMT Wednesday \u00B7 Pew's projection that Islam becomes the largest religion by 2035 \u00B7 the first COP31 draft (Monday).";

export const FOOTER =
  "Every story here happened, or was first reported, on Thursday 19 November 2026. Disputed claims are attributed, not stated as fact. Sources: Reuters, AP, AFP, BBC, The Hindu, IMD, NASA, ICJ, Pew. Original drawings. The World in One Day \u2014 19 November 2026.";
