import React from "react";
import { Switch } from "twico-ui";

function SwitchAllProps() {
  const [on, setOn] = React.useState(true);
  return (
    <Switch
      label="Two-factor authentication"
      description="Require a one-time code at every sign-in"
      tone="success"
      size="lg"
      checked={on}
      onChange={(e) => setOn(e.target.checked)}
      required
      disabled={false}
      aria-label="Two-factor authentication"
    />
  );
}

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
  {
    title: "All props",
    description:
      "Every Switch-specific prop in one place — label, description, tone, size, the controlled checked + onChange pair (or defaultChecked for the uncontrolled form), required, and disabled. The error prop is shown separately below; when set it replaces the description tint, paints the track red, and wires aria-invalid/aria-describedby.",
    code: `const [on, setOn] = React.useState(true);

<Switch
  label="Two-factor authentication"
  description="Require a one-time code at every sign-in"
  tone="success"           // primary | success | warning | danger | info | neutral
  size="lg"                // sm | md | lg
  checked={on}             // or defaultChecked for uncontrolled
  onChange={(e) => setOn(e.target.checked)}
  required
  disabled={false}
  aria-label="Two-factor authentication"
/>

// error replaces description, reddens the track, and wires aria-invalid:
<Switch
  label="Accept terms"
  error="You must accept the terms to continue"
  defaultChecked={false}
/>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SwitchAllProps />
        <Switch
          label="Accept terms"
          error="You must accept the terms to continue"
          defaultChecked={false}
        />
      </div>
    ),
  },
];

export default variations;
