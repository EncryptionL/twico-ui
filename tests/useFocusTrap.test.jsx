import { describe, it, expect, beforeAll, afterAll } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useFocusTrap } from "../hooks/index.js";

function Trap({ active = true, restoreFocus }) {
  const ref = React.useRef(null);
  useFocusTrap(ref, active, restoreFocus === undefined ? undefined : { restoreFocus });
  return (
    <div ref={ref} tabIndex={-1} data-testid="region">
      <button>first</button>
      <button>middle</button>
      <button>last</button>
    </div>
  );
}

describe("useFocusTrap (#177)", () => {
  it("moves focus to the first focusable when activated", () => {
    render(<Trap active />);
    expect(document.activeElement).toHaveTextContent("first");
  });

  it("does not move focus when inactive", () => {
    render(<Trap active={false} />);
    expect(document.activeElement).toBe(document.body);
  });

  it("restores focus to the previously-focused element on deactivate", () => {
    const { rerender } = render(
      <>
        <button data-testid="trigger">open</button>
        <Trap active={false} />
      </>
    );
    screen.getByTestId("trigger").focus();
    expect(document.activeElement).toHaveTextContent("open");

    rerender(
      <>
        <button data-testid="trigger">open</button>
        <Trap active />
      </>
    );
    expect(document.activeElement).toHaveTextContent("first"); // moved inside

    rerender(
      <>
        <button data-testid="trigger">open</button>
        <Trap active={false} />
      </>
    );
    expect(document.activeElement).toHaveTextContent("open"); // restored
  });

  it("does not restore focus when restoreFocus is false", () => {
    const { rerender } = render(
      <>
        <button data-testid="trigger">open</button>
        <Trap active={false} restoreFocus={false} />
      </>
    );
    screen.getByTestId("trigger").focus();
    rerender(
      <>
        <button data-testid="trigger">open</button>
        <Trap active restoreFocus={false} />
      </>
    );
    expect(document.activeElement).toHaveTextContent("first");
    rerender(
      <>
        <button data-testid="trigger">open</button>
        <Trap active={false} restoreFocus={false} />
      </>
    );
    // focus is NOT pulled back to the trigger
    expect(document.activeElement).not.toHaveTextContent("open");
  });

  // jsdom reports offsetParent as null for everything (no layout), and the trap
  // filters visible focusables by offsetParent. Fake it so wrapping is exercisable.
  describe("Tab wrapping", () => {
    let spy;
    beforeAll(() => {
      spy = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");
      Object.defineProperty(HTMLElement.prototype, "offsetParent", {
        configurable: true,
        get() { return this.parentNode; },
      });
    });
    afterAll(() => {
      if (spy) Object.defineProperty(HTMLElement.prototype, "offsetParent", spy);
      else delete HTMLElement.prototype.offsetParent;
    });

    it("Tab from the last focusable wraps to the first", () => {
      render(<Trap active />);
      const buttons = screen.getAllByRole("button");
      buttons[2].focus();
      fireEvent.keyDown(document, { key: "Tab" });
      expect(document.activeElement).toBe(buttons[0]);
    });

    it("Shift+Tab from the first focusable wraps to the last", () => {
      render(<Trap active />);
      const buttons = screen.getAllByRole("button");
      buttons[0].focus();
      fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(buttons[2]);
    });
  });
});
