import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #390 renderEditCell staging + commitPatch, #394 onCellsCommit batched clipboard, #396 onEditingChange signal.
const rows = [
  { id: 1, name: "Alpha", qty: 1, unit: "kg" },
  { id: 2, name: "Bravo", qty: 2, unit: "kg" },
];
const RECT = { top: 80, left: 80, right: 260, bottom: 120, width: 180, height: 40, x: 80, y: 80, toJSON() {} };
let origRect;
beforeEach(() => { origRect = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
afterEach(() => { Element.prototype.getBoundingClientRect = origRect; cleanup(); vi.restoreAllMocks(); });

const dblOpen = (c, r, col) => fireEvent.doubleClick(c.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${col}"]`));

describe("Datatable renderEditCell staging + commitPatch (#390)", () => {
  it("commits a staged draft on click-away (was discarded before)", () => {
    const onRowUpdate = vi.fn();
    const cols = [
      { field: "name" },
      { field: "qty", editable: true, renderEditCell: ({ value, setDraft }) => (
        <input data-testid="ed" defaultValue={value} onChange={(e) => setDraft(e.target.value)} />
      ) },
    ];
    const { container, getByTestId } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} onRowUpdate={onRowUpdate} />);
    dblOpen(container, 0, 1);
    fireEvent.change(getByTestId("ed"), { target: { value: "99" } });
    // click away (a capture-phase mousedown outside the editor)
    fireEvent.mouseDown(document.body);
    expect(onRowUpdate).toHaveBeenCalledTimes(1);
    expect(onRowUpdate.mock.calls[0][0].qty).toBe("99");
  });

  it("still cancels click-away when the editor never stages (back-compat)", () => {
    const onRowUpdate = vi.fn();
    const cols = [
      { field: "name" },
      { field: "qty", editable: true, renderEditCell: ({ value }) => <input data-testid="ed" defaultValue={value} /> },
    ];
    const { container, getByTestId } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} onRowUpdate={onRowUpdate} />);
    dblOpen(container, 0, 1);
    fireEvent.change(getByTestId("ed"), { target: { value: "99" } });
    fireEvent.mouseDown(document.body);
    expect(onRowUpdate).not.toHaveBeenCalled();
  });

  it("commitPatch writes multiple keys, and no-ops when every key is unchanged", () => {
    const onRowUpdate = vi.fn();
    // patch each row to its OWN unchanged unit + a chosen qty, so the same editor tests both branches
    const cols = [
      { field: "name" },
      { field: "qty", editable: true, renderEditCell: ({ row, commitPatch }) => (
        <div>
          <button data-testid="change" onClick={() => commitPatch({ qty: 5, unit: "lb" })}>change</button>
          <button data-testid="same" onClick={() => commitPatch({ qty: row.qty, unit: row.unit })}>same</button>
        </div>
      ) },
    ];
    const { container, getByTestId } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} onRowUpdate={onRowUpdate} />);
    dblOpen(container, 0, 1);
    fireEvent.click(getByTestId("change"));
    expect(onRowUpdate).toHaveBeenCalledTimes(1);
    const updated = onRowUpdate.mock.calls[0][0];
    expect(updated.qty).toBe(5);
    expect(updated.unit).toBe("lb");
    // an unchanged patch is a no-op
    onRowUpdate.mockClear();
    dblOpen(container, 1, 1);
    fireEvent.click(getByTestId("same"));
    expect(onRowUpdate).not.toHaveBeenCalled();
  });
});

describe("Datatable onEditingChange signal (#396)", () => {
  it("reports start, then commit (even for an unchanged value), and cancel; sets data-editing", () => {
    const onEditingChange = vi.fn();
    const cols = [{ field: "name" }, { field: "qty", type: "number", editable: true }];
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} onEditingChange={onEditingChange} />);
    dblOpen(container, 0, 1);
    expect(onEditingChange).toHaveBeenLastCalledWith({ key: 1, field: "qty" }, "start");
    expect(container.querySelector(".twc-dt").getAttribute("data-editing")).toBe("");
    // commit unchanged via Enter
    fireEvent.keyDown(container.querySelector(".twc-dt__editor"), { key: "Enter" });
    expect(onEditingChange).toHaveBeenLastCalledWith(null, "commit");
    expect(container.querySelector(".twc-dt").getAttribute("data-editing")).toBeNull();
    // open again, cancel via Escape
    dblOpen(container, 1, 1);
    fireEvent.keyDown(container.querySelector(".twc-dt__editor"), { key: "Escape" });
    expect(onEditingChange).toHaveBeenLastCalledWith(null, "cancel");
  });
});

describe("Datatable onCellsCommit batched clipboard (#394)", () => {
  it("fires once per paste with grouped patches, suppressing per-cell onRowUpdate", async () => {
    const onCellsCommit = vi.fn();
    const onRowUpdate = vi.fn();
    const cols = [{ field: "name", editable: true }, { field: "unit", editable: true }];
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols}
      selectionMode="cell" enableClipboard onCellsCommit={onCellsCommit} onRowUpdate={onRowUpdate} />);
    // focus the top-left data cell then paste a 2x2 block via a synthetic paste event
    const c00 = container.querySelector('.twc-dt__td[data-r="0"][data-c="0"]');
    fireEvent.click(c00);
    const data = "X\tkg\nY\tlb";
    await act(async () => {
      fireEvent.paste(c00, { clipboardData: { getData: () => data } });
    });
    expect(onCellsCommit).toHaveBeenCalledTimes(1);
    const [changes, meta] = onCellsCommit.mock.calls[0];
    expect(meta.source).toBe("paste");
    expect(changes.length).toBe(2); // one grouped patch per row
    expect(onRowUpdate).not.toHaveBeenCalled(); // suppressed in grouped mode
  });
});
