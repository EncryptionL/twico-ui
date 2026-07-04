import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Currency } from "../components/inputs/Currency.jsx";

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
