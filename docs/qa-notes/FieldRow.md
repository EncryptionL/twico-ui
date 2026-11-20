# QA notes — FieldRow

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-11-20 (new in #508; reworked in #519-#521; footer band in #527; wrap path in
  #530-#533; the 1.51.2 follow-ups in #536-#538)

## Open issues

None identified. #543 — a fragment cell's child vetoing the lane with an inline margin — is fixed;
see [#543 — the library was vetoing itself](#543--the-library-was-vetoing-itself) below.

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

## The footer band (#527, closing #526)

The lane reserved a whole number of LINES per cell, so a field whose real `hint` wrapped past the
reserve was taller than its siblings and `align-items: flex-end` lifted its control by the
difference — #494's own symptom, inside the component built to prevent it. Measured on one row at
one width, changing only the hint's length: control bottoms `[272,272,272,272]` with one line,
`[141,87,141,141]` when it wrapped to four. Because it tracks the cell's **rendered width**, no
per-cell reserve can bound it — a host would have to know the wrap count at every viewport.

A non-wrapping row is now a three-track grid — label / control / footer — each track sized to its
tallest member, so every control bottom lands on one line by construction and a footer that wraps
makes the ROW taller instead of moving a control. The parts have to be separate grid items and a
field's footer is a child *inside* the single `.twc-field`, so **subgrid** is what reaches it: the
cell subgrids the row's tracks, the `.twc-field` subgrids the cell's, and each part is pinned by
selector. The whole band is assembled from `FieldRow.jsx` — **no change to `Field.jsx`, to the 16
stylesheets that re-declare the `.twc-field` family, or to the 17 JSX returns that build that markup
inline.**

### Why this was affordable

- **Subgrid costs no browser support here.** It reached Baseline Sept 2023 (Chrome 117); the
  `:has()` this file already requires reached it Dec 2023 (Firefox 121). A browser with `:has()` has
  subgrid, so there is no fallback question and no `@supports` gate.
- **Stretch-vs-natural survives.** `grid-template-columns` must be declared on the container, so the
  JSX — which already maps children to cells and therefore knows the count — emits one `var()` per
  cell defaulting to `minmax(0, 1fr)`, and the sheet flips `--twc-fieldrow-cN: auto` for a cell
  holding an inline-level control, using the same derived list and the same depth-2 test as the flex
  rules. Measured identical to the flex path: `[145.3, 145.3, 145.3, 48.2]`.
- **`wrap` keeps the flex path byte for byte.** Grid has no `flex-wrap`, and `minChildWidth` is a
  flex-basis floor that only means anything with wrap.

### Verified

| shape | before | after |
| --- | --- | --- |
| hint wrapping to four lines | **54px** | **0px** |
| same row, `footerLines={2}` | 18px | **0px** |
| same row, one-line hint | 0px | 0px |
| component returning a fragment | 0px | 0px |
| the 12 shapes from #519-#525 | 0px | **0px, widths unchanged** |

### What it does not fix

Three shapes keep today's behaviour, because the band cannot take their parts apart without a wrapper
inside another component: `Slider` (head + track + msgs), `FileUpload` (label + zone + list + error),
and a `Field` holding two controls. Each measured identical to base, so nothing regresses — but #526
is closed for every *field-shaped* cell, not universally.

> A fourth shape was listed here — a fragment cell that also holds a plain control — and should not
> have been. See "#531" below: "measured identical to base" was the wrong test, because base was
> already 24px out.

### A trap worth recording

The band's column rules use a depth-2 term spelled `> * >`, **not** the `WRAP` gate used elsewhere.
`WRAP` is `:not(:has(...))`, and `:has()` may not be nested inside `:has()`; its argument list is
**unforgiving**, so one invalid member drops the entire rule. When that happened during
implementation every natural cell silently lost its hug — a Button column measuring 121px instead
of 48.2px — while alignment still looked correct. `tests/fieldrow-natural-roots.test.jsx` now pins
the spelling.


---

## #530 / #531 / #532 / #533 — the wrap path, and three defects found while fixing it

#530 was reported against 1.51.1 with measurements. Reproducing it surfaced three more in the same
rule block — #531, #532 and #533 — each filed separately and then fixed. #530–#532 shipped together;
#533 followed, once measuring it showed the cause was three rules rather than the one reported.

### #530 — `minChildWidth` could not reach the fields inside a fragment cell

#524 put the wrap floor on the **cell**, and a *component* returning a fragment is one cell —
`React.Children` cannot see through a render. So when every field in a row came from one shared
component, the row had a single flex item: nothing to break against, and no way to ask for a floor
on the fields themselves. A host cannot reach past it either, which is the same reason the floor
became a prop in the first place — the cell is created *between* the row and the child.

The cell now lets the row's floor through to its own children and becomes a wrap container. The two
declarations are **one inseparable pair**: a floor with `nowrap` does not squash, it makes the cell's
min-content wider than the row and **overflows** — strictly worse than the squash it replaces.

| container, `minChildWidth="15rem"`, `gap={2}` | before | after | hand-laid target |
| --- | --- | --- | --- |
| 760px | 1 line, `[248, 248, 248]` | 1 line, `[248, 248, 248]` | `[248, 248, 248]` |
| 520px | 1 line, **`[168, 168, 168]`** | **2 lines, `[256, 256, 520]`** | `[256, 256, 520]` |
| 360px | 1 line, `[114.7, 114.7, 114.7]` | 3 lines, `[360, 360, 360]` | — |

The component now matches the hand-laid row exactly at both widths the report measured.

**Gated to a wrapping row, and to a fragment cell holding only fields.** The gate is the
character-for-character complement of the natural-roots cell test, so the two are mutually exclusive
by construction rather than by cascade. The depth-2 arm is **not** redundant with the depth-1 per-child
rule: measured without it, a fragment cell holding a Tooltip-wrapped Button stayed 480px wide and broke
into three 480px lines. Gated, both the depth-1 and depth-2 forms are byte-identical to 1.51.1.

**Behaviour changes to expect**, both consequences of the break happening inside the cell:

| shape | before | after |
| --- | --- | --- |
| trio + a sibling cell, 760px | 1 line, `[120, 120, 120, 376]` | 3 lines, `[376, 376, 376, 376]` |
| trio, **no** `minChildWidth`, 480px | 1 line, `[154.7, 154.7, 154.7]` | 2 lines, `[236, 236, 480]` |
| trio, **no** `minChildWidth`, 500px+ | unchanged | unchanged |

The default `10rem` floor means a wrapping row with a fragment child and `gap={2}` now breaks below
~496px (3 × 160 + 2 × 8) where it used to squash.

### The escape hatch — the report's premise was false

The issue stated that the only way to pass a shared group as direct children is to duplicate it at
each call site. It is not: `toCells` descends into a Fragment **element** and `Children.toArray`
flattens arrays, so a group shared as a **value** gets three real cells, the real floor, the real
wrap and the #527 band — at zero duplication. Measured at 520px: `[256, 256, 520]`, identical to
writing the fields out by hand.

```jsx
const trio = () => (<><Select … /><Select … /><Input … /></>);
<FieldRow wrap minChildWidth="15rem">{trio()}</FieldRow>   // three real cells
```

This is the documented answer for every shape #530's fix does not reach.

### #531 — a fragment cell's non-field child got no lane (24px, both paths)

The fragment lane rule can only reach a `.twc-field`, because a field is a **column** flex container
so its `::after` lands below its control. A `.twc-btn` is `inline-flex` — a **row** — so an `::after`
on it becomes a flex item *inside* the button. The cell cannot draw one either: the cell is a row, so
a cell-level `::after` sits *beside* the children.

So the lane-less child takes the lane's **height as margin** instead — geometrically identical, built
from the same two tokens, touching nothing inside the child.

| shape | before | after |
| --- | --- | --- |
| fragment cell + `Button`, band path | **24px** | **0px** |
| fragment cell + `Button`, band path, 520px | **24px** | **0px** |
| fragment cell + `Button`, wrapping path | **24px** | **0px** |
| the same three as direct children | 0px | 0px |

24px is exactly `var(--space-1-5)` + one `--text-xs` line at `--leading-normal`. This was #508's own
symptom inside a fragment cell — the shape the component exists to fix.

### #532 — a nested wrapping row was placed by no rule at all (163px)

The chain rule reaches a nested row through `ROW`, which carries `:not([data-wrap="true"])`, and both
band fallbacks carry `:not(.twc-fieldrow)`. A **wrapping** inner row therefore matched none of them,
stayed an unplaced grid item, and auto-placed into row 1 — the label track.

| parent | inner row | label track | spread |
| --- | --- | --- | --- |
| non-wrapping | **`wrap`** | **190px** | **163px** |
| non-wrapping | no wrap | 27px | 0px |

It must stay flex (grid has no `flex-wrap`), so it gets what every undecomposable child gets: all
three tracks, bottom edge. Only this pairing is affected — a wrapping parent has no band.

### #533 — a validation error changed the cell's layout mode

Reported as one rule testing depth 1; it was **three**, and the band half mattered more than the
per-child half.

`Checkbox`/`Switch`/`Radio` grow a bare `div.twc-field` root **only when they have an `error`**
(`Checkbox.jsx:126`). Three fragment-cell tests looked at depth 1 only, so each saw `.twc-check` when
clean and `.twc-field` when errored, and the two states fell on opposite sides:

| rule | what it decides | was |
| --- | --- | --- |
| the per-child hug | does this child hug or stretch | depth 1 |
| `FRAG_FIELDS` | is this an all-field cell, i.e. **bandable** | depth 1 |
| the band's keep-on-flex rule | or does it stay flex | depth 1 |

while the **cell** test has tested depth ≤ 2 since #519, precisely so "a validation error no longer
re-flows the row".

So in the clean state the cell stayed flex and the control hugged at **100.4px**; in the errored
state `FRAG_FIELDS` matched, the cell was banded as an all-field cell and gridded into
`minmax(0, 1fr)` columns, and the control became **189px**. All three tests are now depth ≤ 2, from
one interpolated `FRAG_NAT` constant rather than three hand-written copies.

| state | direct child | `flex` | width before | width after |
| --- | --- | --- | --- | --- |
| clean | `label.twc-check` | `0 1 auto` | 100.4px | 100.4px |
| `error` | `div.twc-field` | `0 1 auto` | **189px** | **100.4px** |

**Why no within-case check could catch it.** Each state is internally consistent and 0px out — the
defect is that the two states *disagree*. It only appears when the same shape is measured twice and
the results compared, so the probe now has a cross-case section for exactly this. Validated by
reverting both halves: `100.4px → 189px` returns.

### Two process notes worth keeping

**"Identical to base" is not a test.** #531 was recorded in #527 as one of four shapes that keep
today's behaviour, verified as "measured identical to base, so nothing regresses". That was true, and
useless: base was already 24px wrong. Comparing against a baseline without first checking the
baseline is correct turned a bug into a documented limit.

**Do not derive an alignment assertion from position.** Three successive versions of the probe's
alignment check were wrong in the same direction — each silently *skipping* rows rather than failing
them:

1. comparing cell **tops** — `align-items: flex-end` makes tops differ whenever heights differ, so
   any row containing a short child was labelled "wrapped" and skipped the assertion. This is what
   hid #531.
2. grouping **controls** by vertical overlap — circular: a misalignment splits the controls into two
   "lines" and each line is then trivially flat. It reported 0 problems with #532's 64px present.
3. the version that works: assert the **structure**. Group the *cells* (a cell is a flex or
   full-span grid item, so cells sharing a line share a bottom edge), then compare each cell's
   bottom-most control within a line; and within a fragment cell, group the *children's boxes* and
   compare their controls. A lane/margin defect lives *inside* an item, so the boxes still agree
   while the controls do not — which is exactly what makes it visible.

Each fix in this change was then validated by **disabling it and confirming the probe fails**:
#530 → `[168, 168, 168]` returns, #531 → 24px × 3, #532 → 64px.

---

## #536 / #537 / #538 — what 1.51.2's three fixes left behind

All three were reported against **1.51.2 as installed**, with measurements, and all three reproduced
exactly on the first probe run. Two more came out of the same run that no issue had reported.

Everything below is headless Chromium over SSR'd markup of the real components
(`.work/probe/app4.jsx` + `measure4.mjs`), numbers rounded to 0.1px.

| | reported | measured on 1.51.2 | after |
| --- | --- | --- | --- |
| **#536** a 12px word floored to `minChildWidth` | 2 lines, 190px, fields 256/520 | identical | **1 line, 91px, `[240, 24, 240]`** |
| **#537** the fragment lane ignores `footerLines` | 0 / 18 / 36px at 1 / 2 / 3 | identical | **0 / 0 / 0px** |
| **#538** `FRAG_NAT` off the #527 band | 18px @760, 72px @520 | 18px @760, **54px** @520 | **0px / 0px** |
| *(found)* a word 24px low inside the cell, wrap | — | 24px, all three widths | **0px** — #543 |
| *(found)* a word 40px out inside the cell, band | — | **40px** | **0px** |

The 520px number for #538 differs from the report (54 vs 72px) only because the probe's error string
wraps to a different number of lines; the quantity is `footerTrack − 24px` either way.

### #536 — the floor's subject was `> *`

#530's floor landed on **every** direct child of a qualifying fragment cell, not on the fields. The
shape that exposes it is the range row, which is one of the commonest reasons to share a fragment:

```jsx
const Range = () => (<><Input label="from" /><Text size="sm">to</Text><Input label="to" /></>);
<FieldRow gap={2} wrap minChildWidth="15rem"><Range /></FieldRow>
```

| build | `minChildWidth` | inner lines | cell height | child widths |
| --- | --- | --- | --- | --- |
| 1.51.1 | `15rem` | 1 | 91px | `[168, 168, 168]` |
| 1.51.2 | `15rem` | **2** | **190px** | `[256, 256, 520]` |
| **after** | `15rem` | 1 | 91px | `[240, 24, 240]` |
| 1.51.2 | default | 1 | 91px | `[168, 168, 168]` |

At the default `10rem` the three happened to fit, so the defect appeared **only** once
`floor × children` passed the container width — i.e. exactly when someone set the prop because they
needed it.

**The second selector is load-bearing.** `> .twc-field` alone — the issue's first suggestion, and the
obvious reading — would take the floor off a field behind a `Tooltip`'s span or a host `div`, because
*that wrapper* is the flex item. Measured both ways:

| case | `> *` (1.51.2) | `> .twc-field` only | `> .twc-field, > :has(> .twc-field)` |
| --- | --- | --- | --- |
| `Input / Text / Input` | 2 lines ✗ | 1 line ✓ | **1 line ✓** |
| `Input / Tooltip(Input) / Input` | 2 lines ✓ | 1 line, middle field squashed ✗ | **2 lines ✓** |
| `Input / div(Input) / Input` | 2 lines ✓ | 1 line, middle field squashed ✗ | **2 lines ✓** |

Two lines is the *right* answer for the last two: three real fields at a 240px floor do not fit in
520px, and breaking is what #530 exists to do. Which is why the probe's assertion is on the computed
`min-inline-size` per child, not on a line count — a line count would have passed the squash.

The two #530 rules also now read **one shared constant** (`FRAG_WRAP`). They have to be gated
identically — a floor without the matching `flex-wrap` makes the cell's min-content wider than the
row and it overflows horizontally instead of breaking, strictly worse than the squash it replaces —
and #536 *was* the second copy being wrong.

### #537 — a fragment cell has TWO lanes, and neither scaled

The reported half is the margin #531 added. Fixing only that moved the misalignment rather than
removing it, from "cell vs row" to "sibling vs sibling inside the cell", still 36px: the `::after`
that a fragment cell's **field** children draw was also a constant one line, while the row track and
the cell lane both read `--twc-fieldrow-footer-lines`.

| `footerLines` | 1.51.2 | margin fixed only | both fixed |
| --- | --- | --- | --- |
| 1 | 0px | 0px | 0px |
| 2 | 18px | 0px (band) | 0px |
| 3 | 36px | **36px** (wrap) | **0px** |

Four places reserve footer space, and a test now pins that all four read the same variable. The
band-path numbers are fixed by **#538**, not by the multiplier — after the cell is placed by
`grid-row` it uses no lane at all — which is why the margin is now scoped to the wrap path. Leaving
it unscoped would lift a row-2 item straight back out of the band.

### #538 — `FRAG_NAT` had been traded off the band by #533

Once a fragment cell answered `FRAG_NAT` it was placed by `display: flex; grid-row: 1 / -1;
align-self: end` — spanning all three tracks and bottom-aligned, carrying only its own 24px lane,
while the row's footer track grew to the tallest footer in the row. The error is `footerTrack − 24px`
and it needs a footer *somewhere else* in the row to appear:

| case | 1.51.2 | after |
| --- | --- | --- |
| 760px, sibling's error wraps to 3 lines | 18px | **0px** |
| 520px, same | 54px | **0px** |
| 760px, no footer anywhere | 0px | 0px |
| 760px, *clean* Checkbox + wrapping sibling | 18px | **0px** |
| 760px, Button instead of Checkbox | 18px | **0px** |
| 760px, Button as a **direct** child (the #508 baseline) | 0px | 0px |

#533 did not cause this; it *widened* `FRAG_NAT` to depth ≤ 2, which moved the errored-Checkbox cell
into this class **out of** `FRAG_FIELDS`, where it had been on the band. So #533 bought a horizontal
guarantee with #527's headline vertical one.

**It did not have to choose.** The only thing `display: flex` was buying was column sizing:
`FRAG_FIELDS` uses `minmax(0, 1fr)`, which sizes every implicit column alike and would stop the
natural child hugging. `auto` tracks with `justify-content: start` are content-sized instead — and
that is the width flex already resolved to, because the cell's own row column is flipped to `auto`
by `BAND_COLS` for exactly this cell, so the track is its max-content either way:

| | flex (1.51.2) | `auto` tracks |
| --- | --- | --- |
| `Input` + `Checkbox` in a 297.4px cell | 189 + 100.4 | **189 + 100.4** |

So the cell keeps `CELL`'s subgrid and its `1 / -1` span, and the whole placement vocabulary a
single-child cell already had is **mirrored onto a fragment cell**: the subgrid chain, both
undecomposable fallbacks, the nested-wrapping-row arm, and the control-band arm. A fragment cell is
now a cell whose children are each placed exactly as a solo cell's single child is, flowed into
columns instead of occupying the one column.

That mirror is what fixed the 40px case nobody reported: a non-wrapping range row's `Text` matched
**no** placement rule, so it auto-placed into row 1 — the label track — exactly as #532's nested
wrapping row did.

### #543 — the library was vetoing itself

`Text` and `Heading` reset their UA margins with an **inline style**, and an inline declaration
beats every stylesheet rule whatever its specificity. So #531's margin-based lane could not reach
them and such a child sat one lane (24px) low — on the **wrap** path only, measured at 24px across
all three widths. The band path was already 0px, because since #538 it places the child with
`grid-row` and *layout* cannot be vetoed by a margin.

Not a regression: 1.51.1 had the same 24px, from the child getting no margin at all. #531 narrowed
the family to "children that reset their own margin inline" rather than closing it.

**No mechanism inside FieldRow closes it**, which is why the fix is elsewhere. Every alternative
fails on a different child, and the reason is that the lane has to do two jobs at once — reserve the
cell's height *and* lift the child's content — and only three properties do both:

| mechanism | works for | breaks |
| --- | --- | --- |
| `margin-block-end` | `Button`, `Checkbox`, `Badge`, a host `div` | anything with an inline margin reset |
| `padding-block-end` | `Text` | `Button` — padding is part of its box, so it grows |
| `::after { display: block }` | `Text` | `Button` — flex items are blockified, so it lands *inside* |
| `border-block-end: … transparent` | `Text` | `Button` — overrides its real bottom border |
| `position: relative` + `inset-block-end` | both, visually | reserves no height, so a cell of only lane-less children loses the lane entirely |

Picking per child needs the open-ended "every wrapper a host might write" list that
`NATURAL_ROOTS`' polarity exists to avoid.

**So the reset moved into each component's own scoped stylesheet.** `Pre` already did it that way
(`.twc-pre { margin: 0; … }`), so this is the in-house pattern rather than a new one, and
`base.css` already carries `p { margin: 0 }` and `h1, h2, … { margin: 0 }` — which means the inline
copies were redundant for every consumer who imports `twico-ui/styles.css`, i.e. everyone, since
without it there are no tokens either. A scoped rule rather than relying on `base.css` keeps each
component self-contained (§5).

At `(0,1,0)` the reset still wins a tie against the element reset and still loses to any rule that
*means* to move it — FieldRow's lane is `(0,3,0)` — so the lane lands.

Two things an adversarial review corrected about how this was first written up, both recorded in
`docs/qa-notes/Text.md`:

- **"Everything else left inline carries prop values" is false.** `Text` keeps two constants inline
  (`font-family`, `line-height`) and `Heading` keeps five (`font-family`, `font-weight`, `color`,
  `line-height`, `letter-spacing`), and `Heading` has no `tone`/`color`/`weight` prop at all. Those
  seven are as un-overridable as the margin was. #543 fixed the case where the library vetoed
  *itself*; it did not close the class.
- **"A consumer's own CSS now works" cuts both ways at `(0,1,0)`.** React inserts a hoisted sheet at
  `head.firstChild`, ahead of the app's own CSS, so at equal specificity the consumer wins on source
  order — including third-party rules written with no knowledge of twico, such as
  `@tailwindcss/typography`'s `.prose :where(p)`, which is `(0,1,0)` because `:where()` scores zero.
  Whether the reset should hold that tie at `(0,2,0)` is an open decision, not a defect — **#547**.

| | before | after |
| --- | --- | --- |
| 520px, `minChildWidth="15rem"` | 24px | **0px** |
| 760px, same | 24px | **0px** |
| 520px, default floor | 24px | **0px** |
| 760px, no `wrap` (band) | 0px | 0px |

The probe's `#543` block is now **asserted on both paths**, where it used to be
printed-but-tolerated on the wrap one. Validated by reverting a single inline `marginBottom: 0` in
`Text`: all three wrap cases return to 24px and the band case stays at 0px, which is also the proof
that the band path never depended on the margin.

A `<style>` element is metadata content and `<p>` accepts only phrasing content, so an always-on
style child would have been invalid HTML. It is not one: on React 19 `useScopedStyles` returns a
hoistable `<style href precedence>` that React lifts to `<head>` — in the SSR stream too — and on
React 18 it returns `null` and injects imperatively. A test asserts the element carries no `<style>`
child and that the rule reaches `<head>` exactly once across three instances.

### Validated by disabling each fix

| disabled | what returns |
| --- | --- |
| #536's floor subject | `range-520` back to `min(100%, 240px)` on the word, 2 lines, 190px |
| #537's margin multiplier | `fl3-wrap-760` back to 36px |
| #537's `::after` multiplier | `fl3-wrap-760` back to 36px — both halves have to move together |
| #538's `auto` tracks | 42 / 78 / 24 / 42 / 42px across the five cases |

The #538 row is worth reading twice: with #537's margin fixed but #538 reverted, the *no-footer*
case goes from 0px to 24px. The three changes are one coupled change, and #537 alone would have
regressed a case that was previously correct.

### Regression suite

The 28-case `#530`–`#533` probe (`app3.jsx`) runs **0 problems** throughout, with its headline
numbers unmoved: 520px wrap `[256, 256, 520]` matching the hand-laid baseline, 760px
`[248, 248, 248]`, 360px `[360, 360, 360]`, fragment+Button `[146.5, 146.5, 69.5]`, and the #533
invariant at 100.4px clean and errored.
