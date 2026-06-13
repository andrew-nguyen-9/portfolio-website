"use client";

import { useEffect, useRef, useState } from "react";

// ─── Monogram paths (geometric AN, designed at ±22 x ±18) ────────
// A: left leg, right leg, crossbar
// N: left post, diagonal, right post
// Sharing center space at x≈0 with 2-unit gap between letters
const MONO_PATHS = [
  "M -21,18 L -8,-18",     // A left leg
  "M -8,-18 L 4,18",       // A right leg
  "M -16.5,3 L -1,3",      // A crossbar (at 58% height)
  "M 7,-18 L 7,18",        // N left post
  "M 7,-18 L 22,18",       // N diagonal
  "M 22,-18 L 22,18",      // N right post
];

// ─── Plant leaf bezier paths ─────────────────────────────────────
// Left plant: bottom-left corner, 3 leaves of varying height/angle
// Coordinate space: SVG viewBox "-240 -155 480 310"
// Bottom edge ≈ y=155, left edge ≈ x=-240
const LEFT_LEAVES = [
  // Leaf 1: tall, leans left (main)
  `M -210,155
   C -218,125 -228,88  -222,58
   C -218,38  -208,36  -202,52
   C -198,64  -200,95  -204,128
   Z`,
  // Leaf 2: medium, points up-right
  `M -195,155
   C -200,130 -210,100 -205,74
   C -201,55  -192,53  -188,68
   C -184,82  -186,112 -190,140
   Z`,
  // Leaf 3: shorter, arcs right
  `M -178,155
   C -180,138 -183,116 -178,97
   C -174,82  -165,80  -162,93
   C -159,105 -162,128 -168,148
   Z`,
];

// Vein lines for each leaf (single center line)
const LEFT_VEINS = [
  "M -210,155 C -215,125 -220,88 -212,52",
  "M -195,155 C -198,125 -204,95  -196,68",
  "M -178,155 C -179,135 -180,112 -170,93",
];

// Right leaves are the mirror of left (x = -x)
const mirrorPath = (d: string) =>
  d.replace(/-?\d+\.?\d*/g, (n, offset, str) => {
    // Only negate x-coordinates (every other number in pairs)
    // Simple approach: negate all numbers preceded by space or M/C/L/Z
    return n; // placeholder — handled by SVG transform="scale(-1,1)"
  });

// ─── Easing ──────────────────────────────────────────────────────
const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIO   = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const lerp     = (a: number, b: number, t: number) => a + (b-a)*t;
const clamp01  = (x: number) => Math.min(1, Math.max(0, x));
const prog     = (e: number, s: number, en: number) => clamp01((e-s)/(en-s));

