import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #479 — a batch action could be `disabled` (statically or by a predicate over the selection) but had
// nowhere to say WHY. The row-action path has had `disabledReason` since #399/#419; a batch action is
// the same control with a wider blast radius and is the one more likely to be conditionally
// unavailable — and because `disabled` is a predicate over the selection, the reason is almost always
// selection-dependent ("that selection is 5.1 GB; the limit is 4 GB"), i.e. exactly the thing the user
// cannot infer from a greyed-out label.

const rows = [
  { id: "a", name: "Alpha", size: 1 },
  { id: "b", name: "Beta", size: 3 },
  { id: "c", name: "Gamma", size: 5 },
];
const columns = [{ field: "name", label: "Name" }];

afterEach(cleanup);

const batchBtn = (label) =>
  [...document.querySelectorAll(".twc-dt__batch-btn")].find((b) => b.textContent.includes(label));

/** Select the first `n` body rows via their checkboxes (the convention in the sibling batch tests). */
function selectRows(container, n) {
  const boxes = container.querySelectorAll('[aria-label="Select row"]');
  for (let i = 0; i < n; i++) fireEvent.click(boxes[i]);
}

/** Toggle one row by index — these are checkboxes, so re-clicking a selected row DESELECTS it. */
const toggleRow = (container, i) =>
  fireEvent.click(container.querySelectorAll('[aria-label="Select row"]')[i]);

function setup(action) {
  const r = render(
    <Datatable rows={rows} columns={columns} rowKey={(r) => r.id} checkboxSelection batchActions={[action]} />
  );
  return r;
}

describe("batch action disabledReason (#479)", () => {
  it("shows a static reason as the button's tooltip", () => {
    const { container } = setup({ label: "Download as ZIP", disabled: true, disabledReason: "Not available offline" });
    selectRows(container, 1);
    const btn = batchBtn("Download as ZIP");
    expect(btn).toBeTruthy();
    fireEvent.mouseEnter(btn.closest(".twc-tooltip-wrap"));
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain("Not available offline");
  });

  it("evaluates the reason as a predicate over the SELECTION, so it can name the real numbers", () => {
    const { container } = setup({
      label: "Download as ZIP",
      disabled: (keys, sel) => sel.reduce((t, r) => t + r.size, 0) > 4,
      disabledReason: (keys, sel) => `That selection is ${sel.reduce((t, r) => t + r.size, 0)} GB; the limit is 4 GB`,
    });
    selectRows(container, 2); // 1 + 3 = 4 GB, within the limit
    expect(batchBtn("Download as ZIP").hasAttribute("aria-disabled")).toBe(false);

    toggleRow(container, 2); // ADD Gamma: 1 + 3 + 5 = 9 GB
    const btn = batchBtn("Download as ZIP");
    fireEvent.mouseEnter(btn.closest(".twc-tooltip-wrap"));
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain("9 GB");
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain("limit is 4 GB");
  });

  it("renders aria-disabled (not native disabled) when a reason is present, so the reason is keyboard-reachable", () => {
    const { container } = setup({ label: "Archive", disabled: true, disabledReason: "Read-only workspace" });
    selectRows(container, 1);
    const btn = batchBtn("Archive");
    expect(btn.getAttribute("aria-disabled")).toBe("true");
    expect(btn.disabled, "a native disabled button cannot be focused, so the reason would be hover-only").toBe(false);
  });

  it("stays natively disabled and out of the tab order when there is NO reason", () => {
    // Matching the row-action rule: a tooltip that only repeats the label does not earn a tab stop.
    const { container } = setup({ label: "Archive", disabled: true });
    selectRows(container, 1);
    const btn = batchBtn("Archive");
    expect(btn.disabled).toBe(true);
    expect(btn.hasAttribute("aria-disabled")).toBe(false);
    expect(btn.closest(".twc-tooltip-wrap"), "no reason means no tooltip wrapper at all").toBe(null);
  });

  it("blocks the handler while disabled, reason or not", () => {
    const onClick = vi.fn();
    const { container } = setup({ label: "Archive", disabled: true, disabledReason: "Read-only workspace", onClick });
    selectRows(container, 1);
    fireEvent.click(batchBtn("Archive"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("still runs when enabled, and leaves an action without a reason untouched", () => {
    const onClick = vi.fn();
    const { container } = setup({ label: "Archive", onClick });
    selectRows(container, 2);
    const btn = batchBtn("Archive");
    expect(btn.disabled).toBe(false);
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    const [keys, selRows] = onClick.mock.calls[0];
    expect(keys).toHaveLength(2);
    expect(selRows.map((r) => r.name)).toEqual(["Alpha", "Beta"]);
  });

  it("a hidden action is still hidden regardless of any reason", () => {
    const { container } = setup({ label: "Archive", hidden: true, disabled: true, disabledReason: "nope" });
    selectRows(container, 1);
    expect(batchBtn("Archive")).toBeUndefined();
  });
});
