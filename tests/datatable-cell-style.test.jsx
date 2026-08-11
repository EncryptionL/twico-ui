import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #345: per-cell class/style hooks on DatatableColumn — colour the whole `.twc-dt__td` (pinned included)
// from the value/row, not just its content. Called (value, row) to match renderCell/valueFormatter.

const cell = (c, r, col) => c.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${col}"]`);

const columns = [
  {
    field: "name", headerName: "Name", pinned: "left",
    cellClassName: (v) => (v === "Ada" ? "flag-name" : undefined),
    cellStyle: (v) => (v === "Ada" ? { background: "rgb(255, 0, 0)" } : undefined),
  },
  {
    field: "qty", headerName: "Qty", type: "number",
    cellClassName: (v, row) => `qty-${row.id}`,
    cellStyle: (v) => (v > 1 ? { color: "rgb(0, 128, 0)" } : undefined),
  },
  { field: "plain", headerName: "Plain" }, // no hooks
  {
    field: "note", headerName: "Note", pinned: "right", // exercise the right-pin (insetInlineEnd) branch
    cellClassName: (v) => (v === "hi" ? "flag-note" : undefined),
    cellStyle: (v) => (v === "hi" ? { background: "rgb(0, 0, 255)" } : undefined),
  },
];
const rows = [
  { id: 1, name: "Ada", qty: 1, plain: "x", note: "hi" },
  { id: 2, name: "Bob", qty: 3, plain: "y", note: "lo" },
];

describe("Datatable per-cell cellClassName/cellStyle (#345)", () => {
  it("cellClassName is applied to the matching cell only, alongside the base twc-dt__td class", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const ada = cell(container, 0, 0);
    expect(ada.classList.contains("twc-dt__td")).toBe(true); // base class preserved
    expect(ada.classList.contains("flag-name")).toBe(true);
    expect(cell(container, 1, 0).classList.contains("flag-name")).toBe(false); // Bob: predicate false → no class
  });

  it("cellStyle is applied inline to the matching cell only", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(cell(container, 0, 0).style.background).toBe("rgb(255, 0, 0)"); // Ada
    expect(cell(container, 1, 0).style.background).toBe(""); // Bob: none
  });

  it("hooks receive (value, row) — matching renderCell/valueFormatter order", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    // cellClassName(v, row) uses row.id
    expect(cell(container, 0, 1).classList.contains("qty-1")).toBe(true);
    expect(cell(container, 1, 1).classList.contains("qty-2")).toBe(true);
    // cellStyle(v) uses the raw numeric value (qty > 1)
    expect(cell(container, 1, 1).style.color).toBe("rgb(0, 128, 0)"); // Bob qty=3
    expect(cell(container, 0, 1).style.color).toBe(""); // Ada qty=1
  });

  it("honoured on a pinned cell without losing pin positioning", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const ada = cell(container, 0, 0); // pinned:"left"
    expect(ada.getAttribute("data-pin")).toBe("left"); // still sticky-pinned
    expect(ada.style.insetInlineStart).toBe("0px"); // pin offset preserved
    expect(ada.style.background).toBe("rgb(255, 0, 0)"); // user tint applied on the pinned cell
    expect(ada.classList.contains("flag-name")).toBe(true);
  });

  it("honoured on a RIGHT-pinned cell — tint + class apply and insetInlineEnd survives the spread", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const note = container.querySelector('.twc-dt__td[data-r="0"][data-pin="right"]'); // note col, pinned:"right", "hi"
    expect(note).toBeTruthy();
    expect(note.style.insetInlineEnd).toBe("0px"); // rightmost pin offset preserved through ...cellSty, ...st.style
    expect(note.style.position).toBe("sticky"); // stickiness re-asserted even against a cellStyle
    expect(note.style.background).toBe("rgb(0, 0, 255)");
    expect(note.classList.contains("flag-note")).toBe(true);
  });

  it("cellStyle applies in diff mode and wins over the data-op row background", () => {
    const from = [{ id: 1, name: "Ada", qty: 1, plain: "x", note: "hi" }];
    const to = [{ id: 1, name: "Ada", qty: 5, plain: "x", note: "hi" }]; // qty changed → modified row
    const { container } = render(<Datatable columns={columns} diff={{ from, to, rowKey: (r) => r.id, onlyChanged: false }} />);
    const modified = container.querySelector('tr[data-op="modified"]');
    expect(modified).toBeTruthy();
    // diff mode prepends a pinned op-indicator column, so target the actual name cell by its content.
    const nameCell = [...modified.querySelectorAll(".twc-dt__td")].find((td) => td.textContent.includes("Ada"));
    expect(nameCell).toBeTruthy();
    expect(nameCell.style.background).toBe("rgb(255, 0, 0)"); // cellStyle tint survives the diff row bg
  });

  it("a column with no hooks yields a plain cell (only the base class, no injected style)", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const plain = cell(container, 0, 2);
    expect(plain.className).toBe("twc-dt__td");
    expect(plain.style.background).toBe("");
    expect(plain.style.color).toBe("");
  });

  it("the hook functions are invoked once per rendered cell with the cell value + its row", () => {
    const spy = vi.fn((v, row) => (row.id === 2 ? "hit" : undefined));
    const cols = [{ field: "name", headerName: "Name", cellClassName: spy }];
    render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
    expect(spy).toHaveBeenCalledWith("Ada", rows[0]);
    expect(spy).toHaveBeenCalledWith("Bob", rows[1]);
  });
});
