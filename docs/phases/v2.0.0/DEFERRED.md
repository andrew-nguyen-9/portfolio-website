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
