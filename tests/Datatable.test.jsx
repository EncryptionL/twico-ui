import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
