import React from "react";
import { Datatable, Badge, Avatar, Alert, Text, Progress } from "twico-ui";
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
/**
 * Component-faithful filter test. Mirrors the operators the Datatable's own
 * filter panel applies so the simulated backend returns exactly what the user
 * expects to see for each operator.
 */
function testFilter(raw, op, target, type) {
  if (op === "isEmpty") return raw == null || raw === "";
  if (op === "isNotEmpty") return !(raw == null || raw === "");
  if (op === "isAnyOf") {
    if (!Array.isArray(target) || target.length === 0) return true;
    return target.map(String).includes(String(raw));
  }
  if (target === "" || target == null) return true;
  if (type === "number") {
    const a = Number(raw), b = Number(target);
    if (Number.isNaN(a) || Number.isNaN(b)) return true;
    switch (op) {
      case "=": return a === b;
      case "!=": return a !== b;
      case ">": return a > b;
      case ">=": return a >= b;
      case "<": return a < b;
      case "<=": return a <= b;
      default: return true;
    }
  }
  const s = String(raw ?? "").toLowerCase(), t = String(target).toLowerCase();
  switch (op) {
    case "equals": return s === t;
    case "startsWith": return s.startsWith(t);
    case "endsWith": return s.endsWith(t);
    default: return s.includes(t);
  }
}

// The single in-memory "database" the simulated backend queries against.
const DB = makePeople(300);

// Column type lookup used by the query() to pick numeric vs. string comparison.
const SERVER_COL_TYPE = {
  name: "string", email: "string", role: "string", department: "string",
  status: "string", country: "string", seats: "number", mrr: "number",
  salary: "number", score: "number", startDate: "string",
};

const STRING_FIELDS = ["name", "email", "role", "department", "status", "country", "startDate"];

/**
 * Run a full server-style query over DB: quick-filter -> column filters ->
 * sort -> aggregation (over the FILTERED set) -> page slice. Pure + synchronous;
 * the latency is faked by the caller.
 */
function query(q) {
  let filtered = DB;

  // 1) quick filter — case-insensitive substring across all string fields.
  const quick = (q.quickFilter || "").trim().toLowerCase();
  if (quick) {
    filtered = filtered.filter((r) =>
      STRING_FIELDS.some((f) => String(r[f] ?? "").toLowerCase().includes(quick))
    );
  }

  // 2) per-column filters.
  for (const f of q.filters || []) {
    const type = SERVER_COL_TYPE[f.field] || "string";
    filtered = filtered.filter((r) => testFilter(r[f.field], f.op, f.value, type));
  }

  // 3) sort.
  if (q.sort && q.sort.field) {
    const { field, dir } = q.sort;
    const numeric = SERVER_COL_TYPE[field] === "number";
    const sign = dir === "desc" ? -1 : 1;
    filtered = filtered.slice().sort((a, b) => {
      if (numeric) return (Number(a[field]) - Number(b[field])) * sign;
      return String(a[field] ?? "").localeCompare(String(b[field] ?? "")) * sign;
    });
  }

  const total = filtered.length;

  // 4) aggregation over the FILTERED set (per-function maps per field). Pass RAW
  // numbers — each column's own valueFormatter (usd) formats the footer value, so
  // pre-formatting here would double-format into "$NaN".
  const sum = (key) => filtered.reduce((acc, r) => acc + Number(r[key] || 0), 0);
  const salarySum = sum("salary");
  const agg = {
    salary: { sum: salarySum, avg: total ? Math.round(salarySum / total) : 0 },
    mrr: { sum: sum("mrr") },
    seats: { sum: sum("seats") },
  };

  // 5) page slice.
  const start = q.page * q.pageSize;
  const rows = filtered.slice(start, start + q.pageSize);

  return { rows, total, agg };
}

