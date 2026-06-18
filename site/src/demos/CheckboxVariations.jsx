import React from "react";
import { Checkbox } from "twico-ui";

function CheckboxAllProps() {
  const [checked, setChecked] = React.useState(true);
  return (
    <Checkbox
      label="Email notifications"
      description="Get a summary of new activity every morning"
      indeterminate={false}
      size="md"                    // sm | md | lg
      tone="success"               // primary | success | warning | danger | info | neutral
      checked={checked}            // or defaultChecked for uncontrolled
      onChange={(e) => setChecked(e.target.checked)}
      required={false}
      disabled={false}
      error={undefined}            // a string here replaces nothing — it adds a red message below + tints the box
    />
  );
}

const variations = [
  {
    title: "Basic states",
    description: "Unchecked, checked, and the mixed (indeterminate) dash.",
    code: `<Checkbox label="Unchecked" />
<Checkbox label="Checked" defaultChecked />
<Checkbox label="Indeterminate" indeterminate />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
      </div>
    ),
  },
  {
    title: "With description",
    description: "A secondary line of helper text under the label.",
    code: `<Checkbox
  label="Notifications"
  description="Get email alerts for new activity"
  defaultChecked
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Checkbox
          label="Notifications"
          description="Get email alerts for new activity"
          defaultChecked
        />
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "Two sizes for dense or comfortable layouts.",
    code: `<Checkbox size="sm" label="Small" defaultChecked />
<Checkbox size="md" label="Medium" defaultChecked />`,
    render: () => (
      <>
        <Checkbox size="sm" label="Small" defaultChecked />
        <Checkbox size="md" label="Medium" defaultChecked />
      </>
    ),
  },
  {
    title: "Disabled",
    description: "Non-interactive, in both unchecked and checked states.",
    code: `<Checkbox label="Disabled" disabled />
<Checkbox label="Disabled checked" defaultChecked disabled />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" defaultChecked disabled />
      </div>
    ),
  },
  {
    title: "Tones",
    description: "Recolor the checked state with any of the six semantic intents.",
    code: `<Checkbox tone="success" label="Success" defaultChecked />
<Checkbox tone="danger" label="Danger" defaultChecked />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Checkbox tone="primary" label="Primary" defaultChecked />
        <Checkbox tone="success" label="Success" defaultChecked />
        <Checkbox tone="warning" label="Warning" defaultChecked />
        <Checkbox tone="danger" label="Danger" defaultChecked />
        <Checkbox tone="info" label="Info" defaultChecked />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Checkbox-specific prop in one place: label, description, indeterminate, size, tone, the controlled checked + onChange pair, required, disabled, and error.",
    code: `const [checked, setChecked] = React.useState(true);

<Checkbox
  label="Email notifications"
  description="Get a summary of new activity every morning"
  indeterminate={false}
  size="md"                    // sm | md | lg
  tone="success"               // primary | success | warning | danger | info | neutral
  checked={checked}            // or defaultChecked for uncontrolled
  onChange={(e) => setChecked(e.target.checked)}
  required={false}
  disabled={false}
  error={undefined}            // pass a string to show a red message below + tint the box
/>`,
    render: () => <CheckboxAllProps />,
  },
];

export default variations;
