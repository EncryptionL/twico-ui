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
