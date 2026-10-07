import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// #453 — four places de-emphasised ENABLED, interactive content with `opacity`, which multiplies the
// contrast of whatever is painted and pushed these well under the WCAG floors:
//
//   DatePicker outside day      opacity 0.5  -> 1.97:1  (clickable: it jumps to the adjacent month)
//   DateRangePicker outside day opacity 0.45 -> 1.83:1  (same)
//   Alert close button          opacity 0.6  -> 2.14:1  (an enabled button; SC 1.4.11 wants 3:1)
//   Alert solid description     opacity 0.92 -> 3.31:1  (body text; SC 1.4.3 wants 4.5:1)
//   Chart legend, toggled off   opacity 0.4  -> 1.93:1  (an enabled role="button" with tabIndex 0)
//
// Only genuinely :disabled content is exempt (WCAG explicitly excludes inactive controls), so this file
// asserts the opacity is gone from the enabled rules and still present on the disabled ones.

const read = (p) => readFileSync(resolve(process.cwd(), p), "utf8");

/** Body of the first declaration block whose selector list contains `selector`. */
function ruleBody(src, selector) {
  const i = src.indexOf(selector);
  if (i < 0) throw new Error(`selector not found: ${selector}`);
  const open = src.indexOf("{", i);
  const close = src.indexOf("}", open);
  return src.slice(open + 1, close);
}

const CASES = [
  ["components/inputs/DatePicker.jsx", '.twc-dp__day[data-outside="true"]', ".twc-dp__day:disabled"],
  ["components/inputs/DateRangePicker.jsx", '.twc-drp__day[data-outside="true"]', ".twc-drp__day:disabled"],
  ["components/data-display/_chart.js", '.twc-chart__leg[data-off="true"] {', null],
];

describe("enabled content is not de-emphasised with opacity (#453)", () => {
  for (const [file, enabled, disabled] of CASES) {
    const src = read(file);
    it(`${enabled} in ${file} sets no opacity`, () => {
      expect(ruleBody(src, enabled)).not.toMatch(/opacity/);
    });
    if (disabled) {
      it(`${disabled} in ${file} keeps its opacity (disabled content IS exempt)`, () => {
        expect(ruleBody(src, disabled)).toMatch(/opacity/);
      });
    }
  }

  it("the Alert close button is painted at full strength", () => {
    const src = read("components/feedback/Alert.jsx");
    expect(ruleBody(src, ".twc-alert__close {")).not.toMatch(/opacity/);
    // the hover affordance must come from the background tint, not from an opacity ramp
    expect(ruleBody(src, ".twc-alert__close:hover")).toMatch(/background/);
    expect(ruleBody(src, ".twc-alert__close:hover")).not.toMatch(/opacity/);
  });

  it("the solid Alert description is painted at full strength", () => {
    const src = read("components/feedback/Alert.jsx");
    expect(ruleBody(src, '.twc-alert[data-variant="solid"] .twc-alert__desc')).not.toMatch(/opacity/);
  });

  it("a toggled-off chart legend says so without relying on colour alone (SC 1.4.1)", () => {
    const body = ruleBody(read("components/data-display/_chart.js"), '.twc-chart__leg[data-off="true"] {');
    expect(body).toMatch(/line-through/);
  });
});
