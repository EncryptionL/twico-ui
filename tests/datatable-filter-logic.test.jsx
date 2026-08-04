import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable, runDatatableQuery } from "../components/data-display/Datatable.jsx";

// #303 — the Filters panel gains an explicit AND/OR connective (filterLogic, default "and") plus a
// discoverable per-row "add another condition" affordance. Both filter engines (client `processed` and
// the exported `runDatatableQuery`) honor filterLogic; it round-trips through onServerChange/state.
// #330 — that connective is now surfaced as a MUI DataGrid-style per-row And/Or connector (row 1 "Where",
// row 2 an editable And/Or select, rows 3+ static echo) and is controllable via
// `filterLogic`/`defaultFilterLogic`/`onFilterLogicChange`.

const columns = [
  { field: "name", headerName: "Name" },
  { field: "tag", headerName: "Tag" },
];
const rows = [
  { id: 1, name: "apple", tag: "red" },
  { id: 2, name: "apricot", tag: "green" },
  { id: 3, name: "banana", tag: "red" },
];
const q = (filters, filterLogic) => ({ page: 0, pageSize: 100, sort: null, quickFilter: "", filters, filterLogic });

describe("runDatatableQuery filterLogic (#303)", () => {
  const twoClauses = [{ field: "name", op: "contains", value: "ap" }, { field: "tag", op: "equals", value: "red" }];

  it("ANDs clauses by default (filterLogic omitted) — intersection", () => {
    expect(runDatatableQuery(rows, q(twoClauses), { columns }).rows.map((r) => r.id)).toEqual([1]);
  });
  it('explicit "and" matches the default', () => {
    expect(runDatatableQuery(rows, q(twoClauses, "and"), { columns }).rows.map((r) => r.id)).toEqual([1]);
  });
  it('"or" keeps a row matching ANY clause — union', () => {
    expect(runDatatableQuery(rows, q(twoClauses, "or"), { columns }).rows.map((r) => r.id)).toEqual([1, 2, 3]);
  });
  it('"or" with zero filters returns all rows (empty-set guard)', () => {
    expect(runDatatableQuery(rows, q([], "or"), { columns }).rows.map((r) => r.id)).toEqual([1, 2, 3]);
  });
  it('two clauses on the SAME column AND together (documented contract)', () => {
    const res = runDatatableQuery(rows, q([{ field: "name", op: "contains", value: "a" }, { field: "name", op: "contains", value: "e" }], "and"), { columns });
    expect(res.rows.map((r) => r.id)).toEqual([1]); // only "apple" contains both "a" and "e"
  });
  it('drops unknown-field clauses under OR (parity with the client engine — a stray isEmpty on a removed column must not match every row)', () => {
    const res = runDatatableQuery(rows, q([{ field: "legacyCol", op: "isEmpty" }, { field: "name", op: "contains", value: "Bob" }], "or"), { columns });
    expect(res.rows.map((r) => r.id)).toEqual([]); // legacyCol unknown → dropped; no name has "Bob" → empty (not ALL rows)
  });
});

describe("Datatable filterLogic — client engine parity via initialState (#303)", () => {
  const seed = [{ field: "name", op: "contains", value: "ap" }, { field: "tag", op: "equals", value: "red" }];
  const bodyRows = (c) => c.querySelectorAll("tbody tr.twc-dt__row").length;

  it('renders the AND intersection when filterLogic is "and"', () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: seed, filterLogic: "and" }} />);
    expect(bodyRows(container)).toBe(1); // apple only
  });
  it('renders the OR union when filterLogic is "or"', () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: seed, filterLogic: "or" }} />);
    expect(bodyRows(container)).toBe(3); // apple, apricot, banana
  });
});

