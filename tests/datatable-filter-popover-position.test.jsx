import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");
const columns = [{ field: "name", headerName: "Name" }, { field: "n", headerName: "N", type: "number" }];
const rows = [{ id: 1, name: "Ada", n: 1 }];

// #294 — the #292 resizable-filters feature added `position: relative` to .twc-dt__filters, which (equal
// specificity, defined after .twc-dt__pop) clobbered the popover's `position: fixed`, dropping the panel
// into normal flow below the table. The panel must stay position: fixed.
describe("Datatable filters popover stays fixed (#294)", () => {
  it("does NOT declare `position` on .twc-dt__filters; .twc-dt__pop keeps position: fixed", () => {
    const src = readFileSync(DT_SRC, "utf8");
    // no `position:` DECLARATION at the start of the .twc-dt__filters rule (comment mentions are fine)
    expect(src).not.toMatch(/\.twc-dt__filters \{\s*position:\s*(relative|static|absolute)/);
    expect(src).toMatch(/\.twc-dt__pop \{[^}]*position: fixed/);
  });

  describe("rendered panel", () => {
    let orig;
    beforeEach(() => { orig = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 138, left: 100, right: 250, width: 150, height: 38, x: 100, y: 100, toJSON() {} }); });
    afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

    it("renders the panel with both classes (inherits .twc-dt__pop position:fixed) + the anchored inline top/left", () => {
      const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
      fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
      const panel = container.querySelector(".twc-dt__filters");
      expect(panel).toBeTruthy();
      expect(panel.classList.contains("twc-dt__pop")).toBe(true); // provides position: fixed
      // the fixed-viewport anchor coords are applied inline (nonsensical if it were relative/in-flow)
      expect(panel.style.top).not.toBe("");
      expect(panel.style.left).not.toBe("");
    });
  });
});
