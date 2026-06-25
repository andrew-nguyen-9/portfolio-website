import { ImageResponse } from "next/og";
import { tokens } from "@/lib/theme";

// Programmatic 1200×630 social card, served as a plain route (GET /og) rather than
// via the opengraph-image file convention — that convention also auto-injects a
// duplicate og:image <meta>. The single og:image/twitter:image tags live in
// app/layout.tsx and point here. Rendered server-side to PNG, so it can't read the
// CSS theme vars — it pulls the dark-palette values from lib/theme.ts to match the
// site's default dark look.
const t = tokens.dark;
const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: t.bg,
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: t.primary,
            fontFamily: "monospace",
          }}
        >
          an9.dev
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 130,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: t.fg,
            }}
          >
            Andrew Nguyen
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 40,
              lineHeight: 1.25,
              color: t.fgMuted,
              maxWidth: 900,
            }}
          >
            Small tools for the questions I keep asking — transit, food, sports,
            politics, and the city I love.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 10,
            width: 220,
            background: t.primary,
            borderRadius: 9999,
          }}
        />
      </div>
    ),
    {
      ...size,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" },
    }
  );
}
