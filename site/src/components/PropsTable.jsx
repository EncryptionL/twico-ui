import React from "react";

export default function PropsTable({ rows }) {
  if (!rows || !rows.length) {
    return <p className="docs-muted">This component takes no props.</p>;
  }
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.prop}>
              <td>
                <code className="docs-prop">{r.prop}</code>
                {r.required ? <span className="docs-req" title="Required">*</span> : null}
              </td>
              <td><code className="docs-type">{r.type}</code></td>
              <td>{r.default && r.default !== "—" ? <code className="docs-default">{r.default}</code> : <span className="docs-muted">—</span>}</td>
              <td>{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
