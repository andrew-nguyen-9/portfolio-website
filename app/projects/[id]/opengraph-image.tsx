import { ImageResponse } from "next/og";
import { tokens } from "@/lib/theme";
import { projects } from "@/content/projects";

// Per-project 1200×630 card. Uses the file-convention (auto-wires og:image for this
// route), unlike the homepage's standalone /og route. Pulls dark-palette tokens since
// a server-rendered PNG can't read CSS vars.
export const alt = "an9.dev project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const t = tokens.dark;
const STATUS_LABEL = { live: "Live", building: "Building", planned: "Planned" } as const;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = projects.find((proj) => proj.id === id);
  const name = p?.name ?? "an9.dev";
  const tagline = p?.tagline ?? "A family of data-driven passion projects.";
  const meta = p ? `${STATUS_LABEL[p.status]} · ${p.category} · ${p.year}` : "an9.dev";

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
          {meta}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: t.fg,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 38,
              lineHeight: 1.25,
              color: t.fgMuted,
              maxWidth: 960,
            }}
          >
            {tagline}
          </div>
        </div>

        <div style={{ display: "flex", height: 10, width: 220, background: t.primary, borderRadius: 9999 }} />
      </div>
    ),
    size
  );
}
