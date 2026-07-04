import React from "react";
import { ScatterChart } from "./ScatterChart.jsx";

/**
 * Bubble chart — a {@link ScatterChart} preset that sizes each dot by its point's
 * `z` value. Takes every ScatterChart prop; `bubble` is on by default.
 */
export function BubbleChart(props) {
  return <ScatterChart bubble {...props} />;
}
