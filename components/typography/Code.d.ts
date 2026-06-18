import * as React from "react";

/** Inline code with mono font and a subtle token-styled surface. */
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "code" */
  as?: keyof React.JSX.IntrinsicElements;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
}

export function Code(props: CodeProps): React.JSX.Element;
