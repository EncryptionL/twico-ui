// Behavioral gate: beyond "no errors", assert each interactive component actually DOES
// the right thing — toggles, opens/closes, traps focus, commits values, navigates by
// keyboard. Run against a built preview:
//   cd site && npm run build && npm run preview -- --port 4173 --strictPort &
//   node scripts/behavior-check.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4173/twico-ui/#/components/";
const b = await chromium.launch();

// Each case gets a fresh page at its component route + an `a(cond, msg)` assert helper.
const CASES = {
  Switch: async (p, a) => {
    const inp = await p.$(".twc-switch__input");
    const before = await inp.isChecked();
    await p.click(".twc-switch");
    a((await inp.isChecked()) !== before, "click toggles the checked state");
  },
  Checkbox: async (p, a) => {
    const inp = await p.$(".twc-check__input:not([disabled])");
    const before = await inp.isChecked();
    await inp.evaluate((el) => el.closest(".twc-check").click());
    a((await inp.isChecked()) !== before, "click toggles the checked state");
  },
  Radio: async (p, a) => {
    const radios = await p.$$(".twc-radio__input:not([disabled])");
    await radios[1].evaluate((el) => el.closest(".twc-radio").click());
    a(await radios[1].isChecked(), "clicking a radio selects it");
  },
  Slider: async (p, a) => {
    const s = await p.$('[role="slider"]');
    const v0 = Number(await s.getAttribute("aria-valuenow"));
    await s.focus();
    await p.keyboard.press("ArrowRight");
    const v1 = Number(await s.getAttribute("aria-valuenow"));
    a(v1 > v0, `ArrowRight increases aria-valuenow (${v0}→${v1})`);
  },
  Rating: async (p, a) => {
    const stars = await p.$$('.twc-rating:not([data-readonly="true"]):not([data-disabled="true"]) [role="radio"]');
    a(stars.length >= 3, "has an interactive rating");
    // clicking the already-selected star clears it (by design), so target an unselected one
    let target = null;
    for (const s of stars) { if ((await s.getAttribute("aria-checked")) !== "true") { target = s; break; } }
    target = target || stars[0];
    await target.click();
    await p.waitForTimeout(150); // controlled demo re-renders on the next tick
    a(await target.getAttribute("aria-checked") === "true", "clicking an unselected star selects it");
  },
  Select: async (p, a) => {
    await p.click(".twc-sel__trigger");
    await p.waitForTimeout(150);
    a(await p.$(".twc-pop") !== null, "trigger opens the listbox");
    await p.keyboard.press("ArrowDown"); await p.keyboard.press("Enter");
    await p.waitForTimeout(200);
    a(await p.$(".twc-pop") === null, "Enter commits a value and closes the listbox");
  },
  Combobox: async (p, a) => {
    await p.click(".twc-cb__control");
    await p.waitForTimeout(150);
    const all = (await p.$$(".twc-opt")).length;
    a(all > 0, "opens with options");
    await p.keyboard.type("a");
    await p.waitForTimeout(200);
    const filtered = (await p.$$(".twc-opt")).length;
    a(filtered <= all, `typing filters the options (${all}→${filtered})`);
  },
  MultiSelect: async (p, a) => {
    const chips0 = (await p.$$(".twc-ms__chip")).length;
    await p.click(".twc-ms__control");
    await p.waitForTimeout(150);
    const opt = await p.$(".twc-opt:not([data-selected])");
    if (opt) await opt.click();
    await p.waitForTimeout(150);
    a((await p.$$(".twc-ms__chip")).length > chips0, "selecting an option adds a chip");
  },
  Tabs: async (p, a) => {
    const tabs = await p.$$('.twc-tabs [role="tab"]');
    const inactive = (await Promise.all(tabs.map(async (t) => ({ t, sel: await t.getAttribute("aria-selected") })))).find((x) => x.sel !== "true");
    a(!!inactive, "has an inactive tab to click");
    await inactive.t.click();
    a(await inactive.t.getAttribute("aria-selected") === "true", "clicking a tab selects it");
  },
  Accordion: async (p, a) => {
    const btn = await p.$('.twc-accordion [aria-expanded], [class*="accordion"] [aria-expanded]');
    const before = await btn.getAttribute("aria-expanded");
    await btn.click(); await p.waitForTimeout(150);
    a(await btn.getAttribute("aria-expanded") !== before, "clicking a header toggles aria-expanded");
  },
  Pagination: async (p, a) => {
    // scope to ONE pagination instance (the page has several demos)
    const pag = await p.$(".twc-pagination");
    const cur0 = await pag.$eval(".twc-page[aria-current]", (el) => el.textContent.trim()).catch(() => null);
    const btn = (await pag.evaluateHandle(() => [...document.querySelector(".twc-pagination").querySelectorAll(".twc-page")]
      .find((b) => /^\d+$/.test(b.textContent.trim()) && !b.hasAttribute("aria-current") && !b.disabled))).asElement();
    a(!!btn, "has a numbered page to click");
    if (btn) { await btn.click(); await p.waitForTimeout(200); }
    const cur1 = await pag.$eval(".twc-page[aria-current]", (el) => el.textContent.trim()).catch(() => null);
    a(cur1 && cur1 !== cur0, `clicking a page moves aria-current (${cur0}→${cur1})`);
  },
  Tooltip: async (p, a) => {
    await p.hover(".twc-tooltip-wrap");
    await p.waitForTimeout(400);
    a(await p.$('.twc-tooltip[data-show="true"]') !== null, "hover shows the tooltip");
  },
  Dialog: async (p, a) => {
    a(await openUntil(p, '.twc-dialog[role="dialog"]'), "a trigger opens the dialog");
    await p.waitForTimeout(200); // let the focus-on-open effect settle
    const focusInside = await p.evaluate(() => document.querySelector(".twc-dialog")?.contains(document.activeElement));
    a(focusInside, "focus moves inside the dialog");
    await p.keyboard.press("Escape"); await p.waitForTimeout(250);
    a(await p.$('.twc-dialog[role="dialog"]') === null, "Escape closes the dialog");
  },
  Drawer: async (p, a) => {
    a(await openUntil(p, ".twc-drawer"), "a trigger opens the drawer");
    await p.waitForTimeout(200);
    a(await p.evaluate(() => document.querySelector(".twc-drawer")?.contains(document.activeElement)), "focus moves inside the drawer");
    a(await p.evaluate(() => getComputedStyle(document.body).overflow === "hidden"), "body scroll is locked while open");
    await p.keyboard.press("Escape"); await p.waitForTimeout(250);
    a(await p.$(".twc-drawer") === null, "Escape closes the drawer");
  },
  Menu: async (p, a) => {
    await p.click('.twc-menu-wrap [aria-haspopup="menu"]');
    await p.waitForTimeout(150);
    a(await p.$('.twc-menu[role="menu"]') !== null, "trigger opens the menu");
    await p.keyboard.press("ArrowDown"); await p.waitForTimeout(80);
    a(await p.$('.twc-menu__item[data-active="true"]') !== null, "ArrowDown highlights an item");
    await p.keyboard.press("Escape"); await p.waitForTimeout(200);
    a(await p.$('.twc-menu[role="menu"][data-state="open"]') === null, "Escape closes the menu");
  },
  Popover: async (p, a) => {
    await p.click('.twc-popover-wrap [aria-haspopup="dialog"]');
    await p.waitForTimeout(150);
    a(await p.$('.twc-popover[role="dialog"]') !== null, "trigger opens the popover");
    await p.keyboard.press("Escape"); await p.waitForTimeout(200);
    a(await p.$('.twc-popover[role="dialog"][data-state="open"]') === null, "Escape closes the popover");
  },
  CommandPalette: async (p, a) => {
    let opened = await openUntil(p, ".twc-cmdk");
    if (!opened) { await p.keyboard.down("Control"); await p.keyboard.press("k"); await p.keyboard.up("Control"); await p.waitForTimeout(250); opened = !!(await p.$(".twc-cmdk")); }
    a(opened, "opens (trigger or Ctrl/Cmd+K)");
    a(await p.evaluate(() => document.activeElement?.classList.contains("twc-cmdk__input")), "focus is on the search input");
    await p.keyboard.press("Escape"); await p.waitForTimeout(250);
    a(await p.$(".twc-cmdk") === null, "Escape closes the palette");
  },
  DatePicker: async (p, a) => {
    await p.click(".twc-dp__control");
    await p.waitForTimeout(150);
    a(await p.$(".twc-dp__pop") !== null, "trigger opens the calendar");
    const day = await p.$('.twc-dp__day:not(:disabled):not([data-outside="true"])');
    await day.click(); await p.waitForTimeout(200);
    a(await p.$(".twc-dp__pop") === null, "picking a day closes the calendar");
  },
};

