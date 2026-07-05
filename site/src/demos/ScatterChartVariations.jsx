import React from "react";
import { ScatterChart } from "twico-ui";

const singleSeries = [
  {
    name: "Samples",
    points: [
      { x: 12, y: 30 },
      { x: 20, y: 45, label: "peak" },
      { x: 28, y: 38 },
      { x: 34, y: 52 },
      { x: 41, y: 47 },
      { x: 48, y: 60 },
    ],
  },
];

const twoSeries = [
  {
    name: "Control",
    points: [
      { x: 12, y: 30 },
      { x: 20, y: 45 },
      { x: 28, y: 38 },
      { x: 34, y: 55 },
      { x: 41, y: 49 },
    ],
  },
  {
    name: "Treatment",
    points: [
      { x: 15, y: 22 },
      { x: 24, y: 28 },
      { x: 30, y: 34 },
      { x: 38, y: 31 },
      { x: 46, y: 40 },
    ],
  },
];

const bubbleSeries = [
  {
    name: "Markets",
    points: [
      { x: 40, y: 12, z: 900, label: "US" },
      { x: 22, y: 30, z: 400, label: "EU" },
      { x: 55, y: 20, z: 650, label: "APAC" },
      { x: 30, y: 42, z: 250, label: "LATAM" },
    ],
  },
];

const variations = [
  {
    title: "Single series",
    description: "A basic scatter plot of x/y points with axis titles.",
    code: `<ScatterChart
  xLabel="Weight (kg)"
  yLabel="Score"
  series={[
    {
      name: "Samples",
      points: [
        { x: 12, y: 30 },
        { x: 20, y: 45, label: "peak" },
        { x: 28, y: 38 },
        { x: 34, y: 52 },
        { x: 41, y: 47 },
        { x: 48, y: 60 },
      ],
    },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <ScatterChart series={singleSeries} xLabel="Weight (kg)" yLabel="Score" />
      </div>
    ),
  },
  {
    title: "Multiple series with legend",
    description:
      "Two series plotted together; the legend shows automatically for more than one series.",
    code: `<ScatterChart
  xLabel="Dose"
  yLabel="Response"
  series={[
    {
      name: "Control",
      points: [
        { x: 12, y: 30 },
        { x: 20, y: 45 },
        { x: 28, y: 38 },
        { x: 34, y: 55 },
        { x: 41, y: 49 },
      ],
    },
    {
      name: "Treatment",
      points: [
        { x: 15, y: 22 },
        { x: 24, y: 28 },
        { x: 30, y: 34 },
        { x: 38, y: 31 },
        { x: 46, y: 40 },
      ],
    },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <ScatterChart series={twoSeries} xLabel="Dose" yLabel="Response" />
      </div>
    ),
  },
  {
    title: "Bubble chart",
    description:
      "Give points a numeric z to size the dots by a third dimension; maxBubble caps the radius.",
    code: `<ScatterChart
  maxBubble={32}
  xLabel="Reach"
  yLabel="Growth"
  valueFormat={(v) => v.toLocaleString()}
  series={[
    {
      name: "Markets",
      points: [
        { x: 40, y: 12, z: 900, label: "US" },
        { x: 22, y: 30, z: 400, label: "EU" },
        { x: 55, y: 20, z: 650, label: "APAC" },
        { x: 30, y: 42, z: 250, label: "LATAM" },
      ],
    },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <ScatterChart
          series={bubbleSeries}
          maxBubble={32}
          xLabel="Reach"
          yLabel="Growth"
          valueFormat={(v) => v.toLocaleString()}
        />
      </div>
    ),
  },
  {
    title: "Custom colors, no grid",
    description:
      "Per-series colors, a taller canvas, a hidden grid, and a custom accessible name.",
    code: `<ScatterChart
  height={340}
  showGrid={false}
  dotRadius={6}
  ariaLabel="Control vs treatment response by dose"
  series={[
    { name: "Control", color: "#6366f1", points: [
      { x: 12, y: 30 }, { x: 20, y: 45 }, { x: 28, y: 38 },
      { x: 34, y: 55 }, { x: 41, y: 49 },
    ] },
    { name: "Treatment", color: "#10b981", points: [
      { x: 15, y: 22 }, { x: 24, y: 28 }, { x: 30, y: 34 },
      { x: 38, y: 31 }, { x: 46, y: 40 },
    ] },
  ]}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <ScatterChart
          height={340}
          showGrid={false}
          dotRadius={6}
          ariaLabel="Control vs treatment response by dose"
          series={[
            { ...twoSeries[0], color: "#6366f1" },
            { ...twoSeries[1], color: "#10b981" },
          ]}
        />
      </div>
    ),
  },
];

export default variations;
