import * as React from "react";

/** Inline code with mono font and a subtle token-styled surface. */
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default "code" */
  as?: keyof React.JSX.IntrinsicElements;
}

export function Code(props: CodeProps): React.JSX.Element;
