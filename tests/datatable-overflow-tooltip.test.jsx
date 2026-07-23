import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";
import { Tooltip } from "../components/overlay/Tooltip.jsx";

// #265 — truncated cells/headers reveal their full value through the twico Tooltip (anchored mode),
// not the native `title`, and only when actually clipped. jsdom reports scrollWidth/clientWidth as 0,
// so we mock them to simulate a truncated (or fitting) element.
const columns = [{ field: "name", headerName: "Name" }];
const rows = [{ id: 1, name: "A very long value that would be clipped by the column" }];
const setWidths = (el, scroll, client) => {
  Object.defineProperty(el, "scrollWidth", { configurable: true, value: scroll });
  Object.defineProperty(el, "clientWidth", { configurable: true, value: client });
};

describe("Datatable overflow tooltip (#265)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows the twico Tooltip with the full value when a truncated cell is hovered", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const cell = container.querySelector("tbody .twc-dt__td[data-ovtext]");
    setWidths(cell, 400, 80); // truncated
    act(() => { fireEvent.mouseOver(cell); });
    act(() => { vi.advanceTimersByTime(150); }); // clear the 120ms open delay
    const tip = document.querySelector('.twc-tooltip[data-show="true"]');
    expect(tip).toBeTruthy();
    expect(tip.textContent).toContain("A very long value that would be clipped by the column");
  });

  it("does NOT show a tooltip when the cell is not truncated", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const cell = container.querySelector("tbody .twc-dt__td[data-ovtext]");
    setWidths(cell, 80, 80); // fits
    act(() => { fireEvent.mouseOver(cell); });
    act(() => { vi.advanceTimersByTime(150); });
    expect(document.querySelector('.twc-tooltip[data-show="true"]')).toBeNull();
  });

  it("hides the tooltip on mouse out", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const cell = container.querySelector("tbody .twc-dt__td[data-ovtext]");
    setWidths(cell, 400, 80);
    act(() => { fireEvent.mouseOver(cell); });
    act(() => { vi.advanceTimersByTime(150); });
    expect(document.querySelector('.twc-tooltip[data-show="true"]')).toBeTruthy();
    act(() => { fireEvent.mouseOut(cell, { relatedTarget: document.body }); });
    expect(document.querySelector('.twc-tooltip[data-show="true"]')).toBeNull();
  });
});

// The Tooltip anchored mode itself (used by the grid above): controlled `open` + an `anchor` element,
// rendered as just the portaled bubble.
describe("Tooltip anchored mode (#265)", () => {
  it("renders only the portaled bubble, positioned at the anchor, gated by `open`", () => {
    const anchor = document.createElement("div");
    document.body.appendChild(anchor);
    const { rerender, container } = render(<Tooltip anchor={anchor} open={false} label="Full value" />);
    // no wrapper span in anchored mode
    expect(container.querySelector(".twc-tooltip-wrap")).toBeNull();
    // closed → bubble not shown
    expect(document.querySelector('.twc-tooltip[data-show="true"]')).toBeNull();
    rerender(<Tooltip anchor={anchor} open label="Full value" />);
    const tip = document.querySelector('.twc-tooltip[data-show="true"]');
    expect(tip).toBeTruthy();
    expect(tip.textContent).toContain("Full value");
    anchor.remove();
  });
});
