import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #286 — a toolbar slot for host controls (e.g. an "Add row" button), mirroring CardGrid's toolbar.
//
// The slot was originally LEADING, before the built-in Columns/Filters cluster. It now sits AFTER the
// built-ins (Columns, Filters, Density, Aggregation, Pivot, Export) and BEFORE the search, so host
// controls read as an extension of the built-in buttons rather than displacing them, and the search
// keeps the right-hand edge. This test asserted the old order and is updated deliberately: it was
// guarding real behaviour, and the behaviour changed.
const cols = [{ field: "name", headerName: "Name" }, { field: "age", headerName: "Age", type: "number" }];
const rows = [{ id: 1, name: "Ada", age: 1 }];

describe("Datatable toolbarActions slot (#286)", () => {
  it("renders the node after the built-in Columns button and before the search", () => {
    const { container, getByTestId } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} searchable
        toolbarActions={<button data-testid="add-row">Add row</button>} />
    );
    const slot = container.querySelector(".twc-dt__toolbar-actions");
    expect(slot).toBeTruthy();
    expect(slot.contains(getByTestId("add-row"))).toBe(true);

    const columnsBtn = Array.from(container.querySelectorAll(".twc-dt__toolbar .twc-dt__tbtn"))
      .find((b) => b.textContent.includes("Columns"));
    // the Columns button now PRECEDES the slot
    expect(columnsBtn.compareDocumentPosition(slot) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // ...and the search still follows the slot, so it keeps the right-hand edge
    const search = container.querySelector(".twc-dt__toolbar .twc-dt__search");
    expect(search).toBeTruthy();
    expect(slot.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("omits the slot entirely when toolbarActions is not provided", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
    expect(container.querySelector(".twc-dt__toolbar-actions")).toBeNull();
  });
});
