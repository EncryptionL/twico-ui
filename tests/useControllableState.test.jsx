import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useControllableState } from "../hooks/index.js";

function Probe({ value, defaultValue, onChange }) {
  const [val, setVal] = useControllableState({ value, defaultValue, onChange });
  return (
    <button onClick={() => setVal((v) => (v ?? 0) + 1)}>val:{String(val)}</button>
  );
}

function Flag({ value, defaultValue }) {
  const [, , isControlled] = useControllableState({ value, defaultValue });
  return <span data-testid="flag">{String(isControlled)}</span>;
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

describe("useControllableState — controlledness (#179)", () => {
  it("returns isControlled as the third tuple element", () => {
    const { unmount } = render(<Flag defaultValue={0} />);
    expect(screen.getByTestId("flag")).toHaveTextContent("false");
    unmount();
    render(<Flag value={1} />);
    expect(screen.getByTestId("flag")).toHaveTextContent("true");
  });

  // NOTE: warnOnce dedupes by a module-global key, so this must be the first test
  // in the file that actually switches controlledness.
  it("warns once when a value switches controlled<->uncontrolled, then dedupes", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(<Probe defaultValue={0} />);
    expect(warn).not.toHaveBeenCalled();
    rerender(<Probe value={3} />); // uncontrolled -> controlled
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/controlled/i);
    rerender(<Probe defaultValue={0} />); // controlled -> uncontrolled: deduped
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("does not warn when controlledness is stable", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(<Probe value={5} />);
    rerender(<Probe value={6} />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
