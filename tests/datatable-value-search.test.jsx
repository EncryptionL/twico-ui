import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable, runDatatableQuery } from "../components/data-display/Datatable.jsx";

const nested = [
  { id: 1, name: "Ada", meta: { score: 30 } },
  { id: 2, name: "Ben", meta: { score: 10 } },
  { id: 3, name: "Cy", meta: { score: 20 } },
];
const Q = (over) => ({ page: 0, pageSize: 10, sort: null, filters: [], quickFilter: "", ...over });

// #213 — a column `valueGetter` derives the value for sort/filter/search/render off nested data.
describe("Datatable valueGetter (#213)", () => {
  const cols = [{ field: "name" }, { field: "score", type: "number", valueGetter: (r) => r.meta.score }];

  it("runDatatableQuery sorts/searches/filters off the derived value", () => {
    const sorted = runDatatableQuery(nested, Q({ sort: { field: "score", dir: "asc" } }), { columns: cols });
    expect(sorted.rows.map((r) => r.name)).toEqual(["Ben", "Cy", "Ada"]); // 10, 20, 30
    const searched = runDatatableQuery(nested, Q({ quickFilter: "20" }), { columns: cols });
    expect(searched.rows.map((r) => r.name)).toEqual(["Cy"]);
    const filtered = runDatatableQuery(nested, Q({ filters: [{ field: "score", op: ">", value: "15" }] }), { columns: cols });
    expect(filtered.rows.map((r) => r.name).sort()).toEqual(["Ada", "Cy"]);
  });

  it("renders the derived value in the cell", () => {
    const { container } = render(<Datatable columns={cols} rows={nested} rowKey={(r) => r.id} />);
    const cells = Array.from(container.querySelectorAll(".twc-dt__td")).map((c) => c.textContent);
    expect(cells).toContain("30");
    expect(cells).toContain("10");
  });
});

// #215 — client quick-search can be restricted to specific columns (parity with the helper).
describe("Datatable searchFields (#215)", () => {
  const cols = [{ field: "name" }, { field: "note" }];
  const rows = [{ id: 1, name: "Ada", note: "zzz" }, { id: 2, name: "Ben", note: "qqq" }];

  it("restricts quick-search to the listed fields", () => {
    const { container } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} searchFields={["name"]} />,
    );
    const input = container.querySelector(".twc-dt__search input");
    fireEvent.change(input, { target: { value: "zzz" } }); // only in `note`, which isn't searched
    expect(container.querySelector(".twc-dt__empty")).not.toBeNull();
    fireEvent.change(input, { target: { value: "Ada" } });
    expect(container.textContent).toContain("Ada");
  });

  it("defaults to searching every visible column", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
    const input = container.querySelector(".twc-dt__search input");
    fireEvent.change(input, { target: { value: "zzz" } }); // matches Ada's note
    expect(container.textContent).toContain("Ada");
    expect(container.textContent).not.toContain("Ben");
  });
});
