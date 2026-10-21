import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import * as TW from "../src/index.ts";

// #490 — the agreement check that would have caught #488 before it shipped.
//
// On React 19 `ref` is an ordinary prop, so ANY plain function component that spreads `{...rest}`
// onto a host element forwards a ref implicitly, without naming it. On React 18 the same code
// forwards nothing and React logs "Function components cannot be given refs". Peers are
// `react >= 18`, so both halves are supported and a type that denies `ref` is wrong on one of them.
//
// #488 was found by hand after a consumer hit it. The detector used there was the string `rest.ref`,
// which only finds the EXPLICIT case and certified a surface that was not clean. The honest detector
// is behavioural: render the thing with a ref and see where it lands.
//
// This test does NOT demand that every component forward a ref. It demands that the components we
// have DECIDED should forward one actually do, and keep their declaration. The large remaining set
// that forwards implicitly is a known gap, tracked in #490 and listed in docs/prop-conventions.md.

afterEach(cleanup);

/** Components converted in #488/#490, with the element each must land on. */
const MUST_FORWARD = {
  Input: "INPUT",
  Textarea: "TEXTAREA",
  Button: "BUTTON",
  IconButton: "BUTTON",
  Checkbox: "INPUT",
  Switch: "INPUT",
  Radio: "INPUT",
  Select: "BUTTON",
  Combobox: "INPUT",
  MultiSelect: "INPUT",
  Code: "CODE",
};

/** Minimal props so each renders; deliberately not `children` on a void element. */
const PROPS = {
  Input: { label: "L" },
  Textarea: { label: "L" },
  Button: { children: "Go" },
  IconButton: { "aria-label": "Go", children: "x" },
  Checkbox: { label: "L" },
  Switch: { label: "L" },
  Radio: { label: "L", name: "g", value: "a" },
  Select: { label: "L", options: [{ label: "a", value: "a" }] },
  Combobox: { label: "L", options: [{ label: "a", value: "a" }] },
  MultiSelect: { label: "L", options: [{ label: "a", value: "a" }] },
  Code: { children: "x" },
};

describe("ref contract (#490)", () => {
  for (const [name, tag] of Object.entries(MUST_FORWARD)) {
    it(`${name} forwards its ref to a <${tag.toLowerCase()}>`, () => {
      const C = TW[name];
      expect(C, `${name} is not exported from the barrel`).toBeTruthy();
      const ref = React.createRef();
      render(React.createElement(C, { ...PROPS[name], ref }));
      expect(ref.current, `${name} did not attach the ref`).toBeTruthy();
      expect(ref.current.tagName).toBe(tag);
    });
  }

  it("each is a real forwardRef, not React 19's implicit pass-through", () => {
    // The distinction that matters: an implicit pass-through evaporates on React 18. A forwardRef
    // object has $$typeof react.forward_ref and a `render` function; a plain function does not.
    const notForwardRef = Object.keys(MUST_FORWARD).filter((n) => {
      const C = TW[n];
      return !(C && typeof C === "object" && typeof C.render === "function");
    });
    expect(notForwardRef, "these would forward only on React 19").toEqual([]);
  });

  it("each declares the ref in its .d.ts, so TypeScript consumers can pass one", () => {
    const dts = {};
    (function walk(d) {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".d.ts")) dts[e.name.replace(/\.d\.ts$/, "")] = p;
      }
    })(join(process.cwd(), "components"));

    // NOTE: a bare /ref\?:/ also matches `href?:`, which is why the lookbehind is here. The first
    // version of the #490 audit used the loose pattern and mis-classified seven components.
    const DECLARES = /ForwardRefExoticComponent|RefAttributes|PolymorphicComponent|(?<![A-Za-z])ref\?\s*:/;
    const undeclared = Object.keys(MUST_FORWARD).filter((n) => {
      const p = dts[n];
      return !p || !DECLARES.test(readFileSync(p, "utf8"));
    });
    expect(undeclared, "runtime forwards a ref but the type denies it - this is #488").toEqual([]);
  });

  it("none of them reintroduces a module-scope displayName or loses /*#__PURE__*/", () => {
    // Converting to forwardRef is exactly when both regressions get introduced (#489).
    const files = {};
    (function walk(d) {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".jsx")) files[e.name.replace(/\.jsx$/, "")] = p;
      }
    })(join(process.cwd(), "components"));

    const bad = [];
    for (const n of Object.keys(MUST_FORWARD)) {
      const p = files[n];
      if (!p) continue;
      const src = readFileSync(p, "utf8");
      if (!new RegExp(`export const ${n} = /\\*#__PURE__\\*/ React\\.forwardRef\\(`).test(src)) {
        bad.push(`${n}: missing /*#__PURE__*/`);
      }
      if (new RegExp(`^${n}\\.displayName\\s*=`, "m").test(src)) bad.push(`${n}: module-scope displayName`);
    }
    expect(bad).toEqual([]);
  });
});
