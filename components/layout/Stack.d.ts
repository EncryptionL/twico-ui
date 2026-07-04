import * as React from "react";
import type { PolymorphicAs } from "../_types";

/** Flex layout primitive — rows or columns with token-based gaps. */
export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "div" */
  as?: PolymorphicAs;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
  /** @default "column" */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  /** Gap as a spacing-scale step (number) or any CSS length. @default 4 */
  gap?: number | string;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  /** Wrap children. @default false */
  wrap?: boolean;
  /** Use inline-flex instead of flex. @default false */
  inline?: boolean;
  /** Padding — all sides. Spacing step (number) or any CSS length. */
  p?: number | string;
  /** Horizontal (inline) padding. */
  px?: number | string;
  /** Vertical (block) padding. */
  py?: number | string;
  /** Top padding (overrides `py`/`p`). */
  pt?: number | string;
  /** Right padding (overrides `px`/`p`). */
  pr?: number | string;
  /** Bottom padding (overrides `py`/`p`). */
  pb?: number | string;
  /** Left padding (overrides `px`/`p`). */
  pl?: number | string;
  /** Node rendered between each child (not before the first or after the last). Pass an orientation-appropriate `Divider`. */
  divider?: React.ReactNode;
}

export function Stack(props: StackProps): React.JSX.Element;
