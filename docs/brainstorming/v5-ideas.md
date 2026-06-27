# v5 — Idea Backlog

Seed ideas for the next phase (v5), per the phase-close step. Nothing here is committed —
it's a menu for the v5 planning conversation. Carries forward everything still open from
[`../phases/v4.0.0/DEFERRED.md`](../phases/v4.0.0/DEFERRED.md).

## Flagship
- **Data Concierge** (the reserved `data-concierge` slot) — agentic natural-language Q&A
  across the project datasets (festival, CTA, fantasy, midterms) via the Vercel AI SDK
  with per-project tool calls. The headline candidate for v5; concept still open.

## Commerce (only once content/affiliate proves an audience)
- Stripe `/shop`, metered data/API products, a freemium tier for ACOS.
- Affiliate: flip real partner URLs on `/uses` (infra already shipped — set
  `affiliate: true` per item), measure conversion before building more.

## Content engine, leveled up
- Keystatic Cloud / GitHub-auth editing if local-only authoring becomes a bottleneck.
- MDX components: charts/embeds for data deep-dives; series/collections; tag index pages.
- Newsletter capture on `/writing` (RSS already shipped).

## Projects
- Ship the `planned` projects toward `building`/`live` (F1, Midterms, CTA, Grocery,
  House Special) — each then claims its subdomain off the wildcard.
- Real screenshots on detail pages (the `screenshots[]` field is wired, unused).

## Quality / platform
- Wire visual-regression into CI with a Linux baseline (or a hosted snapshot service) so
  it's a gate, not just local.
- Post-deploy automation: scheduled Lighthouse + Rich Results + security-headers checks.
- Per-subdomain sitemaps + a sitemap index as the family grows.

## Design
- More theme variants (the transit-map pattern generalizes to seasonal palettes).
- Richer homepage hero / project-family visualization tying the subdomains together.

## Ops carried from v4 (needs Andrew)
- Spotify `user-top-read` re-mint; Vercel `*.an9.dev` wildcard + DNS; DNS CAA;
  DMARC/SPF/DKIM; HSTS preload. See [`../phases/v4.0.0/DEFERRED.md`](../phases/v4.0.0/DEFERRED.md).
