import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Menu } from "../components/overlay/Menu.jsx";

// #457 — Space could never activate the highlighted item. The type-ahead branch tested
// `e.key.length === 1` and sat BEFORE the activation branch in the same else-if chain, so a space
// (length 1) was swallowed into the type-ahead buffer and the Enter/Space branch was unreachable.
// The APG lists Space alongside Enter for a menuitem.
//
// #459 — the trigger carried aria-activedescendant, which is not a permitted attribute on
// role="button": assistive tech discarded it, so a keyboard user arrowing through the menu was told
// nothing at all. Real DOM focus now moves to the highlighted item instead (the APG model).

afterEach(cleanup);

const wrap = (c) => c.querySelector(".twc-menu-wrap");
const trig = (c) => c.querySelector(".twc-menu-wrap > button, .twc-menu-wrap > [role='button']");
const items = () => [...document.querySelectorAll(".twc-menu__item")];
const active = () => document.querySelector('.twc-menu__item[data-active="true"]');

function openMenu(c) {
  fireEvent.click(c.querySelector("button"));
  return c;
}

describe("Menu Space activation (#457)", () => {
  it("activates the highlighted item on Space, exactly as Enter does", () => {
    const onAlpha = vi.fn();
    const { container } = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha", onClick: onAlpha }, { label: "Beta" }]} />
    );
    openMenu(container);
    fireEvent.keyDown(wrap(container), { key: "ArrowDown" });
    expect(active()?.textContent).toContain("Alpha");
    fireEvent.keyDown(wrap(container), { key: " " });
    expect(onAlpha).toHaveBeenCalledTimes(1);
    expect(trig(container).getAttribute("aria-expanded")).toBe("false"); // and it closed
  });

  it("does not feed the space into type-ahead (it must not jump to a label starting with a space)", () => {
    const { container } = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha" }, { label: "Beta" }]} />
    );
    openMenu(container);
    fireEvent.keyDown(wrap(container), { key: "ArrowDown" });   // Alpha
    fireEvent.keyDown(wrap(container), { key: "ArrowDown" });   // Beta
    fireEvent.keyDown(wrap(container), { key: " " });           // activates Beta, closes
    // Re-open: a leftover " " in the type-ahead buffer would have made the next letter miss.
    openMenu(container);
    fireEvent.keyDown(wrap(container), { key: "b" });
    expect(active()?.textContent).toContain("Beta");
  });

  it("still type-aheads on ordinary printable keys", () => {
    const { container } = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha" }, { label: "Beta" }]} />
    );
    openMenu(container);
    fireEvent.keyDown(wrap(container), { key: "b" });
    expect(active()?.textContent).toContain("Beta");
  });
});

describe("Menu highlight is announced by focus, not by an illegal attribute (#459)", () => {
  it("never puts aria-activedescendant on the role=button trigger", () => {
    const { container } = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha" }, { label: "Beta" }]} />
    );
    openMenu(container);
    fireEvent.keyDown(wrap(container), { key: "ArrowDown" });
    expect(trig(container).hasAttribute("aria-activedescendant")).toBe(false);
  });

  it("moves DOM focus onto the item the keyboard highlighted", () => {
    const { container } = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha" }, { label: "Beta" }]} />
    );
    openMenu(container);
    fireEvent.keyDown(wrap(container), { key: "ArrowDown" });
    expect(document.activeElement).toBe(items()[0]);
    fireEvent.keyDown(wrap(container), { key: "ArrowDown" });
    expect(document.activeElement).toBe(items()[1]);
  });

  it("does not steal focus when the highlight comes from the mouse", () => {
    const { container } = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha" }, { label: "Beta" }]} />
    );
    openMenu(container);
    const before = document.activeElement;
    fireEvent.mouseEnter(items()[1]);
    expect(active()?.textContent).toContain("Beta"); // highlight follows the pointer...
    expect(document.activeElement).toBe(before);     // ...but focus stays put
  });

  it("hands focus back to the trigger when the menu closes", () => {
    const { container } = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha" }, { label: "Beta" }]} />
    );
    openMenu(container);
    fireEvent.keyDown(wrap(container), { key: "ArrowDown" });
    expect(document.activeElement).toBe(items()[0]);
    fireEvent.keyDown(wrap(container), { key: "Escape" });
    expect(document.activeElement).toBe(trig(container));
  });

  it("keeps the items out of the tab order", () => {
    const { container } = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha" }, { label: "Beta" }]} />
    );
    openMenu(container);
    for (const el of items()) expect(el.getAttribute("tabindex")).toBe("-1");
  });
});

// #459 (review) - two mechanisms the focus model depends on, neither of which the tests above touch:
// they fire on the wrapper, whereas a browser dispatches at document.activeElement - which, once the
// highlight moves, is an element inside the PORTAL.
describe("Menu keyboard works from the focused item inside the portal (#459 review)", () => {
  const open3 = () => {
    const r = render(
      <Menu trigger={<button>T</button>} items={[{ label: "Alpha" }, { label: "Beta" }, { label: "Gamma" }]} />
    );
    fireEvent.click(r.container.querySelector("button"));
    fireEvent.keyDown(wrap(r.container), { key: "ArrowDown" });
    return r;
  };

  it("arrow keys dispatched on the portaled item still navigate", () => {
    const { container } = open3();
    expect(document.activeElement).toBe(items()[0]);
    // React propagates through the REACT tree, not the DOM tree, and attaches to the portal
    // container - so the wrapper's handler keeps receiving keys from inside the portal.
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    expect(active()?.textContent).toContain("Beta");
    expect(document.activeElement).toBe(items()[1]);
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    expect(active()?.textContent).toContain("Gamma");
  });

  it("Escape dispatched on the portaled item closes the menu", () => {
    const { container } = open3();
    fireEvent.keyDown(document.activeElement, { key: "Escape" });
    expect(trig(container).getAttribute("aria-expanded")).toBe("false");
  });

  it("Tab returns focus to the trigger before the event can reach an ancestor focus trap", () => {
    const { container } = open3();
    expect(document.activeElement).toBe(items()[0]);
    fireEvent.keyDown(document.activeElement, { key: "Tab" });
    expect(trig(container).getAttribute("aria-expanded")).toBe("false");
    // Without this, a Dialog/Drawer trap sees activeElement outside its region and yanks focus to the
    // dialog's FIRST focusable instead of letting Tab continue past the trigger. (The yank itself is
    // not assertable here: useFocusTrap filters candidates by offsetParent, which jsdom always reports
    // as null, so in jsdom the trap focuses the dialog node whatever we do - see docs/overlays.md.)
    expect(document.activeElement).toBe(trig(container));
  });
});
