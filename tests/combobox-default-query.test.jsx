import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Combobox } from "../components/inputs/Combobox.jsx";

// #425 — Combobox owns its text input, so it was lossy as a datatable cell editor:
//   1. `close()` (chevron / Escape / outside click) silently reset the typed query with NO signal, so a
//      host staging the query as a draft couldn't withdraw it -> `onOpenChange(open)` now fires on every
//      open<->close transition.
//   2. There was no way to pre-fill the search box for spot edits -> `defaultQuery` seeds the input on open
//      (caret at end) WITHOUT emitting it as an `onInputChange` (it's a seed, not a user-typed change).

const OPTIONS = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
];

const input = () => document.querySelector('input[role="combobox"]');
const chevron = () => document.querySelector(".twc-cb__chev");
const flushRaf = () => new Promise((r) => requestAnimationFrame(() => r()));

afterEach(() => cleanup());

describe("Combobox onOpenChange (#425)", () => {
  it("does NOT fire on mount", () => {
    const onOpenChange = vi.fn();
    render(<Combobox label="Color" options={OPTIONS} onOpenChange={onOpenChange} />);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("fires true when the menu opens (focus) and false when it closes (chevron)", () => {
    const onOpenChange = vi.fn();
    render(<Combobox label="Color" options={OPTIONS} onOpenChange={onOpenChange} />);
    fireEvent.focus(input());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(chevron()); // open -> closed
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it("fires false on Escape", () => {
    const onOpenChange = vi.fn();
    render(<Combobox label="Color" options={OPTIONS} onOpenChange={onOpenChange} />);
    fireEvent.focus(input());
    onOpenChange.mockClear();
    fireEvent.keyDown(input(), { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it("fires false on an outside click (the silent close a host must react to)", () => {
    const onOpenChange = vi.fn();
    render(<Combobox label="Color" options={OPTIONS} onOpenChange={onOpenChange} />);
    fireEvent.focus(input());
    onOpenChange.mockClear();
    fireEvent.mouseDown(document.body);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });
});

describe("Combobox defaultQuery (#425)", () => {
  it("seeds the input with defaultQuery when the menu opens", () => {
    render(<Combobox label="Color" options={OPTIONS} defaultQuery="gre" />);
    fireEvent.focus(input());
    expect(input().value).toBe("gre");
  });

  it("does NOT emit the seed as an onInputChange (it is a seed, not a user-typed change)", () => {
    const onInputChange = vi.fn();
    render(<Combobox label="Color" options={OPTIONS} defaultQuery="gre" onInputChange={onInputChange} />);
    fireEvent.focus(input());
    expect(onInputChange).not.toHaveBeenCalled();
    // a real keystroke still fires it
    fireEvent.change(input(), { target: { value: "gree" } });
    expect(onInputChange).toHaveBeenCalledWith("gree");
  });

  it("places the caret at the end of the seeded text", async () => {
    render(<Combobox label="Color" options={OPTIONS} defaultQuery="gre" />);
    fireEvent.focus(input());
    await flushRaf();
    expect(input().selectionStart).toBe(3);
    expect(input().selectionEnd).toBe(3);
  });

  it("filters the option list by the seeded query on open", () => {
    render(<Combobox label="Color" options={OPTIONS} defaultQuery="gre" />);
    fireEvent.focus(input());
    const labels = Array.from(document.querySelectorAll(".twc-opt__label")).map((n) => n.textContent);
    expect(labels).toEqual(["Green"]);
  });

  it("opens empty (unchanged) when defaultQuery is not provided", () => {
    render(<Combobox label="Color" options={OPTIONS} />);
    fireEvent.focus(input());
    expect(input().value).toBe("");
  });
});
