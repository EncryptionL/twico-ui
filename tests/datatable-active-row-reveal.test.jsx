import React from "react";
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #460 — the same defect class as #429, which had only been fixed on the CELL path. The controlled
// activeRow reveal keyed its effect on the `keyIndex` Map identity, and `paged` -> `leafRows` ->
// `keyIndex` were all rebuilt on every render, so the effect fired on EVERY render rather than when the
// active row changed: scroll the grid down, then trigger any unrelated re-render (an overflow tooltip
// opening, a parent state change, a new inline callback prop) and the viewport snapped back to the
// active row - dragging the host page with it, since scrollIntoView walks every scrollable ancestor.
//
// The effect now keys on the resolved row index, a primitive.
//
// NB: data-active (what the reveal queries for) is only emitted in selectionMode="row".

const rows = Array.from({ length: 30 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}` }));
const columns = [{ field: "name", label: "Name" }];

let spy;
beforeEach(() => {
  // jsdom has no scrollIntoView at all, and the component guards on its existence
  spy = vi.fn();
  Element.prototype.scrollIntoView = spy;
});
afterEach(() => { cleanup(); delete Element.prototype.scrollIntoView; });

describe("Datatable controlled activeRow reveal (#460)", () => {
  it("reveals the active row on mount", () => {
    render(<Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r1" height={240} />);
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  it("does not re-reveal on an unrelated re-render", () => {
    const { rerender } = render(
      <Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r1" height={240} onRowClick={() => {}} />
    );
    const n = spy.mock.calls.length;
    // a fresh inline callback + a fresh (same-content) rows array: the churn a real parent produces
    rerender(<Datatable selectionMode="row" rows={[...rows]} columns={columns} activeRowId="r1" height={240} onRowClick={() => {}} />);
    rerender(<Datatable selectionMode="row" rows={[...rows]} columns={columns} activeRowId="r1" height={240} onRowClick={() => {}} />);
    expect(spy.mock.calls.length).toBe(n);
  });

  it("still reveals when the active row actually changes", () => {
    const { rerender } = render(
      <Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r1" height={240} />
    );
    const n = spy.mock.calls.length;
    rerender(<Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r5" height={240} />);
    expect(spy.mock.calls.length).toBe(n + 1);
  });

  it("still reveals when the row arrives later (the server-mode page-fetch case, #395)", () => {
    const { rerender } = render(
      <Datatable selectionMode="row" rows={rows.slice(0, 1)} columns={columns} activeRowId="r2" height={240} />
    );
    expect(spy).not.toHaveBeenCalled();   // r2 is not in the DOM yet, so there is nothing to reveal
    rerender(<Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r2" height={240} />);
    expect(spy).toHaveBeenCalledTimes(1); // ...and the reveal lands once the row mounts
  });

  it("stays out of it entirely when the reveal is switched off", () => {
    const { rerender } = render(
      <Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r1" scrollActiveRowIntoView={false} height={240} />
    );
    rerender(<Datatable selectionMode="row" rows={[...rows]} columns={columns} activeRowId="r1" scrollActiveRowIntoView={false} height={240} />);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("Datatable reveal survives a loading pass (#460 review)", () => {
  it("re-reveals once loading ends, because the skeleton rows replaced the real ones", () => {
    const { rerender } = render(
      <Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r1" height={240} />
    );
    const n = spy.mock.calls.length;
    expect(n).toBeGreaterThanOrEqual(1);
    // while loading, the body renders skeleton <tr>s - there is no [data-active] row to reveal
    rerender(<Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r1" height={240} loading />);
    expect(spy.mock.calls.length).toBe(n);
    // ...and when it ends the real row is back, so the reveal has to land again
    rerender(<Datatable selectionMode="row" rows={rows} columns={columns} activeRowId="r1" height={240} />);
    expect(spy.mock.calls.length).toBe(n + 1);
  });
});
