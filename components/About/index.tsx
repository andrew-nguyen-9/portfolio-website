"use client";

import { useState, useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { projects } from "@/content/projects";
import Tooltip from "@/components/Tooltip";
import NowPlaying from "./NowPlaying";
import SpotifyPanel from "./SpotifyPanel";

/* ─── Skill groups ──────────────────────────────────────────
   Rebuilt from the real libraries across the project repos (Soundcheck, BlitzBoard,
   Behind the Ballot, MetroTrack, Parlor). Grouped: languages · data & public APIs ·
   web & build · AI. Each skill carries an accessible tooltip describing what it's for
   / which builds use it. Shown all at once — no slider. */
interface Skill {
  name: string;
  tip: string;
}
interface SkillGroup {
  id: string;
  label: string;
  items: Skill[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages I Write",
    items: [
      { name: "Python", tip: "ETL pipelines, data enrichment, and forecasting across every project." },
      { name: "SQL", tip: "Postgres + DuckDB queries — the bronze→silver→gold transforms behind the data." },
      { name: "TypeScript", tip: "Strict typing for every Next.js and Astro frontend in the family." },
      { name: "JavaScript", tip: "The runtime under it all: browser glue, scripting, and build tooling." },
      { name: "MATLAB", tip: "Numerical work carried over from my mechanical-engineering background." },
    ],
  },
  {
    id: "data",
    label: "Data & Public APIs",
    items: [
      { name: "Supabase", tip: "Postgres + auto-REST + RLS — the cached data store for Soundcheck, BlitzBoard, and Parlor." },
      { name: "PostGIS", tip: "Spatial queries for MetroTrack's route and coverage mapping." },
      { name: "DuckDB", tip: "In-process analytics engine under the dbt transform layer." },
      { name: "dbt", tip: "Tested bronze→silver→gold models that shape data before it reaches the app." },
      { name: "BigQuery", tip: "Warehouse-scale SQL for larger analytical slices." },
      { name: "Spotify API", tip: "Lineup and streaming stats for Soundcheck; the now-playing signal here." },
      { name: "Deezer API", tip: "Track previews and artist metadata for Soundcheck and Parlor's jukebox." },
      { name: "Sleeper API", tip: "Live league and draft state for BlitzBoard." },
      { name: "nflverse", tip: "Historical NFL play-by-play and projections for BlitzBoard." },
      { name: "TMDB API", tip: "Film and TV posters and facts for Parlor's gallery round." },
      { name: "Wikipedia API", tip: "The raw fact source Parlor's nightly question bank is forged from." },
      { name: "FEC API", tip: "Campaign-finance and Super PAC filings for Behind the Ballot." },
      { name: "Census API", tip: "District demographics for Behind the Ballot." },
      { name: "FRED API", tip: "Federal economic indicators underneath the political and grocery data." },
      { name: "BLS API", tip: "Labor and price data — the CPI numbers behind the cost stories." },
      { name: "GTFS", tip: "Transit schedules and stops feeding MetroTrack's coverage maps." },
      { name: "Chicago Data Portal", tip: "Open civic datasets powering the Chicago transit work." },
    ],
  },
  {
    id: "web",
    label: "Web & Build",
    items: [
      { name: "Next.js", tip: "App Router frontends for the portfolio, Soundcheck, BlitzBoard, and Parlor." },
      { name: "Astro", tip: "Static-first islands powering Behind the Ballot and MetroTrack." },
      { name: "React", tip: "The component layer across every interactive frontend." },
      { name: "Tailwind", tip: "Utility CSS plus design tokens — the shared styling system." },
      { name: "Framer Motion", tip: "Reveal and transition motion, always reduce-motion guarded." },
      { name: "D3.js", tip: "Custom data viz for finance flows and transit charts." },
      { name: "MapLibre", tip: "Vector basemaps and route overlays for MetroTrack." },
      { name: "deck.gl", tip: "GPU map layers for dense transit and coverage data." },
      { name: "ECharts", tip: "Funding and time-series charts across the civic projects." },
      { name: "Tone.js", tip: "Synthesized audio for the cooking-music experiments." },
      { name: "Vercel", tip: "Hosting and preview deploys for the Next.js apps." },
      { name: "GitHub Actions", tip: "Scheduled cron ETL that refreshes each project's data nightly." },
    ],
  },
  {
    id: "ai",
    label: "Learning With AI",
    items: [
      { name: "Claude API", tip: "AI-generated festival insights in Soundcheck — and building with Claude Code." },
      { name: "AI-Assisted Coding", tip: "Getting ideas from head to screen faster with LLM pair-programming." },
      { name: "Prompt-Driven Prototyping", tip: "Spec → working slice loops when shaping a new feature." },
      { name: "Vercel AI SDK", tip: "The agent and tool-call layer for the planned Data Concierge." },
    ],
  },
];

/* ─── Stats (all derived from the project family / skill list — never hardcoded) ─── */
const familyCount = projects.length;
const inBuild = projects.filter((p) => p.status !== "planned").length;
// Distinct public-data APIs wired across the family — every tag that names an API.
const apiCount = new Set(
  projects.flatMap((p) => p.tags).filter((t) => /\bAPI\b/.test(t))
).size;
// Distinct tools/libraries I build with, across every skill group.
const toolCount = new Set(SKILL_GROUPS.flatMap((g) => g.items.map((s) => s.name))).size;

const STATS = [
  { target: familyCount, prefix: "", suffix: "", label: "Projects in the family", sub: "each at its own an9.dev subdomain" },
  { target: inBuild,     prefix: "", suffix: "", label: "In active build",        sub: "live or shipping now"             },
  { target: apiCount,    prefix: "", suffix: "", label: "Public data APIs wired", sub: "real sources, not mock data"      },
  { target: toolCount,   prefix: "", suffix: "", label: "Tools in the stack",     sub: "languages, data, web, and AI"     },
];

// The throughlines — what I actually keep coming back to, not a service menu.
const DOMAINS = [
  { label: "Transit & cities",   desc: "How a city moves. CTA coverage, route design, and the case for transit that just works.",     color: "var(--highlight)" },
  { label: "Architecture",       desc: "How places are built and why some blocks feel alive. The structure under the streetscape.",   color: "var(--primary)"   },
  { label: "Cooking & food",     desc: "Trying things I've never eaten, then figuring out why the groceries cost what they cost.",    color: "var(--secondary)" },
  { label: "Politics & sports",  desc: "I follow both mostly for the statistics — funding flows, polls, box scores, and trends.",     color: "var(--highlight)" },
  { label: "Building with AI",   desc: "Learning to code, using AI to get ideas out of my head and onto a screen faster.",            color: "var(--secondary)" },
];

const INTERESTS = [
  "Public Transit", "Urban Planning", "Architecture", "Cooking",
  "Trying New Restaurants", "Chicago", "Concerts", "Vinyl Records",
  "Biking", "Swimming", "Traveling", "Trivia Nights", "Houseplants",
];

/* ─── Rotating curiosity word — types / deletes / retypes a topic ─── */
const CURIOSITY_WORDS = [
  "Chicago", "transit", "elections", "good food", "race weekends",
  "festival lineups", "cities that work", "the statistics",
  "how things get built", "the questions I keep asking",
];

function CuriosityCycler() {
  const [text, setText] = useState(CURIOSITY_WORDS[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Respect reduced motion — keep the static word
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("reduce-motion")
    ) return;
    setMounted(true);

    let cancelled = false;
    let wi = 0;          // word index
    const buf = { s: CURIOSITY_WORDS[0] };

    const type = (full: string, done: () => void) => {
      let i = buf.s.length;
      const tick = () => {
        if (cancelled) return;
        if (i >= full.length) { done(); return; }
        buf.s = full.slice(0, i + 1);
        setText(buf.s);
        i++;
        setTimeout(tick, 38);
      };
      tick();
    };
    const del = (done: () => void) => {
      const tick = () => {
        if (cancelled) return;
        if (buf.s.length === 0) { done(); return; }
        buf.s = buf.s.slice(0, -1);
        setText(buf.s);
        setTimeout(tick, 26);
      };
      tick();
    };
    const loop = () => {
      if (cancelled) return;
      setTimeout(() => {
        del(() => {
          wi = (wi + 1) % CURIOSITY_WORDS.length;
          type(CURIOSITY_WORDS[wi], loop);
        });
      }, 2400);
    };

    loop();
    return () => { cancelled = true; };
  }, []);

  return (
    <em style={{ color: "var(--secondary)", fontStyle: "italic" }}>
      {text}
      {mounted && <span className="typing-cursor" aria-hidden="true" />}
    </em>
  );
}

