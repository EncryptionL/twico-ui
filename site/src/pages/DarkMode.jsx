import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Stack, Heading, Text, Code, useColorScheme } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";
import LiveExample from "../components/LiveExample.jsx";

function DarkDemo() {
  const { isDark, toggle } = useColorScheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <Button onClick={toggle}>{isDark ? "Switch to light" : "Switch to dark"}</Button>
      <Card>The surfaces, text, borders, and shadows here all flip with the theme.</Card>
    </div>
  );
}

export default function DarkMode() {
  return (
    <Stack as="article" gap={5}>
      <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Getting started</Text>
      <Heading level={1}>Dark mode</Heading>
      <Text size="lg" tone="muted">
        Dark tokens live on the document root. Add the <Code>dark</Code> class (or{" "}
        <Code>data-theme="dark"</Code>) to <Code>&lt;html&gt;</Code> and the whole system re-themes —
        including portaled menus, popovers, and the command palette.
      </Text>

      <Stack as="section" gap={3}>
        <Heading level={2} id="toggle">Toggle it</Heading>
        <Text>
          The <Code>useColorScheme</Code> hook is the easiest way: it flips the class on{" "}
          <Code>&lt;html&gt;</Code>, persists the choice, keeps every instance in sync, and disables
          transitions for the switch so the whole UI re-themes at once — no element-by-element ripple.
        </Text>
        <CodeBlock
          code={`import { useColorScheme } from "twico-ui";

function ThemeButton() {
  const { isDark, toggle } = useColorScheme();
  return <button onClick={toggle}>{isDark ? "Light" : "Dark"}</button>;
}`}
        />
        <LiveExample>
          <DarkDemo />
        </LiveExample>
        <Text tone="muted">Wiring it yourself? It ultimately just toggles a class on the root:</Text>
        <CodeBlock code={`document.documentElement.classList.toggle("dark");`} />
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="persist">Persist the choice</Heading>
        <Text>
          <Code>useColorScheme</Code> already saves the preference to localStorage. To also avoid a
          flash on the very first load — before React mounts — read it in <Code>&lt;head&gt;</Code>:
        </Text>
        <CodeBlock
          code={`// in <head>, before your app renders
const saved = localStorage.getItem("twico-theme");
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
          Toggle the class on <Code>&lt;html&gt;</Code> from a Client Component (e.g. a theme button),
          or set it server-side via the <Code>className</Code> on <Code>&lt;html&gt;</Code>.
        </Text>
      </Stack>

      <Text style={{ marginTop: "var(--space-4)", fontWeight: "var(--font-semibold)" }}>
        Next: <Link to="/docs/accessibility" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>Accessibility →</Link>
      </Text>
    </Stack>
  );
}
