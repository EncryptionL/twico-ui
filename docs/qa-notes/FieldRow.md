# QA notes — FieldRow

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-11-16 (new in #508)

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

## Verified OK

- Each child is wrapped in `.twc-fieldrow__cell`, a flex **column** ending in the footer lane, so
  alignment is by control box regardless of what the child is (`FieldRow.jsx:32`).
- The row carries `data-reserve-footer=""`, i.e. #494's **ancestor** form, so every `.twc-field`
  inside reserves its own lane with no per-field prop — a field added to the row later is covered
  with no edit (`FieldRow.jsx:59`).
- The lane for a non-field cell is built the way #494 builds it — `content: "\00a0"` at
  `--text-xs` after the same `--space-1-5` gap — so it matches a real footer by construction rather
  than by a length that drifts when a token changes (`FieldRow.jsx:39-40`).
- `:has()` decides per cell, so a field already showing a hint or error keeps its own footer and
  gains no second lane. `:has()` was already shipped in Tooltip, so this adds no new baseline
  requirement (`FieldRow.jsx:35-36`).
- Fields get `flex: 1 1 0`, plain controls `flex: 0 0 auto` — which absorbs the `flex: 1` wrapper
  divs a host would otherwise write around every field (`FieldRow.jsx:35-36`).
- `null` / `false` children are dropped rather than left as an empty cell that would still draw a
  lane and still take part in the gap (`FieldRow.jsx:64-68`).
- `gap` maps a number to `var(--space-N)` and passes a string through, matching `Stack`'s semantics;
  `style` is merged **after** the row's own gap, so an inline gap wins (`FieldRow.jsx:5-9,60`).
- `min-width: 0` on the cell, so a long value in a field cannot push the row wider than its
  container (`FieldRow.jsx:32`).
- Logical properties only — `gap` and `flex-direction` mirror under `dir="rtl"` with no extra rule.
- Forwards its ref to the row element; `className` is appended to `twc-fieldrow`, never replacing it;
  `...rest` lands on the row, so `data-*` / `aria-*` pass through.
- SSR-safe: no `window`/`document` at module or render scope; CSS via `useScopedStyles`, so React 19
  streams it in `<head>` with no FOUC.
- Measured on the docs page (headless, 1400 px): 10 `FieldRow` instances, control-box bottoms within
  1 px in every one — including the two rows where one field is showing an error — and the cells of
  each row share an identical bottom edge. Computed `::after` content is `" "` on the non-field cells
  and `none` on the field cells, i.e. the lane goes exactly where it is needed. The per-field escape
  hatch (`Stack` + `data-reserve-footer` + `<Field reserveFooter>` around the button) measures the
  same within 1 px.
- render-check 92/92 routes, zero page errors, with the new `#/components/fieldrow` route included;
  behavior-check 34/34; interaction-sweep 84 routes / ~1523 interactions, zero errors.
- `tests/issues-508-509-513.test.jsx`: 23 assertions covering the cell wrapper, the ancestor
  reserve, dropped null children, `gap`/`wrap`, ref + className/style forwarding, the `:has()`
  rules, and the lane being generated content rather than a length. Full suite 177 files /
  1532 tests green.

## Notes

- Hooks must not be used inside a Variations `render` callback — the docs site calls `render()` inline
  from the page component, so a `useState` there joins that component's hook list and throws React
  #310 when the list shifts. `FieldRowVariations.jsx` keeps its stateful example in a named
  `ConditionalFieldExample` component, which is the pattern the other Variations files already use.
