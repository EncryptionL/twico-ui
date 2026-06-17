// Full-library interaction sweep (deeper than render-check): visits every component
// route, exercises its interactive elements — clicks up to 18 triggers (opening/closing
// overlays via Escape), focuses up to 10 inputs and drives them with the keyboard — and
// asserts zero pageerrors / console errors throughout. Run against a built preview:
//   cd site && npm run build && npm run preview -- --port 4173 &
//   node scripts/interaction-sweep.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4173/twico-ui/#/";
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 1000 } });

await page.goto(BASE + "components", { waitUntil: "load" });
await page.waitForTimeout(800);
const slugs = await page.evaluate(() =>
  [...document.querySelectorAll('a[href*="#/components/"]')]
    .map((a) => a.getAttribute("href").split("#/components/")[1])
    .filter((s) => s && !s.includes("?")));
const uniq = [...new Set(slugs)];

const problems = [];
let interactions = 0;
for (const slug of uniq) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
  p.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 140)); });
  try {
    await p.goto(BASE + "components/" + slug, { waitUntil: "load" });
    await p.waitForTimeout(500);
    // interactive targets in the MAIN content (exclude navbar / sidebar / TOC nav)
    const targets = await p.evaluate(() => {
      const inMain = (el) => !el.closest("nav") && !el.closest('[class*="navbar"]') && !el.closest('[class*="sidebar"]') && !el.closest("header");
      const btns = [...document.querySelectorAll('button, [role="button"], [role="tab"], [role="switch"], summary')].filter(inMain);
      const inputs = [...document.querySelectorAll('input, textarea, [role="slider"]')].filter(inMain);
      btns.forEach((el, i) => el.setAttribute("data-sweep-btn", i));
      inputs.forEach((el, i) => el.setAttribute("data-sweep-inp", i));
      return { btns: btns.length, inputs: inputs.length };
    });
    for (let i = 0; i < Math.min(targets.btns, 18); i++) {
      const el = await p.$(`[data-sweep-btn="${i}"]`);
      if (!el) continue;
      try { await el.click({ timeout: 800 }); interactions++; await p.waitForTimeout(70); await p.keyboard.press("Escape"); await p.waitForTimeout(40); } catch {}
    }
    for (let i = 0; i < Math.min(targets.inputs, 10); i++) {
      const el = await p.$(`[data-sweep-inp="${i}"]`);
      if (!el) continue;
      try { await el.focus({ timeout: 500 }); await p.keyboard.type("1"); await p.keyboard.press("ArrowDown"); await p.keyboard.press("Tab"); interactions++; } catch {}
    }
    await p.waitForTimeout(120);
  } catch (e) { errs.push("nav: " + String(e).slice(0, 120)); }
  if (errs.length) problems.push({ slug, errs: [...new Set(errs)].slice(0, 4) });
  await p.close();
}
await b.close();

console.log(`Swept ${uniq.length} component routes, ~${interactions} interactions.`);
if (problems.length === 0) { console.log("✓ ZERO errors across all component interactions"); process.exit(0); }
console.log(`✗ ${problems.length} routes with errors:`);
for (const pr of problems) console.log(`  ${pr.slug}: ${pr.errs.join(" | ")}`);
process.exit(1);
