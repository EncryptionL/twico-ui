import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Dialog } from "../components/overlay/Dialog.jsx";
import { Select } from "../components/inputs/Select.jsx";

// #389: a dismissable-layer stack — Escape / outside-pointer reach only the TOPMOST open overlay, so a nested
// Menu/Select/Popover/Tooltip or a stacked Dialog no longer also closes its parent.
const RECT = { top: 80, left: 80, right: 260, bottom: 120, width: 180, height: 40, x: 80, y: 80, toJSON() {} };
let origRect;
beforeEach(() => { origRect = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = () => RECT; });
afterEach(() => { Element.prototype.getBoundingClientRect = origRect; cleanup(); });

describe("Dialog/Drawer dismissable-layer stack (#389)", () => {
  it("nested Dialogs: Escape closes only the inner (topmost) one", () => {
    const outerClose = vi.fn();
    const innerClose = vi.fn();
    render(<>
      <Dialog open onClose={outerClose} title="Outer">outer body</Dialog>
      <Dialog open onClose={innerClose} title="Inner">inner body</Dialog>
    </>);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(innerClose).toHaveBeenCalledTimes(1);
    expect(outerClose).not.toHaveBeenCalled();
  });

  it("a single Dialog still closes on Escape (no regression)", () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Solo">body</Dialog>);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("an open Select inside a Dialog: Escape closes the Select, not the Dialog", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose} title="Edit">
        <Select options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />
      </Dialog>,
    );
    const trigger = document.querySelector(".twc-sel__trigger");
    fireEvent.click(trigger); // open the listbox
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(trigger, { key: "Escape" }); // Select preventDefaults → Dialog's guard bails
    expect(trigger.getAttribute("aria-expanded")).toBe("false"); // Select closed
    expect(onClose).not.toHaveBeenCalled(); // Dialog stayed open
  });
});
