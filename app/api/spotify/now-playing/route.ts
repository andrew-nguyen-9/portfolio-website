import { NextResponse } from "next/server";

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

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

const EMPTY = { isPlaying: false, title: null, artist: null, albumImageUrl: null, songUrl: null };

// In-memory access-token cache. Module scope persists across requests on a warm
// instance; a cold start just refreshes again — cheap and within rate limits.
// ponytail: module-global cache, fine for a single account; revisit if multi-tenant.
let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(id: string, secret: string, refresh: string): Promise<string | null> {
  if (cached && cached.expiresAt > Date.now() + 5_000) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${id}:${secret}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;

  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1_000 };
  return data.access_token;
}

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
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;

  // Graceful unconfigured state (local dev / pre-deploy) — mirrors the contact
  // route's missing-key guard. The widget hides itself on `configured: false`.
  if (!id || !secret || !refresh) return json({ configured: false });

  try {
    const token = await getAccessToken(id, secret, refresh);
    if (!token) return json({ configured: true, ...EMPTY });

    const now = await fetch(NOW_PLAYING_URL, { headers: { Authorization: `Bearer ${token}` } });

    // 200 with an actively-playing track → live state.
    if (now.status === 200) {
      const data = (await now.json()) as { is_playing?: boolean; item?: Track };
      if (data.item) return json(toPayload(data.item, data.is_playing ?? false));
    }

    // 204 (nothing playing) or a paused/ad gap → fall back to most-recent track.
    const recent = await fetch(RECENT_URL, { headers: { Authorization: `Bearer ${token}` } });
    if (recent.status === 200) {
      const data = (await recent.json()) as { items?: { track?: Track }[] };
      return json(toPayload(data.items?.[0]?.track, false));
    }

    return json({ configured: true, ...EMPTY });
  } catch {
    // Silent degrade — the widget treats an empty payload as "nothing to show".
    return json({ configured: true, ...EMPTY });
  }
}
