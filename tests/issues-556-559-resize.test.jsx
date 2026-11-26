import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { Datatable } from "../src/index.ts";

// The component's scoped stylesheet, wherever React put it (React 19 hoists it to <head>, so it is
// not inside `container`). Reading it is the only way a jsdom test can guard a CSS-only claim -
// jsdom has no layout, so the geometry itself is a browser check.
const dtCss = () => [...document.querySelectorAll("style")].map((s) => s.textContent || "").join("");

// #566: both drags coalesce their state updates to one per animation frame, so a pointermove does
// not land synchronously any more. Tests drive the frame rather than pretending it is synchronous.
const frame = () => act(() => new Promise((r) => requestAnimationFrame(() => r())));
// #566: a run of resize KEYSTROKES is one gesture too - the store write lands once it goes idle.
const kbIdle = () => act(() => new Promise((r) => setTimeout(r, KB_IDLE + 60)));
const KB_IDLE = 180;

afterEach(cleanup);

const COLS = [{ field: "name", headerName: "Name" }, { field: "state", headerName: "State" }];
const ROWS = [
  { id: "a", name: "Alpha", state: "live" },
  { id: "b", name: "Bravo", state: "removed" },
  { id: "c", name: "Charlie", state: "live" },
];
const key = (r) => r.id;

const strips = (c) => [...c.querySelectorAll(".twc-dt__row-resizer")];
const rows = (c) => [...c.querySelectorAll(".twc-dt__row")];
const scrollH = (c) => c.querySelector(".twc-dt__scroll").style.maxHeight;

// Every property actually SET on the style attribute, read off the declaration rather than probed by
// name. See docs/development.md - a hand-written list of property names leaves a hole the size of
// every spelling it did not think of, and in this library that is usually the logical one.
const inline = (el) => [...el.style].sort();

// =================================================================================================
// #556 / #557 — the row resizer mounted inside the checkbox cell and nowhere else, so without
// checkboxSelection it was not degraded but INERT, and when it did mount a sticky cell became its
// containing block, making the "full-row" strip 44px wide in the bottom-left corner.
// =================================================================================================
describe("Datatable — rowResize without checkboxSelection (#556)", () => {
  it("renders a handle on a grid with no checkbox column - the reported defect", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    expect(container.querySelector(".twc-dt__check"), "no checkbox column at all").toBeNull();
    expect(strips(container).length, "rowResize was silently dead on every grid like this").toBe(ROWS.length);
  });

  it("one handle per row, not one per cell", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    for (const tr of rows(container)) expect(tr.querySelectorAll(".twc-dt__row-resizer").length).toBe(1);
  });

  it("the same holds with checkboxSelection - the path that did work still works", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} checkboxSelection rowResize />);
    expect(strips(container).length).toBe(ROWS.length);
  });

  it("rowResize={false} still draws none, with or without a checkbox column", () => {
    const { container: a } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} />);
    const { container: b } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} checkboxSelection />);
    expect(strips(a).length).toBe(0);
    expect(strips(b).length).toBe(0);
  });

  it('rowResize="row" reaches a checkbox-less grid too', () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize="row" />);
    expect(strips(container).length).toBe(ROWS.length);
    expect(strips(container)[0].getAttribute("aria-label")).toBe("Drag to resize this row (double-click to reset)");
  });
});

