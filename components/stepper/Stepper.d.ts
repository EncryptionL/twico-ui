import * as React from "react";

export interface Step {
  /** Step title. */
  title: React.ReactNode;
  /** Optional sub-label under the title. */
  description?: React.ReactNode;
  /** Custom indicator content (defaults to the step number). */
  icon?: React.ReactNode;
  /** Mark this step as errored (red indicator). */
  error?: boolean;
}

/**
 * Multi-step progress indicator. Steps before `active` show a check, the active
 * step is ringed, later steps are muted; horizontal or vertical.
 *
 * @startingPoint section="Navigation" subtitle="Multi-step progress" viewport="700x140"
 */
export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  /** Index of the current step. @default 0 */
  active?: number;
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Allow clicking completed/active steps. @default false */
  clickable?: boolean;
  /** Fired when a clickable step is clicked. */
  onStepClick?: (index: number) => void;
}

export function Stepper(props: StepperProps): React.JSX.Element;
