import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Id of the control this labels. */
  htmlFor?: string;
  /** Append a danger-colored asterisk. @default false */
  required?: boolean;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
}

export declare const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLLabelElement>>;
