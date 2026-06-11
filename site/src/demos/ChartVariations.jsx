import React from "react";
import { Chart } from "twico-ui";

const revenueData = [
  { label: "Mon", value: 240 },
  { label: "Tue", value: 310 },
  { label: "Wed", value: 280 },
  { label: "Thu", value: 360 },
  { label: "Fri", value: 420 },
];

const trafficData = [
  { label: "Jan", signups: 120, active: 80 },
  { label: "Feb", signups: 180, active: 140 },
  { label: "Mar", signups: 150, active: 120 },
  { label: "Apr", signups: 220, active: 170 },
];

const variations = [
  {
    title: "Bar chart",
    description: "Single-series bar chart with a custom value formatter.",
    code: `<Chart
  type="bar"
  data={[
    { label: "Mon", value: 240 },
    { label: "Tue", value: 310 },
    { label: "Wed", value: 280 },
    { label: "Thu", value: 360 },
    { label: "Fri", value: 420 },
  ]}
  valueFormat={(v) => \`$\${v}\`}
/>`,
    render: () => (
      <div style={{ width: 460, maxWidth: "100%" }}>
        <Chart type="bar" data={revenueData} valueFormat={(v) => `$${v}`} />
      </div>
    ),
  },
  {
    title: "Line chart",
    description: "A smooth line chart over the same data.",
    code: `<Chart
  type="line"
  data={[
    { label: "Mon", value: 240 },
    { label: "Tue", value: 310 },
    { label: "Wed", value: 280 },
    { label: "Thu", value: 360 },
    { label: "Fri", value: 420 },
  ]}
  valueFormat={(v) => \`$\${v}\`}
/>`,
    render: () => (
      <div style={{ width: 460, maxWidth: "100%" }}>
        <Chart type="line" data={revenueData} valueFormat={(v) => `$${v}`} />
      </div>
    ),
  },
  {
    title: "Multi-series with legend",
    description: "Two series plotted as grouped lines with a legend.",
    code: `<Chart
  type="line"
  series={["signups", "active"]}
  showLegend
  data={[
    { label: "Jan", signups: 120, active: 80 },
    { label: "Feb", signups: 180, active: 140 },
    { label: "Mar", signups: 150, active: 120 },
    { label: "Apr", signups: 220, active: 170 },
  ]}
/>`,
    render: () => (
      <div style={{ width: 460, maxWidth: "100%" }}>
        <Chart
          type="line"
          series={["signups", "active"]}
          showLegend
          data={trafficData}
        />
      </div>
    ),
  },
  {
    title: "Grouped bars",
    description: "Multiple series render as grouped bars.",
    code: `<Chart
  type="bar"
  series={["signups", "active"]}
  showLegend
  data={[
    { label: "Jan", signups: 120, active: 80 },
    { label: "Feb", signups: 180, active: 140 },
    { label: "Mar", signups: 150, active: 120 },
    { label: "Apr", signups: 220, active: 170 },
  ]}
/>`,
    render: () => (
      <div style={{ width: 460, maxWidth: "100%" }}>
        <Chart
          type="bar"
          series={["signups", "active"]}
          showLegend
          data={trafficData}
        />
      </div>
    ),
  },
  {
    title: "Minimal (no grid or axis)",
    description: "A compact sparkline-style chart with grid and axis hidden and a custom height.",
    code: `<Chart
  type="line"
  height={120}
  showGrid={false}
  showAxis={false}
  data={[
    { label: "Mon", value: 240 },
    { label: "Tue", value: 310 },
    { label: "Wed", value: 280 },
    { label: "Thu", value: 360 },
    { label: "Fri", value: 420 },
  ]}
/>`,
    render: () => (
      <div style={{ width: 460, maxWidth: "100%" }}>
        <Chart
          type="line"
          height={120}
          showGrid={false}
          showAxis={false}
          data={revenueData}
        />
      </div>
    ),
  },
];

export default variations;
