import * as React from "react";
import type { ScatterChartProps } from "./ScatterChart";

/**
 * Bubble chart — a {@link ScatterChart} preset that sizes each dot by its point's
 * `z` value. Accepts every ScatterChart prop; `bubble` defaults to `true`.
 *
 * @startingPoint section="Charts" subtitle="Bubble chart (no deps)" viewport="700x280"
 */
export interface BubbleChartProps extends ScatterChartProps {}

export function BubbleChart(props: BubbleChartProps): React.JSX.Element;
