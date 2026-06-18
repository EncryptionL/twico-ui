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
