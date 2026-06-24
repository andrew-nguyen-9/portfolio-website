import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  const logoData = readFileSync(join(process.cwd(), "public/an-logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#222B28",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Rendered by satori (next/og), not the browser DOM; alt is decorative. */}
        <img src={logoSrc} width={50} height={50} alt="" />
      </div>
    ),
    { ...size }
  );
}
