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

// Regression: a seeded defaultQuery narrows the visible list, but the on-open highlight effect used to index the
// UNFILTERED `flat` list — so with a selected value + a filtering seed, `active` pointed outside `visible`, which
// dropped aria-activedescendant, broke arrow bounds, and made Enter either a no-op or commit the WRONG option.
// The highlight effect now indexes `visible`.
const activeOption = () => document.querySelector('.twc-opt[data-active="true"]');

describe("Combobox defaultQuery + selected value (#425 regression)", () => {
  it("highlights the selected option (not a stale flat index) when the seed filters to a single match, and Enter commits it", () => {
    const onChange = vi.fn();
    render(<Combobox label="Color" options={OPTIONS} value="blue" defaultQuery="Blue" onChange={onChange} />);
    fireEvent.focus(input()); // seed "Blue" -> visible = [Blue] only
    expect(activeOption()?.textContent).toContain("Blue");
    const adId = input().getAttribute("aria-activedescendant");
    expect(adId).toBeTruthy();
    expect(document.getElementById(adId)).not.toBeNull(); // points at a real, rendered option
    fireEvent.keyDown(input(), { key: "Enter" }); // headline cell-editor flow: open pre-filled, Enter accepts
    expect(onChange).toHaveBeenCalledWith("blue");
  });

  it("commits the intended option (not a wrong one) when the selection sits inside a multi-match filtered list", () => {
    const onChange = vi.fn();
    const opts = [
      { value: "red", label: "Red" },
      { value: "green", label: "Green" },
      { value: "grape", label: "Grape" },
      { value: "orange", label: "Orange" },
    ];
    // seed "gr" -> visible = [Green, Grape]; grape is flat index 2 (out of range for the len-2 visible list).
    render(<Combobox label="Fruit" options={opts} value="grape" defaultQuery="gr" onChange={onChange} />);
    fireEvent.focus(input());
    expect(activeOption()?.textContent).toContain("Grape");
    fireEvent.keyDown(input(), { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("grape");
  });

  it("falls back to the first visible option when the selected value is filtered out by the seed", () => {
    render(<Combobox label="Color" options={OPTIONS} value="blue" defaultQuery="ee" onChange={() => {}} />);
    fireEvent.focus(input()); // "ee" matches only "Green"; blue is filtered out -> active clamps to 0 (Green)
    expect(activeOption()?.textContent).toContain("Green");
  });
});

describe("Combobox onOpenChange — extra close/no-refire paths (#425)", () => {
  it("fires false when a selection is committed (the primary close path)", () => {
    const onOpenChange = vi.fn();
    render(<Combobox label="Color" options={OPTIONS} onOpenChange={onOpenChange} />);
    fireEvent.focus(input());
    onOpenChange.mockClear();
    fireEvent.click(document.querySelector(".twc-opt")); // commit -> close
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it("does NOT re-fire while typing keeps the menu open", () => {
    const onOpenChange = vi.fn();
    render(<Combobox label="Color" options={OPTIONS} onOpenChange={onOpenChange} />);
    fireEvent.focus(input());
    fireEvent.change(input(), { target: { value: "r" } });
    fireEvent.change(input(), { target: { value: "re" } });
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true); // still just the single open transition
  });
});
