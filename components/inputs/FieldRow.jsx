import React from "react";
import { useScopedStyles } from "../_styles.js";

// Maps a numeric gap step to the spacing token; a string passes through. Same helper Stack uses.
function space(v) {
  if (v == null) return undefined;
  if (typeof v === "number") return `var(--space-${String(v).replace(".", "-")})`;
  return v;
}

// The derived natural-roots list, in ONE place. The file carried three copies - two in the NATURAL
// ROOTS block, one in #525's fragment rule - and tests/fieldrow-natural-roots.test.jsx read only the
// delimited block, so the third was unguarded: a new inline-flex control would have been required in
// two rules and silently missing from the third.
const NATURAL_ROOTS =
  ".twc-avatar-menu, .twc-badge, .twc-btn, .twc-check, .twc-iconbtn, .twc-kbd, .twc-label, " +
  ".twc-pagination, .twc-radio, .twc-rating, .twc-switch, .twc-tab, .twc-tag, .twc-togglegroup";

// ---- #527 selector vocabulary. The expanded text is unreadable and every band rule needs two or
// three of these. Everything here is a SELECTOR fragment; none of it changes the flex rules above.
const ROW = '.twc-fieldrow:not([data-wrap="true"])';   // a band row; a wrapping row stays on flex
const CELL = ROW + " > .twc-fieldrow__cell";
const SOLO = CELL + ":not(:has(> * + *))";             // ...holding exactly one child
const FRAG = CELL + ":has(> * + *)";                   // #525's fragment cell
// #533: depth <= 2, like the cell test and like #530 gate - NOT depth 1. Checkbox/Switch/Radio
// grow a bare div.twc-field root only for an error, so a depth-1 test saw .twc-check when clean
// and .twc-field when errored: the cell was banded as "all fields" in one state and kept on flex
// in the other, which measured the errored control at 189px against 100.4px clean. Showing a
// validation message must not change the cell layout MODE - #519, one level further in.
const FRAG_NAT = ":has(> :is(" + NATURAL_ROOTS + "), > * > :is(" + NATURAL_ROOTS + "))";
const FRAG_FIELDS = FRAG + ":not(" + FRAG_NAT + ")";
// A transparent wrapper is ONE box around ONE field. Without this gate the chain rule also matches a
// host div holding TWO fields, turning the cell's vertical stack into two grid COLUMNS and putting a
// stray non-field sibling beside the field in the label band.
const WRAP = ":not(:has(> * + *))";
const SOLO_WRAP = WRAP + ":has(> .twc-field)";
// "a control part": any direct child of a field that is neither the label nor the footer. No class
// marks a control - 17 JSX returns put a different element there - so the complement is the only
// generic handle. [type="hidden"] is excluded because Select/Combobox render one as a direct child
// and MultiSelect one per value: no box, but a child all the same.
const CTRL = ':not(.twc-field__label):not(.twc-field__footer):not(.twc-field__hint):not(.twc-field__error):not([type="hidden"])';
// a field with exactly ONE control part. Two would be pinned to the same track and overlap, so such
// a field is left on flex.
const ONE = ".twc-field:not(:has(> " + CTRL + " ~ " + CTRL + "))";
const MANY = ".twc-field:has(> " + CTRL + " ~ " + CTRL + ")";
const FOOTER = ":is(.twc-field__footer, .twc-field__hint, .twc-field__error)";
const HAS_FOOTER = ":has(.twc-field__footer, .twc-field__hint, .twc-field__error)";
// every field whose parts this sheet pins to the band. #538: a FRAG cell's fields are banded the
// same way a SOLO cell's child is, so the two kinds share one list rather than FRAG carrying a
// narrower one.
const BANDED = ":is(" + [SOLO, FRAG].map((c) => c + " > " + ONE + ", " + c + " > " + WRAP + " > " + ONE).join(", ") + ")";
// #530's wrap gate, in ONE place. The expanded text is 120 characters and both of its rules have to
// carry it character for character: a floor without the matching flex-wrap makes the cell's
// min-content wider than the row and it overflows horizontally instead of breaking a line, which is
// strictly worse than the squash it replaces. Two copies of that is a correctness risk, not a
// readability one - #536 was the subject of the second copy being wrong.
const FRAG_WRAP = ':where(.twc-fieldrow[data-wrap="true"]) > .twc-fieldrow__cell:has(> * + *):not(' + FRAG_NAT + ")";

