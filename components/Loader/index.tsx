"use client";

import { useEffect, useRef } from "react";

// ─── Easing ──────────────────────────────────────────────────────
const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIO   = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const lerp     = (a: number, b: number, t: number) => a + (b-a)*t;
const clamp01  = (x: number) => Math.min(1, Math.max(0, x));
const prog     = (e: number, s: number, en: number) => clamp01((e-s)/(en-s));

// Spin starts at 1400ms, 3s/rotation → 2 full rotations complete at 1400+6000=7400ms
const SPIN_START_MS = 1400;
const SPIN_PERIOD_MS = 3000;
const TOTAL_MS = SPIN_START_MS + SPIN_PERIOD_MS * 2; // 7400ms
const GROOVE_N  = 24;
const OUTER_R   = 130;
const INNER_R   = 50;

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const svgRef       = useRef<SVGSVGElement>(null);
  const rafRef       = useRef<number>(0);
  const t0Ref        = useRef<number | null>(null);
  const speedMultRef = useRef(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }
    if (sessionStorage.getItem("loader-seen")) {
      onComplete();
      return;
    }

    const svg = svgRef.current;
    if (!svg) return;
    const svgEl = svg;

    // Build groove circles dynamically
    const groovesGroup = svg.querySelector<SVGGElement>("#grooves");
    if (groovesGroup) {
      const step = (OUTER_R - INNER_R) / GROOVE_N;
      for (let i = 0; i < GROOVE_N; i++) {
        const r  = INNER_R + i * step;
        const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        el.setAttribute("r",            r.toFixed(1));
        el.setAttribute("fill",         "none");
        // Color comes from CSS tokens (.ldr-groove-*) so the loader themes; width stays
        // an attribute (geometry, not color).
        el.setAttribute("class",        i % 5 === 0 ? "ldr-groove-major" : "ldr-groove-minor");
        el.setAttribute("stroke-width", i % 5 === 0 ? "1.0" : "0.5");
        el.setAttribute("opacity",      "0");
        el.id = `groove-${i}`;
        groovesGroup.appendChild(el);
      }
    }

    const wave = svg.querySelector<SVGPathElement>("#wave");
    if (wave) {
      const len = wave.getTotalLength();
      wave.style.strokeDasharray  = `${len}`;
      wave.style.strokeDashoffset = `${len}`;
    }

    const record     = svg.querySelector<SVGGElement>("#record");
    const recordBody = svg.querySelector<SVGGElement>("#record-body");
    const label      = svg.querySelector<SVGGElement>("#label-group");
    const mono       = svg.querySelector<SVGGElement>("#mono");
    const counter    = svg.querySelector<SVGTextElement>("#counter");

    // ── Page-load speed tracking ─────────────────────────────
    // When the page loads, scale up the animation speed so the
    // loader exits proportionally faster on fast connections.
    const MIN_ANIM_MS = 2800; // minimum duration to preserve visual quality
    const onLoad = () => {
      const t0 = t0Ref.current ?? performance.now();
      const loadElapsed = performance.now() - t0;
      const targetFinish = Math.max(MIN_ANIM_MS, loadElapsed + 450);
      speedMultRef.current = TOTAL_MS / targetFinish;
    };
    if (document.readyState === "complete") {
      speedMultRef.current = TOTAL_MS / MIN_ANIM_MS;
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    let spinning = false;

    function frame(ts: number) {
      if (!t0Ref.current) t0Ref.current = ts;
      const e  = ts - t0Ref.current;
      const ve = e * speedMultRef.current; // virtual elapsed — compresses with load speed

      if (counter) {
        const pct = Math.min(100, Math.round((ve / TOTAL_MS) * 100));
        counter.textContent = String(pct).padStart(2, "0");
      }

      // ── Phase 1: Waveform draws in (0–800ms) ──────────────────
      if (wave) {
        const p1 = prog(ve, 0, 800);
        const len = parseFloat(wave.style.strokeDasharray || "420");
        wave.setAttribute("opacity", String(clamp01(p1 * 3)));
        wave.style.strokeDashoffset = String(len * (1 - easeIO(p1)));

        const p1f = prog(ve, 680, 1100);
        if (p1f > 0) wave.setAttribute("opacity", String(clamp01(1 - easeOut3(p1f))));
      }

      // ── Phase 2: Grooves stagger in (800–1700ms) ──────────────
      for (let i = 0; i < GROOVE_N; i++) {
        const gs = 800 + (i / GROOVE_N) * 550;
        const gp = prog(ve, gs, gs + 320);
        const g  = svgEl.querySelector<SVGCircleElement>(`#groove-${i}`);
        if (g) {
          const max = i % 5 === 0 ? 0.7 : i % 2 === 0 ? 0.5 : 0.3;
          g.setAttribute("opacity", String(easeOut3(gp) * max));
        }
      }

      // ── Phase 2–3: Record scales in (800–2400ms) ──────────────
      if (record) {
        const p2 = prog(ve, 800, 2400);
        const sc = lerp(0.15, 1, easeOut3(p2));
        record.setAttribute("opacity",   String(clamp01(p2 * 2.2)));
        record.setAttribute("transform", `scale(${sc.toFixed(4)})`);
      }

      // Start spinning clockwise at SPIN_START_MS
      if (!spinning && ve > SPIN_START_MS && recordBody) {
        recordBody.classList.add("vinyl-spinning");
        if (label) label.classList.add("label-counter-spin");
        if (mono) mono.classList.add("vinyl-spinning"); // logo also spins clockwise
        spinning = true;
      }

      // ── Phase 4: Monogram fades in (2600–3200ms) ──────────────
      if (mono) {
        const p4 = prog(ve, 2600, 3200);
        mono.setAttribute("opacity", String(easeOut3(p4).toFixed(4)));
      }

      // Exit when virtual time passes end of animation
      if (ve < TOTAL_MS + 300) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        sessionStorage.setItem("loader-seen", "1");
        const loaderEl = document.getElementById("loader");
        if (loaderEl) {
          loaderEl.classList.add("done");
          loaderEl.addEventListener("animationend", onComplete, { once: true });
        } else {
          onComplete();
        }
      }
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("load", onLoad);
    };
  }, [onComplete]);

  return (
    <div id="loader" role="status" aria-label="Loading">
      <svg
        ref={svgRef}
        viewBox="-240 -155 480 310"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#89AD9E" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#89AD9E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Vinyl record (phases 2–4) ────────────────────── */}
        <g id="record" opacity="0" style={{ transformOrigin: "center" }}>
          {/* Spinning body */}
          <g id="record-body" style={{ transformOrigin: "center" }}>
            <circle r="130" className="ldr-disc" />
            <circle r="129" fill="none" className="ldr-disc-edge" strokeWidth="1.5" />
            <g id="grooves" />
            <circle r="52" fill="none" className="ldr-disc-inner" strokeWidth="0.6" />
          </g>

          {/* Label — counter-rotates to stay upright */}
          <g id="label-group" style={{ transformOrigin: "center" }}>
            <circle r="50" className="ldr-label" />
            <circle r="38" fill="none" className="ldr-label-ring" strokeWidth="0.5" opacity="0.6" />
            <circle r="26" fill="none" className="ldr-label-ring" strokeWidth="0.5" opacity="0.4" />
            <circle r="6"  className="ldr-spindle" />
            <circle r="5.2" fill="none" className="ldr-spindle-edge" strokeWidth="0.8" />
          </g>

          {/* ── AN Monogram (phase 4) — sits above label, spins with record ── */}
          <g id="mono" opacity="0" style={{ transformOrigin: "center" }}>
            <image
              href="/an-logo.png"
              x="-35" y="-35"
              width="70" height="70"
            />
          </g>
        </g>

        {/* ── Waveform (phase 1) ───────────────────────────── */}
        <path
          id="wave"
          d={[
            "M -160,0",
            "C -152,-4 -148,-18 -143,-36 C -138,-54 -133,-48 -128,-30",
            "C -123,-12 -120,-5  -117,0  C -114,5  -110,16  -105,34",
            "C -100,52 -95,56  -90,40   C -85,24  -82,9   -80,0",
            "C -78,-9 -75,-22  -69,-44  C -63,-66 -58,-60 -53,-40",
            "C -48,-20 -46,-8  -44,0    C -42,8   -38,22  -33,46",
            "C -28,70 -23,66  -18,46    C -13,26  -10,10  -8,0",
            "C -6,-10 -3,-26  2,-44     C 7,-62   12,-58  17,-38",
            "C 22,-18 24,-7  26,0       C 28,7    31,22   36,46",
            "C 41,70 46,64   51,44      C 56,24   59,9    61,0",
            "C 63,-9 66,-24  71,-40     C 76,-56  81,-48  86,-30",
            "C 91,-12 94,-4  96,0       C 98,4    101,14  106,30",
            "C 111,44 116,46 121,30     C 126,14  130,4   134,0",
            "C 140,-6 148,-18 160,0",
          ].join(" ")}
          className="ldr-wave"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          opacity="0"
        />

        {/* ── Progress counter ─────────────────────────────── */}
        <text
          id="counter"
          x="0" y="145"
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono), 'Courier New', monospace"
          fontSize="9"
          className="ldr-counter"
          letterSpacing="2"
          opacity="0.7"
        >
          00
        </text>
      </svg>
    </div>
  );
}
