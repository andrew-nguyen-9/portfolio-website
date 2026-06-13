"use client";

import { useEffect, useRef, useState } from "react";

const ROLES = [
  "Data Engineer",
  "Product Builder",
  "Systems Thinker",
  "Chicago Local",
];

export default function Hero() {
  const [roleIdx,  setRoleIdx]  = useState(0);
  const [visible,  setVisible]  = useState(true);
  const [mounted,  setMounted]  = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    setMounted(true);

    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRoleIdx((i) => (i + 1) % ROLES.length);
        setVisible(true);
      }, 350);
    }, 3200);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex flex-col justify-center min-h-screen px-8 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 25% 60%, color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl">
        {/* Eyebrow */}
        <p
          className="font-mono text-xs tracking-[0.25em] uppercase mb-8 opacity-60"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          Chicago, IL ·{" "}
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--secondary)] align-middle mr-1" aria-hidden="true" />
          Available
        </p>

        {/* Name headline */}
        <h1
          className="font-display leading-[0.9] tracking-tight text-[clamp(3.5rem,9vw,8rem)] mb-6"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1",
          }}
        >
          Andrew
          <br />
          <span style={{ color: "var(--secondary)" }}>Nguyen</span>
        </h1>

        {/* Cycling role */}
        <div
          className="font-heading text-[clamp(1.1rem,2.8vw,1.9rem)] mb-10 h-[1.6em] overflow-hidden"
          style={{ fontFamily: "var(--font-ibm-plex-serif), Georgia, serif" }}
          aria-live="polite"
          aria-atomic="true"
        >
          {mounted && (
            <span
              style={{
                display: "inline-block",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
                color: "var(--fg-muted)",
              }}
            >
              {ROLES[roleIdx]}
            </span>
          )}
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5 focus-visible:ring-2"
            style={{
              background: "var(--primary)",
              color: "var(--bg)",
              fontFamily: "var(--font-geist-sans), sans-serif",
            }}
          >
            View Projects
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 7h10M8 3l4 4-4 4" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium tracking-wide border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Say Hello
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        style={{ animation: "fade-up 2s ease infinite alternate" }}
      >
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" stroke="var(--fg)" strokeWidth="1.4" strokeLinecap="round">
          <rect x="1" y="1" width="18" height="26" rx="9" />
          <line x1="10" y1="7" x2="10" y2="12" />
        </svg>
      </div>
    </section>
  );
}
