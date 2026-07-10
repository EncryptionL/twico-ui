import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import { DiffTable } from "../components/data-display/DiffTable.jsx";

const cols = [
  { field: "name", headerName: "Name" },
  { field: "color", headerName: "Color" },
  { field: "price", headerName: "Price", valueFormatter: (v) => `$${v}` },
];
const A = [
  { id: 1, name: "Alpha", color: "red", price: 10 },
  { id: 2, name: "Beta", color: "blue", price: 20 },
  { id: 3, name: "Gamma", color: "green", price: 30 },
];
const B = [
  { id: 1, name: "Alpha", color: "crimson", price: 10 }, // modified: color
  { id: 3, name: "Gamma", color: "green", price: 30 }, // unchanged
  { id: 4, name: "Delta", color: "black", price: 40 }, // added
];
// id 2 is removed.

const rowsByOp = (op) => document.querySelectorAll(`tr[data-op="${op}"]`);

// #205 — DiffTable: classify added/removed/modified/moved with per-cell before→after.
describe("DiffTable (#205)", () => {
  it("classifies added / removed / modified / unchanged", () => {
    render(<DiffTable from={A} to={B} rowKey={(r) => r.id} columns={cols} onlyChanged={false} />);
    expect(rowsByOp("modified").length).toBe(1);
    expect(rowsByOp("added").length).toBe(1);
    expect(rowsByOp("removed").length).toBe(1);
    expect(rowsByOp("unchanged").length).toBe(1);
  });

  it("renders a modified cell as before → after", () => {
    render(<DiffTable from={A} to={B} rowKey={(r) => r.id} columns={cols} onlyChanged={false} />);
    const modified = rowsByOp("modified")[0];
    const change = modified.querySelector(".twc-difft__change");
    expect(change).toBeTruthy();
    expect(change.querySelector(".twc-difft__old").textContent).toBe("red");
    expect(change.querySelector(".twc-difft__new").textContent).toBe("crimson");
    // Unchanged cells in a modified row are plain (no before→after).
    expect(within(modified).getByText("Alpha")).toBeTruthy();
  });

  it("hides unchanged rows when onlyChanged (default)", () => {
    render(<DiffTable from={A} to={B} rowKey={(r) => r.id} columns={cols} />);
    expect(rowsByOp("unchanged").length).toBe(0);
    expect(document.querySelectorAll("tbody tr").length).toBe(3); // modified + added + removed
  });

  it("toggling 'only changed' off reveals unchanged rows", () => {
    const { container } = render(<DiffTable from={A} to={B} rowKey={(r) => r.id} columns={cols} />);
    expect(rowsByOp("unchanged").length).toBe(0);
    fireEvent.click(container.querySelector('input[type="checkbox"]'));
    expect(rowsByOp("unchanged").length).toBe(1);
  });

  it("summarizes +added ~modified -removed", () => {
    const { container } = render(<DiffTable from={A} to={B} rowKey={(r) => r.id} columns={cols} />);
    const summary = container.querySelector(".twc-difft__summary").textContent;
    expect(summary).toContain("+1 added");
    expect(summary).toContain("~1 modified");
    expect(summary).toContain("-1 removed");
  });

  it("flags only genuinely-reordered rows as moved (minimal LIS set)", () => {
    const from = [{ id: 1, x: 1 }, { id: 2, x: 2 }, { id: 3, x: 3 }];
    const to = [{ id: 3, x: 3 }, { id: 1, x: 1 }, { id: 2, x: 2 }]; // id 3 jumped to the front
    render(<DiffTable from={from} to={to} rowKey={(r) => r.id} columns={[{ field: "x" }]} onlyChanged={false} />);
    expect(rowsByOp("moved").length).toBe(1);
    expect(rowsByOp("unchanged").length).toBe(2);
    expect(rowsByOp("moved")[0].querySelector(".twc-difft__op").textContent).toBe("Moved");
  });

  it("defaults rowKey to row.id and shows an empty state when identical", () => {
    const { container } = render(<DiffTable from={A} to={A} columns={cols} />);
    expect(container.querySelector(".twc-difft__empty")).toBeTruthy();
  });
});
