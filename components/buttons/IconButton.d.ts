import * as React from "react";
import type { ActionTone } from "../_types";

/**
 * Square (or circular) button for a single icon. Always provide an aria-label.
 *
 * @startingPoint section="Buttons" subtitle="Icon-only button" viewport="700x120"
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon node to render (e.g. a Lucide SVG). */
  icon?: React.ReactNode;
  /** Fill style (same axes as Button). @default "ghost" */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** Color/intent, orthogonal to `variant` (mirrors Button). A destructive icon button is
   *  `tone="danger"` with any variant. @default "primary" */
  tone?: ActionTone;
  /** Control size; "xs" (~26px) is smaller than "sm". @default "md" */
  size?: "xs" | "sm" | "md" | "lg";
  /** Fully rounded (circular). @default false */
  round?: boolean;
  /** Accessible label — required for icon-only buttons. */
  "aria-label": string;
}

export function IconButton(props: IconButtonProps): React.JSX.Element;
