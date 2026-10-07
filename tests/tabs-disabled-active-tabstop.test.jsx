import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Tabs } from "../components/navigation/Tabs.jsx";

// #458 — the roving tab stop was `it.value === active && !it.disabled ? 0 : -1`, so whenever the active
// tab was disabled (or `value` matched no item at all) EVERY tab got tabIndex={-1} and the whole tablist
// dropped out of the tab order: a keyboard user could not reach the tabs at all. A tablist must always
// expose exactly one tab stop (APG); it falls back to the first enabled tab.

afterEach(cleanup);

const tabs = (c) => [...c.querySelectorAll('[role="tab"]')];
const stops = (c) => tabs(c).filter((t) => t.getAttribute("tabindex") === "0");

describe("Tabs roving tab stop (#458)", () => {
  it("puts the stop on the active tab in the ordinary case", () => {
    const { container } = render(
      <Tabs items={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} defaultValue="b" />
    );
    expect(stops(container)).toHaveLength(1);
    expect(stops(container)[0].textContent).toBe("B");
  });

  it("falls back to the first enabled tab when the active tab is disabled", () => {
    const { container } = render(
      <Tabs
        items={[{ value: "a", label: "A", disabled: true }, { value: "b", label: "B" }, { value: "c", label: "C" }]}
        value="a"
      />
    );
    expect(stops(container)).toHaveLength(1);
    expect(stops(container)[0].textContent).toBe("B");
  });

  it("skips leading disabled tabs when picking the fallback", () => {
    const { container } = render(
      <Tabs
        items={[
          { value: "a", label: "A", disabled: true },
          { value: "b", label: "B", disabled: true },
          { value: "c", label: "C" },
        ]}
        value="a"
      />
    );
    expect(stops(container)[0].textContent).toBe("C");
  });

  it("keeps a tab stop when `value` matches no item", () => {
    const { container } = render(
      <Tabs items={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} value="nope" />
    );
    expect(stops(container)).toHaveLength(1);
    expect(stops(container)[0].textContent).toBe("A");
  });

  it("exposes no stop only when every tab is disabled (nothing is focusable to hold it)", () => {
    const { container } = render(
      <Tabs items={[{ value: "a", label: "A", disabled: true }, { value: "b", label: "B", disabled: true }]} />
    );
    expect(stops(container)).toHaveLength(0);
  });
});
