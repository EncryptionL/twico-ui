import React from "react";
import { Datatable, runDatatableQuery, Badge, Avatar, Alert, Text, Progress } from "twico-ui";
import { makePeople, usd, STATUS_TONE } from "./_datatableData.js";

/* ------------------------------------------------------------------ icons */
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18v12H3z" /><path d="M3 7l9 6 9-6" /></svg>
);
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
);

/* --------------------------------------------------- shared display helpers */
const ROLE_OPTIONS = ["Admin", "Editor", "Viewer"];
const DEPARTMENT_OPTIONS = ["Engineering", "Design", "Sales", "Marketing", "Support", "Finance"];
const STATUS_OPTIONS = ["active", "invited", "suspended"];
const COUNTRY_OPTIONS = ["US", "GB", "DE", "ID", "JP", "BR", "CA", "AU"];

const StatusBadge = (v) => (
  <Badge tone={STATUS_TONE[v] || "neutral"} variant="soft" dot>
    {v}
  </Badge>
);

const NameCell = (v, row) => (
  <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2-5)" }}>
    <Avatar name={v} size="sm" />
    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
      <span style={{ fontWeight: 600 }}>{v}</span>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-subtle)" }}>{row.email}</span>
    </span>
  </span>
);

/* ================================================================== 1. SERVER */
// The single in-memory "database" the simulated backend queries against. In a
// real app this lives behind your API; `runDatatableQuery` (from twico-ui)
// applies the grid's own filter/sort/search/paging semantics so a fake or real
// backend returns exactly what client mode would.
const DB = makePeople(300);

const SERVER_COLUMNS = [
  { field: "name", headerName: "Name", width: 230, renderCell: NameCell },
  { field: "role", headerName: "Role", width: 120, editable: true, editType: "select", valueOptions: ROLE_OPTIONS },
  { field: "department", headerName: "Department", width: 150, editable: true, editType: "select", valueOptions: DEPARTMENT_OPTIONS },
  {
    field: "status", headerName: "Status", width: 130,
    editable: true, editType: "select", valueOptions: STATUS_OPTIONS, renderCell: StatusBadge,
  },
  { field: "country", headerName: "Country", width: 110, valueOptions: COUNTRY_OPTIONS },
  { field: "seats", headerName: "Seats", type: "number", width: 100, editable: true, aggregation: "sum" },
  {
    field: "mrr", headerName: "MRR", type: "number", width: 120,
    aggregation: "sum", valueFormatter: (v) => usd(v),
  },
  {
    field: "salary", headerName: "Salary", type: "number", width: 140,
    editable: true, aggregation: "avg", valueFormatter: (v) => usd(v),
  },
];

const SERVER_PAGE_SIZE = 10;

// Stands in for your backend: runDatatableQuery does the filter/sort/search/page
// work; you only add app-specific totals over the filtered set for the footer.
function load(q) {
  const { rows, total, filtered } = runDatatableQuery(DB, q, { columns: SERVER_COLUMNS });
  const sum = (k) => filtered.reduce((n, r) => n + Number(r[k] || 0), 0);
  const agg = {
    salary: { sum: sum("salary"), avg: total ? Math.round(sum("salary") / total) : 0 },
    mrr: { sum: sum("mrr") },
    seats: { sum: sum("seats") },
  };
  return { rows, total, agg, loading: false };
}

