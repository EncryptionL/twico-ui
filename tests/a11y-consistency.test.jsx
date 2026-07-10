import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Carousel } from "../components/data-display/Carousel.jsx";
import { Button } from "../components/buttons/Button.jsx";
import { Tabs } from "../components/navigation/Tabs.jsx";
import { Accordion } from "../components/navigation/Accordion.jsx";
import { Toast } from "../components/feedback/Toast.jsx";
import { Checkbox } from "../components/inputs/Checkbox.jsx";
import { Radio } from "../components/inputs/Radio.jsx";
import { Switch } from "../components/inputs/Switch.jsx";

const allCss = () =>
  Array.from(document.querySelectorAll("style")).map((s) => s.textContent || "").join("\n");

// #217 — Carousel dots convey the active slide to AT, not just visually.
describe("Carousel active dot exposes aria-current (#217)", () => {
  it("sets aria-current='true' on the active dot only", () => {
    const { container } = render(
      <Carousel label="c"><div>1</div><div>2</div><div>3</div></Carousel>,
    );
    const dots = Array.from(container.querySelectorAll(".twc-carousel__dot"));
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[1]).not.toHaveAttribute("aria-current");
    expect(dots[2]).not.toHaveAttribute("aria-current");
  });
});

// #218 — animated components collapse their motion under prefers-reduced-motion (WCAG 2.3.3).
// jsdom can't evaluate @media, so assert each component ships a reduce-guard for its animated
// class. (Guards live at the end of each CSS string with no intervening @-rule, so the class
// falls inside the [^@]* window after the media query.)
describe("prefers-reduced-motion guards (#218)", () => {
  const cases = [
    ["Button ripple", <Button>x</Button>, "twc-ripple"],
    ["Tabs indicator", <Tabs items={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />, "twc-tabs__indicator"],
    ["Accordion panel", <Accordion items={[{ value: "a", label: "A", content: "C" }]} />, "twc-accordion__panel"],
    ["Carousel track", <Carousel label="c"><div>1</div><div>2</div></Carousel>, "twc-carousel__track"],
    ["Toast slide-in", <Toast title="Hi" />, "twc-toast"],
  ];
  it.each(cases)("%s carries a reduced-motion guard for its animated class", (_n, node, cls) => {
    render(node);
    const css = allCss();
    expect(new RegExp(`@media \\(prefers-reduced-motion: reduce\\)[^@]*${cls}`).test(css)).toBe(true);
  });
});

// #219 — Checkbox/Radio/Switch render the required asterisk like every other labeled control.
describe("required asterisk on toggle controls (#219)", () => {
  const controls = [["Checkbox", Checkbox], ["Radio", Radio], ["Switch", Switch]];
  it.each(controls)("%s shows an asterisk + aria-required when required with a label", (_n, C) => {
    const { container } = render(<C label="Name" required />);
    const req = container.querySelector(".twc-field__req");
    expect(req).not.toBeNull();
    expect(req).toHaveTextContent("*");
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("aria-required", "true");
  });
  it.each(controls)("%s shows no asterisk when not required", (_n, C) => {
    const { container } = render(<C label="Name" />);
    expect(container.querySelector(".twc-field__req")).toBeNull();
  });
  it.each(controls)("%s shows no asterisk without a visible label", (_n, C) => {
    const { container } = render(<C required aria-label="Name" />);
    expect(container.querySelector(".twc-field__req")).toBeNull();
  });
});
