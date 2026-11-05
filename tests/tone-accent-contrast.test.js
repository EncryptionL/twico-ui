import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// #504 — widening Button/IconButton to the full Tone scale added -hover/-active tokens for success,
// warning and info. Every one of those is a new foreground-on-background pair that nothing checked.
//
// The first cut got it wrong in a way a naive test could not see. The step rule was written as
// "light goes darker, dark goes lighter", mirroring primary and danger — but warning and info carry
// DARK ink (--color-warning-fg is amber-950, --color-info-fg is sky-950), so stepping darker moved
// the background TOWARDS the ink and cut contrast: light info solid:active came out at 2.34:1. A
// test asserting the step DIRECTION passed while the colour failed. The real rule is "move away from
// the ink", which depends on whether the ink is light or dark — so this file asserts the ratio.

const css = readFileSync(resolve(process.cwd(), "tokens/colors.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const darkAt = css.indexOf(".dark,");
const BLOCK = { light: css.slice(0, darkAt), dark: css.slice(darkAt) };

const prim = {};
for (const m of css.matchAll(/--([a-z]+-\d+):\s*(#[0-9a-fA-F]{3,8})/g)) prim[m[1]] = m[2];

function token(theme, name, depth = 0) {
  if (depth > 6) return null;
  const find = (b) => { const m = b.match(new RegExp(`--${name}:\\s*([^;]+);`)); return m ? m[1].trim() : null; };
  const v = find(BLOCK[theme]) ?? find(BLOCK.light);
  if (!v) return null;
  const r = v.match(/^var\(--([a-z0-9-]+)\)$/);
  return r ? (prim[r[1]] ?? token(theme, r[1], depth + 1)) : v;
}
function parse(c) {
  if (!c) return null;
  let m = c.trim().match(/^#([0-9a-fA-F]{6})$/);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  m = c.trim().match(/^#([0-9a-fA-F]{3})$/);
  if (m) return [...m[1]].map((h) => parseInt(h + h, 16));
  m = c.trim().match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+))?\s*\)$/);
  if (m) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
  return null;
}
const lum = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const flat = (fg, bg) => {
  const a = fg[3] == null ? 1 : fg[3];
  return a === 1 ? fg : [0, 1, 2].map((i) => Math.round(fg[i] * a + bg[i] * (1 - a)));
};
const ratio = (f, b) => +(((Math.max(lum(f), lum(b)) + 0.05) / (Math.min(lum(f), lum(b)) + 0.05)).toFixed(2));

// Pairs that ALREADY ship below 4.5:1 through Badge/Tag with these exact tokens — #504 did not
// introduce them, it only made them reachable from Button too. Listed explicitly so the guard stays
// honest: the debt is visible here rather than hidden by a lowered threshold, and anything NOT on
// this list must pass. Fixing them means changing brand/semantic colours library-wide, which is a
// design decision, not a side effect of adding tones.
const KNOWN_PREEXISTING = new Set([
  // Empty, and that is the point. This list held six pairs that shipped below 4.5:1 through
  // Badge/Tag long before #504 — light primary/success/danger solid, and dark primary at rest,
  // hovered and active. They were fixed alongside #504 rather than left exempt: the plain tones are
  // the ones the system designates for "fills that carry text on top", so failing their own ink was
  // a broken contract, not a trade-off. The "no stale entries" test below is what forced this list
  // to be emptied instead of quietly granting cover to a regression.
]);

const TONES = ["primary", "success", "warning", "danger", "info"];

describe("tone accent pairs meet 4.5:1 (#504)", () => {
  const measured = [];
  for (const theme of ["light", "dark"]) {
    const page = parse(token(theme, "color-surface"));
    const sunken = flat(parse(token(theme, "color-surface-sunken")), page);
    for (const t of TONES) {
      const fg = parse(token(theme, `color-${t}-fg`));
      const sub = parse(token(theme, `color-${t}-subtle-fg`));
      const pairs = [
        ["solid", fg, parse(token(theme, `color-${t}`))],
        ["solid:hover", fg, parse(token(theme, `color-${t}-hover`))],
        ["solid:active", fg, parse(token(theme, `color-${t}-active`))],
        ["soft", sub, flat(parse(token(theme, `color-${t}-subtle`)), page)],
        ["ghost:hover", sub, sunken],
      ];
      for (const [label, f, b] of pairs) {
        if (!f || !b) continue;
        measured.push([`${theme} ${t} ${label}`, ratio(flat(f, b), b)]);
      }
    }
  }

  it("resolves every pair it claims to check", () => {
    // 5 tones x 5 pairs x 2 themes; a token that fails to resolve would silently skip.
    expect(measured.length).toBe(50);
  });

  it("no pair fails except the ones that already shipped", () => {
    const failing = measured.filter(([, r]) => r < 4.5).map(([k, r]) => `${k} = ${r}:1`);
    const unexpected = failing.filter((f) => !KNOWN_PREEXISTING.has(f.split(" = ")[0]));
    expect(unexpected, "a tone pair below 4.5:1 that is not pre-existing debt").toEqual([]);
  });

  it("every pair #504 added passes on its own merits", () => {
    // The -hover/-active steps for success, warning and info are entirely new. None of them may
    // lean on the pre-existing allow-list.
    const added = measured.filter(([k]) =>
      /(success|warning|info) solid:(hover|active)$/.test(k) || /danger solid:active$/.test(k));
    // 3 tones x 2 steps x 2 themes, plus danger:active in 2 themes
    expect(added.length, "expected 14 newly added pairs").toBe(14);
    for (const [k, r] of added) expect(r, `${k} = ${r}:1`).toBeGreaterThanOrEqual(4.5);
  });

  it("the allow-list has no stale entries", () => {
    // If a pre-existing pair gets fixed, this forces the exemption to be deleted rather than left
    // quietly granting cover to a future regression.
    const stillFailing = new Set(measured.filter(([, r]) => r < 4.5).map(([k]) => k));
    const stale = [...KNOWN_PREEXISTING].filter((k) => !stillFailing.has(k));
    expect(stale, "these are now passing — remove them from KNOWN_PREEXISTING").toEqual([]);
  });
});
