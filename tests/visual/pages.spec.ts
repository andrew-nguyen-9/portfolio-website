import { test, expect } from "@playwright/test";

// Stable content routes (the homepage is intentionally excluded — its live Spotify
// data + hero animation make pixel diffs flaky). reducedMotion neutralizes the loader
// and reveal animations so baselines are deterministic.
const PAGES = [
  "/writing",
  "/writing/spotify-now-playing-strict-csp",
  "/projects/music-festival-analyzer",
  "/uses",
  "/now",
];

for (const scheme of ["light", "dark"] as const) {
  for (const route of PAGES) {
    test(`${scheme} ${route}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page).toHaveScreenshot({ fullPage: true, animations: "disabled" });
    });
  }
}
