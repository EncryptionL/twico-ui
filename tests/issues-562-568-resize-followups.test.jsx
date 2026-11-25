import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { Datatable } from "../src/index.ts";

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
const grip = (c) => c.querySelector(".twc-dt__hgrip");
const colRz = (c) => [...c.querySelectorAll(".twc-dt__resizer")];
const scrollH = (c) => c.querySelector(".twc-dt__scroll").style.maxHeight;

const KB_IDLE = 180;
// Both drags coalesce to one state update per animation frame (#566).
const frame = () => act(() => new Promise((r) => requestAnimationFrame(() => r())));
// A run of resize keystrokes is one gesture; the store write lands once it goes idle (#566).
const kbIdle = () => act(() => new Promise((r) => setTimeout(r, KB_IDLE + 60)));

// A state change that is NOT a resize, used to prove the grid is still persisting. The column
// resizer's keyboard writes `widths`, which the persist effect depends on.
const nudgeAColumn = async (container) => {
  fireEvent.keyDown(colRz(container)[0], { key: "ArrowRight" });
  await kbIdle();
};

// =================================================================================================
// #562 — neither drag ended on pointercancel, and the persist effect is GATED on the drag flags.
// One cancelled height drag therefore left the flag true forever and the grid silently stopped
// saving ANY state. That is the regression; the stuck handle was the visible half.
// =================================================================================================
describe("Datatable — a cancelled drag must not wedge the grid (#562)", () => {
  it("THE regression: after a cancelled height drag the grid still persists everything else", async () => {
    const onState = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300}
        onStateChange={onState} />);
    fireEvent.pointerDown(grip(container), { clientY: 400 });
    fireEvent.pointerMove(window, { clientY: 450 });
    await frame();
    fireEvent.pointerCancel(window, { clientY: 450 }); // a second finger, a long-press menu, an OS interrupt

    const before = onState.mock.calls.length;
    await nudgeAColumn(container);
    expect(onState.mock.calls.length - before,
      "1.54.0 wrote nothing from here until the grid was remounted").toBeGreaterThan(0);
    expect(onState.mock.calls.at(-1)[0].columnWidths, "and the change itself is in the snapshot")
      .toBeDefined();
  });

  it("...and the same for a cancelled ROW drag", async () => {
    const onState = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize onStateChange={onState} />);
    fireEvent.pointerDown(strips(container)[0], { clientY: 100 });
    fireEvent.pointerMove(window, { clientY: 160 });
    await frame();
    fireEvent.pointerCancel(window, { clientY: 160 });

    const before = onState.mock.calls.length;
    await nudgeAColumn(container);
    expect(onState.mock.calls.length - before).toBeGreaterThan(0);
  });

  it("a cancelled gesture ABORTS rather than commits - it is not a size the user chose", async () => {
    const onHeightResize = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300}
        onHeightResize={onHeightResize} />);
    fireEvent.pointerDown(grip(container), { clientY: 400 });
    fireEvent.pointerMove(window, { clientY: 500 });
    await frame();
    expect(scrollH(container), "the live drag renders").toBe("400px");
    fireEvent.pointerCancel(window, { clientY: 500 });
    expect(scrollH(container), "and reverts on cancel").toBe("300px");
    expect(onHeightResize, "nothing was chosen, so nothing is reported").not.toHaveBeenCalled();
  });

  it("a cancelled ROW drag restores NOTHING, not the measured start height", async () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    expect(rows(container)[0].style.height, "no height to begin with").toBe("");
    fireEvent.pointerDown(strips(container)[0], { clientY: 100 });
    fireEvent.pointerMove(window, { clientY: 180 });
    await frame();
    expect(rows(container)[0].style.height).not.toBe("");
    fireEvent.pointerCancel(window, { clientY: 180 });
    expect(rows(container)[0].style.height,
      "reverting to the start value would leave an explicit height where the preset had been").toBe("");
  });

  it("a plain hover after a cancelled drag does not keep resizing", async () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} />);
    fireEvent.pointerDown(grip(container), { clientY: 400 });
    fireEvent.pointerCancel(window, { clientY: 400 });
    fireEvent.pointerMove(window, { clientY: 900 }); // onMove checked no button state
    await frame();
    expect(scrollH(container)).toBe("300px");
  });

  it("two grips, one cleanup slot: starting the second must not orphan the first", async () => {
    // 1.54.0 kept ONE `dragOffRef`, so the second start overwrote the first's cleanup closure
    // without calling it - and both grips are reachable in one grid, so this is ordinary use.
    const added = [];
    const removed = [];
    const realAdd = window.addEventListener.bind(window);
    const realRemove = window.removeEventListener.bind(window);
    const aSpy = vi.spyOn(window, "addEventListener").mockImplementation((t, f, o) => {
      if (t.startsWith("pointer")) added.push(t);
      return realAdd(t, f, o);
    });
    const rSpy = vi.spyOn(window, "removeEventListener").mockImplementation((t, f, o) => {
      if (t.startsWith("pointer")) removed.push(t);
      return realRemove(t, f, o);
    });
    const { container, unmount } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize heightResize height={300} />);
    fireEvent.pointerDown(grip(container), { clientY: 400 });
    fireEvent.pointerDown(strips(container)[0], { clientY: 100 });
    expect(added.length, "two live gestures, three listeners each").toBe(6);
    unmount();
    expect(removed.length, "unmount ends BOTH, not just the last one").toBe(6);
    aSpy.mockRestore();
    rSpy.mockRestore();
  });
});

