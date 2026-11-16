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
  when a token changes. `:has()` decides per cell, so a field that already shows a hint or error
  keeps its own footer and gains no second lane.
- `gap` takes a spacing step (`3` → `var(--space-3)`) or any CSS length, like `Stack`'s. `wrap` lets
  the row break onto more lines instead of squeezing every field below a usable width.
- `null` / `false` children are dropped, so a conditionally-rendered field leaves no empty cell
  still drawing a lane and still taking part in the gap.
- For a row you lay out yourself, `reserveFooter` on each field (or once on an ancestor) still works;
  wrap a non-field control in `<Field reserveFooter>` to give it the same lane by hand.
