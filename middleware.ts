import { NextRequest, NextResponse } from "next/server";

// Strict, nonce-based Content-Security-Policy.
//
// Every request gets a fresh nonce. CSP3 browsers honor `'nonce-…'` +
// `'strict-dynamic'` and ignore the `'unsafe-inline'` / host-allowlist fallbacks,
// so only our nonce'd scripts (and what they load) run — no blanket inline-script
// execution. The fallbacks keep pre-CSP3 browsers working.
//
// `'unsafe-eval'` stays: hCaptcha's api.js requires it and there is no way around
// that while we use hCaptcha. The hCaptcha hosts are listed for CSP2 browsers;
// under `'strict-dynamic'` they're reached via the nonce'd next/script loader.
//
// Note: reading the nonce in app/layout.tsx (via headers()) makes the page
// dynamically rendered — the inherent cost of a nonce-based CSP in Next.js.
export function middleware(request: NextRequest) {
  // Base64 nonce from Web Crypto — no Node Buffer (middleware runs on the Edge runtime).
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' https://js.hcaptcha.com https://newassets.hcaptcha.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://api.resend.com",
    "frame-src https://newassets.hcaptcha.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  // Forward the nonce + CSP on the request so Next applies the nonce to its own
  // scripts and so the layout can read it for our inline scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Run on documents only — skip static assets and the image/metadata routes,
    // which carry no inline scripts and stay statically cached.
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|icon|og|robots.txt|sitemap.xml).*)",
    },
  ],
};
