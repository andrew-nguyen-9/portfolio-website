export type ProjectStatus = "live" | "building" | "planned";

export interface ProjectScreenshot {
  url: string;
  alt: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl?: string;
  /** Optional project logo (in public/projects/). Shown in the preview tooltip;
   *  falls back to the monogram CategoryPlate when absent. */
  logo?: string;
  subdomain: string;
  repoUrl?: string;
  status: ProjectStatus;
  tags: string[];
  category: string;
  featured: boolean;
  // v4.7.1 — detail-page content (/projects/[id]). All optional: a project with none
  // of these still renders a detail page from description + tags + links.
  writeUp?: string[]; // body paragraphs
  whatILearned?: string[]; // takeaway bullets
  screenshots?: ProjectScreenshot[];
}

export const projects: Project[] = [
  {
    id: "soundcheck",
    name: "Soundcheck",
    tagline: "Which festival lineup is actually worth the ticket?",
    description:
      "An autonomous, pipeline-driven look at US festival lineups — pulling artists, streaming stats, and media into rich festival profiles so you can see who's worth showing up early for. Starts with Lollapalooza, scaling toward 200+ festivals.",
    imageUrl: "https://images.unsplash.com/photo-1565035010268-a3816f98589a?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "/projects/soundcheck.svg",
    subdomain: "soundcheck.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/soundcheck",
    status: "live",
    tags: ["Next.js", "Supabase", "Python", "Spotify API", "Deezer API"],
    category: "Music",
    featured: true,
    writeUp: [
      "Every spring the same argument starts: is this year's lineup actually worth the ticket, or does it just look stacked on the poster? Soundcheck is my attempt to answer that with data instead of vibes.",
      "A Python pipeline pulls the lineup, then enriches each artist with streaming stats and metadata from Spotify and Deezer. The frontend ranks who's worth showing up early for and surfaces the depth of a lineup, not just the headliners.",
    ],
    whatILearned: [
      "Reconciling artist identities across Spotify and Deezer is most of the work — the same act is spelled three different ways.",
      "Streaming popularity and 'worth seeing live' are only loosely correlated; the interesting signal is in the mid-card.",
    ],
  },
  {
    id: "blitzboard",
    name: "BlitzBoard",
    tagline: "Who should you actually take with the next pick?",
    description:
      "A pipeline-driven NFL fantasy war room: player intelligence, live and offline draft help, trade and waiver optimization, and real-time news-sentiment trending — built for people who follow it for the numbers.",
    imageUrl: "https://images.unsplash.com/photo-1719518701287-72bb9b3366ee?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "/projects/blitzboard.svg",
    subdomain: "blitzboard.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/blitzboard",
    status: "live",
    tags: ["Next.js", "Supabase", "Sleeper API", "nflverse", "Python"],
    category: "Sports",
    featured: true,
    writeUp: [
      "BlitzBoard is the fantasy companion I wanted on draft day — not hot takes, just the numbers that actually move a pick. Player breakdowns, live draft help, a trade optimizer, and waiver-wire reads.",
      "It pulls league state from the Sleeper API and historical performance from nflverse, then turns both into recommendations you can act on between picks while the clock runs.",
    ],
    whatILearned: [
      "Live draft tooling lives or dies on latency — the read has to land before the pick clock does.",
      "nflverse is a goldmine, but season-to-season schema drift means every offseason is a small migration.",
    ],
  },
  {
    id: "parlor",
    name: "Parlor",
    tagline: "Ten ways to play one nightly question bank",
    description:
      "A house of ten trivia games over a single question bank — a Jeopardy board, a year-guessing clock, map pins, name-that-tune, a Connections grid, a daily mix, and more — forged each night from Wikipedia, Deezer, Sleeper/ESPN, and TMDB.",
    imageUrl: "https://images.unsplash.com/photo-1758818127034-84adef35c239?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHZpY3RvcmlhbiUyMGludGVyaW9yfGVufDB8fDB8fHww",
    logo: "/projects/parlor.png",
    subdomain: "parlor.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/trivia-generator",
    status: "live",
    tags: ["Next.js", "Supabase", "dbt", "DuckDB", "Wikipedia API", "TMDB API"],
    category: "Games",
    featured: true,
    writeUp: [
      "Parlor is a house of ten trivia rooms over one question bank, each a different way to play: a Jeopardy board, a year-guessing clock, map pins, name-that-tune, a Connections grid, and more.",
      "One pipeline forges the whole bank each night from Wikipedia, Deezer, Sleeper/ESPN, and TMDB, transformed with dbt over DuckDB so every room draws from the same clean, tested source.",
    ],
    whatILearned: [
      "Generating fair, unambiguous trivia automatically is brutal — most of the pipeline is rejection rules, not generation.",
      "dbt + DuckDB is a shockingly good local analytics stack for shaping content before it ever hits the app.",
    ],
  },
  {
    id: "ballot",
    name: "Behind the Ballot",
    tagline: "Where does the money in an election actually go?",
    description:
      "Non-partisan election tracking and analytics — campaign finance, polling, demographics, and district history — where every published figure traces back to a public data source. Built evergreen, for every election cycle.",
    imageUrl: "https://images.unsplash.com/photo-1605126511476-3284bef5af50?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "/projects/ballot.svg",
    subdomain: "ballot.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/behind-the-ballot",
    status: "live",
    tags: ["Astro", "Python", "FEC API", "Census API", "FiveThirtyEight"],
    category: "Civic",
    featured: true,
    writeUp: [
      "Behind the Ballot follows elections the way I follow most things — for the statistics. Where the money comes from, where it goes, how the polls move, and what the district has done before.",
      "A Python ETL stitches together campaign finance, polling, demographics, and congressional records behind a static-first Astro site, with a freshness floor on every figure so nothing on the page is stale or unsourced.",
    ],
    whatILearned: [
      "Non-partisan is a discipline, not a setting — it lives in which numbers you show and how you frame them.",
      "Every published figure tracing to a public source is a hard constraint that quietly shapes the whole architecture.",
    ],
  },
  {
    id: "metrotrack",
    name: "MetroTrack",
    tagline: "A love letter to Chicago, told through its transit",
    description:
      "A neutral civic-accountability tracker for Chicagoland transit: funding vs. actuals across CTA, Pace, and Metra, routes and stops mapped against where people live and work, and hiring shortfalls tracked per authority over time.",
    imageUrl: "https://images.unsplash.com/photo-1714357294111-66d9b58b5cfb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "/projects/metrotrack.svg",
    subdomain: "metrotrack.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/metrotrack",
    status: "live",
    tags: ["Astro", "PostGIS", "dbt", "DuckDB", "GTFS", "MapLibre"],
    category: "Civic",
    featured: true,
    writeUp: [
      "Chicagoland transit is being restructured with a huge funding reallocation across CTA, Pace, and Metra — and there's no single place to see where the money goes or who it serves. MetroTrack is that tracker.",
      "Three pillars: funding (budget vs. actuals), mapping (routes and stops against population, jobs, and destinations), and hiring (vacancy rates over time) — built on PostGIS and a dbt/DuckDB transform layer, served through an Astro frontend with MapLibre.",
    ],
    whatILearned: [
      "Coverage is a spatial question first — the interesting gaps only show up when routes meet where people actually are.",
      "Neutral civic data is most useful when it's boring and legible: the design has to get out of the way of the numbers.",
    ],
  },
  {
    id: "f1-tracker",
    name: "F1 Tracker",
    tagline: "Data storyboard for every race, driver, and team",
    description:
      "Live telemetry, historical results, car design analysis, rivalry graphs, and budget-vs-performance correlation across the season.",
    imageUrl: "https://images.unsplash.com/photo-1772309498395-2d954563f764?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subdomain: "f1.an9.dev",
    status: "planned",
    tags: ["Next.js", "OpenF1 API", "Ergast API", "Python"],
    category: "Sports",
    featured: false,
  },
  {
    id: "grocery-storyboard",
    name: "Grocery",
    tagline: "Why did that box of crackers get smaller?",
    description:
      "Food, followed through the data: where ingredients come from, how shrinkflation creeps in, what the CPI food categories are doing, and recipes priced with real-time grocery costs.",
    imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subdomain: "grocery.an9.dev",
    status: "planned",
    tags: ["Next.js", "USDA API", "BLS CPI", "Spoonacular API"],
    category: "Food",
    featured: false,
  },
  {
    id: "cooking-music-game",
    name: "House Special",
    tagline: "Ingredients as instruments; flavor profiles as motifs",
    description:
      "Interactive music looper where each ingredient has a unique sound. Pair ingredients by flavor profile to build harmonic compositions.",
    imageUrl: "https://images.unsplash.com/photo-1701510453951-425c888e3407?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subdomain: "kitchen.an9.dev",
    status: "planned",
    tags: ["Next.js", "Tone.js", "Web Audio API", "FlavorDB"],
    category: "Music",
    featured: false,
  },
  // v4.7.1 — ACOS. TODO(andrew): confirm real name/tagline/description/subdomain before
  // merging to main; this is placeholder copy so the slot exists on the grid + routing.
  {
    id: "acos",
    name: "ACOS",
    tagline: "A craft project in the family — details soon",
    description:
      "Another data-driven build in the an9.dev family. Write-up and links land as it takes shape.",
    subdomain: "acos.an9.dev",
    status: "planned",
    tags: ["Next.js"],
    category: "Data",
    featured: false,
  },
  // v4.7.1 — reserved AI-flagship slot. Concept deferred (BRAINSTORM): a candidate is an
  // agentic "data concierge" over the project datasets. Kept `planned`; copy stays honest
  // about being in design so it routes/OG/sitemaps like any planned project.
  {
    id: "data-concierge",
    name: "Data Concierge",
    tagline: "Ask the project family a question, get an answer",
    description:
      "A planned AI flagship: natural-language questions answered across the an9.dev datasets — festival lineups, transit, fantasy, elections — by an agent that calls each project's own data. In design.",
    subdomain: "ask.an9.dev",
    status: "planned",
    tags: ["Next.js", "Vercel AI SDK", "Agents", "Tool calls"],
    category: "Data",
    featured: false,
  },
];
