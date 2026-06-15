"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ── Roles — clean fade cycle, no typos ─────────────────── */
const ROLES = [
  "Analytics & Data Strategy",
  "Pipeline Architect",
  "Forensic Data Analyst",
  "Product Builder",
  "Chicago Local",
];

/* ── Name typing script ──────────────────────────────────── */
// flash ops cycle through opts[] on each loop, typing fast and deleting fast.
// Three insertion points: after "A", after "And", after "nG".
type Op =
  | { t: "add";   ch: string; delay: number }
  | { t: "del";   delay: number }
  | { t: "wait";  ms: number }
  | { t: "erase"; delay: number }
  | { t: "loop" }
  | { t: "flash"; opts: string[]; typeMs: number; holdMs: number; delMs: number };

const SCRIPT: Op[] = [
  { t: "wait",  ms: 800 },
  { t: "add",   ch: "A",  delay: 0   },
  // ── compliment after "A" ──────────────────────────────────
  { t: "flash",
    opts:   ["mazing", "wesome", "mbitious", "rtisan", "daptable", "stute"],
    typeMs: 28, holdMs: 360, delMs: 24 },
  { t: "add",   ch: "n",  delay: 260 },
  { t: "add",   ch: "d",  delay: 180 },
  // ── compliment after "And" ────────────────────────────────
  { t: "flash",
    opts:   [" Driven", " Brilliant", " Gifted", " Bold", " Tenacious", " Relentless", " the GOAT"],
    typeMs: 28, holdMs: 400, delMs: 24 },
  { t: "wait",  ms: 68  },
  { t: "add",   ch: "R",  delay: 235 },
  { t: "add",   ch: "e",  delay: 145 },
  { t: "add",   ch: "W",  delay: 425 },
  { t: "add",   ch: "\n", delay: 550 },
  { t: "add",   ch: "n",  delay: 310 },
  { t: "add",   ch: "G",  delay: 235 },
  // ── compliment after "nG" ─────────────────────────────────
  { t: "flash",
    opts:   ["enius", "oat", "reat", "ifted", "uru", "old"],
    typeMs: 28, holdMs: 390, delMs: 24 },
  { t: "wait",  ms: 65  },
  { t: "add",   ch: "u",  delay: 195 },
  { t: "add",   ch: "y",  delay: 178 },
  { t: "add",   ch: "e",  delay: 215 },
  { t: "add",   ch: "n",  delay: 135 },
  { t: "wait",  ms: 3800 },
  { t: "erase", delay: 90 },
  { t: "wait",  ms: 700 },
  { t: "loop" },
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1534298261662-f8fdd25317db?q=80&w=2070&auto=format&fit=crop";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [nameDisplay, setNameDisplay] = useState({
    line1: "", line2: "", onLine2: false,
  });
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleIn,  setRoleIn]  = useState(false);
  const strRef   = useRef("");
  const loopRef  = useRef(0);
  const revealRef = useReveal();

  useEffect(() => { setMounted(true); }, []);

  /* ── Name script player ──────────────────────────────── */
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    strRef.current = "";

    const sync = () => {
      const s  = strRef.current;
      const nl = s.indexOf("\n");
      setNameDisplay({
        line1:   nl >= 0 ? s.slice(0, nl) : s,
        line2:   nl >= 0 ? s.slice(nl + 1) : "",
        onLine2: nl >= 0,
      });
    };

    let i = 0;

    const step = () => {
      if (cancelled) return;
      if (i >= SCRIPT.length) i = 0;
      const op = SCRIPT[i++];

      if (op.t === "add") {
        setTimeout(() => {
          if (cancelled) return;
          strRef.current += op.ch;
          sync();
          step();
        }, op.delay);

      } else if (op.t === "del") {
        setTimeout(() => {
          if (cancelled) return;
          strRef.current = strRef.current.slice(0, -1);
          sync();
          step();
        }, op.delay);

      } else if (op.t === "wait") {
        setTimeout(() => { if (!cancelled) step(); }, op.ms);

      } else if (op.t === "erase") {
        const eraseNext = () => {
          if (cancelled) return;
          if (strRef.current.length === 0) { step(); return; }
          strRef.current = strRef.current.slice(0, -1);
          sync();
          setTimeout(eraseNext, op.delay);
        };
        eraseNext();

      } else if (op.t === "flash") {
        const word = op.opts[loopRef.current % op.opts.length];
        let ci = 0;
        const typeNext = () => {
          if (cancelled) return;
          if (ci >= word.length) {
            setTimeout(() => {
              if (cancelled) return;
              let di = word.length;
              const delNext = () => {
                if (cancelled) return;
                if (di === 0) { step(); return; }
                strRef.current = strRef.current.slice(0, -1);
                sync();
                di--;
                setTimeout(delNext, op.delMs);
              };
              delNext();
            }, op.holdMs);
            return;
          }
          strRef.current += word[ci++];
          sync();
          setTimeout(typeNext, op.typeMs);
        };
        setTimeout(typeNext, op.typeMs);

      } else {
        // loop — increment counter, restart
        loopRef.current++;
        i = 0;
        step();
      }
    };

    step();
    return () => { cancelled = true; };
  }, [mounted]);

  /* ── Role fade cycle ─────────────────────────────────── */
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    let idx = 0;

    const run = () => {
      if (cancelled) return;
      setRoleIdx(idx);
      setRoleIn(true);

      setTimeout(() => {
        if (cancelled) return;
        setRoleIn(false);
        setTimeout(() => {
          if (cancelled) return;
          idx = (idx + 1) % ROLES.length;
          run();
        }, 440);
      }, 3000);
    };

    const t = setTimeout(run, 650);
    return () => { cancelled = true; clearTimeout(t); };
  }, [mounted]);

  const { line1, line2, onLine2 } = nameDisplay;

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex flex-col justify-center min-h-screen px-8 md:px-14 lg:px-24 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hero-bg-img" style={{ backgroundImage: `url('${HERO_IMG}')`, opacity: 0.68 }} />
      </div>

      <div ref={revealRef} className="reveal relative z-10 max-w-4xl">
        {/* Eyebrow */}
        <div className="eyebrow flex items-center gap-3 mb-8">
          <span
            className="text-xs tracking-[0.28em] uppercase opacity-50"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            Chicago, IL
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-[var(--border-strong)]"
            style={{ color: "var(--primary)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--primary)" }} aria-hidden="true" />
            Available
          </span>
        </div>

        {/* Name — both lines always occupy space, preserving 2-line height */}
        <h1
          className="leading-[1.0]"
          style={{
            fontFamily: "var(--font-major-mono), monospace",
            fontSize: "clamp(3rem, 8.5vw, 7.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            marginBottom: "0.4em",
          }}
          aria-label="Andrew Nguyen"
        >
          {/* Line 1 — always rendered; space holds height when empty */}
          <span className="hero-name-first block">
            {line1 || " "}
            {mounted && !onLine2 && <span className="typing-cursor" aria-hidden="true" />}
          </span>
          {/* Line 2 — always rendered; space holds height before typing reaches it */}
          <span className="hero-name-last block">
            {onLine2 ? line2 : " "}
            {onLine2 && <span className="typing-cursor" aria-hidden="true" />}
          </span>
        </h1>

        {/* Subtitle — clean fade in/out, no typos */}
        <div
          className="mb-10"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(1.05rem, 2.3vw, 1.65rem)",
            fontWeight: 400,
            minHeight: "2.8em",
            display: "flex",
            alignItems: "center",
          }}
          aria-live="polite"
          aria-label="Role description"
        >
          {mounted && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "color-mix(in srgb, var(--surface) 78%, transparent)",
                border: "1px solid var(--border-strong)",
                borderRadius: "2em",
                padding: "5px 18px",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: "var(--fg-muted)",
                letterSpacing: "-0.01em",
                opacity: roleIn ? 1 : 0,
                transform: roleIn ? "translateY(0px)" : "translateY(5px)",
                transition: "opacity 0.42s ease, transform 0.42s ease",
              }}
              aria-hidden={!roleIn}
            >
              {ROLES[roleIdx]}
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="hero-ctas flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all hover:-translate-y-0.5 focus-visible:ring-2"
            style={{
              background: "var(--primary)",
              color: "var(--bg)",
              fontFamily: "var(--font-display), sans-serif",
            }}
          >
            View Projects
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M1.5 6.5h10M7.5 2.5l4 4-4 4"/>
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium tracking-wide border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Say Hello
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-25"
        style={{ animation: "fade-up 1.8s ease infinite alternate" }}
      >
        <svg width="18" height="26" viewBox="0 0 18 26" fill="none" stroke="var(--fg)" strokeWidth="1.4" strokeLinecap="round">
          <rect x="1" y="1" width="16" height="24" rx="8"/>
          <line x1="9" y1="6" x2="9" y2="11"/>
        </svg>
      </div>
    </section>
  );
}
