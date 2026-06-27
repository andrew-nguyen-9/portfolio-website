# v4.0.0 — Phase Plan ("Home Base")

> 🚧 **Planned.** Working plan for phase 4. For what actually ships — including
> deviations — an `ARCHIVE.md` is written at phase close (see the v2 archive for the
> pattern). Design rationale + locked decisions live in
> [`BRAINSTORM.md`](BRAINSTORM.md).

**Branch:** `v4` (off `main`) · **Release tag on merge:** `v4.0.0`
**Backlog source:** [`../../brainstorming/v4-ideas.md`](../../brainstorming/v4-ideas.md) ·
process in [`../../WORKFLOW.md`](../../WORKFLOW.md) · [`../../VERSIONING.md`](../../VERSIONING.md)

## Goal

Turn an9.dev from a project **index** into a project **home base**: every project gets a
real detail page, status-aware subdomain routing, and per-project SEO — all driven from
`content/projects.ts`. Then stand up a git-based **content engine** (`/writing`) as the
SEO flywheel, ride light **affiliate** revenue on that content, automate **new-project
scaffolding**, land the deferred **design/interaction** backlog, and close with an
**SEO + quality hardening** pass.

Deliberately **transformative** (the whole v4 backlog), sequenced so the showcase
foundation ships first and each segment stands on its own.

Voice stays **passion projects, not a job hunt** ([`../../DESIGN-GUIDELINES.md`](../../DESIGN-GUIDELINES.md)).

## Locked decisions (from BRAINSTORM)

- **AI flagship** → slot reserved as a `planned` registry entry in v4.1; concept + build
  deferred to a future segment. Do not build the flagship in v4.
- **Status-aware routing** → teaser/coming-soon render on **apex `/projects/[id]`**;
  `planned`/`building` subdomains **redirect to apex**; only `live` redirects out to the
  real project. One wildcard redirect, no per-project teaser deploys.
- **Keystatic** → **local-only editing** (runs in dev, commits MDX to git); production is
  read-only static. No hosted admin surface, no new auth surface.

## Invariants (do not break)

- `content/projects.ts` stays the **single source of truth**. Detail pages, routing, OG,
  JSON-LD, and sitemap all derive from it.
- Never commit to `main`; never skip segment QA + `/code-review`.
- `npm run type-check` + `npm run lint` (+ production `build`) green before any segment is
  declared done.
- Strict-nonce CSP, Lighthouse 100s, and the v2/v3 security posture preserved.

## Success criteria

- [ ] Every project in the registry has a working `/projects/[id]` detail page, themed
      across light / dark-default / dark-HC / light-HC.
- [ ] Adding a project = **one registry entry** — detail page, routing behavior, OG, and
      sitemap entry all follow with no DNS clicks or per-file edits.
- [ ] `planned`/`building` subdomains redirect to apex; `live` redirects out. Status is
      the only knob.
- [ ] `/writing` index + `/writing/[slug]` render Keystatic-managed MDX with
      `Article`/`BlogPosting` JSON-LD, RSS, reading-time, and tags.
- [ ] Affiliate links carry an FTC-compliant disclosure; no checkout/Stripe anywhere.
- [ ] A documented scaffold flow produces a new satellite repo wired to a registry entry.
- [ ] Phase-close Lighthouse (production build) holds 100s; hCaptcha lazy-loads on form
      focus; CI runs type-check/lint/build on PRs into phase branches.

---

## Run status (autonomous run, 2026-06-25)

Built out of dependency order at Andrew's request (v4.2→v4.6 first; v4.1 was held back).

- ✅ **Shipped & verified** (type-check/lint/build + runtime smoke): shared `SiteChrome`
  + pathname-aware `Nav`; **v4.2** content engine (plain-MDX, no Keystatic yet);
  **v4.3** affiliate + `/uses`; **v4.5.5** `/now`; **v4.6.1/2/4** (lazy hCaptcha,
  token-drift guard, CI).
