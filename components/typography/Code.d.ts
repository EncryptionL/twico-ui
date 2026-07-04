import * as React from "react";
import type { PolymorphicAs } from "../_types";

/** Inline code, or a scrollable multi-line block with an optional copy button. */
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag or component to render. @default "code" (or "pre" when `block`) */
  as?: PolymorphicAs;
  /** Render a scrollable multi-line `<pre>` block instead of the inline pill; defaults `as` to "pre". @default false */
  block?: boolean;
  /** Show a copy-to-clipboard button (typically with `block`). @default false */
  copyable?: boolean;
  /** Accessible label for the copy button. @default "Copy code" */
  copyLabel?: string;
  /** Accessible label announced after a successful copy. @default "Copied" */
  copiedLabel?: string;
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
}

export function Code(props: CodeProps): React.JSX.Element;
