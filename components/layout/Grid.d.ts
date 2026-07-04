import * as React from "react";
import type { PolymorphicComponent, PolymorphicPropsWithRef } from "../_types";

/** Responsive column counts per breakpoint (base + sm/md/lg/xl at 640/768/1024/1280px). */
export type ResponsiveColumns = { base?: number; sm?: number; md?: number; lg?: number; xl?: number };

/**
 * Grid's own props. Intrinsic attributes of the rendered element (and `ref`) are
 * added by the polymorphic wrapper based on `as`.
 */
export interface GridOwnProps {
  /** Fixed column count, or a responsive object `{ base, sm, md, lg, xl }` (ignored when `minChildWidth` is set). */
  columns?: number | ResponsiveColumns;
  /** Responsive auto-fill: minimum child width (number = px, or any CSS length). */
  minChildWidth?: number | string;
  /** Gap (both axes) as a spacing-scale step (number) or any CSS length. @default 4 */
  gap?: number | string;
  /** Row gap — falls back to `gap`. */
  rowGap?: number | string;
  /** Column gap — falls back to `gap`. */
  columnGap?: number | string;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyItems"];
  /** Distribute the grid's rows within extra block space. */
  alignContent?: React.CSSProperties["alignContent"];
  /** Distribute the grid's columns within extra inline space. */
  justifyContent?: React.CSSProperties["justifyContent"];
}

/** Grid props for a given element `C` (defaults to `"div"`). */
export type GridProps<C extends React.ElementType = "div"> = PolymorphicPropsWithRef<C, GridOwnProps>;

/** CSS grid primitive — fixed columns or a responsive auto-fill grid. Polymorphic via `as`. */
export declare const Grid: PolymorphicComponent<GridOwnProps, "div">;
