import * as React from "react";

/**
 * Shimmering placeholder shown while content loads. Decorative by default — the
 * placeholder gets `aria-hidden="true"` so screen readers skip it. Pass `label` to
 * instead announce loading via a `role="status"` live region.
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
  /**
   * When set, announces loading via `role="status"` + `aria-live="polite"` + `aria-busy="true"`
   * plus visually-hidden text (e.g. "Loading…"); otherwise the placeholder is `aria-hidden="true"`.
   */
  label?: string;
}

export function Skeleton(props: SkeletonProps): React.JSX.Element;
