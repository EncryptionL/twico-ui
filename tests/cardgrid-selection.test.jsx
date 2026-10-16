import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CardGrid } from "../components/data-display/CardGrid.jsx";

// #478 — CardGrid had every other Datatable affordance in server mode (rows, rowCount,
// onServerChange, filters, quickFilter, sort, paging) but no selection, so "pick several of these and
// do one thing to them" had to be hand-rolled: a Checkbox overlay per card, a Map<id,row> to survive
// paging, page-scoped select-all arithmetic, a selection toolbar, and a selected affordance on the
// card. Same vocabulary as Datatable, not a new one.

const mk = (n) => Array.from({ length: n }, (_, i) => ({ id: `r${i}`, name: `Row ${i}`, size: i + 1 }));
const card = (r) => <span>{r.name}</span>;

afterEach(cleanup);

const picks = (c) => [...c.querySelectorAll('[aria-label="Select item"]')];
const items = (c) => [...c.querySelectorAll(".twc-cardgrid__item")];
const batchBtn = (label) =>
  [...document.querySelectorAll(".twc-cardgrid__batch-btn")].find((b) => b.textContent.includes(label));
const count = (c) => c.querySelector(".twc-cardgrid__batch-count")?.textContent;

describe("CardGrid selection (#478)", () => {
  it("renders no selection affordance at all unless checkboxSelection is set", () => {
    const { container } = render(<CardGrid rows={mk(4)} renderCard={card} />);
    expect(picks(container)).toHaveLength(0);
    expect(container.querySelector(".twc-cardgrid__batch")).toBe(null);
    expect(container.querySelector(".twc-cardgrid__selall")).toBe(null);
  });

  it("selects a card and marks it with a ring rather than a tint", () => {
    const { container } = render(<CardGrid rows={mk(4)} renderCard={card} checkboxSelection />);
    fireEvent.click(picks(container)[1]);
    expect(items(container)[1].getAttribute("data-selected")).toBe("true");
    expect(items(container)[0].hasAttribute("data-selected")).toBe(false);
    // A card is usually a full-bleed thumbnail, so the state must not be a background tint. Asserted
    // against the source rather than a rendered <style>, because React 19 hoists the scoped sheet out
    // of the component's subtree.
    const src = readFileSync(resolve(process.cwd(), "components/data-display/CardGrid.jsx"), "utf8");
    const rule = src.slice(src.indexOf('.twc-cardgrid__item[data-selected="true"]'));
    const body = rule.slice(rule.indexOf("{") + 1, rule.indexOf("}"));
    expect(body).toMatch(/box-shadow/);
    expect(body, "a tint would be invisible behind a thumbnail").not.toMatch(/background/);
  });

  it("reports the selection as (keys, rows), like Datatable", () => {
    const onRowSelectionChange = vi.fn();
    const { container } = render(
      <CardGrid rows={mk(4)} renderCard={card} checkboxSelection onRowSelectionChange={onRowSelectionChange} />
    );
    fireEvent.click(picks(container)[0]);
    fireEvent.click(picks(container)[2]);
    const [keys, rows] = onRowSelectionChange.mock.calls.at(-1);
    expect(keys).toEqual(["r0", "r2"]);
    expect(rows.map((r) => r.name)).toEqual(["Row 0", "Row 2"]);
  });

  it("toggles off, and clears from the toolbar", () => {
    const { container } = render(<CardGrid rows={mk(4)} renderCard={card} checkboxSelection />);
    fireEvent.click(picks(container)[0]);
    fireEvent.click(picks(container)[1]);
    expect(count(container)).toBe("2 selected");
    fireEvent.click(picks(container)[0]);
    expect(count(container)).toBe("1 selected");
    fireEvent.click(container.querySelector('[aria-label="Clear selection"]'));
    expect(container.querySelector(".twc-cardgrid__batch")).toBe(null);
  });

  it("select-all is page-scoped and goes indeterminate part-way", () => {
    // It must never silently select rows the user cannot see — and in serverMode it could not anyway.
    const { container } = render(<CardGrid rows={mk(20)} renderCard={card} checkboxSelection pageSize={4} />);
    const all = () => container.querySelector('[aria-label="Select all on this page"]');
    fireEvent.click(picks(container)[0]);
    expect(all().indeterminate).toBe(true);
    fireEvent.click(all());
    expect(count(container)).toBe("4 selected");   // this page only, not all 20
    expect(all().indeterminate).toBe(false);
    expect(all().checked).toBe(true);
  });

  it("keeps the selection across a page change", () => {
    const { container } = render(<CardGrid rows={mk(20)} renderCard={card} checkboxSelection pageSize={4} />);
    fireEvent.click(picks(container)[0]);
    fireEvent.click(container.querySelectorAll(".twc-pagination button")[2]); // page 2
    expect(count(container), "the selection is keyed, so paging must not drop it").toBe("1 selected");
  });
});