describe("Datatable — the strip's containing block is the row (#557)", () => {
  it("the handle is NOT inside a pinned cell - a sticky cell would be the containing block", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} checkboxSelection rowResize />);
    for (const s of strips(container)) {
      expect(s.parentElement.getAttribute("data-pin"),
        "position:sticky establishes a containing block, which is what made the strip 44px wide").toBeNull();
    }
  });

  it("it skips a pinned FIRST column and lands on the first unpinned cell", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize
        initialState={{ columnPinning: { name: "left" } }} />);
    const s = strips(container)[0];
    expect(s.parentElement.getAttribute("data-pin")).toBeNull();
    expect(s.parentElement.getAttribute("data-c"), "the second column, the first unpinned one").toBe("1");
  });

  it("the row is marked as the containing block, and only when it has a handle", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    for (const tr of rows(container)) expect(tr.hasAttribute("data-row-resizable")).toBe(true);
  });

  it("it skips an EDITABLE cell too - that one is position:relative for its pencil hint", () => {
    // Caught by the docs-site interaction check and not by an isolated probe: it needs editMode,
    // which the "All props" variation has and a hand-built probe did not.
    const { container } = render(
      <Datatable columns={[{ field: "name" }, { field: "state", editable: false }]}
        rows={ROWS} rowKey={key} rowResize editMode />);
    const s = strips(container)[0];
    expect(s.parentElement.getAttribute("data-editable"),
      "an editable host cell would take the strip's width back off the row").toBeNull();
    expect(s.parentElement.getAttribute("data-c"), "the second column, the only non-editable one").toBe("1");
  });

  it("...and still mounts when EVERY unpinned column is editable, one cell wide", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize editMode />);
    const s = strips(container)[0];
    expect(s, "degrading to a cell-wide strip beats having none").not.toBeNull();
    expect(s.parentElement.getAttribute("data-c"),
      "the row's leading edge - an editable cell must stay positioned for its own hint").toBe("0");
  });

  it("a grid without rowResize changes no positioning at all", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} />);
    expect(container.querySelectorAll("[data-row-resizable]").length).toBe(0);
  });

  it("the row's positioning lives in the STYLESHEET, not in an inline style", () => {
    // What the leftover `inline` helper was evidence of. An inline declaration beats every
    // stylesheet rule at any specificity - the whole substance of #543/#547/#551 - so if the row's
    // `position`/`z-index` were ever "fixed" by putting them on the style attribute, a consumer
    // could no longer override the row's stacking at all, and `data-row-resizable` would become
    // decorative. A resizable row carries ONLY the height inline, and only once one is set.
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const tr = rows(container)[0];
    expect(tr.hasAttribute("data-row-resizable")).toBe(true);
    expect(inline(tr), "nothing inline until the user sets a height").toEqual([]);
    fireEvent.keyDown(strips(container)[0], { key: "PageDown" });
    expect(inline(rows(container)[0]), "the height, and nothing else").toEqual(["height"]);
  });

  it("the CSS half carries BOTH declarations - the position AND the stacking context", () => {
    // Deleting either one leaves every DOM assertion above green while breaking the feature:
    // without `position: relative` the containing block becomes .twc-dt__scroll and the strip spans
    // the whole viewport; without `z-index: 0` the strip's z-index 6 escapes the row and outranks
    // the sticky header (3, or 5 pinned) and tfoot (3/4). Measured in Chromium: 372 of 3612 header
    // hit-tests landed on the strip across 31 scroll offsets, with the sort control unreachable,
    // plus 35 of 301 footer probes - all zero with the stacking context in place.
    render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    expect(dtCss()).toContain(".twc-dt__row[data-row-resizable] { position: relative; z-index: 0; }");
  });

  it("every data column hidden still leaves a handle, in the checkbox cell", () => {
    // Moving the mount out of the checkbox cell took this case from one handle to none - a
    // regression against pre-#556 behaviour, reachable in two clicks via the Columns panel.
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize checkboxSelection
        initialState={{ columnVisibility: { name: false, state: false } }} />);
    const all = strips(container);
    expect(all.length, "a handle somewhere beats no handle").toBe(ROWS.length);
    expect(all[0].parentElement.getAttribute("data-pin"),
      "the only cell the row has left, so the strip is that cell's width").toBe("left");
  });

  it("...and with no checkbox column either there is simply nothing to mount in", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize
        initialState={{ columnVisibility: { name: false, state: false } }} />);
    expect(strips(container).length).toBe(0);
  });
});

