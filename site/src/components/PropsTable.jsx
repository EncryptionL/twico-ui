import React from "react";
import { Table, Code, Text, Stack } from "twico-ui";

// Dogfooding: the props reference for every component is rendered with Twico UI's
// own Table, using its per-column `render` to style cells with Code/Text.
const columns = [
  {
    key: "prop",
    header: "Prop",
    render: (_v, r) => (
      <Stack direction="row" gap={1} align="center" inline>
        <Code>{r.prop}</Code>
        {r.required ? <Text as="span" tone="primary" weight="bold">*</Text> : null}
      </Stack>
    ),
  },
  { key: "type", header: "Type", render: (_v, r) => <Code>{r.type}</Code> },
  {
    key: "default",
    header: "Default",
    render: (_v, r) =>
      r.default && r.default !== "—" ? <Code>{r.default}</Code> : <Text as="span" tone="subtle">—</Text>,
  },
  { key: "description", header: "Description" },
];

export default function PropsTable({ rows }) {
  if (!rows || !rows.length) {
    return <Text tone="subtle">This component takes no props.</Text>;
  }
  return <Table columns={columns} data={rows} rowKey={(r) => r.prop} striped hover={false} />;
}
