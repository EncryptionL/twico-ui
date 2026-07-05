import React from "react";
import { PieChart } from "./PieChart.jsx";

/**
 * Donut chart — a {@link PieChart} preset rendered as a ring (hollow center).
 * Takes every PieChart prop; `donut` is on by default (pass `donut={false}` for a
 * solid pie, or `innerRadius` to tune the hole).
 */
export function DonutChart(props) {
  return <PieChart donut {...props} />;
}
