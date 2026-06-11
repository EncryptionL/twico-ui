import React from "react";
import { Progress } from "twico-ui";

const variations = [
  {
    title: "Tones",
    description: "Four semantic colors for different states of completion.",
    code: `<Progress value={64} tone="primary" />
<Progress value={90} tone="success" />
<Progress value={45} tone="warning" />
<Progress value={25} tone="danger" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 340, maxWidth: "100%" }}>
        <Progress value={64} tone="primary" />
        <Progress value={90} tone="success" />
        <Progress value={45} tone="warning" />
        <Progress value={25} tone="danger" />
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "Three track heights, from subtle to prominent.",
    code: `<Progress value={60} size="sm" />
<Progress value={60} size="md" />
<Progress value={60} size="lg" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 340, maxWidth: "100%" }}>
        <Progress value={60} size="sm" />
        <Progress value={60} size="md" />
        <Progress value={60} size="lg" />
      </div>
    ),
  },
  {
    title: "With label",
    description: "Shows a rounded percentage above the bar.",
    code: `<Progress value={72} showLabel />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Progress value={72} showLabel />
      </div>
    ),
  },
  {
    title: "Custom max",
    description: "Percentage is derived from value against a non-100 max.",
    code: `<Progress value={3} max={5} showLabel tone="success" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Progress value={3} max={5} showLabel tone="success" />
      </div>
    ),
  },
  {
    title: "Indeterminate",
    description: "Animates continuously when progress can't be measured.",
    code: `<Progress indeterminate />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Progress indeterminate />
      </div>
    ),
  },
];

export default variations;
