import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "../components/feedback/Spinner.jsx";
import { EmptyState } from "../components/feedback/EmptyState.jsx";
import { Pagination } from "../components/data-display/Pagination.jsx";

// #170 — deprecated props warn once in development (vitest NODE_ENV === "test"),
// name the canonical replacement + the 2.0 removal, and dedupe. Each uses a distinct
// warnOnce key, so the three warn independently.
describe("deprecation warnings (#170)", () => {
  it("Spinner.color warns once (mentions tone + 2.0) and dedupes (#222)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(<Spinner color="danger" />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/tone/);
    expect(String(warn.mock.calls[0][0])).toMatch(/2\.0/);
    rerender(<Spinner color="danger" />);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("EmptyState.bordered warns and names `border`", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<EmptyState bordered />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/border/);
    warn.mockRestore();
  });

  it("Pagination.showJumper warns and names `showPageJumper`", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Pagination total={10} showJumper />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/showPageJumper/);
    warn.mockRestore();
  });

  it("the canonical props never warn", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Spinner tone="danger" />);
    render(<EmptyState border />);
    render(<Pagination total={10} showPageJumper />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
