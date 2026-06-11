import { defineConfig, devices } from "@playwright/test";

// Visual-regression config for the docs site. Baselines are environment-sensitive
// (font rasterization differs across OSes), so they are generated and committed
// from the Linux CI runner — see .github/workflows/visual.yml — not from a dev
// machine. Locally: `npm run build && npm run test:visual:update` to refresh.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  expect: {
    // Allow a touch of sub-pixel AA noise; catch real layout/theme breakage.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled", caret: "hide" },
  },
  use: {
    baseURL: "http://localhost:4173/twico-ui/",
    viewport: { width: 1320, height: 900 },
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "vite preview --port 4173 --strictPort",
    url: "http://localhost:4173/twico-ui/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