// One rule per column position. A cell cannot size its own grid track - track sizing is declared on
// the CONTAINER - so the ROW asks, for each position, whether that cell holds an inline-level
// control and flips that column from "share the row" to "hug your content". Same derived list and
// same depth-<=2 test as the flex rules; :has() may not be nested, so the depth test is spelled as
// two relative selectors rather than a :has() inside a :has(). The depth-2 term is "> * >" and
// NOT the WRAP gate used elsewhere: WRAP is :not(:has(...)), and :has() cannot be nested inside
// :has(). Its argument list is UNFORGIVING, so one invalid member drops the whole rule - which
// silently cost every natural cell its hug (a Button column measured 121px instead of 48px).
// nth-of-TYPE, not nth-child: the cells are the row's only div children, so a stray element React or
// a host inserts cannot shift the count.
// Twelve positions, not unbounded: past the twelfth a natural cell shares the row like any other -
// still ALIGNED, it just stops hugging - and a host can set --twc-fieldrow-c13 or its own
// grid-template-columns through style.
const SEP = String.fromCharCode(10);
const BAND_COLS = Array.from({ length: 12 }, (_, i) => i + 1)
  .map((n) =>
    ROW + ":has(> .twc-fieldrow__cell:nth-of-type(" + n + ") > :is(" + NATURAL_ROOTS + "), > .twc-fieldrow__cell:nth-of-type(" + n + ") > * > :is(" + NATURAL_ROOTS + ")) { --twc-fieldrow-c" + n + ": auto; }")
  .join(SEP);

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
.twc-fieldrow__cell:has(> :is(${NATURAL_ROOTS}),
                       > * > :is(${NATURAL_ROOTS})) {
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
/* #533: depth <= 2, the same as the cell test above and for the same reason. This rule used to test
   depth 1 only, so it saw Checkbox/Switch/Radio by their .twc-check root when clean and by the bare
   div.twc-field they grow for an error (Checkbox.jsx:126) - and the two fell on opposite sides of
   it. Measured in a fragment cell at 520px: clean, the direct child is label.twc-check and hugs at
   100.4px; errored, it is div.twc-field, misses this rule, takes flex: 1 1 0 from the rule above and
   stretches to 189px. Showing a validation message nearly doubled the control and changed its layout
   mode - #519's own "a validation error must not re-flow the row", which was fixed for the CELL at
   depth 2 and never given to the children inside a fragment cell.
   Spelled as a second selector with "> :has(> :is(...))" rather than one "> * >" arm, because here
   the SUBJECT is the child itself, not the cell: the thing that must hug is the wrapper, so the
   natural root has to be matched relative to it. Still two relative selectors, never a :has() inside
   a :has(). A wrapper holding a FIELD does not match - it contains no natural root - so a tooltipped
   field keeps filling its share, which is what the transparent-wrapper rule below relies on. */
.twc-fieldrow__cell:has(> * + *) > :is(${NATURAL_ROOTS}),
.twc-fieldrow__cell:has(> * + *) > :has(> :is(${NATURAL_ROOTS})) { flex: 0 1 auto; min-inline-size: auto; }
.twc-fieldrow__cell:has(> * + *) > .twc-field:not(:has(> .twc-field__footer, > .twc-field__hint, > .twc-field__error))::after {
  content: "\\00a0"; font-size: var(--text-xs); user-select: none; }
/* #537, second lane: footerLines here too. A fragment cell holds TWO lane mechanisms - this ::after
   for its field children and the margin below for the rest - and only the row-level ones scaled with
   the prop. At footerLines=3 on a wrapping row the Button's margin was 60px and this nbsp was still
   24px, so fixing the margin alone moved the misalignment from "cell vs row" to "sibling vs sibling
   inside the cell", still 36px. Measured together: 0px at 1, 2 and 3. Same calc as THE LANE below,
   which is what it has to agree with. */
.twc-fieldrow__cell:has(> * + *) > .twc-field:not(:has(> .twc-field__footer, > .twc-field__hint, > .twc-field__error))::after {
  min-block-size: calc(var(--twc-fieldrow-footer-lines, 1) * var(--text-xs) * var(--leading-normal, 1.5)); }

/* #531: ...and a fragment child that is NOT a field needs the same offset by a different mechanism.
   The rule above can only give a lane to a .twc-field, because a field is a COLUMN flex container
   so its ::after lands BELOW its control. A .twc-btn is inline-flex - a ROW - so an ::after on it
   would become a flex item INSIDE the button, printing the nbsp beside the label. The cell cannot
   draw one either: the cell is a row, so a cell-level ::after sits BESIDE the children rather than
   beneath them (see the #525 note above). So the lane-less child gets the lane HEIGHT as margin
   instead - geometrically identical, built from the same two tokens, and it touches nothing inside
   the child.
   Without it, align-items:flex-end bottom-aligned a 40px button against two 91px fields and put its
   control box a full lane (6px + one --text-xs line = 24px) BELOW theirs: #508 own symptom, inside
   the component built to prevent it. It showed in BOTH paths - a wrapping row is pure flex by
   design, and a non-wrapping one keeps such a cell on flex too (see the FRAG natural-root rule in
   the band section) - and #527 recorded it as a shape that kept "today behaviour", which was true
   and the wrong test: base was already 24px out.
   Same DESCENDANT footer test as THE LANE below, not a direct-child one (#519): a field behind a
   Tooltip or a host div is the flex item here, so the margin lands on the wrapper and lifts the
   whole thing.
   #537: footerLines, not a constant one line. The sibling lanes this aligns against are NOT
   single-line - the cell ::after below holds min-block-size: footerLines x a line, and the band's
   footer track holds the same - so a fixed line put this child (n - 1) x 18px out the moment a host
   passed footerLines. Measured at 760px: 0px at the default, 18px at 2, 36px at 3, on both paths,
   while a row of all-field cells held 0px at every value. It reduces to the old value at the
   default, so nothing moves for anyone not passing the prop.
   WRAP-ONLY, which it was not before. On the band path #538 now places these children in the
   control track by grid-row, and a bottom margin on a row-2 item pinned with align-self:end lifts
   it straight back out of the band.
   A margin is the one lane mechanism a CHILD can veto, and Text and Heading used to: they reset
   their UA margins with an INLINE style, which beats every stylesheet rule whatever its
   specificity, so this calc() never reached them and a word between two inputs sat 24px low with
   its computed margin reading 0px. #543 moved those resets into each component's own scoped
   stylesheet - .twc-text / .twc-heading at (0,1,0), against this rule's (0,3,0) - so the lane
   lands. Keep this selector at three classes or more, and keep those resets a single class: the
   two halves have to stay on opposite sides of that comparison. */
:where(.twc-fieldrow[data-wrap="true"]) > .twc-fieldrow__cell:has(> * + *) > *:not(.twc-field):not(:has(.twc-field__footer, .twc-field__hint, .twc-field__error, .twc-fieldrow, [data-reserve-footer])) {
  margin-block-end: calc(var(--space-1-5) + var(--twc-fieldrow-footer-lines, 1) * var(--text-xs) * var(--leading-normal, 1.5)); }

/* #530: the WRAP FLOOR, for the fields inside a fragment cell. #524 put the floor on the CELL,
   because the cell is the flex item - and when every field in a row comes from ONE fragment-
   returning component, that cell IS the whole row: one flex item, nothing to break against, so the
   row never wraps and the fields squash to a third of it each. Measured at 1.51.1 with
   minChildWidth="15rem" (240px): a 520px container gave [168,168,168] on one line where the
   hand-laid equivalent gives [256,256,520] on two, and 360px gave [114.7,114.7,114.7]. Squashing
   below a readable width is the one thing this floor exists to prevent. A host cannot reach past the
   cell either, which is the same reason the floor became a prop: the cell is created BETWEEN the row
   and the child, so --twc-fieldrow-min cannot be set low enough in the tree to reach the fields.
   So the cell lets the row floor through to its own children and becomes a wrap container. The two
   declarations MUST be gated by the same selector: a floor with nowrap makes the cell min-content
   (3 x 240 + gaps) wider than the row, and it would overflow horizontally instead of breaking -
   strictly worse than the squash it replaces.
   The fields then behave as the row own cells do - basis 0 from the rule above, so fields sharing a
   line still share it evenly, and min(100%, floor) so a cell narrower than the floor does not
   overflow - with one difference that cannot be designed away: their line box is the CELL, not the
   row. Two levels of line breaking are not one flat context, so in a MIXED row the group breaks
   against its share of the row rather than the row full width. For the reported shape, where the
   group is the row only child, the cell IS the row width and the two are identical.
   Why the cell wraps rather than dissolving into row items: that needs display:contents, and a
   contents box draws no lane (#519 puts the lane on the cell) while its generated content would
   become another row item - the stray lane beside the pair that the #525 note describes - and in
   band mode the row track LIST is computed in JS from cells.length, so the 2nd and 3rd field would
   land in implicit tracks. A cell is always exactly one row item.
   Gated to a wrapping row by the attribute here, and the band gates itself with the complementary
   :not([data-wrap="true"]) - the JSX writes wrap || undefined, so the two partition every row. Not
   merely unnecessary in band mode but wrong: a non-wrapping fragment cell is a grid with
   grid-auto-flow:column and minmax(0,1fr) tracks, where a floor overflows the track instead of
   breaking a line.
   align-content mirrors the band row align-content:end below: inert while the cell is content-sized
   by align-items:flex-end, and what keeps the inner lines on the bottom edge if a host stretches it.
   The third rule is the depth-2 mirror of the NATURAL ROOTS test, wrap-only. The rule above tests
   depth 1 only, so without it the new floor reaches a Menu or Tooltip wrapper around a Button - the
   shape in this component own d.ts example - and stretches that button to a whole inner line. Two
   :has() in one complex selector is legal; only NESTING one inside another is not. */
${FRAG_WRAP} { flex-wrap: wrap; align-content: flex-end; }
/* #536: the floor's subject is the FIELD, not every child. "> *" floored a fragment cell's
   non-field child too - and the commonest reason to share a fragment at all is the range row
     <Input label="from" /><Text>to</Text><Input label="to" />
   where that child is the 12px word "to". minChildWidth is a readable-width floor for an input; it
   is not a width for a word. Measured at 520px with minChildWidth="15rem": the word took
   min-inline-size: min(100%, 240px), no longer fit beside the two inputs, and was pushed onto its
   own line and stretched - 1 line and 91px became 2 lines and 190px, with the fields at 256/520.
   At the default 10rem the three happened to fit, so the defect appeared exactly when a host set
   the prop BECAUSE they needed it.
   The second arm is not optional: a field behind a Tooltip's span or a host div is the flex item
   here, so "> .twc-field" alone would take the floor away from a wrapped field and squash it - the
   very thing the floor exists to prevent, traded for the word. Measured: range-tipped-520 keeps
   [256,256,520] (three fields, three floors, a real break) while range-520 returns to one line.
   Spelled as two selectors rather than :is(.twc-field, :has(> .twc-field)) to match how the rest of
   this file writes a depth-2 test, and to keep every :has() at the top level of its selector. */
${FRAG_WRAP} > .twc-field,
${FRAG_WRAP} > :has(> .twc-field) {
  min-inline-size: min(100%, var(--twc-fieldrow-min, 10rem)); }

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

/* ==================== THE FOOTER BAND (#527, the real fix for #526) ====================
   The lane above reserves a whole number of LINES, so a field whose real hint wraps to more than
   that is taller than its siblings and align-items:flex-end lifts its control by the difference -
   #494's own symptom, inside the component built to prevent it. Measured on one row at one width,
   changing only the hint's length: control bottoms [272,272,272,272] with one line and
   [141,87,141,141] when it wrapped to four. It depends on the cell's RENDERED width, not on the
   markup, so a row aligns at desktop width and breaks when a dialog narrows or a translation runs
   longer. No per-cell reserve can fix that, because no cell knows what the widest footer in the row
   costs. A shared BAND can: three row tracks - label, control, footer - each sized to its tallest
   member, so every control bottom lands on one line by construction and a footer that wraps makes
   the ROW taller instead of moving a control.
   That needs the parts to be separate grid items, and a field's footer is a child INSIDE the single
   .twc-field element. SUBGRID is what reaches it: the cell subgrids the row's three tracks, the
   .twc-field inside it subgrids the cell's, and each part is pinned to its track - so the band is
   assembled from HERE, with no change to Field.jsx, to the 16 stylesheets that re-declare the
   .twc-field family, or to the 17 JSX returns that build that markup inline.
   Scoped to :not([data-wrap="true"]) deliberately: grid has no flex-wrap, and minChildWidth is a
   flex-basis floor that only means anything with wrap. A wrapping row keeps the flex path above,
   byte for byte, lane included.
   Subgrid is Baseline newly available Sept 2023 - EARLIER than the :has() this file already
   requires (Dec 2023) - so the band costs no browser support and no fallback question arises.
   Row gaps are pinned to 0 at all three levels and the 6px lives on the label's margin-block-end
   and the footer's margin-block-start instead: a gap is charged between tracks even when they
   collapse to 0, so a row with no labels would otherwise gain 6px at the top. */
${ROW} {
  display: grid;
  /* At least the lane it replaces, so a row's HEIGHT does not move until a footer actually needs
     more: footerLines keeps working, now as the band's floor rather than a per-cell reserve. */
  grid-template-rows: auto auto minmax(calc(var(--space-1-5) + var(--twc-fieldrow-footer-lines, 1) * var(--text-xs) * var(--leading-normal, 1.5)), auto);
  row-gap: 0;
  /* start: auto tracks must not share leftover space, or a row of plain controls would spread out.
     end: a row given more height than it needs keeps its contents on its bottom edge, which is what
     align-items:flex-end does on the flex path. */
  justify-content: start;
  align-content: end; }
${BAND_COLS}

/* The cell spans all three tracks and re-exposes them to its child. The --twc-fieldrow-cN reset
   stops a nested row's column flips inheriting out of it. */
${CELL} { display: grid; grid-template-rows: subgrid; row-gap: 0; grid-row: 1 / -1;
  --twc-fieldrow-c1: initial; --twc-fieldrow-c2: initial; --twc-fieldrow-c3: initial;
  --twc-fieldrow-c4: initial; --twc-fieldrow-c5: initial; --twc-fieldrow-c6: initial;
  --twc-fieldrow-c7: initial; --twc-fieldrow-c8: initial; --twc-fieldrow-c9: initial;
  --twc-fieldrow-c10: initial; --twc-fieldrow-c11: initial; --twc-fieldrow-c12: initial; }

/* What chains the subgrid one level further: a one-control field, that field behind one transparent
   wrapper (a Tooltip's span, a host div), the same inside a fragment cell, and a nested FieldRow,
   whose own fields then share this row's bands. The wrapper gates are ${WRAP} - exactly one child -
   because without them a host div holding TWO fields becomes two grid COLUMNS. */
${SOLO} > ${ONE},
${SOLO} > ${SOLO_WRAP},
${SOLO} > ${WRAP} > ${ONE},
${SOLO} > ${ROW},
${FRAG} > ${ONE},
${FRAG} > ${SOLO_WRAP},
${FRAG} > ${WRAP} > ${ONE},
${FRAG} > ${ROW} { display: grid; grid-template-rows: subgrid; row-gap: 0; grid-row: 1 / -1; }

/* The parts, pinned to their track. This also wins over the five pickers, which put .twc-dp /
   .twc-tp / .twc-cp / .twc-drp / .twc-dtp on the SAME element as .twc-field and re-declare the same
   flex column there: those tie .twc-field at (0,1,0) and are settled today by mount order, i.e. by
   nothing in the source. */
${BANDED} > .twc-field__label { grid-row: 1; align-self: end; margin-block-end: var(--space-1-5); }
${BANDED} > ${FOOTER} { grid-row: 3; align-self: start; margin-block-start: var(--space-1-5); }
${BANDED} > ${CTRL} { grid-row: 2; align-self: end; }

/* A cell child the band cannot take apart - Slider (head + track + msgs), FileUpload (label + zone
   + list + error), a Field holding two controls, any host subtree with a footer somewhere inside -
   keeps its own layout and is bottom-aligned across all three tracks, which is what
   align-items:flex-end gave it before. Those are the shapes this does not improve; banding them
   needs a wrapper inside another component. */
${SOLO} > :not(.twc-field):not(${SOLO_WRAP}):not(.twc-fieldrow)${HAS_FOOTER},
${SOLO} > ${MANY},
${FRAG} > :not(.twc-field):not(${SOLO_WRAP}):not(.twc-fieldrow)${HAS_FOOTER},
${FRAG} > ${MANY} { grid-row: 1 / -1; align-self: end; }

/* #532: ...and a nested WRAPPING row, which until now was placed by NOTHING. The chain rule above
   reaches a nested row through ${ROW}, which carries :not([data-wrap="true"]) - so it matches only a
   non-wrapping inner row - and both fallbacks here carry :not(.twc-fieldrow), which excludes every
   nested row. A wrapping one therefore fell through all three, stayed an unplaced grid item, and
   AUTO-PLACED into row 1: the label track. Measured at a 760px container, the outer template went
   from "27px 40px 24px" to "190px 40px 24px" - the inner row's whole height became the label band -
   and a sibling field's control was pushed 163px down. Only this one pairing is affected, because a
   wrapping PARENT has no band at all.
   It has to stay flex (grid has no flex-wrap, which is why the band is scoped away from it), so it
   gets what every other undecomposable child gets: all three tracks, bottom edge. Its own cells draw
   their own lane, so its last line's control boxes land on the parent's control band exactly as the
   rule above intends. */
${SOLO} > .twc-fieldrow[data-wrap="true"],
${FRAG} > .twc-fieldrow[data-wrap="true"] { grid-row: 1 / -1; align-self: end; }
/* ...and a plain control - a Button, a Menu trigger, a Checkbox with no error - sits in the control
   band, which is what makes #508's shape line up with no lane at all. */
${SOLO} > :not(.twc-field):not(${SOLO_WRAP}):not(.twc-fieldrow):not(${HAS_FOOTER}),
${FRAG} > :not(.twc-field):not(${SOLO_WRAP}):not(.twc-fieldrow):not(${HAS_FOOTER}) {
  grid-row: 2; align-self: end; }

/* #525's fragment cell, when every child is a field: banded too, so the pair lines up with the rest
   of the row. With a natural child among them it stays FLEX, because a cell's implicit columns are
   all sized alike and the button inside would stop hugging. */
${FRAG_FIELDS} { grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); column-gap: inherit; }
/* #538: ...and a fragment cell WITH a natural child among them, which used to drop out of the row
   template altogether - display:flex, grid-row: 1 / -1, align-self:end - and so carried only its
   OWN 24px lane while the row's footer track grew to the tallest footer in the row. Misalignment
   was footerTrack - 24px: measured 18px at a 760px container and 54px at 520px against 0px when
   nothing in the row had a footer, for a Checkbox, a clean Checkbox and a Button alike. #533 made
   it worse rather than causing it, by widening FRAG_NAT to depth <= 2: that moved the
   errored-Checkbox cell into this class out of FRAG_FIELDS, where it had been ON the band. So #533
   bought a horizontal guarantee with #527's headline vertical one.
   It does not have to choose. The cell keeps ${CELL}'s subgrid and its 1 / -1 span; the only thing
   that made flex necessary here was COLUMN SIZING. minmax(0,1fr) above would size every implicit
   column alike and the natural child would stop hugging - but "auto" tracks with
   justify-content:start are content-sized instead, which is the width flex already resolved to:
   the cell's own row column is flipped to "auto" by BAND_COLS for exactly this cell, so the track
   is its max-content either way (measured identical, 189px + 100.4px).
   align-items:flex-end from the FRAG rule above carries over as the grid default align-self, which
   is what the row-2 arm wants; a subgrid item ignores it in the subgridded axis by spec, so the
   chained fields are unaffected. */
