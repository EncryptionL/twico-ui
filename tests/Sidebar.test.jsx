import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../components/navigation/Sidebar.jsx";

const items = [
  { label: "Home", href: "/" },
  { label: "Inbox", href: "/inbox" },
  { section: "Team" },
  { label: "Members", href: "/members" },
];

describe("Sidebar nav semantics (#140)", () => {
  it("names the nav landmark (default 'Main', overridable)", () => {
    const { rerender } = render(<Sidebar items={items} collapsible={false} />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    rerender(<Sidebar items={items} navLabel="Workspace" collapsible={false} />);
    expect(screen.getByRole("navigation", { name: "Workspace" })).toBeInTheDocument();
  });

  it("renders items as listitems and labels the section list by its heading", () => {
    const { container } = render(<Sidebar items={items} collapsible={false} />);
    expect(container.querySelectorAll("li")).toHaveLength(3);
    const sectionList = [...container.querySelectorAll(".twc-sidebar__list")].find((ul) => ul.getAttribute("aria-labelledby"));
    const labelId = sectionList.getAttribute("aria-labelledby");
    expect(document.getElementById(labelId)).toHaveTextContent("Team");
  });
});

describe("Sidebar collapse toggle (#139)", () => {
  it("exposes aria-expanded + aria-controls", () => {
    const { container } = render(<Sidebar items={items} />);
    const btn = screen.getByRole("button", { name: /Collapse sidebar/ });
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(btn).toHaveAttribute("aria-controls", container.querySelector(".twc-sidebar__nav").id);
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: /Expand sidebar/ })).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Sidebar off-canvas overlay (#138)", () => {
  it("does not render as a dialog in the default (rail) mode", () => {
    render(<Sidebar items={items} collapsible={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("overlay + open renders a labelled modal dialog and moves focus inside", () => {
    render(<Sidebar items={items} overlay open navLabel="Menu" onOpenChange={() => {}} collapsible={false} />);
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.closest("body")).toBe(document.body); // portaled to <body>
    expect(dialog.contains(document.activeElement)).toBe(true); // focus trapped inside
  });

  it("stays unmounted while closed (uncontrolled default)", () => {
    render(<Sidebar items={items} overlay collapsible={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("backdrop mousedown fires onOpenChange(false)", () => {
    const onOpenChange = vi.fn();
    render(<Sidebar items={items} overlay open onOpenChange={onOpenChange} collapsible={false} />);
    fireEvent.mouseDown(document.querySelector(".twc-sidebar__overlay"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape fires onOpenChange(false)", () => {
    const onOpenChange = vi.fn();
    render(<Sidebar items={items} overlay open onOpenChange={onOpenChange} collapsible={false} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("respects controlled open (does not close its own DOM on backdrop)", () => {
    const onOpenChange = vi.fn();
    render(<Sidebar items={items} overlay open onOpenChange={onOpenChange} collapsible={false} />);
    fireEvent.mouseDown(document.querySelector(".twc-sidebar__overlay"));
    // controlled: the parent owns `open`, so the dialog stays until it re-renders open=false
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
