import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import { Menu } from "../components/overlay/Menu.jsx";
import { TreeView } from "../components/navigation/TreeView.jsx";
import { ToggleGroup } from "../components/buttons/ToggleGroup.jsx";
import { Tooltip } from "../components/overlay/Tooltip.jsx";
import { Carousel } from "../components/data-display/Carousel.jsx";

// #452 — these five components attached an internal handler and then spread `{...rest}` AFTER it, so a
// consumer passing the same-named prop silently REPLACED the internal one. `<Menu onKeyDown={log}>` lost
// every bit of keyboard navigation; TreeView the same; ToggleGroup its roving focus; Carousel its
// autoplay pause; Tooltip its hover-open. Nothing warned — the component just stopped working.
//
// The contract now (components/_compose.js): the consumer's handler runs FIRST, the internal one runs
// after unless the consumer called preventDefault(). Each component is checked for all three halves:
// the internal behaviour survives, the consumer's handler is actually called, and preventDefault opts out.

afterEach(() => { cleanup(); vi.useRealTimers(); });

const ITEMS = [{ label: "Alpha" }, { label: "Beta" }];

describe("Menu composes a consumer onKeyDown (#452)", () => {
  const open = (c) => { fireEvent.click(c.querySelector("button")); };
  const active = () => document.querySelector('.twc-menu__item[data-active="true"]');

  it("keeps arrow-key navigation when the consumer passes onKeyDown", () => {
    const spy = vi.fn();
    const { container } = render(<Menu trigger={<button>T</button>} items={ITEMS} onKeyDown={spy} />);
    open(container);
    fireEvent.keyDown(container.querySelector(".twc-menu-wrap"), { key: "ArrowDown" });
    expect(spy).toHaveBeenCalled();                       // the consumer still hears the key
    expect(active()?.textContent).toContain("Alpha");      // ...and navigation still happened
  });

  it("lets the consumer opt out with preventDefault", () => {
    const { container } = render(
      <Menu trigger={<button>T</button>} items={ITEMS} onKeyDown={(e) => e.preventDefault()} />
    );
    open(container);
    fireEvent.keyDown(container.querySelector(".twc-menu-wrap"), { key: "ArrowDown" });
    expect(active()).toBe(null);
  });
});

describe("TreeView composes a consumer onKeyDown (#452)", () => {
  const nodes = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
  const rows = (c) => [...c.querySelectorAll('[role="treeitem"]')];

  it("keeps arrow-key navigation when the consumer passes onKeyDown", () => {
    const spy = vi.fn();
    const { container } = render(<TreeView items={nodes} onKeyDown={spy} />);
    rows(container)[0].focus();
    // dispatch from the focused row, as a browser does - the tree's handler reads e.target to find it
    fireEvent.keyDown(rows(container)[0], { key: "ArrowDown" });
    expect(spy).toHaveBeenCalled();
    expect(document.activeElement).toBe(rows(container)[1]);
  });

  it("lets the consumer opt out with preventDefault", () => {
    const { container } = render(<TreeView items={nodes} onKeyDown={(e) => e.preventDefault()} />);
    rows(container)[0].focus();
    fireEvent.keyDown(rows(container)[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(rows(container)[0]);
  });
});

describe("ToggleGroup composes a consumer onKeyDown (#452)", () => {
  const items = [{ value: "a", label: "A" }, { value: "b", label: "B" }];
  const btns = (c) => [...c.querySelectorAll("button")];

  it("keeps roving focus when the consumer passes onKeyDown", () => {
    const spy = vi.fn();
    const { container } = render(<ToggleGroup items={items} roving onKeyDown={spy} />);
    btns(container)[0].focus();
    fireEvent.keyDown(container.firstChild, { key: "ArrowRight" });
    expect(spy).toHaveBeenCalled();
    expect(document.activeElement).toBe(btns(container)[1]);
  });
});

describe("Tooltip composes consumer pointer handlers (#452)", () => {
  it("still opens on hover when the consumer passes onMouseEnter", () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const { container } = render(
      <Tooltip label="Why" delay={0} onMouseEnter={spy}><button>T</button></Tooltip>
    );
    fireEvent.mouseEnter(container.querySelector(".twc-tooltip-wrap"));
    act(() => { vi.advanceTimersByTime(50); });
    expect(spy).toHaveBeenCalled();
    expect(document.querySelector('[role="tooltip"]')).not.toBe(null);
  });
});

describe("Carousel composes consumer pointer handlers (#452)", () => {
  const slides = [<p key="1">One</p>, <p key="2">Two</p>, <p key="3">Three</p>];
  const shown = (c) => c.querySelector(".twc-carousel__slide:not([aria-hidden])")?.textContent;

  it("still pauses autoplay on hover when the consumer passes onMouseEnter", () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const { container } = render(
      <Carousel autoPlay interval={100} onMouseEnter={spy}>{slides}</Carousel>
    );
    expect(shown(container)).toBe("One");
    fireEvent.mouseEnter(container.querySelector(".twc-carousel"));
    expect(spy).toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(400); });
    expect(shown(container)).toBe("One"); // paused: autoplay did not advance under the pointer
  });

  it("advances when not hovered, so the pause assertion above means something", () => {
    vi.useFakeTimers();
    const { container } = render(<Carousel autoPlay interval={100}>{slides}</Carousel>);
    act(() => { vi.advanceTimersByTime(150); });
    expect(shown(container)).toBe("Two");
  });
});
