import { test, expect } from "@playwright/test";

// Visual-regression smoke over the highest-traffic pages, in both themes.
// Pixel diffs catch spacing / token / layout regressions the render-check
// (which only catches thrown errors) cannot.

const PAGES: Array<{ name: string; hash: string }> = [
  { name: "home", hash: "" },
  { name: "components-index", hash: "#/components" },
  { name: "installation", hash: "#/docs/installation" },
  { name: "button", hash: "#/components/button" },
  { name: "select", hash: "#/components/select" },
  { name: "card", hash: "#/components/card" },
  { name: "datatable", hash: "#/components/datatable" },
];

for (const theme of ["light", "dark"] as const) {
  for (const p of PAGES) {
    test(`${p.name} — ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("twico-theme", t);
        } catch {}
      }, theme);
      await page.goto("./" + p.hash, { waitUntil: "load" });
      // Determinism: wait for the network to settle and the self-hosted webfonts to
      // finish loading before capturing — otherwise a late font swap re-rasterizes
      // all text (worst on the text-dense Datatable) and trips the pixel threshold.
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      await expect(page).toHaveScreenshot(`${p.name}-${theme}.png`, { fullPage: true });
    });
  }
}
