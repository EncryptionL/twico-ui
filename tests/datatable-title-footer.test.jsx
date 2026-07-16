import React from "react";
import { describe, it, expect } from "vitest";
import { render, within } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const bigRows = (n) => Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }));

// #252 — the paginated footer must never overshoot the total, even mid-load in server mode.
describe("Datatable footer range clamp (#252)", () => {
  const cols = [{ field: "name", headerName: "Name" }];
  const footerText = (c) => c.querySelector(".twc-dt__footer-row").textContent;

  it("client mode: last page shows the real range, not a full page width", () => {
    // 42 rows, 25/page → page 2 shows 26–42 (17 rows), not 26–50.
    const { container } = render(<Datatable columns={cols} rows={bigRows(42)} rowKey={(r) => r.id} pageSize={25} page={1} onPageChange={() => {}} />);
    const t = footerText(container);
    expect(t).toContain("26–42");
    expect(t).toContain("of 42");
    expect(t).not.toContain("26–50");
  });

  it("server mode: end is clamped to rowCount even while the new page's rows haven't loaded", () => {
    // Simulate the reported case: on the last page, `rows` is briefly the PREVIOUS full page (25 rows)
    // while `page` has already jumped past the total. end must clamp to rowCount, not overshoot.
    const total = 6042;
    const lastPage = Math.ceil(total / 25) - 1; // 241
    const { container } = render(
      <Datatable columns={cols} rows={bigRows(25)} rowKey={(r) => r.id} serverMode rowCount={total}
        pageSize={25} page={lastPage} onPageChange={() => {}} onServerChange={() => {}} />,
    );
    const nf = (n) => n.toLocaleString(); // match the component's own grouping (locale-dependent)
    const status = container.querySelector(".twc-dt__status").textContent;
    // Without the clamp this would read "…6,026–6,050 of 6,042" — end overshoots the total.
    expect(status).toBe(`Showing ${nf(6026)}–${nf(6042)} of ${nf(total)} rows`);
    expect(status).not.toContain(nf(6050));
  });
});

// #253 — truncated cell/header text carries a native `title` so the full value is visible on hover.
describe("Datatable truncation title (#253)", () => {
  const rows = [{ id: 1, name: "A very long value that would be clipped by the column", size: 42, tag: "x" }];

  it("plain string/number cells get a title equal to their displayed text", () => {
    const { container } = render(
      <Datatable columns={[{ field: "name", headerName: "Name" }, { field: "size", headerName: "Size", type: "number" }]}
        rows={rows} rowKey={(r) => r.id} />,
    );
    const cells = container.querySelectorAll("tbody .twc-dt__td");
    expect(cells[0].getAttribute("title")).toBe("A very long value that would be clipped by the column");
    expect(cells[1].getAttribute("title")).toBe("42");
  });

  it("uses the FORMATTED display text for a valueFormatter column", () => {
    const { container } = render(
      <Datatable columns={[{ field: "size", headerName: "Size", valueFormatter: (v) => `${v} cm` }]}
        rows={rows} rowKey={(r) => r.id} />,
    );
    expect(container.querySelector("tbody .twc-dt__td").getAttribute("title")).toBe("42 cm");
  });

  it("skips the title for a custom renderCell node (a title would be meaningless)", () => {
    const { container } = render(
      <Datatable columns={[{ field: "tag", headerName: "Tag", renderCell: (v) => <span data-x>{v}</span> }]}
        rows={rows} rowKey={(r) => r.id} />,
    );
    expect(container.querySelector("tbody .twc-dt__td").getAttribute("title")).toBeNull();
  });

  it("string header labels get a title", () => {
    const { container } = render(<Datatable columns={[{ field: "name", headerName: "A long header name" }]} rows={rows} rowKey={(r) => r.id} />);
    expect(within(container).getByText("A long header name").getAttribute("title")).toBe("A long header name");
  });
});
