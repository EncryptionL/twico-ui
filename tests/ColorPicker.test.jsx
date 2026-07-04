import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ColorPicker } from "../components/inputs/ColorPicker.jsx";

function open(container) {
  const trigger = container.querySelector(".twc-cp__trigger");
  trigger.focus();
  fireEvent.click(trigger);
}

describe("ColorPicker alpha (#106)", () => {
  it("no alpha slider by default; onChange stays 6-digit", () => {
    const onChange = vi.fn();
    const { container } = render(<ColorPicker value="#ff0000" alpha={false} onChange={onChange} />);
    open(container);
    expect(document.querySelector(".twc-cp__alpha")).toBeNull();
    fireEvent.keyDown(document.querySelector('[aria-label="Hue"]'), { key: "Home" });
    expect(onChange.mock.calls.at(-1)[0]).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("alpha shows an Alpha slider and emits 8-digit #RRGGBBAA", () => {
    const onChange = vi.fn();
    const { container } = render(<ColorPicker value="#ff0000ff" alpha onChange={onChange} />);
    open(container);
    const slider = document.querySelector('[aria-label="Alpha"]');
    expect(slider).toBeInTheDocument();
    fireEvent.keyDown(slider, { key: "ArrowLeft" }); // reduce alpha
    expect(onChange.mock.calls.at(-1)[0]).toMatch(/^#[0-9a-f]{8}$/i);
  });

  it("hex input accepts #RGB shorthand", () => {
    const onChange = vi.fn();
    const { container } = render(<ColorPicker value="#123456" onChange={onChange} />);
    open(container);
    const input = document.querySelector(".twc-cp__hex");
    fireEvent.change(input, { target: { value: "#f00" } });
    // #f00 is a valid shorthand → not flagged invalid
    expect(document.querySelector(".twc-cp__hex")).not.toHaveAttribute("data-invalid");
  });

  it("alpha value parses from an 8-digit hex to the slider position", () => {
    const { container } = render(<ColorPicker value="#00000080" alpha onChange={() => {}} />);
    open(container);
    const slider = document.querySelector('[aria-label="Alpha"]');
    expect(Number(slider.getAttribute("aria-valuenow"))).toBe(50); // 0x80/0xff ≈ 50%
  });
});
