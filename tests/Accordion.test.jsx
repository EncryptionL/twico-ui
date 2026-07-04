import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Accordion } from "../components/navigation/Accordion.jsx";

const items = [
  { value: "a", label: "First", content: "one" },
  { value: "b", label: "Second", content: "two" },
  { value: "c", label: "Third", content: "three" },
];

describe("Accordion headings (#147)", () => {
  it("wraps each trigger in a heading (default level 3)", () => {
    render(<Accordion items={items} />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(3);
    headings.forEach((h) => expect(h.querySelector(".twc-accordion__trigger")).toBeTruthy());
  });

  it("respects headingLevel and per-item override", () => {
    render(
      <Accordion
        headingLevel={2}
        items={[
          { value: "a", label: "A", content: "x" },
          { value: "b", label: "B", content: "y", headingLevel: 4 },
        ]}
      />
    );
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(1);
  });
});

describe("Accordion roving focus (#146)", () => {
  it("ArrowDown/ArrowUp wrap and Home/End jump between headers", () => {
    render(<Accordion items={items} />);
    const [t0, t1, t2] = screen.getAllByRole("button");
    act(() => t0.focus());
    fireEvent.keyDown(t0, { key: "ArrowDown" });
    expect(document.activeElement).toBe(t1);
    fireEvent.keyDown(t1, { key: "ArrowUp" });
    expect(document.activeElement).toBe(t0);
    fireEvent.keyDown(t0, { key: "ArrowUp" });
    expect(document.activeElement).toBe(t2);
    fireEvent.keyDown(t2, { key: "Home" });
    expect(document.activeElement).toBe(t0);
    fireEvent.keyDown(t0, { key: "End" });
    expect(document.activeElement).toBe(t2);
  });

  it("ignores arrow keys inside a panel control", () => {
    render(
      <Accordion
        defaultOpen={["a"]}
        items={[{ value: "a", label: "A", content: <input aria-label="q" /> }]}
      />
    );
    const input = screen.getByRole("textbox");
    act(() => input.focus());
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(document.activeElement).toBe(input);
  });
});

describe("Accordion per-item disabled (#148)", () => {
  it("a disabled item cannot toggle and reflects its state", () => {
    const onOpenChange = vi.fn();
    render(
      <Accordion
        onOpenChange={onOpenChange}
        items={[
          { value: "a", label: "A", content: "x", disabled: true },
          { value: "b", label: "B", content: "y" },
        ]}
      />
    );
    const [a, b] = screen.getAllByRole("button");
    expect(a).toBeDisabled();
    expect(a).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(a);
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.click(b);
    expect(onOpenChange).toHaveBeenCalledWith(["b"]);
  });
});
