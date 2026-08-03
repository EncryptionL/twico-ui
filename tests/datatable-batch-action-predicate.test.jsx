import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #322 — a batch action can disable/hide itself against the CURRENT selection (predicate form), and a new
// onRowSelectionChange reports the checkbox selection (the row-mode analogue of onCellSelectionChange).
const cols = [{ field: "name", headerName: "Name" }];
const rows = [
  { id: 1, name: "Group A", isGroup: true },
  { id: 2, name: "Entry 1" },
  { id: 3, name: "Entry 2" },
];
const selectRow = (c, i) => fireEvent.click(c.querySelectorAll('[aria-label="Select row"]')[i]);
const batchBtn = (c, label) => Array.from(c.querySelectorAll(".twc-dt__batch-btn")).find((b) => b.textContent.includes(label));

describe("Datatable batch action predicate disabled/hidden + onRowSelectionChange (#322)", () => {
  it("disables an action via a predicate evaluated against the selection", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection
      batchActions={[{ label: "Mark", disabled: (_keys, sel) => sel.every((r) => r.isGroup), onClick: () => {} }]} />);
    selectRow(container, 0); // group only
    expect(batchBtn(container, "Mark").disabled).toBe(true);
    selectRow(container, 1); // + an entry
    expect(batchBtn(container, "Mark").disabled).toBe(false);
  });

  it("hides an action via a predicate; shows it when applicable", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection
      batchActions={[{ label: "Mark", hidden: (_keys, sel) => sel.every((r) => r.isGroup), onClick: () => {} }]} />);
    selectRow(container, 0); // group only → hidden
    expect(batchBtn(container, "Mark")).toBeFalsy();
    selectRow(container, 1); // + entry → shown
    expect(batchBtn(container, "Mark")).toBeTruthy();
  });

  it("still honors a static boolean disabled (back-compat)", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection
      batchActions={[{ label: "Mark", disabled: true, onClick: () => {} }]} />);
    selectRow(container, 1);
    expect(batchBtn(container, "Mark").disabled).toBe(true);
  });

  it("fires onRowSelectionChange with keys + rows when the selection changes", () => {
    const onRowSelectionChange = vi.fn();
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onRowSelectionChange={onRowSelectionChange} />);
    selectRow(container, 1); // select Entry 1 (id 2)
    const last = onRowSelectionChange.mock.calls.at(-1);
    expect(last[0]).toEqual([2]);
    expect(last[1]).toEqual([rows[1]]);
    selectRow(container, 1); // deselect → empty
    expect(onRowSelectionChange.mock.calls.at(-1)[0]).toEqual([]);
  });
});
