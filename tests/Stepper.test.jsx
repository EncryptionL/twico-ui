import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stepper } from "../components/navigation/Stepper.jsx";

const steps = [{ title: "One" }, { title: "Two", error: true }, { title: "Three" }];

describe("Stepper a11y (#135)", () => {
  it("labeled group, aria-invalid on error, and per-step status text", () => {
    const { container } = render(<Stepper steps={steps} active={1} />);
    const root = container.querySelector(".twc-stepper");
    expect(root).toHaveAttribute("role", "group");
    expect(root).toHaveAttribute("aria-label", "Progress");
    const stepEls = container.querySelectorAll(".twc-step");
    expect(stepEls[1]).toHaveAttribute("aria-invalid", "true");
    expect(stepEls[1]).toHaveTextContent("Step 2 of 3");
    expect(stepEls[1]).toHaveTextContent("error");
    expect(stepEls[0]).toHaveTextContent("completed");
    expect(stepEls[2]).toHaveTextContent("upcoming");
  });

  it("clickable steps expose position + status in the button name", () => {
    render(<Stepper steps={[{ title: "One" }, { title: "Two" }]} active={1} clickable />);
    const btns = screen.getAllByRole("button");
    expect(btns[0]).toHaveAccessibleName(/Step 1 of 2/);
  });
});
