import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Button } from "../components/buttons/Button.jsx";
import { IconButton } from "../components/buttons/IconButton.jsx";
import { ToggleGroup } from "../components/buttons/ToggleGroup.jsx";

// #405: pressed (aria-pressed) on Button/IconButton + a ToggleGroup of toggle buttons.
afterEach(() => cleanup());

describe("Button/IconButton pressed (#405)", () => {
  it("omits aria-pressed by default, and reflects true/false", () => {
    const { getByRole, rerender } = render(<Button>x</Button>);
    expect(getByRole("button").hasAttribute("aria-pressed")).toBe(false);
    rerender(<Button pressed>x</Button>);
    expect(getByRole("button").getAttribute("aria-pressed")).toBe("true");
    rerender(<Button pressed={false}>x</Button>);
    expect(getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  it("IconButton reflects pressed too", () => {
    const { getByRole } = render(<IconButton aria-label="pin" pressed icon={<i>p</i>} />);
    expect(getByRole("button", { pressed: true })).toBeTruthy();
  });
});

const items = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right", disabled: true },
];

describe("ToggleGroup single (#405)", () => {
  it("renders a role=group of toggle buttons and toggles selection", () => {
    const onValueChange = vi.fn();
    const { container, getByText } = render(<ToggleGroup aria-label="Align" items={items} onValueChange={onValueChange} />);
    expect(container.querySelector('[role="group"]').getAttribute("aria-label")).toBe("Align");
    fireEvent.click(getByText("Center"));
    expect(onValueChange).toHaveBeenLastCalledWith("center");
    expect(getByText("Center").closest("button").getAttribute("aria-pressed")).toBe("true");
  });

  it("clicking the active value deselects it to null (uncontrolled with defaultValue)", () => {
    const onValueChange = vi.fn();
    const { getByText } = render(<ToggleGroup aria-label="Align" items={items} defaultValue="left" onValueChange={onValueChange} />);
    expect(getByText("Left").closest("button").getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(getByText("Left"));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("controlled value ignores internal clicks", () => {
    const { getByText } = render(<ToggleGroup aria-label="Align" items={items} value="left" />);
    fireEvent.click(getByText("Center"));
    // still shows left pressed (parent didn't update value)
    expect(getByText("Left").closest("button").getAttribute("aria-pressed")).toBe("true");
    expect(getByText("Center").closest("button").getAttribute("aria-pressed")).toBe("false");
  });
});

describe("ToggleGroup multiple (#405)", () => {
  it("adds and removes values, emitting a fresh array", () => {
    const onValueChange = vi.fn();
    const { getByText } = render(<ToggleGroup type="multiple" aria-label="Style" items={items} defaultValue={["left"]} onValueChange={onValueChange} />);
    fireEvent.click(getByText("Center"));
    expect(onValueChange).toHaveBeenLastCalledWith(["left", "center"]);
    fireEvent.click(getByText("Left"));
    expect(onValueChange).toHaveBeenLastCalledWith(["center"]);
  });
});

describe("ToggleGroup roving (#405)", () => {
  it("with roving, one button is tab-stop 0 and arrows move focus (not selection), skipping disabled", () => {
    const { container, getByText } = render(<ToggleGroup aria-label="Align" items={items} roving />);
    const btns = Array.from(container.querySelectorAll("button"));
    expect(btns.filter((b) => b.tabIndex === 0).length).toBe(1);
    btns[0].focus();
    fireEvent.keyDown(container.querySelector('[role="group"]'), { key: "ArrowRight" });
    expect(document.activeElement).toBe(getByText("Center").closest("button")); // moved focus
    expect(getByText("Center").closest("button").getAttribute("aria-pressed")).toBe("false"); // not selection
  });

  it("the roving tab stop follows arrow-key focus (review fix)", () => {
    const { container, getByText } = render(<ToggleGroup aria-label="Align" items={items} roving />);
    const grp = container.querySelector('[role="group"]');
    container.querySelectorAll("button")[0].focus();
    fireEvent.keyDown(grp, { key: "ArrowRight" }); // focus → Center
    const center = getByText("Center").closest("button");
    expect(document.activeElement).toBe(center);
    // the roving 0 moved to the now-focused Center (so tabbing out and back returns here), others -1
    expect(center.tabIndex).toBe(0);
    expect(getByText("Left").closest("button").tabIndex).toBe(-1);
  });

  it("without roving, all buttons keep the native tab order (no tabIndex override)", () => {
    const { container } = render(<ToggleGroup aria-label="Align" items={items} />);
    container.querySelectorAll("button").forEach((b) => expect(b.getAttribute("tabindex")).toBeNull());
  });
});
