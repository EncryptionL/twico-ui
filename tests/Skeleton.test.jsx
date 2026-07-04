import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "../components/feedback/Skeleton.jsx";

describe("Skeleton a11y (#164)", () => {
  it("a single-line placeholder is aria-hidden by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector(".twc-skeleton")).toHaveAttribute("aria-hidden", "true");
  });

  it("the multi-line group is aria-hidden", () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.querySelector(".twc-skeleton__group")).toHaveAttribute("aria-hidden", "true");
  });

  it("a consumer aria-hidden overrides the default", () => {
    const { container } = render(<Skeleton aria-hidden={false} />);
    expect(container.querySelector(".twc-skeleton")).toHaveAttribute("aria-hidden", "false");
  });

  it("`label` announces loading via role=status + aria-busy + hidden text", () => {
    render(<Skeleton label="Loading" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).not.toHaveAttribute("aria-hidden");
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });
});
