import React from "react";
import { BubbleChart } from "twico-ui";

const plans = [
  {
    name: "Plans",
    points: [
      { x: 12, y: 40, z: 800, label: "Starter" },
      { x: 26, y: 65, z: 2400, label: "Team" },
      { x: 48, y: 82, z: 5200, label: "Business" },
      { x: 72, y: 91, z: 9600, label: "Enterprise" },
    ],
  },
];

const markets = [
  {
    name: "Americas",
    points: [
      { x: 40, y: 12, z: 900, label: "US" },
      { x: 18, y: 24, z: 320, label: "Brazil" },
      { x: 12, y: 30, z: 210, label: "Canada" },
    ],
  },
  {
    name: "EMEA",
    points: [
      { x: 22, y: 30, z: 400, label: "Germany" },
      { x: 30, y: 44, z: 650, label: "UK" },
      { x: 14, y: 52, z: 180, label: "Nigeria" },
    ],
  },
];

const variations = [
  {
    title: "Bubble chart",
    description:
      "Each point's z value sizes its dot, so a third dimension (here, revenue) reads at a glance.",
    code: `<BubbleChart
  series={[
    { name: "Plans", points: [
      { x: 12, y: 40, z: 800, label: "Starter" },
      { x: 26, y: 65, z: 2400, label: "Team" },
      { x: 48, y: 82, z: 5200, label: "Business" },
      { x: 72, y: 91, z: 9600, label: "Enterprise" },
    ] },
  ]}
  xLabel="Seats"
  yLabel="Satisfaction"
  valueFormat={(v) => v.toLocaleString()}
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <BubbleChart
          series={plans}
          xLabel="Seats"
          yLabel="Satisfaction"
          valueFormat={(v) => v.toLocaleString()}
        />
      </div>
    ),
  },
  {
    title: "Multi-series with legend",
    description:
      "Two named series get distinct colors and a legend, so bubbles stay grouped by category.",
    code: `<BubbleChart
  series={[
    { name: "Americas", points: [
      { x: 40, y: 12, z: 900, label: "US" },
      { x: 18, y: 24, z: 320, label: "Brazil" },
      { x: 12, y: 30, z: 210, label: "Canada" },
    ] },
    { name: "EMEA", points: [
      { x: 22, y: 30, z: 400, label: "Germany" },
      { x: 30, y: 44, z: 650, label: "UK" },
      { x: 14, y: 52, z: 180, label: "Nigeria" },
    ] },
  ]}
  xLabel="Ad spend ($k)"
  yLabel="New accounts"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <BubbleChart
          series={markets}
          xLabel="Ad spend ($k)"
          yLabel="New accounts"
        />
      </div>
    ),
  },
  {
    title: "Larger bubbles",
    description:
      "Raise maxBubble to give the largest z value more radius when values span a wide range.",
    code: `<BubbleChart
  maxBubble={40}
  series={[
    { name: "Plans", points: [
      { x: 12, y: 40, z: 800, label: "Starter" },
      { x: 26, y: 65, z: 2400, label: "Team" },
      { x: 48, y: 82, z: 5200, label: "Business" },
      { x: 72, y: 91, z: 9600, label: "Enterprise" },
    ] },
  ]}
  xLabel="Seats"
  yLabel="Satisfaction"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <BubbleChart
          maxBubble={40}
          series={plans}
          xLabel="Seats"
          yLabel="Satisfaction"
        />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every BubbleChart-specific prop in one place: bubble sizing, axis titles, grid/legend toggles, custom formatters and an accessible name backed by a hidden data table.",
    code: `<BubbleChart
  series={[
    { name: "Plans", color: "#6366f1", points: [
      { x: 12, y: 40, z: 800, label: "Starter" },
      { x: 26, y: 65, z: 2400, label: "Team" },
      { x: 48, y: 82, z: 5200, label: "Business" },
      { x: 72, y: 91, z: 9600, label: "Enterprise" },
    ] },
  ]}
  bubble={true}          // on by default for BubbleChart
  maxBubble={32}         // largest z maps to this radius (px)
  height={300}
  xLabel="Seats"
  yLabel="Satisfaction"
  showGrid={true}
  showLegend={false}
  xFormat={(v) => \`\${v} seats\`}
  yFormat={(v) => \`\${v}%\`}
  valueFormat={(v) => v.toLocaleString()}
  ariaLabel="Satisfaction vs seats, sized by revenue"
/>`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <BubbleChart
          series={[{ ...plans[0], color: "#6366f1" }]}
          bubble={true}
          maxBubble={32}
          height={300}
          xLabel="Seats"
          yLabel="Satisfaction"
          showGrid={true}
          showLegend={false}
          xFormat={(v) => `${v} seats`}
          yFormat={(v) => `${v}%`}
          valueFormat={(v) => v.toLocaleString()}
          ariaLabel="Satisfaction vs seats, sized by revenue"
        />
      </div>
    ),
  },
];

export default variations;
