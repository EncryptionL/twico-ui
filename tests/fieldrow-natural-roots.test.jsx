import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

// #519: FieldRow decides "share the row's width" vs "keep your natural size" from a list of root
// class names. A hand-curated list of component classes would be exactly the per-component coupling
// CLAUDE.md §5 warns about, so the list is not curated: it is DERIVED. Every single-class `.twc-*`
// rule in the library that declares `display: inline-flex` is an inline-level control and therefore
// natural; the three overlay wrappers are the only exceptions, because they are transparent spans
// around someone else's child. This test re-runs that derivation and fails if the shipped list and
// the library have drifted apart, so a new inline-flex control cannot silently start stretching.

const ROOT = process.cwd();
const COMPONENTS = resolve(ROOT, "components");
const FIELDROW = resolve(COMPONENTS, "inputs", "FieldRow.jsx");
// Transparent wrappers: inline-flex, but they hold exactly one in-flow child and portal their
// bubble/panel to document.body, so the cell must size to that child, not to the span.
const WRAPPERS = [".twc-menu-wrap", ".twc-popover-wrap", ".twc-tooltip-wrap"];

function jsxFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...jsxFiles(p));
    else if (/\.jsx$/.test(e.name) && !e.name.startsWith("_")) out.push(p);
  }
  return out;
}

function deriveInlineFlexRoots() {
  const hits = new Set();
  for (const f of jsxFiles(COMPONENTS)) {
    const src = readFileSync(f, "utf8");
    // a rule whose selector is exactly one `.twc-*` class, declaring display:inline-flex
    for (const m of src.matchAll(/(?:^|[\s,{}])(\.twc-[a-z0-9-]+)\s*\{([^}]*)\}/g)) {
      if (/display:\s*inline-flex/.test(m[2])) hits.add(m[1]);
    }
  }
  return [...hits].sort();
}

// The list as FieldRow.jsx actually ships it, read out of the :is() between the NATURAL ROOTS
// comment and its END marker so a stray `.twc-*` elsewhere in the file cannot pad it.
function shippedNaturalRoots() {
  const src = readFileSync(FIELDROW, "utf8");
  // #527: the list used to be written out twice in the NATURAL ROOTS block and a third time in
  // #525's fragment rule, and this guard only read the block — so the third copy was unguarded and a
  // new inline-flex control could have been added to two rules and silently missed in the third. It
  // is now ONE constant interpolated everywhere, so the guard reads the constant and covers every
  // use, including the #527 band's column rules.
  const m = src.match(/const NATURAL_ROOTS =([\s\S]*?);/);
  expect(m, "FieldRow.jsx must declare a single NATURAL_ROOTS constant").not.toBe(null);
  return [...new Set([...m[1].matchAll(/\.twc-[a-z0-9-]+/g)].map((x) => x[0]))].sort();
}

