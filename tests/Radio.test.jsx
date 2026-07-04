import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Radio } from "../components/inputs/Radio.jsx";

describe("Radio native required + name (#74/#76)", () => {
  it("warns once when unnamed", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Radio value="a" />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/accessible name/i);
    warn.mockRestore();
  });

  it("does not warn when labeled and sets native required", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Radio value="a" label="Option A" required />);
    expect(warn).not.toHaveBeenCalled();
    const r = screen.getByRole("radio");
    expect(r).toBeRequired();
    expect(r).toHaveAttribute("aria-required", "true");
    warn.mockRestore();
  });
});
