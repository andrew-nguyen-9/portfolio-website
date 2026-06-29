// Shared Spotify token handling for the now-playing / recently-played / top routes
// (v4.7.6). Edge-safe (fetch, btoa, URLSearchParams — no Node APIs). Secrets stay
// server-side; routes only ever expose narrowed, non-sensitive JSON.

const TOKEN_URL = "https://accounts.spotify.com/api/token";

export interface SpotifyCreds {
  id: string;
  secret: string;
  refresh: string;
}

// Returns null when unconfigured (local dev / pre-deploy) so routes can degrade
// gracefully instead of throwing — same posture as the contact route.
export function getCreds(): SpotifyCreds | null {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;
  return { id, secret, refresh };
}

// In-memory access-token cache. Module scope persists across requests on a warm
// instance; a cold start just refreshes again — cheap and within rate limits.
// ponytail: module-global cache, fine for a single account; revisit if multi-tenant.
let cached: { token: string; expiresAt: number } | null = null;

export function clearToken() {
  cached = null;
}

export async function getAccessToken(c: SpotifyCreds): Promise<string | null> {
  if (cached && cached.expiresAt > Date.now() + 5_000) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${c.id}:${c.secret}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: c.refresh }),
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;

  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1_000 };
  return data.access_token;
}

// Single entry point for Web API GETs. Hardens against the most common flake — an
// access token that expired between cache check and request: a 401 clears the cache
// and retries once with a freshly minted token. Returns null when unconfigured or the
// token can't be obtained; callers degrade to an empty/hidden widget. A 403 (scope
// missing, e.g. user-top-read) is returned as-is for the caller to handle.
export async function spotifyFetch(url: string, c: SpotifyCreds): Promise<Response | null> {
  let token = await getAccessToken(c);
  if (!token) return null;

  let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) {
    clearToken();
    token = await getAccessToken(c);
    if (!token) return null;
    res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  }
  return res;
}
