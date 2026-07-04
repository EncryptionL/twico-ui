import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs } from "../components/navigation/Tabs.jsx";

describe("Tabs count pill (#171)", () => {
  it("renders string and 0 counts, hides undefined", () => {
    const { container, rerender } = render(<Tabs items={[{ value: "a", label: "A", count: "99+" }]} />);
    expect(container.querySelector(".twc-tab__count")).toHaveTextContent("99+");
    rerender(<Tabs items={[{ value: "a", label: "A", count: 0 }]} />);
    expect(container.querySelector(".twc-tab__count")).toHaveTextContent("0");
    rerender(<Tabs items={[{ value: "a", label: "A" }]} />);
    expect(container.querySelector(".twc-tab__count")).toBeNull();
  });
});

describe("Tabs disabled (#137)", () => {
  it("a disabled tab can't be clicked and is aria-disabled", () => {
    const onChange = vi.fn();
    render(<Tabs onChange={onChange} defaultValue="a" items={[{ value: "a", label: "A" }, { value: "b", label: "B", disabled: true }]} />);
    const b = screen.getByRole("tab", { name: "B" });
    expect(b).toHaveAttribute("aria-disabled", "true");
    expect(b).toBeDisabled();
    fireEvent.click(b);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("ArrowRight skips over a disabled tab", () => {
    const onChange = vi.fn();
    render(<Tabs onChange={onChange} defaultValue="a" items={[{ value: "a", label: "A" }, { value: "b", label: "B", disabled: true }, { value: "c", label: "C" }]} />);
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("c");
  });

  it("Home/End land on the first/last ENABLED tab", () => {
    const onChange = vi.fn();
    render(<Tabs onChange={onChange} defaultValue="c" items={[{ value: "a", label: "A", disabled: true }, { value: "b", label: "B" }, { value: "c", label: "C", disabled: true }]} />);
    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("b");
    fireEvent.keyDown(list, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("b");
  });

  it("an all-disabled list ignores keys", () => {
    const onChange = vi.fn();
    render(<Tabs onChange={onChange} items={[{ value: "a", label: "A", disabled: true }, { value: "b", label: "B", disabled: true }]} />);
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("Tabs overflow scroll (#136)", () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });
  const items = Array.from({ length: 6 }, (_, i) => ({ value: `t${i}`, label: `Tab ${i}` }));

  it("scrolls the active tab into view on value change (horizontal)", () => {
    const { rerender } = render(<Tabs items={items} value="t0" />);
    HTMLElement.prototype.scrollIntoView.mockClear();
    rerender(<Tabs items={items} value="t5" />);
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it("does not scroll for vertical orientation", () => {
    const { rerender } = render(<Tabs orientation="vertical" items={items} value="t0" />);
    HTMLElement.prototype.scrollIntoView.mockClear();
    rerender(<Tabs orientation="vertical" items={items} value="t5" />);
    expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
