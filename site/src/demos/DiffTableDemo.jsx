import React from "react";
import { DiffTable } from "twico-ui";

// Two versions of a small bill-of-materials, paired on `sku`.
const V1 = [
  { sku: "FR-01", name: "Frame", material: "Steel", qty: 1, cost: 42 },
  { sku: "BL-02", name: "Blade", material: "Aluminium", qty: 4, cost: 8 },
  { sku: "MT-03", name: "Motor", material: "Copper", qty: 1, cost: 60 },
  { sku: "SC-04", name: "Screw set", material: "Steel", qty: 24, cost: 3 },
];
const V2 = [
  { sku: "FR-01", name: "Frame", material: "Carbon", qty: 1, cost: 55 }, // modified
  { sku: "MT-03", name: "Motor", material: "Copper", qty: 1, cost: 60 }, // moved up
  { sku: "BL-02", name: "Blade", material: "Aluminium", qty: 3, cost: 8 }, // modified: qty
  { sku: "GR-05", name: "Guard", material: "Polymer", qty: 1, cost: 12 }, // added
];
// SC-04 removed.

const columns = [
  { field: "name", headerName: "Part" },
  { field: "material", headerName: "Material" },
  { field: "qty", headerName: "Qty" },
  { field: "cost", headerName: "Unit cost", valueFormatter: (v) => `$${v}` },
];

export default function DiffTableDemo() {
  return <DiffTable from={V1} to={V2} rowKey={(r) => r.sku} columns={columns} label="BOM v1 → v2" />;
}
