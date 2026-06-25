# v3.0.0 — Phase Plan

> 🚧 **Planned.** This is the working plan for phase 3. For what actually ships —
> including deviations — an `ARCHIVE.md` will be written at phase close (see the v2
> archive for the pattern).

**Branch:** `v3` (off `main`) · **Release tag on merge:** `v3.0.0`
**Backlog source:** [`../../brainstorming/v3-ideas.md`](../../brainstorming/v3-ideas.md) ·
process in [`../../WORKFLOW.md`](../../WORKFLOW.md) · [`../../VERSIONING.md`](../../VERSIONING.md)

## Goal

Add a single, well-built **living signal** to the site: Andrew's real-time Spotify
listening, surfaced in the About section near the music throughline. This reinforces
the "living project home base" premise — the site shows Andrew is *actively here*,
not a static résumé. Single-user model (Andrew's own account, public to all visitors),
secure server-side token handling, and a graceful fallback when unconfigured.

Scope is deliberately **one coherent feature**. The top-artists / genres
visualization (tying into the Festival Analyzer project) is explicitly **deferred** to
a later phase — see Deferrals.

## Success criteria

- [ ] A now-playing / recently-played widget renders in the About section, themed
      across light / dark-default / dark-HC / light-HC.
- [ ] All Spotify calls are proxied server-side; **no token or secret ever reaches the
      client**. The browser only fetches a same-origin API route.
- [ ] The feature **degrades gracefully**: with env unset (local dev / pre-config) it
      shows a quiet "not configured" / static state, never a broken widget or console
      error (mirrors the v2 contact-form math fallback).
- [ ] Empty state handled: nothing currently playing → show most-recent track.
- [ ] Accessible (`aria-live="polite"`, keyboard-safe links) and reduced-motion safe.
- [ ] The only CSP change is `img-src += https://i.scdn.co` (Spotify album art) in
      `middleware.ts`; nonce/strict-dynamic posture otherwise unchanged.
- [ ] One-time authorization + the three required env vars are documented in `docs/`.
- [ ] `type-check`, `lint`, and a production `build` are clean; QA + `/code-review`
      passed; Lighthouse re-verified on a production build.
- [ ] Docs reviewed; phase archived; next brainstorm file written.

## Architecture (single-user refresh-token model)

```
Browser (About widget)                Server (Next API route)            Spotify
  fetch /api/spotify/now-playing  ─►  refresh_token ─► access_token  ─►  /me/player/
  (poll ~30–60s, same-origin)         (Basic-auth POST, cached)          currently-playing
  renders {isPlaying,title,            returns minimal JSON              (204 → recently-played[0])
   artist,albumImageUrl,songUrl}
```

- **Secrets:** `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`
  (server env only). Scopes: `user-read-currently-playing`, `user-read-recently-played`.
- **Token handling:** the route swaps the long-lived refresh token for a short-lived
  access token (POST to `accounts.spotify.com/api/token`), caching the access token
  in-memory for its ~3600s life; refreshed on cold start. No persistence needed.
- **Client:** never sees secrets; only consumes the minimal JSON shape above.

## Segments

Ordered by dependency: plumbing first (the widget consumes it), then the widget, then
polish/QA.

---

### v3.1 — Spotify auth plumbing
**Branch:** `v3.1` · **Depends on:** none

Stand up the secure server side everything else consumes.

- **v3.1.1** — Add `app/api/spotify/now-playing/route.ts`: refresh-token → access-token
  swap (Basic-auth POST), in-memory access-token cache, currently-playing fetch with
  `204`/empty → recently-played fallback. Return minimal JSON
  (`{isPlaying, title, artist, albumImageUrl, songUrl}`).
- **v3.1.2** — **Graceful unconfigured state:** when any required env var is missing,
  return a typed "not configured" payload (no throw, no secret leak) so the widget can
  hide or show a static state. Mirror the contact-form missing-key guard pattern.
- **v3.1.3** — CSP: add `https://i.scdn.co` to `img-src` in `middleware.ts` (album art).
  Leave nonce / `strict-dynamic` / all other directives untouched; re-verify no
  violations.
- **v3.1.4** — Document the one-time Authorization-Code flow to mint the refresh token
  and the three env vars (`docs/SPOTIFY.md` + `.env.local.example`).

---

### v3.2 — Now-playing widget (About)
**Branch:** `v3.2` · **Depends on:** v3.1

The visible surface, placed in About near the interests/music throughline.

- **v3.2.1** — Client component that fetches `/api/spotify/now-playing` on mount and
  polls (~30–60s). Token-driven styling (no hardcoded hex), fits the About section
  rhythm.
- **v3.2.2** — States: live (▶ + title/artist/art, links to the track), recently-played
  ("last played"), unconfigured/empty (quiet static), and error (silent degrade).
- **v3.2.3** — A11y + motion: `aria-live="polite"` for track changes, keyboard-focusable
  track link, reduced-motion safe (no pulsing/marquee under `prefers-reduced-motion`).

---

### v3.3 — Polish + SEO/QA (phase close)
**Branch:** `v3.3` · **Depends on:** v3.2

- **v3.3.1** — Resilience: handle Spotify `429`/rate-limit and token-expiry edges;
  confirm no console errors in any state.
- **v3.3.2** — Full QA across light / dark-default / dark-HC / light-HC, mobile→desktop,
  reduced-motion, keyboard. `type-check` + `lint` + production `build` clean.
- **v3.3.3** — Lighthouse on a production build (per the v2 lesson: never validate on
  `next dev`); confirm scores hold.
- **v3.3.4** — `/code-review`; write `ARCHIVE.md` + any `DEFERRED.md`; seed the next
  brainstorming file.

## Risks & deferrals

**Deferred (out of scope for v3):**
- **Top-artists / genres visualization** tying into the Festival Analyzer — a richer,
  more design- and data-heavy feature. Revisit as its own phase. (Kept in
  [`v3-ideas.md`](../../brainstorming/v3-ideas.md) under Spotify / music integration.)

**Risks:**
- **Local verification gap.** Without real Spotify tokens, the widget can only be fully
  exercised on a deployed environment (same shape as v2's hCaptcha/Resend). The
  unconfigured state must therefore be airtight, and final verification happens on
  deploy.
- **Serverless token cache.** The in-memory access-token cache doesn't persist across
  cold starts; acceptable (a refresh on cold start is cheap and within rate limits).
- **`/` already dynamic** from the v2 nonce CSP — the client-fetch widget doesn't change
  rendering strategy, but confirm it adds no blocking work to first paint.

**External (Andrew, not code) — required before the feature is live:**
- Create a Spotify app in the developer dashboard; run the one-time authorization to
  mint the refresh token; set `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` /
  `SPOTIFY_REFRESH_TOKEN` in Vercel. Until done, the widget shows its unconfigured state.
