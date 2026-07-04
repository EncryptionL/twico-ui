import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { DatePicker } from "../components/inputs/DatePicker.jsx";
import { DateRangePicker } from "../components/inputs/DateRangePicker.jsx";

// #105: optional typed text entry. Off by default (no input rendered).
describe("DatePicker editable (#105)", () => {
  it("renders no text input unless editable", () => {
    const { container } = render(<DatePicker label="Date" />);
    expect(container.querySelector(".twc-dp__input")).toBeNull();
    expect(container.querySelector(".twc-dp__control")).toBeInTheDocument();
  });

  it("editable renders a typeable input + a calendar toggle button", () => {
    const { container } = render(<DatePicker editable label="Date" />);
    expect(container.querySelector(".twc-dp__input")).toBeInTheDocument();
    expect(container.querySelector('.twc-dp__toggle[aria-label="Open calendar"]')).toBeInTheDocument();
  });

  it("commits a valid typed date on Enter", () => {
    const onChange = vi.fn();
    const { container } = render(<DatePicker editable onChange={onChange} />);
    const input = container.querySelector(".twc-dp__input");
    fireEvent.change(input, { target: { value: "Jan 15, 2026" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(1);
    const d = onChange.mock.calls[0][0];
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(15);
  });

  it("uses a custom parse and reverts invalid input on blur", () => {
    const onChange = vi.fn();
    const parse = vi.fn((s) => (s === "today" ? new Date(2026, 5, 1) : null));
    const { container } = render(<DatePicker editable parse={parse} onChange={onChange} />);
    const input = container.querySelector(".twc-dp__input");
    fireEvent.change(input, { target: { value: "not a date" } });
    fireEvent.blur(input);
    expect(onChange).not.toHaveBeenCalled();
    expect(input.value).toBe(""); // reverted to formatted (no selection)

    fireEvent.change(input, { target: { value: "today" } });
    fireEvent.blur(input);
    expect(parse).toHaveBeenCalledWith("today");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("rejects an out-of-range typed date", () => {
    const onChange = vi.fn();
    const { container } = render(<DatePicker editable min={new Date(2026, 0, 10)} onChange={onChange} />);
    const input = container.querySelector(".twc-dp__input");
    fireEvent.change(input, { target: { value: "Jan 1, 2026" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("empty text clears the current value", () => {
    const onChange = vi.fn();
    const { container } = render(<DatePicker editable defaultValue={new Date(2026, 0, 5)} onChange={onChange} />);
    const input = container.querySelector(".twc-dp__input");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe("DateRangePicker editable (#105)", () => {
  it("editable renders a typeable input", () => {
    const { container } = render(<DateRangePicker editable label="Range" />);
    expect(container.querySelector(".twc-drp__input")).toBeInTheDocument();
  });

  it("commits a typed range split on the en-dash and normalizes start ≤ end", () => {
    const onChange = vi.fn();
    const { container } = render(<DateRangePicker editable onChange={onChange} />);
    const input = container.querySelector(".twc-drp__input");
    fireEvent.change(input, { target: { value: "Jan 20, 2026 – Jan 5, 2026" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(1);
    const { start, end } = onChange.mock.calls[0][0];
    expect(start.getDate()).toBe(5); // swapped so start is the earlier date
    expect(end.getDate()).toBe(20);
  });

  it("reverts an unparseable range", () => {
    const onChange = vi.fn();
    const { container } = render(<DateRangePicker editable onChange={onChange} />);
    const input = container.querySelector(".twc-drp__input");
    fireEvent.change(input, { target: { value: "garbage – junk" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });
});
