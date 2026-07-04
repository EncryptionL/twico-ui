import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../components/inputs/Input.jsx";

describe("Input character counter (#69)", () => {
  it("renders current/max and updates uncontrolled", () => {
    const { container } = render(<Input showCount maxLength={10} defaultValue="abc" />);
    const counter = container.querySelector(".twc-field__count");
    expect(counter).toHaveTextContent("3 / 10");
    expect(counter).toHaveAttribute("aria-live", "polite");
    fireEvent.change(container.querySelector("input"), { target: { value: "abcdef" } });
    expect(container.querySelector(".twc-field__count")).toHaveTextContent("6 / 10");
  });

  it("follows a controlled value", () => {
    const { container, rerender } = render(<Input showCount maxLength={10} value="ab" onChange={() => {}} />);
    expect(container.querySelector(".twc-field__count")).toHaveTextContent("2 / 10");
    rerender(<Input showCount maxLength={10} value="abcd" onChange={() => {}} />);
    expect(container.querySelector(".twc-field__count")).toHaveTextContent("4 / 10");
  });

  it("marks data-danger at ≥90% of the limit", () => {
    const { container } = render(<Input showCount maxLength={10} defaultValue="123456789" />);
    expect(container.querySelector(".twc-field__count")).toHaveAttribute("data-danger", "true");
  });

  it("no counter without maxLength, or when showCount is false", () => {
    const { container, rerender } = render(<Input showCount defaultValue="x" />);
    expect(container.querySelector(".twc-field__count")).toBeNull();
    rerender(<Input maxLength={10} defaultValue="x" />);
    expect(container.querySelector(".twc-field__count")).toBeNull();
  });

  it("still calls a consumer onChange", () => {
    const onChange = vi.fn();
    const { container } = render(<Input showCount maxLength={10} onChange={onChange} />);
    fireEvent.change(container.querySelector("input"), { target: { value: "z" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("counter id is in the input's aria-describedby", () => {
    const { container } = render(<Input id="i" showCount maxLength={10} defaultValue="a" />);
    expect(container.querySelector("input").getAttribute("aria-describedby")).toContain("i-count");
  });
});

describe("Input bordered addons (#70)", () => {
  it("renders leading/trailing bordered addons", () => {
    const { container } = render(<Input leftAddon="https://" rightAddon={<span>kg</span>} />);
    expect(container.querySelector(".twc-input__addon--start")).toHaveTextContent("https://");
    expect(container.querySelector(".twc-input__addon--end")).toHaveTextContent("kg");
  });

  it("an addon and a leftIcon coexist (addon outermost)", () => {
    const { container } = render(<Input leftAddon="@" leftIcon={<svg />} />);
    const input = container.querySelector(".twc-input");
    expect(input.querySelector(".twc-input__addon--start")).not.toBeNull();
    expect(input.querySelector(".twc-input__affix")).not.toBeNull();
  });
});
