import React from "react";
import { useScopedStyles } from "../_styles.js";

// Maps a numeric gap step to the spacing token; a string passes through. Same helper Stack uses.
function space(v) {
  if (v == null) return undefined;
  if (typeof v === "number") return `var(--space-${String(v).replace(".", "-")})`;
  return v;
}

const FIELDROW_CSS = `
/* #508: a row of fields PLUS one plain control - an "insert at the cursor" button beside the box it
   writes into, a remove button at the end of a condition row - which is arguably the more common
   shape than a row of fields alone. #494's reserveFooter closed the field-vs-field half, but its
   selector is .twc-field and a trailing button's root is .twc-btn, so the button still rode up by a
   footer's height the moment a sibling field grew one.

   ONE LANE, ONE PLACE IT CAN COME FROM (#519).
   The first cut of this component ran TWO lane mechanisms at once: the row carried
   data-reserve-footer, switching on #494's ancestor rule ([data-reserve-footer] .twc-field, a
   DESCENDANT selector that reaches every field root at any depth - including the Select inside a
   CurrencyField and both pickers inside a DateTimePicker), AND each cell drew its own ::after
   whenever :has(> .twc-field) failed - a DIRECT-CHILD test. The two disagreed on exactly the cases
   that matter: a field behind a Tooltip or a host div satisfies the descendant rule and fails the
   child test, so it got BOTH lanes and rode up 24px - #508 again, in the other direction.
   So the row no longer sets data-reserve-footer at all. The lane is drawn by the CELL, never by the
   child, and there is exactly one rule that can draw it.

   The geometry is identical either way, which is why dropping the inner lane costs nothing: a
   field's own hint sits var(--space-1-5) below its control box INSIDE .twc-field, and this cell's
   ::after sits var(--space-1-5) below the whole child. Both put the control box 6px + one
   --text-xs line (18px at --leading-normal) above the cell's bottom edge, and align-items:flex-end
   lines those bottoms up. Generated content rather than a height, so the lane keeps matching a real
   footer when a token changes. font-family is pinned on the row because --leading-normal is a
   NUMBER: were a host to set line-height:normal on a form container, the lane and a real footer
   would otherwise differ by the two fonts' metric gap. */
.twc-fieldrow { display: flex; align-items: flex-end; font-family: var(--font-sans); }
.twc-fieldrow[data-wrap="true"] { flex-wrap: wrap; }

/* Every cell shares the row's width and may be squeezed rather than overflow it. See the natural
   rule below for why STRETCH is the default rather than the thing we test for. */
.twc-fieldrow__cell { display: flex; flex-direction: column; gap: var(--space-1-5); flex: 1 1 0; min-inline-size: 0; }

/* wrap (#520, #524). flex-basis:0 made every field cell's hypothetical main size 0, so the flex
   line could never overflow and no break was ever taken - the fields were squeezed to 4px instead,
   which is the one thing this prop exists to prevent. A floor on the hypothetical size restores the
   break without giving up equal widths (basis stays 0, so cells on a line still share it evenly).
   min(100%, ...) keeps a row narrower than the floor from overflowing.
   The floor is load-bearing rather than decorative - a host sizing a condition row for a 1366px
   laptop needs to say where it breaks - and it was unexpressible before #524: minWidth on the FIELD
   is overridden by the cell's own min-inline-size, and a wrapper div is what FieldRow exists to
   remove. So it is the minChildWidth prop (same name and semantics as Grid's), landing on the
   CELL, which is the flex item. --twc-fieldrow-min stays settable for a host that would rather push
   it through CSS. */
:where(.twc-fieldrow[data-wrap="true"]) > .twc-fieldrow__cell { min-inline-size: min(100%, var(--twc-fieldrow-min, 10rem)); }

/* NATURAL ROOTS - a cell that holds one of these keeps the child's own size instead of sharing the
   row's width. The list is not curated: it is every single-class .twc-* rule in this library that
   declares display:inline-flex, minus the three overlay wrappers below, i.e. every root that is an
   inline-level control. tests/fieldrow-natural-roots.test.jsx re-derives it from components/ and
   fails on drift, so a new inline-flex control cannot silently start stretching.
   The polarity is the point. With STRETCH as the default, every child this list does NOT name - a
   host's wrapper div, a third-party control, a component added later, Slider/FileUpload/FilterBar/
   Form, which fill their width without ever being a .twc-field - lands on the answer that is right
   for it, so the open-ended "every wrapper a host might write" list disappears and the one list
   that remains only ever names boxes this library itself ships.
   Depth <= 2 is what makes it immune to the two shapes that moved the old test: Checkbox/Switch/
   Radio grow a bare div.twc-field root only when they have an error (Checkbox.jsx:126), and
   Menu trigger= / Tooltip put a *-wrap span in between. Both now answer "natural" whether the
   message is there or not, so a validation error no longer re-flows the row (#519). It stops at 2
   deliberately: .twc-radio sits at depth 3 inside a RadioGroup, which fills. */
.twc-fieldrow__cell:has(> :is(.twc-avatar-menu, .twc-badge, .twc-btn, .twc-check, .twc-iconbtn, .twc-kbd, .twc-label, .twc-pagination, .twc-radio, .twc-rating, .twc-switch, .twc-tab, .twc-tag, .twc-togglegroup),
                       > * > :is(.twc-avatar-menu, .twc-badge, .twc-btn, .twc-check, .twc-iconbtn, .twc-kbd, .twc-label, .twc-pagination, .twc-radio, .twc-rating, .twc-switch, .twc-tab, .twc-tag, .twc-togglegroup)) {
  flex: 0 1 auto; min-inline-size: auto; }
/* END NATURAL ROOTS */

/* Tooltip/Menu/Popover are transparent wrappers: inline-flex spans holding exactly one in-flow
   child, because their bubble/panel portals to document.body. Blockified as a flex item they stretch
   to the cell, but their own ROW direction then shrink-wraps the trigger, so a tooltipped field
   would still not fill the cell it is sharing. One column flips that at any nesting depth without
   naming the trigger - the same three names, no new list. */
.twc-fieldrow__cell :is(.twc-menu-wrap, .twc-popover-wrap, .twc-tooltip-wrap) { flex-direction: column; align-items: stretch; }

/* #525: a child COMPONENT that returns a fragment renders SEVERAL elements into one cell. Nothing
   can see through a render, so toCells cannot split it - React.Children only ever sees the one
   component element. A cell is a COLUMN, so those fields stacked vertically: not a subtle
   misalignment but a different layout, and extracting a repeated field PAIR into a component is the
   natural way to write these rows.
   :has(> * + *) identifies it exactly, because toCells gives every other cell exactly one child.
   Such a cell lays out as a row instead, and each field inside takes #494's own lane so the parts
   still line up by their control box - the cell's single lane would otherwise sit BESIDE them as
   another row item. gap is inherited from the row, so a fragment pair spaces like real siblings. */
.twc-fieldrow__cell:has(> * + *) { flex-direction: row; align-items: flex-end; gap: inherit; }
.twc-fieldrow__cell:has(> * + *) > * { flex: 1 1 0; min-inline-size: 0; }
.twc-fieldrow__cell:has(> * + *) > :is(.twc-avatar-menu, .twc-badge, .twc-btn, .twc-check, .twc-iconbtn, .twc-kbd, .twc-label, .twc-pagination, .twc-radio, .twc-rating, .twc-switch, .twc-tab, .twc-tag, .twc-togglegroup) { flex: 0 1 auto; min-inline-size: auto; }
.twc-fieldrow__cell:has(> * + *) > .twc-field:not(:has(> .twc-field__footer, > .twc-field__hint, > .twc-field__error))::after {
  content: "\\00a0"; font-size: var(--text-xs); user-select: none; }

/* THE LANE - the only one. A cell gets it unless something inside it already ends in a footer:
     - the three message classes #494 tests for (Field.jsx:17). They also catch the two footers no
       .twc-field test can see, because both wrap one of them: Slider's .twc-slider__msgs and
       FileUpload's bare error under a non-field root;
     - a nested FieldRow, whose own cells already end in a lane;
     - a child opting into #494 by hand with reserveFooter, which draws its lane inside .twc-field -
       the attribute is visible to :has() even though the generated content is not, so the two
       mechanisms compose instead of doubling.
   Unlike the old test this looks at ANY depth, which is the whole point: a field behind a Tooltip,
   a host div, or a Form's fieldset is seen. */
.twc-fieldrow__cell:not(:has(> * + *)):not(:has(.twc-field__footer, .twc-field__hint, .twc-field__error, .twc-fieldrow, [data-reserve-footer]))::after {
  content: "\\00a0"; font-size: var(--text-xs); user-select: none;
  /* #526: the lane reserves ONE line, so a sibling whose REAL footer wraps to two is a line taller
     and align-items:flex-end lifts its control by 18px - the #494 symptom, inside the component
     built to prevent it. It depends on the cell's rendered width, not the markup, so the same row
     aligns wide and breaks narrow. Equalising footers across the row is not solvable here: it needs
     each cell to contribute a control part and a footer part as separate grid items, and a field's
     footer lives INSIDE the single .twc-field element, so no row-level selector can hoist it out -
     see the Field restructure issue. What IS expressible is the reserve: footerLines tells the row
     how many lines to hold open, so a host with a known two-line hint can match it. */
  min-block-size: calc(var(--twc-fieldrow-footer-lines, 1) * var(--text-xs) * var(--leading-normal, 1.5)); }

/* FOOTER OFFSET. Two of the library's own controls put their message at a different offset than the
   field family's var(--space-1-5), so even with the lane correct they sat out of line in a row:
   Slider's .twc-slider__msgs adds margin-top: var(--space-2) (8px, Slider.jsx:13) and FileUpload's
   root gap is var(--space-3) (12px, FileUpload.jsx:6) above its bare .twc-field__error. Measured,
   that is 2px and 6px - far better than the 25px/29px the double lane used to cost, but
   "aligned by control box" has to be literally true, not nearly.
   Normalised only INSIDE a cell, so nothing outside a FieldRow changes. FileUpload gets a negative
   compensation rather than a smaller gap, because its gap also spaces the zone from the file list
   and that spacing should stay as designed. */
.twc-fieldrow__cell .twc-slider__msgs { margin-block-start: var(--space-1-5); }
.twc-fieldrow__cell .twc-upload > .twc-field__error { margin-block-start: calc(var(--space-1-5) - var(--space-3)); }

/* SUPPRESSION. The row sets no data-reserve-footer, but a HOST may have put #494's attribute on an
   ancestor above this row - prop-conventions.md documents that ancestor use as a first-class
   pattern - and #494's rule is a descendant selector, so it would reach every field in here and
   stack its lane under the cell's. Kill the inner one; the cell already owns the lane. A field that
   opted in FOR ITSELF keeps its own (that is the :not), and the cell rule above skips such a cell,
   so the pair always yields exactly one lane. (0,4,1) against #494's (0,3,1), so this wins.
   It deliberately skips a fragment-row cell (#525): there the inner field lanes are the mechanism,
   and this rule outranked them - leaving the pair with no lane while a trailing button's cell kept
   one, 24px out. */
.twc-fieldrow .twc-fieldrow__cell:not(:has(> * + *)) .twc-field:not([data-reserve-footer])::after { content: none; }
`;

