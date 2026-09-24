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

  it("a MIXED static+predicate batch keeps a keys×patch write off locked cells (keys = fully-editable rows only)", () => {
    // The hard case: one static column + one predicate column picked together. `patch` is column-uniform, so a
    // `keys × patch` host would write the predicate field to a row allowed only for the static field — unless the
    // key is excluded. changedRows stays per-cell exact; selectedKeys are only the rows editable on EVERY column.
    const spy = vi.fn();
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={spy} />);
    selectRow(container, 0); // locked
    selectRow(container, 1); // open
    fireEvent.click(editBtn(container));
    openPicker(); pick("Name");   // static column
    openPicker(); pick("Gated");  // predicate column (offered because r1 passes)
    const inputs = document.querySelectorAll(".twc-dt__be-row input");
    fireEvent.change(inputs[0], { target: { value: "N" } }); // Name clause
    fireEvent.change(inputs[1], { target: { value: "G" } }); // Gated clause
    apply();
    const [changedRows, patch, keys] = spy.mock.calls[0];
    expect(patch).toEqual({ name: "N", gated: "G" });
    // changedRows is authoritative + per-cell: r0 gets only name (gated predicate rejected), r1 gets both
    const r0 = changedRows.find((r) => r.id === "r0");
    const r1 = changedRows.find((r) => r.id === "r1");
    expect(r0).toMatchObject({ name: "N" });
    expect(r0.gated).toBe("a"); // NOT written — the gated predicate rejects the locked row
    expect(r1).toMatchObject({ name: "N", gated: "G" });
    // keys × patch safety: only r1 (editable on BOTH columns) is a safe key — so `gated` never lands on r0
    expect(keys).toEqual(["r1"]);
  });

  // #432 — the merge into changedRows loses the per-row subset, and a row nothing applied to appears in no list,
  // so a host could neither do a cell-precise per-row write nor report "Updated N · M skipped". The additive 4th
  // `detail` arg reports both (`rowPatches` aligned 1:1 with changedRows, `skippedKeys` for the loaded no-ops).
  it("detail.rowPatches carries the exact per-row subset, aligned 1:1 with changedRows", () => {
    const spy = vi.fn();
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={spy} />);
    selectRow(container, 0); selectRow(container, 1);
    fireEvent.click(editBtn(container));
    openPicker(); pick("Name");   // static → applies to both
    openPicker(); pick("Gated");  // predicate → only r1
    const inputs = document.querySelectorAll(".twc-dt__be-row input");
    fireEvent.change(inputs[0], { target: { value: "N" } });
    fireEvent.change(inputs[1], { target: { value: "G" } });
    apply();
    const [changedRows, , , detail] = spy.mock.calls[0];
    expect(detail.rowPatches).toEqual([
      { key: "r0", patch: { name: "N" } },              // locked row: only the static field
      { key: "r1", patch: { name: "N", gated: "G" } },  // open row: both
    ]);
    // aligned 1:1 with changedRows, so rowPatches[i] describes changedRows[i]
    expect(detail.rowPatches.map((p) => p.key)).toEqual(changedRows.map((r) => r.id));
  });

  it("detail.skippedKeys names the loaded selected rows nothing applied to", () => {
    const spy = vi.fn();
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={spy} />);
    selectRow(container, 0); selectRow(container, 1);
    fireEvent.click(editBtn(container));
    openPicker(); pick("Gated"); // only r1 is editable → r0 is skipped entirely
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "G" } });
    apply();
    const [changedRows, , keys, detail] = spy.mock.calls[0];
    expect(detail.skippedKeys).toEqual(["r0"]);
    expect(changedRows.map((r) => r.id)).toEqual(["r1"]);
    expect(keys).toEqual(["r1"]);
    // the honest toast: "Updated 1 · 1 skipped" — no need to shadow the selection
    expect(changedRows.length + detail.skippedKeys.length).toBe(2);
  });

  it("detail.skippedKeys is empty when every selected row is written, and excludes off-page keys", () => {
    const spy = vi.fn();
    const { container, rerender } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection serverMode rowCount={2} onBatchUpdate={spy} />);
    selectRow(container, 0); selectRow(container, 1);
    // drop r0 off the loaded page — it can't be predicate-tested, so it is NOT "skipped", it stays in keys
    rerender(<Datatable columns={cols} rows={[rows[1]]} rowKey={(r) => r.id} checkboxSelection serverMode rowCount={2} onBatchUpdate={spy} />);
    fireEvent.click(editBtn(container));
    openPicker(); pick("Name");
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "N" } });
    apply();
    const [, , keys, detail] = spy.mock.calls[0];
    expect(detail.skippedKeys).toEqual([]);          // nothing loaded was left unwritten
    expect([...keys].sort()).toEqual(["r0", "r1"]);  // off-page r0 still reported for server-side apply
    expect(detail.rowPatches).toEqual([{ key: "r1", patch: { name: "N" } }]);
  });

  // #432 review: a selected client row-tree sub-row isn't in the top-level `rows`, so it used to fall through
  // to the "unloaded cross-page" branch and be pushed into selectedKeys with NO predicate test — reporting a
  // locked cell as safe for a `keys × patch` write, and missing from the skipped accounting entirely.
  it("does not report a predicate-locked row-tree sub-row as a safe key, and counts it as skipped", () => {
    const spy = vi.fn();
    const tcols = [
      { field: "name", headerName: "Name" },
      { field: "gated", headerName: "Gated", editable: (row) => row.kind === "open" },
    ];
    const parents = [{ id: "p1", name: "Parent", kind: "open", gated: "p" }];
    const kids = { p1: [{ id: "c1", name: "Locked child", kind: "locked", gated: "c" }] };
    const { container } = render(
      <Datatable columns={tcols} rows={parents} rowKey={(r) => r.id} checkboxSelection
        getRowCanExpand={(r) => !!kids[r.id]} getSubRows={(r) => kids[r.id] || []} onBatchUpdate={spy} />,
    );
    fireEvent.click(container.querySelector(".twc-dt__expand-btn")); // splice the child in as a real row
    const boxes = container.querySelectorAll('[aria-label="Select row"]');
    expect(boxes.length).toBe(2); // parent + child each have their own checkbox
    fireEvent.click(boxes[0]); // parent — passes the predicate
    fireEvent.click(boxes[1]); // locked child
    fireEvent.click(editBtn(container));
    openPicker(); pick("Gated");
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "G" } });
    apply();
    const [changedRows, , keys, detail] = spy.mock.calls[0];
    expect(changedRows.map((r) => r.id)).toEqual(["p1"]);
    expect(keys).toEqual(["p1"]); // the locked child is NOT advertised as safe for a whole-patch write
    expect(detail.skippedKeys).toEqual(["c1"]); // and it IS honestly counted as skipped
  });

  // #433 — the picker tested predicates against the LOADED selected rows only, while applyBatchEdit forwards an
  // unloaded selected key for the host to enforce. So in server mode, paging away from the selection silently
  // dropped every function-`editable` column from "Add a column…" (and with it the ability to apply one). An
  // untestable selection now admits the column, matching the apply path. The "no selected row passes" test above
  // is the other half of this branch: a selection we CAN test and that fails still hides the column.
  it("still offers a predicate column when the whole selection is on an unloaded page (#433)", () => {
    const { container, rerender } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection serverMode rowCount={2} onBatchUpdate={() => {}} />);
    selectRow(container, 0); selectRow(container, 1);
    // page away — neither selected row is loaded, so neither can be predicate-tested client-side
    rerender(<Datatable columns={cols} rows={[{ id: "r9", name: "Other", kind: "locked", gated: "z" }]} rowKey={(r) => r.id} checkboxSelection serverMode rowCount={2} onBatchUpdate={() => {}} />);
    fireEvent.click(editBtn(container));
    openPicker();
    expect(pickerOptions().sort()).toEqual(["Gated", "Name"]); // not hidden just because of which page is on screen
  });

  it("offers a predicate column when only SOME of the selection is unloaded, even if the loaded part fails (#433)", () => {
    const { container, rerender } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection serverMode rowCount={2} onBatchUpdate={() => {}} />);
    selectRow(container, 0); // r0 — locked, fails the predicate
    selectRow(container, 1); // r1 — open
    // r1 drops off the loaded page: the testable part (r0) fails, but r1 is untestable, so the host decides
    rerender(<Datatable columns={cols} rows={[rows[0]]} rowKey={(r) => r.id} checkboxSelection serverMode rowCount={2} onBatchUpdate={() => {}} />);
    fireEvent.click(editBtn(container));
    openPicker();
    expect(pickerOptions().sort()).toEqual(["Gated", "Name"]);
  });

  // #433 review: the "can't test it here, the host enforces it server-side" escape hatch must be limited to grids
  // that can actually HAVE unloaded rows. In client mode `rows` holds every page, so a key resolving nowhere is a
  // STALE selection with no server behind it — treating it as untestable would silently disable the #428 guard and
  // then report a predicate-locked row as a safe `keys × patch` target.
  it("client mode: a selected row-tree child whose parent is collapsed does NOT admit the column or become a safe key", () => {
    const spy = vi.fn();
    const tcols = [
      { field: "name", headerName: "Name", editable: true },
      { field: "gated", headerName: "Gated", editable: (row) => row.kind === "open" },
    ];
    const parents = [{ id: "p1", name: "Parent", kind: "open", gated: "p" }];
    const kids = { p1: [{ id: "c1", name: "Locked child", kind: "locked", gated: "c" }] };
    const { container } = render(
      <Datatable columns={tcols} rows={parents} rowKey={(r) => r.id} checkboxSelection
        getRowCanExpand={(r) => !!kids[r.id]} getSubRows={(r) => kids[r.id] || []} onBatchUpdate={spy} />,
    );
    fireEvent.click(container.querySelector(".twc-dt__expand-btn")); // expand
    fireEvent.click(container.querySelectorAll('[aria-label="Select row"]')[1]); // tick the locked child only
    fireEvent.click(container.querySelector(".twc-dt__expand-btn")); // collapse — c1 now resolves nowhere
    fireEvent.click(editBtn(container));
    openPicker();
    expect(pickerOptions()).toEqual(["Name"]); // "Gated" stays withheld — no server to enforce it
    pick("Name");
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "X" } });
    apply();
    const [changedRows, , keys] = spy.mock.calls[0];
    expect(changedRows).toEqual([]);
    expect(keys).toEqual([]); // the unresolvable client-mode key is NOT advertised as safe to write
  });

  // Pins the `rows` half of the union: in client mode `rows` spans every page, so a selected row that has scrolled
  // off the rendered page is still predicate-testable. (Testing against the rendered rows alone would have
  // re-introduced #433 here — the column would wrongly reappear.)
  it("client mode: paging away from a FAILING selected row still withholds the predicate column", () => {
    const { container } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection pageSize={1} onBatchUpdate={() => {}} />,
    );
    selectRow(container, 0); // r0 — locked, fails the predicate
    fireEvent.click(container.querySelector('[aria-label="Next page"]')); // r0 is no longer rendered
    fireEvent.click(editBtn(container));
    openPicker();
    expect(pickerOptions()).toEqual(["Name"]); // still testable via `rows`, still correctly hidden
  });

  it("keeps a selected key that is off the loaded page (server-mode cross-page) for server-side apply", () => {
    const spy = vi.fn();
    const { container, rerender } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection serverMode rowCount={2} onBatchUpdate={spy} />);
    selectRow(container, 0); // r0
    selectRow(container, 1); // r1
    // a server-mode page change drops r0 from the loaded rows while it stays selected
    rerender(<Datatable columns={cols} rows={[rows[1]]} rowKey={(r) => r.id} checkboxSelection serverMode rowCount={2} onBatchUpdate={spy} />);
    fireEvent.click(editBtn(container));
    openPicker(); pick("Name"); // static column — no predicate to test the loaded row against
    fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "Renamed" } });
    apply();
    const [changedRows, , keys] = spy.mock.calls[0];
    expect(changedRows.map((r) => r.id)).toEqual(["r1"]); // only the loaded row resolves to a changed row
    expect([...keys].sort()).toEqual(["r0", "r1"]); // the off-page key is preserved (host enforces server-side)
  });
});
