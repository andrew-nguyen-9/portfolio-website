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
