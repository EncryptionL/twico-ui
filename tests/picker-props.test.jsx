import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { DatePicker } from "../components/inputs/DatePicker.jsx";
import { DateRangePicker } from "../components/inputs/DateRangePicker.jsx";
import { Slider } from "../components/inputs/Slider.jsx";
import { ColorPicker } from "../components/inputs/ColorPicker.jsx";
import { FileUpload } from "../components/inputs/FileUpload.jsx";

// #201 / #220 — `size` maps to data-size on the control (jsdom has no layout, so assert the attr).
describe("control size prop (#201, #220)", () => {
  const cases = [
    ["DatePicker", <DatePicker size="sm" />, ".twc-dp__control", "sm"],
    ["DateRangePicker", <DateRangePicker size="lg" />, ".twc-drp__control", "lg"],
    ["Slider", <Slider size="sm" />, ".twc-slider", "sm"],
    ["ColorPicker", <ColorPicker size="lg" />, ".twc-cp__trigger", "lg"],
    ["FileUpload", <FileUpload size="sm" />, ".twc-upload", "sm"],
  ];
  it.each(cases)("%s reflects size on data-size", (_n, node, sel, val) => {
    const { container } = render(node);
    expect(container.querySelector(sel)).toHaveAttribute("data-size", val);
  });
  it("defaults to md when size is omitted", () => {
    const { container } = render(<DatePicker />);
    expect(container.querySelector(".twc-dp__control")).toHaveAttribute("data-size", "md");
  });
});

// #200 — DateRangePicker gains DatePicker's clearable ✕.
describe("DateRangePicker clearable (#200)", () => {
  it("shows a clear button that resets both endpoints", () => {
    const onChange = vi.fn();
    const { container } = render(
      <DateRangePicker value={{ start: new Date(2024, 0, 1), end: new Date(2024, 0, 7) }} onChange={onChange} />,
    );
    const clear = container.querySelector(".twc-drp__clear");
    expect(clear).not.toBeNull();
    fireEvent.click(clear);
    expect(onChange).toHaveBeenCalledWith({ start: null, end: null });
  });
  it("renders no clear button when empty or clearable={false}", () => {
    const { container: empty } = render(<DateRangePicker />);
    expect(empty.querySelector(".twc-drp__clear")).toBeNull();
    const { container: off } = render(
      <DateRangePicker clearable={false} value={{ start: new Date(2024, 0, 1), end: null }} />,
    );
    expect(off.querySelector(".twc-drp__clear")).toBeNull();
  });
});

// #211 — DateRangePicker gains DatePicker's `format` display formatter.
describe("DateRangePicker format (#211)", () => {
  it("uses the custom formatter for the trigger text", () => {
    const { container } = render(
      <DateRangePicker
        value={{ start: new Date(2024, 5, 1), end: new Date(2024, 5, 7) }}
        format={(r) => `${r.start.getMonth() + 1}/${r.start.getDate()}–${r.end.getDate()}`}
      />,
    );
    expect(container.querySelector(".twc-drp__text")).toHaveTextContent("6/1–7");
  });
});

// #210 — DatePicker gains DateRangePicker's `disabledDate` predicate.
describe("DatePicker disabledDate (#210)", () => {
  it("disables the days for which the predicate returns true", () => {
    const { container } = render(
      <DatePicker defaultValue={new Date(2024, 0, 15)} disabledDate={(d) => d.getDate() === 20} />,
    );
    fireEvent.click(container.querySelector(".twc-dp__control")); // open the calendar
    const days = Array.from(document.querySelectorAll(".twc-dp__day"));
    expect(days.length).toBeGreaterThan(0);
    const day = (n) => days.find((b) => b.textContent.trim() === n);
    expect(day("20")).toBeDisabled();
    expect(day("15")).not.toBeDisabled();
  });
});
