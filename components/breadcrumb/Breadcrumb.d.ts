import * as React from "react";

export interface BreadcrumbItem {
  /** Visible label. */
  label: React.ReactNode;
  /** Link target (omit on the last/current item). */
  href?: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Click handler (for SPA navigation). */
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Breadcrumb trail showing the path to the current page. Supports leading icons
 * per item and collapsing the middle into a “…” that expands on click.
 *
 * @startingPoint section="Navigation" subtitle="Breadcrumb trail" viewport="700x80"
 */
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Ordered trail; the last item renders as the current page. */
  items: BreadcrumbItem[];
  /** Custom separator node (defaults to a chevron). */
  separator?: React.ReactNode;
  /** Collapse to first + last items past this count (0 = never). @default 0 */
  maxItems?: number;
}

export function Breadcrumb(props: BreadcrumbProps): React.JSX.Element;
