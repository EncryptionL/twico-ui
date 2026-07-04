import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "../components/layout/AppShell.jsx";
import { Sidebar } from "../components/navigation/Sidebar.jsx";

const navItems = [{ label: "Home", href: "/" }];

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

describe("AppShell mobile sidebar coordination (#138)", () => {
  it("leaves the sidebar as an in-flow rail by default", () => {
    render(<AppShell sidebar={<Sidebar items={navItems} collapsible={false} />}>x</AppShell>);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("forwards overlay/open/onOpenChange to the sidebar when onSidebarOpenChange is set", () => {
    render(
      <AppShell
        sidebar={<Sidebar items={navItems} navLabel="Menu" collapsible={false} />}
        sidebarOpen
        onSidebarOpenChange={() => {}}
      >
        x
      </AppShell>
    );
    // The sidebar now renders as an off-canvas dialog driven by the shell's open state.
    expect(screen.getByRole("dialog", { name: "Menu" })).toHaveAttribute("aria-modal", "true");
  });

  it("does not force overlay when the sidebar sets its own overlay prop", () => {
    render(
      <AppShell
        sidebar={<Sidebar items={navItems} overlay={false} collapsible={false} />}
        sidebarOpen
        onSidebarOpenChange={() => {}}
      >
        x
      </AppShell>
    );
    // Sidebar's own overlay={false} wins over the shell's forwarded default.
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
