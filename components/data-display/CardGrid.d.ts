import * as React from "react";

/** A single sort clause — the field to sort on and the direction. */
export interface CardGridSort {
  field: string;
  dir: "asc" | "desc";
}

/** A normalized filter clause (same shape Datatable emits/consumes). */
export interface CardGridFilter {
  field: string;
  op: string;
  value: unknown;
}

/** The query object emitted to `onServerChange` — identical to Datatable's server query (minus columns). */
export interface CardGridQuery {
  page: number;
  pageSize: number;
  sort: CardGridSort | null;
  filters: CardGridFilter[];
  quickFilter: string;
}

/** An entry for the built-in sort control. */
export interface CardGridSortOption {
  field: string;
  label?: React.ReactNode;
  /** Compare numerically instead of lexically. */
  type?: "number" | "string";
}

/**
 * Paginated card grid — the card analogue of Datatable's `serverMode`. Turns
 * page/sort/filter/search into a query and renders one card per row via `renderCard`,
 * with built-in pagination, loading, and empty states. In client mode it applies the
 * query locally with Datatable's exact semantics; in `serverMode` it emits the query
 * and consumes `{ rows, rowCount }`, so a page can toggle table/card views on one model.
 *
 * @startingPoint section="Data display" subtitle="Server-mode card grid" viewport="900x520"
 */
export interface CardGridProps<Row = any> extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The rows: the full set in client mode, or the current page in `serverMode`. */
  rows?: Row[];
  /** Render one card for a row. Required. */
  renderCard: (row: Row, index: number) => React.ReactNode;
  /** Stable key per row: a field name or an accessor. @default "id" */
  rowKey?: string | ((row: Row) => React.Key);
  /** Min card width for the responsive auto-fill grid (Grid `minChildWidth`). @default "18rem" */
  minChildWidth?: string | number;
  /** Fixed column count (responsive object allowed); overrides `minChildWidth` when set. */
  columns?: number | Record<string, number>;
  /** Grid gap on the token scale. @default 4 */
  gap?: number | string;
  /** Cards per page (0 disables pagination). @default 12 */
  pageSize?: number;
  /** Options for the "per page" selector. @default [12, 24, 48, 96] */
  pageSizeOptions?: number[];
  /** Controlled 0-based page. */
  page?: number;
  /** Initial 0-based page when uncontrolled. @default 0 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  /** Show the "per page" selector in the footer. @default true */
  showPageSize?: boolean;
  /** Emit a query and consume `rows`/`rowCount`/`loading` instead of filtering locally. @default false */
  serverMode?: boolean;
  /** Total row count for pagination in `serverMode`. */
  rowCount?: number;
  /** Show the loading overlay (and dim the grid). @default false */
  loading?: boolean;
  /** Called (debounced) with the query whenever page/sort/filter/search changes. */
  onServerChange?: (query: CardGridQuery) => void;
  /** External filter clauses (e.g. from a FilterBar) applied in client mode / passed through in server mode. @default [] */
  filters?: CardGridFilter[];
  /** Controlled quick-search string. */
  quickFilter?: string;
  /** Initial quick-search string when uncontrolled. @default "" */
  defaultQuickFilter?: string;
  onQuickFilterChange?: (value: string) => void;
  /** Render a built-in search box in the toolbar. @default false */
  searchable?: boolean;
  /** Fields scanned by quick search in client mode (defaults to the first row's keys). */
  searchFields?: string[];
  searchPlaceholder?: string;
  /** Controlled sort clause. */
  sort?: CardGridSort | null;
  /** Initial sort clause when uncontrolled. @default null */
  defaultSort?: CardGridSort | null;
  onSortChange?: (sort: CardGridSort | null) => void;
  /** Fields offered by the built-in sort control (renders it when provided). */
  sortOptions?: CardGridSortOption[];
  /** Extra node rendered in the toolbar row (before the sort control). */
  toolbar?: React.ReactNode;
  /** Shown when there are no rows and not loading. @default "No results." */
  emptyState?: React.ReactNode;
  /** Optional heading above the grid. */
  label?: React.ReactNode;
}

export function CardGrid<Row = any>(props: CardGridProps<Row>): React.JSX.Element;
