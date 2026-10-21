import React from "react";
import { useScopedStyles } from "../_styles.js";
import { Grid } from "../layout/Grid.jsx";
import { Pagination } from "./Pagination.jsx";
import { Select } from "../inputs/Select.jsx";
import { Input } from "../inputs/Input.jsx";
import { Checkbox } from "../inputs/Checkbox.jsx";
import { Tooltip } from "../overlay/Tooltip.jsx";
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

/* #478: selection. The card's selected state is a RING, not a background tint: a card is usually a
   full-bleed thumbnail, so a tint is invisible behind the image. The ring is drawn with box-shadow on
   a wrapper so it never participates in layout (no reflow when a card becomes selected) and it reads
   in both themes, --color-primary clearing 3:1 against both surfaces as a non-text indicator. */
.twc-cardgrid__item { position: relative; border-radius: var(--radius-lg); transition: box-shadow var(--duration-fast) var(--ease-standard); }
.twc-cardgrid__item[data-selected="true"] { box-shadow: 0 0 0 var(--border-medium) var(--color-primary); }
/* The overlay is the GRID's checkbox, not the card's: renderCard owns the whole body, so a
   consumer-rendered checkbox would compete with the card's own click target and have to be positioned
   against a thumbnail whose size only the consumer knows. Placement is configurable, and a consumer who
   wants it inline instead uses the third renderCard argument and sets selectionPlacement="none". */
.twc-cardgrid__pick { position: absolute; z-index: 2; display: inline-flex; padding: var(--space-1);
  background: color-mix(in srgb, var(--color-surface) 82%, transparent); border-radius: var(--radius-md);
  backdrop-filter: blur(4px); }
.twc-cardgrid__item[data-place="top-start"] .twc-cardgrid__pick { top: var(--space-2); inset-inline-start: var(--space-2); }
.twc-cardgrid__item[data-place="top-end"] .twc-cardgrid__pick { top: var(--space-2); inset-inline-end: var(--space-2); }
.twc-cardgrid__item[data-place="bottom-start"] .twc-cardgrid__pick { bottom: var(--space-2); inset-inline-start: var(--space-2); }
.twc-cardgrid__item[data-place="bottom-end"] .twc-cardgrid__pick { bottom: var(--space-2); inset-inline-end: var(--space-2); }
.twc-cardgrid__batch { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3); border: var(--border-thin) solid var(--color-primary-border);
  background: var(--color-primary-subtle); border-radius: var(--radius-md); }
.twc-cardgrid__batch-count { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-primary-subtle-fg); }
/* #492: same slot, same contract as Datatable. Weight, not a lighter token - this bar is
   --color-primary-subtle, where --color-text-subtle is 4.26:1 and fails normal-text contrast. */
.twc-cardgrid__batch-summary { display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-sm); color: var(--color-primary-subtle-fg); }
.twc-cardgrid__batch-summary::before { content: ""; width: var(--border-thin); height: 14px; background: currentColor; opacity: 0.35; }
.twc-cardgrid__batch-actions { display: inline-flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); margin-inline-start: auto; }
.twc-cardgrid__batch-btn { display: inline-flex; align-items: center; gap: var(--space-2); height: var(--control-h-sm);
  padding-inline: var(--space-3); border: var(--border-thin) solid var(--color-border); background: var(--color-surface);
  color: var(--color-text); font-family: inherit; font-size: var(--text-xs); font-weight: var(--font-semibold);
  border-radius: var(--radius-md); cursor: pointer; }
.twc-cardgrid__batch-btn:hover:not(:disabled):not([aria-disabled="true"]) { border-color: var(--color-primary-subtle-fg); color: var(--color-primary-subtle-fg); }
.twc-cardgrid__batch-btn:disabled, .twc-cardgrid__batch-btn[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }
.twc-cardgrid__batch-btn[data-danger="true"] { color: var(--color-danger-subtle-fg); }
.twc-cardgrid__batch-btn svg { width: 15px; height: 15px; }
.twc-cardgrid__batch-x { display: inline-grid; place-items: center; width: 26px; height: 26px; flex: none;
  border: none; background: transparent; color: var(--color-primary-subtle-fg); cursor: pointer; border-radius: var(--radius-sm); }