// =================================================================================================
// #558 — the row handle had four props and no more: className, a native title, onPointerDown and a
// click guard. The COLUMN resizer beside it has had role=separator, aria-value* and arrow keys all
// along, so row height was the one dimension unreachable without a pointer.
// =================================================================================================
describe("Datatable — the row handle's accessibility contract (#558)", () => {
  const one = () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    return { container, s: strips(container)[0] };
  };

  it("is a horizontal separator that reports its value and its bounds", () => {
    const { s } = one();
    expect(s.getAttribute("role")).toBe("separator");
    expect(s.getAttribute("aria-orientation")).toBe("horizontal");
    expect(s.getAttribute("aria-valuemin")).toBe("32");
    expect(s.getAttribute("aria-valuemax")).toBe("2000");
    expect(Number(s.getAttribute("aria-valuenow")), "the height the row is actually rendering at")
      .toBeGreaterThan(0);
  });

  it("carries the hint in aria-label, and no longer in a duplicate native title", () => {
    const { s } = one();
    expect(s.getAttribute("aria-label")).toBe("Drag to resize every row (double-click to reset)");
    // #567: the title duplicated the aria-label word for word one line below it, so assistive tech
    // could announce the same string twice - a title becomes the DESCRIPTION when aria-label names
    // the control - and a native tooltip is neither themeable nor reachable by keyboard or touch.
    expect(s.getAttribute("title"), "dropped on all three resizers").toBeNull();
  });

  it("no resizer in the grid carries a native title any more", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize heightResize />);
    for (const sel of [".twc-dt__row-resizer", ".twc-dt__hgrip", ".twc-dt__resizer"]) {
      const els = [...container.querySelectorAll(sel)];
      expect(els.length, sel).toBeGreaterThan(0);
      for (const el of els) expect(el.getAttribute("title"), sel).toBeNull();
    }
  });

  it("is reachable by keyboard - exactly ONE tab stop while the height is shared", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const tabs = strips(container).map((s) => s.getAttribute("tabindex"));
    expect(tabs.filter((t) => t === "0").length,
      "every strip drives the same number, so N stops would be N identical stops").toBe(1);
    expect(tabs.length).toBe(ROWS.length);
  });

  it('...and one per row in "row" mode, where each drives a different height', () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize="row" />);
    const tabs = strips(container).map((s) => s.getAttribute("tabindex"));
    expect(tabs).toEqual(ROWS.map(() => "0"));
  });

  it("ArrowDown grows every row and ArrowUp shrinks it back", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const s = strips(container)[0];
    const start = Number(s.getAttribute("aria-valuenow"));
    fireEvent.keyDown(s, { key: "ArrowDown" });
    expect(rows(container).map((r) => r.style.height)).toEqual(ROWS.map(() => `${start + 8}px`));
    fireEvent.keyDown(strips(container)[0], { key: "ArrowUp" });
    expect(rows(container).map((r) => r.style.height)).toEqual(ROWS.map(() => `${start}px`));
  });

  it("PageDown/PageUp step coarsely, and Home returns to the floor", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const start = Number(strips(container)[0].getAttribute("aria-valuenow"));
    fireEvent.keyDown(strips(container)[0], { key: "PageDown" });
    expect(rows(container)[0].style.height).toBe(`${start + 32}px`);
    fireEvent.keyDown(strips(container)[0], { key: "Home" });
    expect(rows(container)[0].style.height, "the useful destination; there is no End for a row").toBe("32px");
  });

  it('"row" mode steps only the row whose handle was pressed', () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize="row" />);
    fireEvent.keyDown(strips(container)[1], { key: "PageDown" });
    const hs = rows(container).map((r) => r.style.height);
    expect(hs[0]).toBe("");
    expect(hs[1]).not.toBe("");
    expect(hs[2]).toBe("");
  });

  it("a ROW drag also writes the store once, and reports once", async () => {
    const onState = vi.fn();
    const onRowResize = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize
        onStateChange={onState} onRowResize={onRowResize} />);
    const s = strips(container)[0];
    const before = onState.mock.calls.length;
    fireEvent.pointerDown(s, { clientY: 100 });
    for (const clientY of [110, 120, 130, 140, 150]) fireEvent.pointerMove(window, { clientY });
    // #566: five moves, ONE state update - they coalesce into the next frame.
    await frame();
    expect(onState.mock.calls.length - before, "#542 wrote state on every move too").toBe(0);
    expect(rows(container)[0].style.height, "the live drag still renders").toBe("94px");
    fireEvent.pointerUp(window, { clientY: 150 });
    expect(onState.mock.calls.at(-1)[0].rowHeight).toBe(94);
    expect(onRowResize, "once per completed drag, as its doc always said").toHaveBeenCalledTimes(1);
    expect(onRowResize).toHaveBeenCalledWith(94, null);
  });

  it("five pointermoves inside one frame produce ONE render, not five", async () => {
    // #566: a pointer emits 60-120 events a second and a row height feeds every row, every cell
    // and every custom renderCell, so the uncoalesced drag re-rendered the whole body that often.
    let renders = 0;
    const Cell = () => { renders += 1; return <span>x</span>; };
    const cols = [{ field: "name", headerName: "Name", renderCell: () => <Cell /> }];
    const { container } = render(
      <Datatable columns={cols} rows={ROWS} rowKey={key} rowResize />);
    fireEvent.pointerDown(strips(container)[0], { clientY: 100 });
    renders = 0;
    for (const clientY of [110, 120, 130, 140, 150]) fireEvent.pointerMove(window, { clientY });
    expect(renders, "nothing has rendered yet - the frame has not run").toBe(0);
    await frame();
    expect(renders, "one render for the whole burst, one cell per row").toBe(ROWS.length);
    fireEvent.pointerUp(window, { clientY: 150 });
  });

  it("a row drag honours the same ceiling a restore does", async () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    fireEvent.pointerDown(strips(container)[0], { clientY: 0 });
    fireEvent.pointerMove(window, { clientY: 99999 });
    await frame();
    expect(rows(container)[0].style.height, "the drag used to be uncapped").toBe("2000px");
    fireEvent.pointerUp(window, { clientY: 99999 });
  });

  it("the drag's window listeners do not outlive the component", () => {
    const { container, unmount } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const added = [];
    const origAdd = window.addEventListener.bind(window);
    const origRemove = window.removeEventListener.bind(window);
    const addSpy = vi.spyOn(window, "addEventListener").mockImplementation((t, f, o) => {
      if (t === "pointermove" || t === "pointerup") added.push([t, f]);
      return origAdd(t, f, o);
    });
    const removed = [];
    const remSpy = vi.spyOn(window, "removeEventListener").mockImplementation((t, f, o) => {
      if (t === "pointermove" || t === "pointerup") removed.push([t, f]);
      return origRemove(t, f, o);
    });
    fireEvent.pointerDown(strips(container)[0], { clientY: 100 });
    fireEvent.pointerMove(window, { clientY: 120 });
    expect(added.length, "a live gesture holds two window listeners").toBe(2);
    expect(removed.length).toBe(0);
    unmount(); // a route change or a closing dialog, mid-drag
    expect(removed.length, "unmount must detach whatever the gesture attached").toBe(2);
    addSpy.mockRestore();
    remSpy.mockRestore();
  });

  it("reports a keyboard change through onRowResize, like a completed drag", () => {
    const onRowResize = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize onRowResize={onRowResize} />);
    const start = Number(strips(container)[0].getAttribute("aria-valuenow"));
    fireEvent.keyDown(strips(container)[0], { key: "ArrowDown" });
    expect(onRowResize).toHaveBeenCalledWith(start + 8, null);
  });

  it("and persists it, so a keystroke is as durable as a drag", async () => {
    const onState = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize onStateChange={onState} />);
    expect(onState.mock.calls.at(-1)[0].rowHeight, "nothing set yet").toBeUndefined();
    fireEvent.keyDown(strips(container)[0], { key: "PageDown" });
    await kbIdle();
    expect(onState.mock.calls.at(-1)[0].rowHeight).toBeGreaterThan(32);
  });

  it("a RUN of keystrokes writes the store once, not once per keypress", async () => {
    // #566: the keyboard path bypassed the persist gate entirely, so every auto-repeat of a held
    // Arrow wrote the whole state and called onStateChange - ~60 writes for a two-second hold.
    const onState = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize onStateChange={onState} />);
    const before = onState.mock.calls.length;
    const s = strips(container)[0];
    for (let i = 0; i < 12; i++) fireEvent.keyDown(s, { key: "ArrowDown" });
    expect(onState.mock.calls.length - before, "nothing written while the keys are still coming").toBe(0);
    await kbIdle();
    expect(onState.mock.calls.length - before, "one write, once it goes idle").toBe(1);
    expect(rows(container)[0].style.height, "and every keystroke still moved the height").toBe("152px");
  });

  it("the keyboard honours the SAME ceiling a restore does", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize initialState={{ rowHeight: 1995 }} />);
    for (let i = 0; i < 4; i++) fireEvent.keyDown(strips(container)[0], { key: "PageDown" });
    expect(rows(container)[0].style.height,
      "the drag used to be uncapped while a restore clamped to 2000").toBe("2000px");
  });

  it("End goes to the ceiling - the bound the issue asked for, and the grip's sibling binds it too", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    fireEvent.keyDown(strips(container)[0], { key: "End" });
    expect(rows(container)[0].style.height).toBe("2000px");
    fireEvent.keyDown(strips(container)[0], { key: "Home" });
    expect(rows(container)[0].style.height).toBe("32px");
  });

  it("changes nothing on a key it does not own", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const before = rows(container)[0].style.height;
    for (const k of ["ArrowLeft", "ArrowRight", "Escape", "a", "Tab"]) {
      fireEvent.keyDown(strips(container)[0], { key: k });
    }
    expect(rows(container)[0].style.height).toBe(before);
  });

  it("keeps focus ON the handle - the grid must not take the keys it does not own", () => {
    // #557 moved the strip inside a .twc-dt__td[data-r], which is exactly what onGridKeyDown's
    // guard matches, so cell navigation was ejecting focus out of a focused handle. The column
    // resizer escapes this only by living in a <th>.
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const s = strips(container)[0];
    s.focus();
    expect(document.activeElement).toBe(s);
    for (const k of ["ArrowLeft", "ArrowRight", "End", "Home", "ArrowDown", "ArrowUp"]) {
      fireEvent.keyDown(s, { key: k });
      expect(document.activeElement, `${k} must not move focus off the handle`).toBe(s);
    }
  });

  it("Enter and Space on the handle do not activate the row or the cell", () => {
    // DT_CELL_WIDGET_SEL carries no [role="separator"], so the onWidget bail-out never covered the
    // handle: Enter was calling onRowClick and Space onCellSelectionChange.
    const onRowClick = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize selectionMode="row" onRowClick={onRowClick} />);
    const s = strips(container)[0];
    s.focus();
    fireEvent.keyDown(s, { key: "Enter" });
    fireEvent.keyDown(s, { key: " " });
    expect(onRowClick, "the handle is not a row activator").not.toHaveBeenCalled();
  });

  it("only the focusable strip is exposed to assistive tech", () => {
    // ARIA 1.2: aria-valuenow/min/max on role="separator" are supported only when it is focusable,
    // and in shared mode the rest are duplicates of one control.
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const all = strips(container);
    const exposed = all.filter((s) => s.getAttribute("role") === "separator");
    expect(exposed.length, "one control, one separator").toBe(1);
    expect(exposed[0].getAttribute("tabindex")).toBe("0");
    for (const s of all.filter((x) => x !== exposed[0])) {
      expect(s.getAttribute("aria-hidden")).toBe("true");
      expect(s.getAttribute("aria-valuenow"), "invalid on a non-focusable separator").toBeNull();
    }
  });

  it('...and in "row" mode every strip is exposed, because each drives its own height', () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize="row" />);
    const all = strips(container);
    expect(all.filter((s) => s.getAttribute("role") === "separator").length).toBe(all.length);
    expect(all.every((s) => s.getAttribute("aria-valuemax") === "2000")).toBe(true);
  });
});

