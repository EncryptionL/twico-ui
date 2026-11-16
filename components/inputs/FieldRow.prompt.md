# FieldRow

A row of fields **and plain controls** that line up by their control box rather than their outer box,
with one shared footer lane beneath. Use it for a filter/condition row, or any row where a button
sits beside the field it acts on.

```jsx
import { FieldRow, Select, Input, Button, IconButton } from "twico-ui";

<FieldRow>
  <Select label="Field" options={fields} value={field} onChange={setField} />
  <Select label="Comparison" options={ops} value={op} onChange={setOp} />
  <Input label="Value" value={value} onChange={(e) => setValue(e.target.value)} />
  <IconButton aria-label="Remove condition" variant="ghost" tone="danger" icon={TrashIcon} />
</FieldRow>

<FieldRow>
  <Input label="…to this value" error={tooLong ? "28 characters; the limit is 24." : undefined} />
  <Button size="sm" variant="outline">Insert</Button>
</FieldRow>
```

- **Children need no props.** Fields share the row's width (`flex: 1`); a plain control keeps its
  natural size. That absorbs the `flex: 1` wrapper divs such a row would otherwise need around each
  field.
- A hint or error on one field makes that field taller. In a plain flex row with
  `align="flex-end"` that lifts its control above its neighbours. `reserveFooter` (#494) fixed that
  between fields, but its selector is `.twc-field` — a `Button`/`IconButton`/`Menu` trigger in the
  same row has no footer to reserve and still rode up (#508). FieldRow gives every cell the lane, so
  *field vs button* is not something you have to know.
- The lane is built the way `reserveFooter` builds it — generated content at `--text-xs` after the
  same `--space-1-5` gap — so it matches a real footer by construction, not by a length that drifts
  when a token changes. `:has()` decides per cell at **any depth**, so a cell holding something that
  already ends in a footer gains no second lane. That covers a plain field, a field behind a
  `Tooltip` or a host `<div>`, and the two controls whose footer is not under a `.twc-field` root at
  all (`Slider`, `FileUpload`), whose footer offset a cell also normalises so they sit flush.
- **Every cell stretches by default**; only a cell holding an inline-level control (a `Button`,
  `IconButton`, `Checkbox`, `Switch`, `Radio`, `Tag`, `Badge`, …) keeps its natural size. The
  polarity matters: an unknown child — your own wrapper, a third-party control, a component added
  later — gets the answer that is right for it with no list for anyone to maintain. `Checkbox`,
  `Switch` and `Radio` only grow a `.twc-field` root when they have an `error`, so keying width on
  that root made a validation message re-flow the whole row (#519); it no longer can.
- `gap` takes a spacing step (`3` → `var(--space-3)`) or any CSS length, like `Stack`'s. `wrap` lets
  the row break onto more lines instead of squeezing every field below a usable width.
- `null`, `false`, `""` and `0` children are dropped, so a conditionally-rendered field leaves no
  empty cell still drawing a lane and still taking part in the gap. A **fragment** child is
  flattened into one cell per field; a *component* that returns a fragment is still one cell,
  because nothing can see through a render.
- For a row you lay out yourself, `reserveFooter` on each field (or once on an ancestor) still works;
  wrap a non-field control in `<Field reserveFooter>` to give it the same lane by hand. The two
  compose: a field opting in for itself keeps its own lane and its cell draws none, and a
  `FieldRow` placed *inside* a `data-reserve-footer` ancestor suppresses the inherited lane —
  either way there is exactly one.
- **A wrapping hint no longer re-breaks the row (#527).** A non-wrapping row is a three-track grid
  — label / control / footer — with the footer track sized to the tallest footer in the row, so a
  hint that wraps makes the row taller instead of lifting its own control. `footerLines` is that
  track's floor rather than a per-cell reserve. `Slider`, `FileUpload`, a `Field` holding two
  controls and a fragment cell with a plain control in it keep their previous behaviour; a
  **wrapping** row keeps the flex path entirely.
