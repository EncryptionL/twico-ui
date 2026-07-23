import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #273 — Esc cancels a cell edit (discards, restores the original value), for the built-in editor AND
// custom `renderEditCell` editors. The edit wrapper handles Escape so custom editors don't each wire it.
describe("Datatable Esc cancels a cell edit (#273)", () => {
  it("built-in text editor: Esc discards the change (no commit) and closes the editor", () => {
    const onRowUpdate = vi.fn();
    const { container } = render(
      <Datatable rowKey={(r) => r.id} onRowUpdate={onRowUpdate}
        columns={[{ field: "name", headerName: "Name", editable: true }]} rows={[{ id: 1, name: "Ada" }]} />
    );
    fireEvent.doubleClick(container.querySelector("tbody .twc-dt__td"));
    const input = container.querySelector(".twc-dt__editor");
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: "Changed" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(container.querySelector(".twc-dt__editor")).toBeNull(); // editor closed
    expect(onRowUpdate).not.toHaveBeenCalled();                    // nothing committed
    expect(container.querySelector("tbody .twc-dt__td").textContent).toContain("Ada"); // original kept
  });

  it("custom renderEditCell: Esc bubbling from the editor cancels via the wrapper (no per-editor keydown)", () => {
    const onRowUpdate = vi.fn();
    const editorCols = [{
      field: "supplier", headerName: "Supplier",
      // a custom editor that only destructures value — no cancel/keydown wiring of its own
      renderEditCell: ({ value }) => <input data-testid="custom-input" defaultValue={String(value)} onChange={() => {}} />,
    }];
    const { container, getByTestId, queryByTestId } = render(
      <Datatable rowKey={(r) => r.id} onRowUpdate={onRowUpdate} columns={editorCols} rows={[{ id: 1, supplier: "acme" }]} />
    );
    fireEvent.doubleClick(container.querySelector("tbody .twc-dt__td"));
    expect(getByTestId("custom-input")).toBeTruthy();
    // Escape fired from the inner control bubbles up to the editor-wrap handler
    fireEvent.keyDown(getByTestId("custom-input"), { key: "Escape" });
    expect(queryByTestId("custom-input")).toBeNull(); // editor closed
    expect(onRowUpdate).not.toHaveBeenCalled();
  });

  it("a custom control can keep Esc for itself by stopping propagation (wrapper then leaves the edit open)", () => {
    const editorCols = [{
      field: "supplier", headerName: "Supplier",
      renderEditCell: ({ value }) => (
        <input data-testid="custom-input" defaultValue={String(value)} onChange={() => {}}
          onKeyDown={(e) => { if (e.key === "Escape") e.stopPropagation(); }} />
      ),
    }];
    const { container, getByTestId } = render(
      <Datatable rowKey={(r) => r.id} columns={editorCols} rows={[{ id: 1, supplier: "acme" }]} />
    );
    fireEvent.doubleClick(container.querySelector("tbody .twc-dt__td"));
    fireEvent.keyDown(getByTestId("custom-input"), { key: "Escape" });
    expect(getByTestId("custom-input")).toBeTruthy(); // stayed open — the control consumed Escape
  });
});
