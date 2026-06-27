"use client";

import { useEffect, useState } from "react";

/* ─── Spotify expansions (v4.7.6) ───────────────────────────
   Recently-played feed + top-genre chips, below the NowPlaying widget. Both fetch
   the same-origin proxies (secrets stay server-side) and hide gracefully: if nothing
   comes back (unconfigured, or the token lacks user-top-read), the whole panel
   renders nothing — never a broken or empty shell. */

interface RecentItem {
  title: string;
  artist: string | null;
  albumImageUrl: string | null;
  songUrl: string | null;
}
interface Genre {
  name: string;
  count: number;
}

type Recent = { configured: false } | { configured: true; items: RecentItem[] };
type Top =
  | { configured: false }
  | { configured: true; artists: unknown[]; genres: Genre[] };

export default function SpotifyPanel() {
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const [r, t] = await Promise.all([
          fetch("/api/spotify/recently-played", { signal: ctrl.signal })
            .then((x) => x.json() as Promise<Recent>)
            .catch(() => null),
          fetch("/api/spotify/top", { signal: ctrl.signal })
            .then((x) => x.json() as Promise<Top>)
            .catch(() => null),
        ]);
        if (r && r.configured) setRecent(r.items);
        if (t && t.configured) setGenres(t.genres);
      } catch {
        // Silent degrade — leave both empty so the panel stays hidden.
      }
    })();
    return () => ctrl.abort();
  }, []);

  if (recent.length === 0 && genres.length === 0) return null;

  const maxCount = genres.reduce((m, g) => Math.max(m, g.count), 1);

  return (
    <div className="spotify-panel">
      {genres.length > 0 && (
        <div>
          <p
            className="text-[0.62rem] tracking-[0.18em] uppercase mb-2.5 eyebrow"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            Genres in rotation
          </p>
          <div className="genre-cloud">
            {genres.map((g) => (
              <span
                key={g.name}
                className="genre-chip"
                style={{ fontSize: `${0.62 + (g.count / maxCount) * 0.32}rem` }}
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className={genres.length > 0 ? "mt-5" : ""}>
          <p
            className="text-[0.62rem] tracking-[0.18em] uppercase mb-2.5 eyebrow"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            On repeat lately
          </p>
          <ul className="recent-list">
            {recent.map((item, i) => {
              const row = (
                <>
                  {item.albumImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote Spotify art; CSP img-src allows https:
                    <img
                      src={item.albumImageUrl}
                      alt=""
                      width={32}
                      height={32}
                      loading="lazy"
                      className="recent-art"
                    />
                  ) : (
                    <span className="recent-art recent-art-empty" aria-hidden="true" />
                  )}
                  <span className="recent-text">
                    <span className="recent-title">{item.title}</span>
                    {item.artist && <span className="recent-artist">{item.artist}</span>}
                  </span>
                </>
              );
              return (
                <li key={`${item.title}-${i}`} className="recent-row">
                  {item.songUrl ? (
                    <a href={item.songUrl} target="_blank" rel="noopener noreferrer" className="recent-link">
                      {row}
                    </a>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
