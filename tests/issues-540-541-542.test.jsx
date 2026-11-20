import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { Datatable, CardGrid, Card, Text } from "../src/index.ts";

afterEach(cleanup);

const COLS = [{ field: "name", header: "Name" }, { field: "state", header: "State" }];
const ROWS = [
  { id: "a", name: "Alpha", state: "live" },
  { id: "b", name: "Bravo", state: "removed" },
  { id: "c", name: "Charlie", state: "live" },
];
const live = (r) => r.state !== "removed";
const boxes = (c) => [...c.querySelectorAll(".twc-dt__check")];
const rowBoxes = (c) => boxes(c).slice(1); // [0] is the header's select-all

// =================================================================================================
// #540 — isRowSelectable. checkboxSelection was one boolean for the whole grid, so a grid whose rows
// are not uniformly actionable had no way to say so: a tombstone row with its per-row actions
// correctly withheld still got an identical checkbox, and the only place left to notice was each
// batch action, AFTER the click.
// =================================================================================================
describe("Datatable — isRowSelectable (#540)", () => {
  it("renders a disabled checkbox for a row the predicate rejects", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection isRowSelectable={live} />);
    const rb = rowBoxes(container);
    expect(rb).toHaveLength(3);
    expect(rb[0].getAttribute("aria-disabled")).toBeNull();
    expect(rb[1].getAttribute("aria-disabled"), "the tombstone row").toBe("true");
    expect(rb[2].getAttribute("aria-disabled")).toBeNull();
  });

  it("renders the box rather than removing it - an absent one reads as a rendering fault", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection isRowSelectable={live} />);
    expect(rowBoxes(container)).toHaveLength(3);
  });

  it("a click on a rejected row's checkbox selects nothing", () => {
    const onSel = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection
        isRowSelectable={live} onSelectionChange={onSel} />);
    fireEvent.click(rowBoxes(container)[1]);
    expect(onSel).not.toHaveBeenCalled();
    expect(container.textContent).not.toContain("selected");
  });

  it("...and neither does a keyboard Space on it", () => {
    const onSel = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection
        isRowSelectable={live} onSelectionChange={onSel} />);
    fireEvent.keyDown(rowBoxes(container)[1], { key: " " });
    expect(onSel).not.toHaveBeenCalled();
  });

  it("select-all takes only the selectable rows, so the count is already true", () => {
    const onSel = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection
        isRowSelectable={live} onSelectionChange={onSel} />);
    fireEvent.click(boxes(container)[0]);
    expect(onSel).toHaveBeenCalledWith(["a", "c"]);
    expect(container.textContent, "not 3 selected").toContain("2 selected");
  });

  it("select-all reads as fully checked once every SELECTABLE row is ticked", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection isRowSelectable={live} />);
    const head = boxes(container)[0];
    fireEvent.click(head);
    expect(head.getAttribute("aria-checked"), "not 'mixed' - the tombstone is not pending").toBe("true");
  });

  it("the header box is disabled when nothing on the page can be selected", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection isRowSelectable={() => false} />);
    expect(boxes(container)[0].getAttribute("aria-disabled")).toBe("true");
  });

  it("rowSelectionDisabledReason puts the reason on the box as a tooltip", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection isRowSelectable={live}
        rowSelectionDisabledReason={(r) => `${r.name} was removed; nothing left to act on.`} />);
    const rb = rowBoxes(container);
    expect(rb[1].closest(".twc-tooltip-wrap"), "the rejected row's box is wrapped").toBeTruthy();
    expect(rb[0].closest(".twc-tooltip-wrap"), "a selectable row's is not").toBeNull();
  });

  it("the box stays in the tab order, so the reason is keyboard-reachable (#479's contract)", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection isRowSelectable={live}
        rowSelectionDisabledReason={() => "gone"} />);
    expect(rowBoxes(container)[1].getAttribute("tabindex")).toBe("0");
  });

  it("a row that becomes unselectable WHILE ticked drops out of the reported selection", () => {
    // The gesture guards cannot cover this: the row was legitimately selectable when it was ticked,
    // and `rows` came back afterwards saying it is not. A selection the grid itself has decided
    // nothing can be done to must not reach batchActions, selectionSummary or onRowSelectionChange.
    const onRowSel = vi.fn();
    const Harness = ({ withdraw }) => (
      <Datatable columns={COLS} rows={withdraw ? [{ ...ROWS[0], state: "removed" }, ROWS[2]] : [ROWS[0], ROWS[2]]}
        rowKey={(r) => r.id} checkboxSelection isRowSelectable={live} onRowSelectionChange={onRowSel} />);
    const { container, rerender } = render(<Harness withdraw={false} />);
    fireEvent.click(rowBoxes(container)[0]);
    expect(container.textContent).toContain("1 selected");
    onRowSel.mockClear();
    rerender(<Harness withdraw />);
    expect(container.textContent, "the count follows the grid's own verdict").not.toContain("1 selected");
    expect(onRowSel).toHaveBeenLastCalledWith([], []);
  });

  it("without the prop nothing changes - every row is selectable and no box is disabled", () => {
    const onSel = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection onSelectionChange={onSel} />);
    expect(boxes(container).some((b) => b.getAttribute("aria-disabled") === "true")).toBe(false);
    fireEvent.click(boxes(container)[0]);
    expect(onSel).toHaveBeenCalledWith(["a", "b", "c"]);
  });
});

