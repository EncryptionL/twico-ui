import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import { Tooltip } from "../components/overlay/Tooltip.jsx";
import { Button } from "../components/buttons/Button.jsx";
import { IconButton } from "../components/buttons/IconButton.jsx";
import { Menu } from "../components/overlay/Menu.jsx";

// #398: a disabled Button/IconButton can show its "why disabled" tooltip. CSS lets hover reach the wrap, and
// focusableWhenDisabled keeps the trigger focusable (aria-disabled, not native disabled) while blocking clicks.
afterEach(() => cleanup());

describe("Tooltip disabled-trigger CSS (#398)", () => {
  it("declares pointer-events:none for disabled/aria-disabled children of the wrap", () => {
    render(<Tooltip label="x"><button>t</button></Tooltip>);
    const css = Array.from(document.querySelectorAll("style")).map((s) => s.textContent).join("\n");
    expect(css).toMatch(/\.twc-tooltip-wrap\s*>\s*:disabled[^{]*,[^{]*\[aria-disabled="true"\]\s*\{[^}]*pointer-events:\s*none/);
  });

  it("opens the tooltip on mouseEnter of the wrap around a disabled button", () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<Tooltip label="Can't delete: still in use" delay={0}><Button disabled>Delete</Button></Tooltip>);
      const wrap = container.querySelector(".twc-tooltip-wrap");
      fireEvent.mouseEnter(wrap);
      act(() => { vi.advanceTimersByTime(20); });
      const bubble = document.querySelector(".twc-tooltip");
      expect(bubble).toBeTruthy();
      expect(bubble.getAttribute("data-show")).toBe("true");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Tooltip over a Menu with a disabled trigger (#420)", () => {
  it("widens the pass-through CSS to a Menu/Popover-wrapped disabled trigger", () => {
    render(<Tooltip label="why"><Menu trigger={<IconButton aria-label="more" disabled focusableWhenDisabled icon={<i>x</i>} />} items={[{ label: "A" }]} /></Tooltip>);
    const css = Array.from(document.querySelectorAll("style")).map((s) => s.textContent).join("\n");
    expect(css).toMatch(/\.twc-tooltip-wrap\s+:is\(\.twc-menu-wrap,\s*\.twc-popover-wrap\)\s*>\s*\[aria-disabled="true"\]/);
  });

  it("a Menu with a disabled trigger does not open from the keyboard (#420)", () => {
    const { container } = render(<Menu trigger={<IconButton aria-label="more" disabled focusableWhenDisabled icon={<i>x</i>} />} items={[{ label: "A" }]} />);
    const trigger = container.querySelector('[aria-haspopup="menu"]');
    fireEvent.keyDown(container.querySelector(".twc-menu-wrap"), { key: "ArrowDown" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.keyDown(container.querySelector(".twc-menu-wrap"), { key: "Enter" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("forwards aria-describedby to the Menu's focusable trigger, not the wrapper (#420)", () => {
    const { container } = render(<Menu aria-describedby="desc-x" trigger={<IconButton aria-label="more" icon={<i>x</i>} />} items={[{ label: "A" }]} />);
    expect(container.querySelector(".twc-menu-wrap").getAttribute("aria-describedby")).toBeNull();
    expect(container.querySelector('[aria-haspopup="menu"]').getAttribute("aria-describedby")).toBe("desc-x");
  });
});

describe("Button focusableWhenDisabled (#398)", () => {
  it("renders aria-disabled (not native disabled), stays focusable, and blocks click", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Button disabled focusableWhenDisabled onClick={onClick}>Save</Button>);
    const btn = getByRole("button");
    expect(btn.hasAttribute("disabled")).toBe(false);
    expect(btn.getAttribute("aria-disabled")).toBe("true");
    expect(btn.tabIndex).not.toBe(-1);
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("without the flag, a disabled button keeps the native disabled attribute", () => {
    const { getByRole } = render(<Button disabled>Save</Button>);
    expect(getByRole("button").hasAttribute("disabled")).toBe(true);
  });
});

describe("IconButton focusableWhenDisabled (#398)", () => {
  it("renders aria-disabled, stays focusable, and blocks click", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<IconButton aria-label="del" disabled focusableWhenDisabled onClick={onClick} icon={<i>x</i>} />);
    const btn = getByRole("button");
    expect(btn.hasAttribute("disabled")).toBe(false);
    expect(btn.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