// Flattens one child list into the cells the row renders. Two things React.Children.map does not do
// (#521):
//   - Drop every FALSY child, not just null. Children.map normalises undefined/true/false to null,
//     but "" and 0 survive as real children - and the {query && <Input/>} idiom produces exactly
//     those - so they would otherwise get a cell that draws a lane and takes part in the gap: a
//     blank column where a conditionally-rendered field is hidden (and 0 renders the text "0").
//     They have to be dropped rather than returned bare, because a non-whitespace text run inside
//     .twc-fieldrow would become an anonymous flex item and still consume a gap.
//   - Look inside a Fragment. Children.map does not descend into one, so <><Input/><Input/></> would
//     land in ONE cell - and a cell is a COLUMN, so those fields would stack instead of forming a
//     row. A COMPONENT that returns a fragment is still one cell: nothing can see through a render.
function toCells(children, out, prefix) {
  React.Children.toArray(children).forEach((child, i) => {
    if (!child) return;
    const key = prefix + (child.key == null ? i : child.key);
    if (child.type === React.Fragment) toCells(child.props.children, out, key + "/");
    else out.push({ key, child });
  });
  return out;
}

// Grid's helper, same semantics: a number is px, a string passes through.
function len(v) {
  return typeof v === "number" ? `${v}px` : v;
}

