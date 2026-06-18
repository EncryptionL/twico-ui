import React from "react";
import { Rating } from "twico-ui";

function ControlledRating() {
  const [value, setValue] = React.useState(3);
  return <Rating value={value} onChange={setValue} showValue />;
}

function RatingAllProps() {
  const [value, setValue] = React.useState(4);
  return (
    <Rating
      value={value}                 // controlled value (0…count)
      // defaultValue={4}           // or defaultValue for uncontrolled
      onChange={setValue}           // fires with the new value (0 clears)
      count={5}
      size="md"                     // sm | md | lg
      tone="warning"                // primary | success | warning | danger | info | neutral
      color="#f59e0b"               // overrides `tone` when set
      readOnly={false}
      disabled={false}
      showValue
    />
  );
}

const variations = [
  {
    title: "Sizes",
    description: "Three star sizes: small, medium, and large.",
    code: `<Rating defaultValue={3} size="sm" />
<Rating defaultValue={3} size="md" />
<Rating defaultValue={3} size="lg" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <Rating defaultValue={3} size="sm" />
        <Rating defaultValue={3} size="md" />
        <Rating defaultValue={3} size="lg" />
      </div>
    ),
  },
  {
    title: "Read-only with value",
    description: "Display-only stars that show the numeric score and can't be changed.",
    code: `<Rating value={4} readOnly showValue />
<Rating value={5} readOnly showValue />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <Rating value={4} readOnly showValue />
        <Rating value={5} readOnly showValue />
      </div>
    ),
  },
  {
    title: "Custom star count",
    description: "Use any number of stars with the count prop.",
    code: `<Rating defaultValue={2} count={3} />
<Rating defaultValue={7} count={10} showValue />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <Rating defaultValue={2} count={3} />
        <Rating defaultValue={7} count={10} showValue />
      </div>
    ),
  },
  {
    title: "Custom color",
    description: "Override the filled-star color with any CSS value.",
    code: `<Rating defaultValue={4} color="#ef4444" />
<Rating defaultValue={4} color="#3b82f6" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <Rating defaultValue={4} color="#ef4444" />
        <Rating defaultValue={4} color="#3b82f6" />
      </div>
    ),
  },
  {
    title: "Controlled",
    description: "Drive the value from state. Click the current star again to clear to 0.",
    code: `const [value, setValue] = React.useState(3);

<Rating value={value} onChange={setValue} showValue />`,
    render: () => <ControlledRating />,
  },
  {
    title: "Tones",
    description: "Color the filled stars by intent with the tone prop (default is warning/gold).",
    code: `<Rating defaultValue={4} tone="primary" readOnly />
<Rating defaultValue={4} tone="success" readOnly />
<Rating defaultValue={4} tone="warning" readOnly />
<Rating defaultValue={4} tone="danger" readOnly />
<Rating defaultValue={4} tone="info" readOnly />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <Rating defaultValue={4} tone="primary" readOnly />
        <Rating defaultValue={4} tone="success" readOnly />
        <Rating defaultValue={4} tone="warning" readOnly />
        <Rating defaultValue={4} tone="danger" readOnly />
        <Rating defaultValue={4} tone="info" readOnly />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every Rating-specific prop in one place. Controlled via value/onChange; color overrides tone; readOnly and disabled are off so it stays interactive.",
    code: `const [value, setValue] = React.useState(4);

<Rating
  value={value}                 // controlled value (0…count)
  // defaultValue={4}           // or defaultValue for uncontrolled
  onChange={setValue}           // fires with the new value (0 clears)
  count={5}
  size="md"                     // sm | md | lg
  tone="warning"                // primary | success | warning | danger | info | neutral
  color="#f59e0b"               // overrides \`tone\` when set
  readOnly={false}
  disabled={false}
  showValue
/>`,
    render: () => <RatingAllProps />,
  },
];

export default variations;
