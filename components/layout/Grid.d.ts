import * as React from "react";

/** CSS grid primitive — fixed columns or a responsive auto-fill grid. */
export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "div" */
  as?: keyof React.JSX.IntrinsicElements;
  /** Fixed number of columns (ignored when `minChildWidth` is set). */
  columns?: number;
  /** Responsive auto-fill: minimum child width (number = px, or any CSS length). */
  minChildWidth?: number | string;
  /** Gap as a spacing-scale step (number) or any CSS length. @default 4 */
  gap?: number | string;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyItems"];
}

export function Grid(props: GridProps): React.JSX.Element;
