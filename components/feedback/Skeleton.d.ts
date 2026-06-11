import * as React from "react";

/**
 * Shimmering placeholder shown while content loads.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Shape preset: "text" line(s), "circle" (1:1 aspect, full radius), or "rect" block (--radius-md). @default "text" */
  variant?: "text" | "circle" | "rect";
  /** CSS width (e.g. "120px", "60%"). */
  width?: string | number;
  /** CSS height. */
  height?: string | number;
  /** For text variant: number of lines (last is shortened). @default 1 */
  lines?: number;
}

export function Skeleton(props: SkeletonProps): React.JSX.Element;
