import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable, runDatatableQuery } from "../components/data-display/Datatable.jsx";

// #303 — the Filters panel gains an explicit AND/OR connective (filterLogic, default "and") plus a
// discoverable per-row "add another condition" affordance. Both filter engines (client `processed` and
// the exported `runDatatableQuery`) honor filterLogic; it round-trips through onServerChange/state.

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

describe("Datatable Filters panel AND/OR toggle + add-condition (#303)", () => {
  let orig;
  beforeEach(() => {
    orig = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

  const openFilters = (c) => fireEvent.click(Array.from(c.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));

  it("shows the AND/OR toggle only with 2+ clauses; defaults to AND and flips to OR on click", () => {
    const seed2 = [{ field: "name", op: "contains", value: "ap" }, { field: "tag", op: "equals", value: "red" }];
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: seed2 }} />);
    openFilters(container);
    const btns = () => Array.from(container.querySelectorAll(".twc-dt__flogic-btn"));
    expect(btns().length).toBe(2);
    const [andBtn, orBtn] = btns();
    expect(andBtn.getAttribute("data-active")).toBe("true"); // default AND
    expect(orBtn.getAttribute("data-active")).toBeNull();
    fireEvent.click(orBtn);
    expect(container.querySelectorAll('.twc-dt__flogic-btn[data-active="true"]')[0].textContent).toBe("OR");
  });

  it("hides the toggle with a single clause", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: [{ field: "name", op: "contains", value: "ap" }] }} />);
    openFilters(container);
    expect(container.querySelectorAll(".twc-dt__flogic-btn").length).toBe(0);
  });

  it("per-row '+' appends another clause on the same column", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ filters: [{ field: "name", op: "contains", value: "ap" }] }} />);
    openFilters(container);
    expect(container.querySelectorAll(".twc-dt__frow").length).toBe(1);
    fireEvent.click(container.querySelector('[aria-label^="Add another condition"]'));
    expect(container.querySelectorAll(".twc-dt__frow").length).toBe(2); // a second row appended
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
    // restored → the OR toggle is active when the panel opens
    fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
    expect(container.querySelectorAll('.twc-dt__flogic-btn[data-active="true"]')[0].textContent).toBe("OR");
  });
});
