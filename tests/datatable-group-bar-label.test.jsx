import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #387: rowGrouping always showed a removable "Grouped by" bar and the group row label couldn't be customised.
// showGroupBar hides the bar (for a layout-locked grouping); renderGroupLabel replaces the group-row content.
const rows = [
  { id: 1, cat: "A", name: "Ada" },
  { id: 2, cat: "A", name: "Al" },
  { id: 3, cat: "B", name: "Bo" },
];
const columns = [{ field: "cat", headerName: "Category" }, { field: "name", headerName: "Name" }];

afterEach(() => cleanup());

describe("Datatable rowGrouping bar + label (#387)", () => {
  it("shows the group bar by default", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} rowGrouping={["cat"]} />);
    expect(container.querySelector(".twc-dt__groupbar")).toBeTruthy();
    expect(container.querySelectorAll(".twc-dt__group-row").length).toBe(2); // groups A and B
  });

  it("showGroupBar={false} hides the bar but keeps the grouping", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={columns} rowGrouping={["cat"]} showGroupBar={false} />);
    expect(container.querySelector(".twc-dt__groupbar")).toBeNull(); // no removable bar…
    expect(container.querySelectorAll(".twc-dt__group-row").length).toBe(2); // …but rows are still grouped
  });

  it("renderGroupLabel replaces the default '<field>: <value>  <count>' content", () => {
    const { container } = render(
      <Datatable rowKey={(r) => r.id} rows={rows} columns={columns} rowGrouping={["cat"]}
        renderGroupLabel={(g) => <span data-testid="gl">{String(g.value)} — {g.count} of {g.rows.length + 0}</span>} />,
    );
    const gl = container.querySelectorAll('[data-testid="gl"]');
    expect(gl.length).toBe(2);
    expect(gl[0].textContent).toContain("A — 2 of 2"); // value + count + rows are all passed through
    expect(container.querySelector(".twc-dt__group-name")).toBeNull(); // default name prefix is gone
    // the chevron toggle is kept
    expect(container.querySelector(".twc-dt__group-row .twc-dt__group-toggle")).toBeTruthy();
  });
});
