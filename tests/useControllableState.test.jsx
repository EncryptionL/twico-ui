import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useControllableState } from "../hooks/index.js";

function Probe({ value, defaultValue, onChange }) {
  const [val, setVal] = useControllableState({ value, defaultValue, onChange });
  return (
    <button onClick={() => setVal((v) => (v ?? 0) + 1)}>val:{String(val)}</button>
  );
}

describe("useControllableState", () => {
  it("uncontrolled: updates internal state and reports via onChange", () => {
    const onChange = vi.fn();
    render(<Probe defaultValue={1} onChange={onChange} />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent("val:1");
    act(() => btn.click());
    expect(btn).toHaveTextContent("val:2");
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("controlled: does NOT change internal value, only calls onChange (parent owns it)", () => {
    const onChange = vi.fn();
    render(<Probe value={5} onChange={onChange} />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent("val:5");
    act(() => btn.click());
    // value prop is fixed at 5; the component stays 5 until the parent re-renders
    expect(btn).toHaveTextContent("val:5");
    expect(onChange).toHaveBeenCalledWith(6);
  });
});
