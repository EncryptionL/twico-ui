import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #232 — the "is any of" column filter can load its options from a server via loadValueOptions.
describe("Datatable async filter value options (#232)", () => {
  let orig;
  beforeEach(() => {
    orig = Element.prototype.getBoundingClientRect;
    // The filter panel + Select popovers bail on all-zero rects (jsdom) — give them a real one.
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

  const cols = [
    { field: "supplier", headerName: "Supplier" },
    { field: "qty", headerName: "Qty", type: "number" },
  ];
  const rows = [{ id: 1, supplier: "acme", qty: 5 }];

  const openIsAnyOfFilter = (container) => {
    // Open the Filters panel.
    fireEvent.click(Array.from(container.querySelectorAll(".twc-dt__tbtn")).find((b) => b.textContent.includes("Filters")));
    // Add a filter (defaults to the first column, op "contains").
    fireEvent.click(Array.from(container.querySelectorAll("button")).find((b) => b.textContent.trim() === "Add filter"));
    // Switch the op to "is any of".
    fireEvent.click(container.querySelector(".twc-dt__f-op .twc-sel__trigger"));
    fireEvent.click(Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent.trim() === "is any of"));
  };

  it("calls loadValueOptions (priming with '') when the picker mounts", async () => {
    const loader = vi.fn(() => Promise.resolve([{ value: "acme", label: "Acme Co" }, { value: "globex", label: "Globex" }]));
    const { container } = render(<Datatable rowKey={(r) => r.id} columns={[{ ...cols[0], loadValueOptions: loader }, cols[1]]} rows={rows} />);
    openIsAnyOfFilter(container);
    await waitFor(() => expect(loader).toHaveBeenCalledWith(""));
  });

  it("shows the server-loaded options in the picker (not page-derived values)", async () => {
    const loader = vi.fn(() => Promise.resolve([{ value: "acme", label: "Acme Co" }, { value: "globex", label: "Globex" }]));
    const { container } = render(<Datatable rowKey={(r) => r.id} columns={[{ ...cols[0], loadValueOptions: loader }, cols[1]]} rows={rows} />);
    openIsAnyOfFilter(container);
    await waitFor(() => expect(loader).toHaveBeenCalled());
    // Open the value MultiSelect and confirm the loaded labels appear.
    fireEvent.focus(container.querySelector(".twc-dt__f-val input"));
    await waitFor(() => {
      const labels = Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent);
      expect(labels.some((t) => t.includes("Acme Co"))).toBe(true);
    });
  });

  it("without loadValueOptions the picker does not call any loader (static path)", () => {
    const loader = vi.fn(() => Promise.resolve([]));
    const { container } = render(<Datatable rowKey={(r) => r.id} columns={cols} rows={rows} />);
    openIsAnyOfFilter(container);
    expect(loader).not.toHaveBeenCalled();
    // A plain MultiSelect renders in the value slot.
    expect(container.querySelector(".twc-dt__f-val")).toBeTruthy();
  });
});
