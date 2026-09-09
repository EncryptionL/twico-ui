import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #369 — a RUNTIME "Combine columns…" (the ⋮-menu editor, surfaced here via initialState.columnCombine) into a
// TARGET column that already has a valueGetter/renderCell used to silently no-op: sources hid, but the target
// kept showing only its own value. A runtime combine is an explicit user action, so it now applies the
// source-join value + render even over the target's own getter/renderer. A DECLARATIVE `combine` is unchanged.

const rows = [
  { id: 1, code: "A1", city: "Paris" },
  { id: 2, code: "B2", city: "Berlin" },
];
// A synthetic column whose value comes from a sidecar lookup — it MUST supply a valueGetter (getColVal falls
// back to row[field], which doesn't exist here), which is exactly what used to disqualify it from combining.
const SIDE = { A1: "EMEA-1", B2: "EMEA-2" };
const getterCol = { field: "region", headerName: "Region", valueGetter: (r) => SIDE[r.code] };
const cityCol = { field: "city", headerName: "City" };
// Seed the runtime combine the way the ⋮ editor's Apply does (userCombine[target] = { fields:[target,...src] }).
const runtimeCombine = (target, ...sources) => ({
  columnCombine: { [target]: { fields: [target, ...sources], layout: "inline", separator: " · ", labels: false } },
});
const combinedCell = (c) => c.querySelector(".twc-dt__combine");
const bodyRows = (c) => c.querySelectorAll("tbody tr.twc-dt__row").length;

describe("Datatable runtime combine into a valueGetter/renderCell target (#369)", () => {
  it("applies the source-join value + render even though the target has a valueGetter", () => {
    const { container } = render(
      <Datatable rowKey={(r) => r.id} rows={rows} columns={[getterCol, cityCol]} initialState={runtimeCombine("region", "city")} />,
    );
    const cell = combinedCell(container);
    expect(cell).toBeTruthy(); // renderCombined runs now (used to be silently skipped)
    expect(cell.textContent).toContain("EMEA-1"); // the target's OWN getter value, via getColVal
    expect(cell.textContent).toContain("Paris"); // the combined source
  });

  it("the combined value (not the target's getter alone) drives quick-search", () => {
    const { container } = render(
      <Datatable rowKey={(r) => r.id} rows={rows} columns={[getterCol, cityCol]} initialState={runtimeCombine("region", "city")} />,
    );
    expect(bodyRows(container)).toBe(2);
    fireEvent.change(container.querySelector(".twc-dt__search input"), { target: { value: "Berlin" } }); // a SOURCE value
    expect(bodyRows(container)).toBe(1);
    expect(combinedCell(container).textContent).toContain("EMEA-2");
  });

  it("a runtime combine overrides the target's own renderCell", () => {
    const withRender = [
      { field: "region", headerName: "Region", renderCell: () => <span data-testid="own">own</span> },
      cityCol,
    ];
    const withRegionRows = [{ id: 1, region: "EMEA", city: "Paris" }];
    const { container, queryByTestId } = render(
      <Datatable rowKey={(r) => r.id} rows={withRegionRows} columns={withRender} initialState={runtimeCombine("region", "city")} />,
    );
    expect(combinedCell(container)).toBeTruthy(); // combined render wins
    expect(container.querySelector("tbody").textContent).toContain("EMEA");
    expect(container.querySelector("tbody").textContent).toContain("Paris");
    expect(queryByTestId("own")).toBeNull(); // the consumer renderCell is overridden by the explicit combine
  });

  it("a runtime combine overrides a target that has BOTH a valueGetter AND a renderCell", () => {
    const bothCol = { field: "region", headerName: "Region", valueGetter: (r) => SIDE[r.code], renderCell: () => <span data-testid="own">own</span> };
    const { container, queryByTestId } = render(
      <Datatable rowKey={(r) => r.id} rows={rows} columns={[bothCol, cityCol]} initialState={runtimeCombine("region", "city")} />,
    );
    const cell = combinedCell(container);
    expect(cell).toBeTruthy(); // combined render wins over the consumer renderCell...
    expect(queryByTestId("own")).toBeNull();
    expect(cell.textContent).toContain("EMEA-1"); // ...and the getter value feeds the join
    expect(cell.textContent).toContain("Paris");
    fireEvent.change(container.querySelector(".twc-dt__search input"), { target: { value: "Berlin" } }); // join drives search
    expect(bodyRows(container)).toBe(1);
  });

  it("a DECLARATIVE combine with a valueGetter is unchanged — shows the consumer value, not the source-join", () => {
    const { container } = render(
      <Datatable rowKey={(r) => r.id} rows={rows}
        columns={[{ field: "region", headerName: "Region", combine: ["city"], valueGetter: (r) => `only-${r.code}` }, cityCol]} />,
    );
    const td = container.querySelector("tbody tr.twc-dt__row .twc-dt__td");
    expect(td.textContent).toContain("only-A1"); // the consumer's declarative value wins
    expect(combinedCell(container)).toBeNull(); // renderCombined NOT used (declarative precedence preserved)
  });
});
