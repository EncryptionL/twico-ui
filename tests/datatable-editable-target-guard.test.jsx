import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #343: onGridKeyDown must not hijack keys (clipboard Ctrl/Cmd+C/X/V, Arrow/Home/End nav) from a focused
// editable target inside a cell — e.g. an <input> in a custom renderCell. Without the guard, typing/copy/
// paste/caret-movement in that input is swallowed by the grid's keydown handler.

const columns = [
  { field: "name", headerName: "Name", editable: true, copyType: "text" },
  // a custom cell that hosts its own focusable <input>
  { field: "note", headerName: "Note", renderCell: (v) => <input className="cell-input" defaultValue={v} readOnly /> },
];
const rows = [
  { id: 1, name: "Ada", note: "n1" },
  { id: 2, name: "Bob", note: "n2" },
];
const cell = (c, r, col) => c.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${col}"]`);
const activeId = (c) => c.querySelector('table[role="grid"]').getAttribute("aria-activedescendant");

describe("Datatable onGridKeyDown editable-target guard (#343)", () => {
  let clip, orig;
  beforeEach(() => {
    orig = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    clip = { text: "", writeText: vi.fn((t) => { clip.text = String(t); return Promise.resolve(); }), readText: vi.fn(() => Promise.resolve(clip.text)) };
    Object.defineProperty(navigator, "clipboard", { value: clip, configurable: true });
  });
  afterEach(() => { if (orig) Object.defineProperty(navigator, "clipboard", orig); else delete navigator.clipboard; });

  it("Ctrl+C from a focused in-cell <input> does NOT trigger the grid clipboard copy", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard />);
    fireEvent.click(cell(container, 0, 0)); // give the grid an active cell
    const input = container.querySelector(".cell-input");
    input.focus();
    fireEvent.keyDown(input, { key: "c", ctrlKey: true });
    expect(clip.writeText).not.toHaveBeenCalled();
  });

  it("control: Ctrl+C from a plain cell DOES copy (guard is scoped to editable targets)", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.keyDown(cell(container, 0, 0), { key: "c", ctrlKey: true });
    expect(clip.writeText).toHaveBeenCalledWith("Ada");
  });

  it("Arrow keys from a focused in-cell <input> do NOT move the grid's active cell", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" />);
    fireEvent.click(cell(container, 0, 0));
    const before = activeId(container);
    const input = container.querySelector(".cell-input");
    input.focus();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowRight" });
    expect(activeId(container)).toBe(before); // unchanged — the grid ignored the keys
  });
});
