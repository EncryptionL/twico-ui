import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #313 — the DEFAULT cell editor (no renderEditCell) used to DISCARD a typed value on click-away: the
// capture-phase outside-click handler called setEditing(null) before the input's onBlur→commit could run.
// It now COMMITS the pending value on click-away (spreadsheet-like). A renderEditCell column keeps its own
// commit/cancel semantics (dismissed, not force-committed).

describe("Datatable default editor commits on click-away (#313)", () => {
  it("commits the typed value when the user clicks outside (not just on Enter)", () => {
    const onRowUpdate = vi.fn();
    const { container } = render(
      <Datatable rowKey={(r) => r.id} onRowUpdate={onRowUpdate}
        columns={[{ field: "name", headerName: "Name", editable: true }]} rows={[{ id: 1, name: "Ada" }]} />
    );
    fireEvent.doubleClick(container.querySelector("tbody .twc-dt__td"));
    const input = container.querySelector(".twc-dt__editor");
    fireEvent.change(input, { target: { value: "Changed" } });
    // click away — capture-phase mousedown outside the editor
    fireEvent.mouseDown(document.body);
    expect(container.querySelector(".twc-dt__editor")).toBeNull(); // editor closed
    expect(onRowUpdate).toHaveBeenCalledTimes(1);
    expect(onRowUpdate.mock.calls[0][0]).toMatchObject({ id: 1, name: "Changed" }); // committed value
    expect(onRowUpdate.mock.calls[0][2]).toBe("name"); // field
  });

  it("does not fire onRowUpdate when the value is unchanged on click-away", () => {
    const onRowUpdate = vi.fn();
    const { container } = render(
      <Datatable rowKey={(r) => r.id} onRowUpdate={onRowUpdate}
        columns={[{ field: "name", headerName: "Name", editable: true }]} rows={[{ id: 1, name: "Ada" }]} />
    );
    fireEvent.doubleClick(container.querySelector("tbody .twc-dt__td"));
    fireEvent.mouseDown(document.body); // click away without changing
    expect(container.querySelector(".twc-dt__editor")).toBeNull();
    expect(onRowUpdate).not.toHaveBeenCalled();
  });

  it("a renderEditCell column keeps its own semantics — click-away dismisses without force-commit", () => {
    const onRowUpdate = vi.fn();
    const cols = [{
      field: "supplier", headerName: "Supplier",
      renderEditCell: ({ value }) => <input data-testid="custom" defaultValue={String(value)} onChange={() => {}} />,
    }];
    const { container, getByTestId, queryByTestId } = render(
      <Datatable rowKey={(r) => r.id} onRowUpdate={onRowUpdate} columns={cols} rows={[{ id: 1, supplier: "acme" }]} />
    );
    fireEvent.doubleClick(container.querySelector("tbody .twc-dt__td"));
    expect(getByTestId("custom")).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(queryByTestId("custom")).toBeNull();       // dismissed
    expect(onRowUpdate).not.toHaveBeenCalled();        // custom editor drives its own commit
  });
});