// =================================================================================================
// #541 — a controlled selection. The grid owned it with no way for the host to correct it, so an
// ordinary rows refresh left ticked keys with no row to untick them from.
// =================================================================================================
describe("Datatable — controlled selectedKeys (#541)", () => {
  it("reports the next keys and does not move on its own", () => {
    const onSel = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection
        selectedKeys={[]} onSelectionChange={onSel} />);
    fireEvent.click(rowBoxes(container)[0]);
    expect(onSel).toHaveBeenCalledWith(["a"]);
    expect(container.textContent, "the prop is still []").not.toContain("selected");
  });

  it("follows the prop", () => {
    const { container, rerender } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection selectedKeys={[]} />);
    rerender(<Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection selectedKeys={["a", "b"]} />);
    expect(container.textContent).toContain("2 selected");
    expect(rowBoxes(container)[0].getAttribute("aria-checked")).toBe("true");
  });

  it("lets a host prune a key whose row has gone - the reported defect", () => {
    // 1. tick A, B, C. 2. B is deleted elsewhere. 3. the host re-reads rows AND prunes the key.
    // Before this prop step 3 was impossible: the toolbar kept saying 3 with two rows on screen,
    // and no gesture could remove the third because its checkbox was gone.
    const Harness = ({ keys, rows }) => (
      <Datatable columns={COLS} rows={rows} rowKey={(r) => r.id} checkboxSelection selectedKeys={keys} />);
    const { container, rerender } = render(<Harness keys={["a", "b", "c"]} rows={ROWS} />);
    expect(container.textContent).toContain("3 selected");
    rerender(<Harness keys={["a", "c"]} rows={[ROWS[0], ROWS[2]]} />);
    expect(container.textContent).toContain("2 selected");
  });

  it("a batch action's clearSelection reports through onSelectionChange when controlled", () => {
    const onSel = vi.fn();
    const onClick = vi.fn((keys, rows, clear) => clear());
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection
        selectedKeys={["a"]} onSelectionChange={onSel} batchActions={[{ label: "Delete", onClick }]} />);
    fireEvent.click([...container.querySelectorAll(".twc-dt__batch-btn")].find((b) => b.textContent === "Delete"));
    expect(onClick).toHaveBeenCalled();
    expect(onSel).toHaveBeenLastCalledWith([]);
  });

  it("uncontrolled still owns it - omitting the prop changes nothing", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection />);
    fireEvent.click(rowBoxes(container)[0]);
    expect(container.textContent).toContain("1 selected");
  });

  it("two toggles in ONE batch both land - neither computes from a stale set", () => {
    // The rewrite that made the selection controllable replaced setSelected((s) => ...) with a value
    // computed from `selected`, and controlled mode cannot use a functional updater at all: the
    // previous value is a prop that has not re-rendered yet. Two toggles dispatched inside one
    // act() therefore both read the same set and the second dropped the first - measured in a real
    // browser as the host receiving [2] where it should have had [1, 2]. commitSelection now takes
    // an updater and keeps the last set committed this tick as the base.
    const onSel = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection onSelectionChange={onSel} />);
    const rb = rowBoxes(container);
    act(() => { rb[0].click(); rb[2].click(); });
    expect(onSel).toHaveBeenLastCalledWith(["a", "c"]);
    expect(container.textContent).toContain("2 selected");
  });

  it("...and the same holds while CONTROLLED, where there is no internal state to fall back on", () => {
    const onSel = vi.fn();
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection
        selectedKeys={[]} onSelectionChange={onSel} />);
    const rb = rowBoxes(container);
    act(() => { rb[0].click(); rb[2].click(); });
    expect(onSel).toHaveBeenLastCalledWith(["a", "c"]);
  });

  it("composes with isRowSelectable: a controlled key the predicate rejects is not reported", () => {
    const onRowSel = vi.fn();
    render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection
        selectedKeys={["a", "b"]} isRowSelectable={live} onRowSelectionChange={onRowSel} />);
    expect(onRowSel).toHaveBeenLastCalledWith(["a"], [ROWS[0]]);
  });
});

