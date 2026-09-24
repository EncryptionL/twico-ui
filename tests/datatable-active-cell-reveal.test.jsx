import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #429 — the controlled activeCell reveal must fire once per (activeCell, position) change, NOT on every render.
// It used to key on the churning `cellColIndex`/`keyIndex` object identities (via a non-memoized `visibleCols`),
// so an unrelated host render — or any refetch that produced a fresh rows array — re-revealed the target and
// scrolled the user back, defeating #421. Fix: memoize `visibleCols` and key the effect on the resolved ri/ci
// primitives, so a no-op refetch (row still at the same index) no longer pulls the grid back.

const cols = [{ field: "name" }, { field: "age", type: "number" }];
const rowsA = [
  { id: 1, name: "A", age: 1 },
  { id: 2, name: "B", age: 2 },
  { id: 3, name: "C", age: 3 },
];
const rect = (top, bottom) => ({ top, bottom, left: 0, right: 100, width: 100, height: bottom - top, x: 0, y: top, toJSON() {} });
const scroller = (c) => c.querySelector(".twc-dt__scroll");

let origRect, origScrollTop, store;
beforeEach(() => {
  origRect = Element.prototype.getBoundingClientRect;
  // Force the active cell far below the scroller viewport so the reveal must scroll down (observable delta = 640).
  Element.prototype.getBoundingClientRect = function () {
    if (this.classList && this.classList.contains("twc-dt__scroll")) return rect(0, 400);
    if (this.classList && this.classList.contains("twc-dt__td")) return rect(1000, 1040);
    return rect(0, 40);
  };
  // jsdom's scrollTop is a no-op (always 0). Back it with a WeakMap so the reveal's writes are observable.
  store = new WeakMap();
  origScrollTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollTop");
  Object.defineProperty(HTMLElement.prototype, "scrollTop", {
    configurable: true,
    get() { return store.get(this) || 0; },
    set(v) { store.set(this, v); },
  });
});
afterEach(() => {
  Element.prototype.getBoundingClientRect = origRect;
  if (origScrollTop) Object.defineProperty(HTMLElement.prototype, "scrollTop", origScrollTop);
  else delete HTMLElement.prototype.scrollTop;
  cleanup();
});

describe("Datatable controlled activeCell reveal fires once per change (#429)", () => {
  it("does not re-reveal on an unrelated re-render or a no-op refetch, but does on a real activeCell change", () => {
    const props = { rowKey: (r) => r.id, columns: cols, selectionMode: "cell", scrollActiveCellIntoView: true };
    const { container, rerender } = render(
      <Datatable {...props} rows={rowsA} activeCell={{ key: 3, field: "age" }} />,
    );
    const sc = scroller(container);
    expect(sc.scrollTop).toBe(640); // revealed once on mount

    sc.scrollTop = 0; // the user scrolls the target out of view

    // (1) unrelated host re-render: a NEW activeCell object with the SAME key/field, same rows
    rerender(<Datatable {...props} rows={rowsA} activeCell={{ key: 3, field: "age" }} />);
    expect(sc.scrollTop).toBe(0); // not pulled back

    // (2) no-op refetch: a fresh rows array with identical keys/order — the row stays at the same index
    const rowsB = rowsA.map((r) => ({ ...r }));
    rerender(<Datatable {...props} rows={rowsB} activeCell={{ key: 3, field: "age" }} />);
    expect(sc.scrollTop).toBe(0); // the #429 bug: previously re-revealed on every refetch

    // (3) a genuine activeCell change DOES re-reveal
    rerender(<Datatable {...props} rows={rowsB} activeCell={{ key: 1, field: "name" }} />);
    expect(sc.scrollTop).toBe(640);
  });

  it("re-reveals when the row moves to a different index (server-mode page landing / reorder)", () => {
    const props = { rowKey: (r) => r.id, columns: cols, selectionMode: "cell", scrollActiveCellIntoView: true };
    // start with the target row ABSENT (server page not loaded) — nothing to reveal yet
    const { container, rerender } = render(
      <Datatable {...props} rows={[{ id: 1, name: "A", age: 1 }]} activeCell={{ key: 3, field: "age" }} />,
    );
    const sc = scroller(container);
    expect(sc.scrollTop).toBe(0); // ri unresolved → no reveal

    // the page arrives with row 3 present → ri goes undefined→number → reveal fires
    rerender(<Datatable {...props} rows={rowsA} activeCell={{ key: 3, field: "age" }} />);
    expect(sc.scrollTop).toBe(640);
  });
});
