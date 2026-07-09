import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { Tooltip } from "../components/overlay/Tooltip.jsx";

// jsdom performs no layout (getBoundingClientRect/offsetWidth are 0), so stub the trigger
// rect and the measured bubble box to exercise place()'s clamp + dynamic-arrow math.
const setViewport = (w, h) => {
  Object.defineProperty(window, "innerWidth", { value: w, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: h, configurable: true });
};

function mockLayout({ trigger, tipW, tipH }) {
  const origRect = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function () {
    if (this.classList && this.classList.contains("twc-tooltip-wrap")) {
      return { ...trigger, x: trigger.left, y: trigger.top, toJSON() {} };
    }
    return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON() {} };
  };
  const ow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
  const oh = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
  const isTip = function () { return this.classList && this.classList.contains("twc-tooltip"); };
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, get() { return isTip.call(this) ? tipW : 0; } });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, get() { return isTip.call(this) ? tipH : 0; } });
  return () => {
    HTMLElement.prototype.getBoundingClientRect = origRect;
    if (ow) Object.defineProperty(HTMLElement.prototype, "offsetWidth", ow);
    if (oh) Object.defineProperty(HTMLElement.prototype, "offsetHeight", oh);
  };
}

async function openTip(container) {
  fireEvent.mouseEnter(container.querySelector(".twc-tooltip-wrap"));
  await act(async () => { await new Promise((r) => setTimeout(r, 180)); }); // past the 120ms open delay
}

describe("Tooltip width + dynamic arrow", () => {
  it("CSS: bubble grows to max-content width and the arrow tracks a CSS var", () => {
    render(<Tooltip label="hi"><button>x</button></Tooltip>);
    const css = Array.from(document.querySelectorAll("style")).map((s) => s.textContent || "").join("\n");
    expect(css).toMatch(/\.twc-tooltip\s*\{[^}]*width:\s*max-content/);
    expect(css).toContain("var(--_tw-arrow-x, 50%)");
  });

  it("clamps a right-edge tooltip on-screen and offsets the arrow toward the trigger", async () => {
    setViewport(1000, 800);
    const restore = mockLayout({ trigger: { left: 960, top: 400, right: 980, bottom: 420, width: 20, height: 20 }, tipW: 200, tipH: 40 });
    try {
      const { container } = render(<Tooltip label="A fairly long tooltip label goes here"><button>x</button></Tooltip>);
      await openTip(container);
      const style = document.querySelector(".twc-tooltip").getAttribute("style") || "";
      // cx=970; centre clamp -> min(max(970,108),892)=892; arrowX = clamp(970-(892-100),12,188)=178
      expect(style).toMatch(/left:\s*892px/);
      expect(style).toMatch(/--_tw-arrow-x:\s*178px/);
    } finally { restore(); }
  });

  it("centres the arrow when the trigger is not near an edge", async () => {
    setViewport(1000, 800);
    const restore = mockLayout({ trigger: { left: 490, top: 400, right: 510, bottom: 420, width: 20, height: 20 }, tipW: 160, tipH: 40 });
    try {
      const { container } = render(<Tooltip label="centered label"><button>x</button></Tooltip>);
      await openTip(container);
      const style = document.querySelector(".twc-tooltip").getAttribute("style") || "";
      // cx=500; centre=500 (no clamp); arrowX = clamp(500-(500-80),12,148)=80 = tw/2
      expect(style).toMatch(/--_tw-arrow-x:\s*80px/);
    } finally { restore(); }
  });
});
