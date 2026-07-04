import * as React from "react";
import type { PolymorphicAs } from "../_types";

/** Font-size token suffixes available to `Heading` (see tokens/typography.css). */
export type HeadingSize =
  | "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "display";

/**
 * Heading (h1–h6) with token typography. `level` sets the tag/semantics; `size` sets the visual
 * scale — the two are intentionally independent (e.g. a semantic `<h1>` at a small size).
 */
export interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  /** Override the rendered tag (e.g. render a visual h2 as an h1). */
  as?: PolymorphicAs;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
  /** Heading level 1–6 — sets the tag and the default size. @default 2 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Font-size token (xs…7xl or display), independent of `level`. */
  size?: HeadingSize;
  /** Convenience: render at the display size (`var(--text-display)`) regardless of level. @default false */
  display?: boolean;
  align?: React.CSSProperties["textAlign"];
  /** Single-line ellipsis truncation (adds min-width:0 so it shrinks in a flex parent). @default false */
  truncate?: boolean;
  /** Clamp to N lines with an ellipsis (multi-line, -webkit-line-clamp). Overrides `truncate`. */
  lineClamp?: number;
}

export declare const Heading: React.ForwardRefExoticComponent<HeadingProps & React.RefAttributes<HTMLElement>>;
