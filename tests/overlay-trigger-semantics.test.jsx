import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Popover } from "../components/overlay/Popover.jsx";
import { Menu } from "../components/overlay/Menu.jsx";
import { Button } from "../components/buttons/Button.jsx";
import { AvatarMenu } from "../components/data-display/AvatarMenu.jsx";
import { Tooltip } from "../components/overlay/Tooltip.jsx";

// #447 — Popover/Menu clone their `trigger` to inject tabIndex + aria-expanded + aria-haspopup.
// On a non-control element (a div/Box/Stack) those landed on role="generic", where aria-expanded is
// PROHIBITED (axe aria-allowed-attr) and the tab stop announced nothing. A cloned non-control trigger
// now also gets role="button", and Popover additionally gets Enter/Space activation — its clone branch
// had none, so such a trigger was focusable but could not be operated by keyboard at all. (Menu already
// worked from the keyboard via onKeyDown on span.twc-menu-wrap, contrary to the issue's claim.)

const items = [{ label: "One", onClick: () => {} }, { label: "Two", onClick: () => {} }];
const popTrigger = (c) => c.querySelector(".twc-popover-wrap > *");
const menuTrigger = (c) => c.querySelector(".twc-menu-wrap > *");

afterEach(() => cleanup());

describe("Popover trigger semantics (#447)", () => {
  it("adds role=button to a cloned non-control trigger", () => {
    const { container } = render(<Popover trigger={<div>Open</div>}>body</Popover>);
    const t = popTrigger(container);
    expect(t.tagName).toBe("DIV");
    expect(t.getAttribute("role")).toBe("button");
    expect(t.getAttribute("tabindex")).toBe("0");
    expect(t.getAttribute("aria-expanded")).toBe("false");
  });

  it("Enter and Space open it (the clone branch previously had no keyboard activation)", () => {
    const { container } = render(<Popover trigger={<div>Open</div>}>body</Popover>);
    fireEvent.keyDown(popTrigger(container), { key: "Enter" });
    expect(document.querySelector('[role="dialog"]')).toBeTruthy();
    cleanup();
    const { container: c2 } = render(<Popover trigger={<div>Open</div>}>body</Popover>);
    fireEvent.keyDown(popTrigger(c2), { key: " " });
    expect(document.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it("leaves a real button trigger alone (no injected role)", () => {
    const { container } = render(<Popover trigger={<button>Open</button>}>body</Popover>);
    const t = popTrigger(container);
    expect(t.tagName).toBe("BUTTON");
    expect(t.hasAttribute("role")).toBe(false);
    fireEvent.click(t);
    expect(document.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it("leaves a Button component trigger alone", () => {
    const { container } = render(<Popover trigger={<Button>Open</Button>}>body</Popover>);
    expect(popTrigger(container).hasAttribute("role")).toBe(false);
  });

  it("respects an explicit role and adds no keyboard handler of its own", () => {
    const { container } = render(<Popover trigger={<div role="link">Open</div>}>body</Popover>);
    const t = popTrigger(container);
    expect(t.getAttribute("role")).toBe("link");
    fireEvent.keyDown(t, { key: "Enter" });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("does not double-activate when a real control is nested in the trigger", () => {
    // keydown on the inner button must not also run the wrapper's injected handler
    const { container } = render(<Popover trigger={<div><button>Go</button></div>}>body</Popover>);
    const inner = container.querySelector(".twc-popover-wrap button");
    fireEvent.keyDown(inner, { key: "Enter" });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("still honours a consumer onKeyDown on the trigger", () => {
    const onKeyDown = vi.fn();
    const { container } = render(<Popover trigger={<div onKeyDown={onKeyDown}>Open</div>}>body</Popover>);
    fireEvent.keyDown(popTrigger(container), { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();
  });
});

describe("Menu trigger semantics (#447)", () => {
  it("adds role=button to a cloned non-control trigger", () => {
    const { container } = render(<Menu trigger={<div>Open</div>} items={items} />);
    const t = menuTrigger(container);
    expect(t.tagName).toBe("DIV");
    expect(t.getAttribute("role")).toBe("button");
  });

  it("keyboard open already worked and still does (wrapper onKeyDown)", () => {
    const { container } = render(<Menu trigger={<div>Open</div>} items={items} />);
    fireEvent.keyDown(menuTrigger(container), { key: "ArrowDown" });
    expect(document.querySelector('[role="menu"]')).toBeTruthy();
  });

  it("leaves a Button trigger alone", () => {
    const { container } = render(<Menu trigger={<Button>Open</Button>} items={items} />);
    expect(menuTrigger(container).hasAttribute("role")).toBe(false);
  });

  it("does not overwrite AvatarMenu's own span role=button", () => {
    const { container } = render(<AvatarMenu name="Ada Lovelace" items={items} />);
    const t = menuTrigger(container);
    expect(t.getAttribute("role")).toBe("button");
    fireEvent.keyDown(t, { key: "ArrowDown" });
    expect(document.querySelector('[role="menu"]')).toBeTruthy();
  });
});
