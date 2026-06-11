import React from "react";
import { Heading } from "twico-ui";

const variations = [
  {
    title: "Levels",
    description: "level 1–6 sets both the semantic tag (h1–h6) and the default size.",
    code: `<Heading level={1}>Heading level 1</Heading>
<Heading level={2}>Heading level 2</Heading>
<Heading level={3}>Heading level 3</Heading>
<Heading level={4}>Heading level 4</Heading>
<Heading level={5}>Heading level 5</Heading>
<Heading level={6}>Heading level 6</Heading>`,
    render: () => (
      <div style={{ display: "grid", gap: 8, textAlign: "left" }}>
        <Heading level={1}>Heading level 1</Heading>
        <Heading level={2}>Heading level 2</Heading>
        <Heading level={3}>Heading level 3</Heading>
        <Heading level={4}>Heading level 4</Heading>
        <Heading level={5}>Heading level 5</Heading>
        <Heading level={6}>Heading level 6</Heading>
      </div>
    ),
  },
  {
    title: "Custom size",
    description: "Override the font-size token suffix independently of the level.",
    code: `<Heading level={2} size="3xl">Big heading</Heading>
<Heading level={2} size="lg">Smaller heading</Heading>
<Heading level={2} size="sm">Tiny heading</Heading>`,
    render: () => (
      <div style={{ display: "grid", gap: 8, textAlign: "left" }}>
        <Heading level={2} size="3xl">Big heading</Heading>
        <Heading level={2} size="lg">Smaller heading</Heading>
        <Heading level={2} size="sm">Tiny heading</Heading>
      </div>
    ),
  },
  {
    title: "Semantic override",
    description: "Keep an h1 for document structure while rendering it at a smaller visual size with `as` + `size`.",
    code: `<Heading as="h1" size="lg">Looks small, still an h1</Heading>`,
    render: () => (
      <Heading as="h1" size="lg">Looks small, still an h1</Heading>
    ),
  },
  {
    title: "Alignment",
    description: "Use `align` to control text alignment.",
    code: `<Heading level={3} align="left">Left aligned</Heading>
<Heading level={3} align="center">Center aligned</Heading>
<Heading level={3} align="right">Right aligned</Heading>`,
    render: () => (
      <div style={{ display: "grid", gap: 8, width: 340, maxWidth: "100%" }}>
        <Heading level={3} align="left">Left aligned</Heading>
        <Heading level={3} align="center">Center aligned</Heading>
        <Heading level={3} align="right">Right aligned</Heading>
      </div>
    ),
  },
];

export default variations;
