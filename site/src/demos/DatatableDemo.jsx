import React from "react";
import { Datatable } from "twico-ui";

const columns = [
  { field: "name", headerName: "Name", width: 180 },
  { field: "email", headerName: "Email", width: 220 },
  { field: "role", headerName: "Role", width: 130 },
  { field: "mrr", headerName: "MRR", type: "number", width: 110, aggregation: "sum" },
];

const rows = [
  { id: 1, name: "Ava Stone", email: "ava@acme.io", role: "Admin", mrr: 480 },
  { id: 2, name: "Liam Reed", email: "liam@acme.io", role: "Editor", mrr: 120 },
  { id: 3, name: "Noah Park", email: "noah@acme.io", role: "Viewer", mrr: 60 },
  { id: 4, name: "Mia Cruz", email: "mia@acme.io", role: "Editor", mrr: 200 },
  { id: 5, name: "Eli Voss", email: "eli@acme.io", role: "Admin", mrr: 340 },
];

export default function DatatableDemo() {
  return React.createElement(Datatable, { columns: columns, rows: rows, checkboxSelection: true, pageSize: 5, density: "standard" });
}
