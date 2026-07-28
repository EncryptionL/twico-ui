import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #286 — a leading toolbar slot for host controls (e.g. an "Add row" button), mirroring CardGrid's toolbar.
const cols = [{ field: "name", headerName: "Name" }, { field: "age", headerName: "Age", type: "number" }];
const rows = [{ id: 1, name: "Ada", age: 1 }];

describe("Datatable toolbarActions slot (#286)", () => {
  it("renders the node in a leading slot, before the built-in Columns button", () => {
    const { container, getByTestId } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id}
        toolbarActions={<button data-testid="add-row">Add row</button>} />
    );
    const slot = container.querySelector(".twc-dt__toolbar-actions");
    expect(slot).toBeTruthy();
    expect(slot.contains(getByTestId("add-row"))).toBe(true);
    // leading: the slot precedes the Columns button in the toolbar's DOM order
    const columnsBtn = Array.from(container.querySelectorAll(".twc-dt__toolbar .twc-dt__tbtn"))
      .find((b) => b.textContent.includes("Columns"));
    expect(slot.compareDocumentPosition(columnsBtn) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("omits the slot entirely when toolbarActions is not provided", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
    expect(container.querySelector(".twc-dt__toolbar-actions")).toBeNull();
  });
});
