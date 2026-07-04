import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Grid } from "../components/layout/Grid.jsx";

describe("Grid gaps + distribution (#149)", () => {
  it("rowGap/columnGap, with gap fallback", () => {
    const { container, rerender } = render(<Grid rowGap={2} columnGap={6}><div /></Grid>);
    let el = container.querySelector(".twc-grid");
    expect(el.style.rowGap).toBe("var(--space-2)");
    expect(el.style.columnGap).toBe("var(--space-6)");
    rerender(<Grid gap={4}><div /></Grid>);
    el = container.querySelector(".twc-grid");
    expect(el.style.rowGap).toBe("var(--space-4)");
    expect(el.style.columnGap).toBe("var(--space-4)");
  });

  it("alignContent/justifyContent", () => {
    const { container } = render(<Grid alignContent="center" justifyContent="space-between"><div /></Grid>);
    const el = container.querySelector(".twc-grid");
    expect(el.style.alignContent).toBe("center");
    expect(el.style.justifyContent).toBe("space-between");
  });

  it("responsive columns emit scoped breakpoint CSS", () => {
    const { container } = render(<Grid columns={{ base: 1, md: 3 }}><div /></Grid>);
    const el = container.querySelector(".twc-grid");
    expect(el.getAttribute("data-twc-grid-id")).toBeTruthy();
    const css = [...document.querySelectorAll("style")].map((s) => s.textContent).join("\n");
    expect(css).toContain("768px");
    expect(css).toContain("--twc-grid-cols: 3");
  });
});
