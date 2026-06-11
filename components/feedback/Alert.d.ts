import * as React from "react";

/**
 * Inline message banner with semantic tones, optional title, icon, and dismiss.
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "info" */
  tone?: "info" | "success" | "warning" | "danger";
  /** Bold heading line. */
  title?: React.ReactNode;
  /** Override the default tone icon. */
  icon?: React.ReactNode;
  /** Show a close button and handle dismissal. */
  onClose?: () => void;
  children?: React.ReactNode;
}

export function Alert(props: AlertProps): React.JSX.Element;
