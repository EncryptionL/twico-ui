import * as React from "react";
import type { PolymorphicComponent, PolymorphicPropsWithRef, Sx } from "../_types";

/**
 * Box's own (non-polymorphic) props. The rendered element's intrinsic attributes —
 * and `ref` — are added by the polymorphic wrapper based on `as` (e.g. `as="a"`
 * contributes `href`/`target`/`rel` and a `Ref<HTMLAnchorElement>`).
 */
export interface BoxOwnProps {
  /** Padding (all / x / y / individual) — spacing step (number) or CSS length. */
  p?: number | string;
  px?: number | string;
  py?: number | string;
  pt?: number | string;
  pr?: number | string;
  pb?: number | string;
  pl?: number | string;
  /** Margin (all / x / y / individual) — spacing step (number) or CSS length. */
  m?: number | string;
  mx?: number | string;
  my?: number | string;
  mt?: number | string;
  mr?: number | string;
  mb?: number | string;
  ml?: number | string;
  /** Background: a surface token name ("surface" | "surface-raised" | "surface-sunken" | "bg"), a bare custom property ("--my-token", wrapped in var()), or any plain CSS background value (e.g. "#fff", "linear-gradient(...)") used as-is. */
  bg?: "surface" | "surface-raised" | "surface-sunken" | "bg" | string;
  /** Add a 1px token border. @default false */
  border?: boolean;
  /** Border radius token suffix (e.g. "md", "lg", "2xl", "full"). */
  radius?: string;
  /** Box-shadow token suffix (e.g. "sm", "lg", "xl"). */
  shadow?: string;
  /** Style escape hatch: flat CSS goes inline (wins over base); nested selectors/at-rules (`"&:hover"`, `"@media …"`) compile to a scoped stylesheet. */
  sx?: Sx;
}

/**
 * Box props for a given element `C` (defaults to `"div"`) — Box's own props plus
 * `C`'s intrinsic attributes and a matching `ref`. Name it directly when wrapping
 * Box in your own typed component.
 */
export type BoxProps<C extends React.ElementType = "div"> = PolymorphicPropsWithRef<C, BoxOwnProps>;

/** Generic, token-styled element — the building block for non-flex layout. Polymorphic via `as`. */
export declare const Box: PolymorphicComponent<BoxOwnProps, "div">;
