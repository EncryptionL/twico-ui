import * as React from "react";
import type { PolymorphicComponent, PolymorphicPropsWithRef } from "../_types";

/**
 * Stack's own props. Intrinsic attributes of the rendered element (and `ref`) are
 * added by the polymorphic wrapper based on `as` (e.g. `as="a"` adds `href`).
 */
export interface StackOwnProps {
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

/** Stack props for a given element `C` (defaults to `"div"`). */
export type StackProps<C extends React.ElementType = "div"> = PolymorphicPropsWithRef<C, StackOwnProps>;

/** Flex layout primitive — rows or columns with token-based gaps. Polymorphic via `as`. */
export declare const Stack: PolymorphicComponent<StackOwnProps, "div">;
