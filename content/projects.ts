export type ProjectStatus = "live" | "building" | "planned";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl?: string;
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
    tagline: "Which festival lineup is actually worth the ticket?",
    description:
      "A pipeline that pulls lineups, artist metadata, and streaming stats for Lollapalooza and other big US festivals — so you can see who's worth showing up early for.",
    imageUrl: "https://images.unsplash.com/photo-1565035010268-a3816f98589a?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    tagline: "Who should you actually take with the next pick?",
    description:
      "An NFL fantasy companion for draft day and the season after: player breakdowns, live draft help, a trade optimizer, and waiver-wire reads — built for people who follow it for the numbers.",
    imageUrl: "https://images.unsplash.com/photo-1719518701287-72bb9b3366ee?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    imageUrl: "https://images.unsplash.com/photo-1758818127034-84adef35c239?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHZpY3RvcmlhbiUyMGludGVyaW9yfGVufDB8fDB8fHww",
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
    tagline: "Where does the money in the 2026 midterms actually go?",
    description:
      "Following the midterms for the statistics: Super PAC and PAC funding flows, rolling poll averages, district-level history, issue polling, and the economic indicators underneath it all.",
    imageUrl: "https://images.unsplash.com/photo-1605126511476-3284bef5af50?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    imageUrl: "https://images.unsplash.com/photo-1772309498395-2d954563f764?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    tagline: "A love letter to Chicago, told through its transit",
    description:
      "How well does the CTA actually cover Chicago? A GTFS-powered look at bus and rail coverage gaps, staffing shortages, where the funding goes, and the route changes that would help the city move a little better.",
    imageUrl: "https://images.unsplash.com/photo-1714357294111-66d9b58b5cfb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    tagline: "Why did that box of crackers get smaller?",
    description:
      "Food, followed through the data: where ingredients come from, how shrinkflation creeps in, what the CPI food categories are doing, and recipes priced with real-time grocery costs.",
    imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subdomain: "grocery.an9.dev",
    status: "planned",
    year: 2026,
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
    year: 2026,
    tags: ["Next.js", "Tone.js", "Web Audio API", "FlavorDB"],
    category: "Music",
    featured: false,
  },
];
