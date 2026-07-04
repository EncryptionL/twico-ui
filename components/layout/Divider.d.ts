import * as React from "react";

/**
 * Thin rule that separates content. Horizontal or vertical; can carry a centered
 * (or left/right-aligned) label.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** Rule axis — applies to both the plain and the labeled variant (exposed as `aria-orientation`). @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Indent the start of a horizontal rule. */
  inset?: boolean;
  /** Label alignment when children are provided — logical, so it mirrors under RTL.
   *  (`"left"`/`"right"` are still accepted as aliases for `"start"`/`"end"`.) @default "center" */
  align?: "start" | "center" | "end" | "left" | "right";
  /** Optional label text rendered in the middle of the rule. */
  children?: React.ReactNode;
}

export function Divider(props: DividerProps): React.JSX.Element;
