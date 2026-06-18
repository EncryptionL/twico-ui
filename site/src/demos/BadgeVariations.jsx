import React from "react";
import { Badge } from "twico-ui";

const variations = [
  {
    title: "Tones",
    description: "Six semantic colors for status and meaning.",
    code: `<Badge tone="primary">Primary</Badge>
<Badge tone="success">Success</Badge>
<Badge tone="warning">Warning</Badge>
<Badge tone="danger">Danger</Badge>
<Badge tone="info">Info</Badge>
<Badge tone="neutral">Neutral</Badge>`,
    render: () => (
      <>
        <Badge tone="primary">Primary</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
        <Badge tone="info">Info</Badge>
        <Badge tone="neutral">Neutral</Badge>
      </>
    ),
  },
  {
    title: "Variants",
    description: "Three fill styles, from softest to most prominent.",
    code: `<Badge tone="success" variant="soft">Soft</Badge>
<Badge tone="success" variant="solid">Solid</Badge>
<Badge tone="success" variant="outline">Outline</Badge>`,
    render: () => (
      <>
        <Badge tone="success" variant="soft">Soft</Badge>
        <Badge tone="success" variant="solid">Solid</Badge>
        <Badge tone="success" variant="outline">Outline</Badge>
      </>
    ),
  },
  {
    title: "With dot",
    description: "A leading status dot for live or active states.",
    code: `<Badge tone="success" dot>Online</Badge>
<Badge tone="warning" dot>Away</Badge>
<Badge tone="neutral" dot>Offline</Badge>`,
    render: () => (
      <>
        <Badge tone="success" dot>Online</Badge>
        <Badge tone="warning" dot>Away</Badge>
        <Badge tone="neutral" dot>Offline</Badge>
      </>
    ),
  },
  {
    title: "Sizes",
    description: "Two sizes for inline labels and standalone counts.",
    code: `<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
<Badge tone="info" size="lg">12 new</Badge>`,
    render: () => (
      <>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
        <Badge tone="info" size="lg">12 new</Badge>
      </>
    ),
  },
  {
    title: "All props",
    description: "Every Badge-specific prop in one place: tone, variant, size, dot, and children.",
    code: `<Badge
  tone="success"      // primary | success | warning | danger | info | neutral
  variant="soft"      // soft | solid | outline
  size="lg"           // sm | md | lg
  dot                 // leading status dot
>
  Active
</Badge>`,
    render: () => (
      <>
        <Badge tone="success" variant="soft" size="lg" dot>
          Active
        </Badge>
      </>
    ),
  },
];

export default variations;
