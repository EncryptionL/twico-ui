import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");

// #289 — the filter panel's column/operator Select fields auto-fit the widest label instead of a fixed
// 118px that truncated real header names, clamped so the value input keeps its 140px floor in the 580px panel.
describe("Datatable filter field auto-fit (#289)", () => {
  it("drives the field widths from measured CSS vars, clamped, with wrap as a safety net", () => {
    const src = readFileSync(DT_SRC, "utf8");
    // #292 renamed the measured var to -fit and moved to the clamp() cascade; the measurer still auto-fits.
    expect(src).toContain("var(--twc-dt-fcol-fit, 118px)");
    expect(src).toContain("var(--twc-dt-fop-fit, 118px)");
    expect(src).toContain('setProperty("--twc-dt-fcol-fit"'); // measurer writes the -fit tier
    expect(src).toMatch(/\.twc-dt__frow \{[^}]*flex-wrap: wrap;/);
  });

  describe("measured width (canvas + panel width mocked)", () => {
    let origGetContext, origPad;
    beforeEach(() => {
      origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = () => ({ font: "", measureText: (t) => ({ width: String(t).length * 8 }) });
      origPad = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 100, right: 680, width: 580, height: 20, x: 100, y: 100, toJSON() {} });
    });
    afterEach(() => {
      HTMLCanvasElement.prototype.getContext = origGetContext;
      Element.prototype.getBoundingClientRect = origPad;
    });

    it("widens the measured (-fit) column width toward the cap for a long header, staying <= 210px", () => {
      const columns = [
        { field: "articleNumber", headerName: "A Very Long Article Number Header" }, // ~33 chars → beyond cap
        { field: "n", headerName: "N", type: "number" },
      ];
      const { container } = render(<Datatable columns={columns} rows={[{ id: 1, articleNumber: "x", n: 1 }]} rowKey={(r) => r.id} />);
      // give the panel a real width so the cap resolves to 210 (jsdom clientWidth is 0)
      const openFilters = () => fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
      openFilters();
      const panel = container.querySelector(".twc-dt__filters");
      Object.defineProperty(panel, "clientWidth", { configurable: true, value: 580 });
      // add a filter row so a real .twc-sel__trigger mounts, then trigger a re-measure via ResizeObserver-less path
      fireEvent.click(Array.from(container.querySelectorAll("button")).find((b) => b.textContent.trim() === "Add filter"));
      // re-open to re-run the measure effect against the now-real clientWidth
      openFilters(); openFilters();
      const w = parseFloat(panel.style.getPropertyValue("--twc-dt-fcol-fit"));
      expect(w).toBeGreaterThan(118); // widened past the old fixed width
      expect(w).toBeLessThanOrEqual(210); // measured tier still capped (drag can exceed via -usr)
    });
  });
});
