import * as React from "react";

/**
 * Square (or circular) button for a single icon. Always provide an aria-label.
 *
 * @startingPoint section="Buttons" subtitle="Icon-only button" viewport="700x120"
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon node to render (e.g. a Lucide SVG). */
  icon?: React.ReactNode;
  /** Visual style; "danger" mirrors Button for icon-only destructive actions. @default "ghost" */
  variant?: "solid" | "soft" | "outline" | "ghost" | "danger";
  /** Control size; "xs" (~26px) is smaller than "sm". @default "md" */
  size?: "xs" | "sm" | "md" | "lg";
  /** Fully rounded (circular). @default false */
  round?: boolean;
  /** Accessible label — required for icon-only buttons. */
  "aria-label": string;
}

export function IconButton(props: IconButtonProps): React.JSX.Element;
