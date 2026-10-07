import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Select } from "../components/inputs/Select.jsx";

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
