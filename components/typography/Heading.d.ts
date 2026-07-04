import * as React from "react";
import type { PolymorphicComponent, PolymorphicPropsWithRef } from "../_types";

/** Font-size token suffixes available to `Heading` (see tokens/typography.css). */
export type HeadingSize =
  | "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "display";

/**
 * Heading's own props. `level` sets the tag/semantics; `size` sets the visual scale —
 * the two are intentionally independent (e.g. a semantic `<h1>` at a small size). The
 * rendered element's intrinsic attributes (and `ref`) are added by the polymorphic
 * wrapper based on `as`, which overrides the tag chosen by `level`.
 */
export interface HeadingOwnProps {
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

/** Heading props for a given element `C` (defaults to `"h2"`). */
export type HeadingProps<C extends React.ElementType = "h2"> = PolymorphicPropsWithRef<C, HeadingOwnProps>;

/** Heading (h1–h6) with token typography. Polymorphic via `as` (overrides the `level` tag). */
export declare const Heading: PolymorphicComponent<HeadingOwnProps, "h2">;
