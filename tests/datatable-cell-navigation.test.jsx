import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #391: the grid must not move cell focus when a child widget (an in-cell popup trigger) already handled the
// key. #392: opt-in `cellNavigation="widget"` focuses a cell's single control and makes the body one Tab stop.
const rows = [
  { id: 1, name: "Alpha" },
  { id: 2, name: "Bravo" },
  { id: 3, name: "Charlie" },
];
const RECT = { top: 80, left: 80, right: 260, bottom: 120, width: 180, height: 40, x: 80, y: 80, toJSON() {} };
let origRect;
beforeEach(() => { origRect = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
afterEach(() => { Element.prototype.getBoundingClientRect = origRect; cleanup(); });

const cellAt = (c, r, col) => c.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${col}"]`);

describe("Datatable in-cell popup key guard (#391)", () => {
  it("does not move grid focus when an open (aria-expanded) trigger handles the key", () => {
    const columns = [{ field: "name", renderCell: (v) => <button aria-expanded="true">{v}</button> }];
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} />);
    const trigger = container.querySelector('button[aria-expanded="true"]');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    // guard returns early → focus stays on the trigger, not a <td>
    expect(document.activeElement).toBe(trigger);
  });

  it("does not move grid focus when a child preventDefaults the key", () => {
    const columns = [{ field: "name", renderCell: (v) => <button onKeyDown={(e) => e.preventDefault()}>{v}</button> }];
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} />);
    const btn = container.querySelector("tbody button");
    btn.focus();
    fireEvent.keyDown(btn, { key: "ArrowDown" });
    expect(document.activeElement).toBe(btn);
  });

  it("still navigates cells normally with no in-cell popup", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={[{ field: "name" }]} />);
    const c00 = cellAt(container, 0, 0);
    c00.focus();
    fireEvent.keyDown(c00, { key: "ArrowDown" });
    expect(document.activeElement).toBe(cellAt(container, 1, 0));
  });
});

describe("Datatable widget cell-navigation (#392)", () => {
  const columns = [{ field: "name", renderCell: (v) => <button type="button">{v}</button> }];

  it("arrow keys land on the cell's single widget and rove the single Tab stop", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} cellNavigation="widget" />);
    const btn = (r) => cellAt(container, r, 0).querySelector("button");
    // active cell (0,0)'s button is the roving 0; the others are -1
    expect(btn(0).tabIndex).toBe(0);
    expect(btn(1).tabIndex).toBe(-1);
    // arrow down from the focused widget lands on the next row's widget
    btn(0).focus();
    fireEvent.keyDown(btn(0), { key: "ArrowDown" });
    expect(document.activeElement).toBe(btn(1));
    expect(btn(1).tabIndex).toBe(0);
    expect(btn(0).tabIndex).toBe(-1);
  });

  it("Enter/Space on the focused widget do not trigger grid navigation", () => {
    let clicks = 0;
    const cols = [{ field: "name", renderCell: (v) => <button type="button" onClick={() => { clicks++; }}>{v}</button> }];
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} cellNavigation="widget" />);
    const btn = cellAt(container, 0, 0).querySelector("button");
    btn.focus();
    fireEvent.keyDown(btn, { key: "Enter" }); // returns early → the button (not the grid) owns activation
    expect(document.activeElement).toBe(btn); // focus did not move to another cell
  });

  it("default cell mode keeps the <td> as the focus target (no regression)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} />);
    const c00 = cellAt(container, 0, 0);
    expect(c00.tabIndex).toBe(0); // td carries the roving tabindex in the default mode
    c00.focus();
    fireEvent.keyDown(c00, { key: "ArrowDown" });
    expect(document.activeElement).toBe(cellAt(container, 1, 0));
  });

  it("widget mode: ArrowDown on a collapsed popup trigger moves down instead of opening it (#410)", () => {
    const cols = [{ field: "name", renderCell: (v) => <button aria-haspopup="menu" aria-expanded="false">{v}</button> }];
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} cellNavigation="widget" />);
    const btn = (r) => cellAt(container, r, 0).querySelector("button");
    btn(0).focus();
    fireEvent.keyDown(btn(0), { key: "ArrowDown" });
    expect(document.activeElement).toBe(btn(1)); // moved down
    expect(btn(0).getAttribute("aria-expanded")).toBe("false"); // did not open
  });
});

describe("Datatable Enter/Space on in-cell control activates it in every mode (#422)", () => {
  it("in selectionMode=row, Enter on a focused in-cell button does not select the row", () => {
    const onRowClick = vi.fn();
    const onClick = vi.fn();
    const cols = [{ field: "name", renderCell: (v) => <button type="button" onClick={onClick}>{v}</button> }];
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} selectionMode="row" onRowClick={onRowClick} />);
    const btn = cellAt(container, 0, 0).querySelector("button");
    btn.focus();
    fireEvent.keyDown(btn, { key: "Enter" });
    expect(onRowClick).not.toHaveBeenCalled(); // grid left Enter to the control
  });
});

describe("Datatable controlled activeCell jump collapses selection + moves focus (#421)", () => {
  it("does not loop and moves the roving focus to a host-set cell", () => {
    const cols = [{ field: "name" }, { field: "age", type: "number" }];
    const { container, rerender } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} selectionMode="cell" activeCell={null} />);
    // a host jump to (row 2, age) — must apply once without freezing (regression: infinite render loop)
    rerender(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} selectionMode="cell" activeCell={{ key: 3, field: "age" }} />);
    const target = cellAt(container, 2, 1);
    expect(target.getAttribute("data-cell-active")).toBe("true");
  });
});
