import * as React from "react";

/**
 * Page navigation with first/last, prev/next, and smart ellipsis truncation.
 */
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Controlled current 1-based page; when omitted the component manages its own page. */
  page?: number;
  /** Initial 1-based page when uncontrolled (no `page` prop). @default 1 */
  defaultPage?: number;
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
  /** Show a "Go to" page input for jumping directly to a page. Prefer `showPageJumper`. @default false */
  showJumper?: boolean;
  /** Show a "Go to" page input for jumping directly to a page; preferred alias for `showJumper`. @default false */
  showPageJumper?: boolean;
  /** Label before the jump input. @default "Go to" */
  jumperLabel?: React.ReactNode;
}

export function Pagination(props: PaginationProps): React.JSX.Element;
