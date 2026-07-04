import { describe, it, expect, vi } from "vitest";
import { render, screen, act, within } from "@testing-library/react";
import { Table } from "../components/data-display/Table.jsx";

const columns = [
  { field: "name", headerName: "Name", sortable: true },
  { field: "age", headerName: "Age", sortable: true },
];
const data = [
  { name: "Cara", age: 30 },
  { name: "Alan", age: 25 },
  { name: "Bea", age: 40 },
];

function bodyNames() {
  const rows = screen.getAllByRole("row").slice(1); // drop header row
  return rows.map((r) => within(r).getAllByRole("cell")[0].textContent);
}

describe("Table sorting", () => {
  it("clicking a sortable header sorts ascending then descending", () => {
    render(<Table sortable columns={columns} rows={data} />);
    const nameHeader = screen.getByText("Name");
    act(() => nameHeader.click());
    expect(bodyNames()).toEqual(["Alan", "Bea", "Cara"]);
    act(() => nameHeader.click());
    expect(bodyNames()).toEqual(["Cara", "Bea", "Alan"]);
  });

  it("controlled sort calls onSortChange and respects the sort prop", () => {
    const onSortChange = vi.fn();
    render(<Table sortable columns={columns} rows={data} sort={{ field: "age", dir: "asc" }} onSortChange={onSortChange} />);
    expect(bodyNames()).toEqual(["Alan", "Cara", "Bea"]); // by age asc: 25,30,40
    act(() => screen.getByText("Name").click());
    expect(onSortChange).toHaveBeenCalled();
  });
});

describe("Table empty state (#126)", () => {
  it("renders the default empty message spanning all columns when rows are empty", () => {
    const { container } = render(<Table columns={columns} rows={[]} />);
    const empty = container.querySelector(".twc-table__empty");
    expect(empty).toHaveTextContent("No data");
    expect(empty).toHaveAttribute("colspan", String(columns.length));
  });
  it("renders a custom emptyMessage", () => {
    const { container } = render(<Table columns={columns} rows={[]} emptyMessage="No users yet" />);
    expect(container.querySelector(".twc-table__empty")).toHaveTextContent("No users yet");
  });
  it("non-empty table renders no empty cell", () => {
    const { container } = render(<Table columns={columns} rows={data} />);
    expect(container.querySelector(".twc-table__empty")).toBeNull();
  });
});

describe("Table loading skeletons (#127)", () => {
  it("renders loadingRows × columns skeleton cells and sets aria-busy", () => {
    const { container } = render(<Table columns={columns} rows={data} loading loadingRows={5} />);
    expect(container.querySelectorAll(".twc-table__sk")).toHaveLength(5 * columns.length);
    expect(container.querySelector("table")).toHaveAttribute("aria-busy", "true");
  });
  it("loading overrides provided rows (no data cells shown)", () => {
    render(<Table columns={columns} rows={data} loading />);
    expect(screen.queryByText("Cara")).toBeNull();
  });
});

describe("Table accessible name (#128)", () => {
  it("a raw aria-label lands on the <table>, not the wrapper", () => {
    render(<Table columns={columns} rows={data} aria-label="Invoices" />);
    expect(screen.getByRole("table", { name: "Invoices" })).toBeInTheDocument();
  });
  it("ariaLabel prop names the table; raw aria-label wins over it", () => {
    const { rerender } = render(<Table columns={columns} rows={data} ariaLabel="Users" />);
    expect(screen.getByRole("table", { name: "Users" })).toBeInTheDocument();
    rerender(<Table columns={columns} rows={data} ariaLabel="Users" aria-label="People" />);
    expect(screen.getByRole("table", { name: "People" })).toBeInTheDocument();
  });
  it("caption renders a (hidden) <caption> that names the table", () => {
    const { container } = render(<Table columns={columns} rows={data} caption="Q3 report" />);
    expect(container.querySelector("caption.twc-table__caption")).toHaveTextContent("Q3 report");
    expect(screen.getByRole("table", { name: "Q3 report" })).toBeInTheDocument();
  });
});
