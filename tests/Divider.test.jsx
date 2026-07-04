import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Divider } from "../components/layout/Divider.jsx";

describe("Divider orientation (#151)", () => {
  it("plain divider is a horizontal separator (regression)", () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector("hr.twc-divider");
    expect(hr).toHaveAttribute("data-orientation", "horizontal");
    expect(hr).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("labeled divider exposes orientation semantics (default horizontal)", () => {
    const { container } = render(<Divider>OR</Divider>);
    const el = container.querySelector(".twc-divider-label");
    expect(el).toHaveAttribute("role", "separator");
    expect(el).toHaveAttribute("data-orientation", "horizontal");
    expect(el).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("a vertical labeled divider reflects orientation (the bug fix)", () => {
    const { container } = render(<Divider orientation="vertical">OR</Divider>);
    const el = container.querySelector(".twc-divider-label");
    expect(el).toHaveAttribute("data-orientation", "vertical");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  it("physical align aliases resolve to logical start/end", () => {
    const { container, rerender } = render(<Divider align="left">x</Divider>);
    expect(container.querySelector(".twc-divider-label")).toHaveAttribute("data-align", "start");
    rerender(<Divider align="right">x</Divider>);
    expect(container.querySelector(".twc-divider-label")).toHaveAttribute("data-align", "end");
  });
});
