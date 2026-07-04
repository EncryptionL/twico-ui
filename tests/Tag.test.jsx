import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tag } from "../components/data-display/Tag.jsx";

describe("Tag remove label (#161)", () => {
  it("ties the remove button name to string children", () => {
    render(<Tag onRemove={() => {}}>React</Tag>);
    expect(screen.getByRole("button", { name: "Remove React" })).toBeInTheDocument();
  });

  it("an explicit removeLabel wins", () => {
    render(<Tag onRemove={() => {}} removeLabel="Delete tag">React</Tag>);
    expect(screen.getByRole("button", { name: "Delete tag" })).toBeInTheDocument();
  });

  it("non-string children fall back to 'Remove'", () => {
    render(
      <Tag onRemove={() => {}}>
        <svg />
      </Tag>
    );
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("clicking remove fires onRemove and stops propagation", () => {
    const onRemove = vi.fn();
    const onParent = vi.fn();
    render(
      <div onClick={onParent}>
        <Tag onRemove={onRemove}>x</Tag>
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove x" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onParent).not.toHaveBeenCalled();
  });
});
