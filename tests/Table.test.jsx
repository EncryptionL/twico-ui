import { describe, it, expect, vi } from "vitest";
import { render, screen, act, within } from "@testing-library/react";
import { Table } from "../components/data-display/Table.jsx";

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "age", header: "Age", sortable: true },
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
    render(<Table sortable columns={columns} data={data} />);
    const nameHeader = screen.getByText("Name");
    act(() => nameHeader.click());
    expect(bodyNames()).toEqual(["Alan", "Bea", "Cara"]);
    act(() => nameHeader.click());
    expect(bodyNames()).toEqual(["Cara", "Bea", "Alan"]);
  });

  it("controlled sort calls onSortChange and respects the sort prop", () => {
    const onSortChange = vi.fn();
    render(<Table sortable columns={columns} data={data} sort={{ key: "age", dir: "asc" }} onSortChange={onSortChange} />);
    expect(bodyNames()).toEqual(["Alan", "Cara", "Bea"]); // by age asc: 25,30,40
    act(() => screen.getByText("Name").click());
    expect(onSortChange).toHaveBeenCalled();
  });
});
