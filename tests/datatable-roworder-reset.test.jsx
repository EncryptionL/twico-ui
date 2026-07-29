import React from "react";
import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");

// #296 — with rowReorder in serverMode, a drag sets an INTERNAL rowOrder overlay that used to keep
// re-applying to every `rows` prop forever. So a parent could neither revert a rejected drop nor
// reflect a server-corrected order without remounting. The fix resets the overlay whenever `rows`
// changes (server mode only — in client mode the overlay is the source of truth and must survive).

const columns = [{ field: "name", headerName: "Name" }];
const mk = () => [
  { id: "a", name: "Ava" },
  { id: "b", name: "Liam" },
  { id: "c", name: "Cara" },
];

// A minimal DataTransfer stand-in — jsdom doesn't provide one, and the drag handlers call setData.
const makeDT = () => { const store = {}; return { effectAllowed: "", dropEffect: "", setData: (k, v) => { store[k] = String(v); }, getData: (k) => store[k] || "" }; };

const rowNames = (c) => [...c.querySelectorAll("tbody tr.twc-dt__row")].map((tr) => {
  const td = [...tr.querySelectorAll("td.twc-dt__td")].find((n) => /Ava|Liam|Cara/.test(n.textContent || ""));
  return td ? td.textContent.trim() : "";
});
const rowFor = (c, name) => [...c.querySelectorAll("tbody tr.twc-dt__row")].find((tr) => (tr.textContent || "").includes(name));

describe("Datatable serverMode rowReorder overlay resets on rows change (#296)", () => {
  it("resets the internal drag order in server mode whenever a new `rows` prop arrives", () => {
    const src = readFileSync(DT_SRC, "utf8");
    // the reset must be gated on serverMode and keyed off the `rows` prop
    expect(src).toMatch(/if\s*\(\s*serverMode\s*\)\s*setRowOrder\(null\)/);
    expect(src).toMatch(/\[\s*rows\s*,\s*serverMode\s*\]\)/);
  });

  it("optimistically reorders on drag, then reverts to the fresh `rows` order on a rows-prop change", () => {
    const onRowOrderChange = vi.fn();
    const { container, rerender } = render(
      <Datatable columns={columns} rows={mk()} rowKey={(r) => r.id} serverMode rowReorder onRowOrderChange={onRowOrderChange} />
    );
    expect(rowNames(container)).toEqual(["Ava", "Liam", "Cara"]);

    // Drag Ava onto Cara. jsdom rects are all-zero, so clientY 0 lands the drop BEFORE the target.
    const src = rowFor(container, "Ava");
    const tgt = rowFor(container, "Cara");
    fireEvent.dragStart(src, { dataTransfer: makeDT() });
    fireEvent.dragOver(tgt, { clientY: 0 });
    fireEvent.drop(tgt, { dataTransfer: makeDT() });

    // Optimistic overlay applied: [b, a, c].
    expect(rowNames(container)).toEqual(["Liam", "Ava", "Cara"]);
    expect(onRowOrderChange).toHaveBeenCalledWith(["b", "a", "c"]);

    // Parent reloads the authoritative order (rejected reorder / server correction) — a NEW rows array
    // in the original order. The overlay must clear so the fresh rows win (snap back, no remount).
    rerender(
      <Datatable columns={columns} rows={mk()} rowKey={(r) => r.id} serverMode rowReorder onRowOrderChange={onRowOrderChange} />
    );
    expect(rowNames(container)).toEqual(["Ava", "Liam", "Cara"]);
  });

  it("keeps the drag order across a rows-prop change in CLIENT mode (overlay is the source of truth)", () => {
    const { container, rerender } = render(
      <Datatable columns={columns} rows={mk()} rowKey={(r) => r.id} rowReorder onRowOrderChange={() => {}} />
    );
    const src = rowFor(container, "Ava");
    const tgt = rowFor(container, "Cara");
    fireEvent.dragStart(src, { dataTransfer: makeDT() });
    fireEvent.dragOver(tgt, { clientY: 0 });
    fireEvent.drop(tgt, { dataTransfer: makeDT() });
    expect(rowNames(container)).toEqual(["Liam", "Ava", "Cara"]);

    // A client-mode rows update (e.g. a cell edit produced a new array) must NOT wipe the manual sort.
    rerender(
      <Datatable columns={columns} rows={mk()} rowKey={(r) => r.id} rowReorder onRowOrderChange={() => {}} />
    );
    expect(rowNames(container)).toEqual(["Liam", "Ava", "Cara"]);
  });
});
