import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Datatable, Button, IconButton, FieldRow, Input, Field } from "../src/index.ts";

afterEach(cleanup);

// ---------------------------------------------------------------------------------------- #513
// "Add filter" seeded the condition from cols[0] even when that column is filterable: false. The
// condition row's column Select is offered only the FILTERABLE columns, so the seeded field was not
// among its options and the row opened on its placeholder — a blank state reachable no other way,
// which reads as a bug in the host app. The shape that triggers it is legitimate: a computed column,
// derived from child rows rather than a field on the row, genuinely cannot be filtered and is often
// the one a reader wants first.

const rows513 = [{ id: 1, owners: "x", status: "open", name: "A" }];
const cols513 = [
  { field: "owners", headerName: "Owner", filterable: false },
  { field: "status", headerName: "Status" },
  { field: "name", headerName: "Name" },
];

describe("Datatable filter seeding (#513)", () => {
  const src = readFileSync(resolve(process.cwd(), "components/data-display/Datatable.jsx"), "utf8");

  it("seeds from the first FILTERABLE column, not cols[0]", () => {
    expect(src).toContain("addFilter(filterableCols[0]?.field)");
    expect(src, "the old unconditional seed must be gone").not.toContain("addFilter(cols[0].field)");
  });

  it("addFilter itself refuses a non-filterable field, so every caller is covered", () => {
    // Resolving only at the button would leave the invariant — "the seed is a column the Select can
    // offer" — depending on each call site remembering it.
    const i = src.indexOf("function addFilter(field)");
    expect(i).toBeGreaterThan(-1);
    const body = src.slice(i, src.indexOf("\n  }", i));
    expect(body).toContain("asked.filterable !== false");
    expect(body).toContain("filterableCols[0]");
  });

  it("offers no Add filter action when nothing is filterable", () => {
    expect(src).toContain("disabled={filterableCols.length === 0}");
  });

  it("renders a grid whose first column is filterable: false without error", () => {
    const { container } = render(<Datatable rows={rows513} columns={cols513} rowKey={(r) => r.id} />);
    expect(container.querySelector(".twc-dt")).not.toBe(null);
  });
});

// ---------------------------------------------------------------------------------------- #509
// pressedTone is documented as "defaults to tone". That held for five of six tones — their pressed
// rules set the same accent trio as their unpressed ones, so the default was invisible — and failed
// for neutral, whose pressed fill is deliberately different (#430). With the attribute absent a
// pressed neutral button fell back to its unpressed --color-text border: 17.85:1 against the
// surface, about three times its success/danger neighbours, so the choice meaning "not yet" read as
// the loudest button in the row.

describe("pressedTone defaults to tone (#509)", () => {
  const pressedToneOf = (el) => el.getAttribute("data-pressed-tone");

  for (const [name, C, extra] of [["Button", Button, {}], ["IconButton", IconButton, { "aria-label": "x" }]]) {
    const root = name === "Button" ? ".twc-btn" : ".twc-iconbtn";

    it(`${name}: a pressed neutral button now carries data-pressed-tone="neutral"`, () => {
      const { container } = render(React.createElement(C, { tone: "neutral", pressed: true, ...extra }, "x"));
      expect(pressedToneOf(container.querySelector(root))).toBe("neutral");
    });

    it(`${name}: an explicit pressedTone still wins over tone`, () => {
      const { container } = render(
        React.createElement(C, { tone: "neutral", pressedTone: "success", pressed: true, ...extra }, "x"));
      expect(pressedToneOf(container.querySelector(root))).toBe("success");
    });

    it(`${name}: a NON-toggle gains no attribute`, () => {
      // `pressed` undefined means this is not a toggle at all; emitting the attribute on every
      // button in the library would be DOM noise for no behaviour.
      const { container } = render(React.createElement(C, { tone: "neutral", ...extra }, "x"));
      expect(container.querySelector(root).hasAttribute("data-pressed-tone")).toBe(false);
    });

    it(`${name}: pressed={false} still carries it, so toggling does not change the attribute set`, () => {
      const { container } = render(React.createElement(C, { tone: "success", pressed: false, ...extra }, "x"));
      expect(pressedToneOf(container.querySelector(root))).toBe("success");
    });
  }

  it("is a no-op for the five tones whose pressed rule matches their unpressed one", () => {
    // The reason this default was safe to make real: emitting data-pressed-tone="success" on a
    // success button selects a rule that sets exactly what the unpressed rule already set. primary
    // has no pressed rule at all, so it falls through to the base defaults, which are primary.
    const btn = readFileSync(resolve(process.cwd(), "components/buttons/Button.jsx"), "utf8");
    for (const tone of ["success", "warning", "info", "danger"]) {
      const unpressed = btn.slice(btn.indexOf(`.twc-btn[data-tone="${tone}"]`));
      const pressed = btn.slice(btn.indexOf(`.twc-btn[aria-pressed="true"][data-pressed-tone="${tone}"]`));
      for (const prop of ["--_accent:", "--_accent-subtle:", "--_accent-subtle-fg:"]) {
        const val = (blk) => blk.slice(blk.indexOf(prop)).split(";")[0].split(":").slice(1).join(":").trim();
        expect(val(pressed), `${tone} ${prop} differs between pressed and unpressed`).toBe(val(unpressed));
      }
    }
    expect(btn, "primary has no pressed rule, by design").not.toContain('data-pressed-tone="primary"');
  });

  it("neutral is the one tone whose pressed rule deliberately differs (#430)", () => {
    const btn = readFileSync(resolve(process.cwd(), "components/buttons/Button.jsx"), "utf8");
    const pressed = btn.slice(btn.indexOf('.twc-btn[aria-pressed="true"][data-pressed-tone="neutral"]'));
    expect(pressed.slice(0, 200)).toContain("var(--color-border)");
    expect(pressed.slice(0, 200)).toContain("var(--color-text-subtle)");
  });
});

