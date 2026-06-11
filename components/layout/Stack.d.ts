import * as React from "react";

/** Flex layout primitive — rows or columns with token-based gaps. */
export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "div" */
  as?: keyof React.JSX.IntrinsicElements;
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
}

export function Stack(props: StackProps): React.JSX.Element;
