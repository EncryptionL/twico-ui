import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #428 — the per-row `editable` predicate from #424 must also gate the BATCH write. Previously
// onBatchUpdate(changedRows, patch, keys) got the WHOLE patch and EVERY selected key (locked rows included),
// so a server-backed host persisting `keys × patch` wrote the locked rows; and because a function is truthy,
// the "Add a column…" picker offered a predicate column even when no selected row passed it (a clause that
// silently did nothing). Fix: keys are filtered by the predicate (mirrors onRowsChange), and the picker only
// offers a predicate column when at least one selected row passes.

const cols = [
  { field: "name", headerName: "Name", editable: true },
  { field: "gated", headerName: "Gated", editable: (row) => row.kind === "open" },
];
const rows = [
  { id: "r0", name: "Locked", kind: "locked", gated: "a" },
  { id: "r1", name: "Open", kind: "open", gated: "b" },
];

const selectRow = (c, i) => fireEvent.click(c.querySelectorAll('[aria-label="Select row"]')[i]);
const editBtn = (c) => Array.from(c.querySelectorAll(".twc-dt__batch-btn")).find((b) => b.textContent.includes("Edit"));
const beRows = () => document.querySelectorAll(".twc-dt__be-row");
const openPicker = () => fireEvent.click(document.querySelector(".twc-dt__be-add .twc-sel__trigger"));
const pickerOptions = () => Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent.trim());
const pick = (label) => fireEvent.click(Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent.trim() === label));
const apply = () => fireEvent.click(Array.from(document.querySelectorAll(".twc-dt__cfg-btn")).find((b) => b.textContent.includes("Apply")));

describe("Datatable batch edit honours per-row editable (#428)", () => {
  let orig;
  beforeEach(() => {
    orig = Element.prototype.getBoundingClientRect;
    // the floating batch-edit popover bails on all-zero rects (jsdom)
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 130, left: 100, right: 260, width: 160, height: 30, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; cleanup(); });

  it("onBatchUpdate receives only the predicate-allowed keys, aligned 1:1 with changedRows", () => {
    const spy = vi.fn();
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={spy} />);
    selectRow(container, 0); // locked
    selectRow(container, 1); // open
    fireEvent.click(editBtn(container));
    openPicker();
    pick("Gated");
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "BATCHED" } });
    apply();
    expect(spy).toHaveBeenCalledTimes(1);
    const [changedRows, patch, keys] = spy.mock.calls[0];
    expect(patch).toEqual({ gated: "BATCHED" });
    expect(keys).toEqual(["r1"]); // the locked row is dropped — not written by a `keys × patch` host
    expect(changedRows.map((r) => r.id)).toEqual(["r1"]);
    expect(changedRows[0].gated).toBe("BATCHED");
  });

  it("onRowsChange writes only the allowed row and leaves the locked row untouched", () => {
    const spy = vi.fn();
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onRowsChange={spy} onBatchUpdate={() => {}} />);
    selectRow(container, 0); selectRow(container, 1);
    fireEvent.click(editBtn(container));
    openPicker(); pick("Gated");
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "BATCHED" } });
    apply();
    const next = spy.mock.calls[0][0];
    expect(next.find((r) => r.id === "r0").gated).toBe("a"); // locked untouched
    expect(next.find((r) => r.id === "r1").gated).toBe("BATCHED"); // open written
  });

  it("a static column still reports every selected key (no regression)", () => {
    const spy = vi.fn();
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={spy} />);
    selectRow(container, 0); selectRow(container, 1);
    fireEvent.click(editBtn(container));
    openPicker(); pick("Name");
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "Renamed" } });
    apply();
    const [, patch, keys] = spy.mock.calls[0];
    expect(patch).toEqual({ name: "Renamed" });
    expect([...keys].sort()).toEqual(["r0", "r1"]);
  });

  it("the picker does NOT offer a predicate column when no selected row passes it", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={() => {}} />);
    selectRow(container, 0); // locked only
    fireEvent.click(editBtn(container));
    openPicker();
    expect(pickerOptions()).toEqual(["Name"]); // "Gated" withheld — it would write nothing
  });

  it("the picker offers the predicate column when at least one selected row passes", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={() => {}} />);
    selectRow(container, 1); // open only
    fireEvent.click(editBtn(container));
    openPicker();
    expect(pickerOptions().sort()).toEqual(["Gated", "Name"]);
  });

  it("keeps a selected key that is off the loaded page (server-mode cross-page) for server-side apply", () => {
    const spy = vi.fn();
    const { container, rerender } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={spy} />);
    selectRow(container, 0); // r0
    selectRow(container, 1); // r1
    // a server-mode page change drops r0 from the loaded rows while it stays selected
    rerender(<Datatable columns={cols} rows={[rows[1]]} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={spy} />);
    fireEvent.click(editBtn(container));
    openPicker(); pick("Name"); // static column — no predicate to test the loaded row against
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "Renamed" } });
    apply();
    const [changedRows, , keys] = spy.mock.calls[0];
    expect(changedRows.map((r) => r.id)).toEqual(["r1"]); // only the loaded row resolves to a changed row
    expect([...keys].sort()).toEqual(["r0", "r1"]); // the off-page key is preserved (host enforces server-side)
  });
});
