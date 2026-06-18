import React from "react";
import { Container, Stack, Heading, Text } from "twico-ui";

const frame = {
  border: "1px dashed var(--color-border)",
  borderRadius: "var(--radius-lg)",
  paddingBlock: "var(--space-4)",
  background: "var(--color-surface-muted, transparent)",
};

const variations = [
  {
    title: "Sizes",
    description:
      "Named max-widths from sm (640) to full (100%). Each caps the content and centers it.",
    code: `<Container size="sm">…</Container>
<Container size="md">…</Container>
<Container size="lg">…</Container>
<Container size="xl">…</Container>
<Container size="full">…</Container>`,
    render: () => (
      <div style={{ width: "100%", display: "grid", gap: "var(--space-3)" }}>
        {["sm", "md", "lg", "xl", "full"].map((size) => (
          <Container key={size} size={size} style={frame}>
            <Text tone="muted">
              size=&quot;{size}&quot; — centered, max-width content
            </Text>
          </Container>
        ))}
      </div>
    ),
  },
  {
    title: "Section content",
    description: "The typical use: wrap a heading and body so they stay readable and centered.",
    code: `<Container size="sm">
  <Stack gap={2}>
    <Heading level={3}>Centered, max-width content</Heading>
    <Text tone="muted">Container caps the width and centers it with responsive padding.</Text>
  </Stack>
</Container>`,
    render: () => (
      <Container size="sm" style={frame}>
        <Stack gap={2}>
          <Heading level={3}>Centered, max-width content</Heading>
          <Text tone="muted">
            Container caps the width and centers it with responsive horizontal padding.
          </Text>
        </Stack>
      </Container>
    ),
  },
  {
    title: "Without padding",
    description: "Set padded={false} to remove the responsive horizontal padding (e.g. for nested layouts).",
    code: `<Container size="md" padded={false}>…</Container>`,
    render: () => (
      <div style={{ width: "100%" }}>
        <Container size="md" padded={false} style={frame}>
          <Text tone="muted">padded=&#123;false&#125; — flush to the edges</Text>
        </Container>
      </div>
    ),
  },
  {
    title: "Custom width",
    description: "size accepts any CSS length, not just the named presets.",
    code: `<Container size="480px">…</Container>`,
    render: () => (
      <div style={{ width: "100%" }}>
        <Container size="480px" style={frame}>
          <Text tone="muted">size=&quot;480px&quot;</Text>
        </Container>
      </div>
    ),
  },
  {
    title: "Semantic element",
    description: "Render as a different tag with the as prop while keeping the centering behavior.",
    code: `<Container as="section" size="md">
  <Heading level={3}>Section</Heading>
</Container>`,
    render: () => (
      <Container as="section" size="md" style={frame}>
        <Heading level={3}>Section</Heading>
        <Text tone="muted">Rendered as a &lt;section&gt; element.</Text>
      </Container>
    ),
  },
  {
    title: "All props",
    description:
      "Every Container-specific prop in one place — the element tag (as), the named/custom max-width (size), the horizontal-padding flag (padded), and the anchor props (href, target, rel) that only apply when as=\"a\" (href is scheme-sanitized).",
    code: `<Container
  as="section"          // div | section | main | a | any intrinsic tag
  size="md"             // sm 640 | md 768 | lg 1024 | xl 1280 | full | any CSS length
  padded={true}         // false removes responsive horizontal padding
>
  <Heading level={3}>Centered, max-width section</Heading>
</Container>

// Render as a link instead — href/target/rel only apply when as="a":
<Container as="a" href="/docs" target="_blank" rel="noopener noreferrer" size="sm">
  Open the docs
</Container>`,
    render: () => (
      <div style={{ width: "100%", display: "grid", gap: "var(--space-3)" }}>
        <Container as="section" size="md" padded={true} style={frame}>
          <Heading level={3}>Centered, max-width section</Heading>
          <Text tone="muted">as=&quot;section&quot;, size=&quot;md&quot;, padded=&#123;true&#125;</Text>
        </Container>
        <Container
          as="a"
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          style={{ ...frame, display: "block", textDecoration: "none" }}
        >
          <Text tone="muted">as=&quot;a&quot; — href, target=&quot;_blank&quot;, rel=&quot;noopener noreferrer&quot;</Text>
        </Container>
      </div>
    ),
  },
];

export default variations;
