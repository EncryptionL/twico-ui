import React from "react";
import { Code, Text, Stack } from "twico-ui";

const variations = [
  {
    title: "Inline code",
    description: "A bare snippet with the mono font and a subtle token-styled surface.",
    code: `<Code>npm install twico-ui</Code>`,
    render: () => <Code>npm install twico-ui</Code>,
  },
  {
    title: "Inside body text",
    description: "Drops naturally into a sentence rendered with Text.",
    code: `<Text>
  Import <Code>{'{ Button }'}</Code> from <Code>twico-ui</Code> to get started.
</Text>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Text>
          Import <Code>{"{ Button }"}</Code> from <Code>twico-ui</Code> to get
          started.
        </Text>
      </div>
    ),
  },
  {
    title: "Custom tag with `as`",
    description: "Render as a different element while keeping the code styling.",
    code: `<Code as="kbd">Ctrl</Code>
<Code as="kbd">K</Code>`,
    render: () => (
      <>
        <Code as="kbd">Ctrl</Code>
        <Code as="kbd">K</Code>
      </>
    ),
  },
  {
    title: "Stacked references",
    description: "Several snippets laid out in a column inside body text.",
    code: `<Stack gap={2}>
  <Text tone="muted">Build with <Code>npm run build</Code>.</Text>
  <Text tone="muted">Type-check with <Code>npm run typecheck</Code>.</Text>
</Stack>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Stack gap={2}>
          <Text tone="muted">
            Build with <Code>npm run build</Code>.
          </Text>
          <Text tone="muted">
            Type-check with <Code>npm run typecheck</Code>.
          </Text>
        </Stack>
      </div>
    ),
  },
];

export default variations;
