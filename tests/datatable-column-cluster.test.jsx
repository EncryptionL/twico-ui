import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// Covers the 1.39 column-cluster fixes: #397 align, #399 row-action links + disabledReason,
// #400 renderHeader type + non-sortable cursor, #403 defaultColumn, #404 duplicate-field warn, #408 anchor.
const rows = [
  { id: 1, name: "Alpha", qty: 4 },
  { id: 2, name: "Bravo", qty: 7 },
];
// jsdom has no layout; a real rect lets popovers/panels position + open (mirrors the sibling tests).
const RECT = { top: 80, left: 80, right: 260, bottom: 120, width: 180, height: 40, x: 80, y: 80, toJSON() {} };
let origRect;
beforeEach(() => { origRect = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
afterEach(() => { Element.prototype.getBoundingClientRect = origRect; cleanup(); vi.restoreAllMocks(); });

describe("Datatable column align (#397)", () => {
  it("emits data-align only when it OVERRIDES the type default (headerAlign overrides the header)", () => {
    const columns = [
      { field: "name", align: "center", headerAlign: "right" }, // string default left → both override
      { field: "qty", type: "number", align: "left", aggregation: "sum" }, // number default right → left overrides
      { field: "note" }, // string default left → NO override, no data-align
    ];
    const { container } = render(<Datatable columns={columns} rows={rows.map((r) => ({ ...r, note: "n" }))} rowKey={(r) => r.id} showAggregation />);
    const th = Array.from(container.querySelectorAll("thead th"));
    const nameTh = th.find((t) => t.textContent.toLowerCase().includes("name"));
    expect(nameTh.getAttribute("data-align")).toBe("right"); // headerAlign wins for the header
    expect(container.querySelector('tbody td[data-align="center"]')).toBeTruthy(); // name body cell (center override)
    // number column forced to left → data-align="left" emitted (overrides the right default)
    expect(Array.from(container.querySelectorAll("tbody td")).some((td) => td.getAttribute("data-align") === "left")).toBe(true);
    expect(container.querySelector('tfoot td[data-align="left"]')).toBeTruthy(); // qty footer override
    // a plain string column at its default emits NO data-align (no attribute churn / no default regression)
    const noteTh = th.find((t) => t.textContent.toLowerCase().includes("note"));
    expect(noteTh.getAttribute("data-align")).toBeNull();
  });
});

describe("Datatable row-action links + disabledReason (#399)", () => {
  const actionsCol = (getActions) => [{ field: "name" }, { field: "acts", type: "actions", getActions }];

  it("renders an href action as a scheme-sanitised <a>; a disabled action never emits href", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={actionsCol((row) => [
        { icon: <i>o</i>, label: "Open", href: "/rows/" + row.id },
        { icon: <i>x</i>, label: "Bad", href: "javascript:alert(1)" },
        { icon: <i>d</i>, label: "Del", href: "/del", disabled: true, disabledReason: "In use" },
      ])} />);
    const links = Array.from(container.querySelectorAll("a.twc-dt__act"));
    const open = links.find((a) => a.getAttribute("aria-label") === "Open");
    expect(open.getAttribute("href")).toBe("/rows/1");
    // javascript: is stripped → falls back to a plain button (no href anchor)
    expect(links.find((a) => a.getAttribute("aria-label") === "Bad")).toBeUndefined();
    // disabled action is a button, not a link
    const del = container.querySelector('button.twc-dt__act[aria-label="Del"]');
    expect(del).toBeTruthy();
    expect(del.tagName).toBe("BUTTON");
  });

  it("a plain left-click on a link action still runs onClick", () => {
    const onClick = vi.fn();
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={actionsCol(() => [{ icon: <i>o</i>, label: "Open", href: "/x", onClick }])} />);
    const a = container.querySelector('a.twc-dt__act[aria-label="Open"]');
    fireEvent.click(a, { button: 0 });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows the disabledReason as an inline hint in the ⋮ overflow menu", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={actionsCol(() => [{ icon: <i>d</i>, label: "Delete", disabled: true, disabledReason: "Still in use", showInMenu: true }])} />);
    fireEvent.click(container.querySelector('.twc-dt__act[aria-label="More actions"]'));
    const hint = document.querySelector(".twc-dt__mi-hint");
    expect(hint).toBeTruthy();
    expect(hint.textContent).toBe("Still in use");
  });
});

