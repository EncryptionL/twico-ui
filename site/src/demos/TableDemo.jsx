import React, { useState } from "react";
import { Table } from "twico-ui";

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

export default function TableDemo() {
  const [selectedKeys] = useState([1]);
  return (
    <Table
      sortable
      striped
      rowKey={(r) => r.id}
      selectedKeys={selectedKeys}
      columns={columns}
      rows={users}
    />
  );
}
