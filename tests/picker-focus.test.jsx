import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { DatePicker } from "../components/inputs/DatePicker.jsx";
import { DateRangePicker } from "../components/inputs/DateRangePicker.jsx";
import { ColorPicker } from "../components/inputs/ColorPicker.jsx";

// jsdom has no layout, so the pickers position via getBoundingClientRect (0s) but still
// set coords and render the portal. These verify #108: role=dialog + aria-modal + focus inside.
function openTrigger(container, sel) {
  const trigger = container.querySelector(sel);
  trigger.focus();
  fireEvent.click(trigger);
  return trigger;
}

describe("Picker focus traps (#108)", () => {
  it("DatePicker popover is a modal dialog with focus inside", () => {
    const { container } = render(<DatePicker label="Date" />);
    openTrigger(container, ".twc-dp__control");
    const dialog = document.querySelector(".twc-dp__pop");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("DateRangePicker popover is a modal dialog with focus inside", () => {
    const { container } = render(<DateRangePicker label="Range" />);
    openTrigger(container, ".twc-drp__control");
    const dialog = document.querySelector(".twc-drp__pop");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("ColorPicker popover is a modal dialog with focus inside", () => {
    const { container } = render(<ColorPicker label="Color" />);
    openTrigger(container, ".twc-cp__trigger");
    const dialog = document.querySelector(".twc-cp__pop");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});

describe("Date-grid keyboard navigation (#100/#109)", () => {
  it("DateRangePicker ArrowRight moves the roving tabbable day", () => {
    const { container } = render(<DateRangePicker label="Range" />);
    openTrigger(container, ".twc-drp__control");
    const grid = document.querySelector(".twc-drp__grid");
    const before = grid.querySelector('[tabindex="0"]').getAttribute("data-key");
    fireEvent.keyDown(grid.querySelector('[tabindex="0"]'), { key: "ArrowRight" });
    const after = document.querySelector(".twc-drp__grid").querySelector('[tabindex="0"]').getAttribute("data-key");
    expect(after).not.toBe(before);
  });

  it("DatePicker month grid ArrowRight moves the roving tabbable month", () => {
    const { container } = render(<DatePicker label="Date" />);
    openTrigger(container, ".twc-dp__control");
    // switch to the month grid
    fireEvent.click(document.querySelector(".twc-dp__title"));
    const grid = document.querySelector(".twc-dp__months");
    const before = grid.querySelector('[tabindex="0"]').getAttribute("data-mo");
    fireEvent.keyDown(grid.querySelector('[tabindex="0"]'), { key: "ArrowRight" });
    const after = document.querySelector(".twc-dp__months").querySelector('[tabindex="0"]').getAttribute("data-mo");
    expect(Number(after)).toBe((Number(before) + 1) % 12);
  });
});