describe("CardGrid — controlled selectedKeys (#541)", () => {
  const renderCard = (r) => <Card><Text>{r.name}</Text></Card>;
  const checks = (c) => [...c.querySelectorAll('input[type="checkbox"]')];

  it("reports the next keys and does not move on its own", () => {
    const onSel = vi.fn();
    const { container } = render(
      <CardGrid rows={ROWS} rowKey="id" checkboxSelection renderCard={renderCard}
        selectedKeys={[]} onSelectionChange={onSel} />);
    const card = checks(container).find((i) => i.getAttribute("aria-label") !== "Select all on this page");
    fireEvent.click(card);
    expect(onSel).toHaveBeenCalledWith(["a"]);
    expect(container.textContent).not.toContain("selected");
  });

  it("follows the prop", () => {
    const { container, rerender } = render(
      <CardGrid rows={ROWS} rowKey="id" checkboxSelection renderCard={renderCard} selectedKeys={[]} />);
    rerender(<CardGrid rows={ROWS} rowKey="id" checkboxSelection renderCard={renderCard} selectedKeys={["a", "c"]} />);
    expect(container.textContent).toContain("2 selected");
  });

  it("lets a host prune a key whose card has gone - the reported defect", () => {
    const Harness = ({ keys, rows }) => (
      <CardGrid rows={rows} rowKey="id" checkboxSelection renderCard={renderCard} selectedKeys={keys} />);
    const { container, rerender } = render(<Harness keys={["a", "b", "c"]} rows={ROWS} />);
    expect(container.textContent).toContain("3 selected");
    rerender(<Harness keys={["a", "c"]} rows={[ROWS[0], ROWS[2]]} />);
    expect(container.textContent).toContain("2 selected");
  });

  it("hands a batch action the pruned selection, not the stale one", () => {
    const onClick = vi.fn();
    const { container } = render(
      <CardGrid rows={[ROWS[0], ROWS[2]]} rowKey="id" checkboxSelection renderCard={renderCard}
        retainSelectedRows selectedKeys={["a", "c"]}
        batchActions={[{ label: "Download", onClick }]} />);
    fireEvent.click([...container.querySelectorAll("button")].find((b) => b.textContent === "Download"));
    expect(onClick).toHaveBeenCalled();
    expect(onClick.mock.calls[0][0]).toEqual(["a", "c"]);
    expect(onClick.mock.calls[0][1].map((r) => r.name)).toEqual(["Alpha", "Charlie"]);
  });

  it("refreshes a RETAINED row object when its key reappears on a page", () => {
    // Retention wrote the row at toggle time and never refreshed it, so after the host re-read rows
    // a still-selected key resolved to the object it had BEFORE - a stale object the host could not
    // tell from a live one.
    //
    // The row has to be OFF-PAGE when the batch action reads it, or selectedRows resolves it from
    // the current page and the retained copy is never consulted - which is how the first version of
    // this test passed with the refresh disabled. So: select on page 1, let the host re-read rows,
    // then page away.
    const onClick = vi.fn();
    const named = (n) => [{ id: "a", name: n, state: "live" }, ROWS[2]];
    const Harness = ({ rows, page }) => (
      <CardGrid rows={rows} rowKey="id" pageSize={1} page={page} checkboxSelection renderCard={renderCard}
        retainSelectedRows batchActions={[{ label: "Go", onClick }]} />);
    const { container, rerender } = render(<Harness rows={named("Alpha")} page={0} />);
    const card = checks(container).find((i) => i.getAttribute("aria-label") !== "Select all on this page");
    fireEvent.click(card);                          // retains { id: a, name: "Alpha" }
    rerender(<Harness rows={named("Alpha RENAMED")} page={0} />);  // the host re-reads rows
    rerender(<Harness rows={named("Alpha RENAMED")} page={1} />);  // ...and the user pages away
    expect(container.textContent, "still selected, now off-page").toContain("1 selected");
    fireEvent.click([...container.querySelectorAll("button")].find((b) => b.textContent === "Go"));
    expect(onClick.mock.calls[0][1].map((r) => r.name)).toEqual(["Alpha RENAMED"]);
  });

  it("...and without the refresh it would hand back the pre-update object", () => {
    // The same shape with the host NOT re-reading rows: the retained copy is the only source, which
    // is the contract retainSelectedRows documents. Here to pin that the test above is measuring the
    // refresh and not merely the retention.
    const onClick = vi.fn();
    const Harness = ({ page }) => (
      <CardGrid rows={[ROWS[0], ROWS[2]]} rowKey="id" pageSize={1} page={page} checkboxSelection
        renderCard={renderCard} retainSelectedRows batchActions={[{ label: "Go", onClick }]} />);
    const { container, rerender } = render(<Harness page={0} />);
    fireEvent.click(checks(container).find((i) => i.getAttribute("aria-label") !== "Select all on this page"));
    rerender(<Harness page={1} />);
    fireEvent.click([...container.querySelectorAll("button")].find((b) => b.textContent === "Go"));
    expect(onClick.mock.calls[0][1].map((r) => r.name)).toEqual(["Alpha"]);
  });

  // NOTE: the other half of that effect - releasing a retained row whose key a CONTROLLED host has
  // dropped - is memory hygiene rather than behaviour (selectedRows is keyed off selKeys, so a
  // dropped key is already absent from it). There is no observable assertion for it without
  // exposing the map, and inventing one would be a test of the implementation.

  it("uncontrolled still owns it", () => {
    const { container } = render(
      <CardGrid rows={ROWS} rowKey="id" checkboxSelection renderCard={renderCard} />);
    const card = checks(container).find((i) => i.getAttribute("aria-label") !== "Select all on this page");
    fireEvent.click(card);
    expect(container.textContent).toContain("1 selected");
  });

  it("two toggles in ONE batch both land", () => {
    const onSel = vi.fn();
    const { container } = render(
      <CardGrid rows={ROWS} rowKey="id" checkboxSelection renderCard={renderCard}
        selectedKeys={[]} onSelectionChange={onSel} />);
    const cards = checks(container).filter((i) => i.getAttribute("aria-label") !== "Select all on this page");
    act(() => { cards[0].click(); cards[2].click(); });
    expect(onSel).toHaveBeenLastCalledWith(["a", "c"]);
  });
});

