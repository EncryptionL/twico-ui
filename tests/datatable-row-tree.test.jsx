import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #359: server-mode lazy row-tree. `getRowCanExpand(row)` draws the leading chevron on parent DATA rows;
// expanding reveals CHILD rows in the SAME columns (not a renderRowDetail panel). Server mode folds the
// expanded set into onServerChange; client mode splices getSubRows children in as real rows.

const columns = [
  { field: "name", headerName: "Name" },
  { field: "size", headerName: "Size" },
];
const cell = (c, r, col) => c.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${col}"]`);

describe("Datatable server-mode lazy row-tree (#359)", () => {
  // Host-flattened rows (server returns parents; children appear inline only when the host adds them).
  const serverRows = [
    { id: "p1", name: "HP4630-3", size: "", isSizeParent: true },
    { id: "p2", name: "HP4630-4", size: "", isSizeParent: true },
    { id: "leaf", name: "One-off", size: "M", isSizeParent: false },
  ];

  it("draws a chevron only on rows where getRowCanExpand is true (+ a header expand column)", () => {
    const { container } = render(
      <Datatable columns={columns} rows={serverRows} rowKey={(r) => r.id} serverMode rowCount={3} onServerChange={() => {}} getRowCanExpand={(r) => r.isSizeParent} />,
    );
    expect(container.querySelector("thead .twc-dt__expand-cell")).toBeTruthy();
    expect(container.querySelectorAll(".twc-dt__expand-btn").length).toBe(2); // p1 + p2, not the leaf
  });

  it("toggling a tree parent fires onExpandedRowsChange and renders NO detail panel", () => {
    const onExpandedRowsChange = vi.fn();
    const { container } = render(
      <Datatable columns={columns} rows={serverRows} rowKey={(r) => r.id} serverMode rowCount={3} onServerChange={() => {}} getRowCanExpand={(r) => r.isSizeParent} onExpandedRowsChange={onExpandedRowsChange} />,
    );
    fireEvent.click(container.querySelector(".twc-dt__expand-btn"));
    expect(onExpandedRowsChange).toHaveBeenCalledWith(["p1"]);
    expect(container.querySelector(".twc-dt__detail-row")).toBeNull(); // children come from data, not a panel
  });

  it("folds the expanded set into the onServerChange query so the host can fetch children", async () => {
    const onServerChange = vi.fn();
    const { container } = render(
      <Datatable columns={columns} rows={serverRows} rowKey={(r) => r.id} serverMode rowCount={3} onServerChange={onServerChange} getRowCanExpand={(r) => r.isSizeParent} />,
    );
    await waitFor(() => expect(onServerChange).toHaveBeenCalled()); // initial debounced emit
    onServerChange.mockClear();
    fireEvent.click(container.querySelector(".twc-dt__expand-btn"));
    await waitFor(() => expect(onServerChange).toHaveBeenCalled());
    expect(onServerChange.mock.calls.at(-1)[0].expanded).toEqual(["p1"]);
  });
});

