import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Stack, Heading, Text } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";
import LiveExample from "../components/LiveExample.jsx";

function DarkDemo() {
  const [dark, setDark] = React.useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <Button onClick={toggle}>{dark ? "Switch to light" : "Switch to dark"}</Button>
      <Card>The surfaces, text, borders, and shadows here all flip with the theme.</Card>
    </div>
  );
}

export default function DarkMode() {
  return (
    <Stack as="article" gap={5} className="docs-article">
      <Text className="docs-eyebrow" tone="primary">Getting started</Text>
      <Heading level={1}>Dark mode</Heading>
      <Text className="docs-lead" size="lg" tone="muted">
        Dark tokens live on the document root. Add the <code>dark</code> class (or{" "}
        <code>data-theme="dark"</code>) to <code>&lt;html&gt;</code> and the whole system re-themes —
        including portaled menus, popovers, and the command palette.
      </Text>

      <Stack as="section" gap={3}>
        <Heading level={2} id="toggle">Toggle it</Heading>
        <CodeBlock code={`document.documentElement.classList.toggle("dark");`} />

        <LiveExample>
          <DarkDemo />
        </LiveExample>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="persist">Persist the choice</Heading>
        <Text>Read a saved preference (or the system setting) before paint to avoid a flash:</Text>
        <CodeBlock
          code={`// in <head>, before your app renders
const saved = localStorage.getItem("theme");
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
if (saved === "dark" || (!saved && prefersDark)) {
  document.documentElement.classList.add("dark");
}`}
          language="js"
        />
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="next-app-router">Next.js App Router</Heading>
        <Text>
          Toggle the class on <code>&lt;html&gt;</code> from a Client Component (e.g. a theme button),
          or set it server-side via the <code>className</code> on <code>&lt;html&gt;</code>.
        </Text>
      </Stack>

      <Text className="docs-next">
        Next: <Link to="/docs/accessibility" className="docs-link">Accessibility →</Link>
      </Text>
    </Stack>
  );
}
