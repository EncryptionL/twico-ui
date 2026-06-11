import React from "react";
import { Rating } from "twico-ui";

function ControlledRating() {
  const [value, setValue] = React.useState(3);
  return <Rating value={value} onChange={setValue} showValue />;
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
];

export default variations;
