import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "../components/data-display/Avatar.jsx";

describe("Avatar presence a11y (#162)", () => {
  it("folds status into the accessible name", () => {
    render(<Avatar name="Jane Doe" status="online" />);
    expect(screen.getByRole("img", { name: "Jane Doe, Online" })).toBeInTheDocument();
  });

  it("statusLabel overrides the default", () => {
    render(<Avatar name="Jane" status="busy" statusLabel="In a meeting" />);
    expect(screen.getByRole("img", { name: "Jane, In a meeting" })).toBeInTheDocument();
  });

  it("no status → name only (regression)", () => {
    render(<Avatar name="Jane" />);
    expect(screen.getByRole("img", { name: "Jane" })).toBeInTheDocument();
  });

  it("the status dot carries a title tooltip", () => {
    const { container } = render(<Avatar name="Jane" status="away" />);
    expect(container.querySelector(".twc-avatar__status")).toHaveAttribute("title", "Away");
  });
});
