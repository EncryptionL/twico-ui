import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Slider } from "../components/inputs/Slider.jsx";

const now = (el) => Number(el.getAttribute("aria-valuenow"));

describe("Slider value clamping (#75)", () => {
  it("clamps an out-of-range default/value into [min, max]", () => {
    const { rerender } = render(<Slider min={10} max={100} />);
    expect(now(screen.getByRole("slider"))).toBe(10);
    expect(screen.getByRole("slider").style.left).toBe("0%");
    rerender(<Slider min={10} max={100} value={5} onChange={() => {}} />);
    expect(now(screen.getByRole("slider"))).toBe(10);
    rerender(<Slider min={10} max={100} value={200} onChange={() => {}} />);
    expect(now(screen.getByRole("slider"))).toBe(100);
  });
});

describe("Slider PageUp/PageDown (#80)", () => {
  it("jumps by ~10% of range by default and by pageStep when set", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Slider min={0} max={100} step={1} value={50} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "PageUp" });
    expect(onChange).toHaveBeenLastCalledWith(60);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "PageDown" });
    expect(onChange).toHaveBeenLastCalledWith(40);
    rerender(<Slider min={0} max={100} step={1} value={50} pageStep={25} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "PageUp" });
    expect(onChange).toHaveBeenLastCalledWith(75);
  });
});

describe("Slider aria-valuetext (#81/#84)", () => {
  it("getAriaValueText populates aria-valuetext for a node formatValue", () => {
    render(<Slider value={1} min={0} max={2} onChange={() => {}} formatValue={(v) => <b>{["Low", "Med", "High"][v]}</b>} getAriaValueText={(v) => ["Low", "Med", "High"][v]} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "Med");
  });
  it("a node formatValue with no getAriaValueText leaves valuetext unset", () => {
    render(<Slider value={1} min={0} max={2} onChange={() => {}} formatValue={(v) => <b>{v}</b>} />);
    expect(screen.getByRole("slider")).not.toHaveAttribute("aria-valuetext");
  });
  it("precision drives the display and aria-valuetext", () => {
    render(<Slider step={0.1} value={1.5} onChange={() => {}} showValue />);
    expect(document.querySelector(".twc-slider__value").textContent).toBe("1.5");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "1.5");
  });
});

describe("Slider form submission (#82)", () => {
  it("renders a hidden input that carries the value in FormData", () => {
    const { container } = render(
      <form><Slider name="vol" value={30} onChange={() => {}} /></form>
    );
    const form = container.querySelector("form");
    expect(new FormData(form).get("vol")).toBe("30");
  });
  it("no hidden input without a name", () => {
    const { container } = render(<Slider value={30} onChange={() => {}} />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });
});

describe("Slider range mode (#86)", () => {
  it("renders two thumbs from a tuple value", () => {
    render(<Slider value={[20, 60]} onChange={() => {}} />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(now(thumbs[0])).toBe(20);
    expect(now(thumbs[1])).toBe(60);
  });

  it("each thumb is bounded by the other", () => {
    render(<Slider value={[20, 60]} onChange={() => {}} />);
    const [lo, hi] = screen.getAllByRole("slider");
    expect(Number(lo.getAttribute("aria-valuemax"))).toBe(60);
    expect(Number(hi.getAttribute("aria-valuemin"))).toBe(20);
  });

  it("cross-clamps: moving the lower thumb past the upper stops at the upper", () => {
    const onChange = vi.fn();
    render(<Slider value={[59, 60]} onChange={onChange} />);
    const [lo] = screen.getAllByRole("slider");
    fireEvent.keyDown(lo, { key: "PageUp" }); // +10 → 69, clamped to 60
    expect(onChange).toHaveBeenLastCalledWith([60, 60]);
  });

  it("uncontrolled range via defaultValue", () => {
    render(<Slider defaultValue={[10, 90]} />);
    const thumbs = screen.getAllByRole("slider");
    expect(now(thumbs[0])).toBe(10);
    expect(now(thumbs[1])).toBe(90);
  });

  it("single-number mode is unchanged (one thumb)", () => {
    render(<Slider value={40} onChange={() => {}} />);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
  });
});
