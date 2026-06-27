// Source of truth for the /uses page. Set `affiliate: true` on an item once it has a
// real partner URL — the page then marks that link as sponsored and shows the FTC
// disclosure automatically. Until then everything is an honest plain link.
export interface UsesItem {
  name: string;
  href?: string;
  affiliate?: boolean;
  note: string;
}

export interface UsesGroup {
  title: string;
  items: UsesItem[];
}

export const uses: UsesGroup[] = [
  {
    title: "Editor & shell",
    items: [
      { name: "VS Code", href: "https://code.visualstudio.com", note: "Daily driver. JetBrains Mono, a quiet theme, and as few extensions as I can get away with." },
      { name: "JetBrains Mono", href: "https://www.jetbrains.com/lp/mono/", note: "The monospace face across my editor and this whole site's UI labels." },
    ],
  },
  {
    title: "Build & ship",
    items: [
      { name: "Next.js", href: "https://nextjs.org", note: "Every project in the family runs on the App Router. This site too." },
      { name: "Vercel", href: "https://vercel.com", note: "Where it all deploys. Preview URLs per branch make the phase/segment workflow painless." },
      { name: "Supabase", href: "https://supabase.com", note: "Postgres + auth for the data-heavy projects (festival, draft, parlor)." },
    ],
  },
  {
    title: "Data",
    items: [
      { name: "DuckDB", href: "https://duckdb.org", note: "In-process analytics for chewing through CSVs and parquet without standing up a warehouse." },
      { name: "dbt", href: "https://www.getdbt.com", note: "Keeps the trivia + sports transforms tested and documented." },
      { name: "Python", href: "https://www.python.org", note: "The pipelines that pull lineups, telemetry, and feeds before they ever hit a frontend." },
    ],
  },
];
