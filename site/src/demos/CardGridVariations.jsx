import React from "react";
import { CardGrid, Card, Heading, Text, Badge, runDatatableQuery } from "twico-ui";

const DATA = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Item ${String(i + 1).padStart(2, "0")}`,
  price: ((i * 37) % 400) + 40,
  category: ["Lighting", "Seating", "Desks", "Storage", "Decor"][i % 5],
}));

const ProductCard = (p) => (
  <Card style={{ height: "100%" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Heading level={4} style={{ margin: 0 }}>{p.name}</Heading>
      <Badge variant="soft" size="sm" tone="neutral">{p.category}</Badge>
      <Text tone="muted" style={{ marginTop: 4 }}>${p.price}</Text>
    </div>
  </Card>
);

// Server mode: a fake backend resolves the query against DATA using runDatatableQuery — the
// exact semantics the client mode uses — after a short delay so the loading overlay is visible.
function ServerCardGrid() {
  const [state, setState] = React.useState({ rows: [], total: 0, loading: true });
  const load = React.useCallback((query) => {
    setState((s) => ({ ...s, loading: true }));
    const id = setTimeout(() => {
      const { rows, total } = runDatatableQuery(DATA, query, { columns: [{ field: "price", type: "number" }] });
      setState({ rows, total, loading: false });
    }, 500);
    return () => clearTimeout(id);
  }, []);
  return (
    <CardGrid
      serverMode
      rows={state.rows}
      rowCount={state.total}
      loading={state.loading}
      onServerChange={load}
      rowKey="id"
      minChildWidth="14rem"
      pageSize={8}
      pageSizeOptions={[8, 16, 40]}
      searchable
      sortOptions={[{ field: "name", label: "Name" }, { field: "price", label: "Price", type: "number" }]}
      renderCard={ProductCard}
    />
  );
}

const variations = [
  {
    title: "Client grid",
    description: "A responsive card grid over an in-memory array, paginated locally.",
    code: `<CardGrid rows={items} rowKey="id" minChildWidth="14rem" pageSize={8}
  renderCard={(p) => <ProductCard {...p} />} />`,
    render: () => (
      <CardGrid rows={DATA} rowKey="id" minChildWidth="14rem" pageSize={8} pageSizeOptions={[8, 16, 40]} renderCard={ProductCard} />
    ),
  },
  {
    title: "Search + sort toolbar",
    description: "searchable adds a quick-search box; sortOptions renders a sort field + direction toggle.",
    code: `<CardGrid
  rows={items}
  searchable
  sortOptions={[
    { field: "name", label: "Name" },
    { field: "price", label: "Price", type: "number" },
  ]}
  renderCard={(p) => <ProductCard {...p} />}
/>`,
    render: () => (
      <CardGrid rows={DATA} rowKey="id" minChildWidth="14rem" pageSize={8} pageSizeOptions={[8, 16, 40]} searchable
        sortOptions={[{ field: "name", label: "Name" }, { field: "price", label: "Price", type: "number" }]} renderCard={ProductCard} />
    ),
  },
  {
    title: "Server mode",
    description: "serverMode emits { page, pageSize, sort, filters, quickFilter } and consumes { rows, rowCount, loading } — here backed by a fake 500 ms fetch so the loading overlay shows.",
    code: `function ServerCardGrid() {
  const [state, setState] = React.useState({ rows: [], total: 0, loading: true });
  const load = (query) => {
    setState((s) => ({ ...s, loading: true }));
    fetchPage(query).then(({ rows, total }) => setState({ rows, total, loading: false }));
  };
  return (
    <CardGrid
      serverMode
      rows={state.rows} rowCount={state.total} loading={state.loading}
      onServerChange={load}
      pageSize={8} searchable
      sortOptions={[{ field: "name", label: "Name" }, { field: "price", label: "Price", type: "number" }]}
      renderCard={(p) => <ProductCard {...p} />}
    />
  );
}`,
    render: () => <ServerCardGrid />,
  },
  {
    title: "Empty state",
    description: "A custom emptyState shows when there are no rows and the grid is not loading.",
    code: `<CardGrid rows={[]} emptyState="No products match your filters." renderCard={(p) => <ProductCard {...p} />} />`,
    render: () => <CardGrid rows={[]} emptyState="No products match your filters." renderCard={ProductCard} />,
  },
];

export default variations;
