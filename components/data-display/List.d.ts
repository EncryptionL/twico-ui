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
  /** Highlight as selected — also sets `aria-current="page"` on link/button rows. */
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
  /** Shown as a centered zero-state row when `items` is empty. @default "Nothing here yet" */
  emptyMessage?: React.ReactNode;
}

export function List(props: ListProps): React.JSX.Element;
