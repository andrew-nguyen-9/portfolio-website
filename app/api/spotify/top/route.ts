import { NextResponse } from "next/server";
import { getCreds, getAccessToken, clearToken } from "@/lib/spotify";

// Top artists + derived top genres (v4.7.6). Requires the `user-top-read` scope on
// the refresh token; if the current token lacks it Spotify returns 403 and we degrade
// to empty (the widget hides) until the token is re-minted. See docs/SPOTIFY.md.
export const runtime = "edge";
export const dynamic = "force-dynamic";

const TOP_URL = "https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term";

type Artist = { name?: string; genres?: string[]; images?: { url?: string }[] };

interface TopArtist {
  name: string;
  image: string | null;
}
interface Genre {
  name: string;
  count: number;
}

type Payload =
  | { configured: false }
  | { configured: true; artists: TopArtist[]; genres: Genre[] };

function json(payload: Payload) {
  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const creds = getCreds();
  if (!creds) return json({ configured: false });

  try {
    const token = await getAccessToken(creds);
    if (!token) return json({ configured: true, artists: [], genres: [] });

    const res = await fetch(TOP_URL, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) clearToken();
    // 403 = token minted without user-top-read; degrade quietly.
    if (res.status !== 200) return json({ configured: true, artists: [], genres: [] });

    const data = (await res.json()) as { items?: Artist[] };
    const items = data.items ?? [];

    const artists: TopArtist[] = items
      .filter((a) => a.name)
      .slice(0, 6)
      .map((a) => ({ name: a.name as string, image: a.images?.[a.images.length - 1]?.url ?? null }));

    // Tally genres across the top artists; surface the most common.
    const counts = new Map<string, number>();
    for (const a of items) {
      for (const g of a.genres ?? []) counts.set(g, (counts.get(g) ?? 0) + 1);
    }
    const genres: Genre[] = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return json({ configured: true, artists, genres });
  } catch {
    return json({ configured: true, artists: [], genres: [] });
  }
}
