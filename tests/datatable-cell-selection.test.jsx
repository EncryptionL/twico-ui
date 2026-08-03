import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #317 (rectangular cell range selection + ARIA) and #318 (keyboard clipboard with format-restricted paste).
const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");
const columns = [
  { field: "name", headerName: "Name", editable: true, copyType: "text" },
  { field: "qty", headerName: "Qty", type: "number", editable: true },
  { field: "code", headerName: "Code", editable: true, copyType: "code" },
];
const rows = [
  { id: 1, name: "Ada", qty: 1, code: "A1" },
  { id: 2, name: "Bob", qty: 2, code: "B2" },
  { id: 3, name: "Cy", qty: 3, code: "C3" },
];
const cell = (c, r, col) => c.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${col}"]`);
const grid = (c) => c.querySelector('table[role="grid"]');
const selectedCount = (c) => c.querySelectorAll('.twc-dt__td[data-cell-selected="true"]').length;

describe("Datatable cell range selection (#317)", () => {
  it("marks the active cell aria-selected and sets grid aria-multiselectable + aria-activedescendant", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" />);
    fireEvent.click(cell(container, 0, 0));
    expect(cell(container, 0, 0).getAttribute("aria-selected")).toBe("true");
    expect(grid(container).getAttribute("aria-multiselectable")).toBe("true");
    const adId = grid(container).getAttribute("aria-activedescendant");
    expect(adId).toBeTruthy();
    expect(cell(container, 0, 0).id).toBe(adId); // activedescendant points at the active cell
  });

  it("Shift+Click extends a rectangle; onCellSelectionChange reports every cell (row-major)", () => {
    const onCellSelectionChange = vi.fn();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" onCellSelectionChange={onCellSelectionChange} />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.click(cell(container, 1, 1), { shiftKey: true });
    expect(selectedCount(container)).toBe(4); // rows 0-1 × cols 0-1
    const last = onCellSelectionChange.mock.calls.at(-1)[0];
    expect(last.length).toBe(4);
    expect(last.map((x) => x.field).sort()).toEqual(["name", "name", "qty", "qty"]);
  });

  it("Shift+Arrow extends from the anchor; a plain Arrow collapses to a single-cell selection", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.keyDown(cell(container, 0, 0), { key: "ArrowDown", shiftKey: true });
    expect(selectedCount(container)).toBe(2); // (0,0) + (1,0)
    fireEvent.keyDown(cell(container, 1, 0), { key: "ArrowRight" });
    expect(selectedCount(container)).toBe(1); // plain move → new single-cell anchor
  });
});

describe("Datatable clipboard (#318)", () => {
  let clip, orig;
  beforeEach(() => {
    orig = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    clip = { text: "", writeText: vi.fn((t) => { clip.text = String(t); return Promise.resolve(); }), readText: vi.fn(() => Promise.resolve(clip.text)) };
    Object.defineProperty(navigator, "clipboard", { value: clip, configurable: true });
  });
  afterEach(() => { if (orig) Object.defineProperty(navigator, "clipboard", orig); else delete navigator.clipboard; });

  it("source-guard: default copyType is a number-vs-text bucket; paste batches into one write path", () => {
    const src = readFileSync(DT_SRC, "utf8");
    expect(src).toMatch(/copyTypeOf = \(col\) =>.*number.*text/);
    expect(src).toContain("const writeCellPatches = (patchByKey)"); // single onRowsChange, not per-cell commitEdit
  });

  it("Ctrl+C copies the active cell", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.keyDown(cell(container, 0, 0), { key: "c", ctrlKey: true });
    expect(clip.writeText).toHaveBeenCalledWith("Ada");
  });

  it("Ctrl+C copies a range as TSV (tabs between cols, newlines between rows)", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.click(cell(container, 1, 1), { shiftKey: true });
    fireEvent.keyDown(cell(container, 1, 1), { key: "c", ctrlKey: true });
    expect(clip.writeText).toHaveBeenCalledWith("Ada\t1\nBob\t2");
  });

  it("Ctrl+V pastes onto the target and commits via a single batched onRowsChange", async () => {
    const onRowsChange = vi.fn();
    clip.text = "Zed\t9";
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard onRowsChange={onRowsChange} />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.keyDown(cell(container, 0, 0), { key: "v", ctrlKey: true });
    await waitFor(() => expect(onRowsChange).toHaveBeenCalledTimes(1));
    expect(onRowsChange.mock.calls[0][0][0]).toMatchObject({ id: 1, name: "Zed", qty: 9 });
  });

  it("format-restricted paste skips an incompatible column (copyType mismatch → no write)", async () => {
    const onRowsChange = vi.fn();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard onRowsChange={onRowsChange} />);
    fireEvent.click(cell(container, 0, 2)); // copy the Code cell (copyType "code")
    fireEvent.keyDown(cell(container, 0, 2), { key: "c", ctrlKey: true });
    fireEvent.click(cell(container, 1, 0)); // paste into the Name cell (copyType "text") — mismatch
    fireEvent.keyDown(cell(container, 1, 0), { key: "v", ctrlKey: true });
    await new Promise((r) => setTimeout(r, 0));
    expect(onRowsChange).not.toHaveBeenCalled();
  });

  it("coerces a pasted value for a number column (non-numeric → null)", async () => {
    const onRowsChange = vi.fn();
    clip.text = "notanumber";
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard onRowsChange={onRowsChange} />);
    fireEvent.click(cell(container, 0, 1)); // Qty (number)
    fireEvent.keyDown(cell(container, 0, 1), { key: "v", ctrlKey: true });
    await waitFor(() => expect(onRowsChange).toHaveBeenCalled());
    expect(onRowsChange.mock.calls[0][0][0].qty).toBeNull();
  });
});