describe("FieldRow natural-roots list is derived, not curated (#519)", () => {
  it("matches every inline-flex root in the library, minus the overlay wrappers", () => {
    const derived = deriveInlineFlexRoots().filter((c) => !WRAPPERS.includes(c));
    const shipped = shippedNaturalRoots();
    // A readable failure: name what drifted rather than dumping two arrays.
    const missing = derived.filter((c) => !shipped.includes(c));
    const extra = shipped.filter((c) => !derived.includes(c));
    expect(
      missing,
      `these inline-flex roots would STRETCH in a FieldRow but should keep their natural size — add them to the NATURAL ROOTS block in components/inputs/FieldRow.jsx: ${missing.join(" ")}`
    ).toEqual([]);
    expect(
      extra,
      `these are in FieldRow's natural-roots list but are no longer inline-flex roots in components/ — remove them: ${extra.join(" ")}`
    ).toEqual([]);
  });

  it("names the natural roots twice — once at depth 1 and once at depth 2", () => {
    // Depth <= 2 is what makes the test immune to the two shapes that moved the old one:
    // Checkbox/Switch/Radio grow a bare `div.twc-field` root ONLY when they have an `error`
    // (Checkbox.jsx:126), and `<Menu trigger={<Button/>}/>` / `<Tooltip><Button/></Tooltip>` put a
    // `*-wrap` span in between. Both must answer "natural" whether the message is there or not,
    // otherwise a validation error re-flows the row.
    const src = readFileSync(FIELDROW, "utf8");
    const block = src.slice(src.indexOf("/* NATURAL ROOTS"), src.indexOf("/* END NATURAL ROOTS */"));
    expect(block).toContain(".twc-fieldrow__cell:has(> :is(${NATURAL_ROOTS})");
    expect(block).toContain("> * > :is(${NATURAL_ROOTS})");
    // and it must NOT reach deeper: .twc-radio sits at depth 3 inside a RadioGroup, which fills.
    expect(block).not.toContain("> * > * > :is(");
    // #527: the band's column rules use the same list and the same depth-2 test. Their depth term
    // must stay "> * >" and NOT the WRAP gate used elsewhere — WRAP is :not(:has(...)), :has() may
    // not be nested inside :has(), and its argument list is UNFORGIVING, so one invalid member drops
    // the whole rule. Measured when that happened: every natural cell lost its hug, a Button column
    // going from 48.2px to 121px, while alignment still looked correct.
    const cols = src.slice(src.indexOf("const BAND_COLS ="), src.indexOf("const FIELDROW_CSS"));
    expect(cols).toContain('") > * > :is(" + NATURAL_ROOTS +');
    expect(cols, ":has() must not be nested inside :has() here").not.toContain("WRAP");

    // #530: the wrap-path fragment-cell gate is a THIRD hand-maintained copy of the same depth-2
    // structure, and the two slices above do not cover it. It is the complement of the cell test:
    // the two #530 rules must reach a fragment cell holding ONLY fields, and must not reach one
    // holding an inline-level control at depth 1 OR depth 2. Measured when the depth-2 arm is
    // missing: a fragment cell with a Tooltip-wrapped Button stays 480px wide and breaks into three
    // 480px lines, where gated it is one untouched line. Both arms are pinned here because the
    // failure is silent - an unforgiving :has() list drops the whole rule and the cell simply stops
    // being excluded.
    const SCOPE = ':where(.twc-fieldrow[data-wrap="true"])';
    const gate = '.twc-fieldrow__cell:has(> * + *):not(:has(> :is(${NATURAL_ROOTS}), > * > :is(${NATURAL_ROOTS})))';
    const wrapRules = src.split(gate).length - 1;
    expect(wrapRules, "#530's two rules must both carry the full depth-2 gate").toBe(2);
    // ...and both must be scoped to a WRAPPING row, or they would reach the band, where a fragment
    // cell is a grid with minmax(0, 1fr) tracks and a floor overflows the track instead of breaking.
    const scoped = SCOPE + ' > ' + gate;
    expect(src.split(scoped).length - 1, "#530: both rules must carry the wrap scope").toBe(2);
    // The floor MUST carry a real length fallback. Without one, min(100%, var(--twc-fieldrow-min))
    // is invalid at computed-value time when the prop is unset, and because min-inline-size is not
    // inherited, IACVT drops it to the INITIAL value `auto` - a content-based minimum, i.e. an
    // unpredictable floor LARGER than zero in exactly the case where the host asked for nothing.
    expect(src).not.toMatch(/var\(--twc-fieldrow-min\)/);

    // #533: every fragment-cell test must be depth <= 2, like the cell test - never depth 1. A
    // depth-1 test sees Checkbox/Switch/Radio by .twc-check when clean and by the div.twc-field they
    // grow for an error, so a validation message flips which side of the rule the control lands on.
    // Measured before: the control hugged at 100.4px clean and the errored cell was banded into
    // equal columns at 189px.
    expect(src).toContain('const FRAG_NAT = ":has(> :is(" + NATURAL_ROOTS + "), > * > :is(" + NATURAL_ROOTS + "))";');
    expect(src, "FRAG_FIELDS must be the complement of the depth-2 test, not a depth-1 copy")
      .toContain('const FRAG_FIELDS = FRAG + ":not(" + FRAG_NAT + ")";');
    // no depth-1-only fragment test may survive anywhere in the sheet
    expect(src, "a depth-1 fragment natural test re-arms the #519 validation reflow")
      .not.toContain(':has(> :is(" + NATURAL_ROOTS + ")))');
    expect(src).not.toContain("${FRAG}:has(> :is(${NATURAL_ROOTS}))");

    // #531: a fragment child that cannot take an ::after lane gets the lane's HEIGHT as margin.
    // Pinned because the expression has to stay token-built and one line: a literal length would
    // drift from the lane when a token changes, and footer-lines would not match the sibling lanes.
    expect(src).toContain("margin-block-end: calc(var(--space-1-5) + var(--text-xs) * var(--leading-normal, 1.5)); }");
    // #532: a nested WRAPPING row must be placed explicitly - it matches neither the chain rule
    // (${ROW} excludes it) nor the two fallbacks (both carry :not(.twc-fieldrow)), so without this
    // it auto-places into the LABEL track and inflated it from 27px to 190px.
    expect(src).toContain('${SOLO} > .twc-fieldrow[data-wrap="true"] { grid-row: 1 / -1; align-self: end; }');
  });

  it("the three overlay wrappers are handled as transparent, not as natural", () => {
    const src = readFileSync(FIELDROW, "utf8");
    const block = src.match(/const NATURAL_ROOTS =([\s\S]*?);/)[1];
    for (const w of WRAPPERS) {
      expect(block, `${w} is a transparent wrapper, it must not be in the natural-roots list`).not.toContain(w);
    }
    // instead they get a column flip, so a tooltipped field still fills the cell it shares
    expect(src).toContain(
      ".twc-fieldrow__cell :is(.twc-menu-wrap, .twc-popover-wrap, .twc-tooltip-wrap) { flex-direction: column; align-items: stretch; }");
  });
});

