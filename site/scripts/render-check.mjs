#!/usr/bin/env node
/**
 * Headless render-check — the established behavioral gate for the docs site.
 * Drives every route with Playwright and fails (exit 1) on ANY uncaught page
 * error. This catches the class of bug a build can't: a component that throws
 * at runtime, a bad import, an SSR/client mismatch in a demo.
 *
 * Usage (a preview server must be serving the built site):
 *   npm run build
 *   npx vite preview --port 4173 --strictPort &
 *   node scripts/render-check.mjs            # uses http://localhost:4173/twico-ui/
 *   ORIGIN=http://localhost:5000/twico-ui/ node scripts/render-check.mjs
 */
import { chromium } from "playwright";

const ORIGIN = process.env.ORIGIN || "http://localhost:4173/twico-ui/";
const browser = await chromium.launch();

// Discover every component slug from the index, then sweep all routes.
const page0 = await browser.newPage({ viewport: { width: 1320, height: 1000 } });
await page0.goto(ORIGIN + "#/components", { waitUntil: "load", timeout: 30000 });
await page0.waitForTimeout(500);
const slugs = await page0.evaluate(() =>
  [...document.querySelectorAll('a[href*="#/components/"]')]
    .map((a) => a.getAttribute("href").split("#/components/")[1])
    .filter(Boolean)
);
await page0.close();

const routes = [
  "",
  "#/components",
  "#/docs/installation",
  "#/docs/theming",
  "#/docs/dark-mode",
  "#/docs/accessibility",
  "#/docs/hooks",
  ...new Set(slugs),
].map((s) => (s === "" || s.startsWith("#") ? s : "#/components/" + s));

let ok = 0;
const problems = [];
for (const r of routes) {
  const page = await browser.newPage({ viewport: { width: 1320, height: 1000 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  try {
    await page.goto(ORIGIN + r, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(350);
    if (errs.length) problems.push({ route: r, errs });
    else ok++;
  } catch (e) {
    problems.push({ route: r, errs: [String(e)] });
  }
  await page.close();
}
await browser.close();

console.log(`render-check: ${ok}/${routes.length} routes OK, ${problems.length} with errors`);
if (problems.length) {
  for (const p of problems) console.error(`  ✗ ${p.route}\n    ${p.errs.join("\n    ")}`);
  process.exit(1);
}
console.log("✓ all routes render with zero page errors");
