import React from "react";
import { Slider } from "twico-ui";

const variations = [
  {
    title: "Basic",
    description: "A labeled slider with the value shown at the top-right.",
    code: `<Slider label="Volume" defaultValue={40} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Slider label="Volume" defaultValue={40} />
      </div>
    ),
  },
  {
    title: "Custom range & step",
    description: "Set min, max, and step for coarse-grained control.",
    code: `<Slider label="Brightness" min={0} max={200} step={10} defaultValue={120} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Slider label="Brightness" min={0} max={200} step={10} defaultValue={120} />
      </div>
    ),
  },
  {
    title: "With ticks",
    description: "Render step ticks along the rail for discrete values.",
    code: `<Slider label="Price" min={0} max={1000} step={250} showTicks defaultValue={500} formatValue={(v) => \`$\${v}\`} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Slider
          label="Price"
          min={0}
          max={1000}
          step={250}
          showTicks
          defaultValue={500}
          formatValue={(v) => `$${v}`}
        />
      </div>
    ),
  },
  {
    title: "Formatted value, hidden readout",
    description: "Format the value while hiding the top-right number with showValue={false}.",
    code: `<Slider label="Zoom" min={50} max={300} step={25} showValue={false} defaultValue={100} formatValue={(v) => \`\${v}%\`} />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Slider
          label="Zoom"
          min={50}
          max={300}
          step={25}
          showValue={false}
          defaultValue={100}
          formatValue={(v) => `${v}%`}
        />
      </div>
    ),
  },
  {
    title: "Disabled",
    code: `<Slider label="Locked" defaultValue={60} disabled />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Slider label="Locked" defaultValue={60} disabled />
      </div>
    ),
  },
  {
    title: "Tones",
    description: "Set tone to color the filled track and thumb with a semantic intent.",
    code: `<div style={{ display: "grid", gap: 20 }}>
  <Slider label="Primary" tone="primary" defaultValue={60} />
  <Slider label="Success" tone="success" defaultValue={60} />
  <Slider label="Warning" tone="warning" defaultValue={60} />
  <Slider label="Danger" tone="danger" defaultValue={60} />
  <Slider label="Info" tone="info" defaultValue={60} />
</div>`,
    render: () => (
      <div style={{ display: "grid", gap: 20, width: 340, maxWidth: "100%" }}>
        <Slider label="Primary" tone="primary" defaultValue={60} />
        <Slider label="Success" tone="success" defaultValue={60} />
        <Slider label="Warning" tone="warning" defaultValue={60} />
        <Slider label="Danger" tone="danger" defaultValue={60} />
        <Slider label="Info" tone="info" defaultValue={60} />
      </div>
    ),
  },
];

export default variations;
