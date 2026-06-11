import React from "react";
import { Divider, Text } from "twico-ui";

const variations = [
  {
    title: "Plain rule",
    description: "A thin horizontal line that separates stacked content.",
    code: `<Text>Section one</Text>
<Divider />
<Text>Section two</Text>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Text>Section one</Text>
        <Divider />
        <Text>Section two</Text>
      </div>
    ),
  },
  {
    title: "Labeled",
    description: "Pass children to render a centered label inside the rule.",
    code: `<Divider>OR</Divider>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Divider>OR</Divider>
      </div>
    ),
  },
  {
    title: "Label alignment",
    description: "Align the label to the left, center, or right.",
    code: `<Divider align="left">LEFT</Divider>
<Divider align="center">CENTER</Divider>
<Divider align="right">RIGHT</Divider>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Divider align="left">LEFT</Divider>
        <Divider align="center">CENTER</Divider>
        <Divider align="right">RIGHT</Divider>
      </div>
    ),
  },
  {
    title: "Inset",
    description: "Indent the start of a horizontal rule, e.g. to align with list content.",
    code: `<Divider inset />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Text>Indented separator</Text>
        <Divider inset />
        <Text>Next item</Text>
      </div>
    ),
  },
  {
    title: "Vertical",
    description: "A vertical rule for separating inline items in a row.",
    code: `<Text as="span">A</Text>
<Divider orientation="vertical" />
<Text as="span">B</Text>
<Divider orientation="vertical" />
<Text as="span">C</Text>`,
    render: () => (
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Text as="span">A</Text>
        <Divider orientation="vertical" />
        <Text as="span">B</Text>
        <Divider orientation="vertical" />
        <Text as="span">C</Text>
      </div>
    ),
  },
];

export default variations;
