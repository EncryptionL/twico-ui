import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, screen, act } from "@testing-library/react";
import { Select } from "../components/inputs/Select.jsx";

const INPUTS = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "inputs");
const options = [{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }];

// A portaled dropdown measures its trigger once and only re-placed on window scroll/resize — so when the
// TRIGGER itself resizes (a resized Datatable filter field #292, or a table column during a cell edit) the
// menu width/position went stale. Fixed by a ResizeObserver on the trigger in every portaled dropdown.
describe("Portaled dropdown tracks trigger resize", () => {
  it("every portaled dropdown observes its trigger and disconnects (source)", () => {
    for (const f of ["Select", "MultiSelect", "Combobox", "ColorPicker", "DatePicker", "DateRangePicker", "TimePicker"]) {
      const src = readFileSync(join(INPUTS, `${f}.jsx`), "utf8");
      expect(src, `${f} observes its trigger`).toContain("new ResizeObserver(onMove); ro.observe(rt)");
      expect(src, `${f} disconnects the observer`).toContain("ro?.disconnect()");
    }
  });

  describe("Select menu re-tracks a resized trigger", () => {
    let origRect, origRO, roCb, triggerW;
    beforeEach(() => {
      triggerW = 150;
      origRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 130, left: 50, right: 50 + triggerW, width: triggerW, height: 30, x: 50, y: 100, toJSON() {} });
      origRO = global.ResizeObserver;
      global.ResizeObserver = class { constructor(cb) { roCb = cb; } observe() {} disconnect() {} };
    });
    afterEach(() => { Element.prototype.getBoundingClientRect = origRect; global.ResizeObserver = origRO; });

    it("re-measures the portaled menu width when the trigger resizes while open", () => {
      render(<Select options={options} searchable={false} />); // portal + matchTriggerWidth default on
      const trigger = screen.getByRole("button");
      act(() => trigger.focus());
      act(() => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
      expect(document.querySelector(".twc-pop").style.width).toBe("150px"); // matched the trigger

      triggerW = 300; // widen the trigger, then fire the observer (no window event would)
      act(() => roCb([]));
      expect(document.querySelector(".twc-pop").style.width).toBe("300px"); // menu re-tracked it
    });
  });
});
