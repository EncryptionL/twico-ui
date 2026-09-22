import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #386: the Columns and Filters toolbar buttons couldn't be turned off and opened empty panels when nothing
// was hideable/filterable. They now auto-hide when useless, and showColumns/showFilters force them on/off.
const rows = [{ id: 1, name: "Ada", age: 1 }, { id: 2, name: "Bob", age: 2 }];
const locked = { hideable: false, filterable: false }; // a fixed column, like a permission-matrix cell
const tbtn = (c, name) => c.querySelector(`.twc-dt__tbtn[data-tbtn="${name}"]`);

afterEach(() => cleanup());

describe("Datatable Columns/Filters toolbar toggles (#386)", () => {
  it("hides both buttons when no column is hideable or filterable", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name", ...locked }, { field: "age", type: "number", ...locked }]} />);
    expect(tbtn(container, "columns")).toBeNull();
    expect(tbtn(container, "filters")).toBeNull();
  });

  it("shows both by default (columns are hideable + filterable)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name" }, { field: "age", type: "number" }]} />);
    expect(tbtn(container, "columns")).toBeTruthy();
    expect(tbtn(container, "filters")).toBeTruthy();
  });

  it("keeps Columns when rowNumbers is on even if no data column is hideable", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} rowNumbers
      columns={[{ field: "name", ...locked }]} />);
    expect(tbtn(container, "columns")).toBeTruthy(); // the row-number toggle lives in the Columns panel
    expect(tbtn(container, "filters")).toBeNull();
  });

  it("showColumns/showFilters={false} force the buttons off despite hideable/filterable columns", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} showColumns={false} showFilters={false}
      columns={[{ field: "name" }, { field: "age", type: "number" }]} />);
    expect(tbtn(container, "columns")).toBeNull();
    expect(tbtn(container, "filters")).toBeNull();
  });

  it("showColumns/showFilters={true} force the buttons on despite nothing hideable/filterable", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} showColumns showFilters
      columns={[{ field: "name", ...locked }]} />);
    expect(tbtn(container, "columns")).toBeTruthy();
    expect(tbtn(container, "filters")).toBeTruthy();
  });
});

// The show* gate must also drop the matching column-⋮-menu items — else the Filter item would push a phantom
// filter (no button to anchor to / no panel to remove it), and Hide column would strand a column with no
// Columns panel to restore it. (jsdom needs a real rect so the ⋮ menu can position + open.)
describe("Datatable column-menu items honor showColumns/showFilters (#386)", () => {
  const RECT = { top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} };
  let orig;
  beforeEach(() => { orig = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; cleanup(); });
  const cols = [{ field: "name" }, { field: "age", type: "number" }]; // default: hideable + filterable
  const menuTexts = () => Array.from(document.querySelectorAll('[role="menuitem"]')).map((b) => b.textContent);

  it("shows Filter + Hide column in the ⋮ menu by default", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} />);
    fireEvent.click(container.querySelector(".twc-dt__menu-btn"));
    const t = menuTexts().join(" | ");
    expect(t).toContain("Filter");
    expect(t).toContain("Hide column");
  });

  it("showFilters={false} removes the ⋮-menu Filter item (no phantom filter path)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} showFilters={false} />);
    fireEvent.click(container.querySelector(".twc-dt__menu-btn"));
    expect(menuTexts().some((t) => t.includes("Filter"))).toBe(false);
  });

  it("showColumns={false} removes the ⋮-menu Hide column item (no stranded column)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} showColumns={false} />);
    fireEvent.click(container.querySelector(".twc-dt__menu-btn"));
    expect(menuTexts().some((t) => t.includes("Hide column"))).toBe(false);
  });
});
