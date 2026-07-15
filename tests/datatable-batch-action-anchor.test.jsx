import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const cols = [{ field: "name", headerName: "Name" }];
const rows = [{ id: 1, name: "Ada" }, { id: 2, name: "Ben" }];

const selectFirstRow = (c) => fireEvent.click(c.querySelectorAll('[aria-label="Select row"]')[0]);
const batchBtn = (c, label) => Array.from(c.querySelectorAll(".twc-dt__batch-btn")).find((b) => b.textContent.includes(label));

// #246 — a custom batch action must be able to anchor a popover to its OWN toolbar button, the way the
// built-in batch editor does (`openBatchEditor(e.currentTarget)`). Without the trigger element a host can
// only ever open a centered modal, so a replacement editor can't match the thing it replaces.
describe("Datatable batchAction anchor (#246)", () => {
  it("hands the clicked toolbar button to onClick as ctx.anchorEl", () => {
    let ctx, keys, clear, gotRows;
    const { container } = render(
      <Datatable
        columns={cols}
        rows={rows}
        rowKey={(r) => r.id}
        checkboxSelection
        batchActions={[{ label: "Edit", onClick: (k, r, c, x) => { keys = k; gotRows = r; clear = c; ctx = x; } }]}
      />,
    );
    selectFirstRow(container);
    const btn = batchBtn(container, "Edit");
    fireEvent.click(btn);

    expect(ctx?.anchorEl).toBe(btn); // the very button that was clicked
    expect(ctx.anchorEl instanceof HTMLElement).toBe(true);
    // the pre-existing args still arrive, unchanged and in order (additive, non-breaking)
    expect(keys).toEqual([1]);
    expect(gotRows).toEqual([rows[0]]);
    expect(typeof clear).toBe("function");
  });

  it("gives each action its own button", () => {
    const seen = {};
    const { container } = render(
      <Datatable
        columns={cols}
        rows={rows}
        rowKey={(r) => r.id}
        checkboxSelection
        batchActions={[
          { label: "Edit", onClick: (_k, _r, _c, x) => { seen.edit = x.anchorEl; } },
          { label: "Delete", danger: true, onClick: (_k, _r, _c, x) => { seen.del = x.anchorEl; } },
        ]}
      />,
    );
    selectFirstRow(container);
    fireEvent.click(batchBtn(container, "Edit"));
    fireEvent.click(batchBtn(container, "Delete"));

    expect(seen.edit).toBe(batchBtn(container, "Edit"));
    expect(seen.del).toBe(batchBtn(container, "Delete"));
    expect(seen.edit).not.toBe(seen.del);
  });

  it("an action that ignores the extra arg still works", () => {
    let called = 0;
    const { container } = render(
      <Datatable
        columns={cols}
        rows={rows}
        rowKey={(r) => r.id}
        checkboxSelection
        batchActions={[{ label: "Delete", onClick: () => { called++; } }]}
      />,
    );
    selectFirstRow(container);
    fireEvent.click(batchBtn(container, "Delete"));
    expect(called).toBe(1);
  });
});
