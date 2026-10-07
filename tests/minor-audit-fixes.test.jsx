import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup, act, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Carousel } from "../components/data-display/Carousel.jsx";
import { Select } from "../components/inputs/Select.jsx";
import { MultiSelect } from "../components/inputs/MultiSelect.jsx";
import { Combobox } from "../components/inputs/Combobox.jsx";
import { DatePicker } from "../components/inputs/DatePicker.jsx";
import { TimePicker } from "../components/inputs/TimePicker.jsx";
import { Currency } from "../components/inputs/Currency.jsx";
import { CommandPalette } from "../components/overlay/CommandPalette.jsx";
import { useCopyToClipboard, useWindowSize, useLocalStorage } from "../hooks/index.js";

// Regression cover for the minor findings of the library audit: #462-#474.

afterEach(() => { cleanup(); vi.useRealTimers(); });

const src = (p) => readFileSync(resolve(process.cwd(), p), "utf8");

// ── #464 ─────────────────────────────────────────────────────────────────────
describe("Carousel with no slides (#464)", () => {
  it("does not emit onIndexChange(NaN) on arrow keys", () => {
    const onIndexChange = vi.fn();
    const { container } = render(<Carousel onIndexChange={onIndexChange}>{[]}</Carousel>);
    const region = container.querySelector(".twc-carousel");
    for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"]) {
      fireEvent.keyDown(region, { key });
    }
    // `(i + 0) % 0` is NaN; the handler is reachable because it sits on the always-rendered
    // role="region" wrapper and the viewport is tabbable, even though the arrows/dots are hidden.
    for (const call of onIndexChange.mock.calls) expect(Number.isNaN(call[0])).toBe(false);
  });

  it("does not emit a negative index with loop disabled either", () => {
    const onIndexChange = vi.fn();
    const { container } = render(<Carousel loop={false} onIndexChange={onIndexChange}>{[]}</Carousel>);
    fireEvent.keyDown(container.querySelector(".twc-carousel"), { key: "ArrowRight" });
    // the non-loop branch clamped to Math.min(Math.max(1, 0), count - 1) === -1 rather than NaN
    for (const call of onIndexChange.mock.calls) expect(call[0]).toBeGreaterThanOrEqual(0);
  });

  it("still navigates normally when there are slides", () => {
    const onIndexChange = vi.fn();
    const { container } = render(
      <Carousel onIndexChange={onIndexChange}>{[<p key="a">A</p>, <p key="b">B</p>]}</Carousel>
    );
    fireEvent.keyDown(container.querySelector(".twc-carousel"), { key: "ArrowRight" });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});

// ── #463 ─────────────────────────────────────────────────────────────────────
describe("option index is clamped when the list shrinks (#463)", () => {
  const long = Array.from({ length: 20 }, (_, i) => ({ value: `o${i}`, label: `Option ${i}` }));
  const short = long.slice(0, 3);

  it("Select recovers arrow navigation after `options` shrinks under an open list", () => {
    const { container, rerender } = render(<Select label="X" options={long} searchable={false} />);
    const trigger = container.querySelector(".twc-sel__trigger");
    fireEvent.click(trigger);
    for (let i = 0; i < 7; i++) fireEvent.keyDown(trigger, { key: "ArrowDown" });
    // the parent's refetch replaces the options with a shorter payload, no keystroke involved
    rerender(<Select label="X" options={short} searchable={false} />);
    const id = trigger.getAttribute("aria-activedescendant");
    expect(id, "activedescendant must still name a real option").toBeTruthy();
    expect(document.getElementById(id)).not.toBe(null);
    // and the arrows must still move, in both directions
    fireEvent.keyDown(trigger, { key: "ArrowUp" });
    expect(document.getElementById(trigger.getAttribute("aria-activedescendant"))).not.toBe(null);
  });

  it("all three components clamp at read time, not only via nextEnabled", () => {
    // The shared nextEnabled self-heal and the clamp effect both have to be present: the effect is
    // what makes Enter and aria-activedescendant work WITHOUT a prior arrow press.
    for (const f of ["Select", "MultiSelect", "Combobox"]) {
      const s = src(`components/inputs/${f}.jsx`);
      expect(s, `${f} nextEnabled self-heal`).toContain("from >= visible.length");
      expect(s, `${f} clamp effect`).toContain("Math.min(a, visible.length - 1)");
    }
  });

  it("Select opens with the selected option highlighted, even after a previous search", () => {
    const { container } = render(<Select label="X" options={long} value="o15" />);
    const trigger = container.querySelector(".twc-sel__trigger");
    fireEvent.click(trigger);
    const search = document.querySelector(".twc-pop__search input");
    fireEvent.change(search, { target: { value: "zzz" } });
    fireEvent.keyDown(trigger, { key: "Escape" });   // close, leaving a stale query behind
    fireEvent.click(trigger);                        // reopen
    const id = trigger.getAttribute("aria-activedescendant") || search.getAttribute("aria-activedescendant");
    const active = document.querySelector('.twc-opt[data-active="true"]');
    // the highlight must be the SELECTED option, not option 0 (the [query] reset used to win)
    expect(active?.textContent ?? (id && document.getElementById(id)?.textContent)).toContain("Option 15");
  });
});

// ── #465 ─────────────────────────────────────────────────────────────────────
describe("RTL uses logical properties (#465)", () => {
  it("DateRangePicker range edges use logical corner radii", () => {
    const s = src("components/inputs/DateRangePicker.jsx");
    expect(s).toContain("border-start-start-radius");
    expect(s).toContain("border-end-end-radius");
    expect(s).not.toContain("border-radius: var(--radius-md) 0 0 var(--radius-md)");
  });

  it("the Sidebar collapse chevron mirrors under dir=rtl", () => {
    expect(src("components/navigation/Sidebar.jsx")).toContain('[dir="rtl"] .twc-sidebar__collapse svg');
  });

  it("Kanban reads the computed direction rather than assuming ArrowRight means next-by-index", () => {
    expect(src("components/data-display/Kanban.jsx")).toContain('direction === "rtl"');
  });

  it("the Breadcrumb RTL flip is scoped to the built-in separator", () => {
    expect(src("components/navigation/Breadcrumb.jsx")).toContain('.twc-breadcrumb__sep[data-default-sep] svg');
  });
});

// ── #467 ─────────────────────────────────────────────────────────────────────
describe("picker triggers announce their disabled state (#467)", () => {
  it("DatePicker", () => {
    const { container } = render(<DatePicker label="Ship date" disabled />);
    const trigger = container.querySelector('[role="button"]');
    expect(trigger.getAttribute("aria-disabled")).toBe("true");
    expect(trigger.getAttribute("tabindex")).toBe("-1");
  });
  it("TimePicker", () => {
    const { container } = render(<TimePicker label="Cut-off" disabled />);
    const trigger = container.querySelector('[role="button"]');
    expect(trigger.getAttribute("aria-disabled")).toBe("true");
  });
  it("and do not claim it when enabled", () => {
    const { container } = render(<DatePicker label="Ship date" />);
    expect(container.querySelector('[role="button"]').hasAttribute("aria-disabled")).toBe(false);
  });
});

// ── #468 ─────────────────────────────────────────────────────────────────────
describe("CommandPalette groups are labelled (#468)", () => {
  const commands = [
    { id: "a", label: "Go home", group: "Navigation", onRun() {} },
    { id: "b", label: "Open button docs", group: "Components", onRun() {} },
  ];

  it("names each group from its visible heading, and the heading is presentational", () => {
    render(<CommandPalette open commands={commands} onOpenChange={() => {}} />);
    const groups = [...document.querySelectorAll('[role="group"]')];
    expect(groups.length).toBe(2);
    for (const g of groups) {
      const id = g.getAttribute("aria-labelledby");
      expect(id, "every group needs a label").toBeTruthy();
      const heading = document.getElementById(id);
      expect(heading).not.toBe(null);
      expect(["Navigation", "Components"]).toContain(heading.textContent);
      expect(heading.getAttribute("role")).toBe("presentation");
    }
  });

  it("gives the listbox its own name", () => {
    render(<CommandPalette open commands={commands} onOpenChange={() => {}} />);
    expect(document.querySelector('[role="listbox"]').getAttribute("aria-label")).toBeTruthy();
  });
});

// ── #470 ─────────────────────────────────────────────────────────────────────
describe("Currency re-clamps an uncontrolled value when precision changes (#470)", () => {
  it("drops the decimals and re-emits when the currency's precision shrinks", () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(
      <Currency label="Price" defaultValue="123.45" currency="USD" onValueChange={onValueChange} />
    );
    const input = container.querySelector("input");
    expect(input.value).toBe("123.45");
    rerender(<Currency label="Price" defaultValue="123.45" currency="JPY" onValueChange={onValueChange} />);
    expect(input.value).toBe("123");            // 123.45 is not a representable yen amount
    expect(onValueChange).toHaveBeenCalledWith(123, "123");
  });

  it("leaves the value alone when the precision is unchanged", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Currency label="Price" defaultValue="123.45" currency="USD" onValueChange={onValueChange} />
    );
    rerender(<Currency label="Price" defaultValue="123.45" currency="EUR" onValueChange={onValueChange} />);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

// ── #472 ─────────────────────────────────────────────────────────────────────
describe("useCopyToClipboard restarts its reset window (#472)", () => {
  function Probe() {
    const { copied, copy } = useCopyToClipboard(1500);
    return <button onClick={() => copy("x")}>{copied ? "Copied" : "Copy"}</button>;
  }

  it("a second copy inside the window keeps the indicator for the full delay", async () => {
    vi.useFakeTimers();
    Object.assign(navigator, { clipboard: { writeText: () => Promise.resolve() } });
    const { container } = render(<Probe />);
    const btn = container.querySelector("button");
    await act(async () => { fireEvent.click(btn); });
    expect(btn.textContent).toBe("Copied");
    await act(async () => { vi.advanceTimersByTime(1400); });
    await act(async () => { fireEvent.click(btn); });   // copy again, 100ms before the deadline
    await act(async () => { vi.advanceTimersByTime(200); });
    // the original deadline has passed; only a restarted window keeps this true
    expect(btn.textContent).toBe("Copied");
    await act(async () => { vi.advanceTimersByTime(1400); });
    expect(btn.textContent).toBe("Copy");
  });
});

// ── #466 ─────────────────────────────────────────────────────────────────────
describe("hooks return their server default on the FIRST client render (#466)", () => {
  it("useWindowSize measures only after mount", () => {
    const seen = [];
    function Probe() {
      const { width } = useWindowSize();
      seen.push(width);
      return null;
    }
    render(<Probe />);
    // render #1 must match what the server produced (0), or React discards the hydrated subtree
    expect(seen[0]).toBe(0);
    expect(seen[seen.length - 1]).toBe(window.innerWidth);
  });

  it("useWindowSize can still read eagerly when asked", () => {
    const seen = [];
    function Probe() {
      const { width } = useWindowSize({ initializeWithValue: true });
      seen.push(width);
      return null;
    }
    render(<Probe />);
    expect(seen[0]).toBe(window.innerWidth);
  });

  it("useLocalStorage returns initialValue first, then the stored value", () => {
    window.localStorage.setItem("twc-test-key", JSON.stringify("stored"));
    const seen = [];
    function Probe() {
      const [v] = useLocalStorage("twc-test-key", "initial");
      seen.push(v);
      return null;
    }
    render(<Probe />);
    expect(seen[0]).toBe("initial");
    expect(seen[seen.length - 1]).toBe("stored");
    window.localStorage.removeItem("twc-test-key");
  });
});

// #463 (review) - the first version of the clamp drove `active` to -1 on an empty list and then kept
// it there, which strands exactly the async paths this library documents.
describe("the option clamp recovers from an empty list (#463 review)", () => {
  const three = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }, { value: "c", label: "Gamma" }];

  it("MultiSelect still highlights once options arrive after mounting empty", () => {
    const { container, rerender } = render(<MultiSelect label="X" options={[]} />);
    const input = container.querySelector("input");
    fireEvent.focus(input);
    rerender(<MultiSelect label="X" options={three} />);
    const id = input.getAttribute("aria-activedescendant");
    expect(id, "activedescendant must come back once there is something to point at").toBeTruthy();
    expect(document.getElementById(id)).not.toBe(null);
  });

  it("Combobox recovers when an open list transiently empties mid-fetch", () => {
    const { container, rerender } = render(<Combobox label="X" options={three} filter={false} />);
    const input = container.querySelector("input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "ab" } });
    rerender(<Combobox label="X" options={[]} filter={false} loading />);   // fetch in flight
    rerender(<Combobox label="X" options={three} filter={false} />);        // results land
    const id = input.getAttribute("aria-activedescendant");
    expect(id).toBeTruthy();
    expect(document.getElementById(id)).not.toBe(null);
  });

  it("still clamps a too-large index when the list shrinks but stays non-empty", () => {
    const long = Array.from({ length: 12 }, (_, i) => ({ value: `o${i}`, label: `Option ${i}` }));
    const { container, rerender } = render(<Select label="X" options={long} searchable={false} />);
    const trigger = container.querySelector(".twc-sel__trigger");
    fireEvent.click(trigger);
    for (let i = 0; i < 9; i++) fireEvent.keyDown(trigger, { key: "ArrowDown" });
    rerender(<Select label="X" options={long.slice(0, 3)} searchable={false} />);
    const el = document.getElementById(trigger.getAttribute("aria-activedescendant"));
    expect(el).not.toBe(null);
    expect(el.textContent).toContain("Option 2");  // clamped to the last surviving option
  });
});
