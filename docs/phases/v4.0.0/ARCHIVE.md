# v4.0.0 — Phase Archive ("Home Base")

> 📦 **What actually shipped.** Companion to [`PLAN.md`](PLAN.md) (the plan) and
> [`BRAINSTORM.md`](BRAINSTORM.md) (the design). Records deviations from the plan and
> what carried forward. Phase merged to `main` and tagged `v4.0.0`.

**Branch:** `v4` (off `main`) → merged to `main` · **Tag:** `v4.0.0`
**Thesis delivered:** an9.dev went from a project *index* to a project *home base* —
every project has a real page, status-aware routing, per-project SEO, a writing surface,
and the project family is tied together. All driven from `content/projects.ts`.

## Shipped

### Showcase foundation (planned v4.1, built as v4.7.1)
- `/projects/[id]` detail pages (write-up, "what I learned", screenshots, links),
  `force-dynamic` for nonce'd `SoftwareApplication` JSON-LD.
- **Status-aware routing** in `middleware.ts`: `*.an9.dev` project subdomains 308-redirect
  to the apex detail page (planned/building teaser on apex; live projects have their own
  deploy). Adding a project = one registry entry.
- Per-project programmatic OG image, sitemap entries.
- Registry extended: `Project` type gained `writeUp`/`whatILearned`/`screenshots`;
  featured projects got rich copy; **ACOS** (placeholder copy) + **Data Concierge** AI
  slot added as `planned`.

### Content engine (v4.2)
- Git-based MDX content engine (`lib/writing.ts`, `next-mdx-remote`, `gray-matter`):
  `/writing` index + `/writing/[slug]`, reading-time, tags, `BlogPosting` JSON-LD,
  per-article OG image, RSS feed, sitemap + discovery link, one seed article.
- `scripts/check-content.mjs` validates frontmatter (CI gate).
- **Keystatic** (v4.7.2): local-only authoring GUI over the same MDX files, dev-gated
  (404 in prod) and excluded from the strict CSP.

### Affiliate (v4.3)
- `AffiliateLink` (`rel="sponsored"`) + FTC `Disclosure` (auto-shown) + `/uses` page.
  No checkout/Stripe (deferred to v5).

### Design & interaction (v4.5)
- Transit-map theme variant (A11y panel, pre-paint, drift-guarded) · loader theming
  (tokenized vinyl + theme-accent waveform) · interactive hero (pointer parallax) ·
  cross-route View Transitions · `/now` changelog · Spotify expansions (recently-played
  feed + top-genre chips).

### Quality & SEO (v4.6)
- Lazy-loaded hCaptcha (engagement-gated) · token-drift guard · GitHub Actions CI
  (type-check/lint/content/tokens/scaffold-self-test/SEO/build) · visual-regression
  (Playwright, local) · SEO coverage audit + per-article OG.

### Tooling (v4.7.7)
- `scripts/scaffold-project.mjs` — generates a Next.js + Supabase satellite starter +
  the registry entry. `docs/SCAFFOLD.md`.

## Deviations from the plan

- **Built out of dependency order** at Andrew's direction: v4.2→v4.6 shipped before the
  v4.1 foundation, which landed as **v4.7.1**.
- **Keystatic** was deferred out of v4.2 (plain-MDX engine first, to avoid a CSP/dep
  fight), then shipped in **v4.7.2** as an additive local-only GUI — no rework.
- **AI flagship**: only the reserved slot shipped (Data Concierge, `planned`); the build
  and final concept are deferred to v5 (BRAINSTORM decision held).
- **Branching**: v4.2–v4.6 were committed directly on `v4`; v4.7 and v4.8 used segment
  branches merged with `--no-ff`. Earlier per-segment `/code-review` was folded into a
  single phase-close review.
- **ACOS** shipped with placeholder copy (`TODO(andrew)` in `content/projects.ts`) —
  real name/tagline/subdomain pending.

## Carried forward → see [`DEFERRED.md`](DEFERRED.md)

AI flagship build, Stripe/commerce, monorepo pivot, and the external/ops setup
(Spotify scope re-mint, Vercel wildcard + DNS, deliverability records, post-deploy
Lighthouse/Rich-Results/security scans).
