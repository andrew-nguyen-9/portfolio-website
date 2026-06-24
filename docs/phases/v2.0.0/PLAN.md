# v2.0.0 — Phase Plan

**Branch:** `v2` (off `main`) · **Release tag on merge:** `v2.0.0`
**Companion docs:** [`DESIGN-RESEARCH.md`](DESIGN-RESEARCH.md) ·
[`BRAINSTORM.md`](BRAINSTORM.md) · process in [`../../WORKFLOW.md`](../../WORKFLOW.md)

## Goal

Turn the v1 portfolio into a distinctive, editorial, trustworthy site that doubles
as Andrew's project home base. Bolder design and loader, a non-card project
presentation, honest passion-project copy, a serious light mode + high-contrast
dark default, and real SEO/security signals — all built under the new workflow.

## Success criteria

- [ ] Loader and overall UI feel original and intentional (not templated), and
      reviewed against real design references.
- [ ] Projects are presented in a non-card, editorial format.
- [ ] Hero types only the name — no typo cycle.
- [ ] About copy reflects the real Andrew (see segment v2.4 brief).
- [ ] Dark mode *is* the high-contrast look; the A11y high-contrast option goes
      further; light mode reads as serious/editorial.
- [ ] `README.md`, `robots.txt`, `sitemap`, and structured SEO data exist; the
      site presents strong security/legitimacy signals.
- [ ] Repo is reorganized and documented for easy navigation + new-session indexing.
- [ ] All docs reviewed; phase archived; v3 brainstorm written.
- [ ] `type-check`, `lint`, `build` clean; QA + `/code-review` passed.

## Segments

Ordered by dependency: design system first (everything consumes it), then the
signature surfaces, then content, then discoverability, then docs/reorg.

---

### v2.1 — Design system & theme overhaul
**Branch:** `v2.1` · **Depends on:** none

Establish the v2 visual foundation everything else builds on. Implements the
DESIGN-GUIDELINES theme decisions.

