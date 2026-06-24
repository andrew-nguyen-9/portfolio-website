# v3 — Idea Backlog

Seed ideas for the next phase (v3), per the v2 closeout step (h). This starts now
and gets expanded with everything that surfaces during v2. Nothing here is
committed — it's a menu for the v3 planning conversation.

## Content & projects
- **Ship the planned projects** so they go `planned → building → live`: CTA
  Analytics, F1 Tracker, Midterms 2026, Grocery, House Special.
- **Per-project detail pages** on the main site (`/projects/[id]`) instead of only
  linking out to subdomains — richer write-ups, screenshots, "what I learned."
- **A "now" / changelog page** — what Andrew is building this month; reinforces
  "this is a living project home base."
- **Writing / notes section** — short posts on transit, data, cooking experiments,
  AI-assisted building.

## Spotify / music integration
- **Now-playing + recent tracks** widget via the Spotify Web API (the festival/
  music domain already uses Spotify) — a live, personal signal on the site.
- Top artists/genres visualization tying into the Festival Analyzer project.
- (Requires Spotify OAuth + token refresh; note it as its own segment with secure
  server-side token handling.)

## Design & interaction
- Theme variants beyond light/dark (e.g. a seasonal or "transit map" palette).
- A genuinely interactive hero (subtle, on-brand — not a gimmick).
- Sound design / audio toggle for the music-leaning sections.
- View-transition API for smoother section/page navigation.

## Platform & DX
- Analytics (privacy-respecting) to see what people actually visit.
- Visual regression tests (Playwright screenshots) wired into the segment QA loop.
- A small design-token pipeline so `lib/theme.ts` and `globals.css` can't drift.
- CI: run type-check/lint/build on PRs into phase branches.

## SEO & reach
- Per-project OG images (generated) for nicer link sharing.
- RSS for the writing/changelog section.

## Promoted from v2 closeout (surfaced while building phase 2)

### Things noticed in the code
- **The loader doesn't theme.** The kept v1 vinyl loader (`components/Loader`) uses
  hardcoded SVG hex for the record/grooves and a dark backdrop, so in light mode a dark
  loader hands off to a light page. Either theme the loader (token-driven SVG) or make
  the handoff intentional. Out of scope in v2.2 (loader was deliberately kept as-is).
- **Token drift guard.** `lib/theme.ts` mirrors `app/globals.css` by hand — already
  listed under Platform/DX above, but v2 reinforced the need: a tiny generator or test
  that fails if the two diverge would prevent silent palette drift.
- **`.section-num` watermark + Lighthouse a11y.** The decorative `aria-hidden` section
  numerals are exempt from WCAG contrast but still cap Lighthouse a11y at 97. If a clean
  100 is wanted, render them as a CSS background/pseudo-element (not audited as text)
  rather than darkening them.

### Process lessons (fold into WORKFLOW if they recur)
- **Validate SEO against a production build, not `next dev`.** Dev places Next's
  generated `<meta>` into `<body>`; only `next start` hoists them into `<head>`. Running
  Lighthouse on dev falsely fails the meta-description / SEO checks.
- **Never fade text with `opacity` for "muted" styling** — it tanks contrast (worst in
  light mode). Use a muted token color (the new `.eyebrow` pattern). Candidate for a
  lint rule or a DESIGN-GUIDELINES note.

### Ops / external (from v2 DEFERRED.md — needs Andrew, not code)
- DNS **CAA** record; **DMARC/SPF/DKIM** if mail-from-`@an9.dev` is ever used.
- **HSTS preload** submission + Vercel cert/domain (apex, `www`, `*.an9.dev`) posture.
- Post-deploy **Rich Results Test** + **security-headers scan** against prod.
