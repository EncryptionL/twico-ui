import React from "react";
import { Table, Badge } from "twico-ui";

const users = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", status: "Active", mrr: 120 },
  { id: 2, name: "Alan Turing", role: "Designer", status: "Invited", mrr: 90 },
  { id: 3, name: "Grace Hopper", role: "Manager", status: "Active", mrr: 200 },
];

const columns = [
  { field: "name", headerName: "Name" },
  { field: "role", headerName: "Role" },
  { field: "status", headerName: "Status" },
  { field: "mrr", headerName: "MRR", align: "right" },
];

const variations = [
  {
    title: "Basic",
    description: "Columns + data with default hover rows.",
    code: `const columns = [
  { field: "name", headerName: "Name" },
  { field: "role", headerName: "Role" },
  { field: "status", headerName: "Status" },
  { field: "mrr", headerName: "MRR", align: "right" },
];

<Table columns={columns} rows={users} />`,
    renderCell: () => (
      <div style={{ width: 520, maxWidth: "100%" }}>
        <Table columns={columns} rows={users} />
      </div>
    ),
  },
  {
    title: "Sortable + striped",
    description: "Click a header to sort client-side. Zebra striping for scannability.",
    code: `<Table sortable striped columns={columns} rows={users} />`,
    renderCell: () => (
      <div style={{ width: 520, maxWidth: "100%" }}>
        <Table sortable striped columns={columns} rows={users} />
      </div>
    ),
  },
  {
    title: "Small size",
    description: "Denser rows with the sm size.",
    code: `<Table size="sm" columns={columns} rows={users} />`,
    renderCell: () => (
      <div style={{ width: 520, maxWidth: "100%" }}>
        <Table size="sm" columns={columns} rows={users} />
      </div>
    ),
  },
  {
    title: "Custom cell renderer",
    description: "A column render() function turns the status into a Badge.",
    code: `const columns = [
  { field: "name", headerName: "Name" },
  { field: "role", headerName: "Role" },
  {
    field: "status",
    headerName: "Status",
    renderCell: (v) => (
      <Badge tone={v === "Active" ? "success" : "neutral"}>{v}</Badge>
    ),
  },
  { field: "mrr", headerName: "MRR", align: "right" },
];

<Table columns={columns} rows={users} />`,
    renderCell: () => {
      const richColumns = [
        { field: "name", headerName: "Name" },
        { field: "role", headerName: "Role" },
        {
          field: "status",
          headerName: "Status",
          renderCell: (v) => (
            <Badge tone={v === "Active" ? "success" : "neutral"}>{v}</Badge>
          ),
        },
        { field: "mrr", headerName: "MRR", align: "right" },
      ];
      return (
        <div style={{ width: 520, maxWidth: "100%" }}>
          <Table columns={richColumns} rows={users} />
        </div>
      );
    },
  },
  {
    title: "Selected rows",
    description: "Highlight rows by key. rowKey returns a stable id per row.",
    code: `<Table
  rowKey={(r) => r.id}
  selectedKeys={[1, 3]}
  columns={columns}
  rows={users}
/>`,
    renderCell: () => (
      <div style={{ width: 520, maxWidth: "100%" }}>
        <Table
          rowKey={(r) => r.id}
          selectedKeys={[1, 3]}
          columns={columns}
          rows={users}
        />
      </div>
    ),
  },
];

export default variations;
