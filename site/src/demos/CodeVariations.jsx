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
  {
    title: "All props",
    description:
      "Every Code-specific prop in one place — as picks the rendered tag, and the as=\"a\" link form adds href (scheme-sanitized), target, and rel.",
    code: `// Default inline <code> element:
<Code as="code">npm install twico-ui</Code>

// Render as a scheme-sanitized link instead:
<Code
  as="a"                              // any intrinsic tag: code | kbd | a | span …
  href="https://github.com/twico-ui"  // only used with as="a"; javascript:/data:/vbscript: are stripped
  target="_blank"                     // only used with as="a"
  rel="noopener noreferrer"           // pair with target="_blank"
>
  twico-ui/twico-ui
</Code>`,
    render: () => (
      <>
        <Code as="code">npm install twico-ui</Code>
        <Code
          as="a"
          href="https://github.com/twico-ui"
          target="_blank"
          rel="noopener noreferrer"
        >
          twico-ui/twico-ui
        </Code>
      </>
    ),
  },
];

export default variations;
