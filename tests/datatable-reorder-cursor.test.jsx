import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");

const columns = [
  { field: "name", headerName: "Name" },
  { field: "age", headerName: "Age", type: "number" },
];
const rows = [
  { id: 1, name: "Ava", age: 1 },
  { id: 2, name: "Liam", age: 2 },
];

// #263 — the grab/grabbing cursor must be scoped to the drag handle, not the whole reorderable row, so
// hovering a normal data cell isn't presented as draggable. jsdom can't compute the injected-<style>
// cascade for `cursor`, so guard the CSS at the source (mirrors the #242 diff-tint source check).
describe("Datatable reorder cursor scope (#263)", () => {
  it("does NOT put a grab cursor on the whole row", () => {
    const src = readFileSync(DT_SRC, "utf8");
    expect(src).not.toContain(".twc-dt__row[data-reorderable] { cursor: grab");
  });

  it("keeps the grab cursor on the drag handle, and grabbing while active/grabbed", () => {
    const src = readFileSync(DT_SRC, "utf8");
    // handle base cursor
    expect(src).toMatch(/\.twc-dt__row-handle \{[^}]*cursor: grab;/);
    // grabbing scoped to the handle only
    expect(src).toContain('.twc-dt__row-handle:active, .twc-dt__row-handle[data-grabbed="true"] { cursor: grabbing; }');
  });

  it("still renders the row as a drag source with a focusable handle (drag unaffected)", () => {
    const { container } = render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id} rowReorder onRowOrderChange={() => {}} />
    );
    const row = container.querySelector('.twc-dt__row[data-reorderable]');
    expect(row).toBeTruthy();
    expect(row.getAttribute("draggable")).toBe("true"); // mouse drag from the row still works
    expect(container.querySelector(".twc-dt__row-handle")).toBeTruthy(); // grip present
  });
});
