#!/usr/bin/env node
// One-time helper: mint a Spotify refresh token for the now-playing widget (v3.1).
// Authorization-Code flow, confidential client. Catches the OAuth callback locally
// so the short-lived `code` is never copy-pasted (its #1 failure: code expiry).
//
// Usage (from repo root):
//   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-refresh-token.mjs
//
// Prereq: in the Spotify app settings, add EXACTLY this Redirect URI:
//   http://127.0.0.1:8888/callback
// (Spotify requires a loopback IP, not "localhost".)

import http from "node:http";
import { execFile } from "node:child_process";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = "user-read-currently-playing user-read-recently-played";

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Missing SPOTIFY_CLIENT_ID and/or SPOTIFY_CLIENT_SECRET in env.");
  console.error("Run: SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-refresh-token.mjs");
  process.exit(1);
}

const state = Math.random().toString(36).slice(2);
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: id,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
    show_dialog: "true", // force consent screen; dodges silent re-consent server_error
  })
    .toString()
    .replace(/\+/g, "%20"); // encode scope spaces as %20, not "+" (some OAuth backends reject +)

async function exchange(code) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token exchange failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const err = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  if (err || url.searchParams.get("state") !== state || !code) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Auth failed: ${err || "missing/invalid code or state"}. Check this terminal.`);
    console.error(`\n✗ Authorization failed: ${err || "state mismatch / no code"}`);
    server.close();
    process.exit(1);
  }
  try {
    const tokens = await exchange(code);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Done — copy the refresh token from your terminal. You can close this tab.");
    console.log("\n✓ Success. Set these in Vercel (Production + Preview):\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`\n(scopes granted: ${tokens.scope})`);
    server.close();
    process.exit(0);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(String(e.message));
    console.error(`\n✗ ${e.message}`);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Redirect URI (add this EXACTLY in the Spotify app settings):\n  ${REDIRECT_URI}\n`);
  console.log("Opening browser to authorize. If it doesn't open, paste this URL:\n");
  console.log(authUrl + "\n");
  execFile("open", [authUrl], () => {}); // macOS; ignore error elsewhere
});
