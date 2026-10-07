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

// Returns [r, g, b, a]. #449: the alpha channel is REQUIRED — the dark soft tones are
// `rgb(16 185 129 / 0.15)`-style tints, and reading those as opaque (as this helper used to)
// yields a ratio for a colour that is never painted.
function toRgba(value) {
  let m = value.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  m = value.match(/^#([0-9a-f]{3})$/i);
  if (m) return [...m[1].split("").map((c) => parseInt(c + c, 16)), 1];
  m = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.]+%?))?\s*\)$/i);
  if (m) {
    let a = m[4] == null ? 1 : (m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
    return [+m[1], +m[2], +m[3], a];
  }
  throw new Error(`Cannot parse color "${value}"`);
}

// Source-over composite of a translucent colour onto an opaque backdrop.
function over([r, g, b, a], [br, bg, bb]) {
  return [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a), 1];
}

function relLuminance([r, g, b]) { // alpha already composited away
  const lin = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(scope, a, b, under = "--color-surface") {
  const base = toRgba(resolveVar(under, scope)); // the opaque thing both are painted on
  let cb = toRgba(resolveVar(b, scope));
  if (cb[3] < 1) cb = over(cb, base); // a tinted background composites over the surface
  let ca = toRgba(resolveVar(a, scope));
  if (ca[3] < 1) ca = over(ca, cb); // translucent text composites over its own background
  const la = relLuminance(ca);
  const lb = relLuminance(cb);
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

// #449 — the quiet-TEXT token and the soft tone foregrounds are text-grade, so they owe 4.5:1,
// not the 3:1 UI floor. Both were failing by default: --color-text-subtle measured 2.56:1 on white
// (the Sidebar section headings) and 3.75:1 on the dark surface, and the light soft foregrounds sat
// at 3.07-4.28:1 (Badge, and Alert — whose DEFAULT variant is soft and default tone info).
describe("token a11y - quiet text + soft tone foreground contrast (#449)", () => {
  for (const scopeName of ["light", "dark"]) {
    const scope = scopes[scopeName];
    it(`--color-text-subtle on --color-surface clears AA 4.5:1 (${scopeName})`, () => {
      expect(contrast(scope, "--color-text-subtle", "--color-surface")).toBeGreaterThanOrEqual(4.5);
    });
    it(`--color-text-subtle on --color-bg clears AA 4.5:1 (${scopeName})`, () => {
      expect(contrast(scope, "--color-text-subtle", "--color-bg")).toBeGreaterThanOrEqual(4.5);
    });
    it(`--color-text-subtle on --color-surface-raised clears AA 4.5:1 (${scopeName})`, () => {
      expect(contrast(scope, "--color-text-subtle", "--color-surface-raised")).toBeGreaterThanOrEqual(4.5);
    });
    // The one pairing the token change cannot lift: --color-surface-sunken moves WITH the text ramp, so
    // text-subtle lands at 4.34:1 in light however the ramp shifts. The rule is therefore structural
    // rather than numeric - quiet text ON A SUNKEN BACKGROUND must use --color-text-muted (6.92:1), as
    // Kbd, CommandPalette and the Datatable labels do. These two assertions encode both halves so a new
    // text-subtle-on-sunken declaration cannot be added without this file objecting.
    it(`--color-text-subtle on --color-surface-sunken is NOT AA, which is why text-muted is required there (${scopeName})`, () => {
      const r = contrast(scope, "--color-text-subtle", "--color-surface-sunken");
      expect(r).toBeGreaterThanOrEqual(3); // still clears the SC 1.4.11 graphics floor
      if (scopeName === "light") expect(r).toBeLessThan(4.5); // documents the constraint, not an aspiration
    });
    it(`--color-text-muted on --color-surface-sunken clears AA 4.5:1 (${scopeName})`, () => {
      expect(contrast(scope, "--color-text-muted", "--color-surface-sunken")).toBeGreaterThanOrEqual(4.5);
    });
    for (const tone of SOLID_TONES) {
      it(`${tone}-subtle-fg on ${tone}-subtle clears AA 4.5:1 (${scopeName})`, () => {
        // the dark -subtle values are translucent tints; contrast() composites them over the surface
        expect(contrast(scope, `--color-${tone}-subtle-fg`, `--color-${tone}-subtle`)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

// #454 — the unchecked boundary of a Checkbox/Radio/Switch is the ONLY thing that says the control is
// there, so SC 1.4.11 asks 3:1 of it. --color-border-strong (the old value) was 1.49:1.
describe("token a11y - control boundary contrast (#454)", () => {
  for (const [scopeName, scope] of Object.entries(scopes)) {
    for (const bg of ["--color-surface", "--color-bg", "--color-surface-raised"]) {
      it(`--color-control-border on ${bg} clears the 3:1 non-text floor (${scopeName})`, () => {
        expect(contrast(scope, "--color-control-border", bg, bg)).toBeGreaterThanOrEqual(3);
      });
    }
  }
});

// #455 — a fill or stroke that IS the information (a Progress bar, a Toast stripe, a status icon) owes
// 3:1 under SC 1.4.11. The plain light-mode tones missed it: amber-500 was 1.96:1 on surface-sunken.
describe("token a11y - graphic tone contrast (#455)", () => {
  const TONES = ["primary", "success", "warning", "danger", "info"];
  for (const [scopeName, scope] of Object.entries(scopes)) {
    for (const tone of TONES) {
      for (const bg of ["--color-surface", "--color-surface-raised", "--color-surface-sunken"]) {
        it(`--color-${tone}-graphic on ${bg} clears 3:1 (${scopeName})`, () => {
          expect(contrast(scope, `--color-${tone}-graphic`, bg, bg)).toBeGreaterThanOrEqual(3);
        });
      }
    }
  }
});

// #451/#456 — --color-primary is a FILL colour (brand-500), not a text colour: as text it measures
// 4.00-4.47:1 in light and 3.27:1 on the dark raised surface, so the 13 declarations that used it for
// link/label/hover text all missed SC 1.4.3. They now use --color-primary-subtle-fg. These assertions
// encode both halves of that rule - the replacement clears AA, and the original cannot - so a new
// `color: var(--color-primary)` text declaration has a test to answer to.
describe("token a11y - primary as text vs as fill (#451, #456)", () => {
  for (const [scopeName, scope] of Object.entries(scopes)) {
    for (const bg of ["--color-surface", "--color-bg", "--color-surface-sunken"]) {
      it(`--color-primary-subtle-fg on ${bg} clears AA 4.5:1 (${scopeName})`, () => {
        expect(contrast(scope, "--color-primary-subtle-fg", bg, bg)).toBeGreaterThanOrEqual(4.5);
      });
      // The exception, measured not assumed: on the DARK page background (slate-950) brand-500 scrapes
      // 4.52:1. Components paint on surfaces, not on the page background, so the rule still holds where
      // it matters - and a token that passes only against the single darkest backdrop in the system is
      // not a text colour.
      if (bg !== "--color-bg" || scopeName === "light") {
        it(`--color-primary on ${bg} does NOT clear AA, which is why it is fill-only (${scopeName})`, () => {
          expect(contrast(scope, "--color-primary", bg, bg)).toBeLessThan(4.5);
        });
      }
    }
  }
});

// #454 (review) - a Switch has TWO contrast constraints that pull in opposite directions, and the
// first version of the #454 fix satisfied one by breaking the other (dark thumb-vs-track fell from
// 10.35:1 to 2.56:1). Both halves are asserted here so neither can be traded away again:
//   (a) the control must be identifiable - in LIGHT the white thumb is invisible on a white surface,
//       so the track itself has to clear 3:1 against the surface;
//   (b) the thumb must be distinguishable from the track it sits on, in BOTH themes, because its
//       position is what conveys on/off.
describe("token a11y - Switch track vs thumb (#454)", () => {
  for (const [scopeName, scope] of Object.entries(scopes)) {
    it(`the thumb clears 3:1 against the off track (${scopeName})`, () => {
      expect(contrast(scope, "--color-primary-fg", "--color-control-track")).toBeGreaterThanOrEqual(3);
    });
    it(`the thumb clears 3:1 against the ON track (${scopeName})`, () => {
      expect(contrast(scope, "--color-primary-fg", "--color-primary")).toBeGreaterThanOrEqual(3);
    });
    for (const bg of ["--color-surface", "--color-surface-raised"]) {
      it(`the control is identifiable on ${bg} - track or thumb clears 3:1 (${scopeName})`, () => {
        const track = contrast(scope, "--color-control-track", bg, bg);
        const thumb = contrast(scope, "--color-primary-fg", bg, bg);
        expect(Math.max(track, thumb)).toBeGreaterThanOrEqual(3);
      });
    }
  }
});
