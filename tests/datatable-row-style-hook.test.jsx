import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
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
    // ...and it must be LIFTED, not copied. A row box paints BELOW its cells, so a leftover
    // background on the <tr> is a second coat of the same colour under every cell: a translucent
    // tint composites with itself, and any translucent state wash (dark-mode selection is 16%
    // alpha; the diff [data-op] washes are 7%) stops covering the tint because what it composites
    // over is no longer the plain surface. The first version of this feature copied it, and
    // asserting only the custom property above is what let that through.
    expect(tr.style.background, "the background must not remain on the <tr>").toBe("");
    expect(tr.style.backgroundColor, "the background must not remain on the <tr>").toBe("");
  });

  it("a translucent tint is painted exactly once", () => {
    // The visible symptom of the copy bug: rgba(…,0.2) rendered at an effective 0.36.
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowStyle={() => ({ background: "rgba(255, 0, 0, 0.2)" })} />
    );
    const tr = bodyRows(container)[0];
    expect(tr.getAttribute("style")).toBe("--twc-dt-row-bg: rgba(255, 0, 0, 0.2);");
  });

  it("keeps the hook's non-background declarations on the <tr> while lifting the background", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowStyle={() => ({ background: "rgb(1, 2, 3)", opacity: "0.5", fontWeight: 700 })} />
    );
    const tr = bodyRows(container)[0];
    expect(tr.style.getPropertyValue("--twc-dt-row-bg")).toBe("rgb(1, 2, 3)");
    expect(tr.style.background).toBe("");
    expect(tr.style.opacity).toBe("0.5");
    expect(tr.style.fontWeight).toBe("700");
  });

  it("drops an unusable background value rather than leaving it on the <tr>", () => {
    // "" is not nullish, so a naive ?? would publish an empty custom property AND leave the empty
    // declaration on the row; neither is useful, and a sibling backgroundColor should win.
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowStyle={() => ({ background: "", backgroundColor: "rgb(4, 5, 6)" })} />
    );
    const tr = bodyRows(container)[0];
    expect(tr.style.getPropertyValue("--twc-dt-row-bg")).toBe("rgb(4, 5, 6)");
    expect(tr.style.background).toBe("");
    expect(tr.style.backgroundColor).toBe("");
  });

  it("accepts backgroundColor as well as background", () => {
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey}
        getRowStyle={() => ({ backgroundColor: "rgb(4, 5, 6)" })} />
    );
    const tr = bodyRows(container)[0];
    expect(tr.style.getPropertyValue("--twc-dt-row-bg")).toBe("rgb(4, 5, 6)");
    expect(tr.style.backgroundColor, "backgroundColor must be lifted too").toBe("");
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
    const posUser = block.indexOf("...restRowStyle");
    const posSticky = block.indexOf("stickyStyle");
    const posHeight = block.indexOf("height: h");
    expect(posUser, "the hook's own declarations should be spread first").toBeGreaterThan(-1);
    expect(posSticky, "stickyStyle must be spread AFTER the hook's style").toBeGreaterThan(posUser);
    expect(posHeight, "the measured row height must be applied AFTER the hook's style").toBeGreaterThan(posUser);
    // And pin the LIFT: the first cut of this feature spread `userRowStyle` whole, which left the
    // background on the <tr> under every cell. The behavioural tests above catch that, but say so
    // here too, where the order guarantee lives - the two are the same spread.
    expect(block, "the raw hook style must not be spread back in").not.toContain("...(userRowStyle");
    expect(src.slice(Math.max(0, i - 1500), i), "the two background keys must be destructured AWAY").toMatch(
      /const \{\s*background:[^,]+,\s*backgroundColor:[^,]+,\s*\.\.\.restRowStyle\s*\}\s*=/
    );
  });

  it("leaves every row untouched when neither hook is given", () => {
    const { container } = render(<Datatable rows={rows} columns={columns} rowKey={rowKey} />);
    for (const tr of bodyRows(container)) {
      expect(tr.className.trim()).toBe("twc-dt__row");
      expect(tr.style.getPropertyValue("--twc-dt-row-bg")).toBe("");
    }
  });

  it("is not applied to group-header rows, and every call still carries a real row", () => {
    // Documented scope: data rows only. A group header has no row object to pass.
    //
    // The first version of this test passed `groupBy="status"`. That is not a Datatable prop -
    // grouping is `rowGrouping={[field]}` (`groupBy` is internal state) - so it fell through to
    // ...rest, was spread onto the root <div> as a stray `groupby` attribute with a React warning,
    // and NO group row was ever rendered. The test was green against a flat table and would have
    // stayed green with the whole feature deleted. Assert positively instead.
    const calls = [];
    const { container } = render(
      <Datatable rows={rows} columns={columns} rowKey={rowKey} rowGrouping={["status"]}
        getRowStyle={(row, index) => { calls.push([row, index]); return { opacity: "0.9" }; }}
        getRowClassName={() => "tinted"} />
    );
    const groupRows = [...container.querySelectorAll("tbody tr")].filter((tr) => !tr.classList.contains("twc-dt__row"));
    expect(groupRows.length, "grouping by status should render group-header rows").toBeGreaterThan(0);
    for (const g of groupRows) {
      expect(g.className, "a group header must not take the hook's class").not.toContain("tinted");
      expect(g.style.opacity, "a group header must not take the hook's style").toBe("");
    }
    // ...while the data rows inside the groups do, and every call carried a real row. Counted by
    // DISTINCT row, not by call: the hook is a render-time accessor, so a re-render calls it again.
    for (const [r, i] of calls) {
      expect(r, "every call must carry a real row").toBeTruthy();
      expect(rows.map((x) => x.id), "a group header must never be passed as a row").toContain(r.id);
      expect(typeof i, "index must still be a number on the grouped path").toBe("number");
    }
    expect(new Set(calls.map(([r]) => r.id)), "every data row is offered to the hook").toEqual(
      new Set(rows.map((r) => r.id))
    );
    expect(bodyRows(container).every((tr) => tr.className.includes("tinted"))).toBe(true);
  });

  it("a column's cellStyle still wins over the row tint, with no composing by the consumer", () => {
    const { container } = render(
      <Datatable rows={rows} columns={[
        { field: "name", label: "Name", cellStyle: () => ({ background: "rgb(9, 9, 9)" }) },
        { field: "status", label: "Status" },
      ]} rowKey={rowKey} getRowStyle={() => ({ background: "rgb(1, 1, 1)" })} />
    );
    const tr = bodyRows(container)[0];
    const cells = [...tr.querySelectorAll("td.twc-dt__td")];
    const nameCell = cells.find((td) => td.textContent.includes("Alpha"));
    // The per-cell state is an inline style on the <td>; the row tint only reaches it through a
    // custom property the stylesheet reads, so the cell wins without the consumer merging anything.
    expect(nameCell.style.background).toBe("rgb(9, 9, 9)");
    // Asserted together with the row tint actually being in play - on its own the line above is just
    // #345's behaviour and would stay green with #481 deleted entirely.
    expect(tr.style.getPropertyValue("--twc-dt-row-bg")).toBe("rgb(1, 1, 1)");
    const statusCell = cells.find((td) => td.textContent.includes("done"));
    expect(statusCell.style.background, "the uncovered cell has no inline background of its own").toBe("");
  });
});