// =================================================================================================
// #542 — a drag-resized row height was the one user resize that did not survive a reload.
// =================================================================================================
describe("Datatable — row height in DatatableState (#542)", () => {
  it("rowResize renders the grip, and says which rows it moves", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection rowResize />);
    const grips = [...container.querySelectorAll(".twc-dt__row-resizer")];
    expect(grips.length).toBeGreaterThan(0);
    expect(grips[0].getAttribute("title")).toBe("Drag to resize every row");
  });

  it('rowResize="row" keeps the per-row gesture, and says so', () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection rowResize="row" />);
    expect(container.querySelector(".twc-dt__row-resizer").getAttribute("title")).toBe("Drag to resize this row");
  });

  it("rowResize={false} draws no grip", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} checkboxSelection />);
    expect(container.querySelector(".twc-dt__row-resizer")).toBeNull();
  });

  it("initialState.rowHeight applies to EVERY row - the shared height restores", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} rowResize initialState={{ rowHeight: 80 }} />);
    const rows = [...container.querySelectorAll(".twc-dt__row")];
    expect(rows.length).toBeGreaterThan(0);
    for (const tr of rows) expect(tr.style.height).toBe("80px");
  });

  it("...and comes back out through onStateChange, like every other user resize", () => {
    const onState = vi.fn();
    render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} rowResize
        initialState={{ rowHeight: 72 }} onStateChange={onState} />);
    const last = onState.mock.calls.at(-1)[0];
    expect(last.rowHeight).toBe(72);
    expect(last.columnWidths, "beside the resize that always did round-trip").toBeDefined();
  });

  it("clamps a restored height, so a corrupt snapshot cannot make one row taller than the grid", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} rowResize initialState={{ rowHeight: 999999 }} />);
    expect(container.querySelector(".twc-dt__row").style.height).toBe("2000px");
  });

  it("ignores a non-numeric height rather than applying it", () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} rowResize initialState={{ rowHeight: "80px" }} />);
    expect(container.querySelector(".twc-dt__row").style.height).toBe("");
  });

  it('rowResize="row" restores a per-row map, applied only to the named row', () => {
    const { container } = render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} rowResize="row" persistRowHeights
        initialState={{ rowHeights: { b: 90 } }} />);
    const rows = [...container.querySelectorAll(".twc-dt__row")];
    expect(rows[0].style.height).toBe("");
    expect(rows[1].style.height).toBe("90px");
  });

  it("does not emit the per-row map without persistRowHeights - it is unbounded", () => {
    const onState = vi.fn();
    render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} rowResize="row"
        initialState={{ rowHeights: { b: 90 } }} onStateChange={onState} />);
    expect(onState.mock.calls.at(-1)[0].rowHeights).toBeUndefined();
  });

  it("emits it when the host says its storage can take it", () => {
    const onState = vi.fn();
    render(
      <Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} rowResize="row" persistRowHeights
        initialState={{ rowHeights: { b: 90 } }} onStateChange={onState} />);
    expect(onState.mock.calls.at(-1)[0].rowHeights).toEqual({ b: 90 });
  });

  it("omits rowHeight entirely until the user has set one", () => {
    const onState = vi.fn();
    render(<Datatable columns={COLS} rows={ROWS} rowKey={(r) => r.id} rowResize onStateChange={onState} />);
    expect(onState.mock.calls.at(-1)[0].rowHeight).toBeUndefined();
  });
});
