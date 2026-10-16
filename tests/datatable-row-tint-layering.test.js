import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// #481 — the documented layering contract for getRowStyle is NOT a hand-maintained ordering. It rests
// on exactly one mechanical fact: the base `.twc-dt__td` background (which is what reads the row tint,
// `var(--twc-dt-row-bg, var(--color-surface))`) is the LOWEST-specificity background rule that can paint
// a data cell. Everything the docs claim follows from that — hover, selection, activeRowId, a pinned or
// grabbed row, the diff washes, cell selection and inline editing all cover the tint, because they all
// outrank it.
//
// That is fragile in a way nothing else guards: a future rule added with the bare `.twc-dt__td` selector
// would TIE with the base rule and win only by source order, and lowering any existing state rule would
// let a data-derived wash hide an interaction state — the one thing the design says must never happen.
// Neither shows up as a failing render test; both silently make the published contract untrue.

const SRC = readFileSync(resolve(process.cwd(), "components/data-display/Datatable.jsx"), "utf8");

/** Specificity (a,b,c) of a single complex selector — enough of the grammar for this stylesheet. */
function specificity(sel) {
  let a = 0, b = 0, c = 0;
  // strip combinators so only compound selectors remain
  const compound = sel.replace(/\s*[>+~]\s*/g, " ").trim();
  // ::pseudo-element (c) must be matched before :pseudo-class (b)
  const tokens = compound.match(/#[\w-]+|\.[\w-]+|\[[^\]]*\]|::[\w-]+|:[\w-]+(\([^)]*\))?|[a-zA-Z][\w-]*|\*/g) || [];
  for (const t of tokens) {
    if (t === "*") continue;
    else if (t.startsWith("#")) a++;
    else if (t.startsWith("::")) c++;
    else if (t.startsWith(".") || t.startsWith("[")) b++;
    else if (t.startsWith(":")) b++;
    else c++;
  }
  return [a, b, c];
}
const cmp = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];

/** Every rule in the component's stylesheet that sets a `background` on a data cell. */
function cellBackgroundRules() {
  // Strip comments from the WHOLE sheet first: a comment containing a semicolon splits across the
  // rule regex and leaves its tail glued to the next selector, inflating that selector's specificity.
  const css = SRC.slice(SRC.indexOf("const DT_CSS = `") + 1).replace(/\/\*[\s\S]*?\*\//g, "");
  const out = [];
  for (const m of css.matchAll(/([^{}`;]+)\{([^{}]*)\}/g)) {
    const selectors = m[1].trim();
    const body = m[2];
    if (!/(^|[;\s])background\s*:/.test(body)) continue;
    for (const sel of selectors.split(",").map((s) => s.trim()).filter(Boolean)) {
      // only rules that can match a BODY data cell
      if (!/\.twc-dt__td(\b|[.[:])/.test(sel)) continue;
      if (sel.includes("__pivot") || sel.includes("__th")) continue;
      out.push({ sel, spec: specificity(sel) });
    }
  }
  return out;
}

describe("row-tint layering rests on specificity, not luck (#481)", () => {
  const rules = cellBackgroundRules();

  it("finds the cell-background rules at all", () => {
    expect(rules.length, "the selector scrape found nothing — the stylesheet shape changed").toBeGreaterThan(8);
  });

  it("the base rule is the one that reads --twc-dt-row-bg", () => {
    const base = rules.filter((r) => r.sel === ".twc-dt__td");
    expect(base, "exactly one bare .twc-dt__td background rule").toHaveLength(1);
    const i = SRC.indexOf(".twc-dt__td { padding:");
    expect(SRC.slice(i, SRC.indexOf("}", i))).toMatch(
      /background:\s*var\(--twc-dt-row-bg,\s*var\(--color-surface\)\)/
    );
    expect(base[0].spec).toEqual([0, 1, 0]);
  });

  it("every other cell-background rule strictly outranks it, so no state can be hidden by a tint", () => {
    const base = [0, 1, 0];
    const weak = rules
      .filter((r) => r.sel !== ".twc-dt__td")
      .filter((r) => cmp(r.spec, base) <= 0)
      .map((r) => `${r.sel}  ${r.spec.join(",")}`);
    expect(
      weak,
      "these paint a data cell at or below the row tint's specificity — a data-derived wash could hide an interaction state, or win only by source order"
    ).toEqual([]);
  });

  it("the states the docs name are all present and all outrank the tint", () => {
    // Named explicitly: if one is renamed or dropped, the prose in docs/datatable.md and the
    // getRowStyle JSDoc stop being true and this says so by name.
    const needed = [
      ":hover",
      '[data-selected="true"]',
      '[data-active="true"]',
      "[data-pinned-row]",
      "[data-row-grabbed]",
      '[data-op="added"]',
      '[data-cell-selected="true"]',
      '[data-editing="true"]',
    ];
    const base = [0, 1, 0];
    for (const token of needed) {
      const hits = rules.filter((r) => r.sel.includes(token));
      expect(hits.length, `no cell-background rule mentions ${token}`).toBeGreaterThan(0);
      for (const h of hits) expect(cmp(h.spec, base), `${h.sel} does not outrank the row tint`).toBeGreaterThan(0);
    }
  });

  it("the specificity the docs tell consumers to beat is the real highest one", () => {
    // docs/datatable.md and the getRowClassName JSDoc give a number for "beat this to outrank hover
    // and selection". Keep that number honest rather than reasoned-out once and left to rot.
    const top = rules
      .filter((r) => r.sel !== ".twc-dt__td")
      .reduce((m, r) => (cmp(r.spec, m) > 0 ? r.spec : m), [0, 0, 0]);
    expect(top).toEqual([0, 4, 0]);
    // the row-level states on an ORDINARY cell; their pinned-column twins are the (0,4,0) above
    const ordinary = rules
      .filter((r) => r.sel !== ".twc-dt__td" && !r.sel.includes("[data-pin]"))
      .reduce((m, r) => (cmp(r.spec, m) > 0 ? r.spec : m), [0, 0, 0]);
    expect(ordinary).toEqual([0, 3, 0]);
    const docs = readFileSync(resolve(process.cwd(), "docs/datatable.md"), "utf8");
    for (const n of ["(0,1,0)", "(0,3,0)", "(0,4,0)"]) {
      expect(docs, `docs/datatable.md should quote the real figure ${n}`).toContain(n);
    }
  });
});
