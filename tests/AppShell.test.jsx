import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AppShell } from "../components/layout/AppShell.jsx";

describe("AppShell skip link (#134)", () => {
  it("renders a skip link that targets #twc-main, before the main region", () => {
    const { container } = render(<AppShell>content</AppShell>);
    const skip = container.querySelector(".twc-shell__skip");
    expect(skip).not.toBeNull();
    expect(skip.tagName).toBe("A");
    expect(skip).toHaveAttribute("href", "#twc-main");
    expect(skip).toHaveTextContent("Skip to content");
    const main = container.querySelector("main");
    expect(main).toHaveAttribute("id", "twc-main");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(skip.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("mainId propagates to the link href and the main id", () => {
    const { container } = render(<AppShell mainId="content">x</AppShell>);
    expect(container.querySelector(".twc-shell__skip")).toHaveAttribute("href", "#content");
    expect(container.querySelector("main")).toHaveAttribute("id", "content");
  });

  it("skipLinkLabel={false} opts out of the link", () => {
    const { container } = render(<AppShell skipLinkLabel={false}>x</AppShell>);
    expect(container.querySelector(".twc-shell__skip")).toBeNull();
  });

  it("accepts a custom skipLinkLabel node", () => {
    const { container } = render(<AppShell skipLinkLabel={<span>Zum Inhalt</span>}>x</AppShell>);
    expect(container.querySelector(".twc-shell__skip")).toHaveTextContent("Zum Inhalt");
  });
});
