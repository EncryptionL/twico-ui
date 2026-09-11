import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dialog } from "../components/overlay/Dialog.jsx";
import { Drawer } from "../components/overlay/Drawer.jsx";
import { Popover } from "../components/overlay/Popover.jsx";

// #371 Dialog scrollBody defaults to true (footer/header pinned, body scrolls — buttons never leave the screen)
// #372 Dialog + Drawer `dividers` default true (header/body + body/footer rules; suppressed for empty regions)
// #373 Popover clamps to the room place() measured and scrolls its inner (footer stays reachable)

describe("Dialog scrollBody default (#371)", () => {
  it("defaults scrollBody to true (pinned header/footer, scrolling body)", () => {
    render(<Dialog open onClose={() => {}} title="T" footer={<button>Save</button>}>body</Dialog>);
    expect(screen.getByRole("dialog").getAttribute("data-scroll-body")).toBe("true");
  });
  it("scrollBody={false} scrolls the whole panel (no data-scroll-body)", () => {
    render(<Dialog open onClose={() => {}} title="T" scrollBody={false} footer={<button>Save</button>}>body</Dialog>);
    expect(screen.getByRole("dialog").getAttribute("data-scroll-body")).toBeNull();
  });
});

describe("Dialog dividers (#372)", () => {
  const q = (sel) => document.querySelector(sel);

  it("draws header + footer rules by default", () => {
    render(<Dialog open onClose={() => {}} title="T" description="d" footer={<button>Save</button>}>body</Dialog>);
    expect(q(".twc-dialog__header").getAttribute("data-divider")).toBe("true");
    expect(q(".twc-dialog__footer").getAttribute("data-divider")).toBe("true");
  });

  it("dividers={false} draws no rules", () => {
    render(<Dialog open onClose={() => {}} title="T" dividers={false} footer={<button>Save</button>}>body</Dialog>);
    expect(q(".twc-dialog__header").getAttribute("data-divider")).toBeNull();
    expect(q(".twc-dialog__footer").getAttribute("data-divider")).toBeNull();
  });

  it("suppresses the header rule when the header has only a close button (no title/description)", () => {
    render(<Dialog open onClose={() => {}} footer={<button>Save</button>}>body</Dialog>);
    // header still renders (for the close button) but carries no divider
    expect(q(".twc-dialog__header")).toBeTruthy();
    expect(q(".twc-dialog__header").getAttribute("data-divider")).toBeNull();
  });

  it("grows no stray footer rule when there is no footer", () => {
    render(<Dialog open onClose={() => {}} title="T">body</Dialog>);
    expect(q(".twc-dialog__footer")).toBeNull(); // no footer element at all
  });

  it("shows a single rule (not a doubled one) for a bodyless title+footer dialog", () => {
    render(<Dialog open onClose={() => {}} title="Confirm" footer={<button>OK</button>} />);
    // header keeps its rule (it separates header from footer); the footer's is suppressed (no body above it)
    expect(q(".twc-dialog__header").getAttribute("data-divider")).toBe("true");
    expect(q(".twc-dialog__footer").getAttribute("data-divider")).toBeNull();
  });

  it("suppresses the header rule when nothing follows it (no body, no footer)", () => {
    render(<Dialog open onClose={() => {}} title="Just a title" />);
    expect(q(".twc-dialog__header").getAttribute("data-divider")).toBeNull();
  });
});

describe("Drawer dividers (#372)", () => {
  const q = (sel) => document.querySelector(sel);
  it("draws header + footer rules by default, and none when dividers={false}", () => {
    const { rerender } = render(<Drawer open onClose={() => {}} title="T" footer={<button>Save</button>}>body</Drawer>);
    expect(q(".twc-drawer__header").getAttribute("data-divider")).toBe("true");
    expect(q(".twc-drawer__footer").getAttribute("data-divider")).toBe("true");
    rerender(<Drawer open onClose={() => {}} title="T" dividers={false} footer={<button>Save</button>}>body</Drawer>);
    expect(q(".twc-drawer__header").getAttribute("data-divider")).toBeNull();
    expect(q(".twc-drawer__footer").getAttribute("data-divider")).toBeNull();
  });

  it("suppresses the header rule when the header has only a close button, and grows no footer rule without a footer", () => {
    render(<Drawer open onClose={() => {}}>body</Drawer>);
    expect(q(".twc-drawer__header")).toBeTruthy(); // renders for the close button
    expect(q(".twc-drawer__header").getAttribute("data-divider")).toBeNull(); // but no rule
    expect(q(".twc-drawer__footer")).toBeNull(); // no footer element
  });
});

describe("Popover max-height / overflow (#373)", () => {
  it("clamps the inner to the measured room below the trigger, shorter than the content (footer reachable)", () => {
    // jsdom has no layout, so stub the trigger rect; place() derives spaceBelow from it + window.innerHeight.
    const origRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 80, bottom: 100, left: 50, right: 250, width: 200, height: 20, x: 50, y: 80, toJSON() {} });
    try {
      render(
        <Popover open placement="bottom" trigger={<button>open</button>}>
          <div style={{ height: 4000 }}>tall content</div>
          <button>View all</button>
        </Popover>,
      );
      const inner = document.querySelector(".twc-popover__inner");
      expect(inner).toBeTruthy();
      // maxHeight === spaceBelow = innerHeight − trigger.bottom(100) − gap(10) − margin(8); no hard floor
      const expected = window.innerHeight - 100 - 10 - 8;
      expect(inner.style.maxHeight).toBe(`${expected}px`);
      expect(expected).toBeLessThan(4000); // strictly shorter than the content → it scrolls, footer reachable
    } finally {
      Element.prototype.getBoundingClientRect = origRect;
    }
  });

  it("ships the overflow rule that makes the inner scroll", () => {
    // the scroll lives on the inner (not the panel) so the arrow — a panel sibling — isn't clipped
    render(<Popover open trigger={<button>open</button>}>x</Popover>);
    const styleEl = Array.from(document.querySelectorAll("style")).find((s) => s.textContent.includes(".twc-popover__inner"));
    expect(styleEl.textContent).toMatch(/\.twc-popover__inner[^}]*overflow-y:\s*auto/);
    // and the panel itself keeps overflow visible (no overflow rule on .twc-popover) for the arrow
    expect(styleEl.textContent).not.toMatch(/\.twc-popover\s*\{[^}]*overflow/);
  });
});