// =================================================================================================
// #563 / #564 — there was no path back to the developer's height, and a stored one applied even
// with the feature off.
// =================================================================================================
describe("Datatable — resetting and gating a dragged height (#563, #564)", () => {
  // applyState runs at mount, and once more if `columns` arrive later (#298's async-catalogue
  // path) - which is the one route by which it can reach a LIVE grid that already has a dragged
  // height. That is where "an explicit null clears" is observable, so that is where it is tested;
  // on a remount the state starts at null anyway and the old code looked identical.
  it("applyState CLEARS on an explicit null, on the async-columns path", async () => {
    const { container, rerender } = render(
      <Datatable columns={[]} rows={ROWS} rowKey={key} heightResize height={420}
        initialState={{ height: null }} />);
    fireEvent.keyDown(grip(container), { key: "PageDown" });
    expect(scrollH(container), "the user has set a height").toBe("500px");
    rerender(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={420}
        initialState={{ height: null }} />);
    expect(scrollH(container),
      "1.54.0 assigned only on a number, so the dragged value stood and gridH could never return to null")
      .toBe("420px");
    await kbIdle();
  });

  // rowHeight takes the same clearing semantics for symmetry, but it has NO reachable runtime
  // path: the row grip needs columns to exist, and once columns exist the late restore has already
  // run, so applyState can never meet a live grid that has a dragged row height. It is pinned here
  // as a semantic (a null does not become a height) rather than claimed as a fix with a route; the
  // reachable reset for a row is the double-click below.
  it("a null rowHeight is not read as a height", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize initialState={{ rowHeight: null }} />);
    expect(rows(container)[0].style.height).toBe("");
  });

  it("a corrupt rowHeight is ignored rather than applied", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize initialState={{ rowHeight: "90px" }} />);
    expect(rows(container)[0].style.height).toBe("");
  });

  it("a corrupt value is still IGNORED rather than read as a reset", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={420}
        initialState={{ height: "600px" }} />);
    expect(scrollH(container), "not applied, and not treated as a clear either").toBe("420px");
  });

  it("double-clicking the height grip resets it, and says so in its label", () => {
    const onHeightResize = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={420}
        initialState={{ height: 600 }} onHeightResize={onHeightResize} />);
    expect(scrollH(container)).toBe("600px");
    expect(grip(container).getAttribute("aria-label")).toContain("double-click to reset");
    fireEvent.doubleClick(grip(container));
    expect(scrollH(container), "back to the developer's height").toBe("420px");
    expect(onHeightResize, "null means 'the prop decides again'").toHaveBeenCalledWith(null);
  });

  it("double-clicking a row grip resets it to the density preset", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize initialState={{ rowHeight: 90 }} />);
    expect(rows(container)[0].style.height).toBe("90px");
    fireEvent.doubleClick(strips(container)[0]);
    expect(rows(container)[0].style.height).toBe("");
  });

  it("onHeightResize reports a dragged number, like onRowResize does", async () => {
    const onHeightResize = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300}
        onHeightResize={onHeightResize} />);
    fireEvent.pointerDown(grip(container), { clientY: 400 });
    fireEvent.pointerMove(window, { clientY: 450 });
    await frame();
    fireEvent.pointerUp(window, { clientY: 450 });
    expect(onHeightResize).toHaveBeenCalledTimes(1);
    expect(onHeightResize).toHaveBeenCalledWith(350);
  });
});

// =================================================================================================
// #565 — both grips preventDefault on pointerdown, which suppresses the default focus, and 1.54.0
// is what gave them a keyboard contract. So the gesture that most obviously means "I am using this"
// left the user standing somewhere else.
// =================================================================================================
describe("Datatable — a drag leaves you ON the grip (#565)", () => {
  it("the height grip takes focus from its own pointerdown", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} />);
    fireEvent.pointerDown(grip(container), { clientY: 400 });
    expect(document.activeElement, "so the arrows a user reaches for next reach the grip").toBe(grip(container));
    fireEvent.pointerUp(window, { clientY: 400 });
  });

  it("so does the row grip", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize />);
    const s = strips(container)[0];
    fireEvent.pointerDown(s, { clientY: 100 });
    expect(document.activeElement).toBe(s);
    fireEvent.pointerUp(window, { clientY: 100 });
  });

  it("and so does the column resizer, which had the same one-liner missing", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} />);
    const r = colRz(container)[0];
    fireEvent.pointerDown(r, { clientX: 100 });
    expect(document.activeElement).toBe(r);
    fireEvent.pointerUp(window, { clientX: 100 });
  });
});

