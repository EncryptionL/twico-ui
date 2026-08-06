import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Datatable } from "../components/data-display/Datatable.jsx";

// #339 — `columnCombining` lets end-users build combined columns from a column's ⋮ menu at runtime:
// "Combine columns…" opens an editor to fold other columns into this one (they hide); Uncombine restores;
// the choice persists via stateKey.
const cols = [
  { field: "name", headerName: "Name" },
  { field: "email", headerName: "Email" },
  { field: "country", headerName: "Country" },
];
const rows = [
  { id: 1, name: "Ada", email: "ada@twico.dev", country: "GB" },
  { id: 2, name: "Alan", email: "alan@twico.dev", country: "GB" },
];
const RECT = { top: 100, bottom: 120, left: 100, right: 260, width: 160, height: 20, x: 100, y: 100, toJSON() {} };
const openColMenu = (c, i = 0) => fireEvent.click(c.querySelectorAll(".twc-dt__menu-btn")[i]);
const menuItem = (c, text) => Array.from(c.querySelectorAll('[role="menuitem"]')).find((b) => b.textContent.includes(text));
const editorEl = (c) => c.querySelector('[role="dialog"][aria-label^="Combine columns into"]');
const headerText = (c) => Array.from(c.querySelectorAll("thead th")).map((th) => th.textContent).join("|");

describe("Datatable columnCombining — runtime combine menu (#339)", () => {
  let orig;
  beforeEach(() => {
    window.localStorage.clear();
    orig = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => RECT;
  });
  afterEach(() => { Element.prototype.getBoundingClientRect = orig; });

  it("no 'Combine columns…' item unless columnCombining is set", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} />);
    openColMenu(container, 0);
    expect(menuItem(container, "Combine columns")).toBeUndefined();
  });

  it("adds 'Combine columns…' to the ⋮ menu when columnCombining is on", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} columnCombining />);
    openColMenu(container, 0);
    expect(menuItem(container, "Combine columns")).toBeTruthy();
  });

  it("combining folds a column into the target (merged cell) and hides the source", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} columnCombining />);
    expect(headerText(container)).toContain("Email");
    openColMenu(container, 0); // Name's ⋮
    fireEvent.click(menuItem(container, "Combine columns"));
    const ed = editorEl(container);
    expect(ed).toBeTruthy();
    fireEvent.click(Array.from(ed.querySelectorAll(".twc-dt__col-row")).find((r) => r.textContent.includes("Email")));
    fireEvent.click(ed.querySelector(".twc-dt__combine-apply"));
    const cell = container.querySelector("tbody tr.twc-dt__row .twc-dt__combine");
    expect(cell).toBeTruthy();
    expect(cell.textContent).toContain("Ada");
    expect(cell.textContent).toContain("ada@twico.dev");
    expect(headerText(container)).not.toContain("Email"); // source column hidden
  });

  it("Uncombine restores the hidden source column", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} columnCombining />);
    // combine Email into Name
    openColMenu(container, 0);
    fireEvent.click(menuItem(container, "Combine columns"));
    let ed = editorEl(container);
    fireEvent.click(Array.from(ed.querySelectorAll(".twc-dt__col-row")).find((r) => r.textContent.includes("Email")));
    fireEvent.click(ed.querySelector(".twc-dt__combine-apply"));
    expect(headerText(container)).not.toContain("Email");
    // reopen (now "Edit combined column…") and Uncombine
    openColMenu(container, 0);
    fireEvent.click(menuItem(container, "Edit combined column") || menuItem(container, "Combine columns"));
    ed = editorEl(container);
    fireEvent.click(ed.querySelector(".twc-dt__link")); // "Uncombine"
    expect(headerText(container)).toContain("Email"); // restored
    expect(container.querySelector("tbody tr.twc-dt__row .twc-dt__combine")).toBeNull();
  });

  it("persists a user combine to localStorage (columnCombine)", () => {
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} columnCombining stateKey="dt-339" />);
    openColMenu(container, 0);
    fireEvent.click(menuItem(container, "Combine columns"));
    const ed = editorEl(container);
    fireEvent.click(Array.from(ed.querySelectorAll(".twc-dt__col-row")).find((r) => r.textContent.includes("Email")));
    fireEvent.click(ed.querySelector(".twc-dt__combine-apply"));
    const stored = JSON.parse(window.localStorage.getItem("dt-339"));
    expect(stored.columnCombine.name.fields).toEqual(["name", "email"]);
  });

  it("restores a persisted user combine on mount (source hidden, target combined)", () => {
    const initialState = { columnCombine: { name: { fields: ["name", "email"], layout: "inline", labels: false } } };
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} columnCombining initialState={initialState} />);
    expect(headerText(container)).not.toContain("Email"); // source hidden from restore
    const cell = container.querySelector("tbody tr.twc-dt__row .twc-dt__combine");
    expect(cell.textContent).toContain("ada@twico.dev");
  });

  it("refcount: uncombining one of two combines that share a source keeps the source hidden", () => {
    // both Name and Email fold in Country; hidden-ness is DERIVED, so it's reference-counted automatically
    const initialState = { columnCombine: { name: { fields: ["name", "country"] }, email: { fields: ["email", "country"] } } };
    const { container } = render(<Datatable rowKey={(r) => r.id} rows={rows} columns={cols} columnCombining initialState={initialState} />);
    expect(headerText(container)).not.toContain("Country");
    openColMenu(container, 0); // Name's ⋮ → Edit → Uncombine
    fireEvent.click(menuItem(container, "Edit combined column") || menuItem(container, "Combine columns"));
    fireEvent.click(editorEl(container).querySelector(".twc-dt__link"));
    expect(headerText(container)).not.toContain("Country"); // still hidden — Email still combines it
  });

  it("diff mode honours a runtime combine (added row shows the merged value, not blank)", () => {
    const from = [{ id: 1, name: "Ada", email: "ada@twico.dev", country: "GB" }];
    const to = [...from, { id: 2, name: "Alan", email: "alan@twico.dev", country: "GB" }];
    const initialState = { columnCombine: { name: { fields: ["name", "email"] } } };
    const { container } = render(<Datatable diff={{ from, to, rowKey: (r) => r.id }} columns={cols} columnCombining initialState={initialState} />);
    const body = container.querySelector("tbody").textContent;
    expect(body).toContain("Alan");
    expect(body).toContain("alan@twico.dev"); // combined value rendered for the added row
  });
});
