import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { CardGrid } from "../components/data-display/CardGrid.jsx";

// #461 — CardGrid reset to page 0 on quick-filter / sort / page-size / filters changes, but nothing
// caught `rows` itself shrinking. A refetch or a deletion left the page index past the end, the slice
// came back empty, and the grid rendered its empty state ("No results.") over rows that DO match - with
// a footer reading "97–10 of 10" and a Pagination whose Next was disabled and Prev inert. Datatable has
// had this clamp all along; CardGrid never got one.

afterEach(cleanup);

const mk = (n) => Array.from({ length: n }, (_, i) => ({ id: i, name: `Row ${i}` }));
const card = (r) => <span>{r.name}</span>;
const cards = (c) => [...c.querySelectorAll('[role="listitem"]')];
const empty = (c) => c.querySelector(".twc-cardgrid__empty");
const count = (c) => c.querySelector(".twc-cardgrid__count")?.textContent;

describe("CardGrid clamps an out-of-range page (#461)", () => {
  it("renders the rows instead of a false empty state when the result set shrinks", () => {
    const { container, rerender } = render(
      <CardGrid rows={mk(100)} renderCard={card} pageSize={12} page={8} />
    );
    expect(cards(container)).toHaveLength(4); // page 9 of 100/12

    rerender(<CardGrid rows={mk(10)} renderCard={card} pageSize={12} page={8} />);
    expect(empty(container)).toBe(null);
    expect(cards(container)).toHaveLength(10);
  });

  it("never prints an inverted range", () => {
    const { container, rerender } = render(
      <CardGrid rows={mk(100)} renderCard={card} pageSize={12} page={8} />
    );
    rerender(<CardGrid rows={mk(10)} renderCard={card} pageSize={12} page={8} />);
    expect(count(container)).toBe("1–10 of 10");
  });

  it("reports the clamped page back to a controlled host", () => {
    const seen = [];
    const { rerender } = render(
      <CardGrid rows={mk(100)} renderCard={card} pageSize={12} page={8} onPageChange={(p) => seen.push(p)} />
    );
    rerender(<CardGrid rows={mk(10)} renderCard={card} pageSize={12} page={8} onPageChange={(p) => seen.push(p)} />);
    expect(seen).toContain(0); // 10 rows / 12 per page -> one page -> index 0
  });

  it("clamps to the LAST page, not back to the first, when several pages survive", () => {
    const seen = [];
    const { rerender } = render(
      <CardGrid rows={mk(100)} renderCard={card} pageSize={12} page={8} onPageChange={(p) => seen.push(p)} />
    );
    rerender(<CardGrid rows={mk(40)} renderCard={card} pageSize={12} page={8} onPageChange={(p) => seen.push(p)} />);
    expect(seen).toContain(3); // ceil(40/12) = 4 pages -> last index 3
  });

  it("leaves an in-range page alone", () => {
    const seen = [];
    render(<CardGrid rows={mk(100)} renderCard={card} pageSize={12} page={2} onPageChange={(p) => seen.push(p)} />);
    expect(seen).toEqual([]);
  });

  it("shows a real empty state when there genuinely are no rows", () => {
    const { container } = render(<CardGrid rows={[]} renderCard={card} pageSize={12} />);
    expect(empty(container)).not.toBe(null);
    expect(count(container)).toBe("No results");
  });
});
