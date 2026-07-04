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
  /**
   * Live-region politeness. Tone-aware default: danger/warning → `"assertive"` (role="alert"),
   * success/info → `"polite"` (role="status"), primary/neutral → `"off"` (no live region, for
   * static banners). Set explicitly to override. @default tone-aware
   */
  live?: "assertive" | "polite" | "off";
  /** Accessible label for the dismiss button (shown only when `onClose` is set). @default "Dismiss" */
  closeLabel?: string;
  children?: React.ReactNode;
}

export function Alert(props: AlertProps): React.JSX.Element;
