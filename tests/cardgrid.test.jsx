import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { CardGrid } from "../components/data-display/CardGrid.jsx";

const makeRows = (n) => Array.from({ length: n }, (_, i) => ({ id: i, name: `Item ${i}`, price: n - i }));
const card = (r) => <div className="card" data-name={r.name}>{r.name}</div>;
const cards = () => Array.from(document.querySelectorAll(".card"));

// #204 — CardGrid: server-mode-capable paginated card grid.
describe("CardGrid client mode (#204)", () => {
  it("renders one card per row, capped to the page size", () => {
    const { container } = render(<CardGrid rows={makeRows(30)} renderCard={card} />);
    expect(cards().length).toBe(12); // default pageSize
    expect(container.querySelector(".twc-cardgrid__count").textContent).toBe("1–12 of 30");
  });

  it("paginates to the next page", () => {
    render(<CardGrid rows={makeRows(30)} renderCard={card} pageSize={10} />);
    expect(cards()[0].getAttribute("data-name")).toBe("Item 0");
    const pageBtn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "2");
    fireEvent.click(pageBtn);
    expect(cards()[0].getAttribute("data-name")).toBe("Item 10");
  });

  it("quick-search filters the rows and resets the count", () => {
    render(<CardGrid rows={makeRows(30)} renderCard={card} searchable />);
    const input = document.querySelector(".twc-cardgrid__search input");
    fireEvent.change(input, { target: { value: "Item 25" } });
    expect(cards().length).toBe(1);
    expect(cards()[0].getAttribute("data-name")).toBe("Item 25");
  });

  it("sorts numerically via a controlled sort clause + sortOptions type", () => {
    render(<CardGrid rows={makeRows(30)} renderCard={card} sort={{ field: "price", dir: "asc" }}
      sortOptions={[{ field: "price", label: "Price", type: "number" }]} />);
    // price = 30 - i, so the lowest price (1) is Item 29.
    expect(cards()[0].getAttribute("data-name")).toBe("Item 29");
  });

  it("shows the empty state when there are no rows", () => {
    const { container } = render(<CardGrid rows={[]} renderCard={card} emptyState="Nothing here" />);
    expect(container.querySelector(".twc-cardgrid__empty").textContent).toBe("Nothing here");
    expect(cards().length).toBe(0);
  });
});

describe("CardGrid server mode (#204)", () => {
  it("emits the query (debounced) and renders the provided page rows", async () => {
    const onServerChange = vi.fn();
    const { container } = render(
      <CardGrid serverMode rows={makeRows(12)} rowCount={100} onServerChange={onServerChange} renderCard={card} />,
    );
    // Server rows are rendered as-is (not re-paged locally).
    expect(cards().length).toBe(12);
    // rowCount=100, pageSize=12 -> "1–12 of 100".
    expect(container.querySelector(".twc-cardgrid__count").textContent).toBe("1–12 of 100");
    await waitFor(() => expect(onServerChange).toHaveBeenCalled());
    expect(onServerChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 0, pageSize: 12, quickFilter: "", filters: [] }),
    );
  });

  it("re-emits the query with the new page on navigation", async () => {
    const onServerChange = vi.fn();
    render(<CardGrid serverMode rows={makeRows(12)} rowCount={100} onServerChange={onServerChange} renderCard={card} />);
    await waitFor(() => expect(onServerChange).toHaveBeenCalled());
    const pageBtn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "2");
    fireEvent.click(pageBtn);
    await waitFor(() => expect(onServerChange).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 })));
  });

  it("shows the loading overlay", () => {
    const { container } = render(<CardGrid serverMode loading rows={[]} rowCount={0} onServerChange={() => {}} renderCard={card} />);
    expect(container.querySelector(".twc-cardgrid__spinner")).toBeTruthy();
    expect(container.querySelector(".twc-cardgrid__body").getAttribute("aria-busy")).toBe("true");
  });
});
