import * as React from "react";

/**
 * Surface container for grouped content. Supports header (title/subtitle),
 * body, footer, three variants, and an interactive hover-lift.
 *
 * @startingPoint section="Data display" subtitle="Content card with header & footer" viewport="700x260"
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Bold title in the card header. */
  title?: React.ReactNode;
  /** Muted subtitle under the title. */
  subtitle?: React.ReactNode;
  /** Footer content (e.g. action buttons). */
  footer?: React.ReactNode;
  /** Visual style. @default "elevated" */
  variant?: "elevated" | "outline" | "soft";
  /** Inner padding. @default "md" */
  padding?: "none" | "md" | "lg";
  /** Adds a hover-lift + pointer cursor. */
  interactive?: boolean;
  /** Stretch to fill the parent cell (`height: 100%`) — equal-height cards in a grid/flex row. */
  fullHeight?: boolean;
  children?: React.ReactNode;
}

export function Card(props: CardProps): React.JSX.Element;
