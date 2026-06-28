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
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18v12H3z" /><path d="M3 7l9 6 9-6" /></svg>
);

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
    // editable: double-click to edit inline; with rows selected, the toolbar's
    // "Edit" button writes one value across every selected row.
    field: "role",
    headerName: "Role",
    width: 130,
    editable: true,
    editType: "select",
    valueOptions: ROLE_OPTIONS,
    renderCell: (value) => (
      <Badge variant="soft" size="sm" tone="neutral">{value}</Badge>
    ),
  },
  {
    field: "department",
    headerName: "Department",
    width: 150,
    editable: true,
    editType: "select",
    valueOptions: DEPARTMENT_OPTIONS,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    editable: true,
    editType: "select",
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
    editable: true,
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
    editable: true,
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
    headerName: "Actions",
    type: "actions",
    width: 110,
    getActions: () => [
      { icon: <EyeIcon />, label: "View", onClick: () => {} },
      { icon: <PencilIcon />, label: "Edit", showInMenu: true, onClick: () => {} },
      { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true, onClick: () => {} },
    ],
  },
];

export default function DatatableDemo() {
  // Stateful rows so inline edits and the batch editor persist their changes.
  const [rows, setRows] = React.useState(() => makePeople(48));

  // Commit a single inline-cell edit.
  const handleRowUpdate = React.useCallback((updated) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }, []);

  // Commit the batch editor: `changed` is every selected row with the chosen
  // column(s) overwritten (the value you picked in the Edit popover).
  const handleBatchUpdate = React.useCallback((changed) => {
    setRows((prev) => prev.map((r) => changed.find((c) => c.id === r.id) || r));
  }, []);

  // Actions for the selection toolbar that appears when one or more rows are ticked.
  // (A built-in "Edit" button is added automatically because columns are editable.)
  const batchActions = React.useMemo(() => [
    { label: "Export", icon: <DownloadIcon />, onClick: (keys, rs, clear) => clear() },
    { label: "Email", icon: <MailIcon />, onClick: (keys, rs, clear) => clear() },
    {
      label: "Delete",
      icon: <TrashIcon />,
      danger: true,
      onClick: (keys, rs, clear) => { setRows((prev) => prev.filter((r) => !keys.includes(r.id))); clear(); },
    },
  ], []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "100%", minWidth: 0, maxWidth: "100%" }}>
      <Text tone="muted" size="sm">
        Try it: sort a column, open the toolbar tools (hover for labels), drag or pin a column
        header (double-click its right edge to auto-fit the width), use a column's ⋮ menu to{" "}
        <strong>wrap text</strong>, double-click an editable cell (Role, Department, Status, Seats,
        Salary) to edit it, and tick rows — a selection toolbar appears with batch actions plus an{" "}
        <strong>Edit</strong> button that sets one value across every selected row.
      </Text>
      <Datatable
        rows={rows}
        columns={columns}
        ariaLabel="Team members"
        checkboxSelection
        rowNumbers
        batchActions={batchActions}
        onRowUpdate={handleRowUpdate}
        onBatchUpdate={handleBatchUpdate}
        pageSize={8}
        density="standard"
        showAggregation
        showDensity
        showExport
        rowPinning
      />
    </div>
  );
}
