import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable, runDatatableQuery } from "../components/data-display/Datatable.jsx";

// #270 — a column can present numeric FILTER operators/comparison independently of its (string) edit
// `type`, so a value+unit measurement (edited as a string via a custom editor) still filters numerically.
describe("Datatable filterType (#270)", () => {
  const columns = [
    { field: "size", headerName: "Size", type: "string", filterType: "number", valueGetter: (r) => parseFloat(r.size) },
    { field: "name", headerName: "Name" },
  ];
  const rows = [
    { id: 1, size: "0.5 MM", name: "a" },
    { id: 2, size: "2 MM", name: "b" },
    { id: 3, size: "10 MM", name: "c" },
  ];
  const q = (filters) => ({ page: 0, pageSize: 100, sort: null, quickFilter: "", filters });

  it("runDatatableQuery compares numerically for a filterType:number (string-edit) column", () => {
    const res = runDatatableQuery(rows, q([{ field: "size", op: ">", value: "1" }]), { columns });
    expect(res.rows.map((r) => r.size)).toEqual(["2 MM", "10 MM"]); // 0.5 excluded numerically
  });

  it("without filterType the same '>' filter would compare as text (contrast)", () => {
    const strCols = [{ field: "size", headerName: "Size", type: "string", valueGetter: (r) => parseFloat(r.size) }, columns[1]];
    const res = runDatatableQuery(rows, q([{ field: "size", op: ">", value: "1" }]), { columns: strCols });
    // string path: ">" falls through to substring `includes` → only "10 MM" contains "1"
    expect(res.rows.map((r) => r.size)).toEqual(["10 MM"]);
  });

  describe("filter builder", () => {
    let orig;
    beforeEach(() => {
      orig = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} });
    });
    afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

    it("offers numeric operators (default '=') and a numeric value input for a filterType:number column", () => {
      const { container } = render(<Datatable rowKey={(r) => r.id} columns={columns} rows={rows} />);
      fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
      fireEvent.click(Array.from(container.querySelectorAll("button")).find((b) => b.textContent.trim() === "Add filter"));
      // default column is the first (size / filterType number) → numeric default op "=" and a number input
      expect(container.querySelector(".twc-dt__f-op .twc-sel__value").textContent).toBe("=");
      expect(container.querySelector(".twc-dt__f-val input").getAttribute("type")).toBe("number");
    });
  });
});
