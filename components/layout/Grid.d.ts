import * as React from "react";
import type { PolymorphicAs } from "../_types";

/** Responsive column counts per breakpoint (base + sm/md/lg/xl at 640/768/1024/1280px). */
export type ResponsiveColumns = { base?: number; sm?: number; md?: number; lg?: number; xl?: number };

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
  /** Fixed column count, or a responsive object `{ base, sm, md, lg, xl }` (ignored when `minChildWidth` is set). */
  columns?: number | ResponsiveColumns;
  /** Responsive auto-fill: minimum child width (number = px, or any CSS length). */
  minChildWidth?: number | string;
  /** Gap (both axes) as a spacing-scale step (number) or any CSS length. @default 4 */
  gap?: number | string;
  /** Row gap — falls back to `gap`. */
  rowGap?: number | string;
  /** Column gap — falls back to `gap`. */
  columnGap?: number | string;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyItems"];
  /** Distribute the grid's rows within extra block space. */
  alignContent?: React.CSSProperties["alignContent"];
  /** Distribute the grid's columns within extra inline space. */
  justifyContent?: React.CSSProperties["justifyContent"];
}

export function Grid(props: GridProps): React.JSX.Element;
