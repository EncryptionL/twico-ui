import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Badge, Card, Stack, Grid, Heading, Text, Container, Box } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { components } from "../data/components.js";

const FEATURES = [
  { title: "60 components", body: "Buttons, inputs, selects, overlays, a full Datatable, and more — everything a web app needs." },
  { title: "Token-themed", body: "Every color, radius, shadow, and font is a CSS variable. Rebrand by overriding a handful of them." },
  { title: "Dark mode", body: "A single .dark class on <html> re-themes the whole system, portaled overlays included." },
  { title: "Accessible", body: "ARIA roles, keyboard navigation, focus trapping in modals, and reduced-motion support." },
  { title: "React + Next.js", body: 'Ships a "use client" boundary, so it drops straight into the Next.js App Router.' },
  { title: "Truly free", body: "MIT licensed, no paid tiers, no premium add-ons. Use it anywhere, commercial or not." },
];

const docsLinkStyle = { color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" };

export default function Home() {
  const navigate = useNavigate();
  return (
    <Container size="xl">
      <Stack as="section" gap={5} align="center" style={{ textAlign: "center", padding: "var(--space-8) 0 var(--space-10)" }}>
        <Badge>Free &amp; open source · MIT</Badge>
        <Heading level={1} align="center" style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)", lineHeight: 1.05 }}>
          The free React component library
          <br /> that themes to <span style={{ color: "var(--color-primary)" }}>your</span> brand.
        </Heading>
        <Text size="lg" tone="muted" align="center" style={{ maxWidth: 620 }}>
          Twico UI is a modern, themeable component library with dark mode, lively motion, and
          accessibility built in — styled entirely with CSS design tokens. No runtime CSS framework required.
        </Text>

        <Box style={{ maxWidth: 340, width: "100%" }}>
          <CodeBlock code="npm install twico-ui" language="bash" />
        </Box>

        <Stack direction="row" gap={3} justify="center" wrap>
          <ErrorBoundary>
            <Button onClick={() => navigate("/docs/installation")}>Get started</Button>
            <Button variant="soft" onClick={() => navigate("/components")}>Browse components</Button>
          </ErrorBoundary>
        </Stack>

        <Text size="sm" tone="subtle" align="center">
          Requires React 18+ · 60 components ·{" "}
          <Link to="/docs/dark-mode" style={docsLinkStyle}>dark mode</Link> ·{" "}
          <Link to="/docs/accessibility" style={docsLinkStyle}>accessible</Link>
        </Text>
      </Stack>

      <Grid as="section" minChildWidth={260} gap={4} style={{ margin: "var(--space-10) 0" }}>
        {FEATURES.map((f) => (
          <Card
            key={f.title}
            title={
              <Stack direction="row" gap={2} align="center">
                <Heading level={4} as="span">{f.title}</Heading>
                {f.title === "60 components" ? <Badge>core</Badge> : null}
              </Stack>
            }
          >
            <Text size="sm" tone="muted">{f.body}</Text>
          </Card>
        ))}
      </Grid>

      <Card style={{ textAlign: "center", padding: "var(--space-10) var(--space-6)", marginTop: "var(--space-8)" }}>
        <Stack gap={3} align="center">
          <Heading level={2} align="center">Dogfooded, not theoretical.</Heading>
          <Text tone="muted" align="center" style={{ maxWidth: 540 }}>
            This entire site is built with Twico UI — every button, badge, table, card, and dark-mode
            toggle you see is a component from the library.
          </Text>
          <Button onClick={() => navigate("/components")}>Explore the components</Button>
        </Stack>
      </Card>
    </Container>
  );
}
