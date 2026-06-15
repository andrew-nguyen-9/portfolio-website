"use client";

import { useState, useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ─── Data ──────────────────────────────────────────────── */
const STATS = [
  { target: 8,   prefix: "",   suffix: "",    label: "Active projects",    sub: "across 5 data domains"          },
  { target: 5,   prefix: "",   suffix: "",    label: "Data domains",       sub: "music, sports, civic, food, games" },
  { target: 10,  prefix: "",   suffix: "+",   label: "APIs integrated",   sub: "Spotify, OpenF1, TMDB & more"   },
  { target: 2026, prefix: "",  suffix: "",    label: "Current build year", sub: "ship season in progress"        },
];

const DOMAINS = [
  { label: "Music",   desc: "Festival lineups, artist intelligence, streaming metadata, audio experimentation",       color: "var(--secondary)"  },
  { label: "Sports",  desc: "Fantasy draft tools, NFL intelligence pipelines, F1 telemetry storyboards",             color: "var(--primary)"    },
  { label: "Civic",   desc: "CTA transit analysis, Super PAC funding flows, 2026 midterms election analytics",       color: "var(--highlight)"  },
  { label: "Games",   desc: "Daily trivia rooms with four formats — powered by Wikipedia, TMDB, Deezer & Sleeper",   color: "#9DB5A5"           },
  { label: "Food",    desc: "Shrinkflation tracking, CPI food categories, recipe discovery with real-time pricing",  color: "#C27848"           },
];

const SKILL_TABS = [
  {
    id: "languages", label: "Languages",
    items: ["Python", "SQL", "TypeScript", "JavaScript", "MATLAB"],
  },
  {
    id: "data", label: "Data & Cloud",
    items: ["BigQuery", "DataBricks", "GCP", "Supabase", "DuckDB", "Document AI", "dbt", "Tableau", "FRED API", "BLS API", "FEC API"],
  },
  {
    id: "analysis", label: "Analysis",
    items: ["Forensic Accounting", "Statistical Modeling", "OCR / PDF Parsing", "Damages Analysis", "LLMs", "Relativity", "OFAC Compliance", "HIPAA / VPPA"],
  },
  {
    id: "web", label: "Web & Build",
    items: ["Next.js", "React", "Tailwind", "D3.js", "Tone.js", "Web Audio API", "Spotify API", "OpenF1 API", "TMDB API", "Deezer API", "SolidWorks", "Jira", "Confluence"],
  },
];

const INTERESTS = [
  "Trivia Nights", "Concerts", "Vinyl Records", "Skiing",
  "Urban Planning", "Swimming", "Biking", "Traveling",
  "AMC A-Lister", "Dog Volunteering",
];

/* ─── Animated counter ──────────────────────────────────── */
function CountUp({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  const ran   = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || ran.current) return;
        ran.current = true;
        const dur = 1500;
        const t0  = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={elRef}>{prefix}{count}{suffix}</span>;
}

/* ─── Stat card ─────────────────────────────────────────── */
function StatCard({ stat }: { stat: typeof STATS[number] }) {
  return (
    <div className="stat-card flex flex-col gap-1.5">
      <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
        <CountUp target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
      </p>
      <p className="text-sm font-semibold tracking-tight" style={{ color: "var(--fg)" }}>{stat.label}</p>
      <p className="text-[0.62rem] leading-snug opacity-45" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
        {stat.sub}
      </p>
    </div>
  );
}

/* ─── Domain card ───────────────────────────────────────── */
function DomainCard({ item }: { item: typeof DOMAINS[number] }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-[var(--border)] transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]"
      style={{ background: "var(--surface)" }}>
      <span className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: item.color, fontFamily: "var(--font-jetbrains-mono), monospace" }}>
        {item.label}
      </span>
      <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>{item.desc}</p>
    </div>
  );
}

/* ─── Skill pill ─────────────────────────────────────────── */
function SkillPill({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs transition-all hover:border-[var(--primary)] hover:-translate-y-0.5 hover:text-[var(--fg)]"
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        color: "var(--fg-muted)",
        background: "transparent",
        border: "1px solid var(--border-strong)",
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </span>
  );
}

/* ─── Interest pill ──────────────────────────────────────── */
function InterestPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs transition-all hover:-translate-y-0.5"
      style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 500, color: "var(--secondary)", background: "color-mix(in srgb, var(--secondary) 9%, transparent)", border: "1px solid color-mix(in srgb, var(--secondary) 22%, transparent)" }}>
      {label}
    </span>
  );
}

/* ─── Main content ───────────────────────────────────────── */
function AboutContent() {
  const [activeTab, setActiveTab] = useState("languages");
  const revealTop     = useReveal();
  const revealStats   = useReveal();
  const revealDomains = useReveal();
  const revealSkills  = useReveal();

  const currentTab = SKILL_TABS.find(t => t.id === activeTab) ?? SKILL_TABS[0];

  return (
    <div>
      {/* ── Bio ──────────────────────────────────────────────── */}
      <div ref={revealTop} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-14">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-5 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            01 / About
          </p>
          <h2 id="about-heading" className="leading-[1.0] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Building data tools
            <br />
            <em style={{ color: "var(--secondary)", fontStyle: "italic" }}>around curiosity</em>
          </h2>
        </div>

        <div className="flex flex-col justify-center gap-4 text-[1.01rem] leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          <p>
            Every project starts with a question a spreadsheet can&apos;t answer. Which
            festival lineup has the most genre overlap? Which waiver wire pickup wins the
            week? Which Chicago bus route is bleeding riders? I build the data tools to
            find out — pipelines, dashboards, and interfaces all included.
          </p>
          <p>
            I work across five domains: music, sports, civic, games, and food. Each one
            lives at its own subdomain on <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "0.9em", color: "var(--primary)" }}>an9.dev</span>.
            Mechanical Engineering background, data career, product instincts — I care
            about the full stack from pipeline design to the interface someone actually
            sits with.
          </p>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div ref={revealStats} className="reveal grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}
      </div>

      {/* ── Project domains ──────────────────────────────────── */}
      <div ref={revealDomains} className="reveal mb-14">
        <p className="text-xs tracking-[0.25em] uppercase mb-5 opacity-50"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
          Project domains
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DOMAINS.map(d => <DomainCard key={d.label} item={d} />)}
        </div>
      </div>

      {/* ── Skills + Interests ───────────────────────────────── */}
      <div ref={revealSkills} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Skills */}
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            Toolkit
          </p>
          <div className="flex gap-5 mb-5 border-b border-[var(--border)]" role="tablist" aria-label="Skill categories">
            {SKILL_TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="pb-2.5 text-xs transition-colors whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  letterSpacing: "0.08em",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                  marginBottom: -1,
                  color: activeTab === tab.id ? "var(--primary)" : "var(--fg-subtle)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-start content-start" style={{ minHeight: 80 }}>
            {currentTab.items.map(item => <SkillPill key={item} label={item} />)}
          </div>
        </div>

        {/* Interests */}
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            Outside of work
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => <InterestPill key={i} label={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────── */
export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section relative">
      <span className="section-num" aria-hidden="true">01</span>
      <AboutContent />
    </section>
  );
}
