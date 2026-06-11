import React from "react";
import { Link } from "react-router-dom";
import { Stack, Heading, Text } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";

export default function Theming() {
  return (
    <Stack as="article" gap={5} className="docs-article">
      <Stack as="section" gap={3}>
        <Text className="docs-eyebrow" tone="primary">Getting started</Text>
        <Heading level={1}>Theming</Heading>
        <Text className="docs-lead" size="lg" tone="muted">
          Every visual in Twico UI derives from CSS custom properties (design tokens). Override them in
          your own CSS to rebrand the entire system — no component changes, no build step.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="basics">Override tokens</Heading>
        <Text>
          Set the tokens you want to change on <code>:root</code> (place this after importing
          <code> twico-ui/styles.css</code> so it wins the cascade):
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
        <ul className="docs-list">
          <li><strong>Colors</strong> — <code>--color-primary</code>, surfaces (<code>--color-bg</code>, <code>--color-surface</code>), text (<code>--color-text</code>, <code>--color-text-muted</code>), borders, and semantics (success / warning / danger / info).</li>
          <li><strong>Radius</strong> — <code>--radius-sm</code> … <code>--radius-2xl</code>, <code>--radius-full</code>.</li>
          <li><strong>Typography</strong> — <code>--font-sans</code>, <code>--font-mono</code>, the size scale, and weights.</li>
          <li><strong>Spacing, shadows, and motion</strong> — <code>--space-*</code>, <code>--shadow-*</code>, <code>--duration-*</code>, and <code>--ease-*</code>.</li>
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

      <Text className="docs-next">
        Next: <Link to="/docs/dark-mode" className="docs-link">Dark mode →</Link>
      </Text>
    </Stack>
  );
}
