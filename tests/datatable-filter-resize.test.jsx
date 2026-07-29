import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");
const columns = [{ field: "articleNumber", headerName: "Article Number" }, { field: "n", headerName: "N", type: "number" }];
const rows = [{ id: 1, articleNumber: "x", n: 1 }];
const RECT = { top: 100, bottom: 138, left: 100, right: 250, width: 150, height: 38, x: 100, y: 100, toJSON() {} };

// #292 — user-resizable Filters popover + fields, layered over #289 auto-fit via a two-tier CSS var
// cascade (user drag > measured > fallback). Persists via stateKey, keyboard-accessible, no API break.
describe("Datatable resizable filters (#292)", () => {
  describe("CSS var cascade (source)", () => {
    const src = readFileSync(DT_SRC, "utf8");
    it("renames the #289 measured var to -fit; the measurer writes ONLY -fit (never -usr)", () => {
      expect(src).toContain('setProperty("--twc-dt-fcol-fit"');
      expect(src).toContain('setProperty("--twc-dt-fop-fit"');
      expect(src).not.toContain('setProperty("--twc-dt-fcol-w"'); // old name gone (same commit)
    });
    it("resolves field width as user > measured > fallback via clamp()", () => {
      expect(src).toContain("clamp(118px, var(--twc-dt-fcol-usr, var(--twc-dt-fcol-fit, 118px)), var(--twc-dt-fcol-cap, 360px))");
      expect(src).toContain("clamp(118px, var(--twc-dt-fop-usr, var(--twc-dt-fop-fit, 118px)), var(--twc-dt-fop-cap, 260px))");
    });
    it("flips value to fixed after a drag and scrolls rows only when a height is pinned", () => {
      expect(src).toContain(".twc-dt__filters[data-val-fixed] .twc-dt__f-val");
      expect(src).toContain(".twc-dt__filters[data-panel-sized] .twc-dt__frows { flex: 1 1 auto; overflow-y: auto; }");
    });
  });

  describe("DOM behavior", () => {
    let orig;
    beforeEach(() => { window.localStorage.clear(); orig = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
    afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

    const openFilters = (c) => fireEvent.click(Array.from(c.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
    const addFilter = (c) => fireEvent.click(Array.from(c.querySelectorAll("button")).find((b) => b.textContent.trim() === "Add filter"));

    it("renders 3 field handles (first row only) + the panel grip by default", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
      openFilters(container); addFilter(container); addFilter(container); // two rows
      expect(container.querySelectorAll(".twc-dt__f-rz").length).toBe(3); // still 3 — panel-global, first row
      expect(container.querySelector(".twc-dt__pop-grip")).toBeTruthy();
    });

    it("resizableFilters={false} removes the handles + grip (fields still auto-fit via CSS)", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} resizableFilters={false} />);
      openFilters(container); addFilter(container);
      expect(container.querySelectorAll(".twc-dt__f-rz").length).toBe(0);
      expect(container.querySelector(".twc-dt__pop-grip")).toBeNull();
    });

    it("keyboard resize of the column field commits a -usr width and persists via onStateChange", () => {
      const onStateChange = vi.fn();
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} onStateChange={onStateChange} />);
      openFilters(container); addFilter(container); onStateChange.mockClear();
      fireEvent.keyDown(container.querySelector(".twc-dt__f-col .twc-dt__f-rz"), { key: "ArrowRight" });
      const panel = container.querySelector(".twc-dt__filters");
      expect(panel.style.getPropertyValue("--twc-dt-fcol-usr")).toMatch(/^\d+px$/);
      expect(typeof onStateChange.mock.calls.at(-1)[0].filterFieldWidths.col).toBe("number");
    });

    it("Enter on a field handle resets it (removes the -usr var so auto-fit re-wins)", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
      openFilters(container); addFilter(container);
      const handle = container.querySelector(".twc-dt__f-col .twc-dt__f-rz");
      fireEvent.keyDown(handle, { key: "ArrowRight" });
      const panel = container.querySelector(".twc-dt__filters");
      expect(panel.style.getPropertyValue("--twc-dt-fcol-usr")).toMatch(/px$/);
      fireEvent.keyDown(handle, { key: "Enter" });
      expect(panel.style.getPropertyValue("--twc-dt-fcol-usr")).toBe("");
    });

    it("panel grip ArrowDown pins a height (data-panel-sized) and persists filterPanelSize", () => {
      const onStateChange = vi.fn();
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} onStateChange={onStateChange} />);
      openFilters(container); addFilter(container); onStateChange.mockClear();
      fireEvent.keyDown(container.querySelector(".twc-dt__pop-grip"), { key: "ArrowDown" });
      const panel = container.querySelector(".twc-dt__filters");
      expect(panel.hasAttribute("data-panel-sized")).toBe(true);
      expect(panel.style.getPropertyValue("--twc-dt-panel-h")).toMatch(/^\d+px$/);
      expect(typeof onStateChange.mock.calls.at(-1)[0].filterPanelSize.h).toBe("number");
    });

    it("restores persisted filter sizes from stateKey (viewport-clamped)", () => {
      window.localStorage.setItem("dt-rsz", JSON.stringify({ filterFieldWidths: { col: 200 }, filterPanelSize: { w: 640, h: 300 } }));
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} stateKey="dt-rsz" />);
      openFilters(container);
      const panel = container.querySelector(".twc-dt__filters");
      expect(panel.style.getPropertyValue("--twc-dt-fcol-usr")).toBe("200px");
      expect(panel.style.getPropertyValue("--twc-dt-panel-h")).toBe("300px");
      expect(panel.hasAttribute("data-panel-sized")).toBe(true);
    });

    it("operator dropdown portals to <body> — not clipped by a pinned-height scroll box", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
      openFilters(container); addFilter(container);
      fireEvent.keyDown(container.querySelector(".twc-dt__pop-grip"), { key: "ArrowDown" }); // pin height → scroll box
      fireEvent.click(container.querySelector(".twc-dt__f-op .twc-sel__trigger"));
      const listbox = document.querySelector('[role="listbox"]');
      expect(listbox).toBeTruthy();
      expect(container.querySelector(".twc-dt__frows").contains(listbox)).toBe(false); // portaled, not clipped
    });
  });
});
