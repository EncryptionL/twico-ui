import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Select } from "../components/inputs/Select.jsx";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

describe("Select keyboard navigation", () => {
  function open(trigger) {
    act(() => trigger.focus());
    act(() => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
  }

  it("opens on ArrowDown and exposes a listbox", () => {
    render(<Select options={options} searchable={false} placeholder="Pick" />);
    const trigger = screen.getByRole("button");
    open(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("Arrow + Enter selects an option and fires onChange with its value", () => {
    const onChange = vi.fn();
    render(<Select options={options} searchable={false} onChange={onChange} />);
    const trigger = screen.getByRole("button");
    open(trigger);
    act(() => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    act(() => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("Escape begins closing the listbox (exit animation)", () => {
    render(<Select options={options} searchable={false} />);
    const trigger = screen.getByRole("button");
    open(trigger);
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("data-state", "open");
    act(() => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    // The popover stays mounted briefly for its exit animation, marked data-state="closed".
    expect(document.querySelector(".twc-pop")).toHaveAttribute("data-state", "closed");
  });
});
