import * as React from "react";
import type { PolymorphicAs, TextTone } from "../_types";

/** Body text with token sizes and semantic color tones. Renders <p> by default. */
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render (e.g. "span", "p"). @default "p" */
  as?: PolymorphicAs;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
  /** Font-size token suffix. @default "base" */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | string;
  /** Semantic color tone — text roles (default/muted/subtle), the color intents, or `"inherit"` to adopt the parent color. @default "default" */
  tone?: TextTone;
  /** Font-weight token suffix (e.g. "medium", "semibold", "bold"). */
  weight?: "medium" | "semibold" | "bold" | string;
  align?: React.CSSProperties["textAlign"];
  /** Single-line ellipsis truncation (adds min-width:0 so it shrinks in a flex parent). @default false */
  truncate?: boolean;
  /** Clamp to N lines with an ellipsis (multi-line, -webkit-line-clamp). Overrides `truncate`. */
  lineClamp?: number;
}

export declare const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<HTMLElement>>;
