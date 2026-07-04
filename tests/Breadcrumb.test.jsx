import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Breadcrumb } from "../components/navigation/Breadcrumb.jsx";

describe("Breadcrumb crumb rendering (#46)", () => {
  it("a crumb with href renders an <a> with that exact href", () => {
    const { container } = render(<Breadcrumb items={[{ label: "Home", href: "/home" }, { label: "Now" }]} />);
    const a = container.querySelector("a.twc-breadcrumb__item");
    expect(a).toHaveAttribute("href", "/home");
  });

  it("a crumb with no href and no onClick renders inert text (no fake #)", () => {
    const { container } = render(<Breadcrumb items={[{ label: "Section" }, { label: "Now" }]} />);
    const first = container.querySelectorAll(".twc-breadcrumb__item")[0];
    expect(first.tagName).toBe("SPAN");
    expect(first).not.toHaveAttribute("href");
  });

  it("a crumb with onClick only renders a <button> and fires it", () => {
    const onClick = vi.fn();
    const { container } = render(<Breadcrumb items={[{ label: "Back", onClick }, { label: "Now" }]} />);
    const btn = container.querySelector("button.twc-breadcrumb__item");
    expect(btn).not.toBeNull();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });

  it("the last crumb is a span with aria-current=page", () => {
    render(<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Current" }]} />);
    const current = screen.getByText("Current").closest(".twc-breadcrumb__item");
    expect(current.tagName).toBe("SPAN");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("an unsafe javascript: href with no onClick degrades to inert text", () => {
    const { container } = render(
      <Breadcrumb items={[{ label: "Evil", href: "javascript:alert(1)" }, { label: "Now" }]} />
    );
    const first = container.querySelectorAll(".twc-breadcrumb__item")[0];
    expect(first.tagName).toBe("SPAN");
    expect(container.querySelector('a[href^="javascript"]')).toBeNull();
  });
});
