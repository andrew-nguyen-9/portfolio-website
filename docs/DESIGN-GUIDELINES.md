# Design Guidelines

The quality bar and the design system. Read before touching UI, copy, color,
type, or motion. The v2 direction and references are in
[`phases/v2.0.0/DESIGN-RESEARCH.md`](phases/v2.0.0/DESIGN-RESEARCH.md); this doc is
the durable system those decisions feed into.

## Principles

1. **Editorial, not templated.** This should read like a designed object — a
   magazine, a transit map, an architectural plan — not a SaaS landing page or a
   portfolio template. Strong type, real hierarchy, intentional whitespace.
2. **Serious by default, playful in the details.** Andrew's personality is
   serious and precise (engineer's eye). The base layout, color, and copy carry
   that. Delight lives in micro-interactions and motion, not in gimmicks.
3. **Passion project, never a resume.** No "available for hire," no resume tone,
   no skills-as-selling-points framing. The site organizes and celebrates his
   work; that's the whole pitch.
4. **Accessible is not optional.** WCAG AA minimum everywhere; AAA in
   high-contrast. Every interaction works with keyboard and screen reader.
   `prefers-reduced-motion` is always honored.
5. **Fast and real.** Good Core Web Vitals, no layout shift, no jank. A site
   that feels broken or slow reads as "not a real site" — which is exactly the
   perception we're fighting (see SEO/security segment).

## Themes

Three palettes live as CSS custom properties in `app/globals.css`, mirrored for
reference in `lib/theme.ts`. v2 changes the philosophy of all three (see segment
`v2.1`).

### Dark mode = high contrast (v2 decision)

In v1, "high contrast" was a separate A11y toggle. **In v2, the high-contrast
dark look becomes the standard dark mode** — Andrew prefers it. The old softer
dark palette is retired as the default.

- True/near-black background, bright high-legibility foreground.
- Accents are vivid and saturated (the brand green/orange/gold pushed brighter),
  not muted.
- The A11y panel's "high contrast" option then pushes **even further** — pure
  `#000`/`#fff`, maximal accent saturation, heavier borders — for users who need
  AAA. So there are effectively two dark levels: bold-default and max-contrast.

### Light mode = serious

Light mode is being rebuilt to feel **more serious and editorial**, matching
Andrew's personality — restrained, architectural, less "warm parchment cozy."
Think ink-on-paper precision over decorative. Shipped in segment `v2.1` (final
hexes in the token table below): higher contrast than v1 light, more disciplined
neutrals, accents used sparingly as punctuation.

### Token contract

Components must only consume tokens, never hardcode theme colors:

```
--bg --surface --primary --secondary --highlight
--fg --fg-muted --fg-subtle --border --border-strong --card-border
```

Adding a color means adding a token in all palettes, not a hex in a component.

### v2 final token values (segment v2.1)

The shipped palettes. `app/globals.css` is the source of truth; `lib/theme.ts`
mirrors it for reference. All pairs are WCAG-verified — text/accents on both
`--bg` and `--surface` clear AA, and `fg`·`bg` clear AAA in high-contrast.

| Token | Light (`:root`) | Dark default (`.dark`) | Light HC | Dark HC |
|-------|-----------------|------------------------|----------|---------|
| `--bg`            | `#F6F5F1` | `#0B0F0D` | `#fff` | `#000` |
| `--surface`       | `#ECEAE3` | `#141A17` | `#f4f4f4` | `#0a0a0a` |
| `--primary`       | `#1E5C42` | `#5BE3A7` | `#00563a` | `#3DFFAE` |
| `--secondary`     | `#B23C12` | `#FF8A47` | `#a82c00` | `#FF8A1F` |
| `--highlight`     | `#7C5D12` | `#FFC94D` | `#00567a` | `#FFD21F` |
| `--fg`            | `#181A1B` | `#F2F5F1` | `#000` | `#fff` |
| `--fg-muted`      | `#45504A` | `#B7C5BD` | `#141414` | `#E6E6E6` |
| `--fg-subtle`     | `#596660` | `#7C9085` | `#2b2b2b` | `#B8B8B8` |
| `--border`        | `rgba(20,24,26,.12)` | `rgba(242,245,241,.12)` | `rgba(0,0,0,.45)` | `rgba(255,255,255,.45)` |
| `--border-strong` | `rgba(20,24,26,.22)` | `rgba(242,245,241,.24)` | `rgba(0,0,0,.75)` | `rgba(255,255,255,.78)` |
| `--card-border`   | `#D7D4CB` | `#2A332E` | `#000` | `#fff` |

Text on a `--primary` background uses `--bg` (e.g. `::selection`, buttons), not
a hardcoded `#fff` — that's what keeps contrast valid as the primary changes
across themes.

### Texture (decided v2; implemented with overall-UI work in v2.2)

A **subtle grain/paper layer** is part of the v2 look (adds tactility, escapes
the flat-template feel) — it must not reduce token contrast or hurt performance.
Decided in `docs/phases/v2.0.0/DESIGN-RESEARCH.md`; the design-system tokens
above don't block it.

## Typography

The project already loads a deliberate, large type system (see `app/layout.tsx`):
Geist (display), Inter (body), JetBrains Mono + IBM Plex Mono (labels/code),
Cormorant Garamond / Instrument Serif / Newsreader (editorial serif),
IBM Plex Sans (data). v2 leans **harder into the editorial serif + mono
pairing** for the new project index and headings — big serif display against
monospace labels is the signature.

- Headings: display/serif, tight tracking, large clamp ranges.
- Labels / metadata / section numbers: monospace, wide tracking, uppercase.
- Body: Inter, comfortable measure (~60–70ch max).
- Don't introduce new font families without a reason; we already have range.

## Motion

- **Motion-first but disciplined.** Reveal-on-scroll, smooth (Lenis) scrolling,
  purposeful transitions. Every animation must have an off-switch via
  `prefers-reduced-motion` / the A11y panel.
- Prefer transform/opacity (GPU) over layout-animating properties.
- The loading screen is a signature moment — it should feel crafted, but never
  block a returning visitor (gate on `sessionStorage`). The v1 spinning-vinyl
  loader is **kept** in v2 (a blueprint draw-in was prototyped in `v2.2` and set
  aside; see `phases/v2.0.0/DESIGN-RESEARCH.md`).

## Components & layout

- One folder per section under `components/`. Keep sections self-contained.
- `content/projects.ts` is the single source of truth for projects — UI reads
  from it, never hardcodes project data.
- Responsive: design mobile and desktop together; test both plus tablet.
- The **project list must not be traditional cards** in v2 — the direction is an
  interactive editorial index (see DESIGN-RESEARCH). Cards may remain as a
  fallback/list view only.

## Voice & copy

- First person, plain, specific. Lead with the *question a project answers*, not
  with buzzwords ("Which Chicago bus route is bleeding riders?" beats "leveraging
  data for civic insight").
- Chicago, transit/urban planning, architecture, cooking/food, AI-assisted
  building, politics & sports *for the statistics* — these are the throughlines.
  The CTA project is a love letter to the city, not a case study.
- No arrogance. The hero types Andrew's name, plainly. (v1's self-aggrandizing
  typo cycle — "the GOAT", "unmatched" — is removed in v2; see `v2.2`.)

## Definition of done (UI)

A UI change isn't done until it: uses only tokens · works in light, default-dark,
and max-high-contrast · works at mobile/tablet/desktop · is keyboard + SR
accessible · honors reduced-motion · has no console errors · passes
`type-check`, `lint`, `build` · and looks intentional next to its neighbors.
