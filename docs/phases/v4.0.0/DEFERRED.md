# v4.0.0 — Deferred

> What v4 deliberately did **not** ship. Code items roll into v5 ideas; the ops/external
> items need Andrew (not code) and gate full production behavior.

## Deferred to v5 (code)

- **AI flagship build** — the reserved `data-concierge` slot ships as `planned`; the
  agentic "data concierge" (NL Q&A across project datasets via the Vercel AI SDK +
  per-project tool calls) is its own build. Concept may still change.
- **Commerce** — Stripe `/shop`, metered data/API products, freemium ACOS. Build once
  affiliate + content prove an audience.
- **Monorepo pivot** — considered in v4, rejected; would be its own phase.

## Needs Andrew (external / ops — not code)

These gate full production behavior; the code degrades gracefully until they're done.

- **ACOS** — replace the placeholder registry entry in `content/projects.ts` with real
  name / tagline / description / subdomain.
- **Spotify** — re-mint the refresh token with the **`user-top-read`** scope so the
  top-genres panel lights up (recently-played already works). See `docs/SPOTIFY.md`.
- **Vercel `*.an9.dev` wildcard + DNS** — required for the subdomain→apex status routing
  to fire in production (verified locally via Host header).
- **Deliverability / security records** — DNS **CAA**; **DMARC/SPF/DKIM** if
  mail-from-`@an9.dev`; **HSTS preload** submission; cert/domain posture for apex, `www`,
  and the wildcard.

## Post-deploy verification (run against production, not `next dev`)

- **Lighthouse / Core Web Vitals** on a production build (the v4.6.5 audit covers static
  SEO coverage; runtime performance must be measured on prod).
- **Rich Results Test** (JSON-LD: Person, WebSite, SoftwareApplication, BlogPosting).
- **security-headers scan** — confirm the strict nonce CSP + headers hold on prod.
- **Visual regression** baselines are darwin-local (`npm run test:visual`); regenerate if
  the CI/runner platform changes.
