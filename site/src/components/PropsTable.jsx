import React from "react";
import { Table, Code, Text, Stack } from "twico-ui";

// A prop's `type` can be a long union (`"a" | "b" | "c" | ...`) or a complex
// signature (`React.HTMLAttributes<HTMLDivElement>`). Rendering either as a single
// nowrap <Code> chip forces the column wide and crushes the Description column, so:
//   • a plain union of literals/simple types -> one small chip per member, wrapping;
//   • anything with generics/functions/objects -> wrapping monospace text (no chip).
function TypeCell({ type }) {
  const splittable = type.includes(" | ") && !/[<(){}]/.test(type);
  if (splittable) {
    return (
      <Stack direction="row" gap={1} wrap style={{ rowGap: 4, alignItems: "center" }}>
        {type.split(" | ").map((part, i) => (
          <Code key={i}>{part}</Code>
        ))}
      </Stack>
    );
  }
  return (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.82em",
        color: "var(--color-text-muted)",
        whiteSpace: "normal",
        wordBreak: "break-word",
        lineHeight: 1.55,
      }}
    >
      {type}
    </code>
  );
}

// Dogfooding: the props reference for every component is rendered with Twico UI's
// own Table, using its per-column `render` to style cells with Code/Text.
const columns = [
  {
    field: "prop",
    headerName: "Prop",
    width: "20%",
    renderCell: (_v, r) => (
      <Stack direction="row" gap={1} align="center" inline style={{ flexWrap: "wrap", rowGap: 2 }}>
        <Code>{r.prop}</Code>
        {r.required ? <Text as="span" tone="primary" weight="bold">*</Text> : null}
      </Stack>
    ),
  },
  { field: "type", headerName: "Type", width: "28%", renderCell: (_v, r) => <TypeCell type={r.type} /> },
  {
    field: "default",
    headerName: "Default",
    width: "12%",
    renderCell: (_v, r) =>
      r.default && r.default !== "—" ? <Code>{r.default}</Code> : <Text as="span" tone="subtle">—</Text>,
  },
  {
    field: "description",
    headerName: "Description",
    width: "40%",
    renderCell: (_v, r) => (
      <Text as="span" tone="muted" style={{ lineHeight: 1.55 }}>
        {r.description}
      </Text>
    ),
  },
];

export default function PropsTable({ rows }) {
  if (!rows || !rows.length) {
    return <Text tone="subtle">This component takes no props.</Text>;
  }
  return <Table columns={columns} rows={rows} rowKey={(r) => r.prop} striped hover={false} />;
}
