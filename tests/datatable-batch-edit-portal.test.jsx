import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";
import { Select } from "../components/inputs/Select.jsx";

// #250 — twico's overlays (Select/Combobox listboxes) PORTAL to document.body as `.twc-pop`, a subtree
// disjoint from the inline `.twc-dt__pop` batch popover. The editor's outside-click handler must exempt
// them, exactly as the inline cell editor does — otherwise the option's mousedown (which bubbles; its
// `preventDefault` does not stop propagation) dismisses the editor before the option's onClick can fire.
//
// These tests must fire a REAL `mousedown` against a REAL portaled control: the pre-existing batch-edit
// suite uses `fireEvent.click` on an inline fixture, so it cannot fail on this.
const cols = [
  { field: "name", headerName: "Name", editable: true },
  { field: "color", headerName: "Color", editable: true },
];
const rows = [{ id: 1, name: "Ada", color: "red" }, { id: 2, name: "Ben", color: "blue" }];
const BA = [{ label: "Delete", onClick: () => {} }];

const selectFirstRow = (c) => fireEvent.click(c.querySelectorAll('[aria-label="Select row"]')[0]);
const editBtn = (c) => Array.from(c.querySelectorAll(".twc-dt__batch-btn")).find((b) => b.textContent.includes("Edit"));
const editorOpen = () => !!document.querySelector(".twc-dt__cfg");
const optionByText = (t) => Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent.trim() === t);
// A real pointer press: mousedown (bubbles to the document dismiss listener) THEN click.
const press = (el) => { fireEvent.mouseDown(el); fireEvent.click(el); };

describe("Datatable batch editor vs portaled dropdowns (#250)", () => {
  let orig;
  beforeEach(() => {
    orig = Element.prototype.getBoundingClientRect;
    // The floating popover bails on all-zero rects (jsdom).
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 130, left: 100, right: 260, width: 160, height: 30, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

  const openEditor = (container) => { selectFirstRow(container); fireEvent.click(editBtn(container)); };

  it("the built-in 'Add a column…' picker survives a real mousedown on its portaled option", () => {
    const { container } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} onBatchUpdate={() => {}} />,
    );
    openEditor(container);
    expect(editorOpen()).toBe(true);

    fireEvent.click(document.querySelector(".twc-dt__be-add .twc-sel__trigger"));
    const opt = optionByText("Color");
    // Guard the premise: the option really is portaled OUTSIDE the batch popover.
    expect(opt.closest(".twc-dt__pop")).toBeNull();

    press(opt);
    expect(editorOpen()).toBe(true); // not dismissed by its own picker
    expect(document.querySelectorAll(".twc-dt__be-row").length).toBe(1); // the clause was actually added
  });

  it("a renderBatchEditCell control's portaled dropdown can be clicked without dismissing the editor", () => {
    const withCustom = [
      cols[0],
      {
        field: "color", headerName: "Color", editable: true,
        // The real-world case (#247): a master-backed combobox, which portals its listbox.
        renderBatchEditCell: ({ value, commit }) => (
          <Select size="sm" portal value={value ?? ""} options={[{ value: "teal", label: "teal" }]} onChange={commit} />
        ),
      },
    ];
    let patch = null;
    const { container } = render(
      <Datatable columns={withCustom} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA}
        onBatchUpdate={(_c, p) => { patch = p; }} />,
    );
    openEditor(container);
    fireEvent.click(document.querySelector(".twc-dt__be-add .twc-sel__trigger"));
    press(optionByText("Color"));
    expect(editorOpen()).toBe(true);

    // Open the clause's own portaled dropdown and pick a value.
    fireEvent.click(document.querySelector(".twc-dt__be-row .twc-sel__trigger"));
    press(optionByText("teal"));
    expect(editorOpen()).toBe(true); // still open — the value was staged, not dismissed

    fireEvent.click(Array.from(document.querySelectorAll(".twc-dt__cfg-btn")).find((b) => b.textContent.includes("Apply")));
    expect(patch).toEqual({ color: "teal" });
  });

  it("still dismisses on a mousedown genuinely outside the editor and its overlays", () => {
    const { container } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} onBatchUpdate={() => {}} />,
    );
    openEditor(container);
    expect(editorOpen()).toBe(true);
    fireEvent.mouseDown(document.body);
    expect(editorOpen()).toBe(false);
  });
});
