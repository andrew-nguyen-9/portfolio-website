#!/usr/bin/env node
// Token-drift guard (v4.6.2). lib/theme.ts is a hand-kept mirror of the CSS custom
// properties in app/globals.css. This fails CI if any palette value diverges, so the
// two can't silently drift apart. Compares only the keys theme.ts declares; extra CSS
// vars (--radius, --font-display, …) are ignored.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const themeSrc = fs.readFileSync(path.join(root, "lib/theme.ts"), "utf8");
const cssSrc = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");

const KEY_TO_VAR = {
  bg: "--bg",
  surface: "--surface",
  primary: "--primary",
  secondary: "--secondary",
  highlight: "--highlight",
  fg: "--fg",
  fgMuted: "--fg-muted",
  fgSubtle: "--fg-subtle",
  border: "--border",
  borderStrong: "--border-strong",
  cardBorder: "--card-border",
};

// theme.ts palette name → the CSS selector that defines the same palette.
const PALETTE_TO_SELECTOR = {
  light: ":root",
  dark: ".dark",
  lightHighContrast: ".high-contrast",
  darkHighContrast: ".dark.high-contrast",
};

const norm = (v) => v.trim().replace(/\s+/g, " ").toLowerCase();

// Pull a `name: { ... }` object body out of theme.ts and read its "key: value" pairs.
function parseThemePalette(name) {
  const m = themeSrc.match(new RegExp(`${name}:\\s*\\{([\\s\\S]*?)\\}`));
  if (!m) return null;
  const out = {};
  for (const km of m[1].matchAll(/(\w+):\s*"([^"]*)"/g)) out[km[1]] = km[2];
  return out;
}

// Read --custom-props from the CSS block whose selector line is exactly `selector {`.
function parseCssBlock(selector) {
  const lines = cssSrc.split("\n");
  const start = lines.findIndex((l) => l.trim() === `${selector} {`);
  if (start === -1) return null;
  const out = {};
  for (let i = start + 1; i < lines.length && !lines[i].includes("}"); i++) {
    const m = lines[i].match(/(--[\w-]+):\s*([^;]+);/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

let errors = 0;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  errors++;
};

for (const [palette, selector] of Object.entries(PALETTE_TO_SELECTOR)) {
  const theme = parseThemePalette(palette);
  const css = parseCssBlock(selector);
  if (!theme) { fail(`theme.ts: palette "${palette}" not found`); continue; }
  if (!css)   { fail(`globals.css: selector "${selector}" not found`); continue; }

  for (const [key, cssVar] of Object.entries(KEY_TO_VAR)) {
    const tv = theme[key];
    const cv = css[cssVar];
    if (tv === undefined) { fail(`theme.ts ${palette}.${key} missing`); continue; }
    if (cv === undefined) { fail(`globals.css ${selector} ${cssVar} missing`); continue; }
    if (norm(tv) !== norm(cv)) {
      fail(`drift ${palette}.${key} (${cssVar}): theme.ts "${tv}" ≠ globals.css "${cv}"`);
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} token drift error(s) — sync lib/theme.ts with app/globals.css.`);
  process.exit(1);
}
console.log("✓ tokens in sync");
