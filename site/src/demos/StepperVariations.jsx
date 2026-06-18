import React from "react";
import { Stepper } from "twico-ui";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
const CardIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
);

const baseSteps = [
  { title: "Account", description: "Your details" },
  { title: "Payment", description: "Billing info" },
  { title: "Confirm", description: "Review order" },
];

function ClickableExample() {
  const [active, setActive] = React.useState(1);
  return (
    <Stepper active={active} clickable onStepClick={setActive} steps={baseSteps} />
  );
}

const allPropsSteps = [
  { title: "Account", description: "Your details", icon: <UserIcon /> },
  { title: "Payment", description: "Card declined", icon: <CardIcon />, error: true },
  { title: "Confirm", description: "Review order", icon: <CheckCircleIcon /> },
];

function StepperAllProps() {
  const [active, setActive] = React.useState(2);
  return (
    <Stepper
      steps={allPropsSteps}
      active={active}                 // controlled index — or defaultActive for uncontrolled
      orientation="horizontal"        // horizontal | vertical
      tone="info"                     // primary | success | warning | danger | info | neutral
      clickable={true}
      onStepClick={setActive}
    />
  );
}

const variations = [
  {
    title: "Horizontal",
    description: "Completed steps show a check, the active step is ringed, later steps are muted.",
    code: `<Stepper
  active={1}
  steps={[
    { title: "Account", description: "Your details" },
    { title: "Payment", description: "Billing info" },
    { title: "Confirm", description: "Review order" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Stepper active={1} steps={baseSteps} />
      </div>
    ),
  },
  {
    title: "Vertical",
    description: "Same states stacked top-to-bottom for sidebars and forms.",
    code: `<Stepper
  orientation="vertical"
  active={2}
  steps={[
    { title: "Account", description: "Your details" },
    { title: "Payment", description: "Billing info" },
    { title: "Confirm", description: "Review order" },
  ]}
/>`,
    render: () => (
      <Stepper orientation="vertical" active={2} steps={baseSteps} />
    ),
  },
  {
    title: "Clickable",
    description: "Allow jumping back to completed or active steps via onStepClick.",
    code: `function ClickableExample() {
  const [active, setActive] = React.useState(1);
  return (
    <Stepper
      active={active}
      clickable
      onStepClick={setActive}
      steps={steps}
    />
  );
}`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <ClickableExample />
      </div>
    ),
  },
  {
    title: "Custom icons",
    description: "Replace the step number with any node via the step's icon field.",
    code: `<Stepper
  active={1}
  steps={[
    { title: "Account", icon: <UserIcon /> },
    { title: "Payment", icon: <CardIcon /> },
    { title: "Confirm", icon: <CheckCircleIcon /> },
  ]}
/>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Stepper
          active={1}
          steps={[
            { title: "Account", icon: <UserIcon /> },
            { title: "Payment", icon: <CardIcon /> },
            { title: "Confirm", icon: <CheckCircleIcon /> },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Error state",
    description: "Mark a step as errored to surface a failed or invalid step.",
    code: `<Stepper
  active={2}
  steps={[
    { title: "Account", description: "Your details" },
    { title: "Payment", description: "Card declined", error: true },
    { title: "Confirm", description: "Review order" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Stepper
          active={2}
          steps={[
            { title: "Account", description: "Your details" },
            { title: "Payment", description: "Card declined", error: true },
            { title: "Confirm", description: "Review order" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Tones",
    description: "Set tone to color the completed markers, active ring, and connector with a semantic intent.",
    code: `<Stepper tone="primary" active={1} steps={steps} />
<Stepper tone="success" active={1} steps={steps} />
<Stepper tone="warning" active={1} steps={steps} />
<Stepper tone="danger" active={1} steps={steps} />
<Stepper tone="info" active={1} steps={steps} />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 480, maxWidth: "100%" }}>
        {(/** @type {("primary" | "success" | "warning" | "danger" | "info")[]} */ (["primary", "success", "warning", "danger", "info"])).map((tone) => (
          <Stepper key={tone} tone={tone} active={1} steps={baseSteps} />
        ))}
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Stepper prop in one place — the steps array (each step's title, description, icon and error flag), the controlled active index paired with onStepClick (use defaultActive instead for the uncontrolled form), orientation, semantic tone, and the clickable flag that lets users jump back to completed/active steps.",
    code: `const steps = [
  { title: "Account", description: "Your details", icon: <UserIcon /> },
  { title: "Payment", description: "Card declined", icon: <CardIcon />, error: true },
  { title: "Confirm", description: "Review order", icon: <CheckCircleIcon /> },
];

function StepperAllProps() {
  const [active, setActive] = React.useState(2);
  return (
    <Stepper
      steps={steps}
      active={active}                 // controlled index — or defaultActive for uncontrolled
      orientation="horizontal"        // horizontal | vertical
      tone="info"                     // primary | success | warning | danger | info | neutral
      clickable={true}
      onStepClick={setActive}
    />
  );
}`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <StepperAllProps />
      </div>
    ),
  },
];

export default variations;
