import React, { useMemo, useState } from "react";
import { FilterBar, Card, Text, Badge } from "twico-ui";

const MODELS = [
  { value: "falcon", label: "Falcon" },
  { value: "vega", label: "Vega" },
  { value: "orion", label: "Orion" },
];
const ITEMS = [
  { id: 1, name: "Falcon Mk1", model: "falcon", inStock: true, createdAt: "2024-01-12" },
  { id: 2, name: "Falcon Mk2", model: "falcon", inStock: false, createdAt: "2024-03-04" },
  { id: 3, name: "Vega Lite", model: "vega", inStock: true, createdAt: "2024-02-20" },
  { id: 4, name: "Vega Pro", model: "vega", inStock: false, createdAt: "2024-05-08" },
  { id: 5, name: "Orion One", model: "orion", inStock: true, createdAt: "2024-04-15" },
];

// A tiny clause matcher — the shape FilterBar emits maps cleanly onto a backend query
// or `runDatatableQuery`; here we resolve it in-memory to show live results.
const matches = (row, clauses) => clauses.every((c) => {
  const v = row[c.field];
  if (c.op === "isAnyOf") return c.value.includes(v);
  if (c.op === "contains") return String(v ?? "").toLowerCase().includes(String(c.value).toLowerCase());
  if (c.op === ">=") return new Date(row.createdAt) >= new Date(c.value);
  if (c.op === "<") return new Date(row.createdAt) < new Date(c.value);
  if (c.op === "=") return v === c.value;
  return true;
});

export default function FilterBarDemo() {
  const [filters, setFilters] = useState([]);
  const results = useMemo(() => ITEMS.filter((r) => matches(r, filters)), [filters]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FilterBar
        fields={[
          { field: "model", label: "Model", type: "multiselect", options: MODELS },
          { field: "createdAt", label: "Created", type: "daterange" },
          { field: "inStock", label: "Stock", type: "boolean", trueLabel: "In stock", falseLabel: "Out of stock" },
          { field: "name", label: "Search", type: "search", placeholder: "Search name…" },
        ]}
        value={filters}
        onChange={setFilters}
        showClearAll
      />
      <Text tone="muted">{results.length} of {ITEMS.length} items</Text>
      <div style={{ display: "grid", gap: 8 }}>
        {results.map((r) => (
          <Card key={r.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <strong>{r.name}</strong>
              <Badge variant="soft" size="sm" tone={r.inStock ? "success" : "neutral"}>{r.inStock ? "In stock" : "Out"}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