describe("Datatable Filters panel per-row And/Or connector + add-condition (#330)", () => {
  let orig;
  beforeEach(() => {
    orig = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

  const openFilters = (c) => fireEvent.click(Array.from(c.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
  const logicCells = (c) => Array.from(c.querySelectorAll(".twc-dt__f-logic"));
  const seed2 = [{ field: "name", op: "contains", value: "ap" }, { field: "tag", op: "equals", value: "red" }];

  it("row 1 is 'Where'; the second row hosts an editable And/Or select (default And)", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: seed2 }} />);
    openFilters(container);
    const cells = logicCells(container);
    expect(cells.length).toBe(2);
    expect(cells[0].querySelector(".twc-dt__f-where").textContent).toBe("Where");
    const sel = cells[1].querySelector(".twc-sel__trigger");
    expect(sel).toBeTruthy();
    expect(sel.textContent).toContain("And"); // single, linked logicOperator — defaults to And
  });

  it("the connector is a resizable field — row 1 carries a drag handle like col/op/val (no more truncation)", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: seed2 }} />);
    openFilters(container);
    // the leading connector cell on the first row hosts a resize handle, matching the other filter fields
    const handle = container.querySelector('.twc-dt__f-logic .twc-dt__f-rz[aria-label^="Resize connector"]');
    expect(handle).toBeTruthy();
    // and it is the only field-resize handle on the connector column (row 0 only, like col/op/val)
    expect(container.querySelectorAll('.twc-dt__f-logic .twc-dt__f-rz').length).toBe(1);
  });

  it("a single clause shows only 'Where' (no connector select)", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: [{ field: "name", op: "contains", value: "ap" }] }} />);
    openFilters(container);
    const cells = logicCells(container);
    expect(cells.length).toBe(1);
    expect(cells[0].querySelector(".twc-dt__f-where").textContent).toBe("Where");
    expect(cells[0].querySelector(".twc-sel__trigger")).toBeNull();
  });

  it("choosing Or on the connector flips the client result to the union and fires onFilterLogicChange", () => {
    const onFilterLogicChange = vi.fn();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: seed2 }} onFilterLogicChange={onFilterLogicChange} />);
    const bodyRows = () => container.querySelectorAll("tbody tr.twc-dt__row").length;
    expect(bodyRows()).toBe(1); // AND intersection: apple only
    openFilters(container);
    fireEvent.click(logicCells(container)[1].querySelector(".twc-sel__trigger"));
    fireEvent.click(Array.from(document.querySelectorAll(".twc-opt")).find((o) => o.textContent.trim() === "Or"));
    expect(onFilterLogicChange).toHaveBeenCalledWith("or");
    expect(bodyRows()).toBe(3); // uncontrolled self-update → OR union
  });

  it("rows 3+ echo the chosen operator as static text (single linked operator)", () => {
    const seed3 = [
      { field: "name", op: "contains", value: "a" },
      { field: "tag", op: "equals", value: "red" },
      { field: "name", op: "contains", value: "p" },
    ];
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: seed3, filterLogic: "or" }} />);
    openFilters(container);
    const cells = logicCells(container);
    expect(cells.length).toBe(3);
    expect(cells[0].querySelector(".twc-dt__f-where").textContent).toBe("Where");
    expect(cells[1].querySelector(".twc-sel__trigger").textContent).toContain("Or"); // editable connector reflects Or
    expect(cells[2].querySelector(".twc-dt__f-where").textContent).toBe("Or");       // static echo, not a second control
    expect(cells[2].querySelector(".twc-sel__trigger")).toBeNull();
  });

  it("per-row '+' appends another clause on the same column", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: [{ field: "name", op: "contains", value: "ap" }] }} />);
    openFilters(container);
    expect(container.querySelectorAll(".twc-dt__frow").length).toBe(1);
    fireEvent.click(container.querySelector('[aria-label^="Add another condition"]'));
    expect(container.querySelectorAll(".twc-dt__frow").length).toBe(2); // a second row appended
  });
});

describe("Datatable controlled filterLogic (#330)", () => {
  let orig;
  beforeEach(() => {
    orig = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });
  const seed2 = [{ field: "name", op: "contains", value: "ap" }, { field: "tag", op: "equals", value: "red" }];

  it("the prop drives the result and the select; self-clicks fire onFilterLogicChange but don't self-update until the parent changes the prop", () => {
    const onFilterLogicChange = vi.fn();
    const { container, rerender } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} filterLogic="or" onFilterLogicChange={onFilterLogicChange} initialState={{ filters: seed2 }} />);
    const bodyRows = () => container.querySelectorAll("tbody tr.twc-dt__row").length;
    expect(bodyRows()).toBe(3); // controlled OR union
    fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
    const trigger = container.querySelectorAll(".twc-dt__f-logic")[1].querySelector(".twc-sel__trigger");
    expect(trigger.textContent).toContain("Or");
    fireEvent.click(trigger);
    fireEvent.click(Array.from(document.querySelectorAll(".twc-opt")).find((o) => o.textContent.trim() === "And"));
    expect(onFilterLogicChange).toHaveBeenCalledWith("and");
    expect(bodyRows()).toBe(3); // still OR — controlled, no self-update
    rerender(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} filterLogic="and" onFilterLogicChange={onFilterLogicChange} initialState={{ filters: seed2 }} />);
    expect(bodyRows()).toBe(1); // parent flipped the prop → AND intersection
  });
});

describe("Datatable filterLogic round-trips (#303)", () => {
  let orig;
  beforeEach(() => {
    window.localStorage.clear();
    orig = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

  it("emits filterLogic in the server query", () => {
    const onServerChange = vi.fn();
    render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} serverMode onServerChange={onServerChange}
      initialState={{ filters: [{ field: "name", op: "contains", value: "ap" }], filterLogic: "or" }} />);
    return new Promise((res) => setTimeout(res, 320)).then(() => {
      const last = onServerChange.mock.calls.at(-1)[0];
      expect(last.filterLogic).toBe("or");
    });
  });

  it("persists filterLogic to localStorage and restores it (default 'and' when absent)", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} stateKey="dt-303"
      initialState={{ filters: [{ field: "name", op: "contains", value: "ap" }, { field: "tag", op: "equals", value: "red" }], filterLogic: "or" }} />);
    const stored = JSON.parse(window.localStorage.getItem("dt-303"));
    expect(stored.filterLogic).toBe("or");
    // restored → the per-row connector select reflects OR when the panel opens
    fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
    const sel = container.querySelectorAll(".twc-dt__f-logic")[1].querySelector(".twc-sel__trigger");
    expect(sel.textContent).toContain("Or");
  });
});
