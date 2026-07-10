Row + field-level comparison of two datasets — added / removed / modified / moved, with per-cell before→after.

```jsx
import { DiffTable } from "./DiffTable";

<DiffTable
  from={versionA}
  to={versionB}
  rowKey={(r) => r.sku}
  columns={[
    { field: "name", headerName: "Name" },
    { field: "color", headerName: "Color" },
    { field: "price", headerName: "Price", valueFormatter: (v) => `$${v}` },
  ]}
  onlyChanged            // default: hide unchanged rows
/>
```

Pairs rows on `rowKey`, classifies each row (**added** in B, **removed** from A, **modified** when a
field differs, **moved** when only its position changed), and renders modified cells as
`before → after` (strikethrough old, accented new). Shows an op badge per row, a `+N ~M -K` summary,
and an "only changed" toggle. Props: `from`/`to`, `rowKey` (defaults to `row.id`), `columns`
(`{ field, headerName?, valueGetter?, valueFormatter?, compare? }`), `onlyChanged`, `showToggle`,
`showSummary`, `moveDetection`, `compare(a, b, field)` (global equality; falls back to `===` then JSON),
`emptyState`, `label`. Move detection uses a minimal LIS so only genuinely-reordered rows are flagged.
