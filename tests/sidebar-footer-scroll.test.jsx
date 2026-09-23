import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Sidebar } from "../components/navigation/Sidebar.jsx";
import { AvatarMenu } from "../components/data-display/AvatarMenu.jsx";

// #401: nav children keep their height so a short rail scrolls instead of squashing headings.
// #402: footerInset={false} bleeds the footer to the rail edges; AvatarMenu fullWidth stretches the trigger.
afterEach(() => cleanup());
const css = () => Array.from(document.querySelectorAll("style")).map((s) => s.textContent).join("\n");
const items = [
  { section: "Main" }, { label: "Home", href: "#" },
  { section: "More" }, { label: "Settings", href: "#" },
];

describe("Sidebar short-rail scrolling (#401)", () => {
  it("declares flex-shrink:0 on the nav's direct children", () => {
    render(<Sidebar brand="X" items={items} />);
    expect(css()).toMatch(/\.twc-sidebar__nav\s*>\s*\*\s*\{[^}]*flex-shrink:\s*0/);
  });
});

describe("Sidebar footerInset (#402)", () => {
  it("marks the footer row data-inset=false only when footerInset is false", () => {
    const { container, rerender } = render(<Sidebar brand="X" items={items} footer={<span>acct</span>} />);
    expect(container.querySelector(".twc-sidebar__foot-user").getAttribute("data-inset")).toBeNull();
    rerender(<Sidebar brand="X" items={items} footer={<span>acct</span>} footerInset={false} />);
    expect(container.querySelector(".twc-sidebar__foot-user").getAttribute("data-inset")).toBe("false");
    expect(css()).toMatch(/\.twc-sidebar__foot-user\[data-inset="false"\]\s*\{[^}]*padding:\s*0/);
  });
});

describe("Sidebar footer bottom edge + AvatarMenu header/width (#417, #416)", () => {
  it("#417: cancels the foot bottom padding when the footer row is the last child", () => {
    render(<Sidebar brand="X" items={items} footer={<span>acct</span>} footerInset={false} collapsible={false} />);
    expect(css()).toMatch(/\.twc-sidebar__foot-user\[data-inset="false"\]:last-child\s*\{[^}]*margin-bottom/);
  });
  it("#416: fullWidth drops the fixed menu width and squares the trigger; chevron rotates on open", () => {
    render(<AvatarMenu name="Ada" showName items={[{ label: "Sign out" }]} fullWidth />);
    const c = css();
    expect(c).toMatch(/\.twc-avatar-menu--block \.twc-avatar-menu\s*\{[^}]*border-radius:\s*var\(--radius-md\)/);
    expect(c).toMatch(/\.twc-avatar-menu\[aria-expanded="true"\] \.twc-avatar-menu__chev\s*\{[^}]*rotate\(180deg\)/);
  });
  it("#416: headerExtra + menuWidth are accepted without error", () => {
    const { container } = render(<AvatarMenu name="Ada" showName items={[{ label: "Out" }]} headerExtra={<span data-extra>Online</span>} menuWidth={320} />);
    expect(container.querySelector(".twc-avatar-menu")).toBeTruthy();
  });
});

describe("AvatarMenu fullWidth (#402)", () => {
  it("adds the --block class to the menu wrap and declares the stretch CSS", () => {
    const { container } = render(<AvatarMenu name="Ada" showName items={[{ label: "Sign out" }]} fullWidth />);
    expect(container.querySelector(".twc-avatar-menu--block")).toBeTruthy();
    expect(css()).toMatch(/\.twc-avatar-menu--block\.twc-menu-wrap\s*\{[^}]*width:\s*100%/);
  });

  it("stays inline (no --block) without the flag", () => {
    const { container } = render(<AvatarMenu name="Ada" showName items={[{ label: "Sign out" }]} />);
    expect(container.querySelector(".twc-avatar-menu--block")).toBeNull();
  });
});
