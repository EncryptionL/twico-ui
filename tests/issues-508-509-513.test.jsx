import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Datatable, Button, IconButton, FieldRow, Input, Field, Checkbox } from "../src/index.ts";

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
    // #522 made primary a real rule. It was the one member of the Tone scale that selected nothing,
    // so pressedTone="primary" was inert: a pressed <Button tone="danger" pressedTone="primary">
    // kept resolving from .twc-btn[data-tone="danger"] (0,2,0) and painted red, and ToggleGroup -
    // which passes an item's tone through as pressedTone (ToggleGroup.jsx:96) - lost #411's
    // per-item colour for primary alone.
    // It is asserted separately from the loop above because primary has NO unpressed
    // .twc-btn[data-tone="primary"] block to compare against: primary IS the base default, which is
    // exactly why the gap was invisible until a non-primary `tone` was paired with it.
    for (const file of [btn, readFileSync(resolve(process.cwd(), "components/buttons/IconButton.jsx"), "utf8")]) {
      const root = file === btn ? "twc-btn" : "twc-iconbtn";
      const i = file.indexOf(`.${root}[aria-pressed="true"][data-pressed-tone="primary"]`);
      expect(i, `#522: ${root} must have a pressed rule for primary like every other tone`).toBeGreaterThan(-1);
      const rule = file.slice(i, file.indexOf("}", i));
      expect(rule).toContain("--_accent: var(--color-primary)");
      expect(rule).toContain("--_accent-subtle: var(--color-primary-subtle)");
      expect(rule).toContain("--_accent-subtle-fg: var(--color-primary-subtle-fg)");
    }
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

  it("#519: does NOT broadcast #494's ancestor attribute", () => {
    // The first cut set data-reserve-footer on the row, which switched on #494's DESCENDANT rule and
    // therefore reached every nested field root too - a CurrencyField's picker Select, a
    // DateTimePicker's two pickers, each of a FilterBar's filters - stacking a second lane under the
    // one the cell already draws. One mechanism only: the cell owns the lane.
    const { container } = render(<FieldRow><Input label="A" /></FieldRow>);
    expect(container.querySelector(".twc-fieldrow").hasAttribute("data-reserve-footer")).toBe(false);
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
    // #527: a band row has no row axis to gap — its three tracks are label/control/footer and their
    // 6px lives on the parts' own margins — so the prop drives COLUMN gap there, and row-gap is
    // pinned to 0 so a host's own `gap` cannot prise the bands apart. A wrapping row is still flex
    // and still gaps both ways.
    const { container } = render(<FieldRow gap={2}><Input label="A" /></FieldRow>);
    const row = container.querySelector(".twc-fieldrow");
    expect(row.style.columnGap).toBe("var(--space-2)");
    expect(row.style.rowGap).toBe("0px");
    cleanup();
    const { container: c2 } = render(<FieldRow gap="14px"><Input label="A" /></FieldRow>);
    expect(c2.querySelector(".twc-fieldrow").style.columnGap).toBe("14px");
    cleanup();
    const { container: c3 } = render(<FieldRow wrap gap={2}><Input label="A" /></FieldRow>);
    expect(c3.querySelector(".twc-fieldrow").style.gap, "a wrapping row stays flex").toBe("var(--space-2)");
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

  it("#519: stretches by default and tests the FOOTER at any depth, not the field root", () => {
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    // The direct-child tests are gone. They were the defect: a field behind a Tooltip or a host div
    // satisfied #494's descendant rule and failed `:has(> .twc-field)`, so it drew BOTH lanes.
    expect(src, "the direct-child field test must be gone as a RULE (the comment may still cite it)")
      .not.toMatch(/^\s*\.twc-fieldrow__cell:(not\(:)?has\(>\s*\.twc-field\)/m);
    expect(src, "stretch is the default, so an unknown child cannot be mis-sized").toContain("flex: 1 1 0;");
    // The lane asks "is there already a footer in here?", which also catches the two footers no
    // .twc-field test can see: Slider wraps one in .twc-slider__msgs, FileUpload puts a bare error
    // under .twc-upload.
    expect(src).toContain(
      ".twc-fieldrow__cell:not(:has(> * + *)):not(:has(.twc-field__footer, .twc-field__hint, .twc-field__error, .twc-fieldrow, [data-reserve-footer]))::after");
    // ...and the suppression rule, so a host's data-reserve-footer on an ANCESTOR of the row (a
    // documented pattern) cannot reach the fields inside and stack a lane under the cell's.
    expect(src).toContain(
      ".twc-fieldrow .twc-fieldrow__cell:not(:has(> * + *)) .twc-field:not([data-reserve-footer])::after { content: none; }");
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

  // ------------------------------------------------------------------------------------- #521
  it("#521: drops every falsy child, not just null", () => {
    // React.Children.map already normalises undefined/true/false to null, so the old `=== false`
    // clause was unreachable - while "" and 0, which the {cond && <X/>} idiom actually produces,
    // survived and each got a cell that drew a lane and consumed a gap: a blank column where a
    // conditionally-rendered field is hidden. Measured 3.3px wide, shifting the first real field by
    // 15.3px; the `0` case additionally rendered the literal text "0".
    const empty = "";
    const zero = 0;
    const { container } = render(
      <FieldRow>{empty && <Input label="X" />}{zero && <Input label="Y" />}<Input label="A" /><Input label="B" /></FieldRow>
    );
    expect(container.querySelectorAll(".twc-fieldrow__cell")).toHaveLength(2);
    // and nothing leaked out unwrapped either - a bare text run would become an anonymous flex item
    expect(container.querySelector(".twc-fieldrow").textContent).not.toContain("0");
  });

  it("#521: flattens a fragment into separate cells", () => {
    // Children.map does not descend into a fragment, so both fields landed in ONE cell - and a cell
    // is a flex COLUMN, so they stacked 97px apart instead of forming a row.
    const { container } = render(
      <FieldRow><><Input label="First" /><Input label="Last" /></><Button>Go</Button></FieldRow>
    );
    const cells = [...container.querySelectorAll(".twc-fieldrow__cell")];
    expect(cells).toHaveLength(3);
    expect(cells[0].querySelectorAll(".twc-field")).toHaveLength(1);
    expect(cells[1].querySelectorAll(".twc-field")).toHaveLength(1);
    expect(cells[2].querySelector(".twc-btn")).not.toBe(null);
  });

  it("#521: a component returning a fragment stays one cell, by design", () => {
    // Nothing can see through a render, so this is a documented limit rather than a bug.
    const NameFields = () => (<><Input label="First" /><Input label="Last" /></>);
    const { container } = render(<FieldRow><NameFields /><Button>Go</Button></FieldRow>);
    expect(container.querySelectorAll(".twc-fieldrow__cell")).toHaveLength(2);
  });

  it("#519: normalises the two controls whose own footer offset differs", () => {
    // Slider puts its message under margin-top: var(--space-2) (8px) and FileUpload's root gap is
    // var(--space-3) (12px), against the field family's var(--space-1-5). Measured in Chromium that
    // left them 2px and 6px out of line even with the lane correct, so a cell normalises just the
    // footer offset - FileUpload by compensation, because its gap also spaces the file list.
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    expect(src).toContain(".twc-fieldrow__cell .twc-slider__msgs { margin-block-start: var(--space-1-5); }");
    expect(src).toContain(
      ".twc-fieldrow__cell .twc-upload > .twc-field__error { margin-block-start: calc(var(--space-1-5) - var(--space-3)); }");
  });

  // ------------------------------------------------------------------- #524, #525, #526
  it("#524: minChildWidth sets the wrap floor on the cell, which hosts cannot reach", () => {
    // The floor is load-bearing - a condition row sized for a 1366px laptop has to say where it
    // breaks - and it was unexpressible: minWidth on the FIELD is overridden by the cell's own
    // min-inline-size, and a wrapper div is the thing FieldRow exists to remove. Same name and
    // semantics as Grid's prop.
    const { container } = render(<FieldRow wrap minChildWidth="11rem"><Input label="A" /></FieldRow>);
    expect(container.querySelector(".twc-fieldrow").style.getPropertyValue("--twc-fieldrow-min")).toBe("11rem");
    cleanup();
    const { container: c2 } = render(<FieldRow wrap minChildWidth={176}><Input label="A" /></FieldRow>);
    expect(c2.querySelector(".twc-fieldrow").style.getPropertyValue("--twc-fieldrow-min")).toBe("176px");
    cleanup();
    // absent by default, so the stylesheet's own 10rem fallback applies
    const { container: c3 } = render(<FieldRow wrap><Input label="A" /></FieldRow>);
    expect(c3.querySelector(".twc-fieldrow").style.getPropertyValue("--twc-fieldrow-min")).toBe("");
  });

  it("#525: a component returning a fragment gets a ROW cell with per-field lanes", () => {
    // Nothing can see through a render, so toCells cannot split it - React.Children only ever sees
    // the one component element. A cell is a COLUMN, so the pair stacked vertically: not a subtle
    // misalignment but a different layout. `:has(> * + *)` identifies it exactly, because every
    // other cell has exactly one child.
    const Pair = () => (<><Input label="First" /><Input label="Last" /></>);
    const { container } = render(<FieldRow><Pair /><Button>Add</Button></FieldRow>);
    const cells = [...container.querySelectorAll(".twc-fieldrow__cell")];
    expect(cells).toHaveLength(2);
    expect(cells[0].children).toHaveLength(2); // the fragment's two fields, in one cell
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    expect(src).toContain(".twc-fieldrow__cell:has(> * + *) { flex-direction: row;");
    // the cell's own lane would sit BESIDE the fields as another row item, so it is suppressed and
    // each inner field carries #494's lane instead...
    expect(src).toContain(".twc-fieldrow__cell:has(> * + *) > .twc-field:not(:has(> .twc-field__footer, > .twc-field__hint, > .twc-field__error))::after");
    // ...which only works because the suppression rule skips such a cell: at (0,4,1) it was
    // outranking those lanes, leaving the pair with none while the button's cell kept one, 24px out.
    expect(src).toContain(".twc-fieldrow__cell:not(:has(> * + *)) .twc-field:not([data-reserve-footer])::after");
  });

  it("#526: footerLines makes the reserve expressible, and the constraint is documented", () => {
    // The lane reserves whole LINES, so a field whose real hint wraps to two is a line taller and
    // its control lifts by 18px. Measured: the same row is 0px out with a one-line hint and 54px out
    // when it wraps to four. FieldRow cannot equalise that - it needs each cell to contribute a
    // control part and a footer part as separate grid items, and a field's footer lives INSIDE the
    // single .twc-field element - so the reserve is settable and the limit is written down.
    const { container } = render(<FieldRow footerLines={2}><Input label="A" /><Button>Go</Button></FieldRow>);
    expect(container.querySelector(".twc-fieldrow").style.getPropertyValue("--twc-fieldrow-footer-lines")).toBe("2");
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    expect(src).toContain("--twc-fieldrow-footer-lines");
    const dts = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.d.ts"), "utf8");
    expect(dts, "the wrapping-footer limit must be stated in the props contract").toContain("#526");
    expect(dts).toContain("footerLines?: number;");
  });

  // ---------------------------------------------------------------------------------- #527
  it("#527: a non-wrapping row is a three-track band, and a wrapping row stays flex", () => {
    // The lane reserved whole LINES, so a hint that wrapped past the reserve lifted its control -
    // measured 0px with a one-line hint and 54px when it wrapped to four, and it tracks the cell's
    // RENDERED width, so no reserve can bound it. A shared band can: label / control / footer, each
    // track sized to its tallest member, so every control bottom lands on one line by construction.
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    expect(src).toContain("grid-template-rows: subgrid");
    // the band's floor is the lane it replaces, so footerLines keeps meaning something
    expect(src).toContain("var(--twc-fieldrow-footer-lines, 1) * var(--text-xs)");
    // wrap keeps the flex path byte for byte: grid has no flex-wrap, and minChildWidth is a
    // flex-basis floor that only means anything with wrap.
    expect(src).toContain("const ROW = ");
    expect(src).toContain("twc-fieldrow:not([data-wrap=");

    const { container } = render(
      <FieldRow><Input label="A" /><Input label="B" hint="A hint." /><Button>Go</Button></FieldRow>
    );
    const row = container.querySelector(".twc-fieldrow");
    // one column per cell, each an equal share unless the sheet flips it to `auto`. The track LIST
    // has to be on the container, and only the container knows the cell count - which is the whole
    // reason a grid row can still express flex's stretch-vs-natural.
    expect(row.style.gridTemplateColumns).toBe(
      "var(--twc-fieldrow-c1, minmax(0, 1fr)) var(--twc-fieldrow-c2, minmax(0, 1fr)) var(--twc-fieldrow-c3, minmax(0, 1fr))");
    cleanup();
    const { container: c2 } = render(<FieldRow wrap><Input label="A" /><Button>Go</Button></FieldRow>);
    expect(c2.querySelector(".twc-fieldrow").style.gridTemplateColumns, "a wrapping row is flex").toBe("");
  });

  // ------------------------------------------------------------------------- #530 / #531 / #532
  it("#530: a wrapping fragment cell passes the floor to its fields and wraps within itself", () => {
    // #524 put the floor on the CELL, and a component returning a fragment is ONE cell - so when
    // every field comes from one shared component that cell IS the row: a single flex item with
    // nothing to break against. Measured at 1.51.1 with minChildWidth="15rem" (240px): a 520px
    // container gave [168,168,168] on ONE line, 72px under the floor, where the hand-laid
    // equivalent gives [256,256,520] on two. After the fix the component matches the hand-laid row
    // exactly: 760px [248,248,248] unchanged, 520px [256,256,520], 360px [360,360,360].
    const Trio = () => (<><Input label="A" /><Input label="B" /><Input label="C" /></>);
    const { container } = render(<FieldRow wrap minChildWidth="15rem"><Trio /></FieldRow>);
    const cells = [...container.querySelectorAll(".twc-fieldrow__cell")];
    expect(cells, "a component's fragment is still ONE cell - nothing sees through a render").toHaveLength(1);
    expect(cells[0].children, "...holding all three fields").toHaveLength(3);
    expect(container.querySelector(".twc-fieldrow").style.getPropertyValue("--twc-fieldrow-min")).toBe("15rem");

    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    // the wrap and the floor are ONE pair and may never be gated differently: a floor with nowrap
    // makes the cell's min-content wider than the row, so it OVERFLOWS instead of breaking - worse
    // than the squash it replaces.
    expect(src).toContain("flex-wrap: wrap; align-content: flex-end; }");
    expect(src).toContain("min-inline-size: min(100%, var(--twc-fieldrow-min, 10rem)); }");
    // the floor must keep a real length fallback, or it is invalid at computed-value time when the
    // prop is unset and IACVT drops min-inline-size to its initial `auto` - a content-based
    // minimum, i.e. a LARGER floor in exactly the case where the host asked for nothing.
    expect(src).not.toMatch(/var\(--twc-fieldrow-min\)/);
  });

  it("#530: the floor does not reach a fragment cell that holds an inline-level control", () => {
    // Such a cell gets `flex: 0 1 auto; min-inline-size: auto` from the NATURAL ROOTS rule and hugs
    // its content rather than filling the row, so a floor inside it would break a line the ROW
    // still has room for. Measured without the gate's depth-2 arm: a fragment cell holding a
    // Tooltip-wrapped Button stayed 480px wide and broke into three 480px lines. Gated, both the
    // depth-1 and depth-2 shapes measured byte-identical to 1.51.1.
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    const gate = ":not(:has(> :is(${NATURAL_ROOTS}), > * > :is(${NATURAL_ROOTS})))";
    expect(src.split(gate).length - 1, "both #530 rules carry the depth-2 gate").toBe(2);
    // and #530 is confined to a wrapping row - in the band a fragment cell is a grid with
    // minmax(0, 1fr) tracks, where a floor overflows the track instead of breaking a line.
    expect(src.split(':where(.twc-fieldrow[data-wrap="true"]) > .twc-fieldrow__cell:has(> * + *)' + gate).length - 1).toBe(2);
  });

  it("#531: a fragment child that cannot take a lane gets the lane's height as margin", () => {
    // The fragment lane rule can only reach a .twc-field, because a field is a COLUMN flex
    // container so its ::after lands BELOW its control. A .twc-btn is inline-flex - a ROW - so an
    // ::after on it becomes a flex item INSIDE the button. Measured: align-items:flex-end
    // bottom-aligned a 40px button against two 91px fields and put its control box a full lane
    // (6px + one --text-xs line = 24px) BELOW theirs, in BOTH paths. #508's own symptom, inside the
    // component built to prevent it - and #527 recorded it as "today's behaviour", which was true
    // and the wrong test, because base was already 24px out. 24px -> 0px after.
    const Trio = () => (<><Input label="A" /><Input label="B" /><Button>Insert</Button></>);
    const { container } = render(<FieldRow><Trio /></FieldRow>);
    const cell = container.querySelector(".twc-fieldrow__cell");
    expect(cell.children).toHaveLength(3);
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    // token-built, so it keeps matching the lane when a token changes - and ONE line, because it
    // has to match the sibling lanes it aligns against rather than footerLines.
    expect(src).toContain("margin-block-end: calc(var(--space-1-5) + var(--text-xs) * var(--leading-normal, 1.5)); }");
    // the same DESCENDANT footer test as the cell lane, not a direct-child one (#519): a field
    // behind a Tooltip or a host div is the flex item, so the margin lands on the wrapper.
    expect(src).toContain('> *:not(.twc-field):not(:has(.twc-field__footer, .twc-field__hint, .twc-field__error, .twc-fieldrow, [data-reserve-footer]))');
  });

  it("#532: a nested WRAPPING row is placed across the band instead of auto-placing", () => {
    // It matched no placement rule at all: the chain rule reaches a nested row through ROW, which
    // carries :not([data-wrap="true"]), and both fallbacks carry :not(.twc-fieldrow). So it stayed
    // an unplaced grid item and auto-placed into row 1 - the LABEL track - which measured 190px
    // instead of 27px at a 760px container and pushed a sibling field's control 163px down. It has
    // to stay flex (grid has no flex-wrap), so it gets what every undecomposable child gets.
    const { container } = render(
      <FieldRow>
        <Input label="outer" />
        <FieldRow wrap minChildWidth="12rem"><Input label="a" /><Input label="b" /></FieldRow>
      </FieldRow>);
    const rows = [...container.querySelectorAll(".twc-fieldrow")];
    expect(rows).toHaveLength(2);
    expect(rows[0].getAttribute("data-wrap"), "the outer row bands").toBeNull();
    expect(rows[1].getAttribute("data-wrap"), "the inner row wraps").toBe("true");
    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    expect(src).toContain('${SOLO} > .twc-fieldrow[data-wrap="true"] { grid-row: 1 / -1; align-self: end; }');
  });

  it("#530: a shared group passed as a VALUE gets real per-cell behaviour, at no duplication cost", () => {
    // toCells descends into a Fragment ELEMENT and Children.toArray flattens arrays, so a group
    // shared as a function returning a fragment - rather than as a component element - becomes
    // THREE REAL CELLS with the real floor, the real wrap and the #527 band. Measured at 520px:
    // [256,256,520], identical to writing the three fields out by hand. This is the documented
    // answer for every shape the fix above does not reach, and it means the group never has to be
    // duplicated at each call site.
    const trio = () => (<><Input label="A" /><Input label="B" /><Input label="C" /></>);
    const { container } = render(<FieldRow wrap minChildWidth="15rem">{trio()}</FieldRow>);
    expect(container.querySelectorAll(".twc-fieldrow__cell"), "a fragment VALUE is flattened").toHaveLength(3);
    cleanup();
    const arr = () => [<Input key="a" label="A" />, <Input key="b" label="B" />];
    const { container: c2 } = render(<FieldRow wrap>{arr()}</FieldRow>);
    expect(c2.querySelectorAll(".twc-fieldrow__cell"), "...and so is an array").toHaveLength(2);
  });

  // ------------------------------------------------------------------------------------- #533
  it("#533: a validation error does not change a fragment cell's layout mode", () => {
    // Checkbox/Switch/Radio grow a bare div.twc-field root ONLY when they have an error
    // (Checkbox.jsx:126), and THREE rules tested depth 1 only - the per-child hug, FRAG_FIELDS, and
    // the band's keep-this-cell-on-flex rule - so each saw .twc-check when clean and .twc-field when
    // errored and fell on opposite sides. Measured in a fragment cell at 520px: the control hugged
    // at 100.4px clean, and the errored state banded the cell as "all fields", gridding it into
    // equal columns at 189px. Both are internally consistent and 0px out, which is why no
    // within-case check could see it - the two STATES disagreed. All three now test depth <= 2, like
    // the cell test, so the control measures 100.4px either way: #519's "a validation error must not
    // re-flow the row", one level further in.
    const Pair = ({ err }) => (<><Input label="Value" /><Checkbox label="Active" error={err} /></>);
    const { container } = render(<FieldRow><Pair /></FieldRow>);
    expect(container.querySelector(".twc-fieldrow__cell").children).toHaveLength(2);
    expect(container.querySelector(".twc-check"), "clean: the checkbox root IS the direct child").toBeTruthy();
    cleanup();
    const { container: c2 } = render(<FieldRow><Pair err="Required." /></FieldRow>);
    const kids = [...c2.querySelector(".twc-fieldrow__cell").children];
    expect(kids).toHaveLength(2);
    expect(kids[1].className, "errored: Checkbox grows a .twc-field wrapper").toContain("twc-field");
    expect(kids[1].querySelector(".twc-check"), "...with the root now at depth 2").toBeTruthy();

    const src = readFileSync(resolve(process.cwd(), "components/inputs/FieldRow.jsx"), "utf8");
    // ONE depth-2 test, interpolated into both band rules that used to carry a depth-1 copy
    expect(src).toContain('const FRAG_NAT = ":has(> :is(" + NATURAL_ROOTS + "), > * > :is(" + NATURAL_ROOTS + "))";');
    expect(src).toContain('const FRAG_FIELDS = FRAG + ":not(" + FRAG_NAT + ")";');
    expect(src).toContain("${FRAG}${FRAG_NAT} { display: flex;");
    // and the per-child hug gets its own depth-2 arm - spelled relative to the CHILD, because here
    // the subject is the wrapper rather than the cell
    expect(src).toContain(".twc-fieldrow__cell:has(> * + *) > :has(> :is(${NATURAL_ROOTS})) { flex: 0 1 auto; min-inline-size: auto; }");
  });

  it("the Field wrapper still works, for a row the host lays out itself", () => {
    const { container } = render(<Field reserveFooter><Button>Insert</Button></Field>);
    expect(container.querySelector(".twc-field").getAttribute("data-reserve-footer")).toBe("true");
  });
});
