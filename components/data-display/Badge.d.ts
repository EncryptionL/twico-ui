import * as React from "react";

/**
 * Small status label / count. Six tones × three variants.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic color. @default "primary" */
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  /** Fill style. @default "soft" */
  variant?: "soft" | "solid" | "outline";
  /** Size scale. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Show a leading status dot. */
  dot?: boolean;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): React.JSX.Element;
