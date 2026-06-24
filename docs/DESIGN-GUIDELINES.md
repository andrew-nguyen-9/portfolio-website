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
Think ink-on-paper precision over decorative. Exact tokens are set in segment
`v2.1`; the brief is: higher contrast than v1 light, more disciplined neutrals,
accents used sparingly as punctuation.

### Token contract

Components must only consume tokens, never hardcode theme colors:

```
--bg --surface --primary --secondary --highlight
--fg --fg-muted --fg-subtle --border --border-strong --card-border
```

Adding a color means adding a token in all palettes, not a hex in a component.

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
- The loading screen is a signature moment (see `v2.2`) — it should feel crafted,
  but never block a returning visitor (gate on `sessionStorage`, as v1 does).

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
