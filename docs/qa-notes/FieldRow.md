# QA notes — FieldRow

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-11-16 (new in #508; reworked in #519-#521 after review)

## Open issues

None identified.

## Why it exists

`reserveFooter` (#494) aligned **field vs field** in a row: a `hint` on one field makes it taller, so
`align="flex-end"` lifts its control above its neighbours, and the fix reserved an empty footer on the
fields that had none. Its selector is `.twc-field`, so the other half stayed broken — a
`Button`/`IconButton`/`Menu` trigger in the same row has no footer to reserve and still rode up by a
footer's height the moment a sibling field grew one (#508). The issue author noted #494 was
under-specified by asking only for the field prop.

The shape is common enough to own: an "insert at the cursor" button beside the box it writes into, or
a remove button at the end of a filter condition row. The rejected alternative was widening
`reserveFooter`'s CSS to also match `.twc-btn` / `.twc-iconbtn` — see
[prop-conventions.md](../prop-conventions.md) → "Where reserveFooter stops, and FieldRow (#508)" for
why a button's own `::after` cannot work (it lands *inside* the button box and just makes the button
taller, and the button is not the element that needs the lane — the cell around it is).

## Reworked after review (#519, #520, #521)

The first cut shipped in v1.50.0 and an adversarial review found 11 defects in it, every one tracing
to a single mistake: the CSS answered **two** questions ("share the row's width?" and "already has a
footer?") from **one** markup test, `:has(> .twc-field)` - a *direct-child* selector - while the
`reserveFooter` rule it switched on (`Field.jsx:17`) is a *descendant* selector. The rework:

- **One lane, one source.** The row no longer sets `data-reserve-footer`, so #494's descendant rule
  cannot fire inside it; the cell draws the only lane. The lane test asks "does anything in here
  already end in a footer?" at **any depth** - `.twc-field__footer`, `.twc-field__hint`,
  `.twc-field__error`, a nested `.twc-fieldrow`, or a `[data-reserve-footer]` opt-in - which also
  catches the two footers no `.twc-field` test can see, since `Slider` wraps one in
  `.twc-slider__msgs` and `FileUpload` puts a bare error under `.twc-upload`.
- **Suppression.** A host may put `data-reserve-footer` on an ancestor *above* the row -
  [prop-conventions.md](../prop-conventions.md) documents that as a first-class pattern - so
  `.twc-fieldrow .twc-fieldrow__cell .twc-field:not([data-reserve-footer])::after { content: none; }`
  kills the inherited lane. At (0,4,1) it outranks #494's (0,3,1). The `:not()` is what lets a field
  that opted in *for itself* keep its own lane, and the cell rule skips such a cell - so the pair
  always yields exactly one lane, never two and never none.
- **Stretch is now the default**, and only a cell holding an inline-level control keeps its natural
  size. The polarity is the point: an unknown child - a host wrapper, a third-party control, a
  component added later, or `Slider`/`FileUpload`/`FilterBar`/`Form`, which fill their width without
  ever being a `.twc-field` - lands on the right answer with no list to maintain. The one list left
  names only boxes this library ships, and it is **derived, not curated**: every single-class
  `.twc-*` rule declaring `display: inline-flex`, minus the three overlay wrappers.
  `tests/fieldrow-natural-roots.test.jsx` re-runs that derivation and fails on drift.
- **Depth <= 2** for that test, which is what makes it immune to the two shapes that moved the old
  one: `Checkbox`/`Switch`/`Radio` grow a bare `div.twc-field` root *only* when they have an `error`
  (`Checkbox.jsx:126`), and `Menu`/`Tooltip` interpose a `*-wrap` span. It deliberately stops at 2 -
  `.twc-radio` sits at depth 3 inside a `RadioGroup`, which fills.
- **`wrap`** (#520) was inert for fields: `flex: 1 1 0` with `min-inline-size: 0` made every field
  cell's hypothetical main size 0, so the line could never overflow and no break was taken - the
  fields squeezed to 4px instead. A floor, `min-inline-size: min(100%, var(--twc-fieldrow-min, 10rem))`
  under `data-wrap`, restores the break while keeping basis 0 so cells on a line still share it
  evenly.
- **Children** (#521): every *falsy* child is dropped, not just `null`. `React.Children.map` already
  normalises `undefined`/`true`/`false` to `null`, so the old `=== false` clause was unreachable
  while `""` and `0` - exactly what `{cond && <X/>}` produces - still got a cell. Fragments are
  flattened into one cell per field; a *component* returning a fragment is still one cell, which is a
  documented limit rather than a bug.
- **Footer offset.** `Slider` adds `margin-top: var(--space-2)` (8px) and `FileUpload`'s root `gap`
  is `var(--space-3)` (12px) above its error, against the field family's 6px. With the lane correct
  those still measured 2px and 6px out of line, so a cell normalises just that offset - `FileUpload`
  by negative compensation, because its `gap` also spaces the zone from the file list.

## Verified OK

- Measured in headless Chromium at 1400px over SSR'd markup plus `styles/twico-ui.css`, 12 shapes,
  **control-box bottoms identical (0px spread) in all 11 non-wrapping cases**:

  | shape | before | after |
  | --- | --- | --- |
  | field behind a `Tooltip` + field + `Button` | 24px ride-up, cell 189px vs 317.5px | 0px, cells 233.2/233.2 |
  | field in a host `<div>` + field + `Button` | 25px ride-up | 0px |
  | `Input` + `Slider` with a hint | 25px | 0px |
  | `Input` + `FileUpload` with an error | 29px | 0px |
  | `Input` + `Checkbox`, no error | 496.4/91.6 | 456.4/91.6 |
  | `Input` + `Checkbox`, with error | **294/294** (input lost 202px) | 456.4/91.6 - unchanged |
  | `FieldRow wrap` at 320px | 1 line, inputs 40.6px | wraps, 206px of row height |
  | `""` and `0` children | a 3.3px cell drawing a lane, literal "0" | no cell, no text |
  | fragment child | 1 cell, fields stacked 97px apart | 3 cells, bottoms level |
  | inside `<Stack data-reserve-footer>` | 2 lanes per field cell | 1 lane, 0px spread |
  | `<Field reserveFooter>` child | - | its own lane, cell draws none |
  | the #508 baseline (error + field + `IconButton`) | 0px | 0px |

- The probe's own first run was **wrong and self-flattering**: it inferred "wrapped" from differing
  cell *tops*, which `align-items: flex-end` makes differ whenever heights differ, so it labelled 11
  of 12 cases WRAPPED and skipped the alignment assertion. Corrected to "some cell starts below
  another ends", it then exposed the 2px/6px `Slider`/`FileUpload` residuals that are now fixed.
- `tests/fieldrow-natural-roots.test.jsx` re-derives the natural-roots list (17 inline-flex roots, 14
  after the wrappers - exactly what ships) and asserts #494's lane rule is byte-identical across
  every stylesheet that carries it. That guard immediately corrected the record: the lane is
  duplicated in **sixteen** scoped stylesheets, not the eleven previously believed.
- SSR-safe: no `window`/`document` at module or render scope; the `<style>` is hoisted out of the
  flex container on React 19 and returns `null` on 18, so it never becomes a flex item.
- Logical properties throughout (`min-inline-size`, `margin-block-start`), so `dir="rtl"` mirrors
  with no extra rule, and `data-density` retunes the controls on both sides of a row together.
- Full suite green: 178 files / 1536 tests.

## Notes

- Hooks must not be used inside a Variations `render` callback — the docs site calls `render()` inline
  from the page component, so a `useState` there joins that component's hook list and throws React
  #310 when the list shifts. `FieldRowVariations.jsx` keeps its stateful example in a named
  `ConditionalFieldExample` component, which is the pattern the other Variations files already use.
