import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, within } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const cols = [
  { field: "name", headerName: "Name" },
  { field: "color", headerName: "Color" },
  { field: "price", headerName: "Price", type: "number" },
];
const A = [
  { id: 1, name: "Alpha", color: "red", price: 10 },
  { id: 2, name: "Beta", color: "blue", price: 20 },
  { id: 3, name: "Gamma", color: "green", price: 30 },
];
const B = [
  { id: 1, name: "Alpha", color: "crimson", price: 10 }, // modified
  { id: 3, name: "Gamma", color: "green", price: 30 }, // unchanged
  { id: 4, name: "Delta", color: "black", price: 40 }, // added
];

const opRows = (container, op) => container.querySelectorAll(`tr[data-op="${op}"]`);

// #239 — Datatable `diff` mode: pair from/to, classify, render before→after through the engine.
describe("Datatable diff mode (#239)", () => {
  it("prepends a Change op column and classifies paired rows", () => {
    const { container } = render(<Datatable columns={cols} diff={{ from: A, to: B, rowKey: (r) => r.id, onlyChanged: false }} />);
    expect(within(container).getByText("Change")).toBeTruthy(); // op column header
    expect(opRows(container, "modified").length).toBe(1);
    expect(opRows(container, "added").length).toBe(1);
    expect(opRows(container, "removed").length).toBe(1);
    expect(opRows(container, "unchanged").length).toBe(1);
  });

  it("renders modified cells as before → after (single-line change span)", () => {
    const { container } = render(<Datatable columns={cols} diff={{ from: A, to: B, rowKey: (r) => r.id, onlyChanged: false }} />);
    const change = opRows(container, "modified")[0].querySelector(".twc-dt__diff-change");
    expect(change.querySelector(".twc-dt__diff-old").textContent).toBe("red");
    expect(change.querySelector(".twc-dt__diff-new").textContent).toBe("crimson");
  });

  it("works with no `rows` prop and fires onClassified with the counts", () => {
    const onClassified = vi.fn();
    const { container } = render(<Datatable columns={cols} diff={{ from: A, to: B, rowKey: (r) => r.id, onClassified }} />);
    expect(container.querySelector(".twc-dt")).toBeTruthy();
    expect(onClassified).toHaveBeenCalledWith(expect.objectContaining({ added: 1, removed: 1, modified: 1, unchanged: 1 }));
  });

  it("honors a per-column compare override", () => {
    const c2 = [{ field: "name" }, { field: "color", compare: () => true }, { field: "price", type: "number" }];
    const { container } = render(<Datatable columns={c2} diff={{ from: A, to: B, rowKey: (r) => r.id, onlyChanged: false }} />);
    // only `color` changed on id 1, and it's forced-equal → no modified rows
    expect(opRows(container, "modified").length).toBe(0);
  });

  it("inherits the engine chrome — density + export toolbar buttons render in diff mode", () => {
    const { container } = render(
      <Datatable columns={cols} showDensity showExport density="compact"
        diff={{ from: A, to: B, rowKey: (r) => r.id }} />,
    );
    expect(within(container).getByText("Compact")).toBeTruthy(); // density button
    expect(within(container).getByText("Export")).toBeTruthy(); // export button
    // only-changed toggle present by default
    expect(container.querySelector(".twc-dt__diff-toggle input")).toBeTruthy();
  });
});
