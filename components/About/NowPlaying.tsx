"use client";

import { useState, useEffect } from "react";

/* ─── Now Playing ───────────────────────────────────────────
   Live Spotify signal in the About section's music throughline. Polls the
   same-origin proxy (app/api/spotify/now-playing) — secrets never reach the
   client. Hides itself entirely when unconfigured, empty, or erroring, so the
   layout never shows a broken or placeholder widget (mirrors the v2 contact
   fallback). The live pulse is a CSS animation, auto-disabled under
   reduced-motion by globals.css. */

type NowPlaying =
  | { configured: false }
  | {
      configured: true;
      isPlaying: boolean;
      title: string | null;
      artist: string | null;
      albumImageUrl: string | null;
      songUrl: string | null;
    };

const POLL_MS = 45_000;

export default function NowPlaying() {
  const [data, setData] = useState<NowPlaying | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing", { signal: ctrl.signal });
        if (!res.ok) return;
        const next = (await res.json()) as NowPlaying;
        if (!cancelled) setData(next);
      } catch {
        // Silent degrade — keep the last good state, never surface an error.
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      ctrl.abort();
      clearInterval(id);
    };
  }, []);

  // Hide while loading, unconfigured, or when there's no track to show.
  if (!data || !data.configured || !data.title) return null;

  const { isPlaying, title, artist, albumImageUrl, songUrl } = data;

  const card = (
    <div
      className="np-card inline-flex max-w-full items-center gap-3 rounded-xl p-3 pr-4 transition-all"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {albumImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote Spotify art; CSP img-src allows https:, avoids next.config remotePatterns
        <img
          src={albumImageUrl}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          className="rounded-md shrink-0"
          style={{ width: 48, height: 48, objectFit: "cover" }}
        />
      ) : null}
      <span className="flex flex-col gap-1 min-w-0">
        <span
          className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.18em] uppercase eyebrow"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {isPlaying && <span className="np-dot" aria-hidden="true" />}
          {isPlaying ? "Now playing" : "Last played"}
        </span>
        <span
          className="text-sm font-semibold tracking-tight truncate"
          style={{ fontFamily: "var(--font-display), sans-serif", color: "var(--fg)" }}
        >
          {title}
        </span>
        {artist && (
          <span
            className="text-xs truncate"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace", color: "var(--fg-muted)" }}
          >
            {artist}
          </span>
        )}
      </span>
    </div>
  );

  return (
    <div aria-live="polite">
      {songUrl ? (
        <a
          href={songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="np-link inline-block rounded-xl"
          aria-label={`${isPlaying ? "Now playing" : "Last played"} on Spotify: ${title}${artist ? ` by ${artist}` : ""}`}
        >
          {card}
        </a>
      ) : (
        card
      )}
    </div>
  );
}
