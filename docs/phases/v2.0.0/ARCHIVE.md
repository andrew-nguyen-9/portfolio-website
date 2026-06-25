# v2.0.0 — Archive

**Status:** ✅ Released · frozen. The initial release merged to `main` and tagged
`v2.0.0`; the post-release segments (v2.7 deferred sweep, v2.8 skills slider) were
then consolidated and the finished phase tagged **`v2.1.0`**. This file is the
single complete record of what phase 2 shipped, the decisions made, and where it
deviated from the plan. The working notes ([`PLAN.md`](PLAN.md),
[`DESIGN-RESEARCH.md`](DESIGN-RESEARCH.md), [`BRAINSTORM.md`](BRAINSTORM.md),
[`DEFERRED.md`](DEFERRED.md)) remain for lineage; this file is the summary.

## Goal (met)

Turn the v1 portfolio into a distinctive, editorial, trustworthy site that doubles
as Andrew's project home base — bolder design, a non-card project presentation,
honest passion-project copy, a serious light mode + high-contrast-by-default dark,
and real SEO/security signals — all built under the phase/segment/task workflow.

## What shipped, by segment

- **v2.1 — Design system & theme overhaul.** High-contrast dark is now the *default*
  dark palette; the A11y high-contrast option pushes further (pure `#000`/`#fff`, max
  accent saturation, heavier borders); light mode rebuilt as serious/editorial
  (ink-on-paper). All tokens WCAG-verified. `app/globals.css` is the source of truth,
  mirrored in `lib/theme.ts`. Final hexes recorded in DESIGN-GUIDELINES.
- **v2.2 — Loader & hero.** Hero types only "Andrew Nguyen" (typo cycle + "available"
  badge removed). A shared subtle grain/paper texture layer was added
  (reduced-motion-safe, no contrast/perf cost). **Deviation:** the planned blueprint
  draw-in loader was prototyped (orthographic / compass / isometric) then **set aside —
  the v1 vinyl loader was kept** at Andrew's call.
- **v2.3 — Projects index (non-card).** Flip cards retired for an editorial typographic
  index reading from `content/projects.ts`: hover/focus preview reveal (keyboard +
  touch paths), status filter with a simple-list fallback, and inline detail expand
  (description, tags, links). No project data is hardcoded in the UI.
- **v2.4 — About rewrite & content.** Resume-flavored copy replaced with honest
  first-person passion-project voice (UT Mechanical Engineering; transit/cities,
  architecture, cooking/food, politics & sports *for the statistics*, learning to code
  with AI, Chicago). Stat counters and domain cards reframed as personal throughlines;
  litigation/eDiscovery skill terms cut; skill tabs replaced by a native `<select>`
  dropdown filter over grouped skill pills. `content/projects.ts` taglines reconciled to
  the voice (CTA is a Chicago love letter, not a case study).
- **v2.5 — SEO, security & discoverability.** `app/robots.ts`, `app/sitemap.ts`, a full
  metadata pass (`metadataBase`, canonical, richer OpenGraph + Twitter), a programmatic
  1200×630 OG image (`app/opengraph-image.tsx`, colors pulled from `lib/theme.ts`;
  `twitter-image.tsx` re-exports it), JSON-LD `Person` + `WebSite`, and a tightened CSP
  (`base-uri`, `form-action`, `object-src 'none'`, `upgrade-insecure-requests`).
  Production Lighthouse: **SEO 100, Best Practices 100**.
- **v2.6 — Docs, README & repo reorg.** Root `README.md` refreshed to shipped v2
  reality; the new SEO routes indexed in the `CLAUDE.md` codebase map. Repo structure
  was already clean (`app`/`components`/`content`/`hooks`/`lib`/`docs`/`public`) — no
  file moves were needed.
