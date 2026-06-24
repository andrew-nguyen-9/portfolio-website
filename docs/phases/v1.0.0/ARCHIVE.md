# v1.0.0 — Archive

**Status:** ✅ Released · frozen. This is the retroactive snapshot of all work that
existed *before* the phase/segment/task system was adopted. It is the state of
`main` at the moment phase 2 opened.

There was no formal plan for v1 — it was built organically. This archive exists so
the lineage is honest and so a new session can understand what "the old site" was.

## What v1 was

A single-page Next.js 15 / React 19 portfolio for `an9.dev`, deployed on Vercel.
One scrolling page composed of section components, with a themed intro loader.

### Sections (top to bottom)
- **Loader** — animated vinyl-record SVG (spins, grooves draw in), shown once per
  session, gated on `sessionStorage` and `prefers-reduced-motion`.
- **Nav** + **Logo** (the AN mark, screen-blended PNG).
- **Hero** — typing animation that cycled the name with a rotating set of
  flattering "typos" ("AndReW / the GOAT", "unmatched", etc.) plus a rotating
  role line. ⚠️ The typo cycle is being removed in v2 (reads as arrogant).
- **About** — bio, animated stat counters, project-domain cards, a tabbed skill
  toolkit, interest pills, and a word-cycling "around insight/clarity/…" headline.
- **Projects** — flip cards (hover/tap to reveal the back) in a grid, plus a list
  view; filter by all/featured. Source of truth: `content/projects.ts`.
- **Contact** — form via Resend, protected by hCaptcha (with blocker fallback).
- **Footer**, plus utilities: **Cursor**, **ScrollProgress**, **Tooltip**,
  **A11yPanel** (high-contrast toggle, reduce-motion toggle).

### Design language
"Modern analytics engineer meets Kyoto listening bar" — forest green + warm
parchment, split-complementary accents (green / persimmon / brass). Big
multi-family type system (Geist, serif editorial faces, mono labels). Theme:
light / dark, plus a separate high-contrast A11y mode.

### Infra & security (already in place)
- Security headers in `next.config.ts`: HSTS (preload), X-Frame-Options DENY,
  nosniff, Referrer-Policy, Permissions-Policy, and a CSP scoped for hCaptcha +
  Resend + Google Fonts.
- Metadata + OpenGraph/Twitter in `app/layout.tsx`; dynamic favicon in
  `app/icon.tsx`.

## Known gaps carried into v2

These are the seeds of the v2 plan — see [`../v2.0.0/PLAN.md`](../v2.0.0/PLAN.md):

- No `README`, no `robots.txt`, no `sitemap`, no project `CLAUDE.md`, no `docs/`.
- Hero typo cycle reads as arrogant → reduce to name typing.
- Projects shown as conventional flip cards → want a non-card, editorial format.
- High-contrast is a side toggle → make it the default dark; push the toggle
  even harder; make light mode more serious.
- About copy is data-career framed → rewrite around the real passions (UT
  mechanical engineering, transit/urban planning/architecture, cooking, AI-
  assisted building, Chicago/CTA, politics & sports for the stats).
- Loader is nice but due for a bolder, more original revamp.
- SEO and "this is a real, trustworthy site" signals need strengthening (the site
  is currently blocked by some corporate security filters).
