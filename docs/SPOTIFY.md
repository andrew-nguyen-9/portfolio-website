# Spotify "now playing" — setup

The About section shows Andrew's real-time Spotify listening (v3, "Live Personal
Signal"). It's a **single-user** integration: one account (Andrew's), public to all
visitors. The browser only calls our own `/api/spotify/now-playing`; the refresh
token and client secret never reach the client.

## What you need

Three server-side env vars (see [`.env.local.example`](../.env.local.example)):

| Var | Source |
|-----|--------|
| `SPOTIFY_CLIENT_ID` | Spotify app → Settings |
| `SPOTIFY_CLIENT_SECRET` | Spotify app → Settings (reset to reveal) |
| `SPOTIFY_REFRESH_TOKEN` | Minted once via the flow below |

> **Premium required.** As of Spotify's 2026 developer-access policy, Development
> Mode apps require the authorizing account to be **Spotify Premium**. A Free
> account fails authorization with `error=server_error` even when everything else
> is configured correctly.

## One-time setup

1. **Create the app** — [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard).
   - Enable **Web API**.
   - Add Redirect URI **exactly**: `http://127.0.0.1:8888/callback`
     (loopback IP — `localhost` is rejected post-Nov-2025).
   - Add your account under **User Management** (name + the email on your Spotify
     account) while the app is in Development Mode.
2. **Mint the refresh token** with the helper (catches the OAuth callback locally,
   so the short-lived `code` never expires on you):
   ```bash
   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-refresh-token.mjs
   ```
   It opens the consent screen, then prints `SPOTIFY_REFRESH_TOKEN=…`. If you hit
   `server_error`, authorize in a fresh **incognito** window logged into the
   Premium account.
3. **Set all three vars** in `.env.local` (local) and in Vercel → Project →
   Settings → Environment Variables (Production + Preview).

The refresh token does not expire; the route swaps it for short-lived access
tokens on demand and caches them in-memory.

## Scopes

`user-read-currently-playing` + `user-read-recently-played` + `user-top-read`. If you
change scopes, re-mint the token — old tokens keep their original grant.

> **v4.7.6 note:** the top-artists / genres panel needs **`user-top-read`**. Until the
> refresh token is re-minted with that scope, `/api/spotify/top` returns 403 and the
> genres panel hides itself (recently-played still works on the older scopes).

## Behavior

- **Currently playing** → live track (title, artist, album art, link).
- **Nothing playing** → most-recently-played track.
- **Unconfigured / upstream error** → the route returns a quiet empty payload and
  the widget hides itself. No console errors, no broken UI.

## Notes

- No CSP change was needed: `middleware.ts` already allows `img-src … https:`
  (covers Spotify's `i.scdn.co` art) and the widget fetches same-origin
  (`connect-src 'self'`).
- The route is `runtime = "edge"`, `dynamic = "force-dynamic"`, `Cache-Control:
  no-store` — always fresh, never CDN-cached.
