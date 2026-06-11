import * as React from "react";

/**
 * Primary action button with solid / soft / outline / ghost / danger variants,
 * three sizes, loading state, icons, and a click ripple.
 *
 * @startingPoint section="Buttons" subtitle="Action button with ripple + variants" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "solid" */
  variant?: "solid" | "soft" | "outline" | "ghost" | "danger";
  /** Control size. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Icon node rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon node rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Show a spinner and block interaction. @default false */
  loading?: boolean;
  /** Stretch to fill the container width. @default false */
  fullWidth?: boolean;
  /** Render as a different element (e.g. "a"). @default "button" */
  as?: "button" | "a";
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): React.JSX.Element;
