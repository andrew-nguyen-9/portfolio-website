# Workflow

How work moves through this repo, modeled on how a small team of senior engineers
would actually ship: plan, isolate work on branches, build in small reviewable
units, gate every unit on tests + review, and close out cleanly.

Pair this with [`VERSIONING.md`](VERSIONING.md) (the naming) and
[`DESIGN-GUIDELINES.md`](DESIGN-GUIDELINES.md) (the quality bar).

## The three units

```
Phase  v{p}          a release-sized chunk of work          branch: v{p}        off main
 └─ Segment v{p}.{s}  a coherent feature area within it      branch: v{p}.{s}    off v{p}
     └─ Task v{p}.{s}.{t}  one focused change                 commit(s) on the segment branch
```

A **phase** is a version of the website. A **segment** is one buildable area
(e.g. "the theme overhaul"). A **task** is one focused change you could describe
in a single sentence and review in one sitting.

## Phase lifecycle

### 1. Open the phase

- Branch the phase off `main`: `git checkout -b v{p}` (e.g. `v2`).
- Make sure the phase has a plan in `docs/phases/v{p}.0.0/PLAN.md` with its
  segments and tasks laid out. **No code before the plan exists.**

### 2. Work the segments (repeat per segment)

Each segment runs the full loop below before it's allowed back into the phase
branch. This is the non-negotiable part.

1. **Branch** the segment off the phase branch: `git checkout v{p} && git checkout -b v{p}.{s}`.
2. **Complete the tasks** `v{p}.{s}.1 … v{p}.{s}.t`, committing per task.
3. **Build it out** — real implementation, not stubs.
4. **Test** — `npm run type-check`, `npm run lint`, `npm run build`, plus any
   behavior checks for the change.
5. **QA** — exercise it like a user (Playwright / Chrome DevTools MCP, real
   browser, mobile + desktop, light/dark/high-contrast, reduced-motion).
6. **`/code-review`** — run the review; address findings.
7. **Commit** the cleanup.
8. **Push to the parent** — merge the segment branch into the phase branch
   `v{p}` (fast-forward or `--no-ff` per VERSIONING), then delete the segment
   branch.

A segment that hasn't been tested, QA'd, and reviewed does **not** go into the
phase branch.

### 3. Close the phase

When all segments are merged into `v{p}`, run the closeout ritual **in order**:

- **(a) QA testing** — full-site pass on the phase branch, all themes/breakpoints.
- **(b) `/code-review`** — review the whole phase diff against `main`.
- **(c) Commit** — final fixes from QA + review.
- **(d) Merge to `main`** — merge `v{p}` into `main` and tag `v{p}.0.0`.
- **(e) Delete old branch(es)** — remove the phase branch and any stragglers
  (`git branch -d`, prune remotes).
- **(f) Review all documentation files** — README, CLAUDE.md, design guidelines,
  this workflow — fix anything the phase made stale.
- **(g) Consolidate & archive phase docs** — fold the phase's working notes into
  `docs/phases/v{p}.0.0/ARCHIVE.md` (what shipped, decisions, deviations).
- **(h) Write the next brainstorm** — capture every fix, feature, and idea that
  surfaced during the phase into `docs/brainstorming/v{p+1}-ideas.md`.

## Rules that don't bend

- **`main` is always shippable.** Never commit directly to it. It only ever
  receives reviewed, QA'd phase merges.
- **Small tasks beat big ones.** If a task can't be reviewed in one sitting,
  split it.
- **Tests + review gate every merge** — both at the segment boundary and the
  phase boundary.
- **Docs are part of "done."** A phase isn't closed until step (f)–(h) are done.
- **No AI attribution** in commits, PRs, or branch names (see `/CLAUDE.md`).

## Commit messages

Conventional-commit style, scoped to the task where useful:

```
feat(theme): adopt high-contrast as the default dark palette   [v2.1.2]
fix(hero): drop typo cycle, type name only                     [v2.2.1]
docs: archive v2 phase notes                                   [v2.0.0]
```

The trailing `[v{p}.{s}.{t}]` ties the commit back to the plan.
