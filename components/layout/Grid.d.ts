import * as React from "react";
import type { PolymorphicAs } from "../_types";

/** CSS grid primitive — fixed columns or a responsive auto-fill grid. */
export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "div" */
  as?: PolymorphicAs;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
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
