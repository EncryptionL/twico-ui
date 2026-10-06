import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import { Accordion } from "../components/navigation/Accordion.jsx";

// #446 — a collapsed panel mounted its entire subtree (hooks, effects and all) just to hide it with
// grid-template-rows: 0fr, which pushed a 10-item page past Lighthouse's excessive-DOM threshold.
// `mountOnOpen` defers an item's content until it is first opened and then KEEPS it mounted, so the
// close animation still has content to interpolate against; `unmountOnClose` drops it again after the
// collapse. Both are opt-in, so the default behaviour is unchanged.

const items = [
  { value: "a", label: "A", content: <p data-testid="c-a">Panel A</p> },
  { value: "b", label: "B", content: <p data-testid="c-b">Panel B</p> },
];
const has = (id) => !!document.querySelector(`[data-testid="${id}"]`);
const trigger = (c, i) => c.querySelectorAll(".twc-accordion__trigger")[i];

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("Accordion default behaviour is unchanged (#446)", () => {
  it("renders collapsed content eagerly when neither prop is set", () => {
    render(<Accordion items={items} />);
    expect(has("c-a")).toBe(true);
    expect(has("c-b")).toBe(true);
  });
});

describe("Accordion mountOnOpen (#446)", () => {
  it("does not render a never-opened panel's content", () => {
    render(<Accordion items={items} mountOnOpen />);
    expect(has("c-a")).toBe(false);
    expect(has("c-b")).toBe(false);
  });

  it("keeps the panel element and aria-controls intact while the content is deferred", () => {
    const { container } = render(<Accordion items={items} mountOnOpen />);
    const panels = container.querySelectorAll(".twc-accordion__panel");
    expect(panels.length).toBe(2);
    const id = trigger(container, 0).getAttribute("aria-controls");
    expect(container.querySelector(`#${id}`)).toBeTruthy(); // never dangles
  });

  it("mounts on first open, and KEEPS it mounted after closing so the collapse can animate", () => {
    const { container } = render(<Accordion items={items} mountOnOpen />);
    fireEvent.click(trigger(container, 0));
    expect(has("c-a")).toBe(true);
    expect(has("c-b")).toBe(false);
    fireEvent.click(trigger(container, 0)); // close
    expect(trigger(container, 0).getAttribute("aria-expanded")).toBe("false");
    expect(has("c-a")).toBe(true); // still mounted — content remains for the close animation
  });

  it("seeds from defaultOpen so a pre-opened panel is never open-but-blank", () => {
    render(<Accordion items={items} mountOnOpen defaultOpen={["b"]} />);
    expect(has("c-b")).toBe(true);
    expect(has("c-a")).toBe(false);
  });

  it("seeds from a controlled open prop (a restored 'these were open last time' set)", () => {
    render(<Accordion items={items} mountOnOpen open={["a", "b"]} multiple />);
    expect(has("c-a")).toBe(true);
    expect(has("c-b")).toBe(true);
  });

  it("mounts content when a CONTROLLED open prop changes, not just on click", () => {
    const { rerender } = render(<Accordion items={items} mountOnOpen open={[]} />);
    expect(has("c-a")).toBe(false);
    rerender(<Accordion items={items} mountOnOpen open={["a"]} />);
    expect(has("c-a")).toBe(true);
  });
});

describe("Accordion unmountOnClose (#446)", () => {
  it("waits out the collapse transition, then unmounts the content", () => {
    vi.useFakeTimers();
    const { container } = render(<Accordion items={items} unmountOnClose defaultOpen={["a"]} />);
    expect(has("c-a")).toBe(true);
    fireEvent.click(trigger(container, 0)); // close
    expect(has("c-a")).toBe(true); // still there while the panel collapses
    act(() => { vi.advanceTimersByTime(260); });
    expect(has("c-a")).toBe(false); // dropped once the animation is done
  });

  it("re-opening before the timeout fires keeps the content mounted", () => {
    vi.useFakeTimers();
    const { container } = render(<Accordion items={items} unmountOnClose defaultOpen={["a"]} />);
    fireEvent.click(trigger(container, 0)); // close
    act(() => { vi.advanceTimersByTime(100); });
    fireEvent.click(trigger(container, 0)); // re-open mid-collapse
    act(() => { vi.advanceTimersByTime(400); });
    expect(has("c-a")).toBe(true);
  });
});
