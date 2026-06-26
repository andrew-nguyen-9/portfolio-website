"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ── Name ───────────────────────────────────────────────────
   The mixed casing is the Major Mono Display treatment for the
   display face, not a typo. Screen readers get the clean
   "Andrew Nguyen" via the aria-label on the <h1>. */
const NAME = { line1: "AndReW", line2: "nGuyen" };

const HERO_IMG =
  "https://images.unsplash.com/photo-1534298261662-f8fdd25317db?q=80&w=2070&auto=format&fit=crop";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState({ line1: "", line2: "", onLine2: false });
  const reduceRef = useRef(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal();

  useEffect(() => {
    reduceRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMounted(true);
  }, []);

  /* ── Type the name once, cleanly ─────────────────────────
     No cycle, no typos. Renders in full immediately under
     reduced motion (the typing is JS, so the CSS reduced-motion
     query can't stop it — guard here instead). */
  useEffect(() => {
    if (!mounted) return;

    if (reduceRef.current) {
      setDisplay({ line1: NAME.line1, line2: NAME.line2, onLine2: true });
      return;
    }

    let cancelled = false;

    const typeLine2 = (i: number) => {
      if (cancelled) return;
      setDisplay({ line1: NAME.line1, line2: NAME.line2.slice(0, i), onLine2: true });
      if (i < NAME.line2.length) setTimeout(() => typeLine2(i + 1), 58);
    };

    const typeLine1 = (i: number) => {
      if (cancelled) return;
      setDisplay({ line1: NAME.line1.slice(0, i), line2: "", onLine2: false });
      if (i < NAME.line1.length) setTimeout(() => typeLine1(i + 1), 62);
      else setTimeout(() => typeLine2(0), 180);
    };

    const t = setTimeout(() => typeLine1(0), 500);
    return () => { cancelled = true; clearTimeout(t); };
  }, [mounted]);

  /* ── Subtle pointer parallax on the hero image ───────────
     A few px of counter-movement gives the hero depth without drawing attention.
     Skipped under reduced motion (OS or A11y panel) and on touch (no pointer).
     rAF-throttled; the CSS transition smooths between samples. */
  useEffect(() => {
    if (!mounted || reduceRef.current) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const el = bgRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (document.documentElement.classList.contains("reduce-motion")) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        el.style.transform = `scale(1.06) translate(${dx * -14}px, ${dy * -14}px)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [mounted]);

  const { line1, line2, onLine2 } = display;

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex flex-col justify-center min-h-[100svh] px-8 md:px-14 lg:px-24 py-24 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          ref={bgRef}
          className="hero-bg-img"
          style={{
            backgroundImage: `url('${HERO_IMG}')`,
            opacity: 0.68,
            transform: "scale(1.06)",
            transition: "transform 0.3s ease-out",
            willChange: "transform",
          }}
        />
      </div>

      <div ref={revealRef} className="reveal relative z-10 max-w-4xl">
        {/* Eyebrow */}
        <div className="eyebrow flex items-center gap-3 mb-8">
          <span
            className="text-xs tracking-[0.28em] uppercase"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            Chicago, IL
          </span>
        </div>

        {/* Name — both lines always reserve their height */}
        <h1
          className="hero-name leading-[1.0]"
          style={{
            fontFamily: "var(--font-major-mono), monospace",
            fontSize: "clamp(3rem, 8.5vw, 7.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            marginBottom: "0.4em",
          }}
          aria-label="Andrew Nguyen"
        >
          <span className="hero-name-first block">
            {line1 || " "}
            {mounted && !onLine2 && <span className="typing-cursor" aria-hidden="true" />}
          </span>
          <span className="hero-name-last block">
            {onLine2 ? (line2 || " ") : " "}
            {onLine2 && <span className="typing-cursor" aria-hidden="true" />}
          </span>
        </h1>

        {/* CTAs */}
        <div className="hero-ctas flex flex-wrap gap-3 mt-10">
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
            style={{
              fontFamily: "var(--font-display), sans-serif",
              background: "color-mix(in srgb, var(--surface) 82%, transparent)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            Say Hello
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="hero-scroll-cue absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-25"
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
