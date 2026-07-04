import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Field } from "../components/inputs/Field.jsx";

describe("Field auto-wires aria onto a single element child (#71)", () => {
  it("sets aria-invalid + aria-describedby (=`${id}-desc`) under error", () => {
    const { container } = render(
      <Field id="f" error="Required"><input /></Field>
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "f-desc");
    expect(container.querySelector("#f-desc")).toHaveTextContent("Required");
  });

  it("hint-only wires describedby but not aria-invalid", () => {
    const { container } = render(<Field id="f" hint="Optional"><input /></Field>);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-describedby", "f-desc");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("merges an existing child aria-describedby", () => {
    const { container } = render(
      <Field id="f" error="bad"><input aria-describedby="x" /></Field>
    );
    expect(container.querySelector("input").getAttribute("aria-describedby")).toBe("x f-desc");
  });

  it("never clobbers a child's explicit aria-invalid={false}", () => {
    const { container } = render(
      <Field id="f" error="bad"><input aria-invalid={false} /></Field>
    );
    expect(container.querySelector("input")).toHaveAttribute("aria-invalid", "false");
  });

  it("no message → no aria-describedby injected", () => {
    const { container } = render(<Field id="f"><input /></Field>);
    expect(container.querySelector("input")).not.toHaveAttribute("aria-describedby");
  });

  it("multiple children render without cloning/throwing", () => {
    const { container } = render(
      <Field id="f" error="bad"><input /><input /></Field>
    );
    expect(container.querySelectorAll("input")).toHaveLength(2);
    // not wired (multi-child falls through)
    expect(container.querySelectorAll("input")[0]).not.toHaveAttribute("aria-invalid");
  });
});
