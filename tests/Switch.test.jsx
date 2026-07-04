import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Switch } from "../components/inputs/Switch.jsx";

describe("Switch native required + name (#74/#76)", () => {
  it("warns once when unnamed", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Switch />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/accessible name/i);
    warn.mockRestore();
  });

  it("does not warn when labeled and sets native required", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Switch label="Notifications" required />);
    expect(warn).not.toHaveBeenCalled();
    const s = screen.getByRole("switch");
    expect(s).toBeRequired();
    expect(s).toHaveAttribute("aria-required", "true");
    warn.mockRestore();
  });
});