${FRAG}${FRAG_NAT} { grid-auto-flow: column; grid-auto-columns: auto; column-gap: inherit;
  justify-content: start; }

/* NO GENERATED LANE IN BAND MODE. The band IS the lane. Not merely redundant: in a subgrid an
   ::after is a grid item, and left to auto-place it lands in the LABEL band. So this kills the
   cell's lane and #494's, however a host switched the latter on - on the field itself, or on an
   ancestor above the row. A fragment cell that stayed on flex keeps its inner lanes, because there
   they are the mechanism. */
${SOLO}::after,
${ROW} .twc-fieldrow__cell:not(:has(> * + *)) .twc-field::after,
${FRAG} .twc-field::after { content: none; }

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
  // hoisted: the column template needs the cell COUNT, and only the container can declare it
  const cells = toCells(children, [], "");
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
        // #527: a band row has no row axis to gap - its three tracks are label/control/footer and
        // their 6px lives on the parts' margins - so the prop drives column-gap alone there. A
        // wrapping row is still flex and still gaps both ways.
        ...(wrap ? { gap: space(gap) } : { columnGap: space(gap) }),
        // #524: the wrap floor, on the cell via a custom property because the cell is the flex item
        // and a consumer cannot reach it. #526: how many footer lines the band holds open.
        ...(minChildWidth != null ? { "--twc-fieldrow-min": len(minChildWidth) } : null),
        ...(footerLines != null ? { "--twc-fieldrow-footer-lines": footerLines } : null),
        // #527: one column per cell, each an equal share unless the stylesheet flips it to `auto`
        // for a cell holding an inline-level control. This is the whole reason a grid row can keep
        // flex's stretch-vs-natural: the track LIST must be declared on the container, and only the
        // container knows how many cells there are. Before `style`, so a host with a row wider than
        // the twelve positions the sheet covers can write its own.
        ...(wrap ? null : {
          gridTemplateColumns: cells.map((_, i) => `var(--twc-fieldrow-c${i + 1}, minmax(0, 1fr))`).join(" "),
        }),
        ...style,
        // AFTER `style` on purpose: a host's own `gap` would otherwise set row-gap too and prise the
        // three bands apart. row-gap means nothing in a row that does not wrap.
        ...(wrap ? null : { rowGap: 0 }),
      }}
      {...rest}
    >
      {__twcStyles}
      {cells.map(({ key, child }) => (
        <div key={key} className="twc-fieldrow__cell">{child}</div>
      ))}
    </div>
  );
});
