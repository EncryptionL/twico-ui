import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { MultiSelect } from "../components/inputs/MultiSelect.jsx";
import { DateRangePicker } from "../components/inputs/DateRangePicker.jsx";

const opts = [{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }, { value: "c", label: "Cherry" }];
const openMs = (container) => {
  const input = container.querySelector("input");
  fireEvent.focus(input);
  return input;
};

// #208 — MultiSelect gains Combobox's async surface (onInputChange + filter).
describe("MultiSelect async loading (#208)", () => {
  it("fires onInputChange with the raw typed query", () => {
    const onInputChange = vi.fn();
    const { container } = render(<MultiSelect options={opts} onInputChange={onInputChange} />);
    fireEvent.change(openMs(container), { target: { value: "ap" } });
    expect(onInputChange).toHaveBeenCalledWith("ap");
  });
  it("filter={false} shows options unfiltered (server-ranked passthrough)", () => {
    const { container } = render(<MultiSelect options={opts} filter={false} />);
    fireEvent.change(openMs(container), { target: { value: "zzz" } }); // matches nothing locally
    expect(document.querySelectorAll('[role="option"]').length).toBe(3);
  });
  it("default (no filter prop) filters locally via the built-in matcher", () => {
    const { container } = render(<MultiSelect options={opts} />);
    fireEvent.change(openMs(container), { target: { value: "ap" } });
    const labels = Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent);
    expect(labels.some((t) => t.includes("Apple"))).toBe(true);
    expect(labels.some((t) => t.includes("Banana"))).toBe(false);
  });
});

// #212 — DateRangePicker custom presets.
describe("DateRangePicker custom presets (#212)", () => {
  it("renders a custom preset and applies it on click (function form resolved at click)", () => {
    const onChange = vi.fn();
    const range = { start: new Date(2024, 0, 1), end: new Date(2024, 0, 31) };
    const { container } = render(
      <DateRangePicker onChange={onChange} presets={[{ label: "January", range: () => range }]} />,
    );
    fireEvent.click(container.querySelector(".twc-drp__control"));
    const preset = Array.from(document.querySelectorAll(".twc-drp__preset")).find((b) => b.textContent === "January");
    expect(preset).toBeTruthy();
    fireEvent.click(preset);
    expect(onChange).toHaveBeenCalledWith(range);
  });
  it("presets={false} hides the preset column", () => {
    const { container } = render(<DateRangePicker presets={false} />);
    fireEvent.click(container.querySelector(".twc-drp__control"));
    expect(document.querySelector(".twc-drp__presets")).toBeNull();
  });
  it("defaults to the built-in rolling-day presets", () => {
    const { container } = render(<DateRangePicker />);
    fireEvent.click(container.querySelector(".twc-drp__control"));
    const labels = Array.from(document.querySelectorAll(".twc-drp__preset")).map((b) => b.textContent);
    expect(labels).toContain("Last 7 days");
  });
});
