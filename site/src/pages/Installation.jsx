import React from "react";
import { Link } from "react-router-dom";
import { Heading, Text, Stack, Code } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";

export default function Installation() {
  return (
    <Stack as="article" gap={5}>
      <Stack as="section" gap={3}>
        <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Getting started</Text>
        <Heading level={1}>Installation</Heading>
        <Text size="lg" tone="muted">
          Twico UI works in any React 18+ app. Install the package, import the stylesheet once, and
          start using components.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="install">Install</Heading>
        <CodeBlock code="npm install twico-ui" language="bash" />
        <Text tone="muted">
          <Code>react</Code> and <Code>react-dom</Code> are peer dependencies (React 18 or newer).
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="react">React (Vite / CRA)</Heading>
        <Text>Import the stylesheet once at your entry, then use components anywhere:</Text>
        <CodeBlock
          code={`// main.jsx
import "twico-ui/styles.css";`}
        />
        <CodeBlock
          code={`// App.jsx
import { Button, Datatable, Input } from "twico-ui";

export default function App() {
  return (
    <div>
      <Input label="Email" placeholder="you@example.com" />
      <Button>Save changes</Button>
    </div>
  );
}`}
        />
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="next-app">Next.js — App Router</Heading>
        <Text>
          Import the CSS once in the root layout. Every component ships a <Code>"use client"</Code>{" "}
          boundary, so it drops straight into Server Components without extra wrapping.
        </Text>
        <CodeBlock
          code={`// app/layout.tsx
import "twico-ui/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}
        />
        <CodeBlock
          code={`// app/page.tsx — a Server Component, no "use client" needed
import { Stat, Button } from "twico-ui";

export default function Page() {
  return (
    <main>
      <Stat label="Revenue" value="$48,200" delta="+12.5%" />
      <Button>Get started</Button>
    </main>
  );
}`}
        />
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="next-pages">Next.js — Pages Router</Heading>
        <CodeBlock
          code={`// pages/_app.tsx
import "twico-ui/styles.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}`}
        />
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="ssr">SSR &amp; hydration</Heading>
        <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <li>Components are <strong>SSR-safe</strong> — nothing touches <Code>window</Code>/<Code>document</Code> during render; all browser access is inside effects and handlers.</li>
          <li>The global stylesheet provides tokens, the reset, and self-hosted fonts at first paint.</li>
          <li>Overlays (Menu, Popover, Select, Dialog, Drawer, CommandPalette) render through portals only while open, so they never run on the server.</li>
        </ul>
      </Stack>

      <Text style={{ marginTop: "var(--space-4)", fontWeight: "var(--font-semibold)" }}>
        Next: <Link to="/docs/theming" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>Theming →</Link>
      </Text>
    </Stack>
  );
}
