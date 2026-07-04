import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../components/navigation/Navbar.jsx";

describe("Navbar hamburger (#141)", () => {
  // The hamburger is display:none by default (shown via a mobile media query), so it's
  // "inaccessible" in jsdom — query it directly rather than by role.
  it("reflects menuOpen in aria-expanded and the accessible name", () => {
    const { container, rerender } = render(<Navbar onMenuClick={() => {}} menuOpen={false} menuControls="drawer1" />);
    let btn = container.querySelector(".twc-navbar__menu-btn");
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(btn).toHaveAttribute("aria-controls", "drawer1");
    expect(btn).toHaveAttribute("aria-label", "Open menu");
    rerender(<Navbar onMenuClick={() => {}} menuOpen={true} menuControls="drawer1" />);
    btn = container.querySelector(".twc-navbar__menu-btn");
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(btn).toHaveAttribute("aria-label", "Close menu");
  });
});

describe("Navbar links nav (#140)", () => {
  it("names the links nav (default 'Primary', overridable)", () => {
    const { rerender } = render(<Navbar links={[{ label: "Docs", href: "/docs" }]} />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    rerender(<Navbar links={[{ label: "Docs", href: "/docs" }]} navLabel="Main site" />);
    expect(screen.getByRole("navigation", { name: "Main site" })).toBeInTheDocument();
  });
});
