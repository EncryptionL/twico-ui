# QA notes — FilterBar

- **Group:** inputs
- **Status:** clean (new)
- **Added:** 2026-07-10 (#203)

## Why it exists

[#203] Every catalogue / server-driven list re-implements the same block: a row of filter controls
(searchable multi-selects, date ranges, text/number), a normalized filter emit, a per-field clear ✕, and
a "Clear all (N)". ~150 lines of boilerplate per page with subtle bugs (active-count, page-reset, option
cascades). `FilterBar` is that pattern as one schema-driven component.

## Design decisions

- **Clause list is the value.** `value` and `onChange` both speak the **normalized** shape
  `[{ field, op, value }]` (`isAnyOf` / `>=` + `<` / `contains` / `=`) — the exact shape
  `runDatatableQuery`, a `CardGrid` `filters` prop, or a backend consumes. Internally FilterBar maps
  clauses ⇄ a per-field value map each render (`clausesToValues` / `valuesToClauses`), so there's one
  source of truth and it round-trips. A daterange field expands to **two** clauses (`>=` start, `<` end).
- **Composes existing inputs** — `MultiSelect`, `DateRangePicker`, `Select`, `Input` (intra-group). No
  new controls. Each renders label-less; FilterBar owns the label row so it can place the per-field ✕,
  and passes `aria-label` to the control for the accessible name.
- **Dependent/cascading options** — a field's `options` may be a function `(values) => options`, called
  during render with the current per-field values (e.g. article options that depend on selected models).
- **Field types** — `multiselect`, `daterange`, `search`/`text`, `number` (coerces to Number, default
  op `=`, overridable via `op`), `boolean` (Any/Yes/No → `=` true/false), `select` (single). `op` on a
  field overrides the per-type default operator.
- **Actions** — per-field ✕ appears on active fields (`showFieldClear`); `showClearAll` renders
  "Clear all (N)" where N is the active-field count, disabled when nothing is active.

## Verified OK

- Renders one labelled control per schema field; emits correct ops (contains/=/isAnyOf/>=+<).
- Controlled clause `value` hydrates every control (incl. daterange's two clauses, boolean `false`).
- Per-field ✕ clears just that field; Clear all resets everything and shows the live count.
- Cascading `options(values)` receives the current values.
- SSR-safe; className-free consumer API; `role="group"` with an accessible label.
- Tests: [`tests/filterbar.test.jsx`](../../tests/filterbar.test.jsx).
