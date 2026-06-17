import * as React from "react";

/**
 * Primary action button with a solid / soft / outline / ghost **variant** (fill style) crossed with a
 * **tone** (primary / danger color), four sizes, loading state, icons, and a click ripple. A danger
 * button is `tone="danger"` with any variant (e.g. `<Button tone="danger">`, `<Button variant="soft"
 * tone="danger">`) — danger is no longer a variant value.
 *
 * @startingPoint section="Buttons" subtitle="Action button with ripple + variants" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Fill style. @default "solid" */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** Color/intent, orthogonal to `variant`. @default "primary" */
  tone?: "primary" | "danger";
  /** Control size; "xs" (~26px) is smaller than "sm". @default "md" */
  size?: "xs" | "sm" | "md" | "lg";
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
