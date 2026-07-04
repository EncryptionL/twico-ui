import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const columns = [
  { field: "name", headerName: "Name" },
  { field: "age", headerName: "Age", type: "number" },
];
const many = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Row ${i}`, age: i }));
const status = (c) => c.querySelector(".twc-dt__status").textContent;

describe("Datatable controlled pagination (#45)", () => {
  it("controlled `page` reports changes but does not advance until the prop updates", () => {
    const onPageChange = vi.fn();
    const { container, rerender } = render(
      <Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} page={0} onPageChange={onPageChange} />
    );
    expect(status(container)).toContain("1–10");
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    // callback fired with the next page…
    expect(onPageChange).toHaveBeenCalledWith(1);
    // …but the rendered page did NOT advance (fully controlled — parent owns `page`).
    expect(status(container)).toContain("1–10");
    // once the parent updates the prop, the page advances.
    rerender(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} page={1} onPageChange={onPageChange} />);
    expect(status(container)).toContain("11–20");
  });

  it("uncontrolled: changing the `pageSize` prop re-syncs rows-per-page and resets to page 0", () => {
    const { container, rerender } = render(
      <Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} />
    );
    // advance to page 2
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(status(container)).toContain("11–20");
    // shrink the page size — should re-apply AND reset to the first page
    rerender(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={5} />);
    expect(status(container)).toContain("1–5");
  });

  it("`onPageSizeChange` makes pageSize controlled and fires with the chosen size", () => {
    const onPageSizeChange = vi.fn();
    const onPageChange = vi.fn();
    const { container } = render(
      <Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10}
        onPageSizeChange={onPageSizeChange} onPageChange={onPageChange} />
    );
    // open the rows-per-page Select and pick 25
    const rpp = container.querySelector(".twc-dt__rpp .twc-sel__trigger");
    fireEvent.click(rpp);
    fireEvent.click(screen.getByRole("option", { name: "25" }));
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    // changing size resets to page 0 → onPageChange(0)
    expect(onPageChange).toHaveBeenCalledWith(0);
    // controlled: the displayed size stays 10 until the parent updates pageSize
    expect(container.querySelector(".twc-dt__rpp .twc-sel__value").textContent).toBe("10");
  });

  it("uncontrolled pagination still works end-to-end", () => {
    const { container } = render(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} />);
    expect(status(container)).toContain("1–10");
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(status(container)).toContain("11–20");
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(status(container)).toContain("21–25");
  });
});
