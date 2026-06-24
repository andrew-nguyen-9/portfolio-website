"use client";

import { useState, useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ─── Data ──────────────────────────────────────────────── */
const STATS = [
  { target: 8,    prefix: "", suffix: "", label: "Projects in the family", sub: "each at its own an9.dev subdomain" },
  { target: 5,    prefix: "", suffix: "", label: "Things I dig into",       sub: "transit, food, sports, politics, music" },
  { target: 1,    prefix: "", suffix: "", label: "City it keeps circling",  sub: "Chicago — hence the CTA project"      },
  { target: 2026, prefix: "", suffix: "", label: "Year I'm building it",    sub: "learning out loud as I go"            },
];

// The throughlines — what I actually keep coming back to, not a service menu.
const DOMAINS = [
  { label: "Transit & cities",   desc: "How a city moves. CTA coverage, route design, and the case for transit that just works.",     color: "var(--highlight)" },
  { label: "Architecture",       desc: "How places are built and why some blocks feel alive. The structure under the streetscape.",   color: "var(--primary)"   },
  { label: "Cooking & food",     desc: "Trying things I've never eaten, then figuring out why the groceries cost what they cost.",    color: "var(--secondary)" },
  { label: "Politics & sports",  desc: "I follow both mostly for the statistics — funding flows, polls, box scores, and trends.",     color: "var(--highlight)" },
  { label: "Building with AI",   desc: "Learning to code, using AI to get ideas out of my head and onto a screen faster.",            color: "var(--secondary)" },
];

// What I'm building these projects with — and still learning. Grouped, filterable.
const SKILL_GROUPS = [
  {
    id: "languages", label: "Languages I write",
    items: ["Python", "SQL", "TypeScript", "JavaScript", "MATLAB"],
  },
  {
    id: "data", label: "Data & public APIs",
    items: ["BigQuery", "Supabase", "DuckDB", "dbt", "GTFS", "FRED API", "BLS API", "FEC API"],
  },
  {
    id: "web", label: "Web & build",
    items: ["Next.js", "React", "Tailwind", "D3.js", "Tone.js", "Web Audio API"],
  },
  {
    id: "ai", label: "Learning with AI",
    items: ["LLMs", "AI-assisted coding", "Prompt-driven prototyping", "Document parsing"],
  },
];

const INTERESTS = [
  "Public transit", "Urban planning", "Architecture", "Cooking",
  "Trying new restaurants", "Chicago", "Concerts", "Vinyl records",
  "Biking", "Traveling", "Skiing", "Trivia nights",
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
  // "all" shows every group; otherwise a single group is filtered in via the dropdown.
  const [filter, setFilter] = useState("all");
  const revealTop     = useReveal();
  const revealStats   = useReveal();
  const revealDomains = useReveal();
  const revealSkills  = useReveal();

  const shownGroups = filter === "all" ? SKILL_GROUPS : SKILL_GROUPS.filter(g => g.id === filter);

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
            Building small tools
            <br />
            for <CuriosityCycler />
          </h2>
        </div>

        <div className="flex flex-col justify-center gap-4 text-[1.01rem] leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          <p>
            I studied Mechanical Engineering at the University of Texas, but what I
            do for fun is build little tools to answer questions I can&apos;t stop
            asking. How well does the CTA actually cover Chicago? Where does Super PAC
            money really go? Why did that box of crackers get smaller? I&apos;m
            learning to code as I go, leaning on AI to get ideas out of my head and
            onto a screen faster.
          </p>
          <p>
            This site is two things at once — a portfolio and a home base for those
            projects. Each one lives at its own subdomain on{" "}
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "0.9em", color: "var(--primary)" }}>an9.dev</span>.
            I follow politics and sports mostly for the statistics, I cook to try
            things I&apos;ve never had, and I keep coming back to Chicago — which is
            why one of these is a love letter to the CTA.
          </p>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div ref={revealStats} className="reveal grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}
      </div>

      {/* ── Throughlines ─────────────────────────────────────── */}
      <div ref={revealDomains} className="reveal mb-14">
        <p className="text-xs tracking-[0.25em] uppercase mb-5 opacity-50"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
          What I keep coming back to
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DOMAINS.map(d => <DomainCard key={d.label} item={d} />)}
        </div>
      </div>

      {/* ── Skills + Interests ───────────────────────────────── */}
      <div ref={revealSkills} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Skills */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-5">
            <p className="text-xs tracking-[0.25em] uppercase opacity-50"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              What I build with
            </p>
            <label className="flex items-center gap-2">
              <span className="sr-only">Filter skills by category</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="skill-filter"
                aria-label="Filter skills by category"
              >
                <option value="all">All</option>
                {SKILL_GROUPS.map(g => (
                  <option key={g.id} value={g.id}>{g.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col gap-5">
            {shownGroups.map(group => (
              <div key={group.id}>
                <p className="text-[0.62rem] tracking-[0.18em] uppercase mb-2.5 opacity-40"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => <SkillPill key={item} label={item} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            Outside the projects
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
