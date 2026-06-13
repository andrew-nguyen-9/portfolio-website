import { useReveal } from "@/hooks/useReveal";

const SKILLS = [
  { group: "Data",   items: ["Python", "dbt", "SQL", "Spark", "DuckDB", "Airflow"] },
  { group: "Web",    items: ["Next.js", "TypeScript", "React", "Tailwind"] },
  { group: "Cloud",  items: ["Supabase", "Vercel", "GCP", "Snowflake"] },
  { group: "APIs",   items: ["Spotify", "Sleeper", "TMDB", "OpenF1", "FEC"] },
];

const STATS = [
  { value: "8",         label: "Projects planned" },
  { value: "3",         label: "In active build"  },
  { value: "Chicago",   label: "Home base"         },
  { value: "Full-stack",label: "End to end"        },
];

function AboutContent() {
  const revealLeft  = useReveal();
  const revealRight = useReveal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
      {/* Left */}
      <div ref={revealLeft} className="reveal">
        <p
          className="text-xs tracking-[0.25em] uppercase mb-5 opacity-50"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          01 / About
        </p>

        <h2
          id="about-heading"
          className="leading-[1.0] tracking-tight mb-8"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Data systems &amp;
          <br />
          <em style={{ color: "var(--secondary)", fontStyle: "italic" }}>
            thoughtful design
          </em>
        </h2>

        <div
          className="space-y-5 text-[1.02rem] leading-relaxed"
          style={{ color: "var(--fg-muted)" }}
        >
          <p>
            I&apos;m a Chicago-based data engineer who builds products at the
            intersection of analytics pipelines and consumer experiences. I care
            about the full stack — from ingestion schemas and transformation logic
            to the interface someone actually uses.
          </p>
          <p>
            My passion projects live at the edge of data and culture: festival
            lineups, fantasy draft rooms, trivia nights, election maps. Each one
            is an excuse to build a real pipeline and ship something worth using.
          </p>
          <p>
            Outside of code I collect vinyl records, tend to too many houseplants,
            and maintain strong opinions about Chicago neighborhoods.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mt-10">
          {STATS.map(({ value, label }) => (
            <div key={label} className="stat-card">
              <p
                className="leading-none mb-1"
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                {value}
              </p>
              <p className="text-xs opacity-55">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — skills */}
      <div ref={revealRight} className="reveal reveal-delay-2">
        <p
          className="text-xs tracking-[0.25em] uppercase mb-6 opacity-50"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          Toolkit
        </p>

        <div className="grid grid-cols-2 gap-8">
          {SKILLS.map(({ group, items }) => (
            <div key={group}>
              <h3
                className="text-[0.6rem] tracking-widest uppercase mb-3 opacity-40"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {group}
              </h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
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
  );
}

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section relative overflow-hidden">
      <span className="section-num" aria-hidden="true">01</span>
      <AboutContent />
    </section>
  );
}
