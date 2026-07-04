import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencyField } from "../components/inputs/CurrencyField.jsx";

describe("CurrencyField onValueChange never emits NaN (#63)", () => {
  it("emits null for a transient '-' and the currency code as the third arg", () => {
    const onValueChange = vi.fn();
    const { container } = render(<CurrencyField onValueChange={onValueChange} />);
    fireEvent.change(container.querySelector(".twc-cur__el"), { target: { value: "-" } });
    expect(onValueChange).toHaveBeenLastCalledWith(null, "-", "USD");
    expect(onValueChange.mock.calls.some((c) => Number.isNaN(c[0]))).toBe(false);
  });
});

describe("CurrencyField currency-prop change reconciliation (#64/#65)", () => {
  it("uncontrolled value re-clamps + notifies when the controlled currency prop flips USD→JPY", () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(
      <CurrencyField currency="USD" defaultValue="1000.50" onValueChange={onValueChange} />
    );
    const input = container.querySelector(".twc-cur__el");
    expect(input.value).toBe("1000.50");
    onValueChange.mockClear();
    rerender(<CurrencyField currency="JPY" defaultValue="1000.50" onValueChange={onValueChange} />);
    expect(input.value).toBe("1000"); // JPY has 0 decimals
    expect(onValueChange).toHaveBeenCalledWith(1000, "1000", "JPY");
  });

  it("does not fire when the currency changes but precision is unchanged (USD→EUR)", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<CurrencyField currency="USD" defaultValue="10.50" onValueChange={onValueChange} />);
    onValueChange.mockClear();
    rerender(<CurrencyField currency="EUR" defaultValue="10.50" onValueChange={onValueChange} />);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not fire onValueChange on mount", () => {
    const onValueChange = vi.fn();
    render(<CurrencyField currency="USD" defaultValue="10.50" onValueChange={onValueChange} />);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("CurrencyField embedded picker accessible name (#73)", () => {
  it("names the currency picker after the field label", () => {
    render(<CurrencyField label="Price" />);
    // The Select trigger is a <button aria-haspopup="listbox"> named by aria-label.
    expect(screen.getByRole("button", { name: "Price currency" })).toBeInTheDocument();
  });
  it("falls back to 'Currency' with no label", () => {
    render(<CurrencyField />);
    expect(screen.getByRole("button", { name: "Currency" })).toBeInTheDocument();
  });
});

describe("CurrencyField readOnly visual state (#67)", () => {
  it("marks the wrapper data-readonly", () => {
    const { container } = render(<CurrencyField readOnly value="5" onValueChange={() => {}} />);
    expect(container.querySelector(".twc-cur")).toHaveAttribute("data-readonly", "true");
  });
});
