import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Input } from "../components/inputs/Input.jsx";
import { Textarea } from "../components/inputs/Textarea.jsx";
import { Currency } from "../components/inputs/Currency.jsx";
import { CurrencyField } from "../components/inputs/CurrencyField.jsx";

// #72: the whole input family must use one `${id}-desc` hint/error id, merge a
// caller aria-describedby, and force aria-invalid=true under `error`.
const cases = [
  ["Input", (p) => <Input {...p} />, "input"],
  ["Textarea", (p) => <Textarea {...p} />, "textarea"],
  ["Currency", (p) => <Currency {...p} onValueChange={() => {}} />, ".twc-cur__el"],
  ["CurrencyField", (p) => <CurrencyField {...p} onValueChange={() => {}} />, ".twc-cur__el"],
];

describe("input family aria wiring (#72)", () => {
  cases.forEach(([name, render1, sel]) => {
    it(`${name}: hint/error span id is \`\${id}-desc\``, () => {
      const { container } = render(render1({ id: "x", error: "Bad" }));
      expect(container.querySelector("#x-desc")).toHaveTextContent("Bad");
      // legacy split ids are gone
      expect(container.querySelector("#x-error")).toBeNull();
      expect(container.querySelector("#x-hint")).toBeNull();
    });

    it(`${name}: aria-describedby merges the message id + a caller id`, () => {
      const { container } = render(render1({ id: "x", error: "Bad", "aria-describedby": "extra" }));
      const db = container.querySelector(sel).getAttribute("aria-describedby");
      expect(db).toContain("x-desc");
      expect(db).toContain("extra");
    });

    it(`${name}: error forces aria-invalid=true even when caller passes false`, () => {
      const { container } = render(render1({ id: "x", error: "Bad", "aria-invalid": false }));
      expect(container.querySelector(sel)).toHaveAttribute("aria-invalid", "true");
    });

    it(`${name}: without error, a caller aria-invalid passes through`, () => {
      const { container } = render(render1({ id: "x", "aria-invalid": true }));
      expect(container.querySelector(sel)).toHaveAttribute("aria-invalid", "true");
    });
  });
});
