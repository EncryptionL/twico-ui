import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #380: paste must work outside a secure context, where navigator.clipboard (and readText) is undefined. The
// Ctrl/Cmd+V keydown must NOT preventDefault there — so the browser's native paste fires — and a `paste`
// listener reads e.clipboardData (which is NOT [SecureContext]) through the same TSV/matrix path as readText.

const columns = [
  { field: "name", headerName: "Name", editable: true, copyType: "text" },
  { field: "qty", headerName: "Qty", type: "number", editable: true },
];
const rows = [{ id: 1, name: "Ada", qty: 1 }, { id: 2, name: "Bob", qty: 2 }];
const cell = (c, r, col) => c.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${col}"]`);
const clipData = (tsv) => ({ clipboardData: { getData: (t) => (t === "text/plain" ? tsv : "") } });

describe("Datatable paste in an insecure context (#380)", () => {
  let orig;
  beforeEach(() => { orig = Object.getOwnPropertyDescriptor(navigator, "clipboard"); });
  afterEach(() => {
    if (orig) Object.defineProperty(navigator, "clipboard", orig);
    else { try { delete navigator.clipboard; } catch { /* ignore */ } }
  });
  const setInsecure = () => Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  const setSecure = () => Object.defineProperty(navigator, "clipboard", {
    value: { readText: () => Promise.resolve("x"), writeText: () => Promise.resolve() }, configurable: true,
  });

  it("Ctrl+V does NOT preventDefault when readText is unavailable (lets the native paste fire)", () => {
    setInsecure();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard />);
    fireEvent.click(cell(container, 0, 0));
    const notPrevented = fireEvent.keyDown(cell(container, 0, 0), { key: "v", ctrlKey: true, cancelable: true });
    expect(notPrevented).toBe(true); // default NOT prevented → the browser proceeds to fire `paste`
  });

  it("Ctrl+V DOES preventDefault in a secure context (async readText path owns it — no double paste)", () => {
    setSecure();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard />);
    fireEvent.click(cell(container, 0, 0));
    const notPrevented = fireEvent.keyDown(cell(container, 0, 0), { key: "v", ctrlKey: true, cancelable: true });
    expect(notPrevented).toBe(false); // default prevented → native paste suppressed
  });

  it("a native paste event applies via clipboardData when readText is unavailable", async () => {
    setInsecure();
    const onRowsChange = vi.fn();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard onRowsChange={onRowsChange} />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.paste(cell(container, 0, 0), clipData("Zed\t9"));
    await waitFor(() => expect(onRowsChange).toHaveBeenCalledTimes(1));
    expect(onRowsChange.mock.calls[0][0][0]).toMatchObject({ id: 1, name: "Zed", qty: 9 });
  });

  it("ignores a native paste in a secure context (the readText path owns it — no double-apply)", () => {
    setSecure();
    const onRowsChange = vi.fn();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard onRowsChange={onRowsChange} />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.paste(cell(container, 0, 0), clipData("Zed\t9"));
    expect(onRowsChange).not.toHaveBeenCalled(); // onGridPaste returns early when readText exists
  });

  it("does nothing on a native paste when there is no cell selection", () => {
    setInsecure();
    const onRowsChange = vi.fn();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard onRowsChange={onRowsChange} />);
    fireEvent.paste(container.querySelector('table[role="grid"]'), clipData("Zed\t9")); // no cell clicked → no cellRect
    expect(onRowsChange).not.toHaveBeenCalled();
  });

  it("does NOT hijack a paste into a focused cell editor (lands natively in the input)", () => {
    setInsecure();
    const onRowsChange = vi.fn();
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="cell" enableClipboard editMode onRowsChange={onRowsChange} />);
    fireEvent.click(cell(container, 0, 0));
    fireEvent.doubleClick(cell(container, 0, 0)); // open the inline editor
    const input = container.querySelector(".twc-dt__editor");
    expect(input).toBeTruthy();
    fireEvent.paste(input, clipData("Zed")); // paste targets the editor input, bubbling to the grid
    expect(onRowsChange).not.toHaveBeenCalled(); // grid paste NOT triggered — the #343 editable guard let it through
  });
});
