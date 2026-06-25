# v4 — Idea Backlog

Seed ideas for the next phase (v4), per the phase-close step. Nothing here is
committed — it's a menu for the v4 planning conversation. Carries forward everything
still open from [`v3-ideas.md`](v3-ideas.md) and
[`../phases/v3.0.0/DEFERRED.md`](../phases/v3.0.0/DEFERRED.md).

## Music / data (build on v3's Spotify plumbing)
- **Top-artists / genres visualization** tying into the Festival Analyzer — the
  deferred v3 feature. Scopes + secure token route already exist; needs the data/design
  work. Likely the headline candidate for v4.
- Recently-played *list* (not just the single most-recent track) as a small feed.

## Content & projects (still open from v3)
- **Ship the planned projects** `planned → building → live`: CTA Analytics, F1 Tracker,
  Midterms 2026, Grocery, House Special.
- **Per-project detail pages** (`/projects/[id]`) with write-ups, screenshots,
  "what I learned" — instead of only linking out to subdomains.
- **A "now" / changelog page** — what Andrew is building this month.
- **Writing / notes section** — transit, data, cooking, AI-assisted building. (+ RSS.)

## Performance / quality
- **Lazy-load hCaptcha on contact-form focus** — the single biggest Lighthouse Best
  Practices lever (v3 found the cold-audit BP hit is entirely the eagerly-loaded
  hCaptcha script). Removes deprecated-API / third-party-cookie / inspector-issue hits
  from a cold load and for visitors who never open the form.
- **Visual regression tests** (Playwright screenshots) wired into the segment QA loop.
- **CI**: type-check / lint / build on PRs into phase branches.
- **Token-drift guard** so `lib/theme.ts` and `globals.css` can't silently diverge.

## Design & interaction (still open from v3)
- Theme variants beyond light/dark (seasonal / "transit map" palette).
- Genuinely interactive hero (subtle, on-brand).
- View-transition API for smoother section/page navigation.
- Loader doesn't theme — token-drive the vinyl SVG, or make the dark→light handoff
  intentional.

## SEO & reach
- Per-project generated OG images for nicer link sharing.

## Ops / external (needs Andrew, not code — carried from v2/v3)
- DNS **CAA**; **DMARC/SPF/DKIM** if mail-from-`@an9.dev` is used; **HSTS preload**
  submission + cert/domain posture (apex, `www`, `*.an9.dev`).
- Post-deploy **Rich Results Test** + **security-headers scan** against prod.
