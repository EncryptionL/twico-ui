import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #298 — `stateKey` view-state persistence was clobbered under React Strict Mode (dev double-mount)
// and, separately, when `columns` loaded asynchronously (empty at mount). Both wrote DEFAULT/emptied
// state over the saved snapshot, so a refresh looked empty. The fix: (1) the restore effect resets
// stateReadyRef on cleanup so a Strict Mode setup→cleanup→setup can't persist defaults before restore
// re-runs; (2) restore is deferred until `columns` exist, and applied at most once.

const DT_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "data-display", "Datatable.jsx");
const columns = [
  { field: "name", headerName: "Name" },
  { field: "age", headerName: "Age", type: "number" },
];
const many = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Row ${i}`, age: i }));
const status = (c) => c.querySelector(".twc-dt__status").textContent;
const headerNames = (c) => Array.from(c.querySelectorAll(".twc-dt__th-label")).map((el) => el.textContent);
const SAVED = { page: 1, pageSize: 10, density: "compact", sort: { field: "name", dir: "desc" }, columnVisibility: { age: false } };

describe("Datatable stateKey persistence under React Strict Mode (#298)", () => {
  beforeEach(() => window.localStorage.clear());

  it("resets stateReadyRef on the restore effect's cleanup (re-gates the persist effect across a remount)", () => {
    const src = readFileSync(DT_SRC, "utf8");
    // the restore effect must return a cleanup that clears the write gate
    expect(src).toMatch(/return \(\) => \{ stateReadyRef\.current = false; \};/);
    // and restore must be gated on columns existing (async-columns resilience)
    expect(src).toMatch(/if \(columns\.length\) \{ restoreState\(\); stateReadyRef\.current = true; \}/);
  });

  it("preserves (does not clobber) the saved state through a Strict Mode double-mount", () => {
    window.localStorage.setItem("dt-sm", JSON.stringify(SAVED));
    const { container } = render(
      <React.StrictMode>
        <Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} stateKey="dt-sm" />
      </React.StrictMode>
    );
    // UI reflects the RESTORED (not default) state
    expect(status(container)).toContain("11–20"); // page 1
    expect(container.querySelector(".twc-dt").getAttribute("data-density")).toBe("compact");
    expect(container.querySelector('.twc-dt__th[data-sorted="desc"]')).toBeTruthy();
    expect(headerNames(container)).not.toContain("Age"); // age hidden
    // localStorage was NOT overwritten with defaults — it still holds the compact/age-hidden snapshot
    const stored = JSON.parse(window.localStorage.getItem("dt-sm"));
    expect(stored.density).toBe("compact");
    expect(stored.columnVisibility.age).toBe(false);
    expect(stored.sort).toEqual({ field: "name", dir: "desc" });
  });
});

// #298 (related) — restore must survive an async column catalogue (columns empty at mount, populated later).
describe("Datatable stateKey persistence with async columns (#298)", () => {
  beforeEach(() => window.localStorage.clear());

  it("does not clobber the saved snapshot while columns are empty, then restores once they arrive", () => {
    window.localStorage.setItem("dt-async", JSON.stringify(SAVED));
    const { container, rerender } = render(
      <Datatable columns={[]} rows={many} rowKey={(r) => r.id} pageSize={10} stateKey="dt-async" />
    );
    // While columns are empty the write gate stays closed, so the seeded snapshot is untouched.
    expect(JSON.parse(window.localStorage.getItem("dt-async")).columnVisibility.age).toBe(false);

    // Columns arrive → the saved state is restored (age hidden, compact, sort, page).
    rerender(<Datatable columns={columns} rows={many} rowKey={(r) => r.id} pageSize={10} stateKey="dt-async" />);
    expect(headerNames(container)).not.toContain("Age");
    expect(container.querySelector(".twc-dt").getAttribute("data-density")).toBe("compact");
    expect(container.querySelector('.twc-dt__th[data-sorted="desc"]')).toBeTruthy();
    expect(status(container)).toContain("11–20");
    // and the persisted snapshot still reflects it (not emptied)
    expect(JSON.parse(window.localStorage.getItem("dt-async")).columnVisibility.age).toBe(false);
  });
});