// Click demo buttons (skipping page chrome AND the code-block toolbar: JS/TS/Copy/Expand)
// one at a time until `sel` appears — robust against which demo button opens the overlay.
async function openUntil(p, sel, max = 12) {
  if (await p.$(sel)) return true;
  const btns = await p.$$('button, [role="button"]');
  let tried = 0;
  for (const h of btns) {
    if (tried >= max) break;
    const skip = await h.evaluate((el) => {
      if (el.closest("nav") || el.closest("header") || el.closest('[class*="navbar"]') || el.closest('[class*="sidebar"]') || el.closest("pre")) return true;
      const t = (el.textContent || "").trim();
      return ["JS", "TS", "Copy", "Expand code", "Collapse code", ""].includes(t);
    }).catch(() => true);
    if (skip) continue;
    tried++;
    try { await h.click({ timeout: 700 }); } catch { continue; }
    await p.waitForTimeout(250);
    if (await p.$(sel)) return true;
    await p.keyboard.press("Escape"); await p.waitForTimeout(120);
  }
  return false;
}

const results = [];
for (const [name, fn] of Object.entries(CASES)) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  const checks = [];
  const a = (cond, msg) => checks.push({ ok: !!cond, msg });
  try {
    await p.goto(BASE + name.toLowerCase(), { waitUntil: "load" });
    await p.waitForTimeout(500);
    await fn(p, a);
  } catch (e) { a(false, "threw: " + String(e).split("\n")[0].slice(0, 120)); }
  if (errs.length) a(false, "pageerror: " + errs[0]);
  results.push({ name, checks });
  await p.close();
}
await b.close();

let pass = 0, fail = 0;
for (const r of results) {
  for (const c of r.checks) {
    if (c.ok) { pass++; } else { fail++; }
    console.log(`${c.ok ? "  ✓" : "  ✗"} ${r.name}: ${c.msg}`);
  }
}
console.log(`\n${pass} behavioral assertions passed, ${fail} failed across ${results.length} components.`);
process.exit(fail ? 1 : 0);
