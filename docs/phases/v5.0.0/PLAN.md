# v5.0.0 — Home Base Refresh — PLAN

Phase branch: `v5` (off `main`). One PR at the end; **never merged here**.

The portfolio's project family has matured: five builds went live at their own
subdomains and got real names. v5 brings the home base in line — renamed/live projects
with real logos, a rewritten About, a hardened Spotify panel, a seamless hero, a sitemap
index across the subdomains, and the removal of two features that didn't earn their keep
(the skills slider and the transit palette).

Source of truth: `content/projects.ts` (projects) · `app/globals.css` (tokens). No raw
hex in components — CSS vars only.

## Repo / subdomain verification (done)

All five renamed builds resolve **200 live** and map to these repos:

| Project | id (new) | subdomain | repo (`andrew-nguyen-9/`) |
|---|---|---|---|
| Soundcheck | `soundcheck` | soundcheck.an9.dev | `soundcheck` |
| BlitzBoard | `blitzboard` | blitzboard.an9.dev | `blitzboard` |
| Behind the Ballot | `ballot` | ballot.an9.dev | `behind-the-ballot` |
| MetroTrack | `metrotrack` | metrotrack.an9.dev | `metrotrack` |
| Parlor | `parlor` | parlor.an9.dev | `trivia-generator` |

> Note: the ballot repo slug is `behind-the-ballot`, not `ballot` (subdomain ≠ repo).

## Segments (committed per section on `v5`)

### v5.1 — Hero (`components/Hero/index.tsx`, `app/globals.css`)
1. **Seamless fade.** Retune `.hero-bg-img` mask stops — add intermediate ramp stops so
   the image dissolves into `--bg` with no perceptible light-mode edge (top + bottom +
   sides). Verify in light mode via Playwright screenshots at top/bottom edges.
2. **Dark "Chicago, IL".** Add `.dark #hero .eyebrow { color: var(--fg); }` — the eyebrow
   default `--fg-subtle` is too dim over the photo in dark.
3. **Name retype loop.** On a random 20–30s interval, delete only line 2 (`nGuyen`) and
   retype it. Guarded under reduce-motion (OS pref or `.reduce-motion` class) → static
   full name, no loop (ties to v5.6.2).

### v5.2 — About (`components/About/index.tsx`, `components/Tooltip`)
1. **Bio → 3 paragraphs**, verbatim from the brief. Keep the "Building tools for
   [CuriosityCycler]" heading + rotating word.
2. **Remove the skills slider** entirely: `idx` state, `<input type="range">`,
   `.skill-stops`, `SKILL_TICKS`, and the `.skill-slider`/`.skill-stop*` CSS. Show all
   skill groups at once.
3. **Expand + tooltip skills.** Rebuild `SKILL_GROUPS` from the real libraries across the
   repos, grouped: languages · data & public APIs · web & build · AI. Each skill gets an
   accessible tooltip (hover desktop, tap mobile, keyboard-focusable) — **extend
   `components/Tooltip`** with a wrapping/normal-case rich variant; make the pill the
   focusable trigger.
4. **New stats pills.** Keep "Projects in the family" + "In active build". Replace
   `domainCount` and `2026` with **"Public data APIs wired"** (count of distinct
   `*API` project tags) and **"Tools in the stack"** (distinct count across
   `SKILL_GROUPS`) — both derived, not hardcoded.
5. **Spotify → monthly top tracks.** New `/api/spotify/top-tracks?time_range=short_term`
   route ("most played this month"); the song list reads it instead of recently-played.
   Keep the "Genres in rotation" chips above the songs. Harden token handling (401 →
   clear + single retry helper in `lib/spotify.ts`). Keep graceful-hide. Update
   `docs/SPOTIFY.md`. **Needs Andrew:** top-tracks (like top-artists) requires
   `user-top-read`; until the refresh token is re-minted, the route 403s and the panel
   hides — note in the PR.

### v5.3 — Projects (`content/projects.ts`, `components/Projects/index.tsx`)
- **Renames + full copy refresh** for the five live builds (tagline + description from
  their repos). Behind the Ballot generalized to elections / campaign finance (no hard
  2026-midterms anchor). Parlor keeps its name; tagline/description rewritten from the
  repo with **no "after-dark" references**; marked `live`.
- **Rename id slugs** to the new names. Routing (`/projects/[id]`), sitemap, and OG all
  read `id`, so they follow automatically. **Old `/projects/<oldid>` URLs will 404** —
  acceptable, the builds are new and unindexed under the old ids.
- **Remove `year`** from the `Project` type and every entry; stop rendering it
  (`ProjectRow` meta, `ListRow` year span).
- **Logos.** Add optional `logo` field. Copy each repo's icon into
  `public/projects/<id>.*`; the floating preview shows logo + description, falling back to
  the monogram `CategoryPlate` when absent. Assets:
  `soundcheck.svg`, `blitzboard.svg`, `ballot.svg`, `metrotrack.svg` (Chicago square),
  `parlor.png`.
- **Cursor tooltip fix.** Make the floating preview track the pointer reliably (anchored
  near the cursor, clamped to viewport); keep keyboard-anchored behavior on focus.

### v5.4 — Footer (`components/Footer/index.tsx`)
1. Tighten the top gap (`pt-14` → smaller) under the border.
2. Remove Email from `SOCIAL`.
3. Add a **Projects** column (live + building, linked to `https://<subdomain>`). Footer
   grid → 4 columns (monogram · Pages · Projects · Find me).

### v5.5 — SEO (`app/layout.tsx`, `app/robots.ts`, new sitemap index)
1. `SITE_TITLE` → **"AN9 — Andrew Nguyen, Data Engineer"** (flows to og/twitter titles).
2. Root **sitemap index** route referencing the apex sitemap + each live subdomain's
   `/sitemap.xml`; `robots` points at the index and also lists each subdomain sitemap as
   a `Sitemap` directive. Live subdomains derived from `projects` (status `live`).

### v5.6 — Accessibility (`components/A11yPanel/index.tsx`, `app/globals.css`, …)
1. **Remove the palette feature** fully: `themeVariant` state, the "Palette" UI block, the
   `.theme-transit` CSS, `lib/theme.ts` `transitMap`, the `theme-transit` branch in the
   `app/layout.tsx` inline script, and the `transitMap` mapping in
   `scripts/check-tokens.mjs`. Default theme only.
2. **Reduce-motion → static typing.** When reduce-motion is on, all typing renders static
   final text: hero name fully shown (no retype loop, v5.1.3), curiosity cycler static
   (already guarded — verify).

## Additional stat proposal (scanned from repos)

Candidate fifth stat not wired (keeps the 4-pill layout): **"Nightly data pipelines"** —
every live build runs a scheduled Python/GitHub-Actions ETL (Soundcheck, Parlor, Ballot,
MetroTrack all describe nightly cron pipelines). Compelling but not cleanly derivable from
`content/projects.ts` without a new field, so deferred — noted here per the brief.

## Finish gate
`npm run type-check && npm run lint && npm run build` all green → per-section commits on
`v5` → open PR. **Never merge to main.**
