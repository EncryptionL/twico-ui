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
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): React.JSX.Element;
