import React from "react";
import { FilterBar, Code } from "twico-ui";

const MODELS = [
  { value: "falcon", label: "Falcon" },
  { value: "vega", label: "Vega" },
  { value: "orion", label: "Orion" },
];
const ARTICLES = {
  falcon: [{ value: "f-wing", label: "Wing" }, { value: "f-nose", label: "Nose cone" }],
  vega: [{ value: "v-hull", label: "Hull" }, { value: "v-fin", label: "Fin" }],
  orion: [{ value: "o-panel", label: "Panel" }],
};

// Clauses -> normalized JSON, shown live so the emitted shape is visible.
function WithOutput({ fields }) {
  const [filters, setFilters] = React.useState([]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FilterBar fields={fields} value={filters} onChange={setFilters} showClearAll />
      <Code block copyable>{JSON.stringify(filters, null, 2) || "[]"}</Code>
    </div>
  );
}

// Dependent options: the Article facet's options are a function of the selected models.
function Cascading() {
  const [filters, setFilters] = React.useState([]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FilterBar
        fields={[
          { field: "model", label: "Model", type: "multiselect", options: MODELS },
          {
            field: "article", label: "Article", type: "multiselect",
            options: (values) => (values.model || []).flatMap((m) => ARTICLES[m] || []),
            placeholder: "Pick a model first",
          },
        ]}
        value={filters}
        onChange={setFilters}
        showClearAll
      />
      <span style={{ fontSize: 13, opacity: 0.7 }}>Article options depend on the selected model(s).</span>
    </div>
  );
}

const variations = [
  {
    title: "Faceted bar + normalized output",
    description: "Multi-select, date-range, boolean, and search facets emit a single [{ field, op, value }] list.",
    code: `<FilterBar
  fields={[
    { field: "model", label: "Model", type: "multiselect", options: MODELS },
    { field: "createdAt", label: "Created", type: "daterange" },
    { field: "inStock", label: "Stock", type: "boolean" },
    { field: "q", label: "Search", type: "search" },
  ]}
  value={filters}
  onChange={setFilters}   // -> [{ field, op, value }]
  showClearAll
/>`,
    render: () => (
      <WithOutput fields={[
        { field: "model", label: "Model", type: "multiselect", options: MODELS },
        { field: "createdAt", label: "Created", type: "daterange" },
        { field: "inStock", label: "Stock", type: "boolean" },
        { field: "q", label: "Search", type: "search" },
      ]} />
    ),
  },
  {
    title: "Number + select facets",
    description: "A number facet emits `=` (override with `op`); a single select emits `=` too.",
    code: `<FilterBar
  fields={[
    { field: "minPrice", label: "Min price", type: "number", op: ">=" },
    { field: "status", label: "Status", type: "select", options: ["Draft", "Active", "Archived"] },
  ]}
  value={filters}
  onChange={setFilters}
  showClearAll
/>`,
    render: () => (
      <WithOutput fields={[
        { field: "minPrice", label: "Min price", type: "number", op: ">=" },
        { field: "status", label: "Status", type: "select", options: ["Draft", "Active", "Archived"] },
      ]} />
    ),
  },
  {
    title: "Dependent / cascading options",
    description: "A field's `options` can be a function of the current values — here Article depends on Model.",
    code: `{
  field: "article", label: "Article", type: "multiselect",
  options: (values) => (values.model || []).flatMap((m) => ARTICLES[m] || []),
}`,
    render: () => <Cascading />,
  },
];

export default variations;
