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
  /** Controlled open panel values; pair with `onOpenChange`. */
  open?: string[];
  /** Called with the next open values whenever a panel is toggled. */
  onOpenChange?: (values: string[]) => void;
  /** Heading level wrapping each trigger button (document-outline semantics). @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface AccordionItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  /** Disable this section — its trigger can't be opened, activated, or focused. @default false */
  disabled?: boolean;
  /** Override the accordion's `headingLevel` for this item. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Accordion(props: AccordionProps): React.JSX.Element;
