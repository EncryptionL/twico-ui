import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const columns = [
  { field: "name", headerName: "Name" },
  { field: "age", headerName: "Age", type: "number" },
];
const rows = [
  { id: 1, name: "Ada", age: 30 },
  { id: 2, name: "Ben", age: 25 },
];

describe("Datatable empty state (#121) + grid roles (#122)", () => {
  it("shows 'No rows' with role=row/gridcell when empty (no active filter)", () => {
    const { container } = render(<Datatable columns={columns} rows={[]} rowKey={(r) => r.id} />);
    const empty = container.querySelector(".twc-dt__empty");
    expect(empty).toHaveTextContent("No rows");
    const tr = empty.closest("tr");
    expect(tr).toHaveAttribute("role", "row");
    expect(tr.querySelector("td")).toHaveAttribute("role", "gridcell");
  });

  it("renders a custom emptyMessage", () => {
    const { container } = render(<Datatable columns={columns} rows={[]} emptyMessage="Nothing to show" />);
    expect(container.querySelector(".twc-dt__empty")).toHaveTextContent("Nothing to show");
  });

  it("renderEmpty overrides the message", () => {
    const { container } = render(
      <Datatable columns={columns} rows={[]} renderEmpty={() => <span data-testid="custom">Custom empty</span>} />
    );
    expect(container.querySelector('[data-testid="custom"]')).toHaveTextContent("Custom empty");
  });
});

describe("Datatable server-mode column visibility (#191)", () => {
  it("includes visibleColumns/hiddenColumns in the server query and fires them on mount", async () => {
    const onServerChange = vi.fn();
    render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id}
        serverMode rowCount={2} onServerChange={onServerChange} />
    );
    await waitFor(() => expect(onServerChange).toHaveBeenCalled());
    const q = onServerChange.mock.calls[0][0];
    expect(q.visibleColumns).toEqual(["name", "age"]);
    expect(q.hiddenColumns).toEqual([]);
  });

  it("excludes synthetic/actions columns (e.g. rowPinning's __pinactions__) from visibleColumns", async () => {
    const onServerChange = vi.fn();
    render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id}
        serverMode rowPinning rowCount={2} onServerChange={onServerChange} />
    );
    await waitFor(() => expect(onServerChange).toHaveBeenCalled());
    const q = onServerChange.mock.calls[0][0];
    expect(q.visibleColumns).toEqual(["name", "age"]);
    expect(q.visibleColumns).not.toContain("__pinactions__");
  });

  it("does not re-fire onServerChange when the columns prop identity changes but content is equal", async () => {
    const onServerChange = vi.fn();
    const onColumnVisibilityChange = vi.fn();
    const mk = () => [{ field: "name" }, { field: "age", type: "number" }]; // fresh identity each call
    const { rerender } = render(
      <Datatable columns={mk()} rows={rows} rowKey={(r) => r.id}
        serverMode rowCount={2} onServerChange={onServerChange} onColumnVisibilityChange={onColumnVisibilityChange} />
    );
    await waitFor(() => expect(onServerChange).toHaveBeenCalledTimes(1));
    onServerChange.mockClear();
    // Re-render with a NEW columns array of identical content — must not churn visibleColumns.
    rerender(
      <Datatable columns={mk()} rows={rows} rowKey={(r) => r.id}
        serverMode rowCount={2} onServerChange={onServerChange} onColumnVisibilityChange={onColumnVisibilityChange} />
    );
    await new Promise((r) => setTimeout(r, 350)); // past the 250ms debounce
    expect(onServerChange).not.toHaveBeenCalled();
    expect(onColumnVisibilityChange).not.toHaveBeenCalled();
  });

  it("does not fire onColumnVisibilityChange on mount, even under StrictMode", async () => {
    const onServerChange = vi.fn();
    const onColumnVisibilityChange = vi.fn();
    render(
      <React.StrictMode>
        <Datatable columns={columns} rows={rows} rowKey={(r) => r.id}
          serverMode rowCount={2} onServerChange={onServerChange} onColumnVisibilityChange={onColumnVisibilityChange} />
      </React.StrictMode>
    );
    await waitFor(() => expect(onServerChange).toHaveBeenCalled());
    expect(onColumnVisibilityChange).not.toHaveBeenCalled();
  });

  it("hiding a column re-fires onServerChange and calls onColumnVisibilityChange (not on mount)", async () => {
    // The column menu positions itself from getBoundingClientRect, which is all-zeros in
    // jsdom (the "trigger off-screen" guard would then refuse to open it). Stub a real rect.
    const rect = vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 100, bottom: 120, left: 100, right: 200, width: 100, height: 20, x: 100, y: 100, toJSON() {},
    });
    try {
      const onServerChange = vi.fn();
      const onColumnVisibilityChange = vi.fn();
      render(
        <Datatable columns={columns} rows={rows} rowKey={(r) => r.id}
          serverMode rowCount={2}
          onServerChange={onServerChange}
          onColumnVisibilityChange={onColumnVisibilityChange} />
      );
      await waitFor(() => expect(onServerChange).toHaveBeenCalled());
      expect(onColumnVisibilityChange).not.toHaveBeenCalled(); // not fired on mount

      // Open the first column's (name) header menu and hide it.
      fireEvent.click(screen.getAllByRole("button", { name: "Column menu" })[0]);
      fireEvent.click(screen.getByRole("menuitem", { name: /Hide column/ }));

      await waitFor(() => expect(onColumnVisibilityChange).toHaveBeenCalledWith(["age"]));
      await waitFor(() => {
        const last = onServerChange.mock.calls.at(-1)[0];
        expect(last.visibleColumns).toEqual(["age"]);
        expect(last.hiddenColumns).toEqual(["name"]);
      });
    } finally {
      rect.mockRestore();
    }
  });
});

describe("Datatable actions use Tooltip, not native title (#51)", () => {
  it("renders action buttons with aria-label and no title attribute", () => {
    const cols = [
      ...columns,
      { field: "_a", type: "actions", getActions: () => [{ label: "Edit", icon: <span>e</span>, onClick: vi.fn() }] },
    ];
    render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
    const btn = screen.getAllByRole("button", { name: "Edit" })[0];
    expect(btn).toBeInTheDocument();
    expect(btn).not.toHaveAttribute("title");
  });
});