describe("CardGrid batch actions (#478)", () => {
  const setup = (action, props) => {
    const r = render(
      <CardGrid rows={mk(6)} renderCard={card} checkboxSelection batchActions={[action]} {...props} />
    );
    return r;
  };

  it("shows actions only once something is selected, and hands over (keys, rows, clear, ctx)", () => {
    const onClick = vi.fn();
    const { container } = setup({ label: "Download as ZIP", onClick });
    expect(batchBtn("Download as ZIP")).toBeUndefined();
    fireEvent.click(picks(container)[0]);
    fireEvent.click(picks(container)[1]);
    fireEvent.click(batchBtn("Download as ZIP"));
    expect(onClick).toHaveBeenCalledTimes(1);
    const [keys, rows, clear, ctx] = onClick.mock.calls[0];
    expect(keys).toEqual(["r0", "r1"]);
    expect(rows.map((r) => r.name)).toEqual(["Row 0", "Row 1"]);
    expect(typeof clear).toBe("function");
    expect(ctx.anchorEl.tagName).toBe("BUTTON");
  });

  it("honours disabled/hidden/disabledReason as predicates over the selection", () => {
    const { container } = setup({
      label: "Download as ZIP",
      disabled: (k, rows) => rows.reduce((t, r) => t + r.size, 0) > 4,
      disabledReason: (k, rows) => `That selection is ${rows.reduce((t, r) => t + r.size, 0)} GB; the limit is 4 GB`,
    });
    fireEvent.click(picks(container)[0]); // size 1
    expect(batchBtn("Download as ZIP").hasAttribute("aria-disabled")).toBe(false);
    fireEvent.click(picks(container)[4]); // +5 = 6 GB, over
    const btn = batchBtn("Download as ZIP");
    expect(btn.getAttribute("aria-disabled")).toBe("true");
    expect(btn.disabled, "aria-disabled keeps the reason keyboard-reachable").toBe(false);
    fireEvent.mouseEnter(btn.closest(".twc-tooltip-wrap"));
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain("6 GB");
  });

  it("clearSelection from an action empties the toolbar", () => {
    const { container } = setup({ label: "Archive", onClick: (k, r, clear) => clear() });
    fireEvent.click(picks(container)[0]);
    fireEvent.click(batchBtn("Archive"));
    expect(container.querySelector(".twc-cardgrid__batch")).toBe(null);
  });
});

