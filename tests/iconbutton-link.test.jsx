import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { IconButton } from "../components/buttons/IconButton.jsx";

const Icon = () => <svg data-testid="ic" viewBox="0 0 24 24" />;

// #342 — IconButton can render as an anchor (as="a") for icon LINKS, so navigation is a real link, not a
// button. Mirrors Button: scheme-sanitized href, element-appropriate attributes, inert disabled anchor.
describe("IconButton as link (#342)", () => {
  it("defaults to a <button type=button>", () => {
    const { container } = render(<IconButton aria-label="Settings" icon={<Icon />} />);
    const el = container.querySelector(".twc-iconbtn");
    expect(el.tagName).toBe("BUTTON");
    expect(el.getAttribute("type")).toBe("button");
  });

  it("as=\"a\" renders an anchor with the href (no button, no type)", () => {
    const { container } = render(<IconButton as="a" href="https://example.com" aria-label="Repo" icon={<Icon />} />);
    const el = container.querySelector(".twc-iconbtn");
    expect(el.tagName).toBe("A");
    expect(el.getAttribute("href")).toBe("https://example.com");
    expect(el.getAttribute("type")).toBeNull();
    expect(el.getAttribute("aria-label")).toBe("Repo");
  });

  it("passes target/rel through on the anchor", () => {
    const { container } = render(<IconButton as="a" href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="Repo" icon={<Icon />} />);
    const el = container.querySelector(".twc-iconbtn");
    expect(el.getAttribute("target")).toBe("_blank");
    expect(el.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("sanitizes a javascript: href (drops it)", () => {
    // eslint-disable-next-line no-script-url
    const { container } = render(<IconButton as="a" href="javascript:alert(1)" aria-label="x" icon={<Icon />} />);
    expect(container.querySelector(".twc-iconbtn").getAttribute("href")).toBeNull();
  });

  it("a disabled anchor is inert (no href, aria-disabled, out of tab order)", () => {
    const { container } = render(<IconButton as="a" href="https://example.com" disabled aria-label="x" icon={<Icon />} />);
    const el = container.querySelector(".twc-iconbtn");
    expect(el.getAttribute("href")).toBeNull();
    expect(el.getAttribute("aria-disabled")).toBe("true");
    expect(el.getAttribute("tabindex")).toBe("-1");
  });
});
