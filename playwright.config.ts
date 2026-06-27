import { defineConfig, devices } from "@playwright/test";

// Visual-regression config (v4.6.3). Screenshots key pages across themes and diffs
// against committed baselines. Runs against a production build (matches what ships;
// next dev renders differently). Seed/refresh baselines with:
//   npm run test:visual -- --update-snapshots
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://localhost:3000" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
});
