const SKILLS = [
  { group: "Data",     items: ["Python", "dbt", "SQL", "Spark", "Airflow", "DuckDB"] },
  { group: "Web",      items: ["Next.js", "TypeScript", "React", "Tailwind"] },
  { group: "Cloud",    items: ["Supabase", "Vercel", "GCP", "Snowflake"] },
  { group: "APIs",     items: ["Spotify", "Sleeper", "TMDB", "OpenF1", "FEC"] },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: text */}
        <div>
          <p
            className="font-mono text-xs tracking-[0.25em] uppercase mb-5 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            01 / About
          </p>

          <h2
            id="about-heading"
            className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight mb-8"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontVariationSettings: "'opsz' 72, 'SOFT' 40",
            }}
          >
            Data systems &amp;
            <br />
            <em style={{ color: "var(--secondary)", fontStyle: "italic" }}>thoughtful design</em>
          </h2>

          <div
            className="space-y-5 text-[1.05rem] leading-relaxed"
            style={{ color: "var(--fg-muted)", fontFamily: "var(--font-ibm-plex-serif), Georgia, serif" }}
          >
            <p>
              I&apos;m a Chicago-based data engineer who builds products at the intersection
              of analytics pipelines and consumer experiences. I care about the full stack —
              from ingestion schemas and transformation logic to the interface someone actually uses.
            </p>
            <p>
              My passion projects live at the edge of data and culture: festival lineups,
              fantasy draft rooms, trivia nights, election maps. Each one is an excuse to
              build a real pipeline and ship something worth using.
            </p>
            <p>
              Outside of code I collect vinyl records, tend to too many houseplants, and
              maintain strong opinions about Chicago neighborhoods.
            </p>
          </div>
        </div>

        {/* Right: skills grid */}
        <div>
          <p
            className="font-mono text-xs tracking-[0.25em] uppercase mb-6 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            Toolkit
          </p>

          <div className="grid grid-cols-2 gap-6">
            {SKILLS.map(({ group, items }) => (
              <div key={group}>
                <h3
                  className="font-mono text-[0.65rem] tracking-widest uppercase mb-3 opacity-40"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {group}
                </h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="text-sm"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
