import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Datatable } from "../components/data-display/Datatable.jsx";
import { CardGrid } from "../components/data-display/CardGrid.jsx";

// #492 — the selection toolbar counted items but had no slot for the number that actually decides.
// A batch capped by total SIZE refuses on gigabytes, not on items, so "12 selected" is not the number
// the user needs. The workaround was to lift the total into the MAIN toolbar behind a
// `selected.length > 0` guard — a different row from the count it qualifies, and it forced the host to
// mirror a selection the component already tracks.

const rows = [
  { id: "a", name: "Alpha", bytes: 1200 },
  { id: "b", name: "Beta", bytes: 800 },
  { id: "c", name: "Gamma", bytes: 300 },
];
const columns = [{ field: "name", label: "Name" }, { field: "bytes", label: "Bytes" }];
const rowKey = (r) => r.id;

afterEach(cleanup);

/** Tick the Nth selection checkbox in a Datatable (it is a span[role=checkbox], not an input). */
const selectDtRow = (container, n) => {
  const boxes = [...container.querySelectorAll("tbody .twc-dt__check")];
  fireEvent.click(boxes[n]);
};

describe("Datatable selectionSummary (#492)", () => {
  it("renders nothing extra when the prop is absent", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey} checkboxSelection
        batchActions={[{ label: "Zip", onClick: () => {} }]} />
    );
    selectDtRow(container, 0);
    expect(container.querySelector(".twc-dt__batch-count").textContent).toContain("selected");
    expect(container.querySelector(".twc-dt__batch-summary")).toBe(null);
  });

  it("renders a plain node beside the count", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey} checkboxSelection
        batchActions={[{ label: "Zip", onClick: () => {} }]}
        selectionSummary={<span data-testid="s">static</span>} />
    );
    selectDtRow(container, 0);
    expect(container.querySelector(".twc-dt__batch-summary").textContent).toBe("static");
  });

  it("calls the function form with the same (keys, rows) the batch actions get", () => {
    const seen = [];
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey} checkboxSelection
        batchActions={[{ label: "Zip", onClick: () => {} }]}
        selectionSummary={(keys, sel) => { seen.push([keys, sel]); return `${sel.reduce((n, r) => n + r.bytes, 0)} B`; }} />
    );
    selectDtRow(container, 0);
    selectDtRow(container, 2);
    expect(container.querySelector(".twc-dt__batch-summary").textContent).toBe("1500 B");
    const [keys, sel] = seen[seen.length - 1];
    expect([...keys].sort()).toEqual(["a", "c"]);
    expect(sel.map((r) => r.id).sort()).toEqual(["a", "c"]);
  });

  it("updates as the selection changes, and disappears with it", () => {
    // The running total is the whole point: it has to track the selection, not snapshot it.
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey} checkboxSelection
        batchActions={[{ label: "Zip", onClick: () => {} }]}
        selectionSummary={(_k, sel) => `${sel.reduce((n, r) => n + r.bytes, 0)} B`} />
    );
    selectDtRow(container, 0);
    expect(container.querySelector(".twc-dt__batch-summary").textContent).toBe("1200 B");
    selectDtRow(container, 1);
    expect(container.querySelector(".twc-dt__batch-summary").textContent).toBe("2000 B");
    selectDtRow(container, 1);
    expect(container.querySelector(".twc-dt__batch-summary").textContent).toBe("1200 B");
    selectDtRow(container, 0);
    // no selection -> the whole batch toolbar goes, summary included
    expect(container.querySelector(".twc-dt__batch-summary")).toBe(null);
  });

  it("sits between the count and the actions, not after them", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey} checkboxSelection
        batchActions={[{ label: "Zip", onClick: () => {} }]}
        selectionSummary="2.4 GB" />
    );
    selectDtRow(container, 0);
    const bar = container.querySelector(".twc-dt__batch");
    const order = [...bar.querySelectorAll(".twc-dt__batch-count, .twc-dt__batch-summary, .twc-dt__batch-actions")]
      .map((el) => el.className);
    expect(order).toEqual(["twc-dt__batch-count", "twc-dt__batch-summary", "twc-dt__batch-actions"]);
  });
});

describe("CardGrid selectionSummary (#492)", () => {
  const cgRows = rows;
  const renderCard = (r) => <div>{r.name}</div>;

  it("renders the function form beside the count", () => {
    const { container } = render(
      <CardGrid rows={cgRows} rowKey="id" renderCard={renderCard} checkboxSelection
        batchActions={[{ label: "Zip", onClick: () => {} }]}
        selectionSummary={(_k, sel) => `${sel.length} files`} />
    );
    const boxes = [...container.querySelectorAll('.twc-cardgrid__item input[type="checkbox"], .twc-cardgrid__item [role="checkbox"]')];
    fireEvent.click(boxes[0]);
    expect(container.querySelector(".twc-cardgrid__batch-summary").textContent).toBe("1 files");
  });

  it("is absent when the prop is not given", () => {
    const { container } = render(
      <CardGrid rows={cgRows} rowKey="id" renderCard={renderCard} checkboxSelection
        batchActions={[{ label: "Zip", onClick: () => {} }]} />
    );
    const boxes = [...container.querySelectorAll('.twc-cardgrid__item input[type="checkbox"], .twc-cardgrid__item [role="checkbox"]')];
    fireEvent.click(boxes[0]);
    expect(container.querySelector(".twc-cardgrid__batch-count")).not.toBe(null);
    expect(container.querySelector(".twc-cardgrid__batch-summary")).toBe(null);
  });
});

describe("toolbar actions sit after the built-ins and before the search", () => {
  // Requested placement: the host's slot reads as an extension of the built-in cluster rather than
  // displacing it, and the search box keeps the right-hand edge. Asserted on DOM order, since the
  // search is pushed right by `margin-inline-start: auto` and would otherwise hide a swap.
  it("renders Columns/Filters, then toolbarActions, then the search", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey} searchable
        toolbarActions={<button type="button" data-testid="host">Add row</button>} />
    );
    const bar = container.querySelector(".twc-dt__toolbar");
    const marks = [...bar.querySelectorAll('[data-tbtn], .twc-dt__toolbar-actions, .twc-dt__search')]
      .map((el) => el.dataset.tbtn || el.className.split(" ")[0]);
    const iActions = marks.indexOf("twc-dt__toolbar-actions");
    const iSearch = marks.indexOf("twc-dt__search");
    expect(iActions, "the host slot should render").toBeGreaterThan(-1);
    expect(iSearch, "the search should render").toBeGreaterThan(-1);
    expect(iActions, "host actions come after at least one built-in button").toBeGreaterThan(0);
    expect(iSearch, "the search stays last").toBeGreaterThan(iActions);
    // and every built-in button precedes the host slot
    const builtinsAfter = marks.slice(iActions).filter((m) => m && m !== "twc-dt__toolbar-actions" && m !== "twc-dt__search");
    expect(builtinsAfter, "no built-in toolbar button may follow the host slot").toEqual([]);
  });

  it("the search keeps its right-hand position by CSS, not by DOM order", () => {
    // If this stops being true, moving the slot before the search would no longer be safe.
    const src = readFileSync(resolve(process.cwd(), "components/data-display/Datatable.jsx"), "utf8");
    const i = src.indexOf(".twc-dt__search {");
    expect(src.slice(i, src.indexOf("}", i))).toContain("margin-inline-start: auto");
  });
});
