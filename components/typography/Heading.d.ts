import * as React from "react";

/** Heading (h1–h6) with token typography. `level` sets the tag and default size. */
export interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  /** Override the rendered tag (e.g. render a visual h2 as an h1). */
  as?: keyof React.JSX.IntrinsicElements;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
  /** Heading level 1–6 — sets the tag and the default size. @default 2 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Override the font-size token suffix (e.g. "3xl"). */
  size?: string;
  align?: React.CSSProperties["textAlign"];
}

export function Heading(props: HeadingProps): React.JSX.Element;
