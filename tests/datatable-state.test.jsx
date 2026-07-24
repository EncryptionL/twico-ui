import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #259 — persist/restore the full view state via `stateKey` (localStorage), `initialState` (seed),
// and `onStateChange` (report). Restore runs in a mount effect (SSR-safe: storage is never read
// during render), and a saved snapshot survives a column/schema change (unknown fields are dropped).

const columns = [
  { field: "name", headerName: "Name" },
  { field: "age", headerName: "Age", type: "number" },
];
const many = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Row ${i}`, age: i }));
const status = (c) => c.querySelector(".twc-dt__status").textContent;
const headerNames = (c) => Array.from(c.querySelectorAll(".twc-dt__th-label")).map((el) => el.textContent);

describe("Datatable view-state persistence (#259)", () => {
  beforeEach(() => window.localStorage.clear());

  it("restores page, density, sort, and column visibility from localStorage on mount", () => {
    window.localStorage.setItem(
      "dt-1",
      JSON.stringify({ page: 1, pageSize: 10, density: "compact", sort: { field: "name", dir: "desc" }, columnVisibility: { age: false } })
    );
    const { container } = render(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} stateKey="dt-1" />);
    expect(status(container)).toContain("11–20"); // page 1 restored
    expect(container.querySelector(".twc-dt").getAttribute("data-density")).toBe("compact");
    expect(container.querySelector('.twc-dt__th[data-sorted="desc"]')).toBeTruthy(); // sort restored
    expect(headerNames(container)).not.toContain("Age"); // hidden column restored
  });

  it("seeds from `initialState` when nothing is stored yet", () => {
    const { container } = render(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} initialState={{ page: 2 }} />);
    expect(status(container)).toContain("21–25"); // page 2 seeded
  });

  it("persists to localStorage and fires onStateChange when the view changes", () => {
    const onStateChange = vi.fn();
    render(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} stateKey="dt-2" onStateChange={onStateChange} />);
    onStateChange.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    const reported = onStateChange.mock.calls.at(-1)[0];
    expect(reported.page).toBe(1);
    expect(JSON.parse(window.localStorage.getItem("dt-2")).page).toBe(1);
  });

  it("drops unknown columns from a saved snapshot (survives a schema change) and self-heals storage", () => {
    window.localStorage.setItem(
      "dt-3",
      JSON.stringify({ columnVisibility: { ghost: false, age: false }, columnOrder: ["ghost", "age", "name"], sort: { field: "ghost", dir: "asc" } })
    );
    const { container } = render(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} stateKey="dt-3" />);
    expect(headerNames(container)).toEqual(["Name"]); // ghost never existed, age hidden → only Name shows
    const stored = JSON.parse(window.localStorage.getItem("dt-3"));
    expect(stored.columnOrder).toEqual(["age", "name"]); // ghost pruned from the rewritten snapshot
    expect(stored.columnVisibility.ghost).toBeUndefined();
    expect(stored.sort).toBeNull(); // sort on the unknown field cleared
  });

  it("writes nothing when neither stateKey nor onStateChange is supplied", () => {
    render(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(window.localStorage.length).toBe(0);
  });
});

// #284 — a saved column order reconciles against the current `columns` prop: new columns land at their
// code-defined position (not appended at the end), removed columns are dropped.
describe("Datatable column-order reconciliation (#284)", () => {
  beforeEach(() => window.localStorage.clear());

  it("restores new columns at their code position when the column set changed (not appended)", () => {
    // saved order from the OLD set (a single leading `value` column + trailing audit columns)
    window.localStorage.setItem("dt-284", JSON.stringify({
      columnOrder: ["value", "created", "createdBy", "updated", "updatedBy"],
    }));
    // NEW code: `value` replaced by two columns in the SAME leading position
    const newCols = [
      { field: "colorCode", headerName: "Color Code" },
      { field: "colorName", headerName: "Color Name" },
      { field: "created", headerName: "Created" },
      { field: "createdBy", headerName: "Created By" },
      { field: "updated", headerName: "Updated" },
      { field: "updatedBy", headerName: "Updated By" },
    ];
    const { container } = render(<Datatable columns={newCols} rows={[]} rowKey={(r) => r.id} stateKey="dt-284" />);
    expect(headerNames(container)).toEqual(["Color Code", "Color Name", "Created", "Created By", "Updated", "Updated By"]);
  });

  it("inserts a runtime-added column at its code position, keeping the rest in order", () => {
    const two = [{ field: "a", headerName: "A" }, { field: "c", headerName: "C" }];
    const three = [{ field: "a", headerName: "A" }, { field: "b", headerName: "B" }, { field: "c", headerName: "C" }];
    const { container, rerender } = render(<Datatable columns={two} rows={[]} rowKey={(r) => r.id} />);
    rerender(<Datatable columns={three} rows={[]} rowKey={(r) => r.id} />);
    expect(headerNames(container)).toEqual(["A", "B", "C"]); // B at its prop index, not appended at the end
  });
});
