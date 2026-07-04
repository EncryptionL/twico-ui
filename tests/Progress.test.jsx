import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "../components/feedback/Progress.jsx";

describe("Progress accessible name (#159)", () => {
  it("`label` names the progressbar via aria-labelledby", () => {
    render(<Progress value={40} label="Uploading" showLabel />);
    const bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
  });

  it("forwarded aria-label names the inner track (not the wrapper)", () => {
    render(<Progress value={40} aria-label="Import" />);
    expect(screen.getByRole("progressbar", { name: "Import" })).toBeInTheDocument();
  });

  it("indeterminate has no aria-valuenow", () => {
    render(<Progress indeterminate />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
});
