import { describe, it, expect } from "vitest";
import { runDatatableQuery } from "../components/data-display/Datatable.jsx";

const rows = [
  { id: 1, name: "Cara", dept: "Sales", score: 30 },
  { id: 2, name: "Alan", dept: "Eng", score: 25 },
  { id: 3, name: "Bea", dept: "Sales", score: 40 },
];
const columns = [{ field: "name" }, { field: "dept" }, { field: "score", type: "number" }];
const Q = (over) => ({ page: 0, pageSize: 10, sort: null, filters: [], quickFilter: "", ...over });

describe("runDatatableQuery", () => {
  it("sorts numerically by column type and paginates", () => {
    const r = runDatatableQuery(rows, Q({ pageSize: 2, sort: { field: "score", dir: "asc" } }), { columns });
    expect(r.rows.map((x) => x.score)).toEqual([25, 30]);
    expect(r.total).toBe(3);
    expect(r.filtered).toHaveLength(3); // full filtered+sorted set, pre-paging
  });

  it("applies column filters with the grid's operator semantics", () => {
    const eq = runDatatableQuery(rows, Q({ filters: [{ field: "dept", op: "equals", value: "Sales" }] }), { columns });
    expect(eq.total).toBe(2);
    expect(eq.rows.map((x) => x.name).sort()).toEqual(["Bea", "Cara"]);

    const any = runDatatableQuery(rows, Q({ filters: [{ field: "name", op: "isAnyOf", value: ["Alan", "Bea"] }] }), { columns });
    expect(any.total).toBe(2);

    const gt = runDatatableQuery(rows, Q({ filters: [{ field: "score", op: ">", value: "28" }] }), { columns });
    expect(gt.total).toBe(2);
    expect(gt.rows.every((x) => x.score > 28)).toBe(true);
  });

  it("quick search scans the column fields", () => {
    const r = runDatatableQuery(rows, Q({ quickFilter: "eng" }), { columns });
    expect(r.total).toBe(1);
    expect(r.rows[0].name).toBe("Alan");
  });

  it("pageSize 0 returns everything (no paging)", () => {
    const r = runDatatableQuery(rows, Q({ pageSize: 0 }), { columns });
    expect(r.rows).toHaveLength(3);
  });
});
