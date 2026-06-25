# v3.0.0 — Deferred

Things explicitly *not* done in phase 3, kept here so they aren't lost. Carried
forward into [`../../brainstorming/v4-ideas.md`](../../brainstorming/v4-ideas.md).

## Deferred by design (planned out of scope)

- **Top-artists / genres visualization** tying into the Festival Analyzer project. A
  richer, more design- and data-heavy feature than the now-playing signal — it wants
  its own phase. The required scopes (`user-top-read`) and the secure server-side token
  plumbing are already in place from v3.1, so a future phase can build straight on the
  existing route pattern. (Originally in `v3-ideas.md` under Spotify / music.)

## Surfaced while building phase 3

- **hCaptcha drags Lighthouse Best Practices.** The v2 contact form loads
  `js.hcaptcha.com/1/api.js` eagerly; on a cold page-load audit its deprecated APIs,
  third-party cookies, and inspector issues pull Best Practices to ~58. It's a
  third-party script we can't fix directly. The fix is to **lazy-load hCaptcha only
  when the contact form is focused/interacted**, so a cold audit (and most visitors who
  never open the form) never pay for it. Contact-form scope, not Spotify — but it's the
  single biggest BP lever on the site.

## Still open from v2 (unchanged this phase)

- Loader doesn't theme (hardcoded vinyl SVG hex); token-drift guard between
  `lib/theme.ts` and `globals.css`; DNS CAA / DMARC-SPF-DKIM / HSTS preload ops; CI
  type-check/lint/build on PRs. See [`../v2.0.0/DEFERRED.md`](../v2.0.0/DEFERRED.md)
  for the full v2 list.
