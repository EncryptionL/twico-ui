import React from "react";
import { Table } from "twico-ui";

// Dogfooding: the props reference for every component is rendered with Twico UI's own Table,
// using its per-column `render` to keep the code-styled cells.
const columns = [
  {
    key: "prop",
    header: "Prop",
    render: (_v, r) => (
      <>
        <code className="docs-prop">{r.prop}</code>
        {r.required ? <span className="docs-req" title="Required">*</span> : null}
      </>
    ),
  },
  { key: "type", header: "Type", render: (_v, r) => <code className="docs-type">{r.type}</code> },
  {
    key: "default",
    header: "Default",
    render: (_v, r) =>
      r.default && r.default !== "—" ? (
        <code className="docs-default">{r.default}</code>
      ) : (
        <span className="docs-muted">—</span>
      ),
  },
  { key: "description", header: "Description" },
];

export default function PropsTable({ rows }) {
  if (!rows || !rows.length) {
    return <p className="docs-muted">This component takes no props.</p>;
  }
  return <Table columns={columns} data={rows} rowKey={(r) => r.prop} striped hover={false} />;
}
