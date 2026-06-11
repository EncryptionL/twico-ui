import React from "react";
import { Button } from "twico-ui";

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);

const variations = [
  {
    title: "Variants",
    description: "Five visual styles, from highest to lowest emphasis.",
    code: `<Button>Solid</Button>
<Button variant="soft">Soft</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
    render: () => (
      <>
        <Button>Solid</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </>
    ),
  },
  {
    title: "Sizes",
    code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
    render: () => (
      <>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </>
    ),
  },
  {
    title: "With icons",
    code: `<Button leftIcon={<PlusIcon />}>Add item</Button>
<Button variant="soft" leftIcon={<PlusIcon />}>New</Button>`,
    render: () => (
      <>
        <Button leftIcon={<PlusIcon />}>Add item</Button>
        <Button variant="soft" leftIcon={<PlusIcon />}>New</Button>
      </>
    ),
  },
  {
    title: "Loading",
    description: "Shows a spinner and blocks clicks while busy.",
    code: `<Button loading>Saving…</Button>
<Button variant="soft" loading>Loading</Button>`,
    render: () => (
      <>
        <Button loading>Saving…</Button>
        <Button variant="soft" loading>Loading</Button>
      </>
    ),
  },
  {
    title: "Disabled",
    code: `<Button disabled>Disabled</Button>
<Button variant="outline" disabled>Disabled</Button>`,
    render: () => (
      <>
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled</Button>
      </>
    ),
  },
  {
    title: "Full width",
    code: `<Button fullWidth>Continue</Button>`,
    render: () => (
      <div style={{ width: 320, maxWidth: "100%" }}>
        <Button fullWidth>Continue</Button>
      </div>
    ),
  },
];

export default variations;
