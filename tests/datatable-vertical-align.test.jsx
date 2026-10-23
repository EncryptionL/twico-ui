import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Datatable } from "../components/data-display/Datatable.jsx";

// Vertical alignment at three levels — table default, per-row, per-column — resolved in JS and
// emitted as ONE data-valign on each <td>, so the precedence is readable in the code and cannot be
// reordered by an unrelated CSS edit.
//
// It is the transpose of the existing horizontal `column.align`: that decides where content sits
// across a column's width, this decides where it sits down a row's height. Only visible once rows
// vary in height — a wrapText column, a multi-line renderCell, or a drag-resized row.

const rows = [
  { id: "a", name: "Alpha", notes: "a long note that wraps onto several lines", n: 1 },
  { id: "b", name: "Beta", notes: "short", n: 2 },
];
const rowKey = (r) => r.id;
const base = [{ field: "name", label: "Name" }, { field: "notes", label: "Notes" }];

afterEach(cleanup);

/** data-valign for each body cell of row `ri`. */
const valigns = (c, ri = 0) =>
  [...c.querySelectorAll("tbody tr.twc-dt__row")[ri].querySelectorAll("td.twc-dt__td")]
    .map((td) => td.getAttribute("data-valign"));

describe("Datatable vertical alignment", () => {
  it("emits nothing when no level sets it, so existing tables are untouched", () => {
    const { container } = render(<Datatable rows={rows} columns={base} rowKey={rowKey} />);
    expect(valigns(container)).toEqual([null, null]);
  });

  it("the table default reaches every cell", () => {
    const { container } = render(<Datatable rows={rows} columns={base} rowKey={rowKey} verticalAlign="top" />);
    expect(valigns(container)).toEqual(["top", "top"]);
    expect(valigns(container, 1)).toEqual(["top", "top"]);
  });

  it("a column overrides the table default on its own cells only", () => {
    const { container } = render(
      <Datatable rows={rows} rowKey={rowKey} verticalAlign="top"
        columns={[{ field: "name", label: "Name" }, { field: "notes", label: "Notes", verticalAlign: "bottom" }]} />
    );
    expect(valigns(container)).toEqual(["top", "bottom"]);
  });

  it("a row overrides the table default, across that row only", () => {
    const { container } = render(
      <Datatable rows={rows} columns={base} rowKey={rowKey} verticalAlign="middle"
        getRowVerticalAlign={(r) => (r.id === "a" ? "top" : undefined)} />
    );
    expect(valigns(container, 0)).toEqual(["top", "top"]);
    expect(valigns(container, 1), "the other row falls back to the table default").toEqual(["middle", "middle"]);
  });

  it("the column wins over the row — the documented precedence", () => {
    // This is the case the ordering exists for: a row-wide sweep should not drag an actions column
    // or a status badge off centre. Reversing the precedence would break that silently, so assert
    // it directly rather than trusting the resolve order to stay put.
    const { container } = render(
      <Datatable rows={rows} rowKey={rowKey} verticalAlign="middle"
        getRowVerticalAlign={() => "top"}
        columns={[{ field: "name", label: "Name" }, { field: "notes", label: "Notes", verticalAlign: "middle" }]} />
    );
    expect(valigns(container)).toEqual(["top", "middle"]);
  });

  it("full precedence chain in one render: column > row > table", () => {
    const { container } = render(
      <Datatable rows={rows} rowKey={rowKey} verticalAlign="bottom"
        getRowVerticalAlign={(r) => (r.id === "a" ? "top" : undefined)}
        columns={[
          { field: "name", label: "Name" },                                 // row, then table
          { field: "notes", label: "Notes", verticalAlign: "middle" },      // column always
        ]} />
    );
    expect(valigns(container, 0), "row a: row value, column override").toEqual(["top", "middle"]);
    expect(valigns(container, 1), "row b: table value, column override").toEqual(["bottom", "middle"]);
  });

  it("getRowVerticalAlign receives (row, index), page-relative like getRowStyle", () => {
    const seen = [];
    render(
      <Datatable rows={rows} columns={base} rowKey={rowKey}
        getRowVerticalAlign={(row, index) => { seen.push([row.id, index]); return undefined; }} />
    );
    // a render-time accessor runs once per row per render, so compare the distinct pairs
    expect(new Set(seen.map(([id, i]) => `${id}:${i}`))).toEqual(new Set(["a:0", "b:1"]));
  });

  it("returning undefined from the row hook falls through rather than clearing", () => {
    const { container } = render(
      <Datatable rows={rows} columns={base} rowKey={rowKey} verticalAlign="bottom"
        getRowVerticalAlign={() => undefined} />
    );
    expect(valigns(container)).toEqual(["bottom", "bottom"]);
  });
});

describe("the CSS behind it", () => {
  const src = readFileSync(resolve(process.cwd(), "components/data-display/Datatable.jsx"), "utf8");

  it("has a rule for each of the three values", () => {
    for (const v of ["top", "middle", "bottom"]) {
      expect(src).toContain(`.twc-dt__td[data-valign="${v}"] { vertical-align: ${v}; }`);
    }
  });

  it("resolves precedence in JS, not as competing selectors", () => {
    // Three CSS rules racing on specificity would be reorderable by an unrelated edit; one
    // resolved attribute is not. If this ever becomes three selectors, the precedence tests above
    // could still pass while the real order changed.
    expect(src).toContain("data-valign={c.verticalAlign ?? rowValign ?? verticalAlign}");
    expect(src, "no row-level or table-level valign selector should exist").not.toMatch(
      /\.twc-dt__row\[data-valign|\.twc-dt__table\[data-valign/
    );
  });

  it("an explicit value still beats the wrapText default", () => {
    // wrapText cells are top-aligned by their own rule; data-valign is more specific, so a column
    // or row that asks for middle/bottom on a wrapped column actually gets it.
    const wrapRule = src.indexOf('.twc-dt__td[data-wrap="true"]');
    const valignRule = src.indexOf('.twc-dt__td[data-valign="top"]');
    expect(wrapRule).toBeGreaterThan(-1);
    expect(valignRule, "the valign rules must come after the wrap rule").toBeGreaterThan(wrapRule);
  });

  it("a wrapped column can be re-aligned explicitly", () => {
    const { container } = render(
      <Datatable rows={rows} rowKey={rowKey}
        columns={[{ field: "name", label: "Name" }, { field: "notes", label: "Notes", wrapText: true, verticalAlign: "bottom" }]} />
    );
    const tds = [...container.querySelectorAll("tbody tr.twc-dt__row")[0].querySelectorAll("td.twc-dt__td")];
    expect(tds[1].getAttribute("data-wrap")).toBe("true");
    expect(tds[1].getAttribute("data-valign")).toBe("bottom");
  });
});
