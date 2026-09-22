import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { ImageViewer } from "../components/data-display/ImageViewer.jsx";

// #407: zoomable image viewer. jsdom has no layout, so mock a fixed stage rect (300x200 at 100,100 → center 250,200).
const RECT = { top: 100, left: 100, right: 400, bottom: 300, width: 300, height: 200, x: 100, y: 100, toJSON() {} };
let origRect;
beforeEach(() => { origRect = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
afterEach(() => { Element.prototype.getBoundingClientRect = origRect; cleanup(); });

const stageOf = (c) => c.querySelector(".twc-iv__stage");
const imgTransform = (c) => c.querySelector(".twc-iv__img").style.transform;

describe("ImageViewer zoom (#407)", () => {
  it("wheel zooms in about the pointer and clamps to maxZoom", () => {
    const { container } = render(<ImageViewer src="/x.png" alt="X" maxZoom={2} step={0.25} />);
    const stage = stageOf(container);
    fireEvent.wheel(stage, { deltaY: -100, clientX: 250, clientY: 200 }); // at center → offset stays 0
    expect(imgTransform(container)).toContain("scale(1.25)");
    expect(imgTransform(container)).toContain("translate(0px, 0px)");
    // keep zooming past the max → clamps
    for (let i = 0; i < 20; i++) fireEvent.wheel(stage, { deltaY: -100, clientX: 250, clientY: 200 });
    expect(imgTransform(container)).toContain("scale(2)");
  });

  it("keyboard +/-/0 zoom and reset", () => {
    const onZoomChange = vi.fn();
    const { container } = render(<ImageViewer src="/x.png" alt="X" step={0.5} onZoomChange={onZoomChange} />);
    const stage = stageOf(container);
    fireEvent.keyDown(stage, { key: "+" });
    expect(imgTransform(container)).toContain("scale(1.5)");
    expect(onZoomChange).toHaveBeenLastCalledWith(1.5);
    fireEvent.keyDown(stage, { key: "-" });
    expect(imgTransform(container)).toContain("scale(1)");
    fireEvent.keyDown(stage, { key: "+" });
    fireEvent.keyDown(stage, { key: "0" }); // reset
    expect(imgTransform(container)).toContain("scale(1)");
    expect(imgTransform(container)).toContain("translate(0px, 0px)");
  });

  it("ignores a pure-horizontal wheel (deltaY===0) — no accidental zoom-out (review fix)", () => {
    const { container } = render(<ImageViewer src="/x.png" alt="X" />);
    fireEvent.wheel(stageOf(container), { deltaY: 0, deltaX: 120, clientX: 250, clientY: 200 });
    expect(imgTransform(container)).toContain("scale(1)"); // unchanged
  });

  it("does not zoom below minZoom", () => {
    const { container } = render(<ImageViewer src="/x.png" alt="X" />);
    fireEvent.keyDown(stageOf(container), { key: "-" });
    expect(imgTransform(container)).toContain("scale(1)");
  });

  it("resets zoom when src changes (not on mount)", () => {
    const onZoomChange = vi.fn();
    const { container, rerender } = render(<ImageViewer src="/a.png" alt="A" onZoomChange={onZoomChange} />);
    expect(onZoomChange).not.toHaveBeenCalled(); // no spurious fire on mount
    fireEvent.keyDown(stageOf(container), { key: "+" });
    expect(imgTransform(container)).not.toContain("scale(1)");
    rerender(<ImageViewer src="/b.png" alt="B" onZoomChange={onZoomChange} />);
    expect(imgTransform(container)).toContain("scale(1)"); // reset on src change
  });
});

describe("ImageViewer controls (#407)", () => {
  it("renders default controls with zoom-out disabled at min", () => {
    const { container } = render(<ImageViewer src="/x.png" alt="X" />);
    const bar = container.querySelector(".twc-iv__controls");
    expect(bar).toBeTruthy();
    const out = container.querySelector('button[aria-label="Zoom out"]');
    expect(out.hasAttribute("disabled")).toBe(true);
  });

  it("controls={false} hides them; a render function receives the api", () => {
    const { container, rerender } = render(<ImageViewer src="/x.png" alt="X" controls={false} />);
    expect(container.querySelector(".twc-iv__controls")).toBeNull();
    rerender(<ImageViewer src="/x.png" alt="X" controls={(api) => <button data-testid="z" onClick={api.zoomIn}>Z {api.zoom}</button>} />);
    expect(container.querySelector('[data-testid="z"]')).toBeTruthy();
  });
});
