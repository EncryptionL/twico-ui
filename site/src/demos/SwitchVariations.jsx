import React from "react";
import { Switch } from "twico-ui";

const variations = [
  {
    title: "Basic",
    description: "A simple labeled toggle. Off by default, on when defaultChecked.",
    code: `<Switch label="Wi-Fi" />
<Switch label="Bluetooth" defaultChecked />`,
    render: () => (
      <>
        <Switch label="Wi-Fi" />
        <Switch label="Bluetooth" defaultChecked />
      </>
    ),
  },
  {
    title: "With description",
    description: "Add a secondary line of helper text beneath the label.",
    code: `<Switch
  label="Email notifications"
  description="Send me product updates"
  defaultChecked
/>`,
    render: () => (
      <Switch
        label="Email notifications"
        description="Send me product updates"
        defaultChecked
      />
    ),
  },
  {
    title: "Sizes",
    code: `<Switch label="Compact" size="sm" defaultChecked />
<Switch label="Medium" size="md" defaultChecked />`,
    render: () => (
      <>
        <Switch label="Compact" size="sm" defaultChecked />
        <Switch label="Medium" size="md" defaultChecked />
      </>
    ),
  },
  {
    title: "Disabled",
    description: "Non-interactive, in both off and on states.",
    code: `<Switch label="Beta features" disabled />
<Switch label="Auto-sync" defaultChecked disabled />`,
    render: () => (
      <>
        <Switch label="Beta features" disabled />
        <Switch label="Auto-sync" defaultChecked disabled />
      </>
    ),
  },
  {
    title: "Without label",
    description: "A bare toggle for use inside custom layouts; pass aria-label for a11y.",
    code: `<Switch aria-label="Toggle dark mode" defaultChecked />`,
    render: () => <Switch aria-label="Toggle dark mode" defaultChecked />,
  },
  {
    title: "Tones",
    description: "Recolor the ON track with any of the six semantic intents.",
    code: `<Switch tone="success" label="Success" defaultChecked />
<Switch tone="danger" label="Danger" defaultChecked />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Switch tone="primary" label="Primary" defaultChecked />
        <Switch tone="success" label="Success" defaultChecked />
        <Switch tone="warning" label="Warning" defaultChecked />
        <Switch tone="danger" label="Danger" defaultChecked />
        <Switch tone="info" label="Info" defaultChecked />
      </div>
    ),
  },
];

export default variations;
