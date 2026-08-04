import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #327 — clear (X) on the built-in Datatable inputs: quick-search, column-menu search, and (via #328's
// Input clearable) the per-column filter value input.
const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");
const cols = [{ field: "name", headerName: "Name" }, { field: "n", headerName: "N", type: "number" }];
const rows = [{ id: 1, name: "Ada", n: 1 }, { id: 2, name: "Ben", n: 2 }];
const RECT = { top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} };

describe("Datatable built-in input clears (#327)", () => {
  it("quick-search: a clear X appears when non-empty and empties the search", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
    const input = container.querySelector(".twc-dt__search input");
    expect(container.querySelector(".twc-dt__search-clear")).toBeNull(); // hidden when empty
    fireEvent.change(input, { target: { value: "Ad" } });
    const clear = container.querySelector(".twc-dt__search-clear");
    expect(clear).toBeTruthy();
    fireEvent.click(clear);
    expect(container.querySelector(".twc-dt__search input").value).toBe("");
    expect(container.querySelector(".twc-dt__search-clear")).toBeNull();
  });

  it("quick-search: clearing restores focus to the input (the clear button unmounts on clear)", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
    const input = container.querySelector(".twc-dt__search input");
    fireEvent.change(input, { target: { value: "Ad" } });
    fireEvent.click(container.querySelector(".twc-dt__search-clear"));
    // keyboard users activate the ✕ with focus on it; after it unmounts, focus must land back on the input.
    expect(document.activeElement).toBe(container.querySelector(".twc-dt__search input"));
  });

  describe("panels", () => {
    let orig;
    beforeEach(() => { orig = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
    afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

    it("column-menu search: a clear X empties the find-column box", () => {
      const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
      fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Columns")));
      const input = container.querySelector(".twc-dt__col-search input");
      fireEvent.change(input, { target: { value: "Na" } });
      const clear = container.querySelector(".twc-dt__col-search .twc-dt__search-clear");
      expect(clear).toBeTruthy();
      fireEvent.click(clear);
      expect(container.querySelector(".twc-dt__col-search input").value).toBe("");
    });

    it("the per-column filter value input is clearable (renders the Input clear X once a value is typed)", () => {
      const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} />);
      fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
      fireEvent.click(Array.from(container.querySelectorAll("button")).find((b) => b.textContent.trim() === "Add filter"));
      const valInput = container.querySelector(".twc-dt__f-val input");
      fireEvent.change(valInput, { target: { value: "Ada" } });
      expect(container.querySelector(".twc-dt__f-val .twc-input__clear")).toBeTruthy();
    });
  });

  it("source-guard: the filter value Input opts into clearable", () => {
    const src = readFileSync(DT_SRC, "utf8");
    expect(src).toMatch(/<Input size="sm" clearable/);
  });
});
