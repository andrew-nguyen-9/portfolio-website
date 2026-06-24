# Versioning

The version scheme is **`v[phase].[segment].[task]`** — `v{p}.{s}.{t}`.

It looks like semver but it isn't: the three numbers map to the three units of
work in [`WORKFLOW.md`](WORKFLOW.md), not to API breakage.

| Position | Name | Meaning | Example |
|----------|------|---------|---------|
| `p` | **Phase** | A release-sized version of the site. Bumps when a new phase opens. | `v2` |
| `s` | **Segment** | A feature area inside a phase. Resets to `1` each phase. | `v2.3` |
| `t` | **Task** | One focused change inside a segment. Resets to `1` each segment. | `v2.3.4` |

## Release tags vs. work IDs

There are two different uses of these numbers — keep them straight:

- **`v{p}.0.0` is a release tag.** It marks the state of `main` after a phase
  merges. `v1.0.0` = all work prior to this system. `v2.0.0` = `main` after
  phase 2 ships. The `.0.0` baseline of a phase is also the planning/doc snapshot
  that opens it.
- **`v{p}.{s}.{t}` (with non-zero s/t) is a work-item ID**, used in the plan and
  in commit messages to trace a change back to its task. They are *not* git tags —
  they live in `docs/phases/v{p}.0.0/PLAN.md` and in commit trailers like
  `[v2.3.4]`.

So `v2.0.0` is a tag on `main`; `v2.3.4` is "phase 2, segment 3, task 4" — a line
in the plan and a commit, not a release.

## Branch naming

| Branch | Off of | Purpose | Lifetime |
|--------|--------|---------|----------|
| `main` | — | Always-shippable. Receives reviewed phase merges only. | permanent |
| `v{p}` | `main` | Integration branch for a whole phase. | until phase merges |
| `v{p}.{s}` | `v{p}` | Work branch for one segment. | until segment merges |

Examples: `v2`, `v2.1`, `v2.6`. Delete segment branches after they merge into the
phase branch; delete the phase branch after it merges into `main`.

No `claude`, `anthropic`, or model-name tokens in branch names.

## Merge style

- **Segment → phase:** prefer `--no-ff` so each segment is a visible, revertible
  unit in the phase branch history.
- **Phase → main:** `--no-ff` merge, then `git tag v{p}.0.0`.

## Frozen history

- **v1.0.0** = everything that existed before this versioning system was adopted.
  It is the current `main` at the time phase 2 opened. Tag it on `main` if it
  isn't already, so the lineage is explicit.

## Quick reference

```
main ──●────────────────────────────●(tag v2.0.0)──▶
        \                          /
   v2    ●──────●──────●──────────●  (phase integration)
          \    / \    /
   v2.1    ●──●   \  /   segments branch off v2, merge back
   v2.2            ●●
```