function ServerSideDemo() {
  const reqId = React.useRef(0);
  // Remember the active query so a write (edit / batch / delete) can re-fetch the
  // same page after it mutates the backing "database".
  const lastQuery = React.useRef({ page: 0, pageSize: SERVER_PAGE_SIZE, sort: null, filters: [], quickFilter: "" });
  const [state, setState] = React.useState(() => load(lastQuery.current));

  const fetchPage = React.useCallback((q) => {
    lastQuery.current = q;
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true }));
    // Fake network latency; only the LATEST request is allowed to win.
    setTimeout(() => {
      if (id !== reqId.current) return; // stale response — drop it.
      setState(load(q));
    }, 350);
  }, []);

  const handleServerChange = React.useCallback((q) => fetchPage(q), [fetchPage]);

  // All three writes persist to the server (mutate DB) then re-fetch the current page.
  const handleRowUpdate = React.useCallback((updated) => {
    const i = DB.findIndex((r) => r.id === updated.id);
    if (i >= 0) DB[i] = updated;
    fetchPage(lastQuery.current);
  }, [fetchPage]);

  const handleBatchUpdate = React.useCallback((changed) => {
    for (const c of changed) {
      const i = DB.findIndex((r) => r.id === c.id);
      if (i >= 0) DB[i] = c;
    }
    fetchPage(lastQuery.current);
  }, [fetchPage]);

  const batchActions = React.useMemo(() => [
    {
      label: "Delete", danger: true,
      onClick: (keys, rows, clear) => {
        for (const k of keys) {
          const i = DB.findIndex((r) => r.id === k);
          if (i >= 0) DB.splice(i, 1);
        }
        clear();
        fetchPage(lastQuery.current);
      },
    },
  ], [fetchPage]);

  // Data columns + a per-row actions column. The single-row Delete is also a
  // server write: it removes the row from the backend and re-fetches the page.
  const columns = React.useMemo(() => [
    ...SERVER_COLUMNS,
    {
      field: "actions", headerName: "Actions", type: "actions", width: 96,
      getActions: (row) => [
        { icon: <MailIcon />, label: "Email", onClick: () => {} },
        {
          icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true,
          onClick: () => {
            const i = DB.findIndex((r) => r.id === row.id);
            if (i >= 0) DB.splice(i, 1);
            fetchPage(lastQuery.current);
          },
        },
      ],
    },
  ], [fetchPage]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Alert tone="info" title="Simulated backend">
        <Text size="sm" tone="muted" style={{ margin: 0 }}>
          The same Datatable, in server mode against a 300-row &ldquo;backend.&rdquo; Everything
          round-trips through the server: sorting, the per-column filter panel, quick search, paging,
          and the footer totals (onServerChange). So do all the writes — double-click an editable
          cell (onRowUpdate), tick rows and hit Edit to batch-update a column (onBatchUpdate), delete
          the selected rows (batch action), or delete a single row from its ⋮ menu. Each write
          mutates the backend and re-fetches the current page; the skeleton shows while a request is
          in flight and stale responses are dropped.
        </Text>
      </Alert>
      <Datatable
        serverMode
        rows={state.rows}
        rowCount={state.total}
        loading={state.loading}
        onServerChange={handleServerChange}
        onRowUpdate={handleRowUpdate}
        onBatchUpdate={handleBatchUpdate}
        checkboxSelection
        batchActions={batchActions}
        aggregationValues={state.agg}
        showAggregation
        pageSize={SERVER_PAGE_SIZE}
        pageSizeOptions={[10, 25, 50]}
        height={420}
        columns={columns}
      />
    </div>
  );
}

/* ================================================================ 2. GROUPING */
function GroupingDemo() {
  const data = React.useMemo(() => makePeople(36), []);
  return (
    <Datatable
      rows={data}
      rowGrouping={["department"]}
      showAggregation
      height={440}
      columns={[
        { field: "department", headerName: "Department", width: 160 },
        { field: "name", headerName: "Name", width: 200, aggregation: "count" },
        { field: "role", headerName: "Role", width: 120 },
        { field: "status", headerName: "Status", width: 130, renderCell: StatusBadge },
        { field: "seats", headerName: "Seats", type: "number", width: 110, aggregation: "sum" },
        { field: "mrr", headerName: "MRR", type: "number", width: 130, aggregation: "sum", valueFormatter: (v) => usd(v) },
        { field: "salary", headerName: "Salary", type: "number", width: 140, aggregation: "avg", valueFormatter: (v) => usd(v) },
      ]}
    />
  );
}

