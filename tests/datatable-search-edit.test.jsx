import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const cols = [{ field: "name", headerName: "Name" }, { field: "city", headerName: "City" }];
const rows = [{ id: 1, name: "Ada", city: "Rome" }, { id: 2, name: "Ben", city: "Oslo" }];

// #235 — Datatable can externalize its quick-search (CardGrid parity).
describe("Datatable external search (#235)", () => {
  it("searchable={false} hides the built-in search box", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} columns={cols} rows={rows} searchable={false} />);
    expect(container.querySelector(".twc-dt__search")).toBeNull();
  });

  it("still renders the built-in box by default", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} columns={cols} rows={rows} />);
    expect(container.querySelector(".twc-dt__search")).toBeTruthy();
  });

  it("a controlled quickFilter filters the rows (even with the box hidden)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} columns={cols} rows={rows} searchable={false} quickFilter="Ada" />);
    const body = container.querySelector("tbody").textContent;
    expect(body).toContain("Ada");
    expect(body).not.toContain("Ben");
  });

  it("onQuickFilterChange fires as the user types in the built-in box", () => {
    const onQuickFilterChange = vi.fn();
    const { container } = render(<Datatable rowKey={(r) => r.id} columns={cols} rows={rows} onQuickFilterChange={onQuickFilterChange} />);
    fireEvent.change(container.querySelector(".twc-dt__search input"), { target: { value: "ben" } });
    expect(onQuickFilterChange).toHaveBeenCalledWith("ben");
  });
});

// #236 — renderEditCell escape hatch for the inline cell editor.
describe("Datatable renderEditCell (#236)", () => {
  const editorCols = [{
    field: "supplier", headerName: "Supplier",
    renderEditCell: ({ value, commit }) => (
      <button data-testid="custom-editor" onClick={() => commit("acme-new")}>editor:{String(value)}</button>
    ),
  }];
  const editorRows = [{ id: 1, supplier: "acme" }];

  it("renders the custom editor on double-click (renderEditCell makes the column editable)", () => {
    const { container, getByTestId } = render(<Datatable rowKey={(r) => r.id} columns={editorCols} rows={editorRows} />);
    fireEvent.doubleClick(container.querySelector(".twc-dt__td"));
    expect(getByTestId("custom-editor").textContent).toBe("editor:acme");
  });

  it("commit(nextValue) saves via onRowUpdate", () => {
    const onRowUpdate = vi.fn();
    const { container, getByTestId } = render(<Datatable rowKey={(r) => r.id} columns={editorCols} rows={editorRows} onRowUpdate={onRowUpdate} />);
    fireEvent.doubleClick(container.querySelector(".twc-dt__td"));
    fireEvent.click(getByTestId("custom-editor"));
    expect(onRowUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, supplier: "acme-new" }),
      expect.objectContaining({ supplier: "acme" }),
      "supplier",
    );
  });

  it("editable={false} still blocks editing even with renderEditCell", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={editorRows}
      columns={[{ ...editorCols[0], editable: false }]} />);
    fireEvent.doubleClick(container.querySelector(".twc-dt__td"));
    expect(container.querySelector('[data-testid="custom-editor"]')).toBeNull();
  });
});
