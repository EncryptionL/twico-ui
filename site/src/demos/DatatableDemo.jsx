import React from "react";
import { Datatable, Badge, Avatar, Text } from "twico-ui";
import { makePeople, usd, STATUS_TONE } from "./_datatableData.js";

// Inline SVG icons (no CDN) for the actions column.
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
);

// Deterministic dataset — 48 people derived from their index.
const rows = makePeople(48);

const ROLE_OPTIONS = ["Admin", "Editor", "Viewer"];
const DEPARTMENT_OPTIONS = ["Engineering", "Design", "Sales", "Marketing", "Support", "Finance"];
const STATUS_OPTIONS = ["active", "invited", "suspended"];
const COUNTRY_OPTIONS = ["US", "GB", "DE", "ID", "JP", "BR", "CA", "AU"];

const columns = [
  {
    // Pinned-left identity column with avatar + name.
    field: "name",
    headerName: "Name",
    width: 220,
    pinned: "left",
    renderCell: (value) => (
      <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2-5)" }}>
        <Avatar name={value} size="sm" />
        <span style={{ fontWeight: 600 }}>{value}</span>
      </span>
    ),
  },
  { field: "email", headerName: "Email", width: 220 },
  {
    field: "role",
    headerName: "Role",
    width: 130,
    valueOptions: ROLE_OPTIONS,
    renderCell: (value) => (
      <Badge variant="soft" size="sm" tone="neutral">{value}</Badge>
    ),
  },
  {
    field: "department",
    headerName: "Department",
    width: 150,
    valueOptions: DEPARTMENT_OPTIONS,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    valueOptions: STATUS_OPTIONS,
    renderCell: (value) => (
      <Badge variant="soft" size="sm" tone={STATUS_TONE[value]}>{value}</Badge>
    ),
  },
  {
    field: "country",
    headerName: "Country",
    width: 120,
    valueOptions: COUNTRY_OPTIONS,
  },
  {
    field: "seats",
    headerName: "Seats",
    type: "number",
    width: 110,
    aggregation: "sum",
  },
  {
    field: "mrr",
    headerName: "MRR",
    type: "number",
    width: 120,
    aggregation: "sum",
    valueFormatter: (value) => usd(value),
    aggregationFormatter: (value) => usd(value),
  },
  {
    field: "salary",
    headerName: "Salary",
    type: "number",
    width: 130,
    aggregation: "avg",
    valueFormatter: (value) => usd(value),
  },
  {
    field: "startDate",
    headerName: "Start date",
    width: 130,
  },
  {
    field: "actions",
    headerName: "",
    type: "actions",
    width: 64,
    getActions: () => [
      { icon: <EyeIcon />, label: "View", onClick: () => {} },
      { icon: <PencilIcon />, label: "Edit", showInMenu: true, onClick: () => {} },
      { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true, onClick: () => {} },
    ],
  },
];

export default function DatatableDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Text tone="muted" size="sm">
        Try it: sort a column, open the Columns / Filters / Density / Export buttons in the toolbar,
        drag or pin a column header, and tick rows to select them.
      </Text>
      <Datatable
        rows={rows}
        columns={columns}
        ariaLabel="Team members"
        checkboxSelection
        pageSize={8}
        density="standard"
        showAggregation
        rowPinning
      />
    </div>
  );
}