/* =================================================================== 3. PIVOT */
function PivotDemo() {
  const data = React.useMemo(() => makePeople(48), []);
  return (
    <Datatable
      rows={data}
      pivotMode
      pivot={{
        rows: ["department"],
        columns: ["role"],
        values: [{ field: "mrr", agg: "sum", label: "MRR", valueFormatter: (v) => usd(v) }],
      }}
      height={400}
      columns={[
        { field: "department", headerName: "Department" },
        { field: "role", headerName: "Role" },
        { field: "mrr", headerName: "MRR", type: "number", valueFormatter: (v) => usd(v) },
      ]}
    />
  );
}

/* ================================================================= 4. EDITING */
function EditingDemo() {
  const [rows, setRows] = React.useState(() => makePeople(8));

  const handleRowUpdate = React.useCallback((updated) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }, []);

  return (
    <Datatable
      rows={rows}
      onRowUpdate={handleRowUpdate}
      height={400}
      columns={[
        { field: "name", headerName: "Name", width: 180 },
        {
          field: "role", headerName: "Role", width: 130,
          editable: true, editType: "select", valueOptions: ROLE_OPTIONS,
        },
        {
          field: "status", headerName: "Status", width: 140,
          editable: true, editType: "select", valueOptions: STATUS_OPTIONS,
          renderCell: StatusBadge,
        },
        {
          field: "seats", headerName: "Seats", type: "number", width: 110,
          editable: true, editType: "number",
        },
        {
          field: "mrr", headerName: "MRR", type: "number", width: 120,
          editable: true, editType: "number", valueFormatter: (v) => usd(v),
        },
      ]}
    />
  );
}

/* ============================================================== 5. VIRTUALIZED */
// Notes of deliberately varied length so rows differ in height once the Note column wraps.
const NOTES = [
  "Primary account owner.",
  "Renewal next quarter — flagged for an upsell about additional seats and the analytics add-on, pending a budget sign-off from their finance team.",
  "Trial converted last month.",
  "Key stakeholder; prefers email over calls and owns the security review for their whole org.",
  "—",
  "Migrated off the legacy plan; watch for billing edge cases around mid-cycle proration and the grandfathered discount that carried over.",
];
function VirtualizedDemo() {
  const data = React.useMemo(() => makePeople(500).map((r, i) => ({ ...r, note: NOTES[i % NOTES.length] })), []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Text size="sm" tone="muted" style={{ margin: 0 }}>
        Pagination is off (<code>pageSize={0}</code>) and <code>virtualized</code> is on, so the grid
        windows the rows — only the handful near the viewport are in the DOM while you scroll all 500.
        The <strong>Note</strong> column wraps, so rows differ in height; windowing measures each row,
        so the scrollbar and spacing stay accurate (variable-height virtualization).
      </Text>
      <Datatable
        rows={data}
        pageSize={0}
        virtualized
        height={440}
        columns={[
          { field: "name", headerName: "Name", width: 200, renderCell: NameCell },
          { field: "role", headerName: "Role", width: 110 },
          { field: "status", headerName: "Status", width: 120, renderCell: StatusBadge },
          { field: "note", headerName: "Note", width: 300, wrapText: true },
          { field: "mrr", headerName: "MRR", type: "number", width: 110, valueFormatter: (v) => usd(v) },
        ]}
      />
    </div>
  );
}

