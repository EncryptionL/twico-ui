import * as React from "react";
import type { Tone } from "../_types";

/**
 * Removable chip for filters, selected items, and keywords.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show a remove (×) button and handle its click. */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label for the remove (×) button. Defaults to `Remove {children}` when children is a string, else "Remove". */
  removeLabel?: string;
  /** Optional leading icon. */
  leftIcon?: React.ReactNode;
  /** Fill style. @default "soft" */
  variant?: "soft" | "solid" | "outline";
  /** Color intent. @default "neutral" */
  tone?: Tone;
  children?: React.ReactNode;
}

export function Tag(props: TagProps): React.JSX.Element;