/* ─── Animated counter ──────────────────────────────────── */
function CountUp({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  const ran   = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    // Reduced motion — show the final value, skip the count-up
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("reduce-motion")
    ) { setCount(target); return; }
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
      <p className="text-[0.62rem] leading-snug eyebrow" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
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

/* ─── Skill pill ─────────────────────────────────────────────
   The pill is the tooltip trigger: tabbable so the description is reachable by
   keyboard and tap (mobile), not just hover. Tooltip is the shared primitive. */
function SkillPill({ skill }: { skill: Skill }) {
  return (
    <Tooltip content={skill.tip} rich tabbable>
      <span
        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs transition-all hover:border-[var(--primary)] hover:-translate-y-0.5 hover:text-[var(--fg)]"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--fg-muted)",
          background: "transparent",
          border: "1px solid var(--border-strong)",
          letterSpacing: "0.03em",
          cursor: "help",
        }}
      >
        {skill.name}
      </span>
    </Tooltip>
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
  const revealTop     = useReveal();
  const revealStats   = useReveal();
  const revealDomains = useReveal();
  const revealSkills  = useReveal();

  return (
    <div>
      {/* ── Bio ──────────────────────────────────────────────── */}
      <div ref={revealTop} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-14">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-5 eyebrow"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            01 / About
          </p>
          <h2 id="about-heading" className="leading-[1.0] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Building tools
            <br />
            for <CuriosityCycler />
          </h2>
        </div>

        <div className="flex flex-col justify-center gap-4 text-[1.01rem] leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          <p>
            Howdy, my name is Andrew Nguyen, and welcome to my website! This website
            is where I share the projects I build, the ideas I&apos;m exploring, and the
            lessons I pick up along the way. Some projects are polished, some are
            experiments, and some are simply excuses to learn a new technology.
            Together, they document my journey through data engineering, analytics,
            software development, automation, and AI, while reflecting a simple
            philosophy: the best way to learn is to build something real.
          </p>
          <p>
            Although my projects cover a wide range of topics, they all share the same
            goal: making complicated information easier to understand and more
            enjoyable to explore. I like combining data engineering, software
            development, analytics, and AI to build tools that solve real problems,
            whether that&apos;s generating personalized festival schedules, analyzing
            election trends, improving fantasy football decisions, visualizing transit
            systems, or creating interactive games. For me, every project starts with
            curiosity and ends with a deeper understanding of both the technology
            behind it and the people who use it.
          </p>
          <p>
            This website is meant to be explored. Every project has its own corner of
            the workshop, complete with its goals, technical challenges, and the ideas
            that shaped it. Some projects are polished, others are still evolving, but
            each represents a step in my journey as a builder. If something catches
            your eye, dive in and take a look around. You might even find inspiration
            for your own next project!
          </p>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div ref={revealStats} className="reveal grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}
      </div>

      {/* ── Throughlines ─────────────────────────────────────── */}
      <div ref={revealDomains} className="reveal mb-14">
        <p className="text-xs tracking-[0.25em] uppercase mb-5 eyebrow"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
          What I keep coming back to
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DOMAINS.map(d => <DomainCard key={d.label} item={d} />)}
        </div>
      </div>

      {/* ── Skills + Interests ───────────────────────────────── */}
      <div ref={revealSkills} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Skills — all groups shown at once, each pill tooltipped. */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <p className="text-xs tracking-[0.25em] uppercase eyebrow"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              What I build with
            </p>
            <span className="text-[0.62rem] tracking-[0.12em] uppercase eyebrow"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              {toolCount} tools
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {SKILL_GROUPS.map(group => (
              <div key={group.id}>
                <p className="text-[0.62rem] tracking-[0.18em] uppercase mb-2.5 eyebrow"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => <SkillPill key={item.name} skill={item} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-4 eyebrow"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            Outside the projects
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => <InterestPill key={i} label={i} />)}
          </div>

          {/* Live music signal — hides itself when unconfigured/empty (see NowPlaying). */}
          <div className="mt-6">
            <NowPlaying />
            <SpotifyPanel />
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
      <span className="section-num" data-num="01" aria-hidden="true" />
      <AboutContent />
    </section>
  );
}
