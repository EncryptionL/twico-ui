import * as React from "react";

/** Flex layout primitive — rows or columns with token-based gaps. */
export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "div" */
  as?: keyof React.JSX.IntrinsicElements;
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
}

export function Stack(props: StackProps): React.JSX.Element;
