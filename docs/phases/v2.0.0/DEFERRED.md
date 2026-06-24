# v2.0.0 — Deferred decisions & external items

Autonomous-run log. Each entry is a choice I made without Andrew, or a thing that
can't be done inside the repo. Andrew sweeps this as an adhoc hotfix **after**
phase 2. Format: **topic** — why it needed him · the default I chose · where it
lives · alternatives considered.

---

## Segment v2.4 — About rewrite & content

- **Skills section layout (dropdown filter)** — the brief said "decide the layout
  yourself; log the choice." · **Chose:** a native `<select>` dropdown (`.skill-filter`)
  that filters between "All" and four named skill groups, each rendered as a labeled
  row of pills. Native `<select>` is keyboard- + screen-reader-accessible for free and
  needs no reduced-motion handling. · Lives in `components/About/index.tsx`
  (`AboutContent`, `SKILL_GROUPS`) + `.skill-filter` in `app/globals.css`. ·
  *Alternatives:* kept the old `role="tab"` strip (less "dropdown filter" than the brief
  asked); a custom popover combobox (more code, more a11y surface, no real gain).

- **"Throughlines" replacing data-domain cards** — the v1 domain cards (Music/Sports/
  Civic/Games/Food) read as a service menu. · **Chose:** reframe the five cards as
  personal throughlines from the copy brief — Transit & cities, Architecture, Cooking &
  food, Politics & sports (for the statistics), Building with AI. · Lives in
  `components/About/index.tsx` (`DOMAINS`). · *Alternative:* keep the project-category
  taxonomy, but that duplicated the Projects section and kept the resume flavor.

- **Stat counters reframed** — v1 stats ("APIs integrated 10+", "Data domains") read as
  metrics-flexing. · **Chose:** passion-project framing — Projects in the family (8),
  Things I dig into (5), City it keeps circling (1 = Chicago), Year I'm building it
  (2026). · Lives in `components/About/index.tsx` (`STATS`). · *Alternative:* cut
  counters entirely — kept them because the count-up is a nice, on-brand micro-interaction.

- **Curiosity word rotator** — the v1 heading cycled abstract buzzwords
  ("insight/intelligence/…"). · **Chose:** keep the typing micro-interaction but feed it
  concrete topics ("Chicago", "transit", "elections", "good food", …) under the heading
  "Building small tools for ___". Reduced-motion shows a static first word. · Lives in
  `components/About/index.tsx` (`CuriosityCycler`, `CURIOSITY_WORDS`). · *Alternative:*
  drop the animation entirely — kept it because it's reduced-motion-safe and reads as
  delight-in-detail, not a gimmick.

- **Project copy reconciled to voice** — some taglines led with buzzwords
  ("Artist intelligence…", "Election analytics…"). · **Chose:** lead with the question
  each project answers (DESIGN-GUIDELINES voice rule); CTA rewritten as a Chicago love
  letter. · Lives in `content/projects.ts` (festival, draft, midterms, grocery, cta). ·
  *Untouched on purpose:* parlor / f1 / house-special taglines already read in-voice.

---

## Segment v2.5 — SEO, security & discoverability

### Decisions I made (in-repo)

- **OG image colors hardcoded from `lib/theme.ts`** — `app/opengraph-image.tsx` is a
  server-rendered PNG and genuinely can't read the CSS theme vars. · **Chose:** import
  the typed `tokens.dark` values from `lib/theme.ts` so the card stays in lockstep with
  the default dark palette without re-typing hex. · *Alternative:* fetch a brand font +
  use a static asset — more build weight for a card that's fine in the default sans.

- **Sitemap = homepage only** — the site is one indexable route; project subdomains are
  separate origins. · **Chose:** list `/` only in `app/sitemap.ts`. · *Alternative:*
  enumerate `*.an9.dev` subdomains — wrong, a sitemap is per-origin and those carry
  their own.

- **CSP keeps `'unsafe-inline'` + `'unsafe-eval'` on `script-src`** — Next.js inline
  bootstrap + the theme-flash guard need `'unsafe-inline'`; hCaptcha's api.js needs
  `'unsafe-eval'`. · **Chose:** keep both, but tighten everything else (`base-uri`,
  `form-action`, `object-src 'none'`, `upgrade-insecure-requests`). · *Alternative:*
  nonce-based strict CSP — a large refactor against Next's inline scripts for marginal
  gain on a static marketing site; revisit if Andrew wants a perfect CSP grade.
  Lives in `next.config.ts`.

### External items for Andrew (cannot do in-repo)

- **DNS CAA record** — add a `CAA` record at the registrar/DNS host authorizing only
  the issuing CA (Vercel uses Let's Encrypt: `0 issue "letsencrypt.org"`). Improves the
  security-headers / legitimacy posture. Not doable from the repo.
- **DMARC / SPF / DKIM** — only relevant if mail is ever sent *from* `@an9.dev`. The
  contact form sends via Resend's domain, not necessarily `an9.dev`. If Andrew wants
  mail-from-domain alignment: add SPF (`v=spf1 include:resend.com ~all`), a DKIM record
  from the Resend dashboard, and a DMARC policy (`v=DMARC1; p=none; …` to start). DNS-only.
- **Vercel cert / HSTS preload** — HSTS header with `preload` is set in `next.config.ts`;
  actually submitting `an9.dev` to the HSTS preload list (hstspreload.org) is a one-time
  external action. Confirm the apex + `www` both serve HTTPS with a valid cert in the
  Vercel dashboard (Domains tab). Can't verify from the repo.
- **Vercel domain verification** — ensure `an9.dev` (and `*.an9.dev` wildcard for the
  project subdomains) are verified/attached in the Vercel project's Domains settings.
- **Rich-results / Lighthouse live validation** — JSON-LD validated structurally in
  build; run Google's Rich Results Test + a security-headers.com scan against the live
  prod URL post-deploy to confirm headers survive the edge. Done against localhost here.

### Found during v2.5 validation — RESOLVED in phase closeout QA (step a)

- **Low-opacity label contrast** — Lighthouse flagged eyebrow/meta labels faded with
  `opacity-35/40/45/50` (section kickers, stat sub-labels, footer, nav clock) as below
  WCAG AA — worst in light mode (3.26:1 / 2.18:1). **Fixed** by adding a `.eyebrow`
  utility (`color: var(--fg-subtle); opacity: 1`) in `app/globals.css` and swapping the
  opacity-fade for it across About / Hero / Nav / Footer / Contact / Projects. Verified
  ≥4.99:1 in light, ≥5.2:1 in dark, ≥9.98:1 in both high-contrast palettes — AA
  everywhere, AAA in HC. Final Lighthouse (prod): **SEO 100, Best Practices 100, A11y 97**.

- **`.section-num` watermark still flagged (intentional)** — the giant `aria-hidden`
  ghost numerals (224px, opacity ~.08) are the only remaining color-contrast miss, which
  caps Lighthouse a11y at 97. They are **pure decoration** and exempt under WCAG 1.4.3;
  making them pass would mean rendering a dark, prominent number and destroying the
  design intent. Left as-is by choice. (Lighthouse doesn't honor the decorative
  exemption for `aria-hidden` text, hence 97 not 100.)

- **Dev-server Lighthouse caveat** — running Lighthouse against `next dev` falsely reports
  "no meta description" because dev places Next's generated `<meta>` in `<body>`; the
  production build (`next start`) correctly hoists all 31 tags into `<head>` — verified.
  Always validate SEO against a production build.