describe("Datatable renderHeader neutral type + cursor (#400)", () => {
  it("wraps the default headerName in .twc-dt__th-text but leaves renderHeader neutral", () => {
    const columns = [
      { field: "name", headerName: "Name" },
      { field: "qty", headerName: "Qty", renderHeader: () => <span data-testid="rh">Last updated</span> },
    ];
    const { container, getByTestId } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    // default header text is inside the styled span
    const styled = container.querySelector(".twc-dt__th-text");
    expect(styled).toBeTruthy();
    expect(styled.textContent).toBe("Name");
    // renderHeader content is NOT wrapped in the upper-casing span
    const rh = getByTestId("rh");
    expect(rh.closest(".twc-dt__th-text")).toBeNull();
  });

  it("CSS scopes the pointer cursor to sortable headers and upper-cases only .twc-dt__th-text", () => {
    render(<Datatable columns={[{ field: "name" }]} rows={rows} rowKey={(r) => r.id} />);
    // useScopedStyles hoists the <style> to <head> on React 19, so read document-wide.
    const css = Array.from(document.querySelectorAll("style")).map((s) => s.textContent).join("\n");
    expect(css).toMatch(/\.twc-dt__th-text\s*\{[^}]*text-transform:\s*uppercase/);
    expect(css).toMatch(/\.twc-dt__th-label\[role="button"\]\s*\{[^}]*cursor:\s*pointer/);
  });
});

describe("Datatable defaultColumn (#403)", () => {
  it("applies table-level defaults, and a per-column value wins", () => {
    const columns = [
      { field: "name" }, // inherits defaultColumn
      { field: "qty", sortable: true }, // overrides
    ];
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id}
      defaultColumn={{ sortable: false, disableColumnMenu: true }} />);
    const th = Array.from(container.querySelectorAll("thead th"));
    const nameTh = th.find((t) => t.textContent.toLowerCase().includes("name"));
    const qtyTh = th.find((t) => t.textContent.toLowerCase().includes("qty"));
    // name inherited sortable:false → no sort role/aria-sort; qty overrode → sortable
    expect(nameTh.querySelector('.twc-dt__th-label[role="button"]')).toBeNull();
    expect(qtyTh.querySelector('.twc-dt__th-label[role="button"]')).toBeTruthy();
    // disableColumnMenu default hides the ⋮ button on the inherited column
    expect(nameTh.querySelector(".twc-dt__menu-btn")).toBeNull();
  });
});

describe("Datatable duplicate-field dev warning (#404)", () => {
  it("warns once naming both headers when two columns share a field; a unique table is silent", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name", headerName: "First" }, { field: "name", headerName: "Second" }]} />);
    const dup = warn.mock.calls.map((c) => String(c[0])).filter((m) => m.includes("duplicate column field"));
    expect(dup.length).toBe(1);
    expect(dup[0]).toContain('"name"');
    expect(dup[0]).toContain("First");
    expect(dup[0]).toContain("Second");
    warn.mockClear();
    render(<Datatable rowKey={(r) => r.id} rows={rows} columns={[{ field: "name" }, { field: "qty" }]} />);
    expect(warn.mock.calls.filter((c) => String(c[0]).includes("duplicate column field")).length).toBe(0);
  });
});

describe("Datatable column-menu Filter anchor (#408)", () => {
  it("opens this table's own filter panel without throwing when two grids share a page", () => {
    const { container } = render(<div>
      <Datatable rowKey={(r) => r.id} rows={rows} columns={[{ field: "name" }, { field: "qty", type: "number" }]} />
      <Datatable rowKey={(r) => r.id} rows={rows} columns={[{ field: "name" }, { field: "qty", type: "number" }]} />
    </div>);
    const tables = container.querySelectorAll(".twc-dt");
    expect(tables.length).toBe(2);
    const second = tables[1];
    // open the second table's first-column ⋮ menu
    fireEvent.click(second.querySelectorAll(".twc-dt__menu-btn")[0]);
    const filterItem = Array.from(document.querySelectorAll('[role="menuitem"]')).find((b) => b.textContent.trim() === "Filter");
    expect(filterItem).toBeTruthy();
    expect(() => fireEvent.click(filterItem)).not.toThrow();
    // the filter panel renders inside the SECOND table's own root, not the first
    expect(second.querySelector(".twc-dt__filters")).toBeTruthy();
    expect(tables[0].querySelector(".twc-dt__filters")).toBeNull();
  });
});
