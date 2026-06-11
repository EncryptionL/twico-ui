import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Badge, Card, Stack, Grid, Heading, Text, Container, Box, Switch, Avatar, Tag } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Logo from "../components/Logo.jsx";
import { REPO_URL, NPM_URL, CHANGELOG_URL } from "../data/site.js";

const FEATURES = [
  { title: "61 components", core: true, body: "Buttons, inputs, selects, overlays, a full Datatable, and more — everything a web app needs." },
  { title: "Token-themed", body: "Every color, radius, shadow, and font is a CSS variable. Rebrand by overriding a handful of them." },
  { title: "Dark mode", body: "A single .dark class on <html> re-themes the whole system, portaled overlays included." },
  { title: "Accessible", body: "ARIA roles, keyboard navigation, focus trapping in modals, and reduced-motion support." },
  { title: "React + Next.js", body: 'Ships a "use client" boundary, so it drops straight into the Next.js App Router.' },
  { title: "Truly free", body: "MIT licensed, no paid tiers, no premium add-ons. Use it anywhere, commercial or not." },
];

const docsLinkStyle = { color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" };
const footerLink = { color: "var(--color-text-muted)", fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)", textDecoration: "none" };
const eyebrow = { textTransform: "uppercase", letterSpacing: "0.08em" };

export default function Home() {
  const navigate = useNavigate();
  return (
    <Container size="xl">
      {/* Hero */}
      <Stack as="section" gap={5} align="center" style={{ textAlign: "center", padding: "var(--space-10) 0 var(--space-8)" }}>
        <Badge>Free &amp; open source · MIT</Badge>
        <Heading level={1} align="center" style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)", lineHeight: 1.05, maxWidth: 760 }}>
          The free React component library
          <br /> that themes to <span style={{ color: "var(--color-primary)" }}>your</span> brand.
        </Heading>
        <Text size="lg" tone="muted" align="center" style={{ maxWidth: 600 }}>
          A modern, themeable component library with dark mode, lively motion, and accessibility built
          in — styled entirely with CSS design tokens. No runtime CSS framework required.
        </Text>

        <Box style={{ maxWidth: 340, width: "100%" }}>
          <CodeBlock code="npm install twico-ui" language="bash" />
        </Box>

        <Stack direction="row" gap={3} justify="center" wrap>
          <Button onClick={() => navigate("/docs/installation")}>Get started</Button>
          <Button variant="soft" onClick={() => navigate("/components")}>Browse components</Button>
        </Stack>

        <Text size="sm" tone="subtle" align="center">
          Requires React 18+ · 61 components ·{" "}
          <Link to="/docs/dark-mode" style={docsLinkStyle}>dark mode</Link> ·{" "}
          <Link to="/docs/accessibility" style={docsLinkStyle}>accessible</Link>
        </Text>
      </Stack>

      {/* Live component showcase — the site is built with these */}
      <Card as="section" style={{ padding: "var(--space-7) var(--space-6)", marginBottom: "var(--space-10)" }}>
        <Stack gap={5} align="center">
          <Text as="div" size="xs" weight="bold" tone="subtle" align="center" style={eyebrow}>
            Real components, right here
          </Text>
          <ErrorBoundary>
            <Stack direction="row" gap={4} justify="center" align="center" wrap>
              <Button>Save changes</Button>
              <Button variant="soft">Preview</Button>
              <Badge tone="success">Live</Badge>
              <Tag>design</Tag>
              <Switch defaultChecked />
              <Stack direction="row" gap={2} align="center">
                <Avatar name="Ada Lovelace" size="sm" status="online" />
                <Avatar name="Sam Lee" size="sm" />
                <Avatar name="Mia Cruz" size="sm" />
              </Stack>
            </Stack>
          </ErrorBoundary>
        </Stack>
      </Card>

      {/* Features — balanced 3-up grid */}
      <Grid as="section" minChildWidth={330} gap={4} style={{ marginBottom: "var(--space-10)" }}>
        {FEATURES.map((f) => (
          <Card
            key={f.title}
            title={
              <Stack direction="row" gap={2} align="center">
                <Heading level={4} as="span">{f.title}</Heading>
                {f.core ? <Badge>core</Badge> : null}
              </Stack>
            }
          >
            <Text size="sm" tone="muted">{f.body}</Text>
          </Card>
        ))}
      </Grid>

      {/* CTA */}
      <Card style={{ textAlign: "center", padding: "var(--space-10) var(--space-6)" }}>
        <Stack gap={3} align="center">
          <Heading level={2} align="center">Dogfooded, not theoretical.</Heading>
          <Text tone="muted" align="center" style={{ maxWidth: 540 }}>
            This entire site is built with Twico UI — every button, badge, table, card, and dark-mode
            toggle you see is a component from the library.
          </Text>
          <Stack direction="row" gap={3} justify="center" wrap>
            <Button onClick={() => navigate("/components")}>Explore the components</Button>
            <Button variant="outline" onClick={() => window.open(REPO_URL, "_blank", "noopener,noreferrer")}>Star on GitHub</Button>
          </Stack>
        </Stack>
      </Card>

      {/* Footer */}
      <Box as="footer" style={{ borderTop: "1px solid var(--color-border)", marginTop: "var(--space-10)", padding: "var(--space-8) 0 var(--space-7)" }}>
        <Stack direction="row" justify="space-between" align="center" gap={4} wrap>
          <Stack direction="row" align="center" gap={3} wrap>
            <Logo />
            <Text size="sm" tone="subtle">MIT licensed · © 2026</Text>
          </Stack>
          <Stack direction="row" gap={5} align="center" wrap>
            <Link to="/docs/installation" style={footerLink}>Docs</Link>
            <Link to="/components" style={footerLink}>Components</Link>
            <a href={CHANGELOG_URL} target="_blank" rel="noopener noreferrer" style={footerLink}>Changelog</a>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={footerLink}>GitHub</a>
            <a href={NPM_URL} target="_blank" rel="noopener noreferrer" style={footerLink}>npm</a>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
