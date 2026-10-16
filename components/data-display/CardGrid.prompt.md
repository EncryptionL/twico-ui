Paginated card grid — the card analogue of Datatable's `serverMode`. Renders one card per row.

```jsx
import { CardGrid } from "./CardGrid";

<CardGrid
  rows={items}
  rowKey="id"
  minChildWidth="18rem"
  pageSize={24}
  pageSizeOptions={[12, 24, 48, 96]}
  searchable
  sortOptions={[{ field: "name", label: "Name" }, { field: "price", label: "Price", type: "number" }]}
  renderCard={(row) => <ProductCard {...row} />}
/>
```

Client mode filters/sorts/paginates locally with Datatable's exact query semantics. For server data,
set `serverMode` and consume `{ rows, rowCount, loading }` while handling the emitted query:

```jsx
<CardGrid
  serverMode
  rows={pageRows} rowCount={total} loading={loading}
  onServerChange={(q) => fetchPage(q)}   // { page, pageSize, sort, filters, quickFilter }
  renderCard={(row) => <ProductCard {...row} />}
/>
```

The query shape matches `Datatable` (minus columns), so a page can toggle table/card views on one
model. Props: `renderCard` (required), `rows`, `rowKey`, `minChildWidth`/`columns`/`gap` (Grid), `pageSize`/
`pageSizeOptions`, `page`/`onPageChange`, `searchable`/`quickFilter`, `filters` (pass FilterBar clauses),
`sortOptions`/`sort`, `toolbar`, `emptyState`, `label`. Pagination + a per-page selector render in the footer.

### Selection and batch actions (#478)

`checkboxSelection` is the same prop, with the same behaviour, as on `Datatable` — a card grid is the
surface where "pick several of these and do one thing to them" is most of the point:

```jsx
<CardGrid
  serverMode rows={rows} rowCount={total} rowKey="id"
  checkboxSelection
  retainSelectedRows                     // carry off-page row objects too (bounded)
  onRowSelectionChange={(keys, rows) => setPicked(keys)}
  batchActions={[{
    label: "Download as ZIP",
    icon: <Package />,
    disabled: (keys, rows) => sum(rows, "bytes") > LIMIT,
    disabledReason: (keys, rows) => `That selection is ${gb(rows)} GB; the limit is 4 GB`,
    onClick: (keys, rows, clear) => download(keys).then(clear),
  }]}
  renderCard={(row) => <AssetCard {...row} />}
/>
```

Three things worth knowing:

- **The checkbox is the grid's, not the card's.** `renderCard` owns the whole card body, so a
  consumer-rendered control would compete with the card's own click target and have to be positioned
  against a thumbnail whose size only you know. The grid draws it in a corner you choose with
  `selectionPlacement`; to place it yourself, set `selectionPlacement="none"` and use `renderCard`'s
  third argument, `{ selected, toggle }`.
- **A selected card gets a ring, not a tint.** Most of a card is usually an image, so a background
  tint is invisible — the state is a `box-shadow` ring on a wrapper, which also means selecting a card
  causes no reflow.
- **`keys` is the authoritative cross-page selection.** Select-all is page-scoped (it must never
  silently pick rows you cannot see, and in `serverMode` it could not). The grid renders one page, so
  by default only on-page `rows` resolve; `retainSelectedRows` keeps the off-page row objects too —
  opt-in and bounded (`true` caps at 1000, or pass your own number), which is the `Map<id, row>` you
  would otherwise hand-roll.