- ✅ **v4.7 shipped & merged to v4** (2026-06-26): **v4.7.1** showcase foundation
  (detail pages + status-aware routing + per-project OG/JSON-LD/sitemap; ACOS +
  Data Concierge slots added); **v4.7.2** Keystatic (local-only, dev-gated);
  **v4.7.3** view transitions; **v4.7.4** transit-map theme; **v4.7.5** interactive hero;
  **v4.7.6** Spotify recently-played + top-genres; **v4.7.7** scaffold automation.
  All verified (type-check/lint/content/tokens/scaffold-self-test/build + runtime smoke).
- ✅ **v4.8 shipped & merged** (final code): **v4.5.2** loader theming; **v4.6.3**
  visual-regression (Playwright, local baselines); **v4.6.5** SEO coverage audit +
  per-article OG. All gates green.
- ✅ **Phase closed (v4.6.6)**: `ARCHIVE.md` + `DEFERRED.md` written, `v5-ideas.md`
  seeded, `/code-review` run, merged to `main`, tagged `v4.0.0`, branches deleted.
- ⏳ **Carried to v5 / needs Andrew** (not code — see `DEFERRED.md`): AI flagship build,
  commerce, ACOS real copy, Spotify `user-top-read` re-mint, Vercel `*.an9.dev`
  wildcard + DNS, deliverability records, post-deploy Lighthouse/Rich-Results/security.

## Segment map

Ordered by dependency: the registry-driven foundation first (everything consumes it),
then content, then revenue/tooling that ride on content, then design polish, then the
hardening close.

---

### v4.1 — Showcase foundation ⭐ headline
**Branch:** `v4.1` · **Depends on:** none

The registry-driven surface everything else builds on.

- **v4.1.1** — Extend the `Project` type + `content/projects.ts`: ensure each project has
  the fields detail pages need (`writeUp`/long description, `screenshots[]`,
  `whatILearned`, `status`, `subdomain`, `repoUrl`, `tags`). Add the **ACOS** entry and a
  **reserved AI-flagship** entry as `status: "planned"`. Level-up tags/status on Draft
  Tool (ML projections) and Festival (breakout predictor). No UI yet — type + data only.
- **v4.1.2** — `app/projects/[id]/page.tsx` (+ `generateStaticParams` from the registry):
  detail page rendering write-up, screenshots, "what I learned", and links out. Themed
  with tokens (no hardcoded hex), reuses existing section rhythm. `notFound()` for unknown
  ids.
- **v4.1.3** — **Status-aware routing.** In `middleware.ts`, map `*.an9.dev` subdomain
  host → registry entry by `subdomain`: `planned`/`building` → redirect to
  `/projects/[id]` on apex; `live` → pass through / redirect to the real target. Apex
  detail page renders the right state (coming-soon/teaser vs. full) off `status`. Leave
  nonce / `strict-dynamic` / all other CSP directives untouched; re-verify no violations.
- **v4.1.4** — Per-project **OG images**: `app/projects/[id]/opengraph-image.tsx`
  (programmatic, mirrors the apex OG approach) driven from registry fields.
- **v4.1.5** — Per-project **JSON-LD** (`CreativeWork`/`SoftwareApplication`) on the
  detail page + **sitemap** entries for every project in `app/sitemap.ts`, derived from
  the registry.
- **v4.1.6** — Segment QA: all four themes, mobile→desktop, keyboard, reduced-motion;
  `type-check` + `lint` + production `build` clean; `/code-review`; merge `v4.1` → `v4`.

---

### v4.2 — Content engine (SEO flywheel)
**Branch:** `v4.2` · **Depends on:** v4.1

Git-based writing surface; the long-term SEO compounding lever.

- **v4.2.1** — Install + configure **Keystatic** in **local-only** mode: a `keystatic`
  collection for articles writing MDX into the repo (e.g. `content/writing/*.mdx`), local
  admin route gated to dev only (never shipped/served in production). Define frontmatter
  schema: `title`, `slug`, `publishedAt`, `summary`, `tags[]`, optional `coverImage`.
- **v4.2.2** — `app/writing/page.tsx` — index listing articles (newest first) with
  reading-time + tags, themed with tokens.
