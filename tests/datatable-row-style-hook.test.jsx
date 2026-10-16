import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #481 — #345 gave columns a per-cell cellStyle/cellClassName, but there was no row-level equivalent,
// so marking a whole row by its state meant assigning cellStyle to EVERY column: O(columns) for a
// row-level fact, composed by hand against whatever else already used cellStyle, and with no fixed
// column list to decorate when the columns come from a schema. The alternative — hanging CSS off
// .twc-dt__tr / .twc-dt__td from outside — reaches into internals a component library exists to hide.

const rows = [
  { id: "a", name: "Alpha", status: "done" },
  { id: "b", name: "Beta", status: "open" },
  { id: "c", name: "Gamma", status: "done" },
];
const columns = [{ field: "name", label: "Name" }, { field: "status", label: "Status" }];
const rowKey = (r) => r.id;

afterEach(cleanup);

const bodyRows = (c) => [...c.querySelectorAll("tbody tr.twc-dt__row")];

describe("getRowStyle / getRowClassName (#481)", () => {
  it("puts the class on the row's <tr>, keeping twc-dt__row", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowClassName={(r) => (r.status === "done" ? "done-row" : undefined)} />
    );
    const trs = bodyRows(container);
    expect(trs[0].className).toContain("twc-dt__row");
    expect(trs[0].className).toContain("done-row");
    expect(trs[1].className).not.toContain("done-row");
    expect(trs[2].className).toContain("done-row");
  });

  it("applies the style to the <tr>", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowStyle={(r) => (r.status === "done" ? { opacity: "0.6", fontStyle: "italic" } : undefined)} />
    );
    const trs = bodyRows(container);
    expect(trs[0].style.opacity).toBe("0.6");
    expect(trs[0].style.fontStyle).toBe("italic");
    expect(trs[1].style.opacity).toBe("");
  });

  it("forwards a background to the CELLS via --twc-dt-row-bg, not just the <tr>", () => {
    // The whole point: .twc-dt__td paints an opaque --color-surface, so a background left on the <tr>
    // would sit behind it and the commonest use of the hook would silently do nothing.
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowStyle={(r) => (r.status === "done" ? { background: "rgb(1, 2, 3)" } : undefined)} />
    );
    const tr = bodyRows(container)[0];
    expect(tr.style.getPropertyValue("--twc-dt-row-bg")).toBe("rgb(1, 2, 3)");
    expect(bodyRows(container)[1].style.getPropertyValue("--twc-dt-row-bg")).toBe("");
  });

  it("accepts backgroundColor as well as background", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowStyle={() => ({ backgroundColor: "rgb(4, 5, 6)" })} />
    );
    expect(bodyRows(container)[0].style.getPropertyValue("--twc-dt-row-bg")).toBe("rgb(4, 5, 6)");
  });

  it("the cell rule actually reads the custom property", () => {
    const src = readFileSync(resolve(process.cwd(), "components/data-display/Datatable.jsx"), "utf8");
    const i = src.indexOf(".twc-dt__td { padding:");
    const body = src.slice(i, src.indexOf("}", i));
    expect(body).toMatch(/background:\s*var\(--twc-dt-row-bg,\s*var\(--color-surface\)\)/);
  });

  it("receives (row, index), the same shape as rowKey", () => {
    const seen = [];
    render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowStyle={(row, index) => { seen.push([row.id, index]); return undefined; }} />
    );
    expect(seen.slice(0, 3).map(([id]) => id)).toEqual(["a", "b", "c"]);
    expect(seen.slice(0, 3).map(([, i]) => i)).toEqual([0, 1, 2]);
  });

  it("cannot break row pinning or row resizing — the component's declarations are applied last", () => {
    // Asserted against the source rather than by driving the UI: pinning and row height are internal
    // state reached only through the row's ⋮ menu and the resize grip, and the guarantee here is
    // purely about composition ORDER in the style object — the hook's declarations first, the
    // component's sticky/height last, so a hook cannot unstick a pinned row or fight a resize.
    const src = readFileSync(resolve(process.cwd(), "components/data-display/Datatable.jsx"), "utf8");
    const i = src.indexOf("const rowStyle = {");
    expect(i, "the composed rowStyle should exist").toBeGreaterThan(-1);
    const block = src.slice(i, src.indexOf("};", i));
    const posUser = block.indexOf("userRowStyle");
    const posSticky = block.indexOf("stickyStyle");
    const posHeight = block.indexOf("height: h");
    expect(posUser).toBeGreaterThan(-1);
    expect(posSticky, "stickyStyle must be spread AFTER the hook's style").toBeGreaterThan(posUser);
    expect(posHeight, "the measured row height must be applied AFTER the hook's style").toBeGreaterThan(posUser);
  });

  it("leaves every row untouched when neither hook is given", () => {
    const { container } = render(<Datatable rows={rows} columns={columns} rowKey={rowKey} />);
    for (const tr of bodyRows(container)) {
      expect(tr.className.trim()).toBe("twc-dt__row");
      expect(tr.style.getPropertyValue("--twc-dt-row-bg")).toBe("");
    }
  });

  it("is not called with a row for group-header rows", () => {
    // Documented scope: data rows only. A group header has no row object to pass.
    const calls = [];
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey} groupBy="status"
        getRowStyle={(row) => { calls.push(row); return undefined; }} />
    );
    expect(container.querySelector("tbody"), "the grid should render").not.toBe(null);
    for (const r of calls) expect(r, "every call must carry a real row").toBeTruthy();
  });

  it("a column's cellStyle still wins over the row tint, with no composing by the consumer", () => {
    const { container } = render(
      <Datatable rows={rows} columns={[
        { field: "name", label: "Name", cellStyle: () => ({ background: "rgb(9, 9, 9)" }) },
        { field: "status", label: "Status" },
      ]} rowKey={rowKey} getRowStyle={() => ({ background: "rgb(1, 1, 1)" })} />
    );
    const cells = bodyRows(container)[0].querySelectorAll("td.twc-dt__td");
    const nameCell = [...cells].find((td) => td.textContent.includes("Alpha"));
    // The per-cell state is an inline style on the <td>; the row tint only reaches it through a
    // custom property the stylesheet reads, so the cell wins without the consumer merging anything.
    expect(nameCell.style.background).toBe("rgb(9, 9, 9)");
  });
});
