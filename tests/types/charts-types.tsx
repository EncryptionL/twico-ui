// Compile-only guard for the chart family public types.
// Typechecked by `npm run typecheck` (tests/types is in the tsconfig include).
import * as React from "react";
import {
  Chart, PieChart, DonutChart, Gauge, Sparkline, ScatterChart, BubbleChart,
  RadarChart, PolarAreaChart, Heatmap, FunnelChart, Treemap, Candlestick,
  Boxplot, RangeChart,
} from "../../src";

export function chartFamilyFixture() {
  return (
    <>
      <Chart type="area" stacked smooth series={["a", "b"]} data={[{ label: "Jan", a: 1, b: 2 }]} />
      <Chart type="bar" horizontal data={[{ label: "Q1", value: 5 }]} />
      <PieChart donut data={[{ label: "A", value: 3, color: "var(--brand-500)" }]} />
      <DonutChart data={[{ label: "A", value: 3 }]} centerLabel="Total" />
      <Gauge value={72} min={0} max={100} label="CPU" />
      <Gauge value={0} series={[{ value: 30 }, { value: 60, label: "b" }]} />
      <Sparkline data={[1, 2, 3, 4]} area color="var(--color-success)" />
      <Sparkline data={[{ value: 1 }, { value: 5 }]} type="bar" />
      <ScatterChart series={[{ name: "s", points: [{ x: 1, y: 2, z: 3 }] }]} />
      <BubbleChart series={[{ points: [{ x: 1, y: 2, z: 9 }] }]} maxBubble={30} />
      <RadarChart data={[{ label: "Speed", a: 8 }]} series={["a"]} />
      <PolarAreaChart data={[{ label: "A", value: 4 }]} />
      <Heatmap data={[{ x: "Mon", y: "AM", value: 3 }]} showValues />
      <FunnelChart data={[{ label: "Visit", value: 100 }]} showPercent />
      <Treemap data={[{ label: "A", value: 10 }]} />
      <Candlestick data={[{ label: "Mon", open: 1, high: 3, low: 0, close: 2 }]} />
      <Boxplot data={[{ label: "A", min: 1, q1: 2, median: 3, q3: 4, max: 5, outliers: [9] }]} />
      <RangeChart type="area" data={[{ label: "x", min: 1, max: 4 }]} />

      {/* @ts-expect-error — PieChart datum requires a numeric value */}
      <PieChart data={[{ label: "A" }]} />
      {/* @ts-expect-error — Candlestick requires open/high/low/close */}
      <Candlestick data={[{ label: "Mon", open: 1 }]} />
      {/* @ts-expect-error — Gauge value must be a number */}
      <Gauge value="72" />
      {/* @ts-expect-error — ScatterChart point needs x and y */}
      <ScatterChart series={[{ points: [{ x: 1 }] }]} />
    </>
  );
}
