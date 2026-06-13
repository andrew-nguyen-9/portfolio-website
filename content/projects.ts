export type ProjectStatus = "live" | "building" | "planned";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  subdomain: string;
  repoUrl?: string;
  status: ProjectStatus;
  year: number;
  tags: string[];
  category: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "music-festival-analyzer",
    name: "Festival Analyzer",
    tagline: "Artist intelligence for major US music festivals",
    description:
      "Autonomous data pipeline surfacing lineup analytics, artist metadata, streaming stats, and AI-generated insights for Lollapalooza and beyond.",
    subdomain: "festival.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/music-festival-analyzer",
    status: "building",
    year: 2026,
    tags: ["Next.js", "Supabase", "Python", "Spotify API", "Deezer API"],
    category: "Music",
    featured: true,
  },
  {
    id: "fantasy-football-tool",
    name: "Draft Tool",
    tagline: "Live and offline fantasy football draft intelligence",
    description:
      "Pipeline-driven web app for NFL fantasy: player intelligence, live draft assistance, trade optimizer, and waiver wire analysis.",
    subdomain: "draft.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/fantasy-football-tool",
    status: "building",
    year: 2026,
    tags: ["Next.js", "Supabase", "Sleeper API", "nflverse"],
    category: "Sports",
    featured: true,
  },
  {
    id: "trivia-generator",
    name: "Parlor",
    tagline: "An after-dark house of trivia games",
    description:
      "Four trivia rooms over one daily question bank — The Board, The Clock, The Wedges, The Streak — forged from Wikipedia, Deezer, TMDB, and Sleeper.",
    subdomain: "parlor.an9.dev",
    repoUrl: "https://github.com/andrew-nguyen-9/trivia-generator",
    status: "building",
    year: 2026,
    tags: ["Next.js", "Supabase", "dbt", "DuckDB", "Wikipedia API"],
    category: "Games",
    featured: true,
  },
  {
    id: "midterms-tracker",
    name: "Midterms 2026",
    tagline: "Election analytics: PAC funding, polls, and economics",
    description:
      "Five-tab analytics tool covering Super PAC/PAC funding flows, rolling poll averages, district-level historical results, issue polling, and economic indicators.",
    subdomain: "midterms.an9.dev",
    status: "planned",
    year: 2026,
    tags: ["Next.js", "FEC API", "BLS API", "FRED API", "D3.js"],
    category: "Civic",
    featured: true,
  },
  {
    id: "f1-tracker",
    name: "F1 Tracker",
    tagline: "Data storyboard for every race, driver, and team",
    description:
      "Live telemetry, historical results, car design analysis, rivalry graphs, and budget-vs-performance correlation across the 2026 season.",
    subdomain: "f1.an9.dev",
    status: "planned",
    year: 2026,
    tags: ["Next.js", "OpenF1 API", "Ergast API", "Python"],
    category: "Sports",
    featured: false,
  },
  {
    id: "cta-analytics",
    name: "CTA Analytics",
    tagline: "Chicago transit data, staffing, and route design",
    description:
      "GTFS-powered analysis of CTA bus and rail coverage gaps, staffing shortages, funding efficiency, and proposed route optimizations.",
    subdomain: "cta.an9.dev",
    status: "planned",
    year: 2026,
    tags: ["Next.js", "GTFS", "Chicago Data Portal", "D3.js"],
    category: "Civic",
    featured: false,
  },
  {
    id: "grocery-storyboard",
    name: "Grocery",
    tagline: "Shrinkflation, price inflation, and recipe discovery",
    description:
      "Data journalism on food: supply chain origins, shrinkflation tracking, CPI food categories, and recipe discovery with real-time cost estimates.",
    subdomain: "grocery.an9.dev",
    status: "planned",
    year: 2026,
    tags: ["Next.js", "USDA API", "BLS CPI", "Spoonacular API"],
    category: "Food",
    featured: false,
  },
  {
    id: "cooking-music-game",
    name: "Kitchen",
    tagline: "Ingredients as instruments; flavor profiles as motifs",
    description:
      "Interactive music looper where each ingredient has a unique sound. Pair ingredients by flavor profile to build harmonic compositions.",
    subdomain: "kitchen.an9.dev",
    status: "planned",
    year: 2026,
    tags: ["Next.js", "Tone.js", "Web Audio API", "FlavorDB"],
    category: "Music",
    featured: false,
  },
];
