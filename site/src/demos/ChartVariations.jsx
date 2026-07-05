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

// A longer series so drag-to-zoom has something to zoom into.
const seriesData = Array.from({ length: 30 }, (_, i) => ({
  label: `D${i + 1}`,
  value: Math.round(120 + 60 * Math.sin(i / 3) + (i % 5) * 12),
}));

function InteractiveChart() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Chart
        type="area"
        smooth
        zoomable
        data={seriesData}
        height={240}
        onDataClick={(p) => setPicked(p)}
        ariaLabel="Interactive area chart with zoom and click"
      />
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked
          ? <>Clicked <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong> = {picked.value}</>
          : "Drag across the plot to zoom · shift-drag to pan · wheel to zoom · click a point"}
      </div>
    </div>
  );
}

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
  {
    title: "All props",
    description:
      "Every Chart-specific prop in one place: a multi-series bar chart with custom colors, a value formatter, an accessible name, and the grid/axis/legend toggles. Switch type to \"line\" for a line chart over the same data.",
    code: `<Chart
  type="bar"                                  // bar | line
  data={[
    { label: "Jan", signups: 120, active: 80 },
    { label: "Feb", signups: 180, active: 140 },
    { label: "Mar", signups: 150, active: 120 },
    { label: "Apr", signups: 220, active: 170 },
  ]}
  series={["signups", "active"]}              // one field per series
  height={240}
  showGrid={true}
  showAxis={true}
  showLegend={true}
  colors={["#6366f1", "#10b981"]}            // cycled when shorter than series
  valueFormat={(v) => v.toLocaleString()}    // tooltip formatter
  ariaLabel="Signups vs active users by month"
/>`,
    render: () => (
      <div style={{ width: 460, maxWidth: "100%" }}>
        <Chart
          type="bar"
          data={trafficData}
          series={["signups", "active"]}
          height={240}
          showGrid={true}
          showAxis={true}
          showLegend={true}
          colors={["#6366f1", "#10b981"]}
          valueFormat={(v) => v.toLocaleString()}
          ariaLabel="Signups vs active users by month"
        />
      </div>
    ),
  },
  {
    title: "Interactive: zoom + pan + click",
    description: "Drag across the plot to zoom the x-axis, shift-drag to pan, mouse-wheel to zoom, and click a point to read it back via onDataClick. A reset button appears while zoomed.",
    code: `function InteractiveChart() {
  const [picked, setPicked] = React.useState(null);
  return (
    <>
      <Chart
        type="area"
        smooth
        zoomable                               // drag-zoom + shift-drag pan + wheel + reset
        data={seriesData}
        height={240}
        onDataClick={(p) => setPicked(p)}      // { label, series, value, index, row }
      />
      <p>{picked ? \`Clicked \${picked.label} = \${picked.value}\` : "Drag to zoom · click a point"}</p>
    </>
  );
}`,
    render: () => (
      <div style={{ maxWidth: 520 }}>
        <InteractiveChart />
      </div>
    ),
  },
];

export default variations;
