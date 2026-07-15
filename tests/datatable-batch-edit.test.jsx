import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

const cols = [
  { field: "name", headerName: "Name", editable: true },
  { field: "city", headerName: "City", editable: true },
  { field: "role", headerName: "Role", editable: true, valueOptions: ["Admin", "Editor"] },
];
const rows = [{ id: 1, name: "Ada", city: "Rome", role: "Admin" }, { id: 2, name: "Ben", city: "Oslo", role: "Editor" }];

// The selection toolbar (which hosts the built-in Edit button) only renders when there is at least
// one `batchActions` entry, so every case supplies a neutral one.
const BA = [{ label: "Delete", onClick: () => {} }];
const selectFirstRow = (container) => fireEvent.click(container.querySelectorAll('[aria-label="Select row"]')[0]);
const editBtn = (container) => Array.from(container.querySelectorAll(".twc-dt__batch-btn")).find((b) => b.textContent.includes("Edit"));
const beRows = () => document.querySelectorAll(".twc-dt__be-row");

// #244 — the batch editor must be suppressible and must scale past ~90 editable columns.
describe("Datatable batch editor (#244)", () => {
  let orig;
  beforeEach(() => {
    orig = Element.prototype.getBoundingClientRect;
    // The floating batch-edit popover bails on all-zero rects (jsdom).
    Element.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 130, left: 100, right: 260, width: 160, height: 30, x: 100, y: 100, toJSON() {} });
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

  it("renders the built-in Edit button by default", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} />);
    selectFirstRow(container);
    expect(editBtn(container)).toBeTruthy();
  });

  it("showBatchEdit={false} suppresses it (so a host can ship its own batchActions entry)", () => {
    const { container } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection showBatchEdit={false}
        batchActions={[{ label: "Edit", onClick: () => {} }]} />,
    );
    selectFirstRow(container);
    // Only the consumer's own action remains — no duplicate built-in Edit.
    const edits = Array.from(container.querySelectorAll(".twc-dt__batch-btn")).filter((b) => b.textContent.includes("Edit"));
    expect(edits.length).toBe(1);
  });

  it("opens as an empty pick-a-column flow — no row per editable column", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} />);
    selectFirstRow(container);
    fireEvent.click(editBtn(container));
    // The scaling fix: nothing is pre-rendered; you search/pick instead.
    expect(beRows().length).toBe(0);
    expect(document.querySelector(".twc-dt__be-empty")).toBeTruthy();
    expect(document.querySelector(".twc-dt__be-add")).toBeTruthy();
    // Apply is disabled until a column is picked.
    const apply = Array.from(document.querySelectorAll(".twc-dt__cfg-btn")).find((b) => b.textContent.includes("Apply"));
    expect(apply).toBeDisabled();
  });

  it("picking a column from the searchable picker adds its row", () => {
    const { container } = render(<Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} />);
    selectFirstRow(container);
    fireEvent.click(editBtn(container));
    fireEvent.click(document.querySelector(".twc-dt__be-add .twc-sel__trigger"));
    const opt = Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent.trim() === "City");
    fireEvent.click(opt);
    expect(beRows().length).toBe(1);
    expect(beRows()[0].querySelector(".twc-dt__be-name").textContent).toBe("City");
    // and Apply is now enabled
    const apply = Array.from(document.querySelectorAll(".twc-dt__cfg-btn")).find((b) => b.textContent.includes("Apply"));
    expect(apply).not.toBeDisabled();
  });

  it("batchEditFields allow-lists which columns the picker offers", () => {
    const { container } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} batchEditFields={["city"]} />,
    );
    selectFirstRow(container);
    fireEvent.click(editBtn(container));
    fireEvent.click(document.querySelector(".twc-dt__be-add .twc-sel__trigger"));
    const labels = Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent.trim());
    expect(labels).toEqual(["City"]);
  });

  it("hides the Edit button when batchEditFields allow-lists nothing editable", () => {
    const { container } = render(
      <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} batchEditFields={[]} />,
    );
    selectFirstRow(container);
    expect(editBtn(container)).toBeFalsy();
  });

  // #249 — the built-in editor must stand alone: it used to need a batchActions entry to exist at all.
  describe("standalone without batchActions (#249)", () => {
    it("renders the selection toolbar + Edit button with no batchActions", () => {
      const { container } = render(
        <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection onBatchUpdate={() => {}} />,
      );
      selectFirstRow(container);
      expect(container.querySelector(".twc-dt__batch")).toBeTruthy();
      expect(editBtn(container)).toBeTruthy();
      // the count + clear-selection affordances come with it
      expect(container.querySelector(".twc-dt__batch-count").textContent).toBe("1 selected");
      expect(container.querySelector(".twc-dt__batch-x")).toBeTruthy();
    });

    it("the standalone editor actually applies (the RBAC case: update but not delete)", () => {
      let patch = null;
      const { container } = render(
        <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection
          batchActions={[]} /* permission-gated to empty */
          onBatchUpdate={(_c, p) => { patch = p; }} />,
      );
      selectFirstRow(container);
      fireEvent.click(editBtn(container));
      fireEvent.click(document.querySelector(".twc-dt__be-add .twc-sel__trigger"));
      fireEvent.click(Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent.trim() === "City"));
      fireEvent.change(beRows()[0].querySelector("input"), { target: { value: "Oslo" } });
      fireEvent.click(Array.from(document.querySelectorAll(".twc-dt__cfg-btn")).find((b) => b.textContent.includes("Apply")));
      expect(patch).toEqual({ city: "Oslo" });
    });

    it("no toolbar when neither the editor nor actions are available", () => {
      const { container } = render(
        <Datatable columns={cols} rows={rows} rowKey={(r) => r.id} checkboxSelection showBatchEdit={false} batchActions={[]} />,
      );
      selectFirstRow(container);
      expect(container.querySelector(".twc-dt__batch")).toBeFalsy();
    });

    it("no toolbar when no column is editable and there are no actions", () => {
      const { container } = render(
        <Datatable columns={[{ field: "name", headerName: "Name" }]} rows={rows} rowKey={(r) => r.id} checkboxSelection />,
      );
      selectFirstRow(container);
      expect(container.querySelector(".twc-dt__batch")).toBeFalsy();
    });
  });

  // #247 — the batch clause control must honor a column's custom editor, not degrade to a text input.
  describe("renderBatchEditCell (#247)", () => {
    const withCustom = [
      { field: "name", headerName: "Name", editable: true },
      {
        field: "color", headerName: "Color", editable: true,
        renderBatchEditCell: ({ value, field, commit }) => (
          <button type="button" data-testid="custom-batch-ctl" data-field={field} onClick={() => commit("teal")}>
            ctl:{String(value ?? "")}
          </button>
        ),
      },
    ];
    const pick = (container, label) => {
      fireEvent.click(editBtn(container));
      fireEvent.click(document.querySelector(".twc-dt__be-add .twc-sel__trigger"));
      fireEvent.click(Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent.trim() === label));
    };

    it("renders the column's custom control for its clause (instead of a plain input)", () => {
      const { container } = render(<Datatable columns={withCustom} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} />);
      selectFirstRow(container);
      pick(container, "Color");
      const ctl = document.querySelector('[data-testid="custom-batch-ctl"]');
      expect(ctl).toBeTruthy();
      expect(ctl.getAttribute("data-field")).toBe("color");
      // and no fallback text input in that clause
      expect(beRows()[0].querySelector("input")).toBeNull();
    });

    it("its commit() stages the draft and Apply writes it across the selection", () => {
      let patch = null;
      const { container } = render(
        <Datatable columns={withCustom} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA}
          onBatchUpdate={(_changed, p) => { patch = p; }} />,
      );
      selectFirstRow(container);
      pick(container, "Color");
      fireEvent.click(document.querySelector('[data-testid="custom-batch-ctl"]')); // commit("teal") — stages only
      expect(patch).toBeNull(); // nothing written until Apply
      expect(document.querySelector('[data-testid="custom-batch-ctl"]').textContent).toBe("ctl:teal");
      fireEvent.click(Array.from(document.querySelectorAll(".twc-dt__cfg-btn")).find((b) => b.textContent.includes("Apply")));
      expect(patch).toEqual({ color: "teal" });
    });

    it("a column without it still gets the built-in control", () => {
      const { container } = render(<Datatable columns={withCustom} rows={rows} rowKey={(r) => r.id} checkboxSelection batchActions={BA} />);
      selectFirstRow(container);
      pick(container, "Name");
      expect(document.querySelector('[data-testid="custom-batch-ctl"]')).toBeNull();
      expect(beRows()[0].querySelector("input")).toBeTruthy();
    });
  });
});