describe("Datatable client-mode row-tree — getSubRows (#359)", () => {
  const parents = [{ id: "p1", name: "HP4630-3", size: "base" }];
  const kids = {
    p1: [
      { id: "p1-a", name: "child A", size: "HP4630-3" },
      { id: "p1-b", name: "child B", size: "HP4630-3T" },
    ],
  };
  const props = {
    columns, rows: parents, rowKey: (r) => r.id,
    getRowCanExpand: (r) => !!kids[r.id],
    getSubRows: (r) => kids[r.id] || [],
    getRowDepth: undefined, // depth comes from the splice
  };

  it("reveals children as first-class rows (same columns) when the parent is expanded", () => {
    const { container, queryByText } = render(<Datatable {...props} />);
    expect(queryByText("child A")).toBeNull(); // collapsed
    fireEvent.click(container.querySelector(".twc-dt__expand-btn"));
    expect(queryByText("child A")).toBeTruthy(); // spliced in as a real row
    expect(queryByText("child B")).toBeTruthy();
    expect(container.querySelector(".twc-dt__detail-row")).toBeNull(); // real rows, not a panel
  });

  it("indents nested rows via depth (first data cell gets paddingInlineStart)", () => {
    const { container } = render(<Datatable {...props} />);
    fireEvent.click(container.querySelector(".twc-dt__expand-btn"));
    // rows are now [p1 (r0, depth 0), child A (r1, depth 1), child B (r2, depth 1)]
    expect(cell(container, 0, 0).style.paddingInlineStart).toBe(""); // parent (depth 0): no indent
    expect(cell(container, 1, 0).style.paddingInlineStart).toMatch(/32px/); // child (depth 1): 12px base + 1*20
  });

  it("no chevron column at all when neither renderRowDetail nor getRowCanExpand is set", () => {
    const { container } = render(<Datatable columns={columns} rows={parents} rowKey={(r) => r.id} />);
    expect(container.querySelector(".twc-dt__expand-cell")).toBeNull();
    expect(container.querySelector(".twc-dt__expand-btn")).toBeNull();
  });
});

describe("Datatable row-tree — adversarial-review hardening (#359)", () => {
  it("a renderRowDetail-only server grid adds no `expanded` and does NOT re-fire onServerChange on panel toggle", async () => {
    const onServerChange = vi.fn();
    const { container } = render(
      <Datatable columns={columns} rows={[{ id: "a", name: "A", size: "" }]} rowKey={(r) => r.id}
        serverMode rowCount={1} onServerChange={onServerChange} renderRowDetail={(r) => <div>detail {r.name}</div>} />,
    );
    await waitFor(() => expect(onServerChange).toHaveBeenCalled());
    expect(onServerChange.mock.calls.at(-1)[0]).not.toHaveProperty("expanded"); // no row-tree → no field
    onServerChange.mockClear();
    fireEvent.click(container.querySelector(".twc-dt__expand-btn")); // open the #350 detail panel
    await new Promise((r) => setTimeout(r, 320)); // past the 250ms debounce
    expect(onServerChange).not.toHaveBeenCalled(); // v1.34 behaviour restored (no spurious refetch)
  });

  it("editing a client-tree CHILD cell fires onRowUpdate with the child row", () => {
    const onRowUpdate = vi.fn();
    const kids = { p1: [{ id: "p1-a", name: "child A", size: "S" }] };
    const cols = [{ field: "name", headerName: "Name", editable: true }, { field: "size", headerName: "Size" }];
    const { container } = render(
      <Datatable columns={cols} rows={[{ id: "p1", name: "HP", size: "" }]} rowKey={(r) => r.id}
        getRowCanExpand={(r) => !!kids[r.id]} getSubRows={(r) => kids[r.id] || []} onRowUpdate={onRowUpdate} />,
    );
    fireEvent.click(container.querySelector(".twc-dt__expand-btn")); // expand → child row at data-r=1
    fireEvent.doubleClick(cell(container, 1, 0)); // the child's Name cell
    const input = container.querySelector(".twc-dt__editor");
    fireEvent.change(input, { target: { value: "renamed" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onRowUpdate.mock.calls.at(-1)[0]).toMatchObject({ id: "p1-a", name: "renamed" }); // the CHILD, updated
  });

  it("a cyclic getSubRows does not recurse forever (the visited guard dedupes it)", () => {
    const self = { id: "x", name: "self", size: "" }; // getSubRows returns the row itself
    const { container } = render(
      <Datatable columns={columns} rows={[self]} rowKey={(r) => r.id} getRowCanExpand={() => true} getSubRows={() => [self]} />,
    );
    fireEvent.click(container.querySelector(".twc-dt__expand-btn")); // would infinite-loop without the guard
    expect(container.querySelectorAll('.twc-dt__td[data-c="0"]').length).toBe(1); // rendered once
  });
});
