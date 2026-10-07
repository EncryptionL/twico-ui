import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

// #451 (review) — a SOURCE guard, not a token guard.
//
// The #451 token assertions in tokens-a11y.test.js prove that --color-primary cannot clear 4.5:1 as
// text and that --color-primary-subtle-fg can. What they could NOT do is notice a component still
// using the wrong one: they only read tokens/colors.css, so they passed identically before and after
// the fix. That gap was load-bearing — it is exactly why an inline `style={{ color:
// "var(--color-primary)" }}` on Datatable's "Add filter" button survived the sweep of the very file it
// was in, while a comment in the token test claimed "a new color: var(--color-primary) text
// declaration has a test to answer to". This is that test.
//
// The rule: --color-primary is a FILL token. Using it for `color` is only allowed where the painted
// thing is a glyph (an icon, a chevron, a check) — graphics owe 3:1, which plain primary clears on a
// plain surface — and never for text, which owes 4.5:1. Every such use is allowlisted below with the
// selector it appears under, so adding a new one is a deliberate act that fails this test first.

const ROOT = process.cwd();

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|css)$/.test(name) && !/\.d\.ts$/.test(name)) out.push(p);
  }
  return out;
}

const FILES = [...walk(resolve(ROOT, "components")), resolve(ROOT, "base.css")];

/** Every `color: var(--color-primary)` declaration in shipped source, with the selector it sits under. */
function findDeclarations() {
  // (?<![-\w]) so `border-color:` / `background-color:` / `--_accent-color:` never match.
  const re = /(?<![-\w])color:\s*var\(--color-primary\)\s*[;}]/;
  const hits = [];
  for (const file of FILES) {
    const lines = readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
    lines.forEach((line, i) => {
      if (!re.test(line)) return;
      let selector = line.includes("{") ? line.split("{")[0].trim() : "";
      for (let j = i - 1; !selector && j >= 0 && j > i - 12; j--) {
        if (lines[j].includes("{")) selector = lines[j].split("{")[0].trim();
      }
      hits.push({ file: file.slice(ROOT.length + 1).replace(/\\/g, "/"), line: i + 1, selector });
    });
  }
  return hits;
}

// Each entry is a GLYPH, verified at its render site: the element paints an <svg> or a single
// character and nothing else, so the 3:1 non-text floor applies rather than 4.5:1.
const GLYPH_ALLOWLIST = [
  ".twc-dt__sort",
  '.twc-dt__group-chev[data-open]',
  '.twc-dt__expand-chev[data-open]',
  ".twc-dt__row-handle:focus-visible",
  '.twc-dt__row-handle[data-grabbed="true"]',
  ".twc-dt__edit-hint",
  '.twc-table th[data-active="true"] .twc-table__sort svg',
  ".twc-opt__check",
  '.twc-accordion__trigger[data-open="true"] .twc-accordion__chevron',
  '.twc-tree__row[data-selected="true"] .twc-tree__ic',
  '.twc-cmdk__item[data-active="true"] .twc-cmdk__item-ic',
];

describe("--color-primary is a fill token, not a text token (#451)", () => {
  const hits = findDeclarations();

  it("every `color: var(--color-primary)` in shipped source is an allowlisted glyph", () => {
    const unexpected = hits.filter((h) => !GLYPH_ALLOWLIST.includes(h.selector));
    expect(
      unexpected.map((h) => `${h.file}:${h.line} under "${h.selector}"`),
      "new color: var(--color-primary) declaration — if it paints TEXT use --color-primary-subtle-fg; " +
        "if it paints a glyph on a PLAIN surface, add its selector to GLYPH_ALLOWLIST"
    ).toEqual([]);
  });

  it("the allowlist has not rotted — every entry still exists in the source", () => {
    const seen = new Set(hits.map((h) => h.selector));
    const stale = GLYPH_ALLOWLIST.filter((s) => !seen.has(s));
    expect(stale, "allowlist entries no longer present — delete them").toEqual([]);
  });

  it("no inline style object paints text with the fill token", () => {
    // This is the exact form that slipped through the #451 sweep.
    const offenders = [];
    for (const file of FILES) {
      const src = readFileSync(file, "utf8");
      if (/color:\s*["']var\(--color-primary\)["']/.test(src)) {
        offenders.push(file.slice(ROOT.length + 1).replace(/\\/g, "/"));
      }
    }
    expect(offenders).toEqual([]);
  });
});
