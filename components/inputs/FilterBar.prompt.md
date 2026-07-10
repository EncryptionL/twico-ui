Schema-driven faceted filter bar — a row of filter controls that emits a normalized clause list.

```jsx
import { FilterBar } from "./FilterBar";

const [filters, setFilters] = React.useState([]);
<FilterBar
  fields={[
    { field: "model", label: "Model", type: "multiselect", options: MODELS },
    { field: "createdAt", label: "Created", type: "daterange" },
    { field: "q", type: "search", placeholder: "Search…" },
  ]}
  value={filters}
  onChange={setFilters}   // → [{ field, op, value }]
  showClearAll
/>
```

Renders one control per `fields` entry — `multiselect` (MultiSelect), `daterange` (DateRangePicker),
`search`/`text`/`number` (Input), `boolean`/`select` (Select) — and emits a **normalized clause list**:
`isAnyOf` (multiselect), `>=` + `<` (daterange), `contains` (text/search), `=` (number/boolean/select).
`value` is that same clause list (controlled), so it round-trips. Per-field ✕ appears on active fields;
`showClearAll` adds a "Clear all (N)" button. For **dependent/cascading** facets, a field's `options`
can be a function `(values) => options` (e.g. article options that depend on the selected models).
Feed the clauses to a backend, `runDatatableQuery`, or a `CardGrid` `filters` prop. Props: `fields`,
`value`/`defaultValue`, `onChange`, `onValuesChange`, `showClearAll`, `showFieldClear`, `size`, `tone`, `disabled`.
