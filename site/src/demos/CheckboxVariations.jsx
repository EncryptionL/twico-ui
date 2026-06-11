import React from "react";
import { Checkbox } from "twico-ui";

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
];

export default variations;