// ---------------------------------------------------------------------------------------- #508
// reserveFooter's selector is .twc-field, so a trailing Button/IconButton in the same row had no
// lane and still rode up when a sibling field grew a footer. FieldRow owns the row instead.

describe("FieldRow (#508)", () => {
  const cells = (c) => [...c.querySelectorAll(".twc-fieldrow__cell")];

  it("wraps each child in a cell", () => {
    const { container } = render(
      <FieldRow><Input label="A" /><Button>Insert</Button></FieldRow>
    );
    expect(cells(container)).toHaveLength(2);
    expect(cells(container)[0].querySelector(".twc-field")).not.toBe(null);
    expect(cells(container)[1].querySelector(".twc-btn")).not.toBe(null);
  });

  it("turns on #494's ancestor reserve for every field inside, with no per-field prop", () => {
    const { container } = render(<FieldRow><Input label="A" /></FieldRow>);
    const row = container.querySelector(".twc-fieldrow");
    expect(row.hasAttribute("data-reserve-footer")).toBe(true);
    // the field itself needs nothing
    expect(container.querySelector(".twc-field").hasAttribute("data-reserve-footer")).toBe(false);
  });

  it("drops null/false children instead of leaving an empty cell", () => {
    // A conditionally-rendered field would otherwise leave a cell that still draws a lane and takes
    // part in the gap, i.e. a visible hole.
    const show = false;
    const { container } = render(
      <FieldRow><Input label="A" />{show && <Input label="B" />}{null}<Button>Go</Button></FieldRow>
    );
    expect(cells(container)).toHaveLength(2);
  });

  it("passes gap through as a spacing token, and a string straight through", () => {
    const { container } = render(<FieldRow gap={2}><Input label="A" /></FieldRow>);
    expect(container.querySelector(".twc-fieldrow").style.gap).toBe("var(--space-2)");
    cleanup();
    const { container: c2 } = render(<FieldRow gap="14px"><Input label="A" /></FieldRow>);
    expect(c2.querySelector(".twc-fieldrow").style.gap).toBe("14px");
  });

  it("wrap is opt-in", () => {
    const { container } = render(<FieldRow><Input label="A" /></FieldRow>);
    expect(container.querySelector(".twc-fieldrow").hasAttribute("data-wrap")).toBe(false);
    cleanup();
    const { container: c2 } = render(<FieldRow wrap><Input label="A" /></FieldRow>);
    expect(c2.querySelector(".twc-fieldrow").getAttribute("data-wrap")).toBe("true");
  });

  it("forwards its ref and accepts className/style", () => {
    const ref = React.createRef();
    const { container } = render(
      <FieldRow ref={ref} className="mine" style={{ marginTop: 4 }}><Input label="A" /></FieldRow>
    );
    expect(ref.current).toBe(container.querySelector(".twc-fieldrow"));
    expect(ref.current.className).toContain("mine");
    expect(ref.current.style.marginTop).toBe("4px");
  });

  it("gives the lane to non-field cells and the flex share to field cells", () => {
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    expect(src).toContain(".twc-fieldrow__cell:has(> .twc-field) { flex: 1 1 0; }");
    expect(src).toContain(".twc-fieldrow__cell:not(:has(> .twc-field)) { flex: 0 0 auto; }");
    expect(src).toContain('.twc-fieldrow__cell:not(:has(> .twc-field))::after');
  });

  it("builds the lane the way #494 does rather than as a length", () => {
    // Same generated content, same --text-xs, after the same --space-1-5 gap, so it matches a real
    // footer by construction instead of by a number that drifts when a token changes.
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    const BS = String.fromCharCode(92);
    expect(src).toContain(`content: "${BS}${BS}00a0"; font-size: var(--text-xs)`);
    expect(src).toContain("gap: var(--space-1-5)");
    expect(src.includes("\u0000"), "a raw NUL would make this file unreadable as text").toBe(false);
  });

  it("the Field wrapper still works, for a row the host lays out itself", () => {
    const { container } = render(<Field reserveFooter><Button>Insert</Button></Field>);
    expect(container.querySelector(".twc-field").getAttribute("data-reserve-footer")).toBe("true");
  });
});
