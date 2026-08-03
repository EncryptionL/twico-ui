import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #304 — generalize the #292 filter-panel resize into a table-wide `resizablePopovers` capability: a corner
// grip + keyboard resize on the Columns / Aggregation / Pivot / Batch-edit panels, keyed per-popover in
// `popSizes` and persisted (popoverSizes) via stateKey. `resizablePopovers` also enables the filters grip.

const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");
const columns = [{ field: "name", headerName: "Name" }, { field: "n", headerName: "N", type: "number" }];
const rows = [{ id: 1, name: "x", n: 1 }];
const RECT = { top: 100, bottom: 138, left: 100, right: 250, width: 150, height: 38, x: 100, y: 100, toJSON() {} };

describe("Datatable resizablePopovers (#304)", () => {
  describe("engine (source)", () => {
    const src = readFileSync(DT_SRC, "utf8");
    it("adds a generic per-popover keyed resize engine + grip", () => {
      expect(src).toContain("const [popSizes, setPopSizes]");
      expect(src).toContain("const startPopResize = (id) =>");
      expect(src).toContain("const popGrip = (id) =>");
      expect(src).toContain('setProperty("--twc-dt-pop-w"');
    });
    it("gates the panel size + inner-list-fill on data-pop-sized (position stays fixed per #294)", () => {
      expect(src).toContain(".twc-dt__pop[data-pop-sized] { display: flex; flex-direction: column; width: var(--twc-dt-pop-w) !important;");
      expect(src).not.toMatch(/\.twc-dt__pop\[data-pop-sized\] \{[^}]*position:\s*(relative|absolute|static)/); // must NOT clobber fixed
      expect(src).toContain(".twc-dt__pop[data-pop-sized] .twc-dt__col-list");
    });
    it("persists per-popover sizes as popoverSizes", () => {
      expect(src).toContain("popoverSizes: Object.keys(popSizes).length");
      expect(src).toContain("if (s.popoverSizes && typeof s.popoverSizes ===");
    });
  });

  describe("DOM behavior", () => {
    let orig;
    beforeEach(() => { window.localStorage.clear(); orig = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
    afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

    const openColumns = (c) => fireEvent.click(Array.from(c.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Columns")));
    const openFilters = (c) => fireEvent.click(Array.from(c.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));

    it("renders a grip on the Columns panel by default (#314: resizablePopovers defaults true)", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
      openColumns(container);
      expect(container.querySelector(".twc-dt__cols .twc-dt__pop-grip")).toBeTruthy();
    });

    it("resizablePopovers={false} opts a grid out (no grip on the Columns panel)", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} resizablePopovers={false} />);
      openColumns(container);
      expect(container.querySelector(".twc-dt__cols .twc-dt__pop-grip")).toBeNull();
    });

    it("is independent of resizableFilters (#314): resizableFilters={false} removes the Filters grip while the Columns panel keeps its own", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} resizableFilters={false} resizablePopovers />);
      openFilters(container);
      expect(container.querySelector(".twc-dt__filters .twc-dt__pop-grip")).toBeNull(); // filters opted out
      openColumns(container);
      expect(container.querySelector(".twc-dt__cols .twc-dt__pop-grip")).toBeTruthy();  // other panels still resizable
    });

    it("keyboard-resizes the Columns panel, marks it data-pop-sized, and persists popoverSizes", () => {
      const onStateChange = vi.fn();
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} resizablePopovers onStateChange={onStateChange} />);
      openColumns(container);
      onStateChange.mockClear();
      fireEvent.keyDown(container.querySelector(".twc-dt__cols .twc-dt__pop-grip"), { key: "ArrowRight" });
      const cols = container.querySelector(".twc-dt__cols");
      expect(cols.getAttribute("data-pop-sized")).toBe("");
      const reported = onStateChange.mock.calls.at(-1)[0];
      expect(reported.popoverSizes.columns.w).toBeGreaterThanOrEqual(240); // min clamp for the columns panel
    });

    it("restores a persisted popover size on open (data-pop-sized + the width var)", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} resizablePopovers stateKey="dt-304"
        initialState={{ popoverSizes: { columns: { w: 320, h: 260 } } }} />);
      openColumns(container);
      const cols = container.querySelector(".twc-dt__cols");
      expect(cols.getAttribute("data-pop-sized")).toBe("");
      expect(cols.style.getPropertyValue("--twc-dt-pop-w")).toBe("320px");
    });
  });
});
