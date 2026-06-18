import React from "react";
import { Text } from "twico-ui";

const variations = [
  {
    title: "Sizes",
    description: "Five font-size tokens, from xs to xl.",
    code: `<Text size="xs">Extra small</Text>
<Text size="sm">Small</Text>
<Text size="base">Base (default)</Text>
<Text size="lg">Large</Text>
<Text size="xl">Extra large</Text>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Text size="xs">Extra small</Text>
        <Text size="sm">Small</Text>
        <Text size="base">Base (default)</Text>
        <Text size="lg">Large</Text>
        <Text size="xl">Extra large</Text>
      </div>
    ),
  },
  {
    title: "Tones",
    description: "Semantic color tones for emphasis and meaning.",
    code: `<Text tone="default">Default body text</Text>
<Text tone="muted">Muted, for captions</Text>
<Text tone="subtle">Subtle, even quieter</Text>
<Text tone="primary">Primary accent</Text>
<Text tone="danger">Danger, for errors</Text>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Text tone="default">Default body text</Text>
        <Text tone="muted">Muted, for captions</Text>
        <Text tone="subtle">Subtle, even quieter</Text>
        <Text tone="primary">Primary accent</Text>
        <Text tone="danger">Danger, for errors</Text>
      </div>
    ),
  },
  {
    title: "Weights",
    description: "Font-weight tokens to vary emphasis.",
    code: `<Text>Regular weight</Text>
<Text weight="medium">Medium weight</Text>
<Text weight="semibold">Semibold weight</Text>
<Text weight="bold">Bold weight</Text>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Text>Regular weight</Text>
        <Text weight="medium">Medium weight</Text>
        <Text weight="semibold">Semibold weight</Text>
        <Text weight="bold">Bold weight</Text>
      </div>
    ),
  },
  {
    title: "Inline with custom tag",
    description: "Render as a <span> to flow inside other text.",
    code: `<Text as="span">
  The total is <Text as="span" weight="semibold" tone="primary">$1,240</Text> due today.
</Text>`,
    render: () => (
      <Text as="span">
        The total is{" "}
        <Text as="span" weight="semibold" tone="primary">
          $1,240
        </Text>{" "}
        due today.
      </Text>
    ),
  },
  {
    title: "Alignment",
    description: "Control horizontal text alignment within a block.",
    code: `<Text align="center">Centered lead paragraph for a hero or empty state.</Text>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Text align="center">
          Centered lead paragraph for a hero or empty state.
        </Text>
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Text prop in one place — the as tag, size, tone, weight, and align on a block paragraph, plus the as=\"a\" link form which is the only context where href, target, and rel apply (href is scheme-sanitized). Text has no internal state, so no controlled value/callback props.",
    code: `<Text
  as="p"            // any intrinsic tag: "span", "p", "a", "label", …
  size="lg"         // xs | sm | base | lg | xl
  tone="primary"    // default | muted | subtle | primary | success | warning | danger | info | neutral
  weight="semibold" // medium | semibold | bold
  align="start"     // any CSS text-align value
>
  A lead paragraph styled with every block-level Text prop.
</Text>

{/* href, target, rel only apply when as="a" (href is scheme-sanitized): */}
<Text
  as="a"
  href="/docs"
  target="_blank"
  rel="noopener noreferrer"
  size="base"
  tone="primary"
  weight="medium"
>
  Read the docs
</Text>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Text as="p" size="lg" tone="primary" weight="semibold" align="start">
          A lead paragraph styled with every block-level Text prop.
        </Text>
        <Text
          as="a"
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          size="base"
          tone="primary"
          weight="medium"
        >
          Read the docs
        </Text>
      </div>
    ),
  },
];

export default variations;
