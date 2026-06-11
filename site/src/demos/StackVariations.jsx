import React from "react";
import { Stack, Button, Badge } from "twico-ui";

const variations = [
  {
    title: "Column (default)",
    description: "Stacks children vertically with a token-based gap.",
    code: `<Stack gap={2}>
  <Button fullWidth>Top</Button>
  <Button fullWidth variant="soft">Middle</Button>
  <Button fullWidth variant="outline">Bottom</Button>
</Stack>`,
    render: () => (
      <div style={{ width: 240, maxWidth: "100%" }}>
        <Stack gap={2}>
          <Button fullWidth>Top</Button>
          <Button fullWidth variant="soft">Middle</Button>
          <Button fullWidth variant="outline">Bottom</Button>
        </Stack>
      </div>
    ),
  },
  {
    title: "Row, centered",
    description: "Horizontal layout with align-items centered.",
    code: `<Stack direction="row" gap={2} align="center">
  <Button>Save</Button>
  <Button variant="ghost">Cancel</Button>
  <Badge>row</Badge>
</Stack>`,
    render: () => (
      <Stack direction="row" gap={2} align="center">
        <Button>Save</Button>
        <Button variant="ghost">Cancel</Button>
        <Badge>row</Badge>
      </Stack>
    ),
  },
  {
    title: "Justify between",
    description: "Pushes children to the edges with justify-content.",
    code: `<Stack direction="row" gap={2} align="center" justify="space-between">
  <Badge tone="success">Active</Badge>
  <Button size="sm" variant="soft">Manage</Button>
</Stack>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Stack direction="row" gap={2} align="center" justify="space-between">
          <Badge tone="success">Active</Badge>
          <Button size="sm" variant="soft">Manage</Button>
        </Stack>
      </div>
    ),
  },
  {
    title: "Wrapping row",
    description: "Children flow onto multiple lines when space runs out.",
    code: `<Stack direction="row" gap={2} wrap>
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>Vite</Badge>
  <Badge>Accessibility</Badge>
  <Badge>Dark mode</Badge>
</Stack>`,
    render: () => (
      <div style={{ width: 240, maxWidth: "100%" }}>
        <Stack direction="row" gap={2} wrap>
          <Badge>React</Badge>
          <Badge>TypeScript</Badge>
          <Badge>Vite</Badge>
          <Badge>Accessibility</Badge>
          <Badge>Dark mode</Badge>
        </Stack>
      </div>
    ),
  },
  {
    title: "Larger gap",
    description: "Any spacing step works as the gap; here a roomier gap={6}.",
    code: `<Stack direction="row" gap={6} align="center">
  <Button>One</Button>
  <Button variant="soft">Two</Button>
  <Button variant="outline">Three</Button>
</Stack>`,
    render: () => (
      <Stack direction="row" gap={6} align="center">
        <Button>One</Button>
        <Button variant="soft">Two</Button>
        <Button variant="outline">Three</Button>
      </Stack>
    ),
  },
];

export default variations;
