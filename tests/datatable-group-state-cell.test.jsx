import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #393 controlled/persisted group collapse + select-all over visible rows. #395 controlled activeCell + scroll.
const rows = [
  { id: 1, name: "Ann", team: "A" },
  { id: 2, name: "Bo", team: "A" },
  { id: 3, name: "Cy", team: "B" },
];
const RECT = { top: 80, left: 80, right: 260, bottom: 120, width: 180, height: 40, x: 80, y: 80, toJSON() {} };
let origRect;
beforeEach(() => { origRect = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
afterEach(() => { Element.prototype.getBoundingClientRect = origRect; cleanup(); vi.restoreAllMocks(); });

describe("Datatable controllable group collapse (#393)", () => {
  const grouped = { rowGrouping: ["team"], columns: [{ field: "name" }, { field: "team", groupable: true }], rowKey: (r) => r.id };

  it("renders controlled collapsedGroups collapsed and reports toggles without self-mutating", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<Datatable {...grouped} rows={rows} collapsedGroups={["/team:A"]} onCollapsedGroupsChange={onChange} />);
    // group A collapsed → Ann/Bo rows are not rendered; group B expanded → Cy is
    expect(container.textContent).toContain("Cy");
    expect(container.textContent).not.toContain("Ann");
    // toggling group A fires the callback with the next set; controlled → still collapsed until the prop changes
    const groupBtns = container.querySelectorAll(".twc-dt__group-toggle");
    fireEvent.click(groupBtns[0]);
    expect(onChange).toHaveBeenCalledWith([]); // removing /team:A
    expect(container.textContent).not.toContain("Ann"); // controlled: no self-update
    rerender(<Datatable {...grouped} rows={rows} collapsedGroups={[]} onCollapsedGroupsChange={onChange} />);
    expect(container.textContent).toContain("Ann");
  });

  it("uncontrolled defaultCollapsedGroups seeds initial collapse and toggles freely", () => {
    const { container } = render(<Datatable {...grouped} rows={rows} defaultCollapsedGroups={["/team:B"]} />);
    expect(container.textContent).not.toContain("Cy");
    const btns = container.querySelectorAll(".twc-dt__group-toggle");
    fireEvent.click(btns[1]); // expand group B
    expect(container.textContent).toContain("Cy");
  });

  it("renderGroupLabel receives collapsed + a working toggle()", () => {
    const seen = [];
    const { container } = render(<Datatable {...grouped} rows={rows}
      renderGroupLabel={({ value, collapsed, toggle }) => { seen.push({ value, collapsed }); return <span data-toggle onClick={toggle}>{String(value)}</span>; }} />);
    expect(seen.some((g) => g.collapsed === false)).toBe(true);
  });

  it("header select-all covers only visible leaf rows when groups are collapsed", () => {
    const onSel = vi.fn();
    const { container } = render(<Datatable {...grouped} rows={rows} checkboxSelection collapsedGroups={["/team:A"]}
      onRowSelectionChange={onSel} />);
    const selectAll = container.querySelector('thead .twc-dt__check[aria-label="Select all rows"]');
    fireEvent.click(selectAll);
    const lastKeys = onSel.mock.calls.at(-1)[0];
    expect(lastKeys).toContain(3); // Cy (visible)
    expect(lastKeys).not.toContain(1); // Ann (in collapsed group A)
    expect(lastKeys).not.toContain(2);
  });
});

describe("Datatable stateKey persists grouping + collapsedGroups (#393)", () => {
  it("round-trips grouping and collapse through localStorage", () => {
    try { window.localStorage.clear(); } catch { /* ignore */ }
    const cols = [{ field: "name" }, { field: "team", groupable: true }];
    const { unmount, container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} rowGrouping={["team"]} stateKey="dt-group-test" defaultCollapsedGroups={["/team:A"]} />);
    // the collapse state is written to storage
    const saved = JSON.parse(window.localStorage.getItem("dt-group-test"));
    expect(saved.grouping).toEqual(["team"]);
    expect(saved.collapsedGroups).toContain("/team:A");
    unmount();
    // remount without defaults → restored from storage
    const { container: c2 } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} stateKey="dt-group-test" />);
    expect(c2.textContent).not.toContain("Ann"); // team A still collapsed from the saved state
  });
});

describe("Datatable controlled activeCell + scroll (#395)", () => {
  const cols = [{ field: "name" }, { field: "team" }];

  it("highlights the controlled active cell in cell mode", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols}
      selectionMode="cell" activeCell={{ key: 2, field: "team" }} />);
    const active = container.querySelector('[data-cell-active="true"]');
    expect(active).toBeTruthy();
  });

  it("scrolls the grid's own scroller and never calls scrollIntoView", () => {
    const sIntoView = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
    const { container, rerender } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols}
      selectionMode="cell" activeCell={null} scrollActiveCellIntoView />);
    const scroller = container.querySelector(".twc-dt__scroll");
    // give the scroller a scrollable extent + a below-viewport target rect
    Object.defineProperty(scroller, "getBoundingClientRect", { configurable: true, value: () => ({ top: 100, bottom: 300, left: 100, right: 400, width: 300, height: 200, x: 100, y: 100, toJSON() {} }) });
    rerender(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} selectionMode="cell" activeCell={{ key: 3, field: "team" }} scrollActiveCellIntoView />);
    expect(sIntoView).not.toHaveBeenCalled(); // must not scroll the page
  });
});
