import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' needed for Next.js inline scripts
      // 'unsafe-eval' required by hCaptcha's api.js internals (unavoidable with hCaptcha)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hcaptcha.com https://newassets.hcaptcha.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      // hCaptcha needs to POST to its API and load assets; Resend for contact form
      "connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://api.resend.com",
      // hCaptcha renders its challenge inside an iframe from newassets.hcaptcha.com
      "frame-src https://newassets.hcaptcha.com",
      "frame-ancestors 'none'",
      // lock down the remaining fetch directives for a clean security-headers scan
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  // Skip loader after first visit cookie is handled client-side
};

export default nextConfig;
