import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #367: custom column headers. `renderHeader({ column }) => ReactNode` is the header analogue of
// `renderCell` — it renders in place of `headerName`, while `headerName` stays the plain-text label used
// for quick-search, the Columns menu, export, aggregation, and a11y. Regression: a non-string `headerName`
// used to throw `TypeError: c.headerName.toLowerCase is not a function` in the Columns menu filter.

const rows = [
  { id: 1, name: "Alpha", ratio: 0.4 },
  { id: 2, name: "Bravo", ratio: 0.7 },
];
const openColumns = (c) =>
  fireEvent.click(Array.from(c.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Columns")));

// jsdom returns an all-zero getBoundingClientRect, so the panel's computed position (panelPos) stays
// falsy and the popover never renders. Mock a real rect so opening the Columns panel works (mirrors
// datatable-resizable-popovers.test.jsx).
const RECT = { top: 80, left: 80, right: 260, bottom: 120, width: 180, height: 40, x: 80, y: 80, toJSON() {} };
let origRect;
beforeEach(() => { origRect = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
afterEach(() => { Element.prototype.getBoundingClientRect = origRect; cleanup(); });

describe("Datatable renderHeader (#367)", () => {
  it("renders a custom header node in place of headerName", () => {
    const columns = [
      { field: "name", headerName: "Name" },
      {
        field: "ratio",
        headerName: "Ratio",
        renderHeader: ({ column }) => (
          <span>
            {column.headerName}
            <i data-testid="hdr-info" aria-hidden="true">ⓘ</i>
          </span>
        ),
      },
    ];
    const { container, getByTestId } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    // the custom node lives inside the header cell (thead), not the body
    expect(container.querySelector("thead").contains(getByTestId("hdr-info"))).toBe(true);
    // renderHeader receives the resolved column, so the label still shows
    expect(container.querySelector("thead").textContent).toContain("Ratio");
  });

  it("passes the resolved column to renderHeader (headerName defaults to field)", () => {
    const columns = [
      { field: "name", headerName: "Name" },
      // no headerName → normalized to the field; renderHeader still gets it
      { field: "ratio", renderHeader: ({ column }) => <span data-testid="lbl">{column.headerName}</span> },
    ];
    const { getByTestId } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(getByTestId("lbl").textContent).toBe("ratio");
  });

  it("does NOT throw in the Columns menu when headerName is a ReactNode (regression)", () => {
    const columns = [
      { field: "name", headerName: "Name" },
      { field: "ratio", headerName: <span>Ratio</span> }, // the reported misuse: a node in headerName
    ];
    // Before the fix this threw TypeError: c.headerName.toLowerCase is not a function.
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(() => openColumns(container)).not.toThrow();
    expect(container.querySelector(".twc-dt__cols")).toBeTruthy(); // panel rendered
  });

  it("keeps headerName as the searchable label — Columns search filters by it, renderHeader present", () => {
    const columns = [
      { field: "name", headerName: "Name" },
      { field: "ratio", headerName: "Ratio", renderHeader: () => <span data-testid="custom">custom</span> },
    ];
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    openColumns(container);
    const names = () =>
      Array.from(container.querySelectorAll(".twc-dt__cols .twc-dt__col-name")).map((n) => n.textContent).join(" ");
    expect(names()).toContain("Ratio");
    const search = container.querySelector(".twc-dt__cols input");
    expect(search).toBeTruthy(); // the search box always renders — no dead guard
    fireEvent.change(search, { target: { value: "rat" } });
    expect(names()).toContain("Ratio"); // matched by the string label
    expect(names()).not.toContain("Name"); // the non-matching column IS filtered out
  });

  it("Columns search matches a non-string headerName by its field label (no crash on typing)", () => {
    const columns = [
      { field: "name", headerName: "Name" },
      { field: "metric", headerName: <span>Metric</span> }, // node headerName → colLabel falls back to "metric"
    ];
    const { container } = render(<Datatable columns={columns} rows={[{ id: 1, name: "A", metric: 1 }]} rowKey={(r) => r.id} />);
    openColumns(container);
    const search = container.querySelector(".twc-dt__cols input");
    expect(search).toBeTruthy();
    fireEvent.change(search, { target: { value: "metric" } }); // the colLabel(.toLowerCase()) filter path
    const names = Array.from(container.querySelectorAll(".twc-dt__cols .twc-dt__col-name")).map((n) => n.textContent).join(" ");
    expect(names).toContain("metric"); // discoverable by the field label
    expect(names).not.toContain("Name");
  });

  it("a sortable renderHeader column still sorts on header click", () => {
    const columns = [
      { field: "name", headerName: "Name" },
      { field: "ratio", headerName: "Ratio", sortable: true, renderHeader: () => <span data-testid="rh">R</span> },
    ];
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const th = Array.from(container.querySelectorAll("thead th")).find((t) => t.querySelector('[data-testid="rh"]'));
    expect(th).toBeTruthy();
    expect(th.getAttribute("aria-sort")).toBe("none");
    fireEvent.click(th.querySelector(".twc-dt__th-label"));
    expect(th.getAttribute("aria-sort")).toBe("ascending");
  });

  it("derives the sort aria-label from the string label, not the rendered node", () => {
    const columns = [
      { field: "name", headerName: "Name" },
      {
        field: "ratio",
        headerName: "Ratio",
        sortable: true,
        renderHeader: () => <span>anything</span>,
      },
    ];
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const sortLabel = Array.from(container.querySelectorAll("thead .twc-dt__th-label")).find(
      (el) => el.getAttribute("aria-label") && el.getAttribute("aria-label").includes("Ratio"),
    );
    expect(sortLabel).toBeTruthy();
    expect(sortLabel.getAttribute("aria-label")).toBe("Ratio, sort");
  });
});
