import React from "react";
import { Accordion } from "twico-ui";

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>
);

const faq = [
  { value: "a", label: "Is Twico UI free?", content: "Yes — MIT licensed, forever." },
  { value: "b", label: "Does it support dark mode?", content: "Out of the box." },
  { value: "c", label: "Can I open multiple panels?", content: "Set the multiple prop to true." },
];

const variations = [
  {
    title: "Single (default)",
    description: "Only one panel can be open at a time — opening one closes the others.",
    code: `<Accordion
  items={[
    { value: "a", label: "Is Twico UI free?", content: "Yes — MIT licensed, forever." },
    { value: "b", label: "Does it support dark mode?", content: "Out of the box." },
    { value: "c", label: "Can I open multiple panels?", content: "Set the multiple prop to true." },
  ]}
/>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Accordion items={faq} />
      </div>
    ),
  },
  {
    title: "Multiple open",
    description: "With multiple, any number of panels can stay expanded simultaneously.",
    code: `<Accordion
  multiple
  items={[
    { value: "a", label: "Is Twico UI free?", content: "Yes — MIT licensed, forever." },
    { value: "b", label: "Does it support dark mode?", content: "Out of the box." },
    { value: "c", label: "Can I open multiple panels?", content: "Set the multiple prop to true." },
  ]}
/>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Accordion multiple items={faq} />
      </div>
    ),
  },
  {
    title: "Open on first render",
    description: "Use defaultOpen to expand chosen panels uncontrolled when the accordion mounts.",
    code: `<Accordion
  multiple
  defaultOpen={["a", "c"]}
  items={[
    { value: "a", label: "Is Twico UI free?", content: "Yes — MIT licensed, forever." },
    { value: "b", label: "Does it support dark mode?", content: "Out of the box." },
    { value: "c", label: "Can I open multiple panels?", content: "Set the multiple prop to true." },
  ]}
/>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Accordion multiple defaultOpen={["a", "c"]} items={faq} />
      </div>
    ),
  },
  {
    title: "With icons",
    description: "Each item can carry an optional icon rendered before its label.",
    code: `<Accordion
  defaultOpen={["help"]}
  items={[
    { value: "help", label: "Getting started", content: "Install with npm and import the component you need.", icon: <HelpIcon /> },
    { value: "security", label: "Security", content: "No CDNs, SSR-safe, zero runtime dependencies.", icon: <ShieldIcon /> },
    { value: "motion", label: "Motion & polish", content: "Smooth height animation with token-driven easing.", icon: <SparkleIcon /> },
  ]}
/>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Accordion
          defaultOpen={["help"]}
          items={[
            { value: "help", label: "Getting started", content: "Install with npm and import the component you need.", icon: <HelpIcon /> },
            { value: "security", label: "Security", content: "No CDNs, SSR-safe, zero runtime dependencies.", icon: <ShieldIcon /> },
            { value: "motion", label: "Motion & polish", content: "Smooth height animation with token-driven easing.", icon: <SparkleIcon /> },
          ]}
        />
      </div>
    ),
  },
];

export default variations;
