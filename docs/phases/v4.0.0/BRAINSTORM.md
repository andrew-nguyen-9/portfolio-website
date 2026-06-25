# v4.0.0 — Brainstorm & Design ("Home Base")

> 🧠 **Design doc, not the plan.** This captures the validated v4 direction from the
> brainstorming conversation. The working task breakdown lives in `PLAN.md` (written
> via the writing-plans step). At phase close, `ARCHIVE.md` records what actually
> shipped. Backlog source: [`../../brainstorming/v4-ideas.md`](../../brainstorming/v4-ideas.md).

**Branch:** `v4` (off `main`) · **Release tag on merge:** `v4.0.0`
**Process:** [`../../WORKFLOW.md`](../../WORKFLOW.md) · [`../../VERSIONING.md`](../../VERSIONING.md)

---

## Thesis

Turn an9.dev from a project **index** into a project **home base**: every project gets
a real page, a smart subdomain, and a reason to be found. SEO compounds through
writing; the project family gets tied together. This is a deliberately large,
**transformative** phase — the whole `v4-ideas.md` backlog is in scope, organized into
sequenced segments.

Voice stays **passion projects, not a job hunt** (see `docs/DESIGN-GUIDELINES.md`).

## Invariants (do not break)

- `content/projects.ts` remains the **single source of truth** for the project list.
  Everything new (detail pages, subdomain routing, OG, sitemap) is driven from it.
- Never commit to `main`; never skip segment QA + `/code-review`.
- `npm run type-check` + `npm run lint` green before any segment is declared done.
- Strict-nonce CSP, Lighthouse 100s, and the v2/v3 security posture are preserved.

## Decisions (from brainstorming)

| Question | Decision |
|----------|----------|
| SEO goal | **Content engine** — a writing surface becomes the SEO flywheel |
| Revenue (v4) | **Affiliate-in-content only.** Stripe `/shop`, metered data/API, freemium ACOS → **v5** |
| Skill-flex projects | **Mix** — level up existing 8 *and* add ACOS + one net-new AI flagship |
| Subdomain mapping | **Status-aware routing** driven by the registry |
| Repo scope | **Showcase + scaffold** — this repo owns showcase/SEO/content; also scaffolds satellite repos |
| ACOS framing | **Include as-is** on the grid; copy stays craft-focused, not résumé-pitch |
| Content CMS | **Keystatic** — git-based CMS UI that commits MDX into this repo (no hosted infra) |
| Content home | Apex **`/writing`** (Keystatic-managed MDX), not a separate subdomain |
| Phase headline | **Showcase foundation** ships first |

## Net-new AI flagship (slot reserved — concept deferred)

**Resolved:** reserve the registry slot now as a `planned` project; **do not commit a
concept in v4.** v4.1 adds the entry so routing/OG/sitemap treat it like any other
planned project, but the actual flagship build (and its concept — the "data concierge"
agentic NL-Q&A idea is one candidate, not a commitment) gets its own future segment so
the showcase foundation isn't blocked on it.

---

## Segment map (sequenced)

### v4.1 — Showcase foundation ⭐ headline
- Per-project detail pages `/projects/[id]`: write-up, screenshots, "what I learned",
  links out. Driven from the registry.
- **Status-aware subdomain routing**: registry `status` drives behavior —
  `planned` → auto coming-soon/teaser; `building` → teaser + repo; `live` → redirect out.
  Adding a project = one registry entry, no DNS clicks.
- Per-project OG images + `CreativeWork`/`SoftwareApplication` JSON-LD + sitemap entries.
- Registry extended: add **ACOS** + the net-new AI flagship; level-up tags/status on
  Draft Tool (ML projections) & Festival (breakout predictor).

### v4.2 — Content engine (SEO flywheel)
- **Keystatic** → MDX articles in-repo; `/writing` index + `/writing/[slug]`; RSS;
  `Article`/`BlogPosting` JSON-LD; reading-time; tags.
- Home for ACOS / project deep-dives and the "how I built X" writing.

### v4.3 — Affiliate revenue (light, rides on content)
- Affiliate-link component + disclosure banner + a `/uses`-style resources page.
  **FTC-compliant.** No checkout, no Stripe (deferred to v5).

### v4.4 — Project scaffold automation
- Template/script that scaffolds a new satellite repo (boilerplate, CI, subdomain
  wiring from the registry) so "add a project" is one flow. Produces sibling repos;
  lives as tooling here.

### v4.5 — Design & interaction (absorbs the v4-ideas design backlog)
- Theme variants beyond light/dark (seasonal / "transit map" palette).
- Genuinely interactive hero (subtle, on-brand).
- View-transition API for smoother section/page navigation.
- Loader theming — token-drive the vinyl SVG / intentional dark→light handoff.
- "Now" / changelog page — what Andrew is building this month.
- Spotify expansions: recently-played feed + top-artists/genres viz (ties to Festival).

### v4.6 — SEO + quality hardening (phase close)
- Programmatic OG everywhere · per-subdomain sitemaps · JSON-LD coverage audit ·
  Core Web Vitals pass.
- **Lazy-load hCaptcha** on contact-form focus (known Best-Practices win).
- Token-drift guard (`lib/theme.ts` ↔ `globals.css`) · visual-regression tests
  (Playwright screenshots) · CI (type-check / lint / build on PRs into phase branches).
- **Andrew-checklist (ops, not code):** DNS CAA · DMARC/SPF/DKIM (if mail-from-`@an9.dev`) ·
  HSTS preload submission · cert/domain posture (apex, `www`, `*.an9.dev`) ·
  post-deploy Rich Results Test + security-headers scan against prod.

---

## Explicitly deferred to v5

- Stripe `/shop`, metered data/API products, freemium ACOS — built once affiliate +
  content prove there's an audience.
- Monorepo pivot (considered, rejected for v4 — would be its own phase).

## Open items — resolved in planning

1. **AI flagship concept** → **slot reserved, concept deferred.** v4.1 adds a `planned`
   registry entry; the build/concept moves to a future segment (see section above).
2. **Status-aware routing render location** → **apex `/projects/[id]`.** Teaser +
   coming-soon render on the apex detail page; planned/building subdomains *redirect to
   apex*; only `live` redirects out to the real project. One wildcard redirect, no
   per-project teaser deploys.
3. **Keystatic auth/deploy model** → **local-only editing.** Keystatic runs in local dev
   and commits MDX to git; production is read-only static. No hosted admin surface, no new
   auth surface to harden against the strict-nonce CSP.
