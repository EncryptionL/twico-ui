import * as React from "react";

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default "span" */
  as?: React.ElementType;
}

export declare const VisuallyHidden: React.ForwardRefExoticComponent<
  VisuallyHiddenProps & React.RefAttributes<HTMLElement>
>;
