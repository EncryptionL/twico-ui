import React from "react";
import { Radio } from "twico-ui";

function RadioAllProps() {
  const [value, setValue] = React.useState("pro");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Radio
        name="all-props"
        value="free"
        label="Free"
        description="For personal projects"
        size="md"
        tone="primary"
        required
        disabled={false}
        checked={value === "free"}
        onChange={(e) => setValue(e.target.value)}
      />
      <Radio
        name="all-props"
        value="pro"
        label="Pro"
        description="$12 / month"
        size="md"
        tone="primary"
        required
        disabled={false}
        checked={value === "pro"}
        onChange={(e) => setValue(e.target.value)}
        error="Please choose a different plan"
      />
    </div>
  );
}

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
  {
    title: "All props",
    description:
      "Every Radio-specific prop in one place: label, description, size, tone, required, disabled, the controlled value pair (name/value/checked/onChange) and error. The second radio shows error (which renders below and tints the dot red).",
    code: `const [value, setValue] = React.useState("pro");

<Radio
  name="all-props"
  value="free"
  label="Free"
  description="For personal projects"   // optional line under the label
  size="md"                             // sm | md | lg
  tone="primary"                        // primary | success | warning | danger | info | neutral
  required
  disabled={false}
  checked={value === "free"}            // or defaultChecked for uncontrolled
  onChange={(e) => setValue(e.target.value)}
/>
<Radio
  name="all-props"
  value="pro"
  label="Pro"
  description="$12 / month"
  size="md"
  tone="primary"
  required
  disabled={false}
  checked={value === "pro"}
  onChange={(e) => setValue(e.target.value)}
  error="Please choose a different plan" // replaces the description slot below
/>`,
    render: () => <RadioAllProps />,
  },
];

export default variations;
