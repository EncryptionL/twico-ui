import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Combobox } from "../components/inputs/Combobox.jsx";

// #300 — long Combobox option labels/descriptions truncated to one line with no escape hatch. `wrapOptions`
// lets them wrap onto multiple lines (default stays single-line). Wrapping makes rows variable-height, so it
// takes precedence over the fixed-row-height `virtualized` path.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "inputs", "Combobox.jsx");
const longOptions = [
  { value: "a", label: "M40 ANEFIL BONDED NYLON WPN VARIANT ALPHA", description: "thread_master :: A" },
  { value: "b", label: "M40 ANEFIL BONDED NYLON WPN VARIANT BRAVO", description: "thread_master :: B" },
];

const openList = () => fireEvent.focus(document.querySelector('input[role="combobox"]'));
const optionEls = () => Array.from(document.querySelectorAll(".twc-opt"));

afterEach(() => cleanup());

describe("Combobox wrapOptions (#300)", () => {
  it("ships a CSS rule that un-truncates and wraps option text when data-wrap is set", () => {
    const src = readFileSync(SRC, "utf8");
    expect(src).toMatch(/\.twc-opt\[data-wrap="true"\] \.twc-opt__label[^}]*white-space: normal/);
    expect(src).toMatch(/overflow-wrap: anywhere/); // a single very long token can't overflow the popover edge
  });

  it("does NOT set data-wrap by default (options stay single-line)", () => {
    render(<Combobox label="Thread" options={longOptions} />);
    openList();
    const opts = optionEls();
    expect(opts.length).toBe(2);
    expect(opts.every((o) => o.getAttribute("data-wrap") === null)).toBe(true);
  });

  it("sets data-wrap on every option when wrapOptions is on", () => {
    render(<Combobox label="Thread" options={longOptions} wrapOptions />);
    openList();
    const opts = optionEls();
    expect(opts.length).toBe(2);
    expect(opts.every((o) => o.getAttribute("data-wrap") === "true")).toBe(true);
  });

  it("takes precedence over `virtualized` — warns once and renders every row (not windowed)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Combobox label="Thread" options={longOptions} wrapOptions virtualized />);
    openList();
    // both rows render as normal wrapped options rather than being sliced by fixed-height virtualization
    const opts = optionEls();
    expect(opts.length).toBe(2);
    expect(opts.every((o) => o.getAttribute("data-wrap") === "true")).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("wrapOptions"));
    warn.mockRestore();
  });
});