- **v4.2.3** — `app/writing/[slug]/page.tsx` (+ `generateStaticParams`): render MDX with
  the project's typography/motion conventions; reading-time; tag chips; prev/next or
  back-to-index.
- **v4.2.4** — `Article`/`BlogPosting` **JSON-LD** per article + `/writing` and articles
  added to `app/sitemap.ts`.
- **v4.2.5** — **RSS** feed route (`app/writing/rss.xml` or `feed.xml`) generated from the
  article collection.
- **v4.2.6** — Seed **one real article** (an ACOS or "how I built X" deep-dive) end-to-end
  to prove the authoring → commit → render flow. CSP check (MDX must not need inline
  script; if it adds any host, justify + re-verify nonce posture).
- **v4.2.7** — Segment QA (themes/responsive/a11y/build) + `/code-review`; merge → `v4`.

---

### v4.3 — Affiliate revenue (light, rides on content)
**Branch:** `v4.3` · **Depends on:** v4.2

FTC-compliant affiliate links inside content. **No checkout, no Stripe** (deferred to v5).

- **v4.3.1** — Affiliate-link component (usable inside MDX) with `rel="sponsored nofollow
  noopener"` and `target="_blank"`; takes a label + url + optional note.
- **v4.3.2** — **Disclosure** primitives: a reusable disclosure banner/notice component
  and standard copy; render it on any page/article that contains affiliate links.
- **v4.3.3** — A `/uses`-style **resources page** (registry- or MDX-driven) collecting the
  tools/gear with affiliate links + the disclosure.
- **v4.3.4** — Segment QA + `/code-review`; merge → `v4`.

---

### v4.4 — Project scaffold automation
**Branch:** `v4.4` · **Depends on:** v4.1

Make "add a project" one flow. Produces sibling/satellite repos; the tooling lives here.

- **v4.4.1** — A scaffold **script** (`scripts/scaffold-project.*`) that, given a slug +
  basic metadata, generates a new satellite-repo boilerplate (framework starter, CI,
  README, subdomain placeholder) into a target dir or via `gh repo create`.
- **v4.4.2** — Wire the registry: the script appends/prints the `content/projects.ts`
  entry (status `planned`, subdomain) so routing/OG/sitemap pick it up immediately.
- **v4.4.3** — `docs/SCAFFOLD.md` documenting the one flow (run script → review registry
  entry → push satellite repo → DNS once) + the Vercel wildcard expectation.
- **v4.4.4** — Segment QA (dry-run the script, verify generated repo builds) +
  `/code-review`; merge → `v4`.

---

### v4.5 — Design & interaction (absorbs the v4-ideas design backlog)
**Branch:** `v4.5` · **Depends on:** v4.1

Polish; each task independently shippable. Pick up where v3 left the design backlog.

- **v4.5.1** — **Theme variants** beyond light/dark (seasonal / "transit map" palette) as
  additional token sets; respect the existing theme-switch + flash guard.
- **v4.5.2** — **Loader theming**: token-drive the vinyl SVG / make the dark→light handoff
  intentional (no hardcoded loader colors).
- **v4.5.3** — **Interactive hero**: subtle, on-brand motion (reduced-motion safe). Keep
  Lighthouse + no-blocking-first-paint intact.
- **v4.5.4** — **View Transitions API** for smoother section/page navigation (progressive
  enhancement; degrade cleanly where unsupported).
- **v4.5.5** — **"Now" / changelog page** — what Andrew is building this month
  (registry-/MDX-driven so it stays cheap to update).
- **v4.5.6** — **Spotify expansions**: recently-played *feed* (not just one track) +
  top-artists/genres viz (ties to Festival). Reuses the v3 secure token route; extend
  scopes only if needed.
- **v4.5.7** — Segment QA (all themes incl. new variants, responsive, a11y, reduced-motion,
  build) + `/code-review`; merge → `v4`.

---

### v4.6 — SEO + quality hardening (phase close)
**Branch:** `v4.6` · **Depends on:** all prior segments

