import * as React from "react";

/**
 * Vertically stacked, expandable disclosure panels with smooth height animation.
 *
 * @startingPoint section="Navigation" subtitle="Expandable disclosure panels" viewport="700x300"
 */
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  /** Allow multiple panels open at once. @default false */
  multiple?: boolean;
  /** Values open on first render. */
  defaultOpen?: string[];
}

export interface AccordionItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export function Accordion(props: AccordionProps): React.JSX.Element;
