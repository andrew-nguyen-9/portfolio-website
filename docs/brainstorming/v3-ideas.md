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

## Promoted from v2 (filled at v2 closeout)
- _(graduate the durable items from `phases/v2.0.0/BRAINSTORM.md` here when v2 closes)_
