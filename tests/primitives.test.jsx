import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VisuallyHidden } from "../components/layout/VisuallyHidden.jsx";
import { Kbd } from "../components/typography/Kbd.jsx";
import { Pre } from "../components/typography/Pre.jsx";
import { Anchor } from "../components/navigation/Anchor.jsx";
import { Label } from "../components/inputs/Label.jsx";
import { Image } from "../components/data-display/Image.jsx";
import { Portal } from "../components/layout/Portal.jsx";
import { ColorSchemeScript, getColorSchemeScript } from "../components/layout/ColorSchemeScript.jsx";

describe("new primitives (#56)", () => {
  it("VisuallyHidden keeps text in the a11y tree but off-screen", () => {
    render(<VisuallyHidden>Loading</VisuallyHidden>);
    const el = screen.getByText("Loading");
    expect(el).toHaveClass("twc-visually-hidden");
  });

  it("Kbd and Pre render their tags", () => {
    const { container } = render(<><Kbd>K</Kbd><Pre>code</Pre></>);
    expect(container.querySelector("kbd.twc-kbd")).toHaveTextContent("K");
    expect(container.querySelector("pre.twc-pre")).toHaveTextContent("code");
  });

  it("Anchor sanitizes javascript: hrefs and wires external", () => {
    const { container, rerender } = render(<Anchor href="javascript:alert(1)">x</Anchor>);
    expect(container.querySelector("a")).not.toHaveAttribute("href");
    rerender(<Anchor href="https://x.com" external>x</Anchor>);
    const a = container.querySelector("a");
    expect(a).toHaveAttribute("href", "https://x.com");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
    expect(a).toHaveAttribute("target", "_blank");
  });

  it("Label renders htmlFor + required asterisk", () => {
    const { container } = render(<Label htmlFor="e" required>Email</Label>);
    const label = container.querySelector("label.twc-label");
    expect(label).toHaveAttribute("for", "e");
    expect(label.querySelector(".twc-label__req")).toBeInTheDocument();
  });

  it("Image swaps to fallback on error", () => {
    const { container } = render(<Image src="/bad.png" alt="pic" fallback="/ok.png" />);
    const img = container.querySelector("img");
    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "/ok.png");
  });

  it("Portal renders children into document.body", () => {
    render(<Portal><div data-testid="p">hi</div></Portal>);
    expect(screen.getByTestId("p").parentElement).toBe(document.body);
  });
});

describe("ColorSchemeScript (#52)", () => {
  it("renders a <script> with the theme-init IIFE (no <>& so React keeps it literal)", () => {
    const { container } = render(<ColorSchemeScript nonce="abc" />);
    const script = container.querySelector("script");
    expect(script).toHaveAttribute("nonce", "abc");
    expect(script.textContent).toContain("prefers-color-scheme");
    expect(script.textContent).not.toMatch(/[<>&]/);
  });

  it("getColorSchemeScript honors storageKey + attribute", () => {
    const s = getColorSchemeScript({ storageKey: "mytheme", attribute: "data-theme" });
    expect(s).toContain('"mytheme"');
    expect(s).toContain('"data-theme"');
  });
});
