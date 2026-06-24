import { ImageResponse } from "next/og";
import { tokens } from "@/lib/theme";

// Programmatic social card. Rendered server-side to PNG, so it can't read the
// CSS theme vars — it imports the dark-palette token values from lib/theme.ts
// to stay in lockstep with the site's default dark look.
export const alt = "an9.dev — Andrew Nguyen's projects: transit, food, sports, politics, music";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const t = tokens.dark;

export default function OpengraphImage() {
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
    { ...size }
  );
}
