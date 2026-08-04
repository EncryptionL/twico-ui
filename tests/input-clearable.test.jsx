import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Input } from "../components/inputs/Input.jsx";
import { Textarea } from "../components/inputs/Textarea.jsx";

// #328 — clearable (trailing X) on Input and Textarea: shown when non-empty, clears the field and fires
// onChange with the empty value (controlled + uncontrolled), composing with rightIcon / the password eye.
describe("Input clearable (#328)", () => {
  it("shows the clear X when non-empty (uncontrolled), then clears + fires onChange('')", () => {
    const onChange = vi.fn();
    const { container } = render(<Input clearable defaultValue="hello" onChange={onChange} aria-label="f" />);
    const clear = container.querySelector(".twc-input__clear");
    expect(clear).toBeTruthy();
    fireEvent.click(clear);
    expect(container.querySelector("input").value).toBe("");
    expect(onChange.mock.calls.at(-1)[0].target.value).toBe("");
  });

  it("no X when empty, or when clearable is false", () => {
    const { container: a } = render(<Input clearable defaultValue="" aria-label="f" />);
    expect(a.querySelector(".twc-input__clear")).toBeNull();
    const { container: b } = render(<Input defaultValue="x" aria-label="f" />);
    expect(b.querySelector(".twc-input__clear")).toBeNull();
  });

  it("controlled: clicking the X fires onChange with '' (parent drives the value)", () => {
    // capture the value AT dispatch — a controlled input whose parent doesn't update value gets its DOM
    // value reset by React after the event, so reading e.target.value at assertion time is unreliable.
    let captured;
    const onChange = vi.fn((e) => { captured = e.target.value; });
    const { container } = render(<Input clearable value="abc" onChange={onChange} aria-label="f" />);
    fireEvent.click(container.querySelector(".twc-input__clear"));
    expect(onChange).toHaveBeenCalled();
    expect(captured).toBe("");
  });

  it("password: the clear X and the reveal-eye toggle coexist", () => {
    const { container } = render(<Input clearable type="password" defaultValue="secret" aria-label="pw" />);
    expect(container.querySelector(".twc-input__clear")).toBeTruthy();
    expect(container.querySelector(".twc-input__reveal")).toBeTruthy();
  });

  it("rightIcon + clearable both render (rightIcon not clobbered)", () => {
    const { container } = render(<Input clearable defaultValue="x" rightIcon={<span data-testid="ri">i</span>} aria-label="f" />);
    expect(container.querySelector(".twc-input__clear")).toBeTruthy();
    expect(container.querySelector('[data-testid="ri"]')).toBeTruthy();
  });
});

describe("Textarea clearable (#328)", () => {
  it("shows + clears (uncontrolled), firing onChange('')", () => {
    const onChange = vi.fn();
    const { container } = render(<Textarea clearable defaultValue="hi there" onChange={onChange} aria-label="t" />);
    const clear = container.querySelector(".twc-textarea__clear");
    expect(clear).toBeTruthy();
    fireEvent.click(clear);
    expect(container.querySelector("textarea").value).toBe("");
    expect(onChange.mock.calls.at(-1)[0].target.value).toBe("");
  });

  it("no X when empty", () => {
    const { container } = render(<Textarea clearable defaultValue="" aria-label="t" />);
    expect(container.querySelector(".twc-textarea__clear")).toBeNull();
  });
});
