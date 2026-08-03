import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #324 — controlled active row for selectionMode="row": when activeRowId is provided the highlight follows
// the prop (not internal state), onRowClick still fires, and null clears it. Uncontrolled still works.
const cols = [{ field: "name", headerName: "Name" }];
const rows = [{ id: 1, name: "Ada" }, { id: 2, name: "Ben" }, { id: 3, name: "Cy" }];
const activeText = (c) => { const el = c.querySelector('.twc-dt__row[data-active="true"]'); return el ? el.textContent : null; };
const rowByText = (c, t) => Array.from(c.querySelectorAll("tbody .twc-dt__row")).find((r) => (r.textContent || "").includes(t));

describe("Datatable controlled active row (#324)", () => {
  it("highlights the row from activeRowId; a click reports via onRowClick but does NOT move the highlight", () => {
    const onRowClick = vi.fn();
    const { container, rerender } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} selectionMode="row" activeRowId={2} onRowClick={onRowClick} />);
    expect(activeText(container)).toContain("Ben"); // id 2 from the prop
    fireEvent.click(rowByText(container, "Ada"));
    expect(onRowClick).toHaveBeenCalledWith(rows[0], 1);   // click still reported
    expect(activeText(container)).toContain("Ben");         // highlight unchanged (controlled)
    rerender(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} selectionMode="row" activeRowId={1} onRowClick={onRowClick} />);
    expect(activeText(container)).toContain("Ada");         // the prop drives the highlight
  });

  it("activeRowId={null} clears the highlight", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} selectionMode="row" activeRowId={null} />);
    expect(activeText(container)).toBeNull();
  });

  it("uncontrolled (no activeRowId): clicking a row highlights it (back-compat)", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} selectionMode="row" />);
    expect(activeText(container)).toBeNull();
    fireEvent.click(rowByText(container, "Cy"));
    expect(activeText(container)).toContain("Cy");
  });
});
