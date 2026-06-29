import { NextResponse } from "next/server";
import { getCreds, spotifyFetch } from "@/lib/spotify";

// Monthly top tracks (v5.2). `time_range=short_term` ≈ the last 4 weeks = "most played
// this month". Requires the `user-top-read` scope on the refresh token; if the token
// lacks it Spotify returns 403 and we degrade to empty (the song list hides) until the
// token is re-minted. See docs/SPOTIFY.md.
export const runtime = "edge";
export const dynamic = "force-dynamic";

const TOP_TRACKS_URL =
  "https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term";

type Track = {
  name?: string;
  artists?: { name?: string }[];
  album?: { images?: { url?: string }[] };
  external_urls?: { spotify?: string };
};

interface Item {
  title: string;
  artist: string | null;
  albumImageUrl: string | null;
  songUrl: string | null;
}

type Payload = { configured: false } | { configured: true; items: Item[] };

function toItem(t: Track): Item | null {
  if (!t.name) return null;
  return {
    title: t.name,
    artist: t.artists?.map((a) => a.name).filter(Boolean).join(", ") || null,
    albumImageUrl: t.album?.images?.[t.album.images.length - 1]?.url ?? null,
    songUrl: t.external_urls?.spotify ?? null,
  };
}

function json(payload: Payload) {
  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const creds = getCreds();
  if (!creds) return json({ configured: false });

  try {
    const res = await spotifyFetch(TOP_TRACKS_URL, creds);
    // 403 = token minted without user-top-read; degrade quietly.
    if (!res || res.status !== 200) return json({ configured: true, items: [] });

    const data = (await res.json()) as { items?: Track[] };
    const items: Item[] = [];
    for (const t of data.items ?? []) {
      const item = toItem(t);
      if (item) items.push(item);
      if (items.length >= 6) break;
    }
    return json({ configured: true, items });
  } catch {
    return json({ configured: true, items: [] });
  }
}
