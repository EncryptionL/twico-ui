import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #338 — a column can `combine` several other columns' values into one cell. The combined value drives
// sort/filter/quick-search/export (via a derived valueGetter that routes through getColVal), and the cell
// shows the merged data (inline / stack / labelled), reusing each source column's valueFormatter.
const rows = [
  { id: 1, first: "Ada", last: "Lovelace", email: "ada@twico.dev", price: 10 },
  { id: 2, first: "Alan", last: "Turing", email: "alan@twico.dev", price: 20 },
];
const bodyRows = (c) => c.querySelectorAll("tbody tr.twc-dt__row").length;
const firstCombined = (c) => c.querySelectorAll(".twc-dt__combine")[0];

describe("Datatable combined columns (#338)", () => {
  it("shows several fields' data in one column (object form)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name", headerName: "Name", combine: { fields: ["first", "last"] } }]} />);
    const cell = firstCombined(container);
    expect(cell).toBeTruthy();
    expect(cell.textContent).toContain("Ada");
    expect(cell.textContent).toContain("Lovelace");
  });

  it("array shorthand `combine: [...]` behaves like `{ fields: [...] }`", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name", headerName: "Name", combine: ["first", "last"] }]} />);
    const cell = firstCombined(container);
    expect(cell.textContent).toContain("Ada");
    expect(cell.textContent).toContain("Lovelace");
  });

  it("quick-search matches text from ANY combined field (derived valueGetter drives search)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name", headerName: "Name", combine: ["first", "last", "email"] }]} />);
    expect(bodyRows(container)).toBe(2);
    fireEvent.change(container.querySelector(".twc-dt__search input"), { target: { value: "alan@twico" } });
    expect(bodyRows(container)).toBe(1);
    expect(firstCombined(container).textContent).toContain("Turing");
  });

  it("stack layout puts each value on its own line and auto-wraps the cell (row grows)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name", headerName: "Name", combine: { fields: ["first", "last"], layout: "stack" } }]} />);
    expect(container.querySelector(".twc-dt__combine--stack")).toBeTruthy();
    const td = container.querySelector("tbody tr.twc-dt__row .twc-dt__td"); // the (only) combined column cell
    expect(td.getAttribute("data-wrap")).toBe("true");
  });

  it("labels prefix each value with its source column's header", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[
        { field: "first", headerName: "First" },
        { field: "email", headerName: "Email" },
        { field: "name", headerName: "Contact", combine: { fields: ["first", "email"], labels: true } },
      ]} />);
    const cell = firstCombined(container);
    expect(cell.textContent).toContain("First:");
    expect(cell.textContent).toContain("Email:");
  });

  it("reuses a source column's valueFormatter for the combined display", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[
        { field: "price", headerName: "Price", type: "number", valueFormatter: (v) => `$${v}` },
        { field: "name", headerName: "Name", combine: ["first", "price"] },
      ]} />);
    expect(firstCombined(container).textContent).toContain("$10"); // formatted, not the raw 10
  });

  it("a combined column is display-only (never inline-editable), even under grid editMode", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} editMode
      columns={[{ field: "name", headerName: "Name", combine: ["first", "last"] }]} />);
    const cell = container.querySelector("tbody tr.twc-dt__row .twc-dt__td");
    fireEvent.doubleClick(cell);
    expect(cell.querySelector("input")).toBeNull(); // no editor opened
  });

  // --- review-hardening (#338) ---

  it("diff mode: an added row shows the combined value, not a blank cell", () => {
    const from = [{ id: 1, first: "Ada", last: "Lovelace" }];
    const to = [{ id: 1, first: "Ada", last: "Lovelace" }, { id: 2, first: "Alan", last: "Turing" }];
    const { container } = render(<Datatable
      diff={{ from, to, rowKey: (r) => r.id }}
      columns={[{ field: "name", headerName: "Name", combine: ["first", "last"] }]} />);
    const body = container.querySelector("tbody").textContent; // the added row (id 2) must not be blank
    expect(body).toContain("Alan");
    expect(body).toContain("Turing");
  });

  it("duplicate fields in `combine` render without a React-key collision", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name", headerName: "Name", combine: ["first", "first"] }]} />);
    expect(firstCombined(container).textContent).toContain("Ada"); // renders, no crash
  });

  it("a consumer `valueGetter` without `renderCell` drives BOTH the value and the displayed cell", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows}
      columns={[{ field: "name", headerName: "Name", combine: ["first", "last"], valueGetter: (r) => `${r.last}, ${r.first}` }]} />);
    const cell = container.querySelector("tbody tr.twc-dt__row .twc-dt__td");
    expect(cell.textContent).toContain("Lovelace, Ada"); // the consumer's value, not the "Ada · Lovelace" source-join
    expect(container.querySelector(".twc-dt__combine")).toBeNull(); // renderCombined not used
  });
});
