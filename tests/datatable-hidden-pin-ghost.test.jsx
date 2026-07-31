import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #302 — hiding a pinned column then keeping another pinned left left a GHOST pinned column: stickyOf
// accumulated the sticky offset over the RAW pins arrays (which still hold the hidden field), so the
// visible pinned column reserved width for a column with no cell, and the pin-edge shadow landed on the
// wrong column. The layout must derive from the *visible* pinned columns; `pins` stays raw so un-hiding restores.

const columns = [
  { field: "a", headerName: "Alpha", pinned: "left", width: 120 },
  { field: "b", headerName: "Bravo", pinned: "left", width: 120 },
  { field: "c", headerName: "Charlie", width: 120 },
];
const rows = [{ id: 1, a: "a1", b: "b1", c: "c1" }];
const th = (c, name) => Array.from(c.querySelectorAll(".twc-dt__th")).find((el) => (el.textContent || "").includes(name));

describe("Datatable hidden pinned column leaves no ghost (#302)", () => {
  it("offsets a later left-pin by the earlier VISIBLE pin's width; the last visible pin carries the edge", () => {
    const { container } = render(<Datatable columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const alpha = th(container, "Alpha");
    const bravo = th(container, "Bravo");
    expect(alpha.style.insetInlineStart).toBe("0px");
    expect(bravo.style.insetInlineStart).toBe("120px"); // offset by Alpha's 120px
    expect(alpha.getAttribute("data-pin-edge")).toBeNull(); // not the last left pin
    expect(bravo.getAttribute("data-pin-edge")).toBe("left"); // last visible left pin
  });

  it("pins the visible column flush to the lead gutter (0) when the earlier pinned column is hidden — no ghost slot", () => {
    const { container } = render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id} initialState={{ columnVisibility: { a: false } }} />
    );
    expect(th(container, "Alpha")).toBeFalsy(); // hidden → no header cell
    const bravo = th(container, "Bravo");
    expect(bravo).toBeTruthy();
    expect(bravo.style.insetInlineStart).toBe("0px");   // NOT 120px — hidden Alpha reserves nothing
    expect(bravo.getAttribute("data-pin-edge")).toBe("left"); // now the only/last visible left pin
  });

  it("keeps the raw pin state so the persisted snapshot still records the hidden column as pinned", () => {
    const onStateChange = (s) => { last = s; };
    let last = null;
    render(
      <Datatable columns={columns} rows={rows} rowKey={(r) => r.id}
        initialState={{ columnVisibility: { a: false } }} onStateChange={onStateChange} stateKey="dt-302" />
    );
    // the persisted columnPinning still lists the hidden field (un-hiding restores its pin position)
    const stored = JSON.parse(window.localStorage.getItem("dt-302"));
    expect(stored.columnPinning.a).toBe("left");
    expect(stored.columnPinning.b).toBe("left");
  });
});
