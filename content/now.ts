// Source of truth for the /now page — a lightweight changelog of what Andrew is
// building. Newest entries first. `lead` is the single "right now" line at the top.
export const nowUpdated = "2026-06-25"; // ISO; shown as "last updated"

export const lead =
  "Turning an9.dev from a project index into a real home base — detail pages, a writing surface, and tying the project family together.";

export interface NowEntry {
  date: string; // ISO
  body: string;
}

export const now: NowEntry[] = [
  {
    date: "2026-06-25",
    body: "Started v4: stood up the writing surface (/writing) with a git-based MDX engine, RSS, and per-article structured data. This page and /uses came along for the ride.",
  },
  {
    date: "2026-06-10",
    body: "Closed out v3 — a live Spotify now-playing signal in the About section, handled entirely server-side so no token ever touches the browser.",
  },
];
