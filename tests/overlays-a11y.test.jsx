import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toast, ToastViewport } from "../components/feedback/Toast.jsx";
import { CommandPalette } from "../components/overlay/CommandPalette.jsx";
import { Menu } from "../components/overlay/Menu.jsx";
import { Popover } from "../components/overlay/Popover.jsx";
import { Dialog } from "../components/overlay/Dialog.jsx";

describe("Toast live-region role (#111)", () => {
  it("danger/warning toasts are assertive alerts; others are polite status", () => {
    const { rerender } = render(<Toast tone="danger" title="Boom" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(<Toast tone="success" title="Saved" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
  it("ToastViewport is a labelled Notifications landmark", () => {
    render(<ToastViewport><Toast title="Hi" /></ToastViewport>);
    expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
  });
});

describe("CommandPalette input name + honest aria-expanded (#117)", () => {
  it("names the search input and reflects the result count", () => {
    const { rerender } = render(<CommandPalette open onClose={() => {}} commands={[{ id: "a", label: "Alpha", onSelect: () => {} }]} searchLabel="Search" />);
    const input = screen.getByRole("combobox", { name: "Search" });
    expect(input).toHaveAttribute("aria-expanded", "true");
    // no commands → aria-expanded false
    rerender(<CommandPalette open onClose={() => {}} commands={[]} searchLabel="Search" />);
    expect(screen.getByRole("combobox", { name: "Search" })).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Menu semantics (#118)", () => {
  it("exposes aria-orientation and a presentation header", () => {
    render(
      <Menu open trigger={<button>Open</button>} header={<span>Account</span>}
        items={[{ label: "Profile", onClick: () => {} }]} />
    );
    const menu = document.querySelector('[role="menu"]');
    expect(menu).toHaveAttribute("aria-orientation", "vertical");
    expect(document.querySelector(".twc-menu__header")).toHaveAttribute("role", "presentation");
  });
});

describe("Popover focus trap (#113)", () => {
  it("is a modal dialog that moves focus inside on open", () => {
    render(
      <Popover open content={<button>Inside</button>}>
        <button>Trigger</button>
      </Popover>
    );
    const panel = document.querySelector('[role="dialog"]');
    expect(panel).toHaveAttribute("aria-modal", "true");
    expect(panel.contains(document.activeElement)).toBe(true);
  });
});

describe("Dialog scroll-lock + inert background (#115/#116)", () => {
  it("locks body scroll while open and restores on close", () => {
    const { rerender } = render(<Dialog open onClose={() => {}} title="T">body</Dialog>);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Dialog open={false} onClose={() => {}} title="T">body</Dialog>);
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("marks background siblings inert / aria-hidden while open", () => {
    render(
      <>
        <div data-testid="bg">background</div>
        <Dialog open onClose={() => {}} title="T">body</Dialog>
      </>
    );
    // the RTL container holding "background" is a body child that doesn't contain the portal
    const bgHost = screen.getByTestId("bg").parentElement;
    expect(bgHost).toHaveAttribute("aria-hidden", "true");
  });
});