describe("#494's lane rule is duplicated across scoped stylesheets (#519)", () => {
  // The `[data-reserve-footer] .twc-field` lane is declared VERBATIM in SIXTEEN separate scoped
  // stylesheets under their own ids, because each component ships its own CSS and several
  // re-declare the whole `.twc-field` family. Changing the lane means changing all of them or none
  // — nothing else in the repo catches a partial edit, and a partial edit means two fields in the
  // same row disagree about their footer by 18px. (The count is asserted below rather than left in
  // a comment to rot: it was believed to be eleven until this guard counted them.)
  const EXPECTED_SELECTOR =
    '[data-reserve-footer] .twc-field:not(:has(> .twc-field__footer, > .twc-field__hint, > .twc-field__error))::after';

  it("every copy is byte-identical, so a partial edit cannot ship", () => {
    // Carriers are the files that declare #494's lane, not merely any file mentioning the
    // attribute: FieldRow.jsx names it in its own cell test and in its suppression rule, and
    // deliberately does NOT declare the lane.
    const carriers = jsxFiles(COMPONENTS).filter((f) => readFileSync(f, "utf8").includes(EXPECTED_SELECTOR));
    expect(
      carriers.length,
      "the number of stylesheets carrying #494's lane changed — if that is intended, update this count and check every copy still matches"
    ).toBe(16);

    const bodies = new Map();
    for (const f of carriers) {
      const src = readFileSync(f, "utf8");
      const i = src.indexOf(EXPECTED_SELECTOR);
      expect(
        i,
        `${f} declares [data-reserve-footer] but not the canonical lane selector — the copies have drifted`
      ).toBeGreaterThan(-1);
      // the declaration block that follows it
      // Normalise line endings: the repo has a mix of CRLF and LF source files (10 of these
      // carriers are CRLF, 6 are LF), which is an editor/git artifact and not a CSS difference.
      const body = src
        .slice(i + EXPECTED_SELECTOR.length, src.indexOf("}", i) + 1)
        .split(String.fromCharCode(13)).join("")
        .trim();
      bodies.set(f, body);
    }
    const distinct = new Set(bodies.values());
    expect(
      [...distinct],
      `the lane declaration differs between stylesheets:\n${[...bodies].map(([f, b]) => `  ${f}\n    ${b}`).join("\n")}`
    ).toHaveLength(1);
  });
});
