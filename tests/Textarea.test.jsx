import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Textarea } from "../components/inputs/Textarea.jsx";

describe("Textarea autosize + ref (#68)", () => {
  it("forwards ref to the inner <textarea>", () => {
    const ref = React.createRef();
    render(<Textarea ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current.tagName).toBe("TEXTAREA");
  });

  it("autosize applies data-autosize and sets an inline height", () => {
    const { container } = render(<Textarea autosize minRows={2} maxRows={6} />);
    const el = container.querySelector("textarea");
    expect(el).toHaveAttribute("data-autosize", "true");
    // jsdom has no layout, but resize() ran and set a height string
    expect(el.style.height).not.toBe("");
  });

  it("without autosize, no data-autosize and rows honored", () => {
    const { container } = render(<Textarea rows={5} />);
    const el = container.querySelector("textarea");
    expect(el).not.toHaveAttribute("data-autosize");
    expect(el).toHaveAttribute("rows", "5");
  });

  it("still fires a consumer onInput when autosize wraps it", () => {
    const onInput = vi.fn();
    const { container } = render(<Textarea autosize onInput={onInput} />);
    fireEvent.input(container.querySelector("textarea"), { target: { value: "hi" } });
    expect(onInput).toHaveBeenCalled();
  });
});

describe("Textarea character counter (#69)", () => {
  it("renders and updates the count", () => {
    const { container } = render(<Textarea showCount maxLength={20} defaultValue="hey" />);
    expect(container.querySelector(".twc-field__count")).toHaveTextContent("3 / 20");
    fireEvent.change(container.querySelector("textarea"), { target: { value: "hello" } });
    expect(container.querySelector(".twc-field__count")).toHaveTextContent("5 / 20");
  });
});
