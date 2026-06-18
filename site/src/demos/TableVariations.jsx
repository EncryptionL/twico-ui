import React from "react";
import { Table, Badge } from "twico-ui";

const users = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", status: "Active", mrr: 120 },
  { id: 2, name: "Alan Turing", role: "Designer", status: "Invited", mrr: 90 },
  { id: 3, name: "Grace Hopper", role: "Manager", status: "Active", mrr: 200 },
];

/** @type {import("twico-ui").TableColumn[]} */
const columns = [
  { field: "name", headerName: "Name" },
  { field: "role", headerName: "Role" },
  { field: "status", headerName: "Status" },
  { field: "mrr", headerName: "MRR", align: "right" },
];

// Stateful demo for the "All props" example — render() is called inside .map(),
// so the controlled-sort hook must live in a module-level component, not inline.
function TableAllProps() {
  const [sort, setSort] = React.useState({ field: "name", dir: /** @type {"asc" | "desc"} */ ("asc") }); // or defaultSort for uncontrolled
  /** @type {import("twico-ui").TableColumn[]} */
  const allColumns = [
    { field: "name", headerName: "Name", width: "40%" },         // field = data key + sort key
    { field: "role", headerName: "Role", align: "left" },
    {
      field: "status",
      headerName: "Status",
      align: "center",
      sortable: false,                                            // opt this column out of sorting
      renderCell: (v) => (                                        // (value, row, index) => node
        <Badge tone={v === "Active" ? "success" : "neutral"}>{v}</Badge>
      ),
    },
    { field: "mrr", headerName: "MRR", align: "right", width: "120px" },
  ];
  return (
    <div style={{ width: 560, maxWidth: "100%" }}>
      <Table
        columns={allColumns}
        rows={users}
        hover                                  // row hover highlight (default true)
        striped                                // zebra striping (default false)
        size="md"                              // sm | md | lg
        sortable                               // enable click-to-sort headers
        sort={sort}                            // controlled — or defaultSort for uncontrolled
        onSortChange={setSort}                 // (sort: { field, dir }) => void
        rowKey={(r) => r.id}                   // stable key per row (row, index)
        selectedKeys={[3]}                     // keys of rows to highlight
        stickyHeader                           // pin thead while the body scrolls
        maxHeight={200}                        // own scroll area (px or CSS length)
      />
    </div>
  );
}

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
      /** @type {import("twico-ui").TableColumn[]} */
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
  {
    title: "All props",
    description:
      "Every Table prop in one place — column shape (field, headerName, align, width, per-column sortable, renderCell), hover/striped/size, controlled sorting (sortable + sort + onSortChange), rowKey + selectedKeys for row highlight, and stickyHeader + maxHeight for a self-scrolling table. Sorting is controlled here; pass defaultSort instead for the uncontrolled form.",
    code: `const [sort, setSort] = React.useState({ field: "name", dir: "asc" }); // or defaultSort for uncontrolled

const columns = [
  { field: "name", headerName: "Name", width: "40%" },         // field = data key + sort key
  { field: "role", headerName: "Role", align: "left" },        // left | center | right
  {
    field: "status",
    headerName: "Status",
    align: "center",
    sortable: false,                                            // opt this column out of sorting
    renderCell: (v) => (                                        // (value, row, index) => node
      <Badge tone={v === "Active" ? "success" : "neutral"}>{v}</Badge>
    ),
  },
  { field: "mrr", headerName: "MRR", align: "right", width: "120px" },
];

<Table
  columns={columns}
  rows={users}
  hover                                  // row hover highlight (default true)
  striped                                // zebra striping (default false)
  size="md"                              // sm | md | lg
  sortable                               // enable click-to-sort headers
  sort={sort}                            // controlled — or defaultSort for uncontrolled
  onSortChange={setSort}                 // (sort: { field, dir }) => void
  rowKey={(r) => r.id}                   // stable key per row (row, index)
  selectedKeys={[3]}                     // keys of rows to highlight
  stickyHeader                           // pin thead while the body scrolls
  maxHeight={200}                        // own scroll area (px or CSS length)
/>`,
    render: () => <TableAllProps />,
  },
];

export default variations;
