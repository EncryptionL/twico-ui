import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dialog } from "../components/overlay/Dialog.jsx";
import { Drawer } from "../components/overlay/Drawer.jsx";
import { CommandPalette } from "../components/overlay/CommandPalette.jsx";

// These exercise the shared useFocusTrap / usePortal extraction (#177): each overlay
// must still portal to <body>, move focus inside on open, close on Escape, and
// dismiss on backdrop click.

describe("Dialog — focus trap + portal (#177)", () => {
  it("portals to <body>, moves focus inside, and closes on Escape", () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Title"><button>Body action</button></Dialog>);
    const dialog = screen.getByRole("dialog");
    // Portaled straight to <body> (escaped the RTL container).
    expect(dialog.closest("body")).toBe(document.body);
    // Focus landed inside the panel.
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on backdrop mousedown, unless closeOnBackdrop is false", () => {
    const onClose = vi.fn();
    const { rerender } = render(<Dialog open onClose={onClose} title="T">x</Dialog>);
    fireEvent.mouseDown(document.querySelector(".twc-dialog__overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    rerender(<Dialog open onClose={onClose} title="T" closeOnBackdrop={false}>x</Dialog>);
    fireEvent.mouseDown(document.querySelector(".twc-dialog__overlay"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not render when closed", () => {
    render(<Dialog open={false} onClose={() => {}} title="T">x</Dialog>);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Drawer — focus trap + portal (#177)", () => {
  it("portals to <body>, moves focus inside, and closes on Escape", () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="Menu"><button>Item</button></Drawer>);
    const drawer = screen.getByRole("dialog");
    expect(drawer.closest("body")).toBe(document.body);
    expect(drawer.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on backdrop mousedown", () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="Menu">x</Drawer>);
    fireEvent.mouseDown(document.querySelector(".twc-drawer__overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("CommandPalette — focus trap + portal + nav (#177)", () => {
  it("focuses the search input on open and closes on Escape", () => {
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} commands={[{ id: "a", label: "Alpha", onSelect: () => {} }]} />);
    const input = screen.getByRole("combobox");
    expect(document.activeElement).toBe(input);
    expect(input.closest("body")).toBe(document.body);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Arrow + Enter runs the active command and closes", () => {
    const onClose = vi.fn();
    const alpha = vi.fn();
    const beta = vi.fn();
    render(
      <CommandPalette
        open
        onClose={onClose}
        commands={[
          { id: "a", label: "Alpha", onSelect: alpha },
          { id: "b", label: "Beta", onSelect: beta },
        ]}
      />
    );
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" }); // 0 -> 1 (Beta)
    fireEvent.keyDown(input, { key: "Enter" });
    expect(beta).toHaveBeenCalledTimes(1);
    expect(alpha).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