// =================================================================================================
// #567 — fixing the ROW resizer in 1.54.0 left the COLUMN resizer, which had carried
// role="separator" longest, as the least accessible of the three.
// =================================================================================================
describe("Datatable — the column resizer catches up (#567)", () => {
  it("reports a maximum, so assistive tech has a range rather than an open end", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} />);
    const r = colRz(container)[0];
    expect(r.getAttribute("aria-valuemin")).toBe("72");
    expect(r.getAttribute("aria-valuemax"), "absent in 1.53.1 and 1.54.0 alike").toBe("2000");
    expect(Number(r.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
  });

  it("a per-column maxWidth is the reported maximum when it is tighter", () => {
    const { container } = render(
      <Datatable columns={[{ field: "name", maxWidth: 300 }, { field: "state" }]} rows={ROWS} rowKey={key} />);
    expect(colRz(container)[0].getAttribute("aria-valuemax")).toBe("300");
  });

  it("has the coarse step and the bounds keys the two newer grips were given", async () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} />);
    const r = () => colRz(container)[0];
    const now = () => Number(r().getAttribute("aria-valuenow"));
    const start = now();
    fireEvent.keyDown(r(), { key: "ArrowRight" });
    expect(now()).toBe(start + 10);
    fireEvent.keyDown(r(), { key: "PageUp" });
    expect(now(), "a coarse step, which it had none of").toBe(start + 50);
    fireEvent.keyDown(r(), { key: "PageDown" });
    expect(now()).toBe(start + 10);
    fireEvent.keyDown(r(), { key: "Home" });
    expect(now(), "the floor").toBe(72);
    fireEvent.keyDown(r(), { key: "End" });
    expect(now(), "and the maximum it now reports").toBe(2000);
    await kbIdle();
  });

  it("a column keyboard run also writes the store once", async () => {
    const onState = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} onStateChange={onState} />);
    const before = onState.mock.calls.length;
    for (let i = 0; i < 10; i++) fireEvent.keyDown(colRz(container)[0], { key: "ArrowRight" });
    expect(onState.mock.calls.length - before).toBe(0);
    await kbIdle();
    expect(onState.mock.calls.length - before).toBe(1);
  });
});

// =================================================================================================
// #568 — the viewport ceiling is a judgement about layout, and that belongs to the application.
// =================================================================================================
describe("Datatable — heightMax makes the ceiling the host's call (#568)", () => {
  const vpCap = () => Math.max(240, Math.round(window.innerHeight * 0.95));

  it("defaults to the viewport, so nothing changes for anyone who does not pass it", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} />);
    expect(grip(container).getAttribute("aria-valuemax")).toBe(String(vpCap()));
  });

  it("a number sets the ceiling, and the drag honours it", async () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} heightMax={520} />);
    expect(grip(container).getAttribute("aria-valuemax")).toBe("520");
    fireEvent.pointerDown(grip(container), { clientY: 0 });
    fireEvent.pointerMove(window, { clientY: 9999 });
    await frame();
    expect(scrollH(container)).toBe("520px");
    fireEvent.pointerUp(window, { clientY: 9999 });
  });

  it("false drops the viewport ceiling, which is the whole ask", async () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} heightMax={false} />);
    fireEvent.pointerDown(grip(container), { clientY: 0 });
    fireEvent.pointerMove(window, { clientY: 3000 });
    await frame();
    const got = Number(scrollH(container).replace("px", ""));
    // 300 to start + a 3000px drag.
    expect(got, "a long grid in a scrolling page is a legitimate shape").toBe(3300);
    expect(got, "well past the 95%-of-window cap the default would have imposed").toBeGreaterThan(vpCap());
    fireEvent.pointerUp(window, { clientY: 3000 });
  });

  it("...but keeps the floor and an absolute sanity bound", async () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} heightMax={false} />);
    fireEvent.pointerDown(grip(container), { clientY: 500 });
    fireEvent.pointerMove(window, { clientY: -9999 });
    await frame();
    expect(scrollH(container), "a grid dragged to nothing has no grip left to grab").toBe("160px");
    fireEvent.pointerMove(window, { clientY: 999999 });
    await frame();
    expect(scrollH(container), "no legitimate grid is 10000px, and a corrupt value must not win")
      .toBe("10000px");
    fireEvent.pointerUp(window, { clientY: 999999 });
  });

  it("a nonsense heightMax is clamped rather than obeyed", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={key} heightResize height={300} heightMax={10} />);
    expect(grip(container).getAttribute("aria-valuemax"), "never below the floor").toBe("160");
  });
});
