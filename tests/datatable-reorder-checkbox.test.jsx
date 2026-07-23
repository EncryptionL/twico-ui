import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #261 — with BOTH checkboxSelection and rowReorder, the drag-reorder grip and the selection checkbox
// share the single leading pinned cell. That cell has `overflow: hidden`, so a 44px width (20px content
// area after padding) clipped the checkbox. It must widen to fit grip + gap + checkbox.

const columns = [
  { field: "order", headerName: "Order", type: "number", width: 110 },
  { field: "name", headerName: "Name" },
];
const rows = [
  { id: 1, order: 1, name: "Ava" },
  { id: 2, order: 2, name: "Liam" },
];

const selectHeader = (c) => c.querySelector('.twc-dt__th[aria-label="Select"]');
const firstCheckboxCell = (c) => c.querySelector('.twc-dt__check[aria-label="Select row"]')?.closest("td");
const rowNumHeader = (c) => c.querySelector('th.twc-dt__rownum');

describe("Datatable reorder + checkbox leading cell (#261)", () => {
  it("widens the leading checkbox column when rowReorder is also enabled (header + body stay aligned)", () => {
    const { container } = render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id} checkboxSelection rowReorder onRowOrderChange={() => {}} />
    );
    expect(selectHeader(container).style.width).toBe("68px");
    expect(selectHeader(container).style.minWidth).toBe("68px");
    // body cell matches the header so the sticky column doesn't misalign
    expect(firstCheckboxCell(container).style.width).toBe("68px");
  });

  it("keeps the compact 44px width when only checkboxSelection is enabled (no grip in the cell)", () => {
    const { container } = render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id} checkboxSelection />
    );
    expect(selectHeader(container).style.width).toBe("44px");
    expect(firstCheckboxCell(container).style.width).toBe("44px");
  });

  it("offsets the row-number column by the widened checkbox width so it doesn't overlap", () => {
    const { container } = render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id} checkboxSelection rowNumbers rowReorder onRowOrderChange={() => {}} />
    );
    // row-number column starts where the (now 68px) checkbox column ends
    expect(rowNumHeader(container).style.insetInlineStart).toBe("68px");
  });
});
