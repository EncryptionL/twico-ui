import React from "react";
import { Heatmap } from "twico-ui";

const activity = [
  { x: "9a", y: "Mon", value: 12 }, { x: "12p", y: "Mon", value: 48 }, { x: "3p", y: "Mon", value: 30 }, { x: "6p", y: "Mon", value: 18 },
  { x: "9a", y: "Tue", value: 20 }, { x: "12p", y: "Tue", value: 62 }, { x: "3p", y: "Tue", value: 41 }, { x: "6p", y: "Tue", value: 24 },
  { x: "9a", y: "Wed", value: 16 }, { x: "12p", y: "Wed", value: 55 }, { x: "3p", y: "Wed", value: 38 }, { x: "6p", y: "Wed", value: 22 },
  { x: "9a", y: "Thu", value: 28 }, { x: "12p", y: "Thu", value: 70 }, { x: "3p", y: "Thu", value: 52 }, { x: "6p", y: "Thu", value: 31 },
  { x: "9a", y: "Fri", value: 34 }, { x: "12p", y: "Fri", value: 58 }, { x: "3p", y: "Fri", value: 44 }, { x: "6p", y: "Fri", value: 26 },
];

const cohort = [
  { x: "W1", y: "Jan", value: 100 }, { x: "W2", y: "Jan", value: 68 }, { x: "W3", y: "Jan", value: 52 }, { x: "W4", y: "Jan", value: 44 },
  { x: "W1", y: "Feb", value: 100 }, { x: "W2", y: "Feb", value: 74 }, { x: "W3", y: "Feb", value: 61 }, { x: "W4", y: "Feb", value: 55 },
  { x: "W1", y: "Mar", value: 100 }, { x: "W2", y: "Mar", value: 71 }, { x: "W3", y: "Mar", value: 58 }, { x: "W4", y: "Mar", value: 49 },
];

const variations = [
  {
    title: "Default",
    description: "A matrix keyed by (x, y) with axis titles; cell shade tracks value intensity.",
    code: `<Heatmap
  xLabel="Hour"
  yLabel="Day"
  data={[
    { x: "9a", y: "Mon", value: 12 }, { x: "12p", y: "Mon", value: 48 }, { x: "3p", y: "Mon", value: 30 },
    { x: "9a", y: "Tue", value: 20 }, { x: "12p", y: "Tue", value: 62 }, { x: "3p", y: "Tue", value: 41 },
    { x: "9a", y: "Wed", value: 16 }, { x: "12p", y: "Wed", value: 55 }, { x: "3p", y: "Wed", value: 38 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Heatmap xLabel="Hour" yLabel="Day" data={activity} />
      </div>
    ),
  },
  {
    title: "Labeled cells with a custom color scale",
    description: "Print each value inside its cell and swap the high-end hue via colorScale.",
    code: `<Heatmap
  showValues
  colorScale="var(--emerald-500)"
  valueFormat={(v) => \`\${v}%\`}
  data={cells}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Heatmap
          showValues
          colorScale="var(--emerald-500)"
          valueFormat={(v) => `${v}%`}
          data={activity}
        />
      </div>
    ),
  },
  {
    title: "Fixed scale bounds",
    description: "Pin min/max so a cohort retention grid always shades against a 0–100 range.",
    code: `<Heatmap
  min={0}
  max={100}
  showValues
  xLabel="Week"
  valueFormat={(v) => \`\${v}%\`}
  data={[
    { x: "W1", y: "Jan", value: 100 }, { x: "W2", y: "Jan", value: 68 }, { x: "W3", y: "Jan", value: 52 }, { x: "W4", y: "Jan", value: 44 },
    { x: "W1", y: "Feb", value: 100 }, { x: "W2", y: "Feb", value: 74 }, { x: "W3", y: "Feb", value: 61 }, { x: "W4", y: "Feb", value: 55 },
    { x: "W1", y: "Mar", value: 100 }, { x: "W2", y: "Mar", value: 71 }, { x: "W3", y: "Mar", value: 58 }, { x: "W4", y: "Mar", value: 49 },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Heatmap
          min={0}
          max={100}
          showValues
          xLabel="Week"
          valueFormat={(v) => `${v}%`}
          data={cohort}
        />
      </div>
    ),
  },
  {
    title: "Compact, no legend",
    description: "Hide the scale legend and tighten the grid with a smaller height and no cell gap.",
    code: `<Heatmap
  height={180}
  cellGap={0}
  radius={0}
  showLegend={false}
  data={cells}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <Heatmap
          height={180}
          cellGap={0}
          radius={0}
          showLegend={false}
          data={activity}
        />
      </div>
    ),
  },
];

export default variations;