- **v4.6.1** — **Lazy-load hCaptcha** on contact-form focus — the known cold-audit
  Best-Practices win (removes deprecated-API / third-party-cookie hits for visitors who
  never open the form).
- **v4.6.2** — **Token-drift guard**: a check (script/test) so `lib/theme.ts` and
  `app/globals.css` can't silently diverge.
- **v4.6.3** — **Visual-regression tests** (Playwright screenshots) for key
  pages/themes, wired into the QA loop.
- **v4.6.4** — **CI**: type-check / lint / build on PRs into phase branches (GitHub
  Actions).
- **v4.6.5** — **SEO coverage audit**: programmatic OG everywhere, JSON-LD coverage,
  sitemap completeness (apex + per-project + writing), Core Web Vitals pass on a
  **production build** (per the v2 lesson: never validate on `next dev`).
- **v4.6.6** — `/code-review`; write `ARCHIVE.md` + any `DEFERRED.md`; review all docs;
  merge `v4` → `main`; tag `v4.0.0`; delete spent branches; seed `v5-ideas.md`.

---

### v4.7 — Deferred from the autonomous run
**Branch:** `v4.7` · **Depends on:** none (v4.1 first within it)

Carries the work held back on 2026-06-25, with decisions locked:

- **v4.7.1 — v4.1 showcase foundation (build first).** Per-project `/projects/[id]`
  detail pages + status-aware subdomain routing (apex render, per BRAINSTORM) + per-project
  OG/JSON-LD/sitemap + registry extend (ACOS + reserved AI slot). Chrome + sitemap patterns
  from this run are already in place.
- **v4.7.2 — Keystatic GUI** (local-only) over the existing `content/writing/*.mdx`.
  Verify it doesn't require loosening the nonce-CSP; gate the admin to dev.
- **v4.7.3 — View Transitions API** for cross-route nav (home ↔ /writing). Progressive
  enhancement; degrade where unsupported.
- **v4.7.4 — Theme variants** (seasonal / "transit map" palettes). Needs an aesthetic
  direction; add as token sets, keep token-drift guard green.
- **v4.7.5 — Interactive hero** (subtle, on-brand, reduced-motion safe). Touches homepage.
- **v4.7.6 — Spotify expansions** — recently-played feed + top-artists/genres viz (ties to
  Festival). Reuses v3 token route; re-verify scopes/tokens.
- **v4.7.7 — v4.4 scaffold automation** producing a **Next.js + Supabase** satellite
  starter wired to a registry entry (`docs/SCAFFOLD.md`).

## Risks & deferrals

**Deferred (out of scope for v4 → v5):**
- **Stripe `/shop`**, metered data/API products, freemium ACOS — built once affiliate +
  content prove there's an audience.
- **Net-new AI flagship build** (the "data concierge" is one candidate concept, not a
  commitment) — only its `planned` registry slot ships in v4.
- **Monorepo pivot** — considered, rejected for v4; would be its own phase.

**Risks:**
- **Subdomain routing depends on Vercel wildcard + DNS.** Middleware redirects can only be
  fully verified once `*.an9.dev` points at this deployment. Apex `/projects/[id]` states
  must be airtight independent of DNS so the apex experience never depends on it.
- **Keystatic CSP fit.** Local-only mode keeps the admin out of production, but MDX
  rendering must not require inline script. Verify the strict-nonce CSP holds; justify any
  new `*-src` host.
- **Scope.** Six segments is large. Each segment merges to `v4` independently and stands
  on its own — if time runs short, later segments (v4.5 design, parts of v4.4) can slip to
  v5 without blocking the headline foundation.

**External (Andrew, not code) — phase-close checklist:**
- DNS **CAA**; **DMARC/SPF/DKIM** if mail-from-`@an9.dev`; **HSTS preload** submission;
  cert/domain posture (apex, `www`, `*.an9.dev` wildcard).
- Vercel **wildcard domain** + redirect config for `*.an9.dev`.
- Post-deploy **Rich Results Test** + **security-headers scan** against prod.
