import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// #454 (review 2) — the SOURCE guard that was missing.
//
// tests/tokens-a11y.test.js proves the control TOKENS pair safely. It reads only tokens/colors.css, so
// it cannot see whether a component uses them: reverting Switch.jsx's thumb to `var(--_accent-fg)`
// leaves all of its assertions green and reintroduces the 1.43–1.78:1 dark regression with CI passing.
// That is the third time in this series a guard has been blind to its own call site (the #451 token
// test, then the #454 one naming a single tone), so the rule here is the same as
// tests/primary-is-fill-only.test.js and tests/quiet-text-on-tinted-fills.test.js: assert the SOURCE.
//
// The contract being pinned:
//   OFF  thumb -> --color-control-thumb   (static, tone-independent; the tone's --_accent-fg is the
//                                          ON-state ink and is near-black for 5 of the 6 tones)
//   OFF  track -> --color-control-track    (NOT --color-control-border: the Switch's two constraints
//                                          pull opposite ways — see docs/colors.md)
//   ON   thumb -> --_accent-fg             (only under :checked, where it is paired with its own fill)
//   Checkbox/Radio border -> --color-control-border

const read = (p) => readFileSync(resolve(process.cwd(), p), "utf8").replace(/\r\n/g, "\n");

/** The declaration block of the first rule whose selector list contains `selector`. */
function ruleBody(src, selector) {
  const i = src.indexOf(selector);
  if (i < 0) throw new Error(`selector not found: ${selector}`);
  const open = src.indexOf("{", i);
  return src.slice(open + 1, src.indexOf("}", open));
}

describe("Switch paints its OFF state from the control tokens (#454)", () => {
  const src = read("components/inputs/Switch.jsx");

  it("the base thumb rule uses --color-control-thumb, never the tone ink", () => {
    const body = ruleBody(src, ".twc-switch__thumb {");
    expect(body).toMatch(/background:\s*var\(--color-control-thumb\)/);
    expect(body, "--_accent-fg here is the regression: it is near-black for 5 of 6 tones").not.toMatch(/--_accent-fg/);
  });

  it("the tone ink is applied only under :checked", () => {
    const checked = ".twc-switch__input:checked + .twc-switch__track .twc-switch__thumb";
    expect(src).toContain(checked);
    expect(ruleBody(src, checked)).toMatch(/background:\s*var\(--_accent-fg\)/);
  });

  it("the track uses --color-control-track, not --color-control-border", () => {
    const body = ruleBody(src, ".twc-switch__track {");
    expect(body).toMatch(/background:\s*var\(--color-control-track\)/);
    expect(body, "control-border drops the dark thumb to 2.56:1").not.toMatch(/--color-control-border/);
  });

  it("transitions the thumb's colour as well as its position", () => {
    // The colour now changes between states, so without this the moving thumb keeps the old colour
    // for most of the 220ms slide.
    expect(ruleBody(src, ".twc-switch__thumb {")).toMatch(/transition:[^;]*background-color/);
  });

  it("keeps the focus ring visible when the control is invalid", () => {
    // Both the invalid rule and :focus-visible set box-shadow; the invalid one is later, so without a
    // combined rule an invalid Switch has no focus indicator at all (SC 2.4.7).
    const combined = '.twc-switch[data-invalid="true"] .twc-switch__input:focus-visible + .twc-switch__track';
    expect(src).toContain(combined);
    const body = ruleBody(src, combined);
    expect(body).toMatch(/var\(--ring\)/);
    expect(body).toMatch(/--color-danger/);
  });
});

describe("Datatable's hand-rolled switch follows the same contract (#454)", () => {
  const src = read("components/data-display/Datatable.jsx");

  it("track and thumb use the control tokens", () => {
    expect(ruleBody(src, ".twc-dt__sw {")).toMatch(/background:\s*var\(--color-control-track\)/);
    expect(ruleBody(src, ".twc-dt__sw::after {")).toMatch(/background:\s*var\(--color-control-thumb\)/);
  });
});

describe("Checkbox and Radio keep the boundary token (#454)", () => {
  for (const [file, selector] of [
    ["components/inputs/Checkbox.jsx", ".twc-check__box {"],
    ["components/inputs/Radio.jsx", ".twc-radio__dot {"],
  ]) {
    it(`${file.split("/").pop()} uses --color-control-border for its unchecked boundary`, () => {
      const body = ruleBody(read(file), selector);
      expect(body).toMatch(/--color-control-border/);
      expect(body, "border-strong is 1.49:1 against the surface").not.toMatch(/--color-border-strong/);
    });
  }
});
