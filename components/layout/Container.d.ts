import * as React from "react";

/** Centered, max-width content wrapper with responsive horizontal padding. */
export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "div" */
  as?: keyof React.JSX.IntrinsicElements;
  /** Max width: a named size (sm 640 / md 768 / lg 1024 / xl 1280 / full) or any CSS length. @default "lg" */
  size?: "sm" | "md" | "lg" | "xl" | "full" | string;
  /** Apply horizontal padding. @default true */
  padded?: boolean;
}

export function Container(props: ContainerProps): React.JSX.Element;
