import React, { useState } from "react";
import { Table } from "twico-ui";

const users = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", status: "Active", mrr: 120 },
  { id: 2, name: "Alan Turing", role: "Designer", status: "Invited", mrr: 90 },
  { id: 3, name: "Grace Hopper", role: "Manager", status: "Active", mrr: 200 },
];

const columns = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
  { key: "status", header: "Status" },
  { key: "mrr", header: "MRR", align: "right" },
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
      data={users}
    />
  );
}
