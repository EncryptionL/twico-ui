import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, cleanup, screen } from "@testing-library/react";
import { Select } from "../components/inputs/Select.jsx";
import { MultiSelect } from "../components/inputs/MultiSelect.jsx";

// #459 — two ARIA defects on Select's default path.
//
// 1. The trigger is a <button> and carried aria-activedescendant, which role="button" cannot own, so AT
//    discarded it. For a short list that was the ONLY announcement channel (no search field is rendered
//    at <= 5 options and the option rows are never focused), so arrowing through the list was silent.
//    The trigger is now the APG select-only combobox, a role that legally owns all four attributes.
// 2. role="listbox" sat on the popover WRAPPER, which also contained the search field (itself a
//    role="combobox") and a role="status" live region - neither is permitted list content - and the
//    input's aria-controls resolved to its own DOM ancestor. The role now sits on the options list.

afterEach(cleanup);

const THREE = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large" },
];
const SEVEN = Array.from({ length: 7 }, (_, i) => ({ value: `o${i}`, label: `Option ${i}` }));

const trigger = (c) => c.querySelector(".twc-sel__trigger");
const listbox = () => document.querySelector('[role="listbox"]');
const open = (c) => fireEvent.click(trigger(c));

describe("Select trigger role (#459)", () => {
  it("is a combobox, the role that can own aria-expanded/-controls/-activedescendant", () => {
    const { container } = render(<Select label="Size" options={THREE} />);
    expect(trigger(container).getAttribute("role")).toBe("combobox");
    expect(trigger(container).getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("points aria-activedescendant at the highlighted option for a short (search-less) list", () => {
    const { container } = render(<Select label="Size" options={THREE} />);
    open(container);
    fireEvent.keyDown(trigger(container), { key: "ArrowDown" });
    const id = trigger(container).getAttribute("aria-activedescendant");
    expect(id).toBeTruthy();
    const opt = document.getElementById(id);
    expect(opt).not.toBe(null);
    expect(opt.getAttribute("role")).toBe("option");
  });

  it("advances it with each ArrowDown", () => {
    const { container } = render(<Select label="Size" options={THREE} />);
    open(container);
    const read = () => document.getElementById(trigger(container).getAttribute("aria-activedescendant"))?.textContent;
    expect(read()).toBe("Small"); // opening already highlights the first option
    fireEvent.keyDown(trigger(container), { key: "ArrowDown" });
    expect(read()).toBe("Medium");
    fireEvent.keyDown(trigger(container), { key: "ArrowDown" });
    expect(read()).toBe("Large");
  });

  it("hands aria-activedescendant to the search input when one is rendered (focus goes there)", () => {
    const { container } = render(<Select label="Size" options={SEVEN} />);
    open(container);
    const input = document.querySelector('.twc-pop__search input');
    expect(input).not.toBe(null);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    // only the element that actually holds DOM focus may own the attribute
    expect(trigger(container).hasAttribute("aria-activedescendant")).toBe(false);
    expect(input.getAttribute("aria-activedescendant")).toBeTruthy();
  });

  it("only claims aria-controls while the listbox exists", () => {
    const { container } = render(<Select label="Size" options={THREE} />);
    expect(trigger(container).hasAttribute("aria-controls")).toBe(false);
    open(container);
    expect(document.getElementById(trigger(container).getAttribute("aria-controls"))).toBe(listbox());
  });
});

describe("Select listbox containment (#459)", () => {
  it("puts the listbox role on the options list, not on the popover wrapper", () => {
    const { container } = render(<Select label="Size" options={THREE} />);
    open(container);
    expect(listbox().classList.contains("twc-pop__list")).toBe(true);
  });

  it("keeps the search combobox and the live region out of the listbox subtree", () => {
    const { container } = render(<Select label="Size" options={SEVEN} />);
    open(container);
    expect(listbox().querySelector('[role="combobox"]')).toBe(null);
    expect(listbox().querySelector('[aria-live]')).toBe(null);
    // and both really do exist in the popover, just outside the list
    expect(document.querySelector('.twc-pop [role="combobox"]')).not.toBe(null);
    expect(document.querySelector('.twc-pop [aria-live]')).not.toBe(null);
  });

  it("gives the search input an aria-controls that is not its own ancestor", () => {
    const { container } = render(<Select label="Size" options={SEVEN} />);
    open(container);
    const input = document.querySelector('.twc-pop__search input');
    const controlled = document.getElementById(input.getAttribute("aria-controls"));
    expect(controlled).toBe(listbox());
    expect(controlled.contains(input)).toBe(false);
  });

  it("owns only options and group labels", () => {
    const { container } = render(<Select label="Size" options={THREE} />);
    open(container);
    const roles = [...listbox().querySelectorAll("[role]")].map((el) => el.getAttribute("role"));
    expect(new Set(roles)).toEqual(new Set(["option"]));
  });
});

// #459 (review) - the accessible-name fallback must never OUTRANK a name the consumer already gave.
// accname resolves aria-label (2C) before a host-language <label> (2D), and <button> is labelable, so
// stamping aria-label unconditionally renamed correctly-labelled controls to the placeholder - a WCAG
// 2.5.3 Label in Name failure. It broke a real call site: Datatable's Combine panel wraps its Select
// in <label><span>Layout</span>...</label>.
describe("Select accessible name never overrides a consumer's own (#459 review)", () => {
  it("keeps the name from a wrapping <label>", () => {
    render(
      <label>
        <span>Layout</span>
        <Select options={THREE} />
      </label>
    );
    expect(screen.getByRole("combobox", { name: /Layout/ })).toBeInTheDocument();
  });

  it("keeps the name from a <label htmlFor>", () => {
    render(
      <>
        <label htmlFor="ship">Ship date</label>
        <Select id="ship" options={THREE} />
      </>
    );
    expect(screen.getByRole("combobox", { name: /Ship date/ })).toBeInTheDocument();
  });

  it("still falls back to the placeholder when nothing names it", () => {
    const { container } = render(<Select options={THREE} placeholder="Choose a size" />);
    expect(container.querySelector(".twc-sel__trigger").getAttribute("aria-label")).toBe("Choose a size");
  });

  it("prefers the component's own label prop over the fallback", () => {
    render(<Select label="Size" options={THREE} />);
    expect(screen.getByRole("combobox", { name: /Size/ })).toBeInTheDocument();
  });

  it("picks up a <label> that mounts AFTER the Select (the one-shot-probe bug)", () => {
    function Host({ withLabel }) {
      return (
        <>
          {withLabel ? <label htmlFor="country">Country</label> : null}
          <Select id="country" options={THREE} placeholder="Choose" />
        </>
      );
    }
    const { container, rerender } = render(<Host withLabel={false} />);
    const trigger = container.querySelector(".twc-sel__trigger");
    expect(trigger.getAttribute("aria-label")).toBe("Choose");   // nothing names it yet
    rerender(<Host withLabel />);                                // a server-driven schema arrives
    expect(trigger.hasAttribute("aria-label"), "the fallback must stand down for the real label").toBe(false);
    expect(screen.getByRole("combobox", { name: /Country/ })).toBeInTheDocument();
  });

  it("re-arms the fallback if the label goes away again", () => {
    function Host({ withLabel }) {
      return (
        <>
          {withLabel ? <label htmlFor="country">Country</label> : null}
          <Select id="country" options={THREE} placeholder="Choose" />
        </>
      );
    }
    const { container, rerender } = render(<Host withLabel />);
    const trigger = container.querySelector(".twc-sel__trigger");
    expect(trigger.hasAttribute("aria-label")).toBe(false);
    rerender(<Host withLabel={false} />);
    expect(trigger.getAttribute("aria-label")).toBe("Choose");
  });

  it("lets a consumer aria-label win", () => {
    const { container } = render(<Select options={THREE} aria-label="Pick one" placeholder="Choose" />);
    expect(container.querySelector(".twc-sel__trigger").getAttribute("aria-label")).toBe("Pick one");
  });
});

// #459 (review 2) - the sibling case. MultiSelect's input is a role="combobox" whose ONLY name source
// is its placeholder, and the placeholder is blanked the moment a chip exists. In-repo failure:
// Datatable's pivot panel captions are plain <span>s, so those pickers went unnamed once used.
describe("MultiSelect keeps an accessible name once it has a value (#459 review 2)", () => {
  const OPTS = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }];

  it("is named even after a selection blanks the placeholder", () => {
    const { container } = render(<MultiSelect options={OPTS} value={["a"]} placeholder="Add row fields" />);
    const input = container.querySelector(".twc-ms__input");
    expect(input.getAttribute("placeholder")).toBe("");       // the chip blanked it
    expect(input.getAttribute("aria-label")).toBe("Add row fields");
  });

  it("defers to the component's own label", () => {
    render(<MultiSelect label="Row fields" options={OPTS} value={["a"]} placeholder="Add row fields" />);
    expect(screen.getByRole("combobox", { name: /Row fields/ })).toBeInTheDocument();
  });

  it("defers to a consumer aria-label", () => {
    const { container } = render(
      <MultiSelect options={OPTS} value={["a"]} placeholder="Add" aria-label="Pick fields" />
    );
    expect(container.querySelector(".twc-ms__input").getAttribute("aria-label")).toBe("Pick fields");
  });

  it("defers to a wrapping <label> while that label still labels the input", () => {
    // With no chips the input is the first labelable descendant, so the <label> names it.
    render(
      <label>
        <span>Rows</span>
        <MultiSelect options={OPTS} placeholder="Add" />
      </label>
    );
    expect(screen.getByRole("combobox", { name: /Rows/ })).toBeInTheDocument();
  });

  it("falls back once a chip button becomes the wrapping label's target", () => {
    // A wrapping <label> labels only its FIRST labelable descendant. MultiSelect renders chip
    // remove-buttons before the input, so with a selection the label names a CHIP and the combobox
    // would otherwise be left unnamed - which is exactly when the fallback has to step in. This is
    // why the probe asks el.labels rather than hand-rolling a closest("label") check.
    const { container } = render(
      <label>
        <span>Rows</span>
        <MultiSelect options={OPTS} value={["a"]} placeholder="Add" />
      </label>
    );
    const input = container.querySelector(".twc-ms__input");
    expect(input.labels.length, "the label has moved to the chip").toBe(0);
    expect(input.getAttribute("aria-label")).toBe("Add");
  });
});
