"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const ROLES = [
  "Data Engineer",
  "Product Builder",
  "Systems Thinker",
  "Chicago Local",
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1534298261662-f8fdd25317db?q=80&w=2070&auto=format&fit=crop";

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const revealRef = useReveal();

  useEffect(() => {
    setMounted(true);
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRoleIdx((i) => (i + 1) % ROLES.length);
        setVisible(true);
      }, 320);
    }, 3200);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex flex-col justify-center min-h-screen px-8 md:px-14 lg:px-24 overflow-hidden"
    >
      {/* ── Background record image ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Image layer — top-aligned */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${HERO_IMG}')`,
            backgroundPosition: "top center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: 0.5,
          }}
        />
        {/* Top fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, var(--bg) 0%, var(--bg) 6%, transparent 40%)",
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, var(--bg) 0%, var(--bg) 6%, transparent 45%)",
          }}
        />
        {/* Left + right fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, var(--bg) 0%, transparent 28%, transparent 72%, var(--bg) 100%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div ref={revealRef} className="reveal relative z-10 max-w-4xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
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
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--primary)" }}
              aria-hidden="true"
            />
            Available
          </span>
        </div>

        {/* Name */}
        <h1
          className="leading-[0.92]"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(3.8rem, 10vw, 9rem)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            marginBottom: "0.35em",
          }}
        >
          <span className="hero-name-first">Andrew</span>
          <br />
          <span className="hero-name-last">Nguyen</span>
        </h1>

        {/* Cycling role */}
        <div
          className="mb-10 h-[1.5em] overflow-hidden"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.75rem)",
            fontWeight: 400,
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {mounted && (
            <span
              style={{
                display: "inline-block",
                color: "var(--fg-muted)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.32s ease, transform 0.32s ease",
              }}
            >
              {ROLES[roleIdx]}
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
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
