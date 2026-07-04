import * as React from "react";
import type { Tone } from "../_types";

/**
 * Inline message banner with semantic tones, optional title, icon, and dismiss.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Color intent. @default "info" */
  tone?: Tone;
  /** Fill style. @default "soft" */
  variant?: "soft" | "solid" | "outline";
  /** Bold heading line. */
  title?: React.ReactNode;
  /** Override the default tone icon. */
  icon?: React.ReactNode;
  /** Show a close button and handle dismissal. */
  onClose?: () => void;
  children?: React.ReactNode;
}

export function Alert(props: AlertProps): React.JSX.Element;