/* ======================================================= 6. REORDER + PINNING */
function ReorderPinningDemo() {
  const [rows, setRows] = React.useState(() => makePeople(12));

  const handleRowOrderChange = React.useCallback((keys) => {
    setRows((prev) => {
      const byKey = new Map(prev.map((r) => [r.id, r]));
      return keys.map((k) => byKey.get(k)).filter(Boolean);
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Text size="sm" tone="muted" style={{ margin: 0 }}>
        Drag a row by its handle to reorder, or grab it with Enter/Space and move with the Arrow
        keys; each row&rsquo;s ⋮ menu can pin it to the top or bottom.
      </Text>
      <Datatable
        rows={rows}
        rowReorder
        rowPinning
        onRowOrderChange={handleRowOrderChange}
        height={400}
        columns={[
          { field: "name", headerName: "Name", width: 200, renderCell: NameCell },
          { field: "role", headerName: "Role", width: 120 },
          { field: "department", headerName: "Department", width: 150 },
          { field: "mrr", headerName: "MRR", type: "number", width: 120, valueFormatter: (v) => usd(v) },
        ]}
      />
    </div>
  );
}

/* ============================================ 7. ACTIONS + BATCH + BATCH EDIT */
function ActionsBatchDemo() {
  const [rows, setRows] = React.useState(() => makePeople(10));
  return (
    <Datatable
      rows={rows}
      checkboxSelection
      height={400}
      // Inline edit persists single-cell changes; batch edit persists the popover.
      onRowUpdate={(updated) => setRows((d) => d.map((r) => (r.id === updated.id ? updated : r)))}
      onBatchUpdate={(changed) => setRows((d) => d.map((r) => changed.find((c) => c.id === r.id) || r))}
      batchActions={[
        { icon: <DownloadIcon />, label: "Export selected", onClick: (keys, rs, clear) => clear() },
        { icon: <MailIcon />, label: "Email", onClick: (keys, rs, clear) => clear() },
        { icon: <TrashIcon />, label: "Delete", danger: true, onClick: (keys, rs, clear) => { setRows((d) => d.filter((r) => !keys.includes(r.id))); clear(); } },
      ]}
      columns={[
        { field: "name", headerName: "Name", width: 190 },
        { field: "email", headerName: "Email", width: 210 },
        { field: "role", headerName: "Role", width: 120, editable: true, editType: "select", valueOptions: ROLE_OPTIONS },
        { field: "status", headerName: "Status", width: 130, editable: true, editType: "select", valueOptions: STATUS_OPTIONS, renderCell: StatusBadge },
        {
          field: "actions", headerName: "Actions", type: "actions", width: 110,
          getActions: (row) => [
            { icon: <PencilIcon />, label: "View", onClick: () => {} },
            { icon: <MailIcon />, label: "Email", showInMenu: true, onClick: () => {} },
            { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true, onClick: () => setRows((d) => d.filter((r) => r.id !== row.id)) },
          ],
        },
      ]}
    />
  );
}

/* ===================================================== 8. CUSTOM RENDERERS */
function CustomRenderersDemo() {
  const data = React.useMemo(() => makePeople(8), []);
  return (
    <Datatable
      rows={data}
      height={400}
      columns={[
        { field: "name", headerName: "Member", width: 240, renderCell: NameCell },
        { field: "status", headerName: "Status", width: 130, renderCell: StatusBadge },
        {
          field: "score", headerName: "Score", width: 200,
          renderCell: (v) => (
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Progress
                value={v}
                tone={v >= 80 ? "success" : v >= 60 ? "primary" : "warning"}
                size="sm"
                style={{ flex: 1, minWidth: 80 }}
              />
              <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--color-text-muted)" }}>{v}</span>
            </span>
          ),
        },
        { field: "mrr", headerName: "MRR", type: "number", width: 120, valueFormatter: (v) => usd(v) },
      ]}
    />
  );
}

/* ================================================================= variations */
const variations = [
  {
    title: "Server-side data — sort, filter, page, edit & batch update",
    description:
      "The same Datatable in server mode against a simulated 300-row backend. Reads round-trip through onServerChange (sort, the per-column filter panel, quick search, paging, and the totals footer). So do ALL the writes: inline-edit a cell (onRowUpdate), batch-update a column across selected rows (onBatchUpdate), batch-delete selected rows, or delete a single row from its ⋮ menu — each one mutates the backend and re-fetches the current page, with a skeleton while in flight and stale responses dropped.",
    code: `import { Datatable, runDatatableQuery } from "twico-ui";

const DB = makePeople(300); // your data (or a REST / GraphQL endpoint)

const columns = [
  { field: "name", headerName: "Name", renderCell: NameCell },
  // editable columns work in server mode too (double-click + batch Edit button)
  { field: "role", headerName: "Role", editable: true, editType: "select", valueOptions: ["Admin", "Editor", "Viewer"] },
  { field: "department", headerName: "Department", editable: true, editType: "select", valueOptions: DEPARTMENT_OPTIONS },
  { field: "status", headerName: "Status", editable: true, editType: "select", valueOptions: STATUS_OPTIONS, renderCell: StatusBadge },
  { field: "seats", headerName: "Seats", type: "number", editable: true, aggregation: "sum" },
  { field: "mrr", headerName: "MRR", type: "number", aggregation: "sum", valueFormatter: usd },
  { field: "salary", headerName: "Salary", type: "number", editable: true, aggregation: "avg", valueFormatter: usd },
];

// Your backend. runDatatableQuery applies the grid's own filter/sort/search/paging
// to an array; swap it for a fetch(). You add app-specific totals for the footer.
function load(q) {
  const { rows, total, filtered } = runDatatableQuery(DB, q, { columns });
  const sum = (k) => filtered.reduce((n, r) => n + r[k], 0);
  const agg = {
    salary: { sum: sum("salary"), avg: total ? Math.round(sum("salary") / total) : 0 },
    mrr: { sum: sum("mrr") },
    seats: { sum: sum("seats") },
  };
  return { rows, total, agg, loading: false };
}

function ServerSideDemo() {
  const lastQuery = useRef({ page: 0, pageSize: 10, sort: null, filters: [], quickFilter: "" });
  const [state, setState] = useState(() => load(lastQuery.current));

  // Re-fetch a page. onServerChange fires (debounced) on sort/filter/search/page;
  // the write handlers below call it again after mutating the backend.
  const fetchPage = (q) => {
    lastQuery.current = q;
    setState((s) => ({ ...s, loading: true }));
    setTimeout(() => setState(load(q)), 350); // <- replace with your fetch(q)
  };

  // Delete one row on the server, then re-fetch.
  const deleteRow = (id) => {
    const i = DB.findIndex((r) => r.id === id);
    if (i >= 0) DB.splice(i, 1);
    fetchPage(lastQuery.current);
  };

  return (
    <Datatable
      serverMode
      // data columns + a per-row actions column (single-row delete = a server write)
      columns={[
        ...columns,
        {
          field: "actions", headerName: "Actions", type: "actions", width: 96,
          getActions: (row) => [
            { icon: <MailIcon />, label: "Email", onClick: () => {} },
            { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true, onClick: () => deleteRow(row.id) },
          ],
        },
      ]}
      rows={state.rows}
      rowCount={state.total}
      loading={state.loading}
      onServerChange={fetchPage}
      // persist a single inline edit on the server, then re-fetch
      onRowUpdate={(updated) => {
        const i = DB.findIndex((r) => r.id === updated.id);
        if (i >= 0) DB[i] = updated;
        fetchPage(lastQuery.current);
      }}
      // batch edit: write the chosen column across every selected row, then re-fetch
      onBatchUpdate={(changed) => {
        changed.forEach((c) => { const i = DB.findIndex((r) => r.id === c.id); if (i >= 0) DB[i] = c; });
        fetchPage(lastQuery.current);
      }}
      checkboxSelection
      batchActions={[
        { label: "Delete", danger: true, onClick: (keys, rows, clear) => {
          keys.forEach((k) => { const i = DB.findIndex((r) => r.id === k); if (i >= 0) DB.splice(i, 1); });
          clear();
          fetchPage(lastQuery.current);
        } },
      ]}
      aggregationValues={state.agg}
      showAggregation
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
    />
  );
}`,
    render: () => <ServerSideDemo />,
  },
  {
    title: "Row grouping with subtotals",
    description:
      "Group rows by department; number columns aggregate so each collapsible group shows its own subtotals and the footer shows the grand total.",
    code: `<Datatable
  rows={makePeople(36)}
  rowGrouping={["department"]}
  showAggregation
  columns={[
    { field: "department", headerName: "Department" },
    { field: "name", headerName: "Name", aggregation: "count" },
    { field: "role", headerName: "Role" },
    { field: "status", headerName: "Status", renderCell: StatusBadge },
    { field: "seats", headerName: "Seats", type: "number", aggregation: "sum" },
    { field: "mrr", headerName: "MRR", type: "number", aggregation: "sum", valueFormatter: usd },
    { field: "salary", headerName: "Salary", type: "number", aggregation: "avg", valueFormatter: usd },
  ]}
/>`,
    render: () => <GroupingDemo />,
  },
  {
    title: "Pivot table",
    description:
      "Turn the grid into a pivot: department down the rows, role across the columns, and summed MRR in the cells.",
    code: `<Datatable
  rows={makePeople(48)}
  pivotMode
  pivot={{
    rows: ["department"],
    columns: ["role"],
    values: [{ field: "mrr", agg: "sum", label: "MRR", valueFormatter: usd }],
  }}
  columns={[
    { field: "department", headerName: "Department" },
    { field: "role", headerName: "Role" },
    { field: "mrr", headerName: "MRR", type: "number", valueFormatter: usd },
  ]}
/>`,
    render: () => <PivotDemo />,
  },
  {
    title: "Inline editing",
    description:
      "Double-click an editable cell: role/status open a select editor, seats/mrr open number editors, and onRowUpdate persists the committed value to local state.",
    code: `function EditingDemo() {
  const [rows, setRows] = React.useState(() => makePeople(8));
  return (
    <Datatable
      rows={rows}
      onRowUpdate={(updated) =>
        setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      }
      columns={[
        { field: "name", headerName: "Name" },
        { field: "role", headerName: "Role", editable: true, editType: "select", valueOptions: ["Admin", "Editor", "Viewer"] },
        { field: "status", headerName: "Status", editable: true, editType: "select", valueOptions: STATUS_OPTIONS, renderCell: StatusBadge },
        { field: "seats", headerName: "Seats", type: "number", editable: true, editType: "number" },
        { field: "mrr", headerName: "MRR", type: "number", editable: true, editType: "number", valueFormatter: usd },
      ]}
    />
  );
}`,
    render: () => <EditingDemo />,
  },
  {
    title: "Virtualized large dataset (variable row heights)",
    description:
      "With pagination off and virtualization on, the grid windows ~500 rows so only the visible slice is in the DOM. The wrapped Note column makes rows differ in height — windowing measures each rendered row and caches it by key, so the scrollbar and row spacing stay accurate even with mixed heights.",
    code: `<Datatable
  rows={bigRows}           // 500 rows, each with a variable-length note
  pageSize={0}             // pagination off -> one long scroll body
  virtualized              // render only rows near the viewport
  height={440}
  columns={[
    { field: "name", headerName: "Name", renderCell: NameCell },
    { field: "role", headerName: "Role" },
    { field: "status", headerName: "Status", renderCell: StatusBadge },
    // wrapText -> some rows are taller; virtualization measures + caches each height
    { field: "note", headerName: "Note", width: 300, wrapText: true },
    { field: "mrr", headerName: "MRR", type: "number", valueFormatter: usd },
  ]}
/>`,
    render: () => <VirtualizedDemo />,
  },
  {
    title: "Row reorder + pinning",
    description:
      "Drag rows to reorder (or grab with Enter/Space and move with the Arrow keys), pin rows to the top/bottom from each row's menu, and persist the new order via onRowOrderChange.",
    code: `function ReorderPinningDemo() {
  const [rows, setRows] = React.useState(() => makePeople(12));
  return (
    <Datatable
      rows={rows}
      rowReorder
      rowPinning
      onRowOrderChange={(keys) =>
        setRows((prev) => {
          const byKey = new Map(prev.map((r) => [r.id, r]));
          return keys.map((k) => byKey.get(k)).filter(Boolean);
        })
      }
      columns={[
        { field: "name", headerName: "Name", renderCell: NameCell },
        { field: "role", headerName: "Role" },
        { field: "department", headerName: "Department" },
        { field: "mrr", headerName: "MRR", type: "number", valueFormatter: usd },
      ]}
    />
  );
}`,
    render: () => <ReorderPinningDemo />,
  },
  {
    title: "Actions column, batch actions & batch edit",
    description:
      "Three selection patterns at once. A per-row actions column adds inline icon buttons plus an overflow (⋮) menu (showInMenu). Ticking rows swaps the toolbar for your batchActions (export / email / delete). And because some columns are editable, the grid adds a built-in Edit button to that toolbar — pick a column and a value to write it across every selected row in one go (onBatchUpdate); double-clicking a single cell edits just that one (onRowUpdate).",
    code: `function Example() {
  const [rows, setRows] = useState(() => makePeople(10));

  return (
    <Datatable
      rows={rows}
      checkboxSelection
      // batch edit -> "changed" is every selected row with the chosen column(s) overwritten
      onBatchUpdate={(changed) =>
        setRows((d) => d.map((r) => changed.find((c) => c.id === r.id) || r))
      }
      // single-cell inline edit (double-click an editable cell)
      onRowUpdate={(updated) =>
        setRows((d) => d.map((r) => (r.id === updated.id ? updated : r)))
      }
      // actions shown in the toolbar while >=1 row is selected
      batchActions={[
        { icon: <DownloadIcon />, label: "Export selected", onClick: (keys, rs, clear) => clear() },
        { icon: <MailIcon />, label: "Email", onClick: (keys, rs, clear) => clear() },
        { icon: <TrashIcon />, label: "Delete", danger: true,
          onClick: (keys, rs, clear) => { setRows((d) => d.filter((r) => !keys.includes(r.id))); clear(); } },
      ]}
      columns={[
        { field: "name", headerName: "Name" },
        { field: "email", headerName: "Email" },
        // editable columns -> double-click to edit AND enable the batch Edit button
        { field: "role", headerName: "Role", editable: true, editType: "select", valueOptions: ROLE_OPTIONS },
        { field: "status", headerName: "Status", editable: true, editType: "select", valueOptions: STATUS_OPTIONS, renderCell: StatusBadge },
        {
          // per-row actions: inline buttons + an overflow menu (showInMenu)
          field: "actions", headerName: "Actions", type: "actions", width: 110,
          getActions: (row) => [
            { icon: <PencilIcon />, label: "View", onClick: () => {} },
            { icon: <MailIcon />, label: "Email", showInMenu: true, onClick: () => {} },
            { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true,
              onClick: () => setRows((d) => d.filter((r) => r.id !== row.id)) },
          ],
        },
      ]}
    />
  );
}`,
    render: () => <ActionsBatchDemo />,
  },
  {
    title: "Custom cell renderers",
    description:
      "renderCell draws an avatar + name, a status Badge, and a score as a colored Progress bar.",
    code: `<Datatable
  rows={makePeople(8)}
  columns={[
    { field: "name", headerName: "Member", renderCell: NameCell },
    { field: "status", headerName: "Status", renderCell: StatusBadge },
    {
      field: "score", headerName: "Score", width: 200,
      renderCell: (v) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Progress value={v} tone={v >= 80 ? "success" : v >= 60 ? "primary" : "warning"} size="sm" style={{ flex: 1 }} />
          <span>{v}</span>
        </span>
      ),
    },
    { field: "mrr", headerName: "MRR", type: "number", valueFormatter: usd },
  ]}
/>`,
    render: () => <CustomRenderersDemo />,
  },
];

export default variations;
