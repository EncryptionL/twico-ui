import React from "react";
import { Link } from "react-router-dom";
import { Stack, Heading, Text, Code } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";

export default function Theming() {
  return (
    <Stack as="article" gap={5}>
      <Stack as="section" gap={3}>
        <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Getting started</Text>
        <Heading level={1}>Theming</Heading>
        <Text size="lg" tone="muted">
          Every visual in Twico UI derives from CSS custom properties (design tokens). Override them in
          your own CSS to rebrand the entire system — no component changes, no build step.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="basics">Override tokens</Heading>
        <Text>
          Set the tokens you want to change on <Code>:root</Code> (place this after importing
          <Code> twico-ui/styles.css</Code> so it wins the cascade):
        </Text>
        <CodeBlock
          code={`:root {
  --color-primary: #7c3aed;          /* brand color           */
  --radius-md: 12px;                 /* corner radius          */
  --font-sans: "Inter", sans-serif;  /* typeface               */
}`}
          language="css"
        />
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="scales">What you can theme</Heading>
        <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <li><strong>Colors</strong> — <Code>--color-primary</Code>, surfaces (<Code>--color-bg</Code>, <Code>--color-surface</Code>), text (<Code>--color-text</Code>, <Code>--color-text-muted</Code>), borders, and semantics (success / warning / danger / info).</li>
          <li><strong>Radius</strong> — <Code>--radius-sm</Code> … <Code>--radius-2xl</Code>, <Code>--radius-full</Code>.</li>
          <li><strong>Typography</strong> — <Code>--font-sans</Code>, <Code>--font-mono</Code>, the size scale, and weights.</li>
          <li><strong>Spacing, shadows, and motion</strong> — <Code>--space-*</Code>, <Code>--shadow-*</Code>, <Code>--duration-*</Code>, and <Code>--ease-*</Code>.</li>
        </ul>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="scoped">Scoped themes</Heading>
        <Text>
          Tokens are inherited, so you can theme a subtree by setting variables on a wrapper element —
          useful for a single section, a marketing page, or a tenant brand:
        </Text>
        <CodeBlock
          code={`<div style={{ "--color-primary": "#0ea5e9", "--radius-md": "8px" }}>
  {/* Everything in here uses the sky-blue, tighter-radius theme */}
  <Button>Themed button</Button>
</div>`}
        />
      </Stack>

      <Text style={{ marginTop: "var(--space-4)", fontWeight: "var(--font-semibold)" }}>
        Next: <Link to="/docs/dark-mode" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>Dark mode →</Link>
      </Text>
    </Stack>
  );
}