export const FieldRow = /*#__PURE__*/ React.forwardRef(function FieldRow({
  gap = 3,
  wrap = false,
  minChildWidth,
  footerLines,
  className = "",
  style,
  children,
  ...rest
}, ref) {
  const __twcStyles = useScopedStyles("twc-fieldrow-styles", FIELDROW_CSS);
  return (
    <div
      ref={ref}
      className={`twc-fieldrow ${className}`.trim()}
      data-wrap={wrap || undefined}
      /* Deliberately NOT data-reserve-footer (#519): #494's ancestor form is a descendant selector,
         so it would reach every nested field root as well (a CurrencyField's picker Select, a
         DateTimePicker's two pickers, each of a FilterBar's filters) and stack a second lane under
         the one the cell already owns. The cell lane covers a direct field and a wrapped one alike. */
      style={{
        gap: space(gap),
        // #524: the wrap floor, on the cell via a custom property because the cell is the flex item
        // and a consumer cannot reach it. #526: how many footer lines the lane holds open.
        ...(minChildWidth != null ? { "--twc-fieldrow-min": len(minChildWidth) } : null),
        ...(footerLines != null ? { "--twc-fieldrow-footer-lines": footerLines } : null),
        ...style,
      }}
      {...rest}
    >
      {__twcStyles}
      {toCells(children, [], "").map(({ key, child }) => (
        <div key={key} className="twc-fieldrow__cell">{child}</div>
      ))}
    </div>
  );
});
