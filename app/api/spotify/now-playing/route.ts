import { NextResponse } from "next/server";
import { getCreds, getAccessToken, clearToken } from "@/lib/spotify";

// Single-user Spotify "now playing" proxy. The browser only ever hits this
// same-origin route (connect-src 'self'); the refresh token and client secret
// never leave the server. See docs/SPOTIFY.md for the one-time token setup.
export const runtime = "edge";
export const dynamic = "force-dynamic"; // live data — never statically cached

type Payload =
  | { configured: false }
  | {
      configured: true;
      isPlaying: boolean;
      title: string | null;
      artist: string | null;
      albumImageUrl: string | null;
      songUrl: string | null;
    };

// Spotify's track shape, narrowed to what we render.
type Track = {
  name?: string;
  artists?: { name?: string }[];
  album?: { images?: { url?: string }[] };
  external_urls?: { spotify?: string };
};

const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

const EMPTY = { isPlaying: false, title: null, artist: null, albumImageUrl: null, songUrl: null };

function toPayload(track: Track | undefined, isPlaying: boolean): Payload {
  if (!track?.name) return { configured: true, ...EMPTY };
  return {
    configured: true,
    isPlaying,
    title: track.name,
    artist: track.artists?.map((a) => a.name).filter(Boolean).join(", ") || null,
    albumImageUrl: track.album?.images?.[0]?.url ?? null,
    songUrl: track.external_urls?.spotify ?? null,
  };
}

function json(payload: Payload) {
  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  // Graceful unconfigured state (local dev / pre-deploy) — mirrors the contact
  // route's missing-key guard. The widget hides itself on `configured: false`.
  const creds = getCreds();
  if (!creds) return json({ configured: false });

  try {
    const token = await getAccessToken(creds);
    if (!token) return json({ configured: true, ...EMPTY });

    const now = await fetch(NOW_PLAYING_URL, { headers: { Authorization: `Bearer ${token}` } });

    // 200 with an actively-playing track → live state.
    if (now.status === 200) {
      const data = (await now.json()) as { is_playing?: boolean; item?: Track };
      if (data.item) return json(toPayload(data.item, data.is_playing ?? false));
    }

    // 401 → cached token rejected mid-life (revoked / expired early). Drop it so
    // the next poll mints a fresh one instead of looping on a dead token until
    // the instance cold-starts. 429 → rate-limited; back off rather than firing a
    // second doomed call. Either way, nothing to render this tick.
    if (now.status === 401) clearToken();
    if (now.status === 401 || now.status === 429) return json({ configured: true, ...EMPTY });

    // 204 (nothing playing) or a 200 paused/ad gap → most-recent track.
    if (now.status === 200 || now.status === 204) {
      const recent = await fetch(RECENT_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (recent.status === 401) clearToken();
      if (recent.status === 200) {
        const data = (await recent.json()) as { items?: { track?: Track }[] };
        return json(toPayload(data.items?.[0]?.track, false));
      }
    }

    return json({ configured: true, ...EMPTY });
  } catch {
    // Silent degrade — the widget treats an empty payload as "nothing to show".
    return json({ configured: true, ...EMPTY });
  }
}
