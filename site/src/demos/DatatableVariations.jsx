import React from "react";
import { Datatable, Badge, Avatar } from "twico-ui";

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18v12H3z" /><path d="M3 7l9 6 9-6" /></svg>
);
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
);

const rows = [
  { id: 1, name: "Ava Stone", email: "ava@acme.io", role: "Admin", status: "Active", mrr: 480 },
  { id: 2, name: "Liam Reed", email: "liam@acme.io", role: "Editor", status: "Active", mrr: 120 },
  { id: 3, name: "Noah Park", email: "noah@acme.io", role: "Viewer", status: "Invited", mrr: 60 },
  { id: 4, name: "Mia Cruz", email: "mia@acme.io", role: "Editor", status: "Active", mrr: 200 },
  { id: 5, name: "Eli Voss", email: "eli@acme.io", role: "Admin", status: "Paused", mrr: 340 },
];

const variations = [
  {
    title: "Custom cell renderers",
    description: "Use renderCell + valueFormatter to draw avatars, badges, and formatted numbers.",
    code: `<Datatable
  rows={rows}
  columns={[
    {
      field: "name", headerName: "Member", width: 220,
      renderCell: (v) => (
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={v} size="sm" />
          {v}
        </span>
      ),
    },
    {
      field: "status", headerName: "Status", width: 130,
      renderCell: (v) => (
        <Badge tone={v === "Active" ? "success" : v === "Paused" ? "warning" : "neutral"} dot>{v}</Badge>
      ),
    },
    { field: "mrr", headerName: "MRR", type: "number", width: 110, valueFormatter: (v) => \`$\${v}\` },
  ]}
/>`,
    render: () => (
      <Datatable
        rows={rows}
        height={300}
        columns={[
          {
            field: "name",
            headerName: "Member",
            width: 220,
            renderCell: (v) => (
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={v} size="sm" />
                {v}
              </span>
            ),
          },
          {
            field: "status",
            headerName: "Status",
            width: 130,
            renderCell: (v) => (
              <Badge tone={v === "Active" ? "success" : v === "Paused" ? "warning" : "neutral"} dot>{v}</Badge>
            ),
          },
          { field: "mrr", headerName: "MRR", type: "number", width: 110, valueFormatter: (v) => `$${v}` },
        ]}
      />
    ),
  },
  {
    title: "Checkbox selection + batch actions",
    description: "Selecting rows swaps the toolbar for a batch-action bar.",
    code: `<Datatable
  checkboxSelection
  rows={rows}
  batchActions={[
    { icon: <MailIcon />, label: "Email", onClick: (keys, rows, clear) => clear() },
    { icon: <TrashIcon />, label: "Delete", danger: true, onClick: (keys, rows, clear) => clear() },
  ]}
  columns={[
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "role", headerName: "Role", width: 130 },
  ]}
/>`,
    render: () => (
      <Datatable
        checkboxSelection
        rows={rows}
        height={300}
        batchActions={[
          { icon: <MailIcon />, label: "Email", onClick: (keys, rs, clear) => clear() },
          { icon: <TrashIcon />, label: "Delete", danger: true, onClick: (keys, rs, clear) => clear() },
        ]}
        columns={[
          { field: "name", headerName: "Name", width: 180 },
          { field: "email", headerName: "Email", width: 220 },
          { field: "role", headerName: "Role", width: 130 },
        ]}
      />
    ),
  },
  {
    title: "Actions column",
    description: "A type:\"actions\" column renders inline icon buttons and an overflow menu.",
    code: `<Datatable
  rows={rows}
  columns={[
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 240 },
    {
      field: "actions", headerName: "", type: "actions", width: 120,
      getActions: (row) => [
        { icon: <PencilIcon />, label: "Edit", onClick: (r) => {} },
        { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true, onClick: (r) => {} },
      ],
    },
  ]}
/>`,
    render: () => (
      <Datatable
        rows={rows}
        height={300}
        columns={[
          { field: "name", headerName: "Name", width: 180 },
          { field: "email", headerName: "Email", width: 240 },
          {
            field: "actions",
            headerName: "",
            type: "actions",
            width: 120,
            getActions: () => [
              { icon: <PencilIcon />, label: "Edit", onClick: () => {} },
              { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true, onClick: () => {} },
            ],
          },
        ]}
      />
    ),
  },
  {
    title: "Aggregation footer",
    description: "Seed a totals row with per-column aggregation presets.",
    code: `<Datatable
  rows={rows}
  showAggregation
  columns={[
    { field: "name", headerName: "Name", width: 200, aggregation: "count" },
    { field: "role", headerName: "Role", width: 140 },
    { field: "mrr", headerName: "MRR", type: "number", width: 120, aggregation: "sum", valueFormatter: (v) => \`$\${v}\` },
  ]}
/>`,
    render: () => (
      <Datatable
        rows={rows}
        height={300}
        showAggregation
        columns={[
          { field: "name", headerName: "Name", width: 200, aggregation: "count" },
          { field: "role", headerName: "Role", width: 140 },
          { field: "mrr", headerName: "MRR", type: "number", width: 120, aggregation: "sum", valueFormatter: (v) => `$${v}` },
        ]}
      />
    ),
  },
  {
    title: "Compact density + pinned column",
    description: "Tighter rows, a left-pinned column, and a custom page size.",
    code: `<Datatable
  rows={rows}
  density="compact"
  pageSize={5}
  pageSizeOptions={[5, 10]}
  columns={[
    { field: "name", headerName: "Name", width: 180, pinned: "left" },
    { field: "email", headerName: "Email", width: 220 },
    { field: "role", headerName: "Role", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "mrr", headerName: "MRR", type: "number", width: 110 },
  ]}
/>`,
    render: () => (
      <Datatable
        rows={rows}
        height={300}
        density="compact"
        pageSize={5}
        pageSizeOptions={[5, 10]}
        columns={[
          { field: "name", headerName: "Name", width: 180, pinned: "left" },
          { field: "email", headerName: "Email", width: 220 },
          { field: "role", headerName: "Role", width: 130 },
          { field: "status", headerName: "Status", width: 130 },
          { field: "mrr", headerName: "MRR", type: "number", width: 110 },
        ]}
      />
    ),
  },
];

export default variations;
