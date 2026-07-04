import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "../components/data-display/Pagination.jsx";

describe("Pagination numbered-button labels (#129)", () => {
  it("labels each numbered page button as 'Page N' and marks the current one", () => {
    render(<Pagination total={10} page={3} />);
    const current = screen.getByRole("button", { name: "Page 3" });
    expect(current).toHaveAttribute("aria-current", "page");
    const other = screen.getByRole("button", { name: "Page 2" });
    expect(other).not.toHaveAttribute("aria-current");
  });

  it("getPageLabel overrides the announced name", () => {
    render(<Pagination total={5} page={1} getPageLabel={(n) => `Halaman ${n}`} />);
    expect(screen.getByRole("button", { name: "Halaman 2" })).toBeInTheDocument();
  });
});
