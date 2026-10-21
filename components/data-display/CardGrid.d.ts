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
  /**
   * Render one card for a row. Required.
   *
   * #478: with `checkboxSelection`, the third argument carries that card's selection state so a
   * consumer can put the control inside their own layout (set `selectionPlacement="none"` to drop the
   * grid's overlay) without re-implementing any selection state. It is `undefined` when
   * `checkboxSelection` is off.
   */
  renderCard: (
    row: Row,
    index: number,
    selection?: { selected: boolean; toggle: () => void },
  ) => React.ReactNode;
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
  /**
   * Controlled 0-based page. If it points past the last page of the current result set — a refetch or
   * a deletion shrank `rows` — the grid clamps: it renders the last real page and reports the clamped
   * index through `onPageChange` (#461). Keep it controlled only if you apply that callback, otherwise
   * the grid and your state disagree. The clamp is skipped while `loading`, and in `serverMode`
   * without `rowCount`, because the total is not knowable there.
   */
  page?: number;
  /** Initial 0-based page when uncontrolled. @default 0 */
  defaultPage?: number;
  /** Fires on user paging AND when the grid clamps an out-of-range page back into range (#461). */
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
  /** Min width (px or CSS length) for the built-in sort control's trigger, so long option labels aren't clipped. Defaults to an estimate from the longest label. */
  sortMinWidth?: string | number;
  /** Extra node rendered in the toolbar row (before the sort control). */
  toolbar?: React.ReactNode;
  /** Shown when there are no rows and not loading. @default "No results." */
  emptyState?: React.ReactNode;
  /** Optional heading above the grid. */
  label?: React.ReactNode;

  /**
   * #478: show a selection checkbox on each card and a selection toolbar when anything is picked —
   * the same prop name, and the same behaviour, as `Datatable`. A card grid is what you reach for
   * when the rows are visual (assets, previews, renders), where "pick several and do one thing to
   * them" is most of the point.
   * @default false
   */
  checkboxSelection?: boolean;
  /**
   * Actions shown in the selection toolbar, with the same shape as `DatatableBatchAction` — including
   * `disabled` / `hidden` / `disabledReason` as predicates over the current selection (#479), and
   * `ctx.anchorEl` so an action can anchor a popover to its own button.
   */
  batchActions?: CardGridBatchAction<Row>[];
  /**
   * #492: extra node in the **selection** toolbar, rendered beside the "N selected" count and before
   * the batch actions — for the number the count does not carry.
   *
   * The count is not always what decides anything. A batch capped by total **size** refuses on
   * gigabytes, not on items: "12 selected" is not the number the user needs, "12 selected · 2.4 GB"
   * is. Before this there was nowhere to put it, so hosts lifted it into the main toolbar behind
   * their own `selected.length > 0` guard — putting it in a different row from the count it
   * qualifies, and re-deriving a selection this component already tracks.
   *
   * Prefer the **function form**: it receives the same `(keys, rows)` the batch actions get, so the
   * host supplies one pure function and keeps no selection state of its own. (With `retainSelectedRows`
   * the off-page rows resolve too; without it only the rows currently rendered do.) Pass a plain
   * node when the summary does not depend on the selection.
   *
   * Complements `disabledReason` (#479), which explains the refusal once a cap is exceeded: this is
   * the running total *before* that point, which is what lets someone stop at the right number
   * instead of discovering the cap by hitting it.
   */
  selectionSummary?: React.ReactNode | ((keys: Array<string | number>, rows: Row[]) => React.ReactNode);
  /** Fired when the selection changes — `(keys, rows)`, matching `Datatable.onRowSelectionChange`. */
  onRowSelectionChange?: (keys: Array<string | number>, rows: Row[]) => void;
  /**
   * Where the grid draws its checkbox over each card. `"none"` suppresses the overlay entirely for
   * consumers who render the control themselves from `renderCard`'s third argument.
   * @default "top-start"
   */
  selectionPlacement?: "top-start" | "top-end" | "bottom-start" | "bottom-end" | "none";
  /**
   * Per-card `aria-label` for the checkbox. Worth setting: unlike a table row, a card's own content is
   * not necessarily announced with the control, so the default `"Select item"` is the same for every
   * card. @default (row, index) => "Select item"
   */
  selectionLabel?: (row: Row, index: number) => string;
  /** Show the page-scoped "Select all on this page" control. @default true */
  showSelectAll?: boolean;
  /**
   * Retain the row OBJECTS of off-page selections so `batchActions` and `onRowSelectionChange` receive
   * them for a selection spanning several pages. `keys` is always the authoritative cross-page
   * selection (as in `Datatable`); this exists because the grid only renders one page, which is the
   * `Map<id, row>` consumers were otherwise hand-rolling.
   *
   * Opt-in because it holds references the host may expect to be released, and **bounded**: `true`
   * retains up to 1000 rows, or pass a number for your own cap. Past the cap it stops retaining and
   * those keys simply resolve to nothing in `rows`, so re-fetch by key.
   * @default false
   */
  retainSelectedRows?: boolean | number;
}

/** Extra context handed to a CardGrid batch action's `onClick`. */
export interface CardGridBatchActionContext {
  /** The toolbar button that was clicked — anchor a popover or panel to it. */
  anchorEl: HTMLElement;
}

/** A batch action shown in CardGrid's selection toolbar. Mirrors `DatatableBatchAction`. */
export interface CardGridBatchAction<Row = any> {
  /** Button label. */
  label: string;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Handler: `(selectedKeys, selectedRows, clearSelection, ctx)`. */
  onClick?: (
    keys: Array<string | number>,
    rows: Row[],
    clearSelection: () => void,
    ctx: CardGridBatchActionContext,
  ) => void;
  /** Render in danger color. */
  danger?: boolean;
  /** Disable the action — a static boolean, or a predicate over the current selection. */
  disabled?: boolean | ((keys: Array<string | number>, rows: Row[]) => boolean);
  /** Hide the action entirely — a static boolean, or a predicate over the current selection. */
  hidden?: boolean | ((keys: Array<string | number>, rows: Row[]) => boolean);
  /**
   * Why the action is disabled, shown as the button's tooltip (#479). May be a predicate over the
   * selection, because that is usually where the answer lives ("that selection is 5.1 GB; the limit is
   * 4 GB"). With a reason present the button renders `aria-disabled` rather than native `disabled`, so
   * it stays focusable and the reason is keyboard-reachable; without one it stays natively disabled and
   * out of the tab order.
   */
  disabledReason?:
    | React.ReactNode
    | ((keys: Array<string | number>, rows: Row[]) => React.ReactNode);
}

export function CardGrid<Row = any>(props: CardGridProps<Row>): React.JSX.Element;
