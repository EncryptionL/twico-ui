import * as React from "react";

/**
 * Removable chip for filters, selected items, and keywords.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show a remove (×) button and handle its click. */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional leading icon. */
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Tag(props: TagProps): React.JSX.Element;
