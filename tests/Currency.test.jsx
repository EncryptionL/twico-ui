import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Currency } from "../components/inputs/Currency.jsx";
import { Input } from "../components/inputs/Input.jsx";
import { Textarea } from "../components/inputs/Textarea.jsx";

describe("Currency onChange vs onValueChange (#172)", () => {
  it("onValueChange gets the parsed number; onChange gets a string event", () => {
    const onValueChange = vi.fn();
    let rawAtChange;
    const onChange = vi.fn((e) => { rawAtChange = e.target.value; });
    const { container } = render(<Currency currency="USD" onChange={onChange} onValueChange={onValueChange} />);
    fireEvent.change(container.querySelector("input"), { target: { value: "12.599" } });
    // onValueChange: the parsed number, clamped to the currency precision (USD = 2 dp)
    expect(onValueChange.mock.calls.at(-1)[0]).toBe(12.59);
    // onChange: a string event value read synchronously in the handler (the raw input)
    expect(typeof rawAtChange).toBe("string");
    expect(rawAtChange).toBe("12.599");
  });
});

describe("Currency onValueChange never emits NaN (#63)", () => {
  it("emits null for a transient '-' / '-.' then the number for '-5'", () => {
    const onValueChange = vi.fn();
    const { container } = render(<Currency onValueChange={onValueChange} />);
    const input = container.querySelector(".twc-cur__el");
    fireEvent.change(input, { target: { value: "-" } });
    expect(onValueChange).toHaveBeenLastCalledWith(null, "-");
    fireEvent.change(input, { target: { value: "-." } });
    expect(onValueChange).toHaveBeenLastCalledWith(null, "-.");
    fireEvent.change(input, { target: { value: "-5" } });
    expect(onValueChange).toHaveBeenLastCalledWith(-5, "-5");
    // never NaN
    expect(onValueChange.mock.calls.some((c) => Number.isNaN(c[0]))).toBe(false);
  });
});

describe("Currency render-clamp reconciliation (#65)", () => {
  it("fires onValueChange once when a controlled precision change re-clamps the display", () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(<Currency value="12.345" precision={3} onValueChange={onValueChange} />);
    expect(container.querySelector(".twc-cur__el").value).toBe("12.345");
    onValueChange.mockClear();
    rerender(<Currency value="12.345" precision={2} onValueChange={onValueChange} />);
    expect(container.querySelector(".twc-cur__el").value).toBe("12.34");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(12.34, "12.34");
  });

  it("does not fire when the clamp is a no-op", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Currency value="12.34" precision={2} onValueChange={onValueChange} />);
    rerender(<Currency value="12.34" precision={2} onValueChange={onValueChange} />);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("readOnly visual state (#67)", () => {
  it("Currency marks the wrapper data-readonly and keeps the native readonly attr", () => {
    const { container } = render(<Currency readOnly value="5" onValueChange={() => {}} />);
    expect(container.querySelector(".twc-cur")).toHaveAttribute("data-readonly", "true");
    expect(container.querySelector(".twc-cur__el")).toHaveAttribute("readonly");
  });
  it("Input marks the wrapper data-readonly", () => {
    const { container } = render(<Input readOnly value="x" onChange={() => {}} />);
    expect(container.querySelector(".twc-input")).toHaveAttribute("data-readonly", "true");
  });
  it("Textarea marks the element data-readonly", () => {
    const { container } = render(<Textarea readOnly value="x" onChange={() => {}} />);
    expect(container.querySelector(".twc-textarea__el")).toHaveAttribute("data-readonly", "true");
  });
  it("no data-readonly when readOnly is absent", () => {
    const { container } = render(<Currency value="5" onValueChange={() => {}} />);
    expect(container.querySelector(".twc-cur")).not.toHaveAttribute("data-readonly");
  });
});
