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

// #461 (review) - the clamp must not fire when the page is not KNOWABLY out of range, and must not
// fight the reset-to-page-0 that a filter change already performs.
describe("CardGrid clamp guards (#461 review)", () => {
  it("does not clamp in serverMode when the host has not supplied rowCount", () => {
    const seen = [];
    render(
      <CardGrid serverMode rows={mk(12)} renderCard={card} pageSize={12} page={5}
        onPageChange={(p) => seen.push(p)} />
    );
    // total falls back to rows.length (one page worth), so every page LOOKS out of range
    expect(seen).toEqual([]);
  });

  it("still clamps in serverMode once rowCount says the page is past the end", () => {
    const seen = [];
    render(
      <CardGrid serverMode rows={mk(10)} rowCount={10} renderCard={card} pageSize={12} page={5}
        onPageChange={(p) => seen.push(p)} />
    );
    expect(seen).toContain(0);
  });

  it("does not clamp while loading", () => {
    const seen = [];
    render(
      <CardGrid rows={[]} loading renderCard={card} pageSize={12} page={5}
        onPageChange={(p) => seen.push(p)} />
    );
    expect(seen).toEqual([]);
  });

  it("lets a filter change reset to the FIRST page, not clamp to the last", () => {
    const seen = [];
    const base = {
      rows: mk(100), renderCard: card, pageSize: 12,
      columns: [{ field: "name" }],
      onPageChange: (p) => seen.push(p),
    };
    const { rerender } = render(<CardGrid {...base} page={8} filters={[]} />);
    seen.length = 0;
    rerender(<CardGrid {...base} page={8} filters={[{ field: "name", op: "contains", value: "Row 1" }]} />);
    // the reset owns this render; the clamp must not follow it with commitPage(lastPage)
    expect(seen).toEqual([0]);
  });
});
