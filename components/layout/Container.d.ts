import * as React from "react";
import type { PolymorphicComponent, PolymorphicPropsWithRef } from "../_types";

/**
 * Container's own props. Intrinsic attributes of the rendered element (and `ref`)
 * are added by the polymorphic wrapper based on `as`.
 */
export interface ContainerOwnProps {
  /** Max width: a named size (sm 640 / md 768 / lg 1024 / xl 1280 / full) or any CSS length. @default "lg" */
  size?: "sm" | "md" | "lg" | "xl" | "full" | string;
  /** Apply horizontal padding. @default true */
  padded?: boolean;
}

/** Container props for a given element `C` (defaults to `"div"`). */
export type ContainerProps<C extends React.ElementType = "div"> = PolymorphicPropsWithRef<C, ContainerOwnProps>;

/** Centered, max-width content wrapper with responsive horizontal padding. Polymorphic via `as`. */
export declare const Container: PolymorphicComponent<ContainerOwnProps, "div">;
