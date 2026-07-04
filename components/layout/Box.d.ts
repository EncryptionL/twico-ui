import * as React from "react";
import type { PolymorphicAs } from "../_types";

/** Generic, token-styled element — the building block for non-flex layout. */
export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "div" */
  as?: PolymorphicAs;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
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
}

export declare const Box: React.ForwardRefExoticComponent<BoxProps & React.RefAttributes<HTMLElement>>;
