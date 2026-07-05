import * as React from "react";
import type { PieChartProps, PieChartDatum } from "./PieChart";

/** A single donut slice — same shape as {@link PieChartDatum}. */
export type DonutChartDatum = PieChartDatum;

/**
 * Donut chart — a {@link PieChart} preset rendered as a ring (hollow center).
 * Accepts every PieChart prop; `donut` defaults to `true`.
 *
 * @startingPoint section="Charts" subtitle="Donut chart (no deps)" viewport="700x280"
 */
export interface DonutChartProps extends PieChartProps {}

export function DonutChart(props: DonutChartProps): React.JSX.Element;