describe("CardGrid selection escape hatches (#478)", () => {
  it("selectionPlacement positions the overlay, and 'none' suppresses it", () => {
    const { container, rerender } = render(
      <CardGrid rows={mk(2)} renderCard={card} checkboxSelection selectionPlacement="bottom-end" />
    );
    expect(items(container)[0].getAttribute("data-place")).toBe("bottom-end");
    expect(picks(container)).toHaveLength(2);
    rerender(<CardGrid rows={mk(2)} renderCard={card} checkboxSelection selectionPlacement="none" />);
    expect(picks(container), "none means the consumer renders it themselves").toHaveLength(0);
  });

  it("hands renderCard a third argument so the control can live inside the card", () => {
    const seen = [];
    const { container } = render(
      <CardGrid rows={mk(2)} renderCard={(r, i, sel) => { seen.push(sel); return (
        <button type="button" data-testid={`own-${i}`} onClick={sel.toggle}>
          {sel.selected ? "picked" : "pick"}
        </button>
      ); }} checkboxSelection selectionPlacement="none" />
    );
    expect(seen[0]).toMatchObject({ selected: false });
    fireEvent.click(container.querySelector('[data-testid="own-0"]'));
    expect(container.querySelector('[data-testid="own-0"]').textContent).toBe("picked");
    expect(items(container)[0].getAttribute("data-selected")).toBe("true");
  });

  it("leaves the third argument undefined when selection is off, so existing renderCards are unaffected", () => {
    const seen = [];
    render(<CardGrid rows={mk(2)} renderCard={(r, i, sel) => { seen.push(sel); return card(r); }} />);
    expect(seen).toEqual([undefined, undefined]);
  });

  it("labels each checkbox from selectionLabel when given", () => {
    const { container } = render(
      <CardGrid rows={mk(2)} renderCard={card} checkboxSelection selectionLabel={(r) => `Select ${r.name}`} />
    );
    expect(container.querySelector('[aria-label="Select Row 1"]')).not.toBe(null);
  });
});

describe("CardGrid cross-page row retention (#478)", () => {
  it("resolves only on-page rows by default — keys stay authoritative", () => {
    const onRowSelectionChange = vi.fn();
    const { container } = render(
      <CardGrid rows={mk(8)} renderCard={card} checkboxSelection pageSize={4}
        onRowSelectionChange={onRowSelectionChange} />
    );
    fireEvent.click(picks(container)[0]);                                      // r0, page 1
    fireEvent.click(container.querySelectorAll(".twc-pagination button")[2]);  // page 2
    fireEvent.click(picks(container)[0]);                                      // r4, page 2
    const [keys, rows] = onRowSelectionChange.mock.calls.at(-1);
    expect(keys, "both keys survive").toEqual(["r0", "r4"]);
    expect(rows.map((r) => r.name), "but only the on-page row object resolves").toEqual(["Row 4"]);
  });

  it("retainSelectedRows carries the off-page row objects too", () => {
    const onRowSelectionChange = vi.fn();
    const { container } = render(
      <CardGrid rows={mk(8)} renderCard={card} checkboxSelection pageSize={4} retainSelectedRows
        onRowSelectionChange={onRowSelectionChange} />
    );
    fireEvent.click(picks(container)[0]);
    fireEvent.click(container.querySelectorAll(".twc-pagination button")[2]);
    fireEvent.click(picks(container)[0]);
    const [keys, rows] = onRowSelectionChange.mock.calls.at(-1);
    expect(keys).toEqual(["r0", "r4"]);
    expect(rows.map((r) => r.name), "this is the Map<id,row> consumers were hand-rolling").toEqual(["Row 0", "Row 4"]);
  });

  it("is bounded: past the cap it stops retaining rather than growing", () => {
    // Read through a batch action rather than onRowSelectionChange: that callback is guarded on the
    // KEY signature (the Datatable #322 pattern), so paging alone correctly does not re-fire it, and
    // its last call would still carry the page-1 resolution.
    const onClick = vi.fn();
    const { container } = render(
      <CardGrid rows={mk(8)} renderCard={card} checkboxSelection pageSize={4} retainSelectedRows={1}
        batchActions={[{ label: "Archive", onClick }]} />
    );
    fireEvent.click(picks(container)[0]);  // r0 — retained (cap 1)
    fireEvent.click(picks(container)[1]);  // r1 — over the cap, not retained
    fireEvent.click(container.querySelectorAll(".twc-pagination button")[2]); // page 2
    fireEvent.click(batchBtn("Archive"));
    const [keys, rows] = onClick.mock.calls[0];
    expect(keys, "keys are always complete").toEqual(["r0", "r1"]);
    expect(rows.map((r) => r.name), "only the retained one resolves off-page").toEqual(["Row 0"]);
  });
});
