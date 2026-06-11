import * as React from "react";

/**
 * Thin rule that separates content. Horizontal or vertical; can carry a centered
 * (or left/right-aligned) label.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Indent the start of a horizontal rule. */
  inset?: boolean;
  /** Label alignment when children are provided. @default "center" */
  align?: "left" | "center" | "right";
  /** Optional label text rendered in the middle of the rule. */
  children?: React.ReactNode;
}

export function Divider(props: DividerProps): React.JSX.Element;
