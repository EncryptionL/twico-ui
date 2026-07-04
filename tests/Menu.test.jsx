import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Menu } from "../components/overlay/Menu.jsx";
import { AvatarMenu } from "../components/data-display/AvatarMenu.jsx";

const open = (el) => fireEvent.keyDown(el, { key: "ArrowDown" });

describe("Menu accessible name (#142)", () => {
  it("a header labels the popup when no aria-label is given", () => {
    render(<Menu trigger={<button>Open</button>} header={<div>Acct</div>} items={[{ label: "A", onClick: () => {} }]} />);
    open(screen.getByText("Open"));
    const menu = screen.getByRole("menu");
    const labelledby = menu.getAttribute("aria-labelledby");
    expect(labelledby).toBeTruthy();
    expect(document.getElementById(labelledby)).toHaveTextContent("Acct");
    expect(menu).not.toHaveAttribute("aria-label");
  });

  it("an explicit aria-label names the popup and suppresses the header fallback", () => {
    render(<Menu aria-label="Row actions" trigger={<button>Open</button>} header={<div>Acct</div>} items={[{ label: "A" }]} />);
    open(screen.getByText("Open"));
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("aria-label", "Row actions");
    expect(menu).not.toHaveAttribute("aria-labelledby");
  });

  it("AvatarMenu defaults the popup name to '<name> menu'", () => {
    render(<AvatarMenu name="Ada Park" items={[{ label: "Profile" }]} />);
    open(screen.getByRole("button", { name: /Ada Park/ }));
    expect(screen.getByRole("menu")).toHaveAttribute("aria-label", "Ada Park menu");
  });
});

describe("Menu href items (#167)", () => {
  it("renders an item with href as an anchor", () => {
    render(<Menu trigger={<button>Open</button>} items={[{ label: "Settings", href: "/settings" }]} />);
    open(screen.getByText("Open"));
    const item = screen.getByRole("menuitem", { name: "Settings" });
    expect(item.tagName).toBe("A");
    expect(item).toHaveAttribute("href", "/settings");
  });

  it("sanitizes a javascript: href to a button", () => {
    render(<Menu trigger={<button>Open</button>} items={[{ label: "Bad", href: "javascript:alert(1)" }]} />);
    open(screen.getByText("Open"));
    expect(screen.getByRole("menuitem", { name: "Bad" }).tagName).toBe("BUTTON");
  });

  it("a disabled href item stays a disabled button", () => {
    render(<Menu trigger={<button>Open</button>} items={[{ label: "Nope", href: "/x", disabled: true }]} />);
    open(screen.getByText("Open"));
    const item = screen.getByRole("menuitem", { name: "Nope" });
    expect(item.tagName).toBe("BUTTON");
    expect(item).toBeDisabled();
  });
});