- **v2.7 — Deferred sweep (post-2.0.0).** Worked the open `DEFERRED.md` questions:
  env-driven Resend sender (`RESEND_FROM` + missing-key guard,
  [`docs/CONTACT-EMAIL.md`](../../CONTACT-EMAIL.md)); CAA / SPF / DMARC / BIMI DNS
  guidance ([`docs/DNS-CAA.md`](../../DNS-CAA.md)); data-driven stat counters;
  richer skills filter (native `<select>` → multi-select toggle chips + live "N
  tools" count); `.section-num` moved to a `::before` pseudo-element so axe/Lighthouse
  skip it; and a **strict nonce-based CSP** via `middleware.ts` (`strict-dynamic`,
  head tags JSX-hoisted so React 19 keeps them in `<head>`). Production Lighthouse:
  **100 / 100 / 100 / 100**. Trade-off: `/` is now dynamically rendered (nonce cost).
- **v2.8 — Skills slider & copy polish (phase close).** The multi-select toggle filter
  became a single **range slider** that scrubs categories (index 0 = All, 1..n = one
  group) with click-to-jump tick labels (`.skill-slider` / `.skill-stop`). Skills and
  interests title-cased (`dbt` left lowercase); Skiing dropped, Swimming + Houseplants
  added. Self-belittling "small/little tools" copy replaced with "tools — useful in my
  life" in the About heading, bio, and OG meta (the shrinkflation "crackers get smaller"
  line and the CTA "move a little better" line are different meanings, left intact).
  This closed the last deferred item ("richer skills section") and ended the phase.

## Phase closeout

- Full-site QA across light / dark-default / dark-HC / light-HC, mobile→desktop,
  reduced-motion, keyboard. **Fixed during QA:** eyebrow/meta labels were faded with
  `opacity-*`, dropping contrast below WCAG AA (worst in light, 3.26:1). Replaced with a
  `.eyebrow` token-color utility (`--fg-subtle`, full opacity) site-wide — now ≥4.99:1
  light, ≥5.2:1 dark, ≥9.98:1 high-contrast. Final Lighthouse a11y **97** (the only miss
  is the decorative `aria-hidden` `.section-num` watermark — exempt under WCAG 1.4.3,
  left intentionally).
- `type-check`, `lint`, and a production `build` clean throughout; 0 console errors.
- Post-2.0.0 segments (v2.7 / v2.8) each re-ran `type-check` + `lint` + production
  `build` clean. v2.7 hit Lighthouse **100 / 100 / 100 / 100** (prod); v2.8 is a
  copy/UI change with no new perf or a11y surface (native range input = keyboard +
  screen-reader support for free via `aria-valuetext`).

## Key decisions & deviations

- **Loader:** blueprint draw-in shelved; v1 vinyl loader kept (v2.2).
- **Hero:** name-only typing; role line and "available" badge dropped (v2.2).
- **Skills UI (evolved across the phase):** old tab strip → native `<select>` dropdown
  (v2.4, accessible for free) → multi-select toggle chips with a live count (v2.7,
  combine categories) → a single **range slider** scrubbing one category at a time
  (v2.8). Each step kept native, keyboard- and screen-reader-accessible controls over a
  custom combobox; the slider trades multi-select for a lighter, more tactile scrub and
  one `number` of state.
- **About "domains":** reframed as personal throughlines, not a project-category service
  menu (v2.4).
- **Contrast:** never fade text with `opacity`; use a muted *token color* so the ratio
  is theme-stable (closeout QA — codified as the `.eyebrow` utility).
- **SEO validation:** always run Lighthouse against a production build — `next dev`
  misplaces generated `<meta>` into `<body>` and falsely reports a missing description.

## Open items carried out of v2 (from DEFERRED.md)

External / not doable in-repo — for Andrew to action:

- **DNS CAA record** authorizing the issuing CA (Let's Encrypt) at the registrar.
- **DMARC / SPF / DKIM** if mail is ever sent from `@an9.dev` (contact form uses Resend).
- **HSTS preload submission** (header is set; submit `an9.dev` at hstspreload.org) and a
  Vercel dashboard check that apex + `www` + the `*.an9.dev` wildcard serve valid certs.
- **Live validation post-deploy:** Google Rich Results Test + a security-headers.com
  scan against the production URL.
- **hCaptcha under the strict CSP (v2.7):** couldn't verify locally (no keys → form uses
  the math fallback). Once `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` / `HCAPTCHA_SECRET` are set on
  the deployed site, confirm the widget renders and the nonce CSP reports no violations.

Full rationale and file:line detail for every autonomous decision and external item is
in [`DEFERRED.md`](DEFERRED.md). Durable feature ideas graduated to
[`../../brainstorming/v3-ideas.md`](../../brainstorming/v3-ideas.md).
