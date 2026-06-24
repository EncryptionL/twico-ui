import React from "react";
import { AppShell, Sidebar, Button, Heading, Text } from "twico-ui";

const ITEMS = [
  { section: "Menu" },
  { label: "Overview", active: true },
  { label: "Reports" },
  { label: "Settings" },
];

// AppShell is normally full-viewport (height: 100dvh). Here it's given a fixed
// height so it embeds inside the docs preview; the content region scrolls.
export default function AppShellDemo() {
  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", width: "100%" }}>
      <AppShell
        height={340}
        sidebar={<Sidebar brand={<strong>Acme</strong>} items={ITEMS} />}
        header={
          <>
            <Heading level={2} size="lg" style={{ margin: 0 }}>
              Overview
            </Heading>
            <Button size="sm">New</Button>
          </>
        }
      >
        <Heading level={3} size="md" style={{ marginTop: 0 }}>
          Welcome back
        </Heading>
        <Text tone="muted">The sidebar and topbar stay fixed — only this area scrolls.</Text>
        <div style={{ height: 360, display: "grid", placeItems: "center", color: "var(--color-text-subtle)" }}>
          scrollable content
        </div>
      </AppShell>
    </div>
  );
}
