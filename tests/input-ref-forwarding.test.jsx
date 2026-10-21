import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Input } from "../components/inputs/Input.jsx";
import { Textarea } from "../components/inputs/Textarea.jsx";

// #488 — Input honoured a caller's `ref` at runtime but its public type omitted it, so
// `<Input ref={...} />` was a compile error while the sibling Textarea worked. Worse, the runtime
// support was only half-real: it read `rest.ref`, which React 19 passes through as an ordinary prop
// but React 18 strips out of props for a plain function component. With peers at `react >= 18` that
// made it a silent no-op on half the supported range, with React logging "Function components cannot
// be given refs". forwardRef works on both, and matches Textarea.
//
// The use case is anything that touches the caret - insert-at-cursor, a custom autocomplete,
// select-all, restoring the caret after a controlled rewrite - all of which need selectionStart /
// setSelectionRange on the native element.

afterEach(cleanup);

describe("Input forwards its ref (#488)", () => {
  it("gives an object ref the native <input>", () => {
    const ref = React.createRef();
    const { container } = render(<Input label="Name" defaultValue="hello" ref={ref} />);
    expect(ref.current).not.toBe(null);
    expect(ref.current.tagName).toBe("INPUT");
    expect(ref.current).toBe(container.querySelector("input.twc-input__el"));
  });

  it("calls a callback ref with the native <input>, and with null on unmount", () => {
    const seen = [];
    const { unmount } = render(<Input label="Name" ref={(n) => seen.push(n)} />);
    expect(seen.filter(Boolean).every((n) => n.tagName === "INPUT")).toBe(true);
    expect(seen.filter(Boolean).length).toBeGreaterThan(0);
    unmount();
    expect(seen[seen.length - 1], "the last call on unmount must be null").toBe(null);
  });

  it("exposes the caret API the issue was actually blocked on", () => {
    const ref = React.createRef();
    render(<Input label="Template" defaultValue="hello world" ref={ref} />);
    ref.current.setSelectionRange(5, 5);
    expect(ref.current.selectionStart).toBe(5);
    // insert-at-cursor, the motivating example
    const { selectionStart: at, value } = ref.current;
    expect(value.slice(0, at) + "{{token}}" + value.slice(at)).toBe("hello{{token}} world");
  });

  it("the caller's ref survives `clearable`, which has its own internal ref", () => {
    // The merge is the reason this is not a one-line forward: clearable keeps an internal ref to
    // drive the native value setter, and must not clobber the caller's.
    const ref = React.createRef();
    const { container } = render(<Input label="Q" defaultValue="abc" clearable ref={ref} />);
    expect(ref.current.tagName).toBe("INPUT");
    const clear = container.querySelector(".twc-input__clear");
    expect(clear, "clearable should render its X while non-empty").not.toBe(null);
    fireEvent.click(clear);
    expect(container.querySelector("input.twc-input__el").value).toBe("");
    // still the same live node afterwards
    expect(ref.current).toBe(container.querySelector("input.twc-input__el"));
  });

  it("does not read `rest.ref`, the React-19-only path it used to rely on", () => {
    // A regression here would compile, pass a React 19 test run, and silently do nothing on React 18
    // - which is exactly how the original defect survived. Assert the source, since the test
    // environment only exercises one React major.
    const src = readFileSync(resolve(process.cwd(), "components/inputs/Input.jsx"), "utf8");
    expect(src).toContain("React.forwardRef(function Input(");
    // Strip comments first: the comment recording this fix names `rest.ref` on purpose, and an
    // assertion that its own explanation trips is a guard that can only be satisfied by silence.
    const code = src.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(code, "rest.ref is stripped by React 18 and must not be the source of the ref").not.toMatch(
      /\brest\.ref\b/
    );
  });

  it("matches how Textarea is declared, which is what the issue asked for", () => {
    const dts = readFileSync(resolve(process.cwd(), "components/inputs/Input.d.ts"), "utf8");
    expect(dts).toMatch(/export declare const Input:\s*React\.ForwardRefExoticComponent</);
    expect(dts).toMatch(/InputProps\s*&\s*React\.RefAttributes<HTMLInputElement>/);
    expect(dts, "no stale plain-function declaration left behind").not.toMatch(
      /export function Input\(/
    );
    // and the sibling still is what it was
    const tdts = readFileSync(resolve(process.cwd(), "components/inputs/Textarea.d.ts"), "utf8");
    expect(tdts).toMatch(/ForwardRefExoticComponent/);
  });

  it("still renders and behaves with no ref passed at all", () => {
    const { container } = render(<Input label="Plain" hint="h" showCount maxLength={10} />);
    const el = container.querySelector("input.twc-input__el");
    expect(el).not.toBe(null);
    fireEvent.change(el, { target: { value: "abcd" } });
    expect(container.querySelector(".twc-field__count").textContent.replace(/\s/g, "")).toBe("4/10");
  });

  it("Textarea's ref still works, so the two siblings now agree", () => {
    const ref = React.createRef();
    render(<Textarea label="Notes" ref={ref} />);
    expect(ref.current.tagName).toBe("TEXTAREA");
  });
});