// =================================================================================================
// #559 — column widths were a user resize that persisted, row height became one in 1.52, and the
// grid's own height was neither: a developer constant with no affordance and no state field, though
// it is the one that decides how many rows a reader sees at once.
// =================================================================================================
describe("Datatable — heightResize and DatatableState.height (#559)", () => {
  const grip = (c) => c.querySelector(".twc-dt__hgrip");

  it("no grip without the prop, and the height is exactly what the host asked for", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} height={300} />);
    expect(grip(container)).toBeNull();
    expect(scrollH(container)).toBe("300px");
  });

  it("the grip takes the COLUMN resizer's contract, not the row handle's", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} />);
    const g = grip(container);
    expect(g.getAttribute("role")).toBe("separator");
    expect(g.getAttribute("aria-orientation")).toBe("horizontal");
    expect(g.getAttribute("aria-label")).toBe("Resize the table height (double-click to reset)");
    expect(g.getAttribute("tabindex")).toBe("0");
    expect(g.getAttribute("aria-valuenow"), "height is the STARTING value, not a cap").toBe("300");
    expect(g.getAttribute("aria-valuemin")).toBe("160");
  });

  it("the ceiling is the viewport, not a flat pixel number that goes stale", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} />);
    const want = String(Math.max(240, Math.round(window.innerHeight * 0.95)));
    expect(grip(container).getAttribute("aria-valuemax"),
      "measured in an effect - reading window during render is an SSR hydration mismatch").toBe(want);
  });

  it("arrows step, pages step coarsely, Home and End go to the bounds", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} />);
    const max = Number(grip(container).getAttribute("aria-valuemax"));
    fireEvent.keyDown(grip(container), { key: "ArrowDown" });
    expect(scrollH(container)).toBe("316px");
    fireEvent.keyDown(grip(container), { key: "PageDown" });
    expect(scrollH(container)).toBe("396px");
    fireEvent.keyDown(grip(container), { key: "ArrowUp" });
    expect(scrollH(container)).toBe("380px");
    fireEvent.keyDown(grip(container), { key: "PageUp" });
    expect(scrollH(container)).toBe("300px");
    fireEvent.keyDown(grip(container), { key: "Home" });
    expect(scrollH(container)).toBe("160px");
    fireEvent.keyDown(grip(container), { key: "End" });
    expect(scrollH(container), "here End IS useful - as tall as my screen").toBe(`${max}px`);
  });

  it("aria-valuenow follows the height it reports on", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} />);
    fireEvent.keyDown(grip(container), { key: "PageDown" });
    expect(grip(container).getAttribute("aria-valuenow")).toBe("380");
    expect(scrollH(container)).toBe("380px");
  });

  it("round-trips through onStateChange, like every other user resize", async () => {
    const onState = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} onStateChange={onState} />);
    expect(onState.mock.calls.at(-1)[0].height, "absent until the user moves it").toBeUndefined();
    fireEvent.keyDown(grip(container), { key: "ArrowDown" });
    await kbIdle(); // #566: the keyboard commits once the run goes idle
    expect(onState.mock.calls.at(-1)[0].height).toBe(316);
    expect(onState.mock.calls.at(-1)[0].columnWidths, "beside the resize that always did").toBeDefined();
  });

  it("initialState.height restores it with no opt-in", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300}
        initialState={{ height: 520 }} />);
    expect(scrollH(container)).toBe("520px");
    expect(grip(container).getAttribute("aria-valuenow")).toBe("520");
  });

  it("a snapshot from a bigger screen renders clamped but is STORED as written", () => {
    const onState = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize
        initialState={{ height: 999999 }} onStateChange={onState} />);
    const cap = Math.max(240, Math.round(window.innerHeight * 0.95));
    expect(scrollH(container), "clamped on render, so it cannot run off the bottom here").toBe(`${cap}px`);
    // #568 raised the absolute sanity bound from 2000, which doubled as "about two viewports" and
    // became too low once a host can opt out of the viewport ceiling entirely.
    expect(onState.mock.calls.at(-1)[0].height,
      "kept at the absolute bound, so it un-clamps again on the big monitor").toBe(10000);
  });

  it("ignores a non-numeric height rather than applying it", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300}
        initialState={{ height: "520px" }} />);
    expect(scrollH(container)).toBe("300px");
  });

  // The drag itself had no test anywhere in the suite - `grep -rln pointerDown tests/` was empty
  // across all 186 files - although it is the headline gesture of all four resize issues.
  it("a height drag writes the store ONCE per gesture, not once per pointermove", async () => {
    const onState = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} onStateChange={onState} />);
    const g = container.querySelector(".twc-dt__hgrip");
    const before = onState.mock.calls.length;
    fireEvent.pointerDown(g, { clientY: 400 });
    for (const clientY of [410, 420, 430, 440, 450]) fireEvent.pointerMove(window, { clientY });
    await frame();
    const during = onState.mock.calls.length;
    expect(scrollH(container), "the live value still drives the render").toBe("350px");
    expect(during - before, "a 200px drag used to emit one full state write per move").toBe(0);
    fireEvent.pointerUp(window, { clientY: 450 });
    const after = onState.mock.calls.length;
    expect(after - during, "one write, when the gesture settles").toBe(1);
    expect(onState.mock.calls.at(-1)[0].height).toBe(350);
  });

  it("a height drag is clamped at both ends", async () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} />);
    const g = container.querySelector(".twc-dt__hgrip");
    const cap = Math.max(240, Math.round(window.innerHeight * 0.95));
    fireEvent.pointerDown(g, { clientY: 400 });
    fireEvent.pointerMove(window, { clientY: -5000 });
    await frame();
    expect(scrollH(container)).toBe("160px");
    fireEvent.pointerMove(window, { clientY: 5000 });
    await frame();
    expect(scrollH(container)).toBe(`${cap}px`);
    fireEvent.pointerUp(window, { clientY: 5000 });
  });

  it("a stored height is NOT applied with heightResize off - turning it off turns it off", () => {
    // 1.54.0 applied it anyway, so a stale preference silently overrode the developer's `height`
    // with no grip left to change it (#564). The previous version of this test asserted that
    // behaviour and only checked the clamp; the restore is now gated on the prop instead.
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} height={420} initialState={{ height: 1900 }} />);
    expect(container.querySelector(".twc-dt__hgrip"), "no grip without the prop").toBeNull();
    expect(scrollH(container), "the developer's height stands").toBe("420px");
  });

  it("...but it is KEPT, so switching the prop back on gets the user's size back", () => {
    const onState = vi.fn();
    const { container, rerender } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} height={420}
        initialState={{ height: 600 }} onStateChange={onState} />);
    expect(scrollH(container)).toBe("420px");
    expect(onState.mock.calls.at(-1)[0].height, "still round-trips while unapplied").toBe(600);
    rerender(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} height={420} heightResize
        initialState={{ height: 600 }} onStateChange={onState} />);
    // The restore ran at mount, so the carried value is applied when the grip appears.
    expect(container.querySelector(".twc-dt__hgrip")).not.toBeNull();
  });

  it("a dragged height is un-applied if the prop goes false", async () => {
    const { container, rerender } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} height={420} heightResize />);
    fireEvent.keyDown(container.querySelector(".twc-dt__hgrip"), { key: "PageDown" });
    expect(scrollH(container)).toBe("500px");
    rerender(<Datatable columns={COLS} rows={ROWS} rowKey={key} height={420} />);
    expect(scrollH(container), "no grip, so the height must not be left standing").toBe("420px");
    await kbIdle();
  });

  it("existing call sites render unchanged - the prop alone moves nothing", () => {
    const { container: off } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} />);
    const { container: on } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize />);
    expect(scrollH(off)).toBe("440px");
    expect(scrollH(on)).toBe("440px");
  });
});

// =================================================================================================
// #554 — there was no way to say "every Datatable in this app has this prop", so adopting one
// capability was a 24-call-site sweep, and the sweep is the part that rots: the next grid someone
// adds is the one that silently lacks it, and nothing fails.
