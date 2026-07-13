import React from "react";
import { useScopedStyles } from "../_styles.js";
import { Grid } from "../layout/Grid.jsx";
import { Pagination } from "./Pagination.jsx";
import { Select } from "../inputs/Select.jsx";
import { Input } from "../inputs/Input.jsx";
import { runDatatableQuery } from "./Datatable.jsx";

const CARDGRID_CSS = `
.twc-cardgrid { font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-3); }
.twc-cardgrid__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-cardgrid__toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
.twc-cardgrid__search { flex: 1 1 200px; min-width: 160px; }
.twc-cardgrid__spacer { flex: 1 1 auto; }
.twc-cardgrid__sort { display: inline-flex; align-items: center; gap: var(--space-1); flex: none; }
.twc-cardgrid__dir { display: inline-grid; place-items: center; width: 32px; height: 32px; border: var(--border-thin) solid var(--color-border); background: var(--color-surface); color: var(--color-text-muted); cursor: pointer; border-radius: var(--radius-md); transition: background-color var(--duration-fast), color var(--duration-fast); }
.twc-cardgrid__dir:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-cardgrid__dir svg { width: 16px; height: 16px; transition: transform var(--duration-fast) var(--ease-standard); }
.twc-cardgrid__dir[data-dir="desc"] svg { transform: scaleY(-1); }
.twc-cardgrid__body { position: relative; min-height: 60px; }
.twc-cardgrid__body[data-loading="true"] .twc-cardgrid__grid { opacity: 0.55; pointer-events: none; }
.twc-cardgrid__overlay { position: absolute; inset: 0; display: grid; place-items: center; z-index: 1; }
.twc-cardgrid__spinner { width: 26px; height: 26px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: var(--radius-full); animation: twc-cardgrid-spin 0.7s linear infinite; }
@keyframes twc-cardgrid-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .twc-cardgrid__spinner { animation-duration: 1.6s; } }
.twc-cardgrid__empty { padding: var(--space-8) var(--space-4); text-align: center; color: var(--color-text-muted); font-size: var(--text-sm); }
.twc-cardgrid__footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-2); }
.twc-cardgrid__count { font-size: var(--text-sm); color: var(--color-text-muted); }
.twc-cardgrid__perpage { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); color: var(--color-text-muted); }
`;

