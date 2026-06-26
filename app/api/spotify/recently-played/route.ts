import { NextResponse } from "next/server";
import { getCreds, getAccessToken, clearToken } from "@/lib/spotify";

// Recently-played feed (v4.7.6). Same secret-handling posture as now-playing.
export const runtime = "edge";
export const dynamic = "force-dynamic";

const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=20";

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
    const token = await getAccessToken(creds);
    if (!token) return json({ configured: true, items: [] });

    const res = await fetch(RECENT_URL, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) clearToken();
    if (res.status !== 200) return json({ configured: true, items: [] });

    const data = (await res.json()) as { items?: { track?: Track }[] };
    const seen = new Set<string>();
    const items: Item[] = [];
    for (const entry of data.items ?? []) {
      const item = entry.track ? toItem(entry.track) : null;
      if (!item) continue;
      const key = `${item.title}—${item.artist}`;
      if (seen.has(key)) continue; // collapse repeats from looping the same track
      seen.add(key);
      items.push(item);
      if (items.length >= 6) break;
    }
    return json({ configured: true, items });
  } catch {
    return json({ configured: true, items: [] });
  }
}
