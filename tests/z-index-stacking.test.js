import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(join(root, ...p), "utf8");
const tokens = read("tokens", "spacing.css");
const zval = (name) => Number(tokens.match(new RegExp(`--z-${name}:\\s*(\\d+)`))[1]);

// #288 — a Tooltip (hover-only hint) must not render above a Toast and cover its close button. The
// correct stack is tooltip < toast < interactive dropdowns (a toast must not cover an open dropdown
// either). jsdom can't compute cross-portal stacking, so the order + wiring are guarded at the source.
describe("z-index stacking order (#288)", () => {
  it("orders tooltip < toast < floating dropdowns", () => {
    expect(zval("tooltip")).toBeLessThan(zval("toast"));   // hint never covers a toast's controls
    expect(zval("toast")).toBeLessThan(zval("floating"));  // toast never covers an active dropdown
  });

  it("Tooltip uses --z-tooltip, Toast uses --z-toast, dropdowns use --z-floating", () => {
    expect(read("components", "overlay", "Tooltip.jsx")).toContain("z-index: var(--z-tooltip)");
    expect(read("components", "feedback", "Toast.jsx")).toContain("z-index: var(--z-toast)");
    // portaled listboxes/pickers moved off the shared --z-tooltip onto the above-toast --z-floating
    for (const f of ["Select", "Combobox", "MultiSelect", "DatePicker", "TimePicker", "ColorPicker", "DateRangePicker"]) {
      const src = read("components", "inputs", `${f}.jsx`);
      expect(src, `${f} portal z-index`).toContain('zIndex: "var(--z-floating)"');
      expect(src, `${f} should no longer use --z-tooltip`).not.toContain('zIndex: "var(--z-tooltip)"');
    }
  });
});
