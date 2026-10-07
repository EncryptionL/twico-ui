import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #448 — the toolbar collapses to icon-only when the GRID is narrower than 720px (a ResizeObserver on
// clientWidth, not a media query), and the label span was removed with `display: none`. Since that span is
// each button's only text node, the accessible name went empty — or, where a badge renders, a bare number —
// an axe/Lighthouse `button-name` failure. The label is now visually hidden instead, so it stays in the
// a11y tree. jsdom reports clientWidth 0, so `data-compact` is already true here with no layout mocking.

const rows = [{ id: 1, name: "Ada", age: 36 }, { id: 2, name: "Ben", age: 41 }];
const columns = [{ field: "name" }, { field: "age", type: "number" }];

afterEach(() => cleanup());

describe("Datatable toolbar buttons keep an accessible name when collapsed (#448)", () => {
  it("is in the collapsed state under jsdom (precondition)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} />);
    expect(container.querySelector(".twc-dt__toolbar").getAttribute("data-compact")).toBe("true");
  });

  it("keeps the label in the a11y tree rather than removing it from the DOM", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} />);
    const label = container.querySelector('[data-tbtn="columns"] .twc-dt__tlabel');
    expect(label).toBeTruthy();
    expect(label.textContent).toBe("Columns"); // present, just clipped
    // the scoped CSS no longer drops it from the tree
    const css = Array.from(document.querySelectorAll("style")).map((s) => s.textContent).join("\n");
    const rule = css.match(/\.twc-dt__toolbar\[data-compact="true"\] \.twc-dt__tlabel \{[^}]*\}/)[0];
    expect(rule).not.toMatch(/display:\s*none/);
    expect(rule).toMatch(/clip:\s*rect\(0 0 0 0\)/);
  });

  it("Columns and Filters are reachable by accessible name", () => {
    render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} />);
    expect(screen.getByRole("button", { name: /Columns/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Filters/ })).toBeTruthy();
  });

  it("Density, Aggregation and Pivot are reachable by accessible name", () => {
    render(
      <Datatable rowKey={(r) => r.id} rows={rows} columns={columns} showDensity showAggregation showPivot />,
    );
    expect(screen.getByRole("button", { name: /Comfortable|Standard|Compact/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Aggregation/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Pivot/ })).toBeTruthy();
  });

  it("a badge does not reduce the name to a bare number", () => {
    render(
      <Datatable rowKey={(r) => r.id} rows={rows} columns={columns}
        initialState={{ columnVisibility: { age: false } }} />,
    );
    const btn = screen.getByRole("button", { name: /Columns/ });
    expect(btn.getAttribute("data-tbtn")).toBe("columns");
  });
});
