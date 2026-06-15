"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ── Roles — clean fade cycle ────────────────────────────── */
const ROLES = [
  "Analytics & Data Strategy",
  "Pipeline Architect",
  "Forensic Data Analyst",
  "Product Builder",
  "Chicago Local",
];

/* ── Name & typo pools ──────────────────────────────────── */
const NAME = { line1: "AndReW", line2: "nGuyen" };

// Line-1 typos — all share "A" prefix with "AndReW", so the correction
// looks like someone hit the wrong key right after the first letter.
const LINE1 = [
  "Able",      "AGile",     "AleRt",     "AWARe",
  "ActiVe",    "AVid",      "AMbitious", "AdAptAble",
  "AutHentic", "AccuRAte",  "AdVAnced",  "AudAcious",
  "Astute",    "ARtistic",  "AutonoMous","Absolute",
];

// Line-2 typos — several share "n" prefix with "nGuyen".
const LINE2 = [
  "tHe GReAt", "nuAnced",    "tHe ApeX",   "nAtuRAl",
  "tHe sWift", "neWsWoRtHy", "tHe MAkeR",  "neXtGen",
  "tHe codeR", "notAble",
];

// Full 2-line typo combos — no correction, just held as-is.
const BOTH = [
  { line1: "And", line2: "ARcHitect"  },
  { line1: "And", line2: "stRAteGist" },
  { line1: "And", line2: "Relentless" },
  { line1: "And", line2: "unMAtcHed"  },
  { line1: "And", line2: "tHe GoAt"   },
  { line1: "And", line2: "innoVAtiVe" },
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
  const strRef     = useRef("");
  const cycleRef   = useRef(0);  // 0-4 → cycle through 5 types
  const l1Ref      = useRef(0);  // index into LINE1
  const l2Ref      = useRef(0);  // index into LINE2
  const bothRef    = useRef(0);  // index into BOTH
  const line1Ref   = useRef<HTMLSpanElement>(null);
  const line2Ref   = useRef<HTMLSpanElement>(null);
  const revealRef  = useReveal();

  useEffect(() => { setMounted(true); }, []);

  /* ── Name typing loop ──────────────────────────────────── */
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

    // Type str char-by-char at `delay` ms per char.
    const typeStr = (str: string, delay: number, cb: () => void) => {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        if (i >= str.length) { cb(); return; }
        strRef.current += str[i++];
        sync();
        setTimeout(tick, delay);
      };
      setTimeout(tick, delay);
    };

    // Erase everything at the end of strRef, char-by-char.
    const eraseAll = (delay: number, cb: () => void) => {
      const tick = () => {
        if (cancelled) return;
        if (strRef.current.length === 0) { cb(); return; }
        strRef.current = strRef.current.slice(0, -1);
        sync();
        setTimeout(tick, delay);
      };
      tick();
    };

    // Longest common prefix length between a and b.
    const lcpLen = (a: string, b: string) => {
      let i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i++;
      return i;
    };

    // After `typo` was just typed at the end of strRef, correct it to
    // `target`. A short "oh wait" pause fires first, then we erase back
    // to the shared prefix and retype from there — looks like a real mistake.
    const correctTo = (typo: string, target: string, cb: () => void) => {
      const prefix  = lcpLen(typo, target);
      const toErase = typo.length - prefix;
      const toType  = target.slice(prefix);

      setTimeout(() => {           // "oh wait, that's wrong"
        if (cancelled) return;
        let n = 0;
        const doErase = () => {
          if (cancelled) return;
          if (n >= toErase) {
            toType.length > 0 ? typeStr(toType, 50, cb) : cb();
            return;
          }
          strRef.current = strRef.current.slice(0, -1);
          sync();
          n++;
          setTimeout(doErase, 46);
        };
        doErase();
      }, 400);
    };

    // Hold for `ms` then erase everything, then call cb.
    const hold = (ms: number, cb: () => void) =>
      setTimeout(() => { if (!cancelled) eraseAll(44, cb); }, ms);

    const next = () => setTimeout(run, 380);

    const run = () => {
      if (cancelled) return;
      const type = cycleRef.current % 5;
      cycleRef.current++;

      /* ── 1: pure name ──────────────────────────────────── */
      if (type === 0) {
        typeStr(NAME.line1, 62, () => {
          strRef.current += "\n"; sync();
          typeStr(NAME.line2, 58, () => hold(3400, next));
        });

      /* ── 2: typoL1 → AndReW  +  nGuyen ─────────────────── */
      } else if (type === 1) {
        const t1 = LINE1[l1Ref.current++ % LINE1.length];
        typeStr(t1, 62, () =>
          correctTo(t1, NAME.line1, () => {
            strRef.current += "\n"; sync();
            typeStr(NAME.line2, 58, () => hold(3200, next));
          })
        );

      /* ── 3: AndReW  +  typoL2 → nGuyen ─────────────────── */
      } else if (type === 2) {
        const t2 = LINE2[l2Ref.current++ % LINE2.length];
        typeStr(NAME.line1, 62, () => {
          strRef.current += "\n"; sync();
          typeStr(t2, 62, () =>
            correctTo(t2, NAME.line2, () => hold(3200, next))
          );
        });

      /* ── 4: typoL1 → AndReW  +  typoL2 → nGuyen ───────── */
      } else if (type === 3) {
        const t1 = LINE1[l1Ref.current++ % LINE1.length];
        const t2 = LINE2[l2Ref.current++ % LINE2.length];
        typeStr(t1, 62, () =>
          correctTo(t1, NAME.line1, () => {
            strRef.current += "\n"; sync();
            typeStr(t2, 62, () =>
              correctTo(t2, NAME.line2, () => hold(3000, next))
            );
          })
        );

      /* ── 5: 2-line typo, no correction ─────────────────── */
      } else {
        const b = BOTH[bothRef.current++ % BOTH.length];
        typeStr(b.line1, 62, () => {
          strRef.current += "\n"; sync();
          typeStr(b.line2, 58, () => hold(2800, next));
        });
      }
    };

    const t = setTimeout(run, 600);
    return () => { cancelled = true; clearTimeout(t); };
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
      className="relative flex flex-col justify-center min-h-[100svh] px-8 md:px-14 lg:px-24 py-24 overflow-hidden"
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
            style={{
              color: "var(--primary)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              background: "color-mix(in srgb, var(--surface) 82%, transparent)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--primary)" }} aria-hidden="true" />
            Available
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
          <span ref={line1Ref} className="hero-name-first block">
            {line1 || " "}
            {mounted && !onLine2 && <span className="typing-cursor" aria-hidden="true" />}
          </span>
          <span ref={line2Ref} className="hero-name-last block">
            {onLine2 ? (line2 || " ") : " "}
            {onLine2 && <span className="typing-cursor" aria-hidden="true" />}
          </span>
        </h1>

        {/* Subtitle — clean fade in/out */}
        <div
          className="hero-subtitle mb-10"
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
