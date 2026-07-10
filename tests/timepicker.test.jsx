import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { TimePicker } from "../components/inputs/TimePicker.jsx";
import { DateTimePicker } from "../components/inputs/DateTimePicker.jsx";

// #223 — TimePicker: column-spinner time-of-day selection emitting a Date.
const openTp = (container) => fireEvent.click(container.querySelector(".twc-tp__control"));
const optIn = (col, text) => Array.from(document.querySelectorAll(`[data-col="${col}"] .twc-tp__opt`)).find((b) => b.textContent === text);

describe("TimePicker (#223)", () => {
  it("opens on click and renders hour + minute columns (24h, minute granularity)", () => {
    const { container } = render(<TimePicker />);
    openTp(container);
    expect(document.querySelector('[data-col="h"]')).toBeTruthy();
    expect(document.querySelector('[data-col="m"]')).toBeTruthy();
    expect(document.querySelector('[data-col="s"]')).toBeNull();
    expect(document.querySelector('[data-col="mer"]')).toBeNull();
    // 24 hour options, padded.
    expect(document.querySelectorAll('[data-col="h"] .twc-tp__opt').length).toBe(24);
    expect(optIn("h", "09")).toBeTruthy();
  });

  it("clicking hour then minute commits a Date with that time", () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker onChange={onChange} referenceDate={new Date(2024, 0, 1)} />);
    openTp(container);
    fireEvent.click(optIn("h", "14"));
    let d = onChange.mock.calls.at(-1)[0];
    expect([d.getHours(), d.getMinutes()]).toEqual([14, 0]);
    fireEvent.click(optIn("m", "30"));
    d = onChange.mock.calls.at(-1)[0];
    expect([d.getHours(), d.getMinutes()]).toEqual([14, 30]);
  });

  it("respects minuteStep for the minute column", () => {
    const { container } = render(<TimePicker minuteStep={15} />);
    openTp(container);
    const mins = Array.from(document.querySelectorAll('[data-col="m"] .twc-tp__opt')).map((b) => b.textContent);
    expect(mins).toEqual(["00", "15", "30", "45"]);
  });

  it("12-hour mode adds an AM/PM column and converts to 24h", () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker hourCycle={12} onChange={onChange} referenceDate={new Date(2024, 0, 1)} />);
    openTp(container);
    expect(document.querySelector('[data-col="mer"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-col="h"] .twc-tp__opt').length).toBe(12);
    fireEvent.click(optIn("h", "5"));    // 5 AM by default
    fireEvent.click(optIn("mer", "PM")); // -> 17:00
    const d = onChange.mock.calls.at(-1)[0];
    expect(d.getHours()).toBe(17);
  });

  it("granularity='second' adds a second column", () => {
    const { container } = render(<TimePicker granularity="second" secondStep={30} />);
    openTp(container);
    const secs = Array.from(document.querySelectorAll('[data-col="s"] .twc-tp__opt')).map((b) => b.textContent);
    expect(secs).toEqual(["00", "30"]);
  });

  it("min/max disable out-of-range hours", () => {
    const { container } = render(<TimePicker min={new Date(2024, 0, 1, 9, 0)} max={new Date(2024, 0, 1, 17, 0)} />);
    openTp(container);
    expect(optIn("h", "08")).toBeDisabled();
    expect(optIn("h", "18")).toBeDisabled();
    expect(optIn("h", "12")).not.toBeDisabled();
  });

  it("clears the value via the ✕", () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker value={new Date(2024, 0, 1, 8, 30)} onChange={onChange} />);
    fireEvent.click(container.querySelector(".twc-tp__clear"));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("editable parses typed 'HH:MM'", () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker editable onChange={onChange} referenceDate={new Date(2024, 0, 1)} />);
    const input = container.querySelector(".twc-tp__input");
    fireEvent.change(input, { target: { value: "07:45" } });
    fireEvent.keyDown(input, { key: "Enter" });
    const d = onChange.mock.calls.at(-1)[0];
    expect([d.getHours(), d.getMinutes()]).toEqual([7, 45]);
  });
});

describe("DateTimePicker (#223)", () => {
  it("renders a date control and a time control", () => {
    const { container } = render(<DateTimePicker />);
    expect(container.querySelector(".twc-dp__control")).toBeTruthy();
    expect(container.querySelector(".twc-tp__control")).toBeTruthy();
  });

  it("picking a time keeps the existing date", () => {
    const onChange = vi.fn();
    const { container } = render(<DateTimePicker value={new Date(2024, 5, 15, 0, 0)} onChange={onChange} />);
    fireEvent.click(container.querySelector(".twc-tp__control"));
    fireEvent.click(optIn("h", "10"));
    const d = onChange.mock.calls.at(-1)[0];
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2024, 5, 15, 10]);
  });

  it("picking a date keeps the existing time", () => {
    const onChange = vi.fn();
    const { container } = render(<DateTimePicker value={new Date(2024, 5, 15, 8, 30)} onChange={onChange} />);
    fireEvent.click(container.querySelector(".twc-dp__control"));
    const day = Array.from(document.querySelectorAll(".twc-dp__day")).find((b) => b.textContent === "20" && b.getAttribute("data-outside") == null);
    fireEvent.click(day);
    const d = onChange.mock.calls.at(-1)[0];
    expect([d.getDate(), d.getHours(), d.getMinutes()]).toEqual([20, 8, 30]);
  });
});
