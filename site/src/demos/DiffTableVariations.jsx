import React from "react";
import { DiffTable } from "twico-ui";

const V1 = [
  { sku: "FR-01", name: "Frame", material: "Steel", qty: 1, cost: 42 },
  { sku: "BL-02", name: "Blade", material: "Aluminium", qty: 4, cost: 8 },
  { sku: "MT-03", name: "Motor", material: "Copper", qty: 1, cost: 60 },
  { sku: "SC-04", name: "Screw set", material: "Steel", qty: 24, cost: 3 },
];
const V2 = [
  { sku: "FR-01", name: "Frame", material: "Carbon", qty: 1, cost: 55 },
  { sku: "MT-03", name: "Motor", material: "Copper", qty: 1, cost: 60 },
  { sku: "BL-02", name: "Blade", material: "Aluminium", qty: 3, cost: 8 },
  { sku: "GR-05", name: "Guard", material: "Polymer", qty: 1, cost: 12 },
];

const columns = [
  { field: "name", headerName: "Part" },
  { field: "material", headerName: "Material" },
  { field: "qty", headerName: "Qty" },
  { field: "cost", headerName: "Unit cost", valueFormatter: (v) => `$${v}` },
];

const variations = [
  {
    title: "Version compare",
    description: "Two BOM versions paired on sku — modified cells show before → after, unchanged rows hidden by default.",
    code: `<DiffTable from={v1} to={v2} rowKey={(r) => r.sku} columns={columns} />`,
    render: () => <DiffTable from={V1} to={V2} rowKey={(r) => r.sku} columns={columns} />,
  },
  {
    title: "Show every row",
    description: "onlyChanged={false} reveals unchanged and moved rows too (each still badged).",
    code: `<DiffTable from={v1} to={v2} rowKey={(r) => r.sku} columns={columns} onlyChanged={false} />`,
    render: () => <DiffTable from={V1} to={V2} rowKey={(r) => r.sku} columns={columns} onlyChanged={false} />,
  },
  {
    title: "Reorder → moved",
    description: "When only a row's position changes, it is classified 'moved' (a minimal LIS flags just the row that jumped).",
    code: `const from = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
const to = [{ id: 4 }, { id: 1 }, { id: 2 }, { id: 3 }]; // id 4 jumped to front

<DiffTable from={from} to={to} rowKey={(r) => r.id}
  columns={[{ field: "id", headerName: "ID" }]} onlyChanged={false} />`,
    render: () => (
      <DiffTable
        from={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
        to={[{ id: 4 }, { id: 1 }, { id: 2 }, { id: 3 }]}
        rowKey={(r) => r.id}
        columns={[{ field: "id", headerName: "ID" }]}
        onlyChanged={false}
      />
    ),
  },
  {
    title: "No toggle or summary",
    description: "Turn off the chrome with showToggle={false} and showSummary={false} for an embedded, read-only diff.",
    code: `<DiffTable from={v1} to={v2} rowKey={(r) => r.sku} columns={columns}
  showToggle={false} showSummary={false} />`,
    render: () => <DiffTable from={V1} to={V2} rowKey={(r) => r.sku} columns={columns} showToggle={false} showSummary={false} />,
  },
];

export default variations;
