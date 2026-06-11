import * as React from "react";

export interface ListItemData {
  /** Primary text. */
  title: React.ReactNode;
  /** Secondary text under the title. */
  description?: React.ReactNode;
  /** Leading node (icon / avatar). */
  leading?: React.ReactNode;
  /** Trailing node (badge, meta, chevron, switch). */
  trailing?: React.ReactNode;
  /** Makes the row a button. */
  onClick?: (e: React.MouseEvent) => void;
  /** Makes the row a link. */
  href?: string;
  /** Highlight as selected. */
  active?: boolean;
}

/**
 * Vertical list of rows with leading/trailing slots, title + description, and
 * optional interactivity (button or link rows).
 *
 * @startingPoint section="Data display" subtitle="List rows with lead/trail slots" viewport="700x300"
 */
export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  items: ListItemData[];
  /** Drop the card chrome (borderless, transparent). @default false */
  plain?: boolean;
}

export function List(props: ListProps): React.JSX.Element;
