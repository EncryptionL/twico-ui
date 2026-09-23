import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";
import { Combobox } from "../components/inputs/Combobox.jsx";

// #412 editor Escape vs nested dropdown + Combobox blur; #413 setDraft patch on click-away; #424 per-row editable.
const rows = [
  { id: 1, name: "Ann", qty: 1, unit: "kg", status: "draft" },
  { id: 2, name: "Bo", qty: 2, unit: "kg", status: "final" },
];
const RECT = { top: 80, left: 80, right: 260, bottom: 120, width: 180, height: 40, x: 80, y: 80, toJSON() {} };
let origRect;
beforeEach(() => { origRect = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
afterEach(() => { Element.prototype.getBoundingClientRect = origRect; cleanup(); vi.restoreAllMocks(); });
const dblOpen = (c, r, col) => fireEvent.doubleClick(c.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${col}"]`));

describe("Datatable editor Escape ignores a nested-dropdown Escape (#412)", () => {
  it("a defaultPrevented Escape inside the editor does not cancel the edit; a plain Escape does", () => {
    const onEditingChange = vi.fn();
    const cols = [
      { field: "name" },
      { field: "qty", editable: true, renderEditCell: () => <input data-testid="ed" defaultValue="x" /> },
    ];
    const { container, getByTestId } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} onEditingChange={onEditingChange} />);
    dblOpen(container, 0, 1);
    const ed = getByTestId("ed");
    // a nested control consumed Escape (preventDefault) to close its own list → the wrapper must NOT cancel
    const consumed = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    consumed.preventDefault();
    ed.dispatchEvent(consumed);
    expect(onEditingChange).not.toHaveBeenCalledWith(null, "cancel");
    // a plain (unconsumed) Escape cancels
    fireEvent.keyDown(ed, { key: "Escape" });
    expect(onEditingChange).toHaveBeenLastCalledWith(null, "cancel");
  });
});

describe("Combobox Escape keeps focus (#412)", () => {
  it("closes the list on Escape without blurring the input", () => {
    const { getByRole } = render(<Combobox options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />);
    const input = getByRole("combobox");
    input.focus();
    fireEvent.change(input, { target: { value: "a" } }); // open the list
    fireEvent.keyDown(input, { key: "Escape" });
    expect(document.activeElement).toBe(input); // focus stays in the input (was blurred to <body> before)
  });
});

describe("Datatable renderEditCell staged patch on click-away (#413)", () => {
  it("commits a staged { patch } via the multi-key path on click-away", () => {
    const onRowUpdate = vi.fn();
    const cols = [
      { field: "name" },
      { field: "qty", editable: true, renderEditCell: ({ setDraft }) => (
        <input data-testid="ed" onChange={() => setDraft({ qty: 9, unit: "lb" }, { patch: true, silent: true })} />
      ) },
    ];
    const { container, getByTestId } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} onRowUpdate={onRowUpdate} />);
    dblOpen(container, 0, 1);
    fireEvent.change(getByTestId("ed"), { target: { value: "typing" } }); // stages a patch silently
    fireEvent.mouseDown(document.body); // click away
    expect(onRowUpdate).toHaveBeenCalledTimes(1);
    const updated = onRowUpdate.mock.calls[0][0];
    expect(updated.qty).toBe(9);
    expect(updated.unit).toBe("lb");
  });
});

describe("Datatable per-row editable predicate (#424)", () => {
  const cols = [
    { field: "name" },
    { field: "qty", type: "number", editable: (row) => row.status === "draft" },
  ];
  it("only rows satisfying the predicate become editable", () => {
    const onRowUpdate = vi.fn();
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} onRowUpdate={onRowUpdate} />);
    // row 0 (draft) editable → double-click opens an editor
    dblOpen(container, 0, 1);
    expect(container.querySelector(".twc-dt__editor, .twc-dt__editor-wrap")).toBeTruthy();
    fireEvent.keyDown(container.querySelector(".twc-dt__editor"), { key: "Escape" });
    // row 1 (final) NOT editable → double-click does nothing
    dblOpen(container, 1, 1);
    expect(container.querySelector(".twc-dt__editor, .twc-dt__editor-wrap")).toBeNull();
    // and the non-editable cell has no data-editable flag
    const finalCell = container.querySelector('.twc-dt__td[data-r="1"][data-c="1"]');
    expect(finalCell.getAttribute("data-editable")).toBeNull();
  });
});
