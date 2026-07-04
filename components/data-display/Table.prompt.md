Data table with sortable headers, hover/striped rows, custom cell renderers, and selection.

```jsx
import { Table } from "./Table";

<Table
  sortable striped
  rowKey={(r) => r.id}
  columns={[
    { field: "name", headerName: "Name" },
    { field: "role", headerName: "Role" },
    { field: "status", headerName: "Status", renderCell: (v) => <Badge tone={v === "Active" ? "success" : "neutral"}>{v}</Badge> },
    { field: "mrr", headerName: "MRR", align: "right" },
  ]}
  rows={users}
/>
```

Uses the same vocabulary as `Datatable`: columns take `field`, `headerName`, `align`, `width`,
`sortable`, and `renderCell(value, row, i)`; rows go in `rows`. Sort state is `{ field, dir }`.

`size` accepts `"sm" | "md" | "lg"` (default `"md"`) to tune cell padding density.

`loading` (with `loadingRows`) renders shimmer skeleton rows and sets `aria-busy`; empty `rows` render a
full-width `emptyMessage` (default "No data"). Name the table for assistive tech with `ariaLabel` or
`caption` (a visually-hidden `<caption>`) — a plain `aria-label` now lands on the `<table>`, not the wrapper.
