import { describe, it, expect } from "vitest";
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
