import * as React from "react";

/** Centered, max-width content wrapper with responsive horizontal padding. */
export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "div" */
  as?: keyof React.JSX.IntrinsicElements;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
  /** Max width: a named size (sm 640 / md 768 / lg 1024 / xl 1280 / full) or any CSS length. @default "lg" */
  size?: "sm" | "md" | "lg" | "xl" | "full" | string;
  /** Apply horizontal padding. @default true */
  padded?: boolean;
}

export function Container(props: ContainerProps): React.JSX.Element;
