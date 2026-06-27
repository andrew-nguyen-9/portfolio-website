import { ImageResponse } from "next/og";
import { tokens } from "@/lib/theme";
import { getArticle } from "@/lib/writing";

// Per-article 1200×630 card (file convention auto-wires og:image for the route).
// Dark-palette tokens since a server-rendered PNG can't read CSS vars.
export const alt = "an9.dev writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const t = tokens.dark;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? "Writing";
  const summary = article?.summary ?? "Notes on building data-driven passion projects.";

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
            fontSize: 28,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: t.primary,
            fontFamily: "monospace",
          }}
        >
          an9.dev · writing
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: t.fg,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 34,
              lineHeight: 1.3,
              color: t.fgMuted,
              maxWidth: 980,
            }}
          >
            {summary}
          </div>
        </div>

        <div style={{ display: "flex", height: 10, width: 220, background: t.primary, borderRadius: 9999 }} />
      </div>
    ),
    size
  );
}