.twc-cardgrid__batch-x:hover { background: color-mix(in srgb, var(--color-primary) 14%, transparent); }
.twc-cardgrid__batch-x svg { width: 15px; height: 15px; }
.twc-cardgrid__selall { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); color: var(--color-text-muted); }
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
  // #478: selection + batch actions, deliberately the SAME vocabulary as Datatable rather than a new
  // one - a card grid is the surface where "pick several of these and do one thing to them" is close to
  // the whole point, and it was the only Datatable affordance CardGrid lacked.
  checkboxSelection = false,
  batchActions = [],
  selectionSummary,
  onRowSelectionChange,
  selectionPlacement = "top-start",
  selectionLabel,
  showSelectAll = true,
  retainSelectedRows = false,
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
  const total = serverMode ? (rowCount == null ? rows.length : rowCount) : client.total;
  const totalPages = Math.max(1, paginated ? Math.ceil(total / sizeVal) : 1);
  // #461: CardGrid resets to page 0 on quick-filter / sort / page-size / filters changes, but nothing
  // caught `rows` itself shrinking - so a refetch or a deletion could leave pageVal past the end. The
  // slice then returns [] and the empty state covers rows that DO match, with a footer reading
  // "97-10 of 10". Clamp to the last real page (Datatable has the same guard); unlike Datatable's
  // reset-to-0 this keeps the reader near where they were, which matters more in a card catalogue.
  const lastPage = totalPages - 1;
  // #461 (review): the clamp must only fire when the page is KNOWABLY out of range.
  //  - serverMode without `rowCount`: `total` falls back to rows.length, i.e. the size of the page the
  //    host happened to send, so totalPages is 1 and every page looks out of range. Clamping there
  //    reset a restored page to 0 before the data had even arrived, and kept the host pinned.
  //  - `loading`: same thing one beat later - the rows for the current page are not in yet.
  const pageKnowable = !(serverMode && rowCount == null) && !loading;
  const shownPage = pageKnowable ? Math.min(pageVal, lastPage) : pageVal;
  // #461: render from the CLAMPED page, not the stranded one. Reporting the clamp through
  // onPageChange is not enough on its own - a controlled host that keeps feeding the old `page` would
  // still get an empty grid - and `filtered` is the full pre-paging set the query already built, so
  // re-slicing costs nothing and only happens when the index really is out of range. In serverMode the
  // host owns the slice, so there the clamp callback plus the clamped footer is all we can do.
  const pageRows = serverMode
    ? rows
    : (paginated && shownPage !== pageVal
        ? client.filtered.slice(shownPage * sizeVal, shownPage * sizeVal + sizeVal)
        : client.rows);
  // #461 (review): skipped on the render where `filters` changed, because the reset-to-page-0 effect
  // above owns that render. Both effects run in the same commit in declaration order and `pageVal` is
  // still the pre-reset value here, so without this guard the clamp ran second and overwrote the reset
  // - changing a filter landed you on the LAST page instead of the first. The sort / quick-filter /
  // page-size resets call commitPage(0) inline from their handlers, so they are already settled by the
  // time this runs and need no guard.
  const clampedFiltersKey = React.useRef(filtersKey);
  React.useEffect(() => {
    if (clampedFiltersKey.current !== filtersKey) { clampedFiltersKey.current = filtersKey; return; }
    if (pageKnowable && pageVal > lastPage) commitPage(lastPage);
  }, [lastPage, pageVal, pageKnowable, filtersKey]); // eslint-disable-line

  const onServerChangeRef = React.useRef(onServerChange);
  onServerChangeRef.current = onServerChange;
  const queryKey = JSON.stringify(query);
  React.useEffect(() => {
    if (!serverMode) return undefined;
    const t = setTimeout(() => onServerChangeRef.current?.(JSON.parse(queryKey)), 250);
    return () => clearTimeout(t);
  }, [serverMode, queryKey]);

  const keyOf = typeof rowKey === "function" ? rowKey : (r) => r && r[rowKey];

  // ── #478 selection ────────────────────────────────────────────────────────────────────────────
  const [selected, setSelected] = React.useState(() => new Set());
  // Off-page row objects. `keys` is the authoritative cross-page selection (as in Datatable), but a
  // batch action over a multi-page selection also wants the ROWS, and the grid only renders one page -
  // which is exactly the Map<id,row> consumers were hand-rolling. Opt-in because it holds references
  // the host may expect to be released, and BOUNDED so a select-all over 100k rows cannot grow without
  // limit: past the cap it stops retaining and the caller falls back to re-fetching by key.
  const retainCap = retainSelectedRows === true ? 1000 : (retainSelectedRows || 0);
  const retainedRef = React.useRef(new Map());
  const selKeys = React.useMemo(() => [...selected], [selected]);
  const selectedRows = React.useMemo(() => {
    const onPage = new Map(pageRows.map((r, i) => [keyOf(r, i), r]));
    return selKeys.map((k) => onPage.get(k) ?? retainedRef.current.get(k)).filter((r) => r !== undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selKeys, pageRows]);
  const clearSelection = React.useCallback(() => { retainedRef.current.clear(); setSelected(new Set()); }, []);
  const toggleKey = React.useCallback((key, row) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); retainedRef.current.delete(key); }
      else {
        next.add(key);
        if (retainCap > 0 && row !== undefined && retainedRef.current.size < retainCap) retainedRef.current.set(key, row);
      }
      return next;
    });
  }, [retainCap]);

  const pageKeys = pageRows.map((r, i) => keyOf(r, i));
  const pageSelectedCount = pageKeys.filter((k) => selected.has(k)).length;
  const allPageSelected = pageKeys.length > 0 && pageSelectedCount === pageKeys.length;
  const somePageSelected = pageSelectedCount > 0 && !allPageSelected;
  // Page-scoped, like Datatable's header checkbox: it must never silently select rows the user cannot
  // see, and in serverMode it could not anyway.
  const togglePage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      pageRows.forEach((r, i) => {
        const k = keyOf(r, i);
        if (allPageSelected) { next.delete(k); retainedRef.current.delete(k); }
        else {
          next.add(k);
          if (retainCap > 0 && retainedRef.current.size < retainCap) retainedRef.current.set(k, r);
        }
      });
      return next;
    });
  };

  // Report the selection, guarded on a signature so an unrelated re-render cannot re-fire it (the
  // #322 pattern from Datatable).
  const onSelRef = React.useRef(onRowSelectionChange);
  onSelRef.current = onRowSelectionChange;
  const prevSelSigRef = React.useRef(null);
  React.useEffect(() => {
    const cb = onSelRef.current;
    if (!cb) return;
    const sig = selKeys.join(",");
    if (sig === prevSelSigRef.current) return;
    prevSelSigRef.current = sig;
    cb(selKeys, selectedRows);
  }, [selKeys, selectedRows]);
  // #461: clamped so `from` can never exceed `to` - covers the frame before the clamp effect lands,
  // and the controlled case where the host keeps passing the stale page.
  const from = total === 0 ? 0 : Math.min(shownPage * sizeVal + 1, total);
  const to = paginated ? Math.min((shownPage + 1) * sizeVal, total) : total;
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

      {checkboxSelection && showSelectAll && pageRows.length > 0 && selected.size === 0 ? (
        <label className="twc-cardgrid__selall">
          <Checkbox checked={allPageSelected} indeterminate={somePageSelected} onChange={togglePage}
            aria-label="Select all on this page" />
          Select all on this page
        </label>
      ) : null}

      {checkboxSelection && selected.size > 0 ? (
        <div className="twc-cardgrid__batch">
          <button type="button" className="twc-cardgrid__batch-x" onClick={clearSelection} aria-label="Clear selection">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <span className="twc-cardgrid__batch-count">{selected.size} selected</span>
          {/* #492: parity with Datatable - see the note there. Placed next to the count it qualifies,
              before the page toggle, so "12 selected - 2.4 GB" reads as one phrase. */}
          {selectionSummary != null ? (
            <span className="twc-cardgrid__batch-summary">
              {typeof selectionSummary === "function" ? selectionSummary(selKeys, selectedRows) : selectionSummary}
            </span>
          ) : null}
          {showSelectAll && pageRows.length > 0 ? (
            <label className="twc-cardgrid__selall">
              <Checkbox checked={allPageSelected} indeterminate={somePageSelected} onChange={togglePage}
                aria-label="Select all on this page" />
              This page
            </label>
          ) : null}
          <div className="twc-cardgrid__batch-actions">
            {batchActions.map((a, i) => {
              // Same contract as Datatable's batch actions, #479's disabledReason included: `disabled`,
              // `hidden` and `disabledReason` may all be predicates over the current selection.
              const isHidden = typeof a.hidden === "function" ? a.hidden(selKeys, selectedRows) : !!a.hidden;
              if (isHidden) return null;
              const isDisabled = typeof a.disabled === "function" ? a.disabled(selKeys, selectedRows) : !!a.disabled;
              const reason = isDisabled && a.disabledReason != null
                ? (typeof a.disabledReason === "function" ? a.disabledReason(selKeys, selectedRows) : a.disabledReason)
                : null;
              const soft = isDisabled && reason != null;
              const btn = (
                <button type="button" key={i} className="twc-cardgrid__batch-btn" data-danger={a.danger || undefined}
                  disabled={isDisabled && !soft} aria-disabled={soft || undefined}
                  onClick={(e) => { if (isDisabled) return; a.onClick?.(selKeys, selectedRows, clearSelection, { anchorEl: e.currentTarget }); }}>
                  {a.icon}{a.label}
                </button>
              );
              return reason != null ? <Tooltip key={i} label={reason} placement="top">{btn}</Tooltip> : btn;
            })}
          </div>
        </div>
      ) : null}

      <div className="twc-cardgrid__body" data-loading={loading || undefined} aria-busy={loading || undefined}>
        {loading ? <div className="twc-cardgrid__overlay"><div className="twc-cardgrid__spinner" role="status" aria-label="Loading" /></div> : null}
        {pageRows.length === 0 && !loading ? (
          <div className="twc-cardgrid__empty">{emptyState}</div>
        ) : (
          <Grid className="twc-cardgrid__grid" minChildWidth={minChildWidth} columns={columns} gap={gap}
            role="list" aria-labelledby={label ? `${fieldId}-label` : undefined}>
            {pageRows.map((row, i) => {
              const k = keyOf(row, i);
              const isSel = checkboxSelection && selected.has(k);
              return (
                <div role="listitem" key={k ?? i} className="twc-cardgrid__item"
                  data-selected={isSel || undefined}
                  data-place={checkboxSelection ? selectionPlacement : undefined}>
                  {checkboxSelection && selectionPlacement !== "none" ? (
                    <span className="twc-cardgrid__pick">
                      <Checkbox checked={isSel} onChange={() => toggleKey(k, row)}
                        aria-label={selectionLabel ? selectionLabel(row, i) : "Select item"} />
                    </span>
                  ) : null}
                  {/* #478: the third argument lets a consumer put the control inside their own card
                      layout instead (with selectionPlacement="none"), without re-implementing any of
                      the selection state. */}
                  {renderCard(row, i, checkboxSelection
                    ? { selected: isSel, toggle: () => toggleKey(k, row) }
                    : undefined)}
                </div>
              );
            })}
          </Grid>
        )}
      </div>

      {paginated && totalPages > 0 ? (
        <div className="twc-cardgrid__footer">
          <span className="twc-cardgrid__count">{total === 0 ? "No results" : `${from}–${to} of ${total}`}</span>
          <Pagination size="sm" page={shownPage + 1} total={totalPages} boundaries={1} siblings={1}
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
