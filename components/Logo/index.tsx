interface ANLogoProps {
  size?: number;
  className?: string;
}

export function ANLogo({ size = 44, className }: ANLogoProps) {
  const pad = Math.round(size * 0.12);
  const total = size + pad * 2;
  return (
    <span
      className={["an-logo-disc", className].filter(Boolean).join(" ")}
      style={{ width: total, height: total }}
    >
      {/* Raw <img>, not next/image: the logo relies on the .an-logo CSS
          (grayscale→invert→brightness + mix-blend-mode: screen) and inline
          width/height that transition on scroll — next/image would fight both. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/an-logo.png"
        alt="AN"
        width={size}
        height={size}
        draggable={false}
        className="an-logo"
      />
    </span>
  );
}