const TOTAL_MS  = 3600;
const GROOVE_N  = 24;
const OUTER_R   = 130;
const INNER_R   = 50;

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const svgRef       = useRef<SVGSVGElement>(null);
  const rafRef       = useRef<number>(0);
  const t0Ref        = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Skip if already seen this session
    if (sessionStorage.getItem("loader-seen")) {
      onComplete();
      return;
    }

    const svg = svgRef.current;
    if (!svg) return;
    // Capture non-null ref for use inside RAF closure
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
        el.setAttribute("stroke",       i % 5 === 0 ? "#4a6055" : "#2e3d35");
        el.setAttribute("stroke-width", i % 5 === 0 ? "1.0" : "0.5");
        el.setAttribute("opacity",      "0");
        el.id = `groove-${i}`;
        groovesGroup.appendChild(el);
      }
    }

    // Set up waveform dash
    const wave = svg.querySelector<SVGPathElement>("#wave");
    if (wave) {
      const len = wave.getTotalLength();
      wave.style.strokeDasharray  = `${len}`;
      wave.style.strokeDashoffset = `${len}`;
    }

    const record    = svg.querySelector<SVGGElement>("#record");
    const recordBody= svg.querySelector<SVGGElement>("#record-body");
    const label     = svg.querySelector<SVGGElement>("#label-group");
    const mono      = svg.querySelector<SVGGElement>("#mono");
    const llamp     = svg.querySelector<SVGElement>("#lamp-l");
    const rlamp     = svg.querySelector<SVGElement>("#lamp-r");
    const pleft     = svg.querySelector<SVGGElement>("#plant-l");
    const pright    = svg.querySelector<SVGGElement>("#plant-r");
    const counter   = svg.querySelector<SVGTextElement>("#counter");

    let spinning = false;

    function frame(ts: number) {
      if (!t0Ref.current) t0Ref.current = ts;
      const e = ts - t0Ref.current;

      // Progress counter
      if (counter) {
        const pct = Math.min(100, Math.round((e / TOTAL_MS) * 100));
        counter.textContent = String(pct).padStart(2, "0");
      }

      // ── Phase 1: Waveform draws in (0–800ms) ──────────────────
      if (wave) {
        const p1 = prog(e, 0, 800);
        const len = parseFloat(wave.style.strokeDasharray || "420");
        wave.setAttribute("opacity", String(clamp01(p1 * 3)));
        wave.style.strokeDashoffset = String(len * (1 - easeIO(p1)));

        // Fade waveform out (680–1100ms)
        const p1f = prog(e, 680, 1100);
        if (p1f > 0) wave.setAttribute("opacity", String(clamp01(1 - easeOut3(p1f))));
      }

      // ── Phase 2: Grooves stagger in (800–1700ms) ──────────────
      for (let i = 0; i < GROOVE_N; i++) {
        const gs = 800 + (i / GROOVE_N) * 550;
        const gp = prog(e, gs, gs + 320);
        const g  = svgEl.querySelector<SVGCircleElement>(`#groove-${i}`);
        if (g) {
          const max = i % 5 === 0 ? 0.7 : i % 2 === 0 ? 0.5 : 0.3;
          g.setAttribute("opacity", String(easeOut3(gp) * max));
        }
      }

      // ── Phase 2–3: Record fades + scales up (800–2400ms) ──────
      if (record) {
        const p2  = prog(e, 800, 2400);
        const sc  = lerp(0.15, 1, easeOut3(p2));
        record.setAttribute("opacity",   String(clamp01(p2 * 2.2)));
        record.setAttribute("transform", `scale(${sc.toFixed(4)})`);
      }

      // Start spinning when record is ~70% scaled in
      if (!spinning && e > 1400 && recordBody) {
        recordBody.classList.add("vinyl-spinning");
        if (label) label.classList.add("label-counter-spin");
        spinning = true;
      }

      // ── Phase 4: Monogram draws in (2600–3100ms) ──────────────
      if (mono) {
        const p4 = prog(e, 2600, 3100);
        mono.setAttribute("opacity", String(easeOut3(p4).toFixed(4)));
      }

      // ── Phase 5: Lamp glows (2900–3450ms) ─────────────────────
      const p5l = prog(e, 2900, 3450);
      if (llamp) llamp.setAttribute("opacity", String(easeOut3(p5l).toFixed(4)));
      if (rlamp) rlamp.setAttribute("opacity", String(easeOut3(p5l).toFixed(4)));

      // ── Phase 5: Plants rise (3050–3600ms) ────────────────────
      const p5p = prog(e, 3050, 3600);
      const py  = lerp(22, 0, easeOut3(p5p));
      if (pleft) {
        pleft.setAttribute("opacity",   String(easeOut3(p5p).toFixed(4)));
        pleft.setAttribute("transform", `translate(0, ${py.toFixed(2)})`);
      }
      if (pright) {
        pright.setAttribute("opacity",   String(easeOut3(p5p).toFixed(4)));
        pright.setAttribute("transform", `translate(0, ${py.toFixed(2)})`);
      }

      if (e < TOTAL_MS + 300) {
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
    };
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <div id="loader" role="status" aria-label="Loading">
      <svg
        ref={svgRef}
        viewBox="-240 -155 480 310"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: "min(560px, 90vw)", height: "auto" }}
      >
        <defs>
          {/* Lamp ambient gradients */}
          <radialGradient id="lg-l" cx="0%" cy="65%" r="85%">
            <stop offset="0%" stopColor="#E2BE6D" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#E2BE6D" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lg-r" cx="100%" cy="65%" r="85%">
            <stop offset="0%" stopColor="#E2BE6D" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#E2BE6D" stopOpacity="0" />
          </radialGradient>
          {/* Center record glow */}
          <radialGradient id="rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8B8A1" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#A8B8A1" stopOpacity="0" />
          </radialGradient>
          {/* Leaf gradients */}
          <linearGradient id="leaf-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3d5247" />
            <stop offset="100%" stopColor="#506354" />
          </linearGradient>
          <linearGradient id="leaf-d" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#506354" />
            <stop offset="100%" stopColor="#2e3d35" />
          </linearGradient>
        </defs>

        {/* ── Lamp glows (phase 5) ─────────────────────────── */}
        <rect id="lamp-l" x="-240" y="-155" width="210" height="310"
          fill="url(#lg-l)" opacity="0" />
        <rect id="lamp-r" x="30"   y="-155" width="210" height="310"
          fill="url(#lg-r)" opacity="0" />

        {/* ── Plants — left (phase 5) ──────────────────────── */}
        <g id="plant-l" opacity="0">
          {/* Leaf 1: tall, leans left */}
          <path
            d={`M -210,155
               C -218,125 -228,88  -222,58
               C -218,38  -208,36  -202,52
               C -198,64  -200,95  -204,128 Z`}
            fill="url(#leaf-d)" opacity="0.85"
          />
          <path d="M -210,155 C -216,125 -222,90 -212,52"
            stroke="#2a3530" strokeWidth="0.6" fill="none" opacity="0.5" />
          {/* Leaf 2: medium, angles right */}
          <path
            d={`M -195,155
               C -200,130 -210,100 -205,74
               C -201,55  -191,53  -187,68
               C -183,82  -185,112 -189,140 Z`}
            fill="url(#leaf-l)" opacity="0.9"
          />
          <path d="M -195,155 C -198,128 -205,98 -196,68"
            stroke="#2a3530" strokeWidth="0.6" fill="none" opacity="0.5" />
          {/* Leaf 3: shorter, curls right */}
          <path
            d={`M -176,155
               C -179,138 -183,116 -177,97
               C -173,82  -163,80  -161,93
               C -159,106 -162,128 -168,148 Z`}
            fill="#3d5247" opacity="0.75"
          />
          <path d="M -176,155 C -178,135 -180,112 -169,93"
            stroke="#2a3530" strokeWidth="0.5" fill="none" opacity="0.4" />
        </g>

        {/* ── Plants — right (mirrored) ────────────────────── */}
        <g id="plant-r" opacity="0">
          <path
            d={`M 210,155
               C 218,125 228,88  222,58
               C 218,38  208,36  202,52
               C 198,64  200,95  204,128 Z`}
            fill="url(#leaf-d)" opacity="0.85"
          />
          <path d="M 210,155 C 216,125 222,90 212,52"
            stroke="#2a3530" strokeWidth="0.6" fill="none" opacity="0.5" />
          <path
            d={`M 195,155
               C 200,130 210,100 205,74
               C 201,55  191,53  187,68
               C 183,82  185,112 189,140 Z`}
            fill="url(#leaf-l)" opacity="0.9"
          />
          <path d="M 195,155 C 198,128 205,98 196,68"
            stroke="#2a3530" strokeWidth="0.6" fill="none" opacity="0.5" />
          <path
            d={`M 176,155
               C 179,138 183,116 177,97
               C 173,82  163,80  161,93
               C 159,106 162,128 168,148 Z`}
            fill="#3d5247" opacity="0.75"
          />
          <path d="M 176,155 C 178,135 180,112 169,93"
            stroke="#2a3530" strokeWidth="0.5" fill="none" opacity="0.4" />
        </g>

        {/* ── Vinyl record (phases 2–4) ────────────────────── */}
        <g id="record" opacity="0" style={{ transformOrigin: "center" }}>
          {/* Spinning body — grooves + outer ring */}
          <g id="record-body" style={{ transformOrigin: "center" }}>
            <circle r="130" fill="#161e1b" />
            <circle r="129" fill="none" stroke="#263029" strokeWidth="1.5" />
            <g id="grooves" />
            {/* Outer label ring on body — spins with record */}
            <circle r="52" fill="none" stroke="#3d4d45" strokeWidth="0.6" />
          </g>

          {/* Label + monogram — counter-rotates to stay upright */}
          <g id="label-group" style={{ transformOrigin: "center" }}>
            {/* Label background */}
            <circle r="50" fill="#2a3330" />
            {/* Label detail rings */}
            <circle r="38" fill="none" stroke="#354039" strokeWidth="0.5" opacity="0.6" />
            <circle r="26" fill="none" stroke="#354039" strokeWidth="0.5" opacity="0.4" />
            {/* Center hole */}
            <circle r="6" fill="#222B28" />
            <circle r="5.2" fill="none" stroke="#1a211e" strokeWidth="0.8" />

            {/* ── AN Monogram (phase 4) ────────────────────── */}
            <g id="mono" opacity="0">
              {/* Letters */}
              <g
                fill="none"
                stroke="#F8F4EB"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* A — left leg */}
                <line x1="-21" y1="18" x2="-8"  y2="-18" />
                {/* A — right leg */}
                <line x1="-8"  y1="-18" x2="4"  y2="18" />
                {/* A — crossbar (at 58% height from bottom) */}
                <line x1="-16.5" y1="3" x2="-1" y2="3" />
                {/* N — left post */}
                <line x1="7"  y1="18"  x2="7"  y2="-18" />
                {/* N — diagonal */}
                <line x1="7"  y1="-18" x2="22" y2="18" />
                {/* N — right post */}
                <line x1="22" y1="-18" x2="22" y2="18" />
              </g>
              {/* Persimmon accent dot above A apex — graph node reference */}
              <circle cx="-8" cy="-24" r="2.4" fill="#D06D43" />
            </g>
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
          stroke="#A8B8A1"
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
          fill="#637A6B"
          letterSpacing="2"
          opacity="0.7"
        >
          00
        </text>
      </svg>
    </div>
  );
}