const SERVER_COLUMNS = [
  { field: "name", headerName: "Name", width: 230, renderCell: NameCell },
  { field: "role", headerName: "Role", width: 120, valueOptions: ROLE_OPTIONS },
  { field: "department", headerName: "Department", width: 150, valueOptions: DEPARTMENT_OPTIONS },
  {
    field: "status", headerName: "Status", width: 130,
    valueOptions: STATUS_OPTIONS, renderCell: StatusBadge,
  },
  { field: "country", headerName: "Country", width: 110, valueOptions: COUNTRY_OPTIONS },
  { field: "seats", headerName: "Seats", type: "number", width: 100, aggregation: "sum" },
  {
    field: "mrr", headerName: "MRR", type: "number", width: 120,
    aggregation: "sum", valueFormatter: (v) => usd(v),
  },
  {
    field: "salary", headerName: "Salary", type: "number", width: 140,
    aggregation: "avg", valueFormatter: (v) => usd(v),
  },
];

const SERVER_PAGE_SIZE = 10;

function ServerSideDemo() {
  const reqId = React.useRef(0);
  // Seed synchronously by running the query once for page 0 so the first paint
  // already has data (no flash of empty state).
  const seed = React.useMemo(
    () => query({ page: 0, pageSize: SERVER_PAGE_SIZE, sort: null, filters: [], quickFilter: "" }),
    []
  );
  const [state, setState] = React.useState({
    rows: seed.rows,
    total: seed.total,
    agg: seed.agg,
    loading: false,
  });

  const handleServerChange = React.useCallback((q) => {
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true }));
    // Fake network latency; only the LATEST request is allowed to win.
    setTimeout(() => {
      const { rows, total, agg } = query(q);
      if (id !== reqId.current) return; // stale response — drop it.
      setState({ rows, total, agg, loading: false });
    }, 350);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Alert tone="info" title="Simulated backend">
        <Text size="sm" tone="muted" style={{ margin: 0 }}>
          Sorting, the per-column filter panel, quick search, and paging all round-trip
          &ldquo;to the server&rdquo; (250ms debounce + ~350ms latency). The footer totals are
          computed server-side over the full filtered result; the skeleton shows while a request
          is in flight, and stale responses are discarded so the latest query always wins.
        </Text>
      </Alert>
      <Datatable
        serverMode
        rows={state.rows}
        rowCount={state.total}
        loading={state.loading}
        onServerChange={handleServerChange}
        aggregationValues={state.agg}
        showAggregation
        pageSize={SERVER_PAGE_SIZE}
        pageSizeOptions={[10, 25, 50]}
        height={420}
        columns={SERVER_COLUMNS}
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
function VirtualizedDemo() {
  const data = React.useMemo(() => makePeople(500), []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Text size="sm" tone="muted" style={{ margin: 0 }}>
        Pagination is off (<code>pageSize={0}</code>) and <code>virtualized</code> is on, so the
        grid windows the rows — only the handful near the viewport are in the DOM while you scroll
        all 500 rows.
      </Text>
      <Datatable
        rows={data}
        pageSize={0}
        virtualized
        height={420}
        density="compact"
        columns={[
          { field: "name", headerName: "Name", width: 220, renderCell: NameCell },
          { field: "role", headerName: "Role", width: 120 },
          { field: "department", headerName: "Department", width: 150 },
          { field: "status", headerName: "Status", width: 130, renderCell: StatusBadge },
          { field: "country", headerName: "Country", width: 100 },
          { field: "mrr", headerName: "MRR", type: "number", width: 120, valueFormatter: (v) => usd(v) },
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

/* ====================================================== 7. ACTIONS + BATCH */
function ActionsBatchDemo() {
  const data = React.useMemo(() => makePeople(10), []);
  return (
    <Datatable
      rows={data}
      checkboxSelection
      height={400}
      batchActions={[
        { icon: <DownloadIcon />, label: "Export selected", onClick: (keys, rs, clear) => clear() },
        { icon: <MailIcon />, label: "Email", onClick: (keys, rs, clear) => clear() },
        { icon: <TrashIcon />, label: "Delete", danger: true, onClick: (keys, rs, clear) => clear() },
      ]}
      columns={[
        { field: "name", headerName: "Name", width: 200 },
        { field: "email", headerName: "Email", width: 220 },
        { field: "role", headerName: "Role", width: 120 },
        {
          field: "actions", headerName: "", type: "actions", width: 110,
          getActions: () => [
            { icon: <PencilIcon />, label: "Edit", onClick: () => {} },
            { icon: <MailIcon />, label: "Email", showInMenu: true, onClick: () => {} },
            { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true, onClick: () => {} },
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
    title: "Server-side data (sorting, filtering, paging, aggregation)",
    description:
      "A full server-mode grid wired to a simulated 300-row backend — sort, the per-column filter panel, quick search, paging, and the totals footer all round-trip through onServerChange with debounce + latency.",
    code: `// One in-memory "database" the fake backend queries.
const DB = makePeople(300);

function ServerSideDemo() {
  const reqId = React.useRef(0);
  const [state, setState] = React.useState(() => {
    const r = query({ page: 0, pageSize: 10, sort: null, filters: [], quickFilter: "" });
    return { rows: r.rows, total: r.total, agg: r.agg, loading: false };
  });

  const onServerChange = React.useCallback((q) => {
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true }));
    setTimeout(() => {                         // fake ~350ms latency
      const { rows, total, agg } = query(q);   // quickFilter -> filters -> sort -> agg -> page
      if (id !== reqId.current) return;        // latest request wins
      setState({ rows, total, agg, loading: false });
    }, 350);
  }, []);

  return (
    <Datatable
      serverMode
      rows={state.rows}
      rowCount={state.total}
      loading={state.loading}
      onServerChange={onServerChange}
      aggregationValues={state.agg}   // { salary:{avg,sum}, mrr:{sum}, seats:{sum} }
      showAggregation
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      columns={[
        { field: "name", headerName: "Name", renderCell: NameCell },
        { field: "role", headerName: "Role", valueOptions: ["Admin", "Editor", "Viewer"] },
        { field: "department", headerName: "Department", valueOptions: DEPARTMENT_OPTIONS },
        { field: "status", headerName: "Status", valueOptions: STATUS_OPTIONS, renderCell: StatusBadge },
        { field: "country", headerName: "Country", valueOptions: COUNTRY_OPTIONS },
        { field: "seats", headerName: "Seats", type: "number", aggregation: "sum" },
        { field: "mrr", headerName: "MRR", type: "number", aggregation: "sum", valueFormatter: usd },
        { field: "salary", headerName: "Salary", type: "number", aggregation: "avg", valueFormatter: usd },
      ]}
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
    title: "Virtualized large dataset",
    description:
      "With pagination off and virtualization on, the grid windows ~500 rows so only the visible slice is rendered, keeping scrolling smooth.",
    code: `<Datatable
  rows={makePeople(500)}   // large dataset
  pageSize={0}             // pagination off -> one long scroll body
  virtualized              // render only rows near the viewport
  height={420}
  density="compact"
  columns={[
    { field: "name", headerName: "Name", renderCell: NameCell },
    { field: "role", headerName: "Role" },
    { field: "department", headerName: "Department" },
    { field: "status", headerName: "Status", renderCell: StatusBadge },
    { field: "country", headerName: "Country" },
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
    title: "Actions column + batch actions",
    description:
      "Checkbox selection swaps the toolbar for batch actions (export / email / delete), while a per-row actions column adds inline buttons plus an overflow menu.",
    code: `<Datatable
  rows={makePeople(10)}
  checkboxSelection
  batchActions={[
    { icon: <DownloadIcon />, label: "Export selected", onClick: (k, r, clear) => clear() },
    { icon: <MailIcon />, label: "Email", onClick: (k, r, clear) => clear() },
    { icon: <TrashIcon />, label: "Delete", danger: true, onClick: (k, r, clear) => clear() },
  ]}
  columns={[
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "role", headerName: "Role" },
    {
      field: "actions", type: "actions", width: 110,
      getActions: () => [
        { icon: <PencilIcon />, label: "Edit", onClick: () => {} },
        { icon: <TrashIcon />, label: "Delete", showInMenu: true, danger: true, onClick: () => {} },
      ],
    },
  ]}
/>`,
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
