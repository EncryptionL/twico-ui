import * as React from "react";

/**
 * Page navigation with first/last, prev/next, and smart ellipsis truncation.
 */
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Current 1-based page. @default 1 */
  page?: number;
  /** Total number of pages. */
  total: number;
  /** Called with the new page when the user navigates. */
  onChange?: (page: number) => void;
  /** Page numbers shown on each side of the current page. @default 1 */
  siblings?: number;
  /** Page numbers always shown at each end (first/last). @default 1 */
  boundaries?: number;
  /** @default "md" */
  size?: "sm" | "md";
  /** Show a "Go to" page input for jumping directly to a page. @default false */
  showJumper?: boolean;
  /** Label before the jump input. @default "Go to" */
  jumperLabel?: React.ReactNode;
}

export function Pagination(props: PaginationProps): React.JSX.Element;
