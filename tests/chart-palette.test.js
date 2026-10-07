import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CHART_PALETTE } from "../components/data-display/_chart.js";

// #455 — CHART_PALETTE used to inline primitives, and slots 1 and 6 were BOTH indigo-500 (because
// --brand-500 aliases it): any chart with six or more series painted two of them identically, 1.00:1,
// with two identical legend swatches. It also used the 500 steps in light mode, where amber-500 sits at
// 1.96:1 on a white surface — under the SC 1.4.11 floor for a graphic that carries meaning.
//
// This file guards both properties so a future re-skin of --brand-* or a token tweak cannot recreate
// either failure: every slot distinct AND perceptibly separated, and every slot >= 3:1 on its own
// surface in BOTH themes.

const ROOT = process.cwd();
const css = readFileSync(resolve(ROOT, "tokens/colors.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

function parseBlock(text) {
  const map = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(text))) map[m[1]] = m[2].trim();
  return map;
}
const rootVars = parseBlock(css.match(/:root\s*\{([\s\S]*?)\n\}/)[1]);
const darkVars = parseBlock(css.match(/\.dark\s*,\s*\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)[1]);
const scopes = { light: rootVars, dark: { ...rootVars, ...darkVars } };

function resolveVar(name, scope) {
  let v = scope[name];
  if (v == null) return null;
  let guard = 0;
  while (/var\(\s*--[\w-]+\s*\)/.test(v) && guard++ < 25) {
    v = v.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, r) => scope[r] ?? `var(${r})`);
  }
  return v.trim();
}

const rgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const lin = (c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = lum(a) >= lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
  return (hi + 0.05) / (lo + 0.05);
};
// CIE76 ΔE — WCAG contrast is a luminance ratio and says nothing about whether two colours can be told
// APART (navy vs. periwinkle can both be 5:1 on white and still be confusable), so distinguishability
// needs a perceptual metric. 15 is comfortably above the ~2.3 just-noticeable-difference.
function lab(hex) {
  const [r, g, b] = rgb(hex).map(lin);
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const [fx, fy, fz] = [f(X), f(Y), f(Z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
const deltaE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));

describe("CHART_PALETTE wiring (#455)", () => {
  it("is seven distinct --color-chart-* tokens, in order", () => {
    expect(CHART_PALETTE).toEqual([1, 2, 3, 4, 5, 6, 7].map((n) => `var(--color-chart-${n})`));
  });
  it("references no primitive directly, so the ramp can flip per theme", () => {
    for (const entry of CHART_PALETTE) expect(entry).not.toMatch(/--(?:brand|indigo|sky|emerald|amber|rose|slate)-/);
  });
});

for (const [scopeName, scope] of Object.entries(scopes)) {
  describe(`CHART_PALETTE resolved values (${scopeName}, #455)`, () => {
    const hexes = CHART_PALETTE.map((e) => resolveVar(e.replace(/^var\(|\)$/g, ""), scope));

    it("every slot resolves to a hex", () => {
      for (const h of hexes) expect(h).toMatch(/^#[0-9a-f]{6}$/i);
    });

    // The original defect, stated directly: slot 1 and slot 6 were the same colour.
    it("no two slots are the same colour", () => {
      expect(new Set(hexes).size).toBe(hexes.length);
    });

    it("every pair is perceptibly different (ΔE76 >= 15)", () => {
      for (let i = 0; i < hexes.length; i++) {
        for (let j = i + 1; j < hexes.length; j++) {
          expect(deltaE(hexes[i], hexes[j]), `slot ${i + 1} vs slot ${j + 1}`).toBeGreaterThanOrEqual(15);
        }
      }
    });

    for (const bg of ["--color-surface", "--color-surface-raised"]) {
      it(`every slot clears the 3:1 non-text floor on ${bg}`, () => {
        const b = resolveVar(bg, scope);
        hexes.forEach((h, i) => expect(contrast(h, b), `slot ${i + 1} (${h}) on ${b}`).toBeGreaterThanOrEqual(3));
      });
    }
  });
}
