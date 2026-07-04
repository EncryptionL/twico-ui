import * as React from "react";
import type { PolymorphicComponent, PolymorphicPropsWithRef, TextTone } from "../_types";

/**
 * Text's own props. Intrinsic attributes of the rendered element (and `ref`) are
 * added by the polymorphic wrapper based on `as` (e.g. `as="a"` adds `href`).
 */
export interface TextOwnProps {
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

/** Text props for a given element `C` (defaults to `"p"`). */
export type TextProps<C extends React.ElementType = "p"> = PolymorphicPropsWithRef<C, TextOwnProps>;

/** Body text with token sizes and semantic color tones. Renders `<p>` by default; polymorphic via `as`. */
export declare const Text: PolymorphicComponent<TextOwnProps, "p">;
