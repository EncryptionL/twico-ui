import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// A11y guard for the design tokens (issues #176, #178). Parses tokens/colors.css,
// resolves the full var() chain for the :root (light) and .dark scopes, computes
// WCAG 2.x contrast ratios, and asserts the solid-tone foregrounds and the focus
// ring clear their thresholds — plus that base.css keeps a forced-colors outline
// fallback. Mirrors the resolver used by scripts/verify-palette.mjs.

const ROOT = process.cwd();
const css = readFileSync(resolve(ROOT, "tokens/colors.css"), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  ""
);
const baseCss = readFileSync(resolve(ROOT, "base.css"), "utf8");

function parseBlock(text) {
  const map = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(text))) map[m[1]] = m[2].trim();
  return map;
}

const rootVars = parseBlock(css.match(/:root\s*\{([\s\S]*?)\n\}/)[1]);
const darkVars = parseBlock(
  css.match(/\.dark\s*,\s*\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)[1]
);
// The dark scope inherits every token it does not override from :root.
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

function toRgb(value) {
  let m = value.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  m = value.match(/^#([0-9a-f]{3})$/i);
  if (m) return m[1].split("").map((c) => parseInt(c + c, 16));
  m = value.match(/^rgb\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (m) return [+m[1], +m[2], +m[3]];
  throw new Error(`Cannot parse color "${value}" (expected solid hex/rgb)`);
}

function relLuminance([r, g, b]) {
  const lin = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(scope, a, b) {
  const la = relLuminance(toRgb(resolveVar(a, scope)));
  const lb = relLuminance(toRgb(resolveVar(b, scope)));
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const SOLID_TONES = ["primary", "success", "warning", "danger", "info"];

describe("token a11y — solid tone foreground contrast (#176)", () => {
  for (const scopeName of ["light", "dark"]) {
    const scope = scopes[scopeName];
    it(`warning-fg on warning clears AA 4.5:1 (${scopeName})`, () => {
      expect(contrast(scope, "--color-warning-fg", "--color-warning")).toBeGreaterThanOrEqual(4.5);
    });
    it(`info-fg on info clears AA 4.5:1 (${scopeName})`, () => {
      expect(contrast(scope, "--color-info-fg", "--color-info")).toBeGreaterThanOrEqual(4.5);
    });
    for (const tone of SOLID_TONES) {
      it(`${tone}-fg on ${tone} clears the 3:1 UI floor (${scopeName})`, () => {
        expect(contrast(scope, `--color-${tone}-fg`, `--color-${tone}`)).toBeGreaterThanOrEqual(3);
      });
    }
  }
});

describe("token a11y — focus ring contrast (#178)", () => {
  for (const scopeName of ["light", "dark"]) {
    it(`--color-ring on --color-surface clears SC 1.4.11 3:1 (${scopeName})`, () => {
      expect(contrast(scopes[scopeName], "--color-ring", "--color-surface")).toBeGreaterThanOrEqual(3);
    });
  }
});

describe("token a11y — forced-colors focus fallback (#178)", () => {
  it("base.css keeps a forced-colors :focus-visible outline fallback", () => {
    const block = baseCss.match(/@media\s*\(forced-colors:\s*active\)\s*\{([\s\S]*?)\}\s*\}/);
    expect(block, "missing @media (forced-colors: active) block").toBeTruthy();
    expect(block[1]).toMatch(/:focus-visible/);
    expect(block[1]).toMatch(/outline\s*:/);
  });
});
