# v2.0.0 — Design Research & Direction

Research feeding the v2 design revamp (loader + overall UI + project presentation).
Decisions here flow into the durable [`../../DESIGN-GUIDELINES.md`](../../DESIGN-GUIDELINES.md).

## What award-winning portfolios are doing in 2026

From a scan of Awwwards portfolio winners, Muzli's 2026 roundups, and current
trend write-ups:

- **Motion-first, immersive UX** — micro-interactions, scroll-driven reveals,
  smooth scrolling as table stakes.
- **Editorial & typographic** — large display type, real hierarchy, generous
  whitespace; the layout *is* the design, not a chrome around content.
- **Texture & tactility** — grain, paper, material feel to escape the flat
  template look.
- **Narrative over grid** — "Hero → About → Projects grid" is the cliché to
  avoid; winners tell a story or organize around the maker's worldview.
- **Gamified / 3D at the extreme** — e.g. Bruno Simon's drivable 3D world, Robby
  Leonardi's side-scroller. Impressive, but only when the gimmick *is* the skill
  being shown.

**Our read for Andrew:** lean **editorial + motion + texture**, *not* gamified 3D.
A driving-game portfolio would fight his identity (a serious engineer whose work
is data/civic/transit). The differentiator is treating the site like a well-
designed transit map / architectural plan / magazine — precise, typographic,
quietly confident. That's both on-brand and genuinely distinctive.

References to study during build (Andrew may add his own):
- Awwwards portfolio winners & nominees — <https://www.awwwards.com/websites/winner_category_portfolio/>
- Muzli "100 Best Designer Portfolios 2026" — <https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/>
- Portfolio trend overviews — <https://elements.envato.com/learn/portfolio-trends>, <https://colorlib.com/wp/portfolio-design-trends/>

## Direction: project presentation (replacing cards) — segment v2.3

**Proposal: an interactive editorial index.** Instead of a grid of flip cards,
present projects as a large typographic list — closer to a magazine table of
contents or a departures board than a card wall.

- Each row: big serif project name + monospace metadata (category · status ·
  year), drawn from `content/projects.ts`.
- On hover/focus: the row's preview image (or an abstract category visual)
  reveals — floating near the cursor on pointer devices, inline on touch.
- Grouping/filtering by category or status, presented as part of the index, not
  as a separate card filter bar.
- Expanding a row (or clicking through) reveals description + tags + links to the
  `*.an9.dev` subdomain and repo — without rebuilding a card.

Why it fits: it's typographic (serious), motion-rich (modern), non-card (the
explicit ask), and it scales as the project family grows. The v1 list view can
survive as a graceful fallback.

*Alternatives considered:* horizontal scroll gallery (weaker for many projects),
3D/gamified showcase (off-brand), masonry grid (still cards). The index wins on
fit + distinctiveness.

## Direction: loading screen — segment v2.2

The v1 loader is a spinning vinyl record. A v2 replacement was explored but
**not adopted — see the reversal below.**

**Status (updated 2026-06-24, segment v2.2): keep the v1 vinyl loader.**
The architectural plan draw-in was prototyped (three directions — orthographic
elevation, compass set-out, isometric projection — each resolving into the
spire monogram) and reviewed with Andrew, who preferred the original vinyl.
The blueprint concept is shelved; the vinyl loader ships unchanged in v2.

History of the exploration:

1. ~~Departures-board / split-flap~~ — set aside.
2. ~~Architectural plan draw-in~~ — prototyped, then **set aside 2026-06-24**
   (kept vinyl instead). Could be revisited in a later phase if revived.
3. ~~Data-to-form~~ — set aside.
4. **Evolve / keep the vinyl** — *this is what ships.*

Constraints (all concepts): once-per-session via `sessionStorage`, full
`prefers-reduced-motion` bail-out, no layout shift on handoff, sub-second
perceived to a returning visitor.

## Direction: overall UI

- **Typography:** push the editorial serif (Cormorant / Instrument / Newsreader)
  against monospace labels (JetBrains / IBM Plex Mono) — that pairing is the
  signature. Already loaded; no new families needed.
- **Texture:** subtle grain/paper layer to add tactility without hurting
  contrast or performance.
- **Color:** dark = bold high-contrast (new default), light = serious/editorial,
  A11y high-contrast = maximal. See DESIGN-GUIDELINES.
- **Motion:** Lenis smooth scroll + reveal-on-scroll already in place; extend
  with purposeful section transitions, all reduced-motion-aware.

## Decisions (resolved with Andrew, 2026-06-24)

- **Loader concept: blueprint draw-in** — *reversed 2026-06-24 in segment v2.2.*
  Prototyped (orthographic / compass / isometric) and reviewed; Andrew chose to
  **keep the v1 vinyl loader**. Blueprint shelved.
- **Texture: yes — subtle grain.** A light paper/grain layer for tactility,
  not at the expense of contrast or performance.
- **References: use the research set** above (Awwwards winners + Muzli 2026); no
  additional reference sites supplied. Andrew may send specific ones before the
  v2.2/v2.3 build if he finds them.

Hero (decided for v2.2): **name only**, no role line — see PLAN.md.
