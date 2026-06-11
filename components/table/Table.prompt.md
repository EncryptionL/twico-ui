Data table with sortable headers, hover/striped rows, custom cell renderers, and selection.

```jsx
import { Table } from "./Table";

<Table
  sortable striped
  rowKey={(r) => r.id}
  columns={[
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status", render: (v) => <Badge tone={v === "Active" ? "success" : "neutral"}>{v}</Badge> },
    { key: "mrr", header: "MRR", align: "right" },
  ]}
  data={users}
/>
```

Columns support `align`, `width`, `sortable`, and a `render(value, row, i)` function.