- **v2.1.1** — Make the high-contrast dark look the **default** dark palette in
  `app/globals.css` (retire v1's softer dark). Update `lib/theme.ts` to match.
- **v2.1.2** — Push the A11y **high-contrast** option *further* than the new
  default (pure `#000`/`#fff`, max accent saturation, heavier borders). Wire
  through `components/A11yPanel`.
- **v2.1.3** — Rebuild **light mode** to read as serious/editorial (disciplined
  neutrals, higher contrast than v1, sparing accents). Verify AA in all tokens.
- **v2.1.4** — Audit every component for hardcoded colors; move them onto tokens.
- **v2.1.5** — Contrast + theme QA: light / default-dark / max-contrast across all
  sections; update DESIGN-GUIDELINES with the final hex values.

---

### v2.2 — Loading screen & hero
**Branch:** `v2.2` · **Depends on:** v2.1

The two highest-signal first-impression moments.

- **v2.2.1** — **Hero:** remove the typo cycle (`LINE1`/`LINE2`/`BOTH` pools);
  type only "Andrew Nguyen," cleanly. Keep/curate the role line if it still earns
  its place; drop the arrogance. Preserve a11y labels + reduced-motion.
- **v2.2.2** — **Loader:** ~~implement the blueprint draw-in~~ **superseded
  2026-06-24 — keep the v1 vinyl loader.** Andrew reviewed three blueprint
  draw-in prototypes (orthographic / compass / isometric, all resolving into the
  spire monogram) and chose to keep the original spinning-vinyl loader instead.
  The blueprint concept is shelved (not built). The vinyl loader already keeps
  the once-per-session `sessionStorage` gate + reduced-motion bail-out, so no
  loader code changed this segment.
- **v2.2.3** — Verify loader timing/perf against the keep-vinyl decision: never
  delays a returning visitor (`sessionStorage` gate), no layout shift on handoff
  (fixed overlay that translates out; page fades in via opacity), sub-second for
  returning visitors. No change required — confirmed.
- **v2.2.4** — **Shared grain/paper texture layer** (deferred from v2.1): a subtle
  paper/grain layer across the UI for tactility, without reducing token contrast
  or hurting performance. Transform/opacity-friendly; reduced-motion-safe.
- **v2.2.5** — QA hero + grain across themes, breakpoints, reduced-motion,
  keyboard.

---

### v2.3 — Projects presentation (the non-card index)
**Branch:** `v2.3` · **Depends on:** v2.1

Replace flip cards with the interactive editorial index from DESIGN-RESEARCH.

- **v2.3.1** — Build the index layout: large typographic project list with
  metadata (category, status, year), reading from `content/projects.ts`.
- **v2.3.2** — Add the hover/focus interaction (e.g. image/preview reveal,
  motion) — accessible by keyboard, degrades gracefully on touch.
- **v2.3.3** — Filtering/grouping (by category or status) consistent with the new
  layout; keep a simple list fallback.
- **v2.3.4** — Per-project detail affordance (expand or link out to the
  subdomain/repo) without reintroducing card clutter.
- **v2.3.5** — QA: data integrity vs `content/projects.ts`, all themes, a11y,
  touch + pointer.

---

### v2.4 — About rewrite & content
**Branch:** `v2.4` · **Depends on:** v2.1

Rewrite the About section copy and supporting content to be honest passion-project
voice — **not** a resume.

**Copy brief (the real Andrew):**
- University of Texas graduate in **Mechanical Engineering**.
- Loves **public transportation, urban planning, and architecture**.
- Loves **cooking and trying new foods**.
- Learning more **coding**, using **AI to realize his ideas**.
- This site is **both a portfolio and a place to organize/save his projects**.
- Follows **politics and sports for the statistics**.
- Loves **Chicago** — hence a project dedicated to the **CTA**.
- Avoid job-seeking / resume framing entirely.

- **v2.4.1** — Rewrite the About bio copy to the brief above.
- **v2.4.2** — Revisit the stat counters / domain cards / skill tabs / interests so
  they support the passion-project framing (cut anything that reads as resume).
- **v2.4.3** — Reconcile `content/projects.ts` taglines/descriptions with the new
  voice where needed (esp. CTA project as a Chicago love letter).
- **v2.4.4** — QA copy + layout across themes and breakpoints.

---

### v2.5 — SEO, security & discoverability
**Branch:** `v2.5` · **Depends on:** none (can parallel v2.2–v2.4)

Make the site discoverable and make it *read as legitimate* — it's currently
blocked by some corporate security filters, which is the perception to fix.

- **v2.5.1** — `robots.txt` (allow indexing, point to sitemap).
- **v2.5.2** — `sitemap.xml` (Next.js `app/sitemap.ts`).
- **v2.5.3** — SEO metadata pass: titles/descriptions, canonical URLs, richer
  OpenGraph + Twitter cards, a real OG image.
- **v2.5.4** — Structured data (JSON-LD `Person` / `WebSite`) for identity +
  legitimacy signals.
- **v2.5.5** — Security hardening + legitimacy: review/tighten CSP and headers in
  `next.config.ts`, confirm HTTPS/HSTS + cert posture on Vercel, ensure the
  domain presents clean (no mixed content, valid OG, verifiable identity). Note
  any DNS/registrar items for Andrew (CAA, DMARC/SPF if email is involved).
- **v2.5.6** — Validate: Lighthouse SEO + best-practices, rich-results test,
  security-headers scan.

---

### v2.6 — Docs, README & repo reorg
**Branch:** `v2.6` · **Depends on:** all prior segments (documents what shipped)

- **v2.6.1** — Write the GitHub **`README.md`** (overview, stack, structure, how
  to run, link to `docs/`). Truthful to the shipped v2 site.
- **v2.6.2** — Reorganize files + add documentation for easy navigation and
  **new-session indexing** (folder-level notes where helpful; keep the `docs/`
  index honest).
- **v2.6.3** — Update `CLAUDE.md` and all `docs/` to match the final v2 reality.

---

## Phase closeout (after all segments merge into `v2`)

Run the ritual from WORKFLOW.md in order:

- [ ] (a) Full-site QA on `v2` — all themes, breakpoints, reduced-motion, a11y.
- [ ] (b) `/code-review` of the whole `v2` diff vs `main`.
- [ ] (c) Commit QA/review fixes.
- [ ] (d) Merge `v2` → `main`, tag `v2.0.0`.
- [ ] (e) Delete `v2` + any leftover segment branches.
- [ ] (f) Review all documentation files for staleness.
- [ ] (g) Consolidate phase notes into `docs/phases/v2.0.0/ARCHIVE.md`.
- [ ] (h) Write `docs/brainstorming/v3-ideas.md` from everything that came up
      (seeded already — promote/expand it).

## Decisions (resolved with Andrew, 2026-06-24)

- **References:** use the research set in DESIGN-RESEARCH.md (Awwwards + Muzli
  2026). No extra sites supplied; Andrew may add specific ones before v2.2/v2.3.
- **Loader:** ~~drop the vinyl motif — go blueprint draw-in~~ **reversed
  2026-06-24 (segment v2.2): keep the v1 vinyl loader.** Blueprint draw-in
  prototypes were built and reviewed; Andrew preferred the original vinyl. The
  blueprint concept is shelved.
- **Hero:** **name only** — type "Andrew Nguyen" cleanly, no role line.
  (Shipped v2.2.1; the pulsing "Available" hire badge was also dropped.)
- **Texture:** add a **subtle grain** layer (tactility without hurting contrast/perf).
