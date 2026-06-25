# v3.0.0 — Archive

**Status:** ✅ Released · frozen. Merged to `main` and tagged `v3.0.0`. This file is
the single complete record of what phase 3 shipped, the decisions made, and where it
deviated from the plan. The working note ([`PLAN.md`](PLAN.md)) and
[`DEFERRED.md`](DEFERRED.md) remain for lineage; this file is the summary.

## Goal (met)

Add a single, well-built **living signal** to the site: Andrew's real Spotify
listening, surfaced in the About section's music throughline — reinforcing the
"living project home base" premise (the site shows Andrew is *actively here*, not a
static résumé). Single-user model (Andrew's own account, public to all visitors),
secrets handled server-side only, graceful fallback when unconfigured. Scope held to
one coherent feature; the top-artists/genres visualization was deferred (see
[`DEFERRED.md`](DEFERRED.md)).

## What shipped, by segment

- **v3.1 — Spotify auth plumbing.** `app/api/spotify/now-playing/route.ts`: a
  same-origin edge proxy that swaps the long-lived refresh token for a short-lived
  access token (Basic-auth POST to `accounts.spotify.com/api/token`), caches the
  access token in module scope for its ~3600s life, fetches currently-playing, and
  falls back to recently-played on a `204`/empty. Returns a minimal JSON shape
  (`{configured, isPlaying, title, artist, albumImageUrl, songUrl}`). Secrets
  (`SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` / `SPOTIFY_REFRESH_TOKEN`) live in
  server env only and never reach the client. A typed `{configured:false}` guard
  mirrors the v2 contact-route missing-key pattern. CSP changed by exactly one
  directive — `img-src += https://i.scdn.co` (album art) in `middleware.ts`; nonce /
  `strict-dynamic` posture otherwise untouched. One-time Authorization-Code flow and
  the three env vars documented in `docs/SPOTIFY.md` + `.env.local.example`.

- **v3.2 — Now-playing widget (About).** `components/About/NowPlaying.tsx`: a client
  component that fetches the proxy on mount and polls every 45s (`AbortController`
  cleanup). Fully token-driven styling (no hardcoded hex), fitting the About rhythm.
  States: live (▶ pulse dot + title/artist/art, links to the track), recently-played
  ("Last played"), and unconfigured/empty/error → renders `null` so the layout never
  shows a broken or placeholder widget. A11y: wrapped in `aria-live="polite"`,
  keyboard-focusable track link with `:focus-visible` styling, and the pulse dot's
  `np-pulse` animation is auto-disabled under the global reduced-motion block.

- **v3.3 — Polish + SEO/QA (phase close).** Resilience: the route now branches
  explicitly on Spotify response status instead of falling through to a second
  recently-played call for every non-200 — a `401` (token revoked / expired mid-life)
  clears the in-memory cache so the next poll mints a fresh token instead of looping
  on a dead one until cold start; a `429` backs off rather than firing a guaranteed
  second failure under rate limit; only `200`/`204` fall through to the fallback. Full
  QA across light / dark-default / dark-HC / light-HC, mobile→desktop, reduced-motion,
  and keyboard; `type-check` + `lint` + production `build` clean; Lighthouse on a
  production build (A11y 100, SEO 100, Best Practices unchanged from v2 — see Notes).

## Decisions & deviations

- **Edge runtime + `force-dynamic`** for the route: live data, never statically
  cached; `Cache-Control: no-store` on every response.
- **Module-scope token cache, not persisted.** A cold start just refreshes — cheap and
  within rate limits. Marked with a `ponytail:` note for the single-account
  assumption; revisit only if the model ever goes multi-tenant.
- **Widget hides rather than shows an empty shell.** `null` on unconfigured / empty /
  error keeps the About layout intact in every failure mode (same philosophy as the v2
  contact-form math fallback).
- **No deviations from the planned scope.** The deferred top-artists/genres
  visualization was never started, by design.

## Notes / lessons (fold into the next phase)

- **Lighthouse "scores hold" = no regression from this phase's diff**, not "100
  unconditionally." Best Practices reads ~58 on a cold page-load audit, but all three
  failures trace to the third-party `js.hcaptcha.com` script (deprecated APIs,
  third-party cookies, inspector issues) loaded by the v2 contact form — **not** the
  Spotify widget (no `i.scdn.co` / `/api/spotify` failures). v3 added no Best-Practices
  regression. Lever for a future phase: lazy-load hCaptcha on form focus so it's absent
  from a cold audit. (Carried to v4 ideas / DEFERRED.)
- **QA gotcha:** `getComputedStyle()` during an active CSS transition returns the
  interpolated value, not the target — with `transition-all` on the card, reading
  themed colors immediately after flipping the theme class catches the pre-transition
  color. Settle transitions before asserting.
- **Local verification is real for this feature.** With `.env.local` tokens present the
  widget exercises fully locally (unlike v2's hCaptcha/Resend); the unconfigured state
  still degrades cleanly when env is unset.

## External (Andrew, not code) — required for the live feature

- Spotify app created in the developer dashboard; one-time authorization run to mint
  the refresh token; `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` /
  `SPOTIFY_REFRESH_TOKEN` set in Vercel. Until set, the widget shows its (hidden)
  unconfigured state. See [`docs/SPOTIFY.md`](../../SPOTIFY.md).
