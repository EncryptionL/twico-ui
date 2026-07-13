import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";
import { CardGrid } from "../components/data-display/CardGrid.jsx";

const rows = [{ id: 1, no: 1, name: "Ada", city: "Rome" }, { id: 2, no: 2, name: "Ben", city: "Oslo" }];
const thByLabel = (container, label) =>
  Array.from(container.querySelectorAll(".twc-dt__th")).find((th) => th.querySelector(".twc-dt__th-label")?.textContent.trim() === label);
const menuItemTexts = () => Array.from(document.querySelectorAll('.twc-dt__pop [role="menuitem"]')).map((b) => b.textContent.trim());
const openColMenu = (container, label) => fireEvent.click(thByLabel(container, label).querySelector(".twc-dt__menu-btn"));

// The floating menu bails when the trigger rect is all-zeros (jsdom), so give elements a real rect.
describe("Datatable column ⋮ menu flags (#227, #228)", () => {
  let orig;
  beforeEach(() => {
    orig = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 100, right: 130, width: 30, height: 20, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

  it("#228: reorderable:false OMITS the Move items (rather than disabling them)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={[
      { field: "seq", headerName: "No", reorderable: false },
      { field: "name", headerName: "Name" },
      { field: "city", headerName: "City" },
    ]} />);
    openColMenu(container, "No");
    const items = menuItemTexts();
    expect(items).not.toContain("Move left");
    expect(items).not.toContain("Move right");
  });

  it("#228: a reorderable column still shows the Move items", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={[
      { field: "seq", headerName: "No", reorderable: false },
      { field: "name", headerName: "Name" },
      { field: "city", headerName: "City" },
    ]} />);
    openColMenu(container, "Name");
    const items = menuItemTexts();
    expect(items).toContain("Move left");
    expect(items).toContain("Move right");
  });

  it("#227: wrappable:false OMITS the Wrap text item", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={[
      { field: "seq", headerName: "No", wrappable: false },
      { field: "name", headerName: "Name" },
    ]} />);
    openColMenu(container, "No");
    expect(menuItemTexts()).not.toContain("Wrap text");
    // A normal column keeps it.
    openColMenu(container, "Name");
    expect(menuItemTexts()).toContain("Wrap text");
  });

  it("a fixed single-token column can show only Sort + Hide", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={[
      { field: "seq", headerName: "No", sortable: true, filterable: false, groupable: false, pinnable: false, reorderable: false, wrappable: false, hideable: true },
      { field: "name", headerName: "Name" },
    ]} />);
    openColMenu(container, "No");
    expect(menuItemTexts()).toEqual(["Sort ascending", "Sort descending", "Hide column"]);
  });
});

// #229 — column width: number | "auto", clamped by minWidth/maxWidth.
describe("Datatable column width auto/min/max (#229)", () => {
  const px = (container, label) => thByLabel(container, label).style.width;
  it("width:'auto' fits the header (chrome + label) — narrower than the 160px default", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={[
      { field: "no", headerName: "No", width: "auto" },
      { field: "name", headerName: "Name" },
    ]} />);
    expect(px(container, "No")).toBe("90px"); // 74 chrome + ceil(2*8)
    expect(px(container, "Name")).toBe("160px");
    expect(parseInt(px(container, "No"))).toBeLessThan(160);
  });

  it("minWidth raises a too-small width; maxWidth caps a too-large one (min wins)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={[
      { field: "a", headerName: "A", width: 40, minWidth: 100 },
      { field: "b", headerName: "B", width: 400, maxWidth: 200 },
    ]} />);
    expect(px(container, "A")).toBe("100px");
    expect(px(container, "B")).toBe("200px");
  });
});

// #226 — CardGrid sort control sizes to its widest label (no truncation).
describe("CardGrid sort control width (#226)", () => {
  const card = (r) => <div className="card">{r.name}</div>;
  const data = [{ id: 1, name: "x", lifecycle: "a" }];
  it("gives the sort trigger a min-width derived from the longest option label", () => {
    const { container } = render(<CardGrid rows={data} renderCard={card} sortOptions={[
      { field: "name", label: "Name" },
      { field: "lifecycle", label: "Model lifecycle stage (very long label)" },
    ]} />);
    const trigger = container.querySelector(".twc-cardgrid__sort .twc-sel__trigger");
    expect(trigger).toBeTruthy();
    expect(parseInt(trigger.style.minWidth)).toBeGreaterThan(120);
  });

  it("sortMinWidth overrides the estimate", () => {
    const { container } = render(<CardGrid rows={data} renderCard={card} sortMinWidth={200} sortOptions={[{ field: "name", label: "Name" }]} />);
    expect(container.querySelector(".twc-cardgrid__sort .twc-sel__trigger").style.minWidth).toBe("200px");
  });
});