export function CardGrid({
  rows = [],
  renderCard,
  rowKey = "id",
  minChildWidth = "18rem",
  gap = 4,
  columns,
  // pagination
  pageSize = 12,
  pageSizeOptions = [12, 24, 48, 96],
  page,
  defaultPage = 0,
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
  // query / server contract (mirrors Datatable serverMode)
  serverMode = false,
  rowCount,
  loading = false,
  onServerChange,
  // filtering & sorting
  filters = [],
  quickFilter,
  defaultQuickFilter = "",
  onQuickFilterChange,
  searchable = false,
  searchFields,
  searchPlaceholder = "Search…",
  sort,
  defaultSort = null,
  onSortChange,
  sortOptions,
  sortMinWidth,
  // slots / states
  toolbar,
  emptyState = "No results.",
  label,
  id,
  className = "",
  ...rest
}) {
  const styles = useScopedStyles("twc-cardgrid-styles", CARDGRID_CSS);
  const autoId = React.useId();
  const fieldId = id || autoId;

  // Page / pageSize / quickFilter / sort: internal state, overridable by controlled props.
  const [internalPage, setInternalPage] = React.useState(defaultPage);
  const pageVal = page !== undefined ? page : internalPage;
  const commitPage = (p) => { onPageChange?.(p); if (page === undefined) setInternalPage(p); };

  const [internalSize, setInternalSize] = React.useState(pageSize > 0 ? pageSize : 12);
  const sizeControlled = onPageSizeChange !== undefined;
  const sizeVal = sizeControlled ? (pageSize > 0 ? pageSize : 12) : internalSize;
  const commitSize = (n) => { onPageSizeChange?.(n); if (!sizeControlled) setInternalSize(n); commitPage(0); };
  React.useEffect(() => { if (!sizeControlled) setInternalSize(pageSize > 0 ? pageSize : 12); }, [pageSize]); // eslint-disable-line

  const [internalQuick, setInternalQuick] = React.useState(defaultQuickFilter);
  const quickVal = quickFilter !== undefined ? quickFilter : internalQuick;
  const commitQuick = (q) => { onQuickFilterChange?.(q); if (quickFilter === undefined) setInternalQuick(q); commitPage(0); };

  const [internalSort, setInternalSort] = React.useState(defaultSort);
  const sortVal = sort !== undefined ? sort : internalSort;
  const commitSort = (s) => { onSortChange?.(s); if (sort === undefined) setInternalSort(s); commitPage(0); };

  // Reset to the first page whenever the (externally-owned) filters change.
  const filtersKey = JSON.stringify(filters);
  const mounted = React.useRef(false);
  React.useEffect(() => { if (!mounted.current) { mounted.current = true; return; } commitPage(0); }, [filtersKey]); // eslint-disable-line

  const paginated = sizeVal > 0;
  const query = { page: pageVal, pageSize: paginated ? sizeVal : 0, sort: sortVal, filters, quickFilter: String(quickVal || "").trim() };

  // Client mode reuses the exact Datatable query semantics; server mode consumes the
  // already-paged `rows` and reports `rowCount`. Emitting the same query shape means a page
  // can toggle between Datatable and CardGrid with one query model.
  const queryCols = sortOptions ? sortOptions.map((o) => ({ field: o.field, type: o.type })) : columns;
  const client = serverMode ? null : runDatatableQuery(rows, query, { columns: queryCols, searchFields });
  const pageRows = serverMode ? rows : client.rows;
  const total = serverMode ? (rowCount == null ? rows.length : rowCount) : client.total;
  const totalPages = Math.max(1, paginated ? Math.ceil(total / sizeVal) : 1);

  const onServerChangeRef = React.useRef(onServerChange);
  onServerChangeRef.current = onServerChange;
  const queryKey = JSON.stringify(query);
  React.useEffect(() => {
    if (!serverMode) return undefined;
    const t = setTimeout(() => onServerChangeRef.current?.(JSON.parse(queryKey)), 250);
    return () => clearTimeout(t);
  }, [serverMode, queryKey]);

  const keyOf = typeof rowKey === "function" ? rowKey : (r) => r && r[rowKey];
  const from = total === 0 ? 0 : pageVal * sizeVal + 1;
  const to = paginated ? Math.min((pageVal + 1) * sizeVal, total) : total;
  const rppOptions = Array.from(new Set([...(pageSizeOptions || []), pageSize].filter((n) => n > 0))).sort((a, b) => a - b).map((n) => ({ value: String(n), label: String(n) }));
  const sortSelectOptions = sortOptions ? [{ value: "", label: "Sort by…" }, ...sortOptions.map((o) => ({ value: o.field, label: o.label || o.field }))] : null;
  // #226: size the sort trigger to its widest label so long option labels aren't clipped
  // (the Select value box ellipsizes). `sortMinWidth` overrides the estimate.
  const sortAutoWidth = sortSelectOptions
    ? Math.min(300, Math.max(120, Math.ceil(Math.max(...sortSelectOptions.map((o) => String(o.label).length)) * 7.2) + 46))
    : undefined;
  const sortWidth = sortMinWidth != null ? sortMinWidth : sortAutoWidth;

  const hasToolbar = searchable || sortSelectOptions || toolbar;

  return (
    <div className={`twc-cardgrid ${className}`} id={fieldId} {...rest}>
      {styles}
      {label ? <div className="twc-cardgrid__label" id={`${fieldId}-label`}>{label}</div> : null}

      {hasToolbar ? (
        <div className="twc-cardgrid__toolbar">
          {searchable ? (
            <div className="twc-cardgrid__search">
              <Input size="sm" type="search" value={quickVal} placeholder={searchPlaceholder}
                aria-label={searchPlaceholder} onChange={(e) => commitQuick(e.target.value)} />
            </div>
          ) : null}
          {toolbar}
          <div className="twc-cardgrid__spacer" />
          {sortSelectOptions ? (
            <div className="twc-cardgrid__sort">
              <Select size="sm" searchable={false} value={sortVal?.field || ""} options={sortSelectOptions} placeholder="Sort by…"
                style={{ minWidth: sortWidth }}
                aria-label="Sort by" onChange={(field) => commitSort(field ? { field, dir: sortVal?.dir || "asc" } : null)} />
              <button type="button" className="twc-cardgrid__dir" data-dir={sortVal?.dir || "asc"} disabled={!sortVal?.field}
                aria-label={sortVal?.dir === "desc" ? "Descending — click to sort ascending" : "Ascending — click to sort descending"}
                onClick={() => sortVal?.field && commitSort({ field: sortVal.field, dir: sortVal.dir === "desc" ? "asc" : "desc" })}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 11l6-6 6 6"/></svg>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="twc-cardgrid__body" data-loading={loading || undefined} aria-busy={loading || undefined}>
        {loading ? <div className="twc-cardgrid__overlay"><div className="twc-cardgrid__spinner" role="status" aria-label="Loading" /></div> : null}
        {pageRows.length === 0 && !loading ? (
          <div className="twc-cardgrid__empty">{emptyState}</div>
        ) : (
          <Grid className="twc-cardgrid__grid" minChildWidth={minChildWidth} columns={columns} gap={gap}
            role="list" aria-labelledby={label ? `${fieldId}-label` : undefined}>
            {pageRows.map((row, i) => (
              <div role="listitem" key={keyOf(row, i) ?? i}>{renderCard(row, i)}</div>
            ))}
          </Grid>
        )}
      </div>

      {paginated && totalPages > 0 ? (
        <div className="twc-cardgrid__footer">
          <span className="twc-cardgrid__count">{total === 0 ? "No results" : `${from}–${to} of ${total}`}</span>
          <Pagination size="sm" page={pageVal + 1} total={totalPages} boundaries={1} siblings={1}
            showPageJumper={totalPages > 7} onChange={(p) => commitPage(p - 1)} />
          {showPageSize ? (
            <label className="twc-cardgrid__perpage">
              Per page
              <Select size="sm" searchable={false} value={String(sizeVal)} options={rppOptions} placement="top"
                aria-label="Cards per page" onChange={(v) => commitSize(Number(v))} />
            </label>
          ) : <span />}
        </div>
      ) : null}
    </div>
  );
}
