# QA notes — CardGrid

- **Group:** data-display
- **Status:** clean (new)
- **Added:** 2026-07-10 (#204)

## Why it exists

[#204] `Datatable` has a first-class `serverMode` (page/sort/filter/search → query → `{ rows, total }`),
but there was **no equivalent for card layouts** — a catalogue that wants cards instead of rows had to
hand-roll the fetch/paginate/sort/loading/empty loop. `CardGrid` is that missing primitive:
`Datatable serverMode` state management + `Grid minChildWidth` + `Pagination`, minus columns.

## Design decisions

- **Same query contract as Datatable** — the object emitted to `onServerChange` is
  `{ page, pageSize, sort, filters, quickFilter }`, identical to Datatable's (minus `visibleColumns`).
  So a page can toggle table ⇄ card views on **one** query model.
- **Client mode reuses `runDatatableQuery`** (imported from `Datatable.jsx`) — the exact same
  quick-search / filter / sort / paging semantics, so client and server results match. `sortOptions`
  with `type: "number"` feed a minimal `columns` array so numeric sort compares numerically.
- **Composes existing primitives** — `Grid` (`minChildWidth`/`columns`/`gap`), `Pagination`
  (1-based page ↔ 0-based internal), `Select` (per-page + sort field), `Input` (quick search). No new
  layout or data logic invented.
- **`filters` is a pass-through** — CardGrid has no columns to build filters from, so filter clauses
  come from outside (e.g. a [FilterBar](../qa-notes) — #203) and are applied client-side / forwarded
  server-side. Changing `filters` resets to page 0 (a first-render guard skips the initial reset).
- **Server debounce (250 ms)** mirrors Datatable; the effect depends on a `JSON.stringify(query)` key so
  referential churn in `filters`/`sort` doesn't spuriously re-fire.
- **States** — a dim + centered CSS spinner overlay while `loading`; a customizable `emptyState`.
  Cards render as `role="listitem"` inside a `role="list"` Grid.

## Verified OK

- Client mode: one card per row capped to `pageSize`; pagination; quick search; controlled + built-in sort.
- Server mode: debounced `onServerChange` on mount + on page/sort/search change; renders provided rows;
  `rowCount` drives the page count; loading overlay + `aria-busy`.
- Controlled/uncontrolled `page`/`pageSize`/`quickFilter`/`sort`; per-page selector; empty state.
- SSR-safe (`useScopedStyles`, no module-scope DOM); className-free consumer API.
- Tests: [`tests/cardgrid.test.jsx`](../../tests/cardgrid.test.jsx).
