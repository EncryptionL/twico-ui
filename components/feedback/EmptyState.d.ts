import * as React from "react";

/**
 * Empty / zero-data placeholder — icon, title, description, and call-to-action.
 *
 * @startingPoint section="Feedback" subtitle="Empty / zero-data state" viewport="700x300"
 */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Illustrative icon shown in a tinted tile. */
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Action buttons row. */
  actions?: React.ReactNode;
  /** Add a dashed border (good for drop targets / placeholders). @deprecated since 1.4, removed in 2.0 — use `border`. @default false */
  bordered?: boolean;
  /** Add a dashed border (good for drop targets / placeholders); preferred alias for `bordered`. @default false */
  border?: boolean;
}

export function EmptyState(props: EmptyStateProps): React.JSX.Element;
