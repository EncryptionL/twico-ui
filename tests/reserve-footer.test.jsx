import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Input, Select, Textarea, Field, Combobox, MultiSelect, RadioGroup, Currency,
         CurrencyField, ColorPicker, DatePicker, DateRangePicker, DateTimePicker, TimePicker } from "../src/index.ts";

// #494 — a row of fields aligned with align="flex-end" splits onto two lines the moment ONE of them
// has a hint: that field grows a `.twc-field__footer` (or a bare hint/error span) and the others do
// not, so the caption ends up moving a DIFFERENT control. `align` cannot fix it — `flex-start` lines
// up the labels instead, so the controls part company as soon as one label wraps.
//
// jsdom does not lay out, so heights are checked in the browser (site/scripts, and the probe run
// against the docs site). What is checked here: the attribute reaches the field root, every field
// component accepts the prop, and the CSS rule that does the work is present and correctly escaped.

afterEach(cleanup);

const opts = [{ label: "A", value: "a" }];
const FIELDS = {
  Input: [Input, { label: "L" }],
  Textarea: [Textarea, { label: "L" }],
  Select: [Select, { label: "L", options: opts }],
  Combobox: [Combobox, { label: "L", options: opts }],
  MultiSelect: [MultiSelect, { label: "L", options: opts }],
  Field: [Field, { label: "L", children: <input /> }],
  Currency: [Currency, { label: "L" }],
  CurrencyField: [CurrencyField, { label: "L" }],
  RadioGroup: [RadioGroup, { label: "L", options: opts }],
  ColorPicker: [ColorPicker, { label: "L" }],
  DatePicker: [DatePicker, { label: "L" }],
  DateRangePicker: [DateRangePicker, { label: "L" }],
  DateTimePicker: [DateTimePicker, { label: "L" }],
  TimePicker: [TimePicker, { label: "L" }],
};

describe("reserveFooter (#494)", () => {
  for (const [name, [C, props]] of Object.entries(FIELDS)) {
    it(`${name} puts data-reserve-footer on the field root when asked`, () => {
      const { container } = render(React.createElement(C, { ...props, reserveFooter: true }));
      const root = container.querySelector(".twc-field");
      expect(root, `${name} should render a .twc-field root`).not.toBe(null);
      expect(root.getAttribute("data-reserve-footer")).toBe("true");
    });

    it(`${name} omits the attribute by default, so nothing changes for existing callers`, () => {
      const { container } = render(React.createElement(C, props));
      const root = container.querySelector(".twc-field");
      expect(root.hasAttribute("data-reserve-footer")).toBe(false);
    });
  }

  it("does not leak the prop onto the DOM as an unknown attribute", () => {
    // The input family spreads {...rest} onto the inner CONTROL (#471), so a prop that was not
    // destructured would land there and React would warn.
    const { container } = render(<Input label="L" reserveFooter />);
    expect(container.querySelector("input.twc-input__el").hasAttribute("reservefooter")).toBe(false);
  });
});

describe("the CSS that does the work", () => {
  const files = readdirSync(join(process.cwd(), "components", "inputs")).filter((f) => f.endsWith(".jsx"));

  it("every scoped sheet that styles .twc-field also carries the reserve rule", () => {
    // Each component injects its own copy of the field CSS, so the rule has to travel with it:
    // a page that renders only a Select must still get it.
    const missing = [];
    for (const f of files) {
      const src = readFileSync(join(process.cwd(), "components", "inputs", f), "utf8");
      if (!src.includes(".twc-field { display: flex;")) continue;
      if (!src.includes("data-reserve-footer")) missing.push(f);
    }
    expect(missing, "these style .twc-field but never reserve the lane").toEqual([]);
  });

  it("reserves only when there is no footer already, via :has()", () => {
    const src = readFileSync(join(process.cwd(), "components", "inputs", "Input.jsx"), "utf8");
    expect(src).toContain(
      ".twc-field[data-reserve-footer]:not(:has(> .twc-field__footer, > .twc-field__hint, > .twc-field__error))::after"
    );
    // ...and the ancestor form, which is what makes it settable once per row
    expect(src).toContain(
      "[data-reserve-footer] .twc-field:not(:has(> .twc-field__footer, > .twc-field__hint, > .twc-field__error))::after"
    );
  });

  it("the nbsp escape survives the template literal instead of becoming a NUL", () => {
    // Written \\00a0 in the source so the literal yields the CSS escape \00a0. Writing \00a0
    // directly is a legacy octal escape — esbuild rejects it outright — and \0 alone would embed a
    // real NUL byte, which has made a file in this repo unreadable as text before.
    const BS = String.fromCharCode(92);
    for (const f of files) {
      const src = readFileSync(join(process.cwd(), "components", "inputs", f), "utf8");
      // only the sheets that actually DEFINE the rule — CurrencyField carries the attribute but
      // styles no .twc-field of its own (see the test below).
      if (!src.includes(".twc-field { display: flex;")) continue;
      expect(src, `${f} lost the doubled backslash`).toContain(`content: "${BS}${BS}00a0"`);
      expect(src.includes("\u0000"), `${f} contains a raw NUL byte`).toBe(false);
    }
  });

  it("CurrencyField gets the rule from the Select it always renders", () => {
    // It sets data-reserve-footer on its own .twc-field root but defines no .twc-field CSS, so the
    // rule reaches it only because a Select is always mounted inside and injects the field sheet.
    // That is already how CurrencyField gets every other .twc-field style, but it is load-bearing
    // for this one too — if the Select ever became conditional the lane would silently stop
    // reserving, with nothing else failing.
    const src = readFileSync(join(process.cwd(), "components", "inputs", "CurrencyField.jsx"), "utf8");
    expect(src).toContain("data-reserve-footer");
    expect(src, "CurrencyField defines no field CSS of its own").not.toContain(".twc-field { display: flex;");
    expect(src, "...so it must keep rendering a Select unconditionally").toMatch(/^\s*<Select /m);
  });

  it("the built bundles carry it too", () => {
    const BS = String.fromCharCode(92);
    for (const dist of ["dist/index.mjs", "dist/index.cjs"]) {
      let built;
      try { built = readFileSync(join(process.cwd(), dist), "utf8"); } catch { continue; }
      expect(built, `${dist} is missing the reserve rule`).toContain("data-reserve-footer");
      expect(built, `${dist} lost the escape`).toContain(`content: "${BS}${BS}00a0"`);
      expect(built.includes("\u0000"), `${dist} contains a raw NUL byte`).toBe(false);
    }
  });
});
