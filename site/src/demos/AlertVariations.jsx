import React from "react";
import { Alert } from "twico-ui";

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>
);

function DismissibleExample() {
  const [open, setOpen] = React.useState(true);
  if (!open) return <Alert tone="info">Dismissed — nothing to see here.</Alert>;
  return (
    <Alert tone="success" title="Saved" onClose={() => setOpen(false)}>
      Your changes are live.
    </Alert>
  );
}

function AlertAllProps() {
  const [open, setOpen] = React.useState(true);
  if (!open) return <Alert tone="neutral">Dismissed — re-render the demo to bring it back.</Alert>;
  return (
    <Alert
      tone="primary"            // info | success | warning | danger | primary | neutral
      variant="soft"            // soft | solid | outline
      title="New feature available"
      icon={<SparkIcon />}      // overrides the default tone icon
      onClose={() => setOpen(false)} // shows the close button + handles dismissal
    >
      Try the redesigned dashboard — children render as the description.
    </Alert>
  );
}

const variations = [
  {
    title: "Tones",
    description: "Four semantic tones, each with its own color and default icon.",
    code: `<Alert tone="info" title="Heads up">A new version is available.</Alert>
<Alert tone="success" title="Saved">Your changes are live.</Alert>
<Alert tone="warning" title="Trial ending">Your trial ends in 3 days.</Alert>
<Alert tone="danger" title="Payment failed">We could not process your card.</Alert>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 360, maxWidth: "100%" }}>
        <Alert tone="info" title="Heads up">A new version is available.</Alert>
        <Alert tone="success" title="Saved">Your changes are live.</Alert>
        <Alert tone="warning" title="Trial ending">Your trial ends in 3 days.</Alert>
        <Alert tone="danger" title="Payment failed">We could not process your card.</Alert>
      </div>
    ),
  },
  {
    title: "Without a title",
    description: "Omit the title for a compact, single-line message.",
    code: `<Alert tone="warning">Your trial ends in 3 days.</Alert>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Alert tone="warning">Your trial ends in 3 days.</Alert>
      </div>
    ),
  },
  {
    title: "Dismissible",
    description: "Pass onClose to show a close button and handle dismissal.",
    code: `<Alert tone="success" title="Saved" onClose={() => setOpen(false)}>
  Your changes are live.
</Alert>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <DismissibleExample />
      </div>
    ),
  },
  {
    title: "Custom icon",
    description: "Override the default tone icon with your own SVG.",
    code: `<Alert tone="info" title="New feature" icon={<SparkIcon />}>
  Try the redesigned dashboard.
</Alert>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Alert tone="info" title="New feature" icon={<SparkIcon />}>
          Try the redesigned dashboard.
        </Alert>
      </div>
    ),
  },
  {
    title: "Fills",
    description: "Three variants — soft (default, tinted), solid (filled), and outline (border only).",
    code: `<Alert tone="success" variant="soft" title="Soft">Tinted background.</Alert>
<Alert tone="danger" variant="solid" title="Solid">Filled, high emphasis.</Alert>
<Alert tone="info" variant="outline" title="Outline">Border only.</Alert>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 380, maxWidth: "100%" }}>
        <Alert tone="success" variant="soft" title="Soft">Tinted background.</Alert>
        <Alert tone="danger" variant="solid" title="Solid">Filled, high emphasis.</Alert>
        <Alert tone="info" variant="outline" title="Outline">Border only.</Alert>
      </div>
    ),
  },
  {
    title: "All props",
    description: "Every Alert-specific prop in one place — tone, variant, title, a custom icon, children (the description), and onClose (which renders the dismiss button and handles dismissal). Set onClose to false-y / omit it to hide the close button.",
    code: `function AlertAllProps() {
  const [open, setOpen] = React.useState(true);
  if (!open) return <Alert tone="neutral">Dismissed — re-render the demo to bring it back.</Alert>;
  return (
    <Alert
      tone="primary"            // info | success | warning | danger | primary | neutral
      variant="soft"            // soft | solid | outline
      title="New feature available"
      icon={<SparkIcon />}      // overrides the default tone icon
      onClose={() => setOpen(false)} // shows the close button + handles dismissal
    >
      Try the redesigned dashboard — children render as the description.
    </Alert>
  );
}`,
    render: () => (
      <div style={{ width: 380, maxWidth: "100%" }}>
        <AlertAllProps />
      </div>
    ),
  },
];

export default variations;
