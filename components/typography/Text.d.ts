import * as React from "react";

/** Body text with token sizes and semantic color tones. Renders <p> by default. */
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render (e.g. "span", "p"). @default "p" */
  as?: keyof React.JSX.IntrinsicElements;
  /** Font-size token suffix. @default "base" */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | string;
  /** Semantic color tone. @default "default" */
  tone?: "default" | "muted" | "subtle" | "primary" | "danger";
  /** Font-weight token suffix (e.g. "medium", "semibold", "bold"). */
  weight?: "medium" | "semibold" | "bold" | string;
  align?: React.CSSProperties["textAlign"];
}

export function Text(props: TextProps): React.JSX.Element;
