import React from "react";
import { Radio } from "twico-ui";

const variations = [
  {
    title: "Grouped",
    description: "Share a name to make the radios mutually exclusive.",
    code: `<Radio name="plan" value="free" label="Free" defaultChecked />
<Radio name="plan" value="pro" label="Pro" />
<Radio name="plan" value="team" label="Team" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio name="plan" value="free" label="Free" defaultChecked />
        <Radio name="plan" value="pro" label="Pro" />
        <Radio name="plan" value="team" label="Team" />
      </div>
    ),
  },
  {
    title: "With descriptions",
    description: "An optional description line under each label.",
    code: `<Radio name="tier" value="free" label="Free" description="For personal projects" defaultChecked />
<Radio name="tier" value="pro" label="Pro" description="$12 / month" />
<Radio name="tier" value="team" label="Team" description="$30 / month" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio name="tier" value="free" label="Free" description="For personal projects" defaultChecked />
        <Radio name="tier" value="pro" label="Pro" description="$12 / month" />
        <Radio name="tier" value="team" label="Team" description="$30 / month" />
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "Two sizes for tighter or roomier layouts.",
    code: `<Radio name="size-sm" value="a" label="Small" size="sm" defaultChecked />
<Radio name="size-md" value="a" label="Medium" size="md" defaultChecked />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio name="size-sm" value="a" label="Small" size="sm" defaultChecked />
        <Radio name="size-md" value="a" label="Medium" size="md" defaultChecked />
      </div>
    ),
  },
  {
    title: "Disabled",
    description: "Non-interactive, including a disabled-checked state.",
    code: `<Radio name="disabled" value="on" label="Disabled checked" defaultChecked disabled />
<Radio name="disabled" value="off" label="Disabled" disabled />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio name="disabled" value="on" label="Disabled checked" defaultChecked disabled />
        <Radio name="disabled" value="off" label="Disabled" disabled />
      </div>
    ),
  },
  {
    title: "Tones",
    description: "Color intents. Each radio uses its own name so all stay selected and show their accent.",
    code: `<Radio name="tone-primary" value="a" label="Primary" tone="primary" defaultChecked />
<Radio name="tone-success" value="a" label="Success" tone="success" defaultChecked />
<Radio name="tone-warning" value="a" label="Warning" tone="warning" defaultChecked />
<Radio name="tone-danger" value="a" label="Danger" tone="danger" defaultChecked />
<Radio name="tone-info" value="a" label="Info" tone="info" defaultChecked />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio name="tone-primary" value="a" label="Primary" tone="primary" defaultChecked />
        <Radio name="tone-success" value="a" label="Success" tone="success" defaultChecked />
        <Radio name="tone-warning" value="a" label="Warning" tone="warning" defaultChecked />
        <Radio name="tone-danger" value="a" label="Danger" tone="danger" defaultChecked />
        <Radio name="tone-info" value="a" label="Info" tone="info" defaultChecked />
      </div>
    ),
  },
];

export default variations;
