import React from "react";
import { Spinner, Button } from "twico-ui";

const variations = [
  {
    title: "Sizes",
    description: "Four sizes, from small inline indicators to large page loaders.",
    code: `<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`,
    render: () => (
      <>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </>
    ),
  },
  {
    title: "Tones",
    description: "Color is themable. The default inherits currentColor; primary and neutral pick up design tokens.",
    code: `<Spinner tone="primary" size="lg" />
<Spinner tone="neutral" size="lg" />
<Spinner size="lg" />`,
    render: () => (
      <>
        <Spinner tone="primary" size="lg" />
        <Spinner tone="neutral" size="lg" />
        <Spinner size="lg" />
      </>
    ),
  },
  {
    title: "White on a colored surface",
    description: "Use tone=\"white\" when the spinner sits on a solid, colored background.",
    code: `<Spinner tone="white" size="lg" />`,
    render: () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 88,
          height: 88,
          borderRadius: "var(--radius-lg)",
          background: "var(--color-primary)",
        }}
      >
        <Spinner tone="white" size="lg" />
      </div>
    ),
  },
  {
    title: "Inside a button",
    description: "The spinner inherits the button's text color, so it stays visible by default.",
    code: `<Button leftIcon={<Spinner size="sm" />}>Saving…</Button>
<Button variant="soft" leftIcon={<Spinner size="sm" />}>Loading</Button>`,
    render: () => (
      <>
        <Button leftIcon={<Spinner size="sm" />}>Saving…</Button>
        <Button variant="soft" leftIcon={<Spinner size="sm" />}>Loading</Button>
      </>
    ),
  },
  {
    title: "Accessible label",
    description: "Set a descriptive label announced to screen readers via role=\"status\".",
    code: `<Spinner size="lg" tone="primary" label="Loading results" />`,
    render: () => (
      <Spinner size="lg" tone="primary" label="Loading results" />
    ),
  },
  {
    title: "All props",
    description: "Every Spinner prop in one place — size, color (the preferred name; tone is its deprecated alias and color wins when both are set), and an accessible label announced via role=\"status\".",
    code: `<Spinner
  size="lg"              // sm | md | lg | xl
  color="primary"       // current | primary | success | warning | danger | info | neutral | white
  // tone="primary"     // deprecated alias of color — color wins when both are set
  label="Loading results"
/>`,
    render: () => (
      <Spinner
        size="lg"
        color="primary"
        label="Loading results"
      />
    ),
  },
];

export default variations;
