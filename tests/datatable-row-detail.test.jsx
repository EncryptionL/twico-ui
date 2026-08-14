import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #350 (first pass): expandable/collapsible rows. `renderRowDetail(row)` returns a per-row detail panel
// (null ⇒ not expandable). Presence enables a leading chevron column + a full-width detail <tr>.

const columns = [
  { field: "name", headerName: "Name" },
  { field: "qty", headerName: "Qty", type: "number" },
];
const rows = [
  { id: 1, name: "Ada", qty: 1 },
  { id: 2, name: "Bob", qty: 2 },
];
const detail = (row) => <div data-testid={`detail-${row.id}`}>More about {row.name}</div>;

describe("Datatable expandable rows (#350)", () => {
  it("renders no expand column when renderRowDetail is absent", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(container.querySelector(".twc-dt__expand-cell")).toBeNull();
    expect(container.querySelector(".twc-dt__expand-btn")).toBeNull();
  });

  it("renders a chevron per expandable row + a header expand column", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} renderRowDetail={detail} />);
    expect(container.querySelector('thead .twc-dt__expand-cell')).toBeTruthy(); // header placeholder th
    expect(container.querySelectorAll(".twc-dt__expand-btn").length).toBe(2);
    expect(container.querySelector(".twc-dt__detail-row")).toBeNull(); // collapsed by default
  });

  it("clicking the chevron expands a full-width detail row and flips aria-expanded", () => {
    const { container, queryByTestId } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} renderRowDetail={detail} />);
    fireEvent.click(container.querySelector(".twc-dt__expand-btn"));
    const detailRow = container.querySelector(".twc-dt__detail-row");
    expect(detailRow).toBeTruthy();
    expect(queryByTestId("detail-1")).toBeTruthy();
    // detail cell spans every column (2 data cols + the expand col = 3)
    expect(detailRow.querySelector(".twc-dt__detail-cell").getAttribute("colspan")).toBe("3");
    expect(container.querySelector(".twc-dt__expand-btn").getAttribute("aria-expanded")).toBe("true");
    // collapse again
    fireEvent.click(container.querySelector(".twc-dt__expand-btn"));
    expect(container.querySelector(".twc-dt__detail-row")).toBeNull();
    expect(container.querySelector(".twc-dt__expand-btn").getAttribute("aria-expanded")).toBe("false");
  });

  it("a row whose renderRowDetail returns null gets no chevron (not expandable)", () => {
    const only1 = (row) => (row.id === 1 ? detail(row) : null);
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} renderRowDetail={only1} />);
    // the expand column still exists (feature on), but only row 1 has a toggle button
    expect(container.querySelectorAll(".twc-dt__expand-cell").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".twc-dt__expand-btn").length).toBe(1);
  });

  it("controlled expandedRowIds drives visibility and onExpandedRowsChange fires the next key set", () => {
    const onExpandedRowsChange = vi.fn();
    const { container, rerender } = render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id} renderRowDetail={detail} expandedRowIds={[]} onExpandedRowsChange={onExpandedRowsChange} />,
    );
    expect(container.querySelector(".twc-dt__detail-row")).toBeNull();
    fireEvent.click(container.querySelector(".twc-dt__expand-btn"));
    expect(onExpandedRowsChange).toHaveBeenCalledWith([1]); // row 1's key
    // controlled: nothing opens until the parent updates the prop
    expect(container.querySelector(".twc-dt__detail-row")).toBeNull();
    rerender(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} renderRowDetail={detail} expandedRowIds={[1]} onExpandedRowsChange={onExpandedRowsChange} />);
    expect(container.querySelector(".twc-dt__detail-row")).toBeTruthy();
  });

  it("the chevron toggle does not trigger row selection (selectionMode='row')", () => {
    const onRowClick = vi.fn();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} renderRowDetail={detail} selectionMode="row" onRowClick={onRowClick} />);
    fireEvent.click(container.querySelector(".twc-dt__expand-btn"));
    expect(onRowClick).not.toHaveBeenCalled(); // guarded (button click) + stopPropagation
    expect(container.querySelector(".twc-dt__detail-row")).toBeTruthy();
  });
});
