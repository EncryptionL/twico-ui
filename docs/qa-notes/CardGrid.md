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

- [x] **[#461] an out-of-range page was never clamped** - CardGrid reset to page 0 on quick-filter/sort/page-size/filters changes but not when `rows` itself shrank, so a refetch or a deletion stranded the page index: the slice came back empty and the empty state covered rows that DO match, with a footer reading `97-10 of 10`. It now clamps to the last real page, renders from the clamped page (re-slicing the query's `filtered` set, so a controlled host that ignores `onPageChange` still gets rows), and the footer range can no longer invert. `CardGrid.jsx:111-125` - fixed 2026-10-07

- [x] **[#461 review] the clamp fired when the page was not KNOWABLY out of range** - in `serverMode` without `rowCount`, `total` falls back to `rows.length` (the size of the page the host happened to send), so totalPages is 1 and every page looks stranded: a restored page was reset to 0 before the data arrived, and the host stayed pinned there. The clamp now requires a knowable total and skips while `loading`. `CardGrid.jsx:121` - fixed 2026-10-07
- [x] **[#461 review] the clamp overwrote the reset-to-page-0 that a `filters` change performs** - both are effects in the same commit, running in declaration order, and `pageVal` is still the pre-reset value when the clamp runs, so changing a filter landed the reader on the LAST page instead of the first. The clamp now skips the render on which `filtersKey` changed. (The sort / quick-filter / page-size resets call `commitPage(0)` inline from their handlers, so they are already settled and need no guard.) `CardGrid.jsx:128` - fixed 2026-10-07

- [x] **[#478] no row selection or batch actions, so selection had to be hand-rolled** - CardGrid had every other Datatable affordance in server mode (rows, rowCount, onServerChange, filters, quickFilter, sort, paging), which is what made the gap conspicuous: a card grid is what you reach for when the rows are visual, where "pick several and do one thing to them" is most of the point. Consumers were re-implementing a Checkbox overlay per card, a `Map<id,row>` to survive paging, page-scoped select-all arithmetic, a selection toolbar, and a selected affordance. Now `checkboxSelection`, `batchActions` and `onRowSelectionChange` - the same prop names and behaviour as Datatable, deliberately not a new vocabulary. Three details that came out of the issue: the checkbox is the GRID's (renderCard owns the card body, so a consumer control would compete with the card's click target and have to be positioned against a thumbnail only they can size) with `selectionPlacement` and a `renderCard(row, i, { selected, toggle })` escape hatch; a selected card gets a box-shadow RING, not a tint, because most of a card is an image (and a ring causes no reflow); and `retainSelectedRows` keeps off-page row objects, opt-in and bounded, which is the `Map` workaround removed for everyone. Select-all stays page-scoped - it must never silently pick rows the user cannot see, and in serverMode it could not. `CardGrid.jsx:156` - added 2026-10-16

- [x] **[#492] `selectionSummary` slot in the selection toolbar** - parity with Datatable, same contract: a node or `(keys, rows) => ReactNode`, rendered beside the "N selected" count and before the batch actions, so a size/cost/duration total sits with the count it qualifies instead of being lifted into the main `toolbar` row behind a host-side guard. `CardGrid.jsx` - added 2026-10-21

## Verified OK

- Client mode: one card per row capped to `pageSize`; pagination; quick search; controlled + built-in sort.
- Server mode: debounced `onServerChange` on mount + on page/sort/search change; renders provided rows;
  `rowCount` drives the page count; loading overlay + `aria-busy`.
- Controlled/uncontrolled `page`/`pageSize`/`quickFilter`/`sort`; per-page selector; empty state.
- SSR-safe (`useScopedStyles`, no module-scope DOM); className-free consumer API.
- **[#226]** the built-in sort control no longer clips long option labels: `.twc-cardgrid__sort` is
  `flex: none` (doesn't shrink in the toolbar) and the sort `Select` gets an intrinsic `min-width`
  estimated from the longest label (`~7.2px/char + 46` chrome, clamped 120–300px); the new
  `sortMinWidth` prop overrides it. Applied as `style` on the Select (forwarded to the trigger button,
  which is `width: 100%`). — added 2026-07-13
- Tests: [`tests/cardgrid.test.jsx`](../../tests/cardgrid.test.jsx),
  [`tests/column-sizing-menu.test.jsx`](../../tests/column-sizing-menu.test.jsx).

## #541 — a controlled selection, and retention that stays honest

Reported against 1.51.2. `CardGrid` has owned the selection since #478, which is the right place for
it — and the host had no way to **clear or correct** it except from inside a batch action's
`onClick`. That turns an ordinary host-driven refresh into a selection the user can neither see nor
untick.

The shape is a server-paginated grid whose rows are re-read when the host bumps a counter — the
standard `reloadKey` pattern, used precisely because something elsewhere on the page can delete one
of the rows being shown:

1. The user ticks cards A, B, C.
2. Elsewhere on the page they delete B.
3. The host bumps its counter; `rows` comes back without B and B's card disappears.
4. `selected` still holds B's key. Nothing reconciles it against `rows` — the only writes were
   `clearSelection`, `toggleKey` and `togglePage`, all user gestures.
5. `retainedRef` still holds B's **stale row object**, written at toggle time and never refreshed.

So the toolbar said "3 selected", the size summary priced three files, a `disabled` predicate
testing `keys.length` against a cap counted three, and `onClick` was handed three — with two cards on
screen and no gesture that could remove the third, because its checkbox was gone. The server then
refused the whole batch (all-or-nothing by design) and the only recovery was a page reload.

Why nothing already there covered it:

- `onRowSelectionChange` is an **output**, and it is guarded on a keys-only signature
  (`selKeys.join(",")`), so it does not even re-fire when `rows` is replaced.
- `clearSelection` exists only as the third argument to a batch action's `onClick` — reachable after
  the user has pressed the button whose count is wrong.
- `retainSelectedRows` is documented as "those keys simply resolve to nothing in `rows`, so re-fetch
  by key", which is the right contract — but with retention on a removed row does *not* resolve to
  nothing; it resolves to a stale object the host cannot distinguish from a live one.
- `key={counter}` remounts the grid, which clears the page and every other piece of internal state,
  flashes, and fights `page` being controlled.

**`selectedKeys` + `onSelectionChange`**, the same uncontrolled/controlled split `page`/`onPageChange`
already has. Mirroring the selection into host state is *not* the workaround — it defeats the point
of #478 and #492, and observing keys through `onRowSelectionChange` does not let you change them.

A third, smaller ask in the report — exposing `clearSelection` through a ref — is not added: with
`selectedKeys` the host can reset to `[]` directly, and a third mechanism over the same state is a
third thing to keep consistent.

**Retention is also no longer written once and never refreshed.** A retained row is re-read whenever
its key reappears on a rendered page, and a retained key a controlled host drops is released. That
is the part of "reconcile retention against `rows`" with no guesswork in it: it needs no `rowCount`
arithmetic and cannot discard a row the host still has. Dropping a key whose row has genuinely gone
is the host's call, which is what `selectedKeys` is for.

The memo is keyed on `JSON.stringify(selectedKeys)`, not on the array, because a host writing
`selectedKeys={[...]}` hands over a new identity every render and `selected` feeds `selKeys` →
`selectedRows`, which rebuilds a `Map` over the page.

**What the validation showed.** Breaking the read path failed 8 tests across `CardGrid` and
`Datatable`; dropping the `onSelectionChange` report failed 5. The retained-row refresh needed the
**test** fixed before it measured anything — the first version passed with the refresh disabled,
because `selectedRows` resolves a key from the current page before consulting the retained map, so
the row has to be off-page when the batch action reads it.

`commitSelection` takes an **updater**, not a value. Controlled mode cannot use a functional state
updater — the previous value is a prop that has not re-rendered yet — so two toggles in one React
batch both read the same set and the second dropped the first. The last set committed this tick is
held in a ref and used as the base. See the `Datatable` note for the measurement; it was found in
the browser, not by any jsdom test.

`isRowSelectable` (#540) was scoped to `Datatable`, where it was filed. `CardGrid` has the same
shape and does not have it yet.

Tests: [`tests/issues-540-541-542.test.jsx`](../../tests/issues-540-541-542.test.jsx).
