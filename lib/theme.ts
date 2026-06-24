// Reference mirror of the CSS custom-property tokens in app/globals.css.
// Components MUST consume the CSS tokens (var(--bg), …), never these values.
// This file exists only so the palette is greppable/typed in one place; keep it
// in lockstep with globals.css whenever a token changes.
//
// v2 direction: dark mode IS the bold high-contrast look (near-black + vivid
// accents); light mode is serious/editorial (ink-on-paper); the A11y
// high-contrast option pushes each further (pure #000/#fff, max saturation).

export const tokens = {
  // Light — serious / editorial (rebuilt in v2.1.3)
  light: {
    bg:            "#F8F4EB",
    surface:       "#EDE5D3",
    primary:       "#2D6A4F",
    secondary:     "#C8491C",
    highlight:     "#3F9E7C",
    fg:            "#16201A",
    fgMuted:       "#3F5C4E",
    fgSubtle:      "#6F9685",
    border:        "rgba(22, 32, 26, 0.10)",
    borderStrong:  "rgba(22, 32, 26, 0.18)",
    cardBorder:    "#C7C3B3",
  },
  // Dark — bold high-contrast default (v2.1.1)
  dark: {
    bg:            "#0B0F0D",
    surface:       "#141A17",
    primary:       "#5BE3A7",
    secondary:     "#FF8A47",
    highlight:     "#FFC94D",
    fg:            "#F2F5F1",
    fgMuted:       "#B7C5BD",
    fgSubtle:      "#7C9085",
    border:        "rgba(242, 245, 241, 0.12)",
    borderStrong:  "rgba(242, 245, 241, 0.24)",
    cardBorder:    "#2A332E",
  },
  // A11y high-contrast over light (pushed further in v2.1.2)
  lightHighContrast: {
    bg:            "#fff",
    surface:       "#f2f2f2",
    primary:       "#0a5c3a",
    secondary:     "#b23800",
    highlight:     "#005f99",
    fg:            "#000",
    fgMuted:       "#1a1a1a",
    fgSubtle:      "#333",
    border:        "rgba(0,0,0,0.30)",
    borderStrong:  "rgba(0,0,0,0.55)",
    cardBorder:    "#000",
  },
  // A11y high-contrast over dark (pushed further in v2.1.2)
  darkHighContrast: {
    bg:            "#000",
    surface:       "#111",
    primary:       "#fff",
    secondary:     "#fc0",
    highlight:     "#0cf",
    fg:            "#fff",
    fgMuted:       "#ccc",
    fgSubtle:      "#999",
    border:        "rgba(255,255,255,0.30)",
    borderStrong:  "rgba(255,255,255,0.55)",
    cardBorder:    "#fff",
  },
} as const;

export type Tokens = typeof tokens;
export type Palette = Tokens[keyof Tokens];
