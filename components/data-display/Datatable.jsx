import React from "react";
import { Select } from "../inputs/Select.jsx";
import { Input } from "../inputs/Input.jsx";
import { MultiSelect } from "../inputs/MultiSelect.jsx";
import { Pagination } from "./Pagination.jsx";

const DT_CSS = `
.twc-dt { display: flex; flex-direction: column; font-family: var(--font-sans); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  background: var(--color-surface); overflow: hidden;
  /* Stay inside the parent even in a flex/grid container: min-width:0 lets a wide
     grid shrink (default min-width:auto would force it to its content width and
     overflow), so the internal __scroll handles horizontal scrolling. */
  width: 100%; min-width: 0; max-width: 100%; }

/* Toolbar */
.twc-dt__toolbar { position: relative; display: flex; align-items: center; gap: 6px; padding: 8px 10px;
  border-bottom: var(--border-thin) solid var(--color-divider); flex-wrap: wrap; }
.twc-dt__tbtn { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px;
  border: var(--border-thin) solid transparent; border-radius: var(--radius-md); background: transparent;
  font-family: inherit; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--color-text-muted);
  cursor: pointer; transition: background-color var(--duration-fast), color var(--duration-fast); }
.twc-dt__tbtn:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-dt__tbtn[data-tip], .twc-dt__export-toggle[data-tip] { position: relative; }
.twc-dt__tbtn[data-tip]::after, .twc-dt__export-toggle[data-tip]::after {
  content: attr(data-tip); position: absolute; top: calc(100% + 8px); left: 50%;
  transform: translateX(-50%) translateY(2px); transform-origin: top center;
  background: var(--color-text); color: var(--color-surface);
  font-size: var(--text-xs); font-weight: var(--font-medium); letter-spacing: 0;
  padding: 5px 9px; border-radius: var(--radius-md); white-space: nowrap;
  box-shadow: var(--shadow-md); opacity: 0; pointer-events: none; z-index: var(--z-tooltip);
  transition: opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring); }
.twc-dt__tbtn[data-tip]:hover::after, .twc-dt__export-toggle[data-tip]:hover::after {
  opacity: 1; transform: translateX(-50%) translateY(0); transition-delay: 0.4s; }
.twc-dt__tbtn[data-active="true"] { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }
.twc-dt__tbtn svg { width: 16px; height: 16px; }
.twc-dt__export { display: inline-flex; align-items: stretch; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-xs); }
.twc-dt__export-main, .twc-dt__export-toggle { height: 32px; border: none; appearance: none; -webkit-appearance: none; background: var(--color-primary); color: var(--color-primary-fg);
  font-family: inherit; font-weight: var(--font-semibold); cursor: pointer; display: inline-flex; align-items: center; transition: background-color var(--duration-fast); }
.twc-dt__export-main { gap: 6px; padding: 0 12px; font-size: var(--text-xs); border-radius: 0; }
.twc-dt__export-main svg { width: 16px; height: 16px; }
.twc-dt__export-toggle { padding: 0 7px; gap: 0; border-radius: 0; border-inline-start: var(--border-thin) solid color-mix(in srgb, var(--color-primary-fg) 28%, var(--color-primary)); }
.twc-dt__export-toggle svg { width: 15px; height: 15px; transition: transform var(--duration-base) var(--ease-spring); }
.twc-dt__export-main:hover, .twc-dt__export-toggle:hover { background: var(--color-primary-hover); }
.twc-dt__export-toggle[aria-expanded="true"] { background: var(--color-primary-active); }
.twc-dt__export-toggle[aria-expanded="true"] svg { transform: rotate(180deg); }
.twc-dt__tbadge { min-width: 16px; height: 16px; padding: 0 4px; border-radius: var(--radius-full);
  background: var(--color-primary); color: var(--color-primary-fg); font-size: 10px; font-weight: 700;
  display: inline-grid; place-items: center; }
.twc-dt__tdot { width: 8px; height: 8px; padding: 0; border-radius: var(--radius-full); background: var(--color-primary);
  display: inline-block; flex: none; align-self: center; }
.twc-dt__search { margin-inline-start: auto; display: flex; align-items: center; gap: 7px; height: 32px; padding: 0 10px;
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface);
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast); }
.twc-dt__search:focus-within { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-dt__search svg { width: 15px; height: 15px; color: var(--color-text-subtle); flex: none; }
.twc-dt__search input { border: none; outline: none; background: transparent; font-family: inherit;
  font-size: var(--text-sm); color: var(--color-text); width: 150px; }
.twc-dt__search input:focus, .twc-dt__search input:focus-visible { outline: none; box-shadow: none; }
.twc-dt__search input::placeholder { color: var(--color-text-subtle); }
.twc-dt__tlabel { display: inline; }
/* Narrow grid: collapse the toolbar to icon-only buttons (labels survive as
   hover tooltips via data-tip) and let the search flex so nothing wraps. */
.twc-dt__toolbar[data-compact="true"] { flex-wrap: nowrap; gap: 4px; }
.twc-dt__toolbar[data-compact="true"] .twc-dt__tlabel { display: none; }
.twc-dt__toolbar[data-compact="true"] .twc-dt__tbtn { padding: 0 8px; gap: 0; }
.twc-dt__toolbar[data-compact="true"] .twc-dt__tbtn .twc-dt__tbadge { margin-inline-start: 4px; }
.twc-dt__toolbar[data-compact="true"] .twc-dt__export-main { padding: 0 9px; gap: 0; }
.twc-dt__toolbar[data-compact="true"] .twc-dt__search { flex: 1 1 64px; min-width: 0; margin-inline-start: 6px; padding: 0 8px; }
.twc-dt__toolbar[data-compact="true"] .twc-dt__search input { width: 100%; min-width: 0; }

/* Scroll area + table */
.twc-dt__scroll { overflow: auto; position: relative; }
.twc-dt__table { border-collapse: separate; border-spacing: 0; min-width: 100%; table-layout: fixed; }
.twc-dt__th, .twc-dt__td { box-sizing: border-box; text-align: start; }
.twc-dt__th { position: sticky; top: 0; z-index: 3; background: var(--color-surface-sunken);
  border-bottom: var(--border-thin) solid var(--color-border); padding: 0; height: 44px;
  font-size: var(--text-xs); font-weight: var(--font-bold); letter-spacing: var(--tracking-wide);
  text-transform: uppercase; color: var(--color-text-muted); white-space: nowrap; }
.twc-dt__th-inner { display: flex; align-items: center; gap: 6px; height: 100%; padding: 0 12px; }
.twc-dt__th[data-num="true"] .twc-dt__th-inner { flex-direction: row-reverse; }
.twc-dt__th-label { cursor: pointer; user-select: none; flex: 1; overflow: hidden; text-overflow: ellipsis;
  display: inline-flex; align-items: center; gap: 5px; }
.twc-dt__th[data-num="true"] .twc-dt__th-label { flex-direction: row-reverse; }
.twc-dt__sort { display: inline-flex; opacity: 0; transition: opacity var(--duration-fast), transform var(--duration-base) var(--ease-spring); color: var(--color-primary); }
.twc-dt__sort svg { width: 14px; height: 14px; }
.twc-dt__th[data-sorted="asc"] .twc-dt__sort, .twc-dt__th[data-sorted="desc"] .twc-dt__sort { opacity: 1; }
.twc-dt__th[data-sorted="desc"] .twc-dt__sort { transform: rotate(180deg); }
.twc-dt__th:hover .twc-dt__sort { opacity: 0.4; }
.twc-dt__filterdot { width: 6px; height: 6px; border-radius: var(--radius-full); background: var(--color-primary); flex: none; }
.twc-dt__menu-btn { display: inline-grid; place-items: center; width: 24px; height: 24px; border: none;
  background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-sm);
  opacity: 0; transition: opacity var(--duration-fast), background-color var(--duration-fast); flex: none; }
.twc-dt__th:hover .twc-dt__menu-btn { opacity: 1; }
.twc-dt__menu-btn:hover { background: var(--color-surface); color: var(--color-text); }
.twc-dt__menu-btn svg { width: 16px; height: 16px; }

/* Column resize handle */
.twc-dt__resizer { position: absolute; top: 0; right: 0; width: 8px; height: 100%; cursor: col-resize; z-index: 6; touch-action: none; }
.twc-dt__resizer::after { content: ""; position: absolute; top: 22%; right: 2px; width: 2px; height: 56%; background: transparent; border-radius: 2px; transition: background-color var(--duration-fast); }
.twc-dt__th:hover .twc-dt__resizer::after { background: var(--color-border-strong); }
.twc-dt__resizer:hover::after, .twc-dt__resizer[data-active="true"]::after { background: var(--color-primary); }
.twc-dt__resizer:focus-visible { outline: none; }
.twc-dt__resizer:focus-visible::after { background: var(--color-primary); }
.twc-dt[data-resizing="true"] { cursor: col-resize; user-select: none; }

/* Column reorder (drag) */
.twc-dt__th-label[draggable="true"] { cursor: grab; }
.twc-dt__th[data-dragging="true"] { opacity: 0.45; }
.twc-dt__th[data-dropbefore="true"] .twc-dt__th-inner { box-shadow: inset 3px 0 0 var(--color-primary); }
.twc-dt__th[data-dropafter="true"] .twc-dt__th-inner { box-shadow: inset -3px 0 0 var(--color-primary); }
.twc-dt__grip { display: inline-flex; color: var(--color-text-subtle); opacity: 0; margin-inline-end: -2px; transition: opacity var(--duration-fast); flex: none; }
.twc-dt__grip svg { width: 13px; height: 13px; }
.twc-dt__th:hover .twc-dt__grip { opacity: 0.5; }

/* Summary / aggregation footer row */
.twc-dt__table tfoot td { position: sticky; bottom: 0; z-index: 3; background: var(--color-surface-sunken);
  border-top: var(--border-thin) solid var(--color-border); height: 42px; padding: 0 12px; box-sizing: border-box;
  font-size: var(--text-sm); color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 0; }
.twc-dt__table tfoot td[data-num="true"] { text-align: end; font-variant-numeric: tabular-nums; }
.twc-dt__table tfoot td[data-pin] { z-index: 4; }
.twc-dt__agg-label { color: var(--color-text-subtle); font-weight: 700; text-transform: uppercase; letter-spacing: var(--tracking-wide); font-size: 10px; margin-inline-end: 5px; }
.twc-dt__agg-val { font-weight: var(--font-bold); }

/* Row grouping */
.twc-dt__groupbar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 12px;
  border-bottom: var(--border-thin) solid var(--color-border); background: var(--color-surface-sunken); }
.twc-dt__groupbar > svg { width: 15px; height: 15px; color: var(--color-text-subtle); }
.twc-dt__groupbar-label { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--color-text-subtle); }
.twc-dt__groupchip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 4px 3px 10px; height: 26px;
  background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: var(--font-semibold); }
.twc-dt__groupchip-x { display: inline-grid; place-items: center; width: 18px; height: 18px; border: none; padding: 0; background: transparent; color: inherit; cursor: pointer; border-radius: var(--radius-full); opacity: 0.7; }
.twc-dt__groupchip-x:hover { opacity: 1; background: color-mix(in srgb, currentColor 18%, transparent); }
.twc-dt__groupchip-x svg { width: 12px; height: 12px; }
.twc-dt__groupbar-clear { margin-inline-start: 2px; border: none; background: transparent; color: var(--color-text-muted); font-family: inherit; font-size: var(--text-xs); font-weight: var(--font-semibold); cursor: pointer; border-radius: var(--radius-sm); padding: 4px 6px; }
.twc-dt__groupbar-clear:hover { color: var(--color-danger-subtle-fg); background: var(--color-danger-subtle); }
.twc-dt__group-row td { background: var(--color-surface-sunken); border-bottom: var(--border-thin) solid var(--color-border); }
.twc-dt__group-cell { padding: 0 12px !important; height: var(--_rowh, 44px); }
.twc-dt__group-toggle { display: inline-flex; align-items: center; gap: 7px; border: none; background: transparent; cursor: pointer;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text); padding: 6px 4px; border-radius: var(--radius-sm); }
.twc-dt__group-toggle:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-dt__group-chev { display: inline-flex; color: var(--color-text-subtle); transform: rotate(-90deg); transition: transform var(--duration-base) var(--ease-spring); }
.twc-dt__group-chev[data-open] { transform: rotate(0deg); color: var(--color-primary); }
.twc-dt__group-chev svg { width: 16px; height: 16px; }
.twc-dt__group-name { color: var(--color-text-muted); font-weight: var(--font-medium); }
.twc-dt__group-val { font-weight: var(--font-bold); }
.twc-dt__group-count { display: inline-grid; place-items: center; min-width: 20px; height: 18px; padding: 0 6px; border-radius: var(--radius-full); background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); font-size: 11px; font-weight: 700; }
.twc-dt__group-sub { margin-inline-start: 14px; display: inline-flex; gap: 14px; font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-dt__group-sub span { font-variant-numeric: tabular-nums; }
.twc-dt__group-sub span b { color: var(--color-text); }

/* Pivot view */
.twc-dt__pivot { table-layout: auto; width: 100%; }
.twc-dt__pivot th, .twc-dt__pivot td { white-space: nowrap; }
.twc-dt__pivot-vhcell, .twc-dt__pivot-cell { min-width: 104px; }
.twc-dt__pivot-rowhead { min-width: 180px; }
/* Corner (row-field label) */
.twc-dt__pivot-corner { position: sticky; left: 0; top: 0; vertical-align: middle; text-align: center; background: var(--color-surface-sunken); z-index: 9 !important; border-right: var(--border-medium) solid var(--color-border-strong); }
.twc-dt__pivot-corner-label { font-size: var(--text-xs); font-weight: 700; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-text-subtle); }
/* Column-group header levels (e.g. Status ▸ Plan) */
.twc-dt__pivot-colgroup { text-align: center !important; border-left: var(--border-medium) solid var(--color-border-strong);
  background: var(--color-surface-sunken); font-weight: var(--font-bold); color: var(--color-text); letter-spacing: var(--tracking-wide); }
/* Value sub-header (field + aggregation), centered to sit over its column */
.twc-dt__pivot-vhcell { vertical-align: bottom; text-align: center !important; border-left: var(--border-thin) solid var(--color-divider); padding-top: 6px; padding-bottom: 6px; }
.twc-dt__pivot-vhcell[data-group-start] { border-left: var(--border-medium) solid var(--color-border-strong); }
.twc-dt__pivot-vh { display: inline-flex; flex-direction: column; align-items: center; gap: 1px; line-height: 1.15; }
.twc-dt__pivot-vh-label { font-weight: var(--font-bold); color: var(--color-text); text-transform: none; letter-spacing: 0; }
.twc-dt__pivot-vh-agg { font-size: 10px; font-weight: var(--font-semibold); color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.04em; }
/* Row headers + record counts (must outrank .twc-dt__row > .twc-dt__td:first-child = (0,3,0)) */
.twc-dt__pivot tbody .twc-dt__pivot-rowhead[data-pin],
.twc-dt__pivot tfoot .twc-dt__pivot-rowhead[data-pin] { position: sticky; left: 0; z-index: 5; }
.twc-dt__pivot-rowhead { font-weight: var(--font-semibold); color: var(--color-text); background: var(--color-surface); border-right: var(--border-medium) solid var(--color-border-strong); }
.twc-dt__row[data-zebra] .twc-dt__pivot-rowhead { background: color-mix(in srgb, var(--color-surface-sunken) 45%, var(--color-surface)); }
.twc-dt__pivot-rowcount { color: var(--color-text-subtle); font-weight: var(--font-normal); font-size: var(--text-xs); }
/* Body value cells — centered under their header, with group separators */
.twc-dt__pivot-cell { text-align: center !important; border-left: var(--border-thin) solid var(--color-divider); font-variant-numeric: tabular-nums; }
.twc-dt__pivot-cell[data-group-start] { border-left: var(--border-medium) solid var(--color-border-strong); }
.twc-dt__row[data-zebra] .twc-dt__pivot-cell { background: color-mix(in srgb, var(--color-surface-sunken) 45%, transparent); }
.twc-dt__pivot td[data-empty] { color: var(--color-text-subtle); }
/* Total column group (right) */
.twc-dt__pivot-total-h:not(.twc-dt__pivot-vhcell) { text-align: center !important; vertical-align: middle; }
.twc-dt__pivot-total, .twc-dt__pivot-total-h { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); font-weight: var(--font-bold); }
.twc-dt__pivot-total[data-group-start], .twc-dt__pivot-total-h[data-group-start] { border-left: var(--border-medium) solid var(--color-primary) !important; }
.twc-dt__pivot-total-h .twc-dt__pivot-vh-label { color: var(--color-primary-subtle-fg); }
.twc-dt__pivot-total-h .twc-dt__pivot-vh-agg { color: var(--color-primary); }
.twc-dt__row[data-zebra] .twc-dt__pivot-total { background: var(--color-primary-subtle); }
/* Grand-total footer row */
.twc-dt__pivot tfoot td, .twc-dt__pivot tfoot th { position: sticky; bottom: 0; background: var(--color-surface-sunken); font-weight: var(--font-bold); border-top: var(--border-medium) solid var(--color-border-strong); }
.twc-dt__pivot tfoot .twc-dt__pivot-rowhead { z-index: 6; }
.twc-dt__pivot-grand { background: var(--color-surface-sunken); }
.twc-dt__pivot tfoot .twc-dt__pivot-total { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }

/* Config panels (aggregation / pivot) */
.twc-dt__cfg { padding: 0; }
.twc-dt__cfg-toggle { display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 10px 12px; font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text);
  border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-dt__cfg-list { max-height: 280px; overflow-y: auto; padding: 6px; }
.twc-dt__cfg-row { display: flex; align-items: center; gap: 8px; padding: 4px 6px; }
.twc-dt__cfg-name { flex: 1; min-width: 0; font-size: var(--text-sm); color: var(--color-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-dt__cfg-ctl { width: 120px; flex: none; }
.twc-dt__cfg-x { flex: none; display: inline-grid; place-items: center; width: 28px; height: 28px; border: none;
  background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-md);
  transition: background-color var(--duration-fast), color var(--duration-fast); }
.twc-dt__cfg-x:hover { background: var(--color-danger-subtle); color: var(--color-danger-subtle-fg); }
.twc-dt__cfg-x svg { width: 15px; height: 15px; }
.twc-dt__cfg-section { padding: 10px 12px; border-bottom: var(--border-thin) solid var(--color-divider); display: flex; flex-direction: column; gap: 7px; }
.twc-dt__cfg-section:last-child { border-bottom: none; }
.twc-dt__cfg-label { font-size: var(--text-xs); font-weight: var(--font-bold); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-text-subtle); }
.twc-dt__cfg-add { margin-top: 1px; }
.twc-dt__cfg-hint { padding: 9px 12px; font-size: var(--text-xs); color: var(--color-text-muted); background: var(--color-warning-subtle); border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-dt__cfg-hint b { color: var(--color-text); }
.twc-dt__cfg-head { padding: 10px 12px; font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-text); border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-dt__cfg-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 10px 12px; border-top: var(--border-thin) solid var(--color-divider); }
.twc-dt__cfg-btn { height: 32px; padding: 0 14px; border: var(--border-thin) solid var(--color-border-strong); border-radius: var(--radius-md);
  background: var(--color-surface); color: var(--color-text); font-family: inherit; font-size: var(--text-xs); font-weight: var(--font-semibold);
  cursor: pointer; transition: background-color var(--duration-fast), border-color var(--duration-fast), color var(--duration-fast); }
.twc-dt__cfg-btn:hover { background: var(--color-surface-sunken); }
.twc-dt__cfg-btn[data-primary="true"] { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-primary-fg); }
.twc-dt__cfg-btn[data-primary="true"]:hover { background: var(--color-primary-hover); border-color: var(--color-primary-hover); }
.twc-dt__be-row { display: flex; align-items: center; gap: 10px; padding: 5px 6px; opacity: 0.6; transition: opacity var(--duration-fast); }
.twc-dt__be-row[data-on] { opacity: 1; }
.twc-dt__be-check { display: inline-flex; align-items: center; gap: 7px; width: 120px; flex: none; font-size: var(--text-sm); color: var(--color-text); cursor: pointer; }
.twc-dt__be-check input { width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer; flex: none; }
.twc-dt__be-check span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-dt__be-ctl { flex: 1; min-width: 0; }

/* Pinned rows */
.twc-dt__row[data-pinned-row] > .twc-dt__td { background: var(--color-primary-subtle); }
.twc-dt__row[data-pinned-row] > .twc-dt__td[data-pin] { background: var(--color-primary-subtle); }
.twc-dt__row[data-pinned-row="top"] > .twc-dt__td { border-bottom: var(--border-medium) solid var(--color-primary-border); box-shadow: 0 1px 0 var(--color-primary-border); }
.twc-dt__row[data-pinned-row="bottom"] > .twc-dt__td { border-top: var(--border-medium) solid var(--color-primary-border); }

/* Row reordering */
.twc-dt__row[data-reorderable] { cursor: grab; }
.twc-dt__row[data-row-dragging] { opacity: 0.4; }
.twc-dt__row[data-row-dropbefore] > .twc-dt__td { box-shadow: inset 0 3px 0 var(--color-primary); }
.twc-dt__row[data-row-dropafter] > .twc-dt__td { box-shadow: inset 0 -3px 0 var(--color-primary); }
/* Keyboard row reorder (grabbed) */
.twc-dt__row[data-row-grabbed] > .twc-dt__td { background: var(--color-primary-subtle); box-shadow: inset 0 0 0 2px var(--color-primary); }
.twc-dt__row[data-row-grabtarget] > .twc-dt__td { box-shadow: inset 0 3px 0 var(--color-primary); }
.twc-dt__row[data-row-grabtarget="after"] > .twc-dt__td { box-shadow: inset 0 -3px 0 var(--color-primary); }
.twc-dt__row-handle { display: inline-flex; align-items: center; justify-content: center; color: var(--color-text-subtle);
  background: transparent; border: none; padding: 0; margin: 0; cursor: grab; border-radius: var(--radius-sm); opacity: 0; transition: opacity var(--duration-fast), color var(--duration-fast); }
.twc-dt__row:hover .twc-dt__row-handle, .twc-dt__row-handle:focus-visible { opacity: 0.7; }
.twc-dt__row-handle:focus-visible { outline: none; box-shadow: var(--ring); color: var(--color-primary); }
.twc-dt__row-handle[data-grabbed="true"] { opacity: 1; color: var(--color-primary); }
.twc-dt__row-handle svg { width: 14px; height: 14px; }
/* Visually-hidden aria-live region for reorder announcements */
.twc-dt__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
/* Row resizing — must not steal positioning from a pinned first column (checkbox/select) */
.twc-dt__row > .twc-dt__td:first-child:not([data-pin]) { position: relative; }
.twc-dt__row-resizer { position: absolute; left: 0; right: 0; bottom: -3px; height: 7px; cursor: row-resize; z-index: 6; touch-action: none; }
.twc-dt__row-resizer::after { content: ""; position: absolute; left: 6px; right: 6px; bottom: 3px; height: 2px; border-radius: 2px; background: transparent; transition: background-color var(--duration-fast); }
.twc-dt__row:hover .twc-dt__row-resizer::after { background: var(--color-border-strong); }
.twc-dt__row-resizer:hover::after { background: var(--color-primary); }

.twc-dt__td { padding: 0 12px; height: var(--_rowh, 44px); border-bottom: var(--border-thin) solid var(--color-divider);
  font-size: var(--text-sm); color: var(--color-text); background: var(--color-surface);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 0; }
.twc-dt__td[data-num="true"] { text-align: end; font-variant-numeric: tabular-nums; }
.twc-dt[data-density="compact"] .twc-dt__td { --_rowh: 36px; }
.twc-dt[data-density="comfortable"] .twc-dt__td { --_rowh: 56px; }
.twc-dt__row:hover .twc-dt__td { background: var(--color-surface-sunken); }
.twc-dt__row[data-selected="true"] .twc-dt__td { background: var(--color-primary-subtle); }
.twc-dt__row[data-selectable="true"] { cursor: pointer; }
.twc-dt__row[data-active="true"] .twc-dt__td { background: var(--color-primary-subtle); box-shadow: inset 0 0 0 9999px transparent; }
.twc-dt__row[data-active="true"] .twc-dt__td[data-pin] { background: var(--color-primary-subtle); }
.twc-dt__td[data-cell-active="true"] { box-shadow: inset 0 0 0 2px var(--color-primary); background: var(--color-primary-subtle); }
.twc-dt__row:last-child .twc-dt__td { border-bottom: none; }

/* Pinning */
.twc-dt__th[data-pin], .twc-dt__td[data-pin] { position: sticky; z-index: 2; }
.twc-dt__th[data-pin] { z-index: 4; }
.twc-dt__th[data-pin-edge="left"], .twc-dt__td[data-pin-edge="left"] { box-shadow: 6px 0 8px -6px rgb(15 23 42 / 0.18); }
.twc-dt__th[data-pin-edge="right"], .twc-dt__td[data-pin-edge="right"] { box-shadow: -6px 0 8px -6px rgb(15 23 42 / 0.18); }
.dark .twc-dt__th[data-pin-edge="left"], .dark .twc-dt__td[data-pin-edge="left"] { box-shadow: 6px 0 10px -6px rgb(0 0 0 / 0.5); }
.dark .twc-dt__th[data-pin-edge="right"], .dark .twc-dt__td[data-pin-edge="right"] { box-shadow: -6px 0 10px -6px rgb(0 0 0 / 0.5); }

/* Checkbox column */
.twc-dt__check { width: 20px; height: 20px; display: grid; place-items: center; border: var(--border-medium) solid var(--color-border-strong);
  border-radius: var(--radius-sm); background: var(--color-surface); color: var(--color-primary-fg); cursor: pointer; transition: background-color var(--duration-fast), border-color var(--duration-fast); }
.twc-dt__check[data-checked="true"], .twc-dt__check[data-indeterminate="true"] { background: var(--color-primary); border-color: var(--color-primary); }
.twc-dt__check svg { width: 13px; height: 13px; opacity: 0; }
.twc-dt__check[data-checked="true"] svg, .twc-dt__check[data-indeterminate="true"] svg { opacity: 1; }

/* Skeleton */
.twc-dt__sk { display: inline-block; height: 12px; border-radius: var(--radius-sm); background: var(--color-surface-sunken);
  position: relative; overflow: hidden; width: var(--_w, 70%); }
.twc-dt__sk::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-text) 8%, transparent), transparent);
  animation: twico-shimmer 1.4s infinite; }

/* Footer */
.twc-dt__footer { display: flex; flex-direction: column; align-items: stretch; gap: 8px; padding: 10px 12px;
  border-top: var(--border-thin) solid var(--color-divider); font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-dt__footer-row { display: flex; align-items: center; gap: 10px 18px; flex-wrap: wrap; }
.twc-dt__footer-row[data-bottom="true"] { justify-content: space-between; }
.twc-dt__footer-row[data-pager="true"] { justify-content: flex-end; }
.twc-dt__status { white-space: nowrap; }
.twc-dt__rpp { display: inline-flex; align-items: center; gap: 8px; flex: none; }
.twc-dt__rpp-label { white-space: nowrap; }
.twc-dt__status b { color: var(--color-text); font-weight: var(--font-semibold); }

/* Floating panels & menus */
.twc-dt__pop { position: fixed; z-index: var(--z-popover); min-width: 220px; background: var(--color-surface-raised);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
  padding: 6px; animation: twico-scale-in var(--duration-fast) var(--ease-spring); transform-origin: top; }
.twc-dt__caret { position: absolute; top: -6px; width: 11px; height: 11px; background: var(--color-surface-raised);
  border-left: var(--border-thin) solid var(--color-border); border-top: var(--border-thin) solid var(--color-border);
  border-radius: 3px 0 0 0; transform: rotate(45deg); }
.twc-dt__mi { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px; border: none; background: transparent;
  font-family: inherit; font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text); text-align: start;
  border-radius: var(--radius-md); cursor: pointer; transition: background-color var(--duration-fast); }
.twc-dt__mi:hover { background: var(--color-surface-sunken); }
.twc-dt__mi:disabled { color: var(--color-text-subtle); opacity: 0.5; cursor: default; pointer-events: none; }
.twc-dt__mi svg { width: 16px; height: 16px; color: var(--color-text-subtle); flex: none; }
.twc-dt__mi[data-active="true"] { color: var(--color-primary); }
.twc-dt__mi[data-active="true"] svg { color: var(--color-primary); }
.twc-dt__sep { height: 1px; background: var(--color-divider); margin: 5px 4px; }

/* Columns panel */
.twc-dt__cols { width: 268px; }
.twc-dt__col-search { display: flex; align-items: center; gap: 7px; height: 34px; margin: 2px 4px 6px; padding: 0 10px;
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface);
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast); }
.twc-dt__col-search:focus-within { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-dt__col-search svg { width: 15px; height: 15px; color: var(--color-text-subtle); flex: none; }
.twc-dt__col-search input { border: none; outline: none; background: transparent; font-family: inherit; font-size: var(--text-sm); color: var(--color-text); width: 100%; }
.twc-dt__col-search input:focus, .twc-dt__col-search input:focus-visible { outline: none; box-shadow: none; }
.twc-dt__col-search input::placeholder { color: var(--color-text-subtle); }
.twc-dt__col-list { max-height: 230px; overflow-y: auto; }
.twc-dt__col-row { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: var(--radius-md); cursor: pointer; }
.twc-dt__col-row:hover { background: var(--color-surface-sunken); }
.twc-dt__col-row[draggable="true"] { cursor: grab; }
.twc-dt__col-row[data-dragging="true"] { opacity: 0.5; }
.twc-dt__col-row[data-dropbefore="true"] { box-shadow: inset 0 3px 0 var(--color-primary); }
.twc-dt__col-row[data-dropafter="true"] { box-shadow: inset 0 -3px 0 var(--color-primary); }
.twc-dt__col-grip { display: inline-flex; color: var(--color-text-subtle); flex: none; opacity: 0.45; }
.twc-dt__col-row:hover .twc-dt__col-grip { opacity: 0.8; }
.twc-dt__col-grip svg { width: 14px; height: 14px; }
.twc-dt__col-name { flex: 1; font-size: var(--text-sm); }
.twc-dt__sw { width: 32px; height: 18px; border-radius: var(--radius-full); background: var(--color-border-strong); position: relative; flex: none; transition: background-color var(--duration-base); }
.twc-dt__sw[data-on="true"] { background: var(--color-primary); }
.twc-dt__sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: var(--radius-full); background: var(--color-primary-fg); box-shadow: var(--shadow-sm); transition: transform var(--duration-base) var(--ease-spring); }
.twc-dt__sw:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-dt__sw[data-on="true"]::after { transform: translateX(14px); }
.twc-dt__panel-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 8px 8px; }
.twc-dt__panel-title { font-size: var(--text-xs); font-weight: 700; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-text-subtle); }
.twc-dt__link { border: none; background: transparent; color: var(--color-primary); font-family: inherit; font-size: var(--text-xs); font-weight: 600; cursor: pointer; padding: 2px 4px; border-radius: var(--radius-sm); }
.twc-dt__link:hover { background: var(--color-primary-subtle); }

/* Filter panel */
.twc-dt__filters { width: 460px; max-width: calc(100vw - 32px); }
.twc-dt__frow { display: flex; align-items: center; gap: 6px; padding: 5px 4px; }
.twc-dt__f-col { width: 130px; flex: none; }
.twc-dt__f-op { width: 132px; flex: none; }
.twc-dt__f-val { flex: 1; min-width: 0; }
.twc-dt__frm-x { display: inline-grid; place-items: center; width: 30px; height: 38px; border: none; background: transparent; color: var(--color-text-subtle); border-radius: var(--radius-md); cursor: pointer; flex: none; align-self: flex-start; }
.twc-dt__frm-x:hover { background: var(--color-danger-subtle); color: var(--color-danger-subtle-fg); }
.twc-dt__frm-x svg { width: 15px; height: 15px; }
.twc-dt__empty { padding: 30px 12px; text-align: center; color: var(--color-text-subtle); font-size: var(--text-sm); }

/* Action cell */
.twc-dt__th[data-actions-col="true"], .twc-dt__td[data-actions="true"] { border-left: var(--border-thin) solid var(--color-border); }
.twc-dt__td[data-actions="true"] { overflow: visible; }
.twc-dt__actions { display: inline-flex; align-items: center; gap: 2px; width: 100%; }

/* Editable cells */
.twc-dt__td[data-editable="true"] { position: relative; cursor: text; padding-inline-end: 30px; }
.twc-dt__td[data-editable="true"]:hover { box-shadow: inset 0 0 0 1px var(--color-border-strong); }
.twc-dt__edit-hint { position: absolute; inset-inline-end: 8px; top: 50%; transform: translateY(-50%); display: none;
  align-items: center; justify-content: center; color: var(--color-primary); pointer-events: none; }
.twc-dt__edit-hint svg { width: 13px; height: 13px; }
.twc-dt__td[data-editable="true"]:hover .twc-dt__edit-hint { display: inline-flex; }
/* Editing state — the cell becomes a transparent shell; the editor itself is the rounded control */
.twc-dt__td[data-editing="true"] { padding: 0 6px; overflow: visible; box-shadow: none; background: var(--color-surface); }
.twc-dt__editor-wrap { width: 100%; }
.twc-dt__editor {
  width: 100%; height: 32px; box-sizing: border-box; padding: 0 10px;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text);
  background: var(--color-surface); border: var(--border-medium) solid var(--color-primary);
  border-radius: var(--radius-md); outline: none; box-shadow: var(--ring);
}
.twc-dt__td[data-num="true"] .twc-dt__editor { text-align: end; }
/* Keyboard focus (roving tabindex) */
.twc-dt__td:focus { outline: none; }
.twc-dt__td:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--color-primary); border-radius: 2px; }
.twc-dt__check:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-dt__th-label:focus-visible { outline: none; box-shadow: var(--ring); border-radius: var(--radius-sm); }
.twc-dt__act { display: inline-grid; place-items: center; width: 30px; height: 30px; border: none; background: transparent;
  color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-md);
  transition: background-color var(--duration-fast), color var(--duration-fast), transform var(--duration-fast) var(--ease-spring); }
.twc-dt__act:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-dt__act:active { transform: scale(0.88); }
.twc-dt__act[data-danger="true"]:hover { background: var(--color-danger-subtle); color: var(--color-danger-subtle-fg); }
.twc-dt__act svg { width: 16px; height: 16px; }

/* Batch (selection) toolbar overlay */
.twc-dt__batch { position: absolute; inset: 0; z-index: 6; display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; background: var(--color-primary-subtle); animation: twico-slide-down var(--duration-fast) var(--ease-out); }
.twc-dt__batch-x { display: inline-grid; place-items: center; width: 28px; height: 28px; border: none; background: transparent;
  color: var(--color-primary-subtle-fg); cursor: pointer; border-radius: var(--radius-md); transition: background-color var(--duration-fast); flex: none; }
.twc-dt__batch-x:hover { background: color-mix(in srgb, var(--color-primary) 20%, transparent); }
.twc-dt__batch-x svg { width: 16px; height: 16px; }
.twc-dt__batch-count { font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-primary-subtle-fg); white-space: nowrap; }
.twc-dt__batch-actions { margin-inline-start: auto; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.twc-dt__batch-btn { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px;
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface);
  color: var(--color-text); font-family: inherit; font-size: var(--text-xs); font-weight: var(--font-semibold); cursor: pointer;
  transition: border-color var(--duration-fast), color var(--duration-fast), background-color var(--duration-fast); }
.twc-dt__batch-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.twc-dt__batch-btn[data-danger="true"]:hover { border-color: var(--color-danger); color: var(--color-danger-subtle-fg); background: var(--color-danger-subtle); }
.twc-dt__batch-btn svg { width: 15px; height: 15px; }
`;

const I = {
  arrow: "M12 19V5M5 12l7-7 7 7",
  filter: "M3 4h18l-7 8v6l-4 2v-8z",
  columns: "M3 3h18v18H3zM9 3v18M15 3v18",
  eyeOff: "M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20",
  pinL: "M9 4v6l-3 3v2h12v-2l-3-3V4M12 17v4",
  pin: "M12 17v5M9 4h6l-1 7 3 2v2H7v-2l3-2z",
  more: "M12 5h.01M12 12h.01M12 19h.01",
  check: "M20 6 9 17l-5-5",
  minus: "M5 12h14",
  x: "M18 6 6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  density: "M3 6h18M3 12h18M3 18h18",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  grip: "M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01",
  pencil: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z",
  sigma: "M18 7V5a1 1 0 0 0-1-1H6l6 8-6 8h11a1 1 0 0 0 1-1v-2",
  chevDown: "m6 9 6 6 6-6",
  group: "M3 6h7M3 12h11M3 18h7M17 9l3 3-3 3",
  pinUp: "M12 19V5M6 11l6-6 6 6",
  pinDown: "M12 5v14M6 13l6 6 6-6",
  pivot: "M3 3h18v18H3zM3 9h18M9 9v12M9 3v6",
  chevronDown: "M6 9l6 6 6-6",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6",
  sheet: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  braces: "M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1",
};
function Svg({ d, ...p }) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
  </svg>);
}

const STR_OPS = [
  { value: "contains", label: "contains" },
  { value: "equals", label: "equals" },
  { value: "isAnyOf", label: "is any of", multi: true },
  { value: "startsWith", label: "starts with" },
  { value: "endsWith", label: "ends with" },
  { value: "isEmpty", label: "is empty", noInput: true },
  { value: "isNotEmpty", label: "is not empty", noInput: true },
];
const NUM_OPS = [
  { value: "=", label: "=" }, { value: "!=", label: "≠" },
  { value: ">", label: ">" }, { value: ">=", label: "≥" },
  { value: "<", label: "<" }, { value: "<=", label: "≤" },
  { value: "isAnyOf", label: "is any of", multi: true },
];
const opsFor = (type) => (type === "number" ? NUM_OPS : STR_OPS);
const isMultiOp = (op) => op === "isAnyOf";

function testFilter(raw, op, target, type) {
  if (op === "isEmpty") return raw == null || raw === "";
  if (op === "isNotEmpty") return !(raw == null || raw === "");
  if (op === "isAnyOf") {
    if (!Array.isArray(target) || target.length === 0) return true;
    return target.map(String).includes(String(raw));
  }
  if (target === "" || target == null) return true;
  if (type === "number") {
    const a = Number(raw), b = Number(target);
    if (Number.isNaN(a) || Number.isNaN(b)) return true;
    switch (op) { case "=": return a === b; case "!=": return a !== b; case ">": return a > b;
      case ">=": return a >= b; case "<": return a < b; case "<=": return a <= b; default: return true; }
  }
  const s = String(raw ?? "").toLowerCase(), t = String(target).toLowerCase();
  switch (op) {
    case "equals": return s === t;
    case "startsWith": return s.startsWith(t);
    case "endsWith": return s.endsWith(t);
    default: return s.includes(t);
  }
}

/**
 * Apply a Datatable server-query (the object passed to `onServerChange`) to a
 * plain array of rows — quick search, per-column filters, sort, and paging —
 * using the EXACT same operator semantics the grid uses in client mode. Returns
 * the current page (`rows`), the filtered `total` (for `rowCount`), and the full
 * `filtered` set (pre-paging, e.g. to compute server-side aggregation totals).
 *
 * Lets you drive a `serverMode` Datatable from any backend (or fake one in tests)
 * and get results identical to client mode. Pass `columns` so number columns
 * compare numerically and quick-search scans the right fields.
 */
export function runDatatableQuery(rows, query, options = {}) {
  const q = query || {};
  const cols = options.columns || [];
  const typeOf = (field) => (cols.find((c) => c.field === field)?.type === "number" ? "number" : "string");
  const searchFields = options.searchFields
    || (cols.length ? cols.filter((c) => c.field && c.type !== "actions").map((c) => c.field)
                    : (rows && rows[0] ? Object.keys(rows[0]) : []));

  let out = Array.isArray(rows) ? rows : [];
  const quick = String(q.quickFilter || "").trim().toLowerCase();
  if (quick) out = out.filter((r) => searchFields.some((f) => String(r[f] ?? "").toLowerCase().includes(quick)));
  for (const f of q.filters || []) out = out.filter((r) => testFilter(r[f.field], f.op, f.value, typeOf(f.field)));
  if (q.sort && q.sort.field) {
    const { field, dir } = q.sort, numeric = typeOf(field) === "number";
    out = [...out].sort((a, b) => {
      const av = a[field], bv = b[field];
      if (av == null) return 1; if (bv == null) return -1;
      const r = numeric ? av - bv : String(av).localeCompare(String(bv));
      return dir === "desc" ? -r : r;
    });
  }
  const total = out.length;
  const pageSize = q.pageSize ?? 0;
  const page = pageSize > 0 ? out.slice((q.page || 0) * pageSize, (q.page || 0) * pageSize + pageSize) : out;
  return { rows: page, total, filtered: out };
}

function useFloating() {
  const [pos, setPos] = React.useState(null);
  const open = (el, align = "left", width = 220) => {
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight, M = 8;
    // anchor left edge; right-aligned menus start from the trigger's right edge
    let left = align === "right" ? r.right - width : r.left;
    // clamp into the viewport so menus never clip off-screen
    left = Math.max(M, Math.min(left, vw - width - M));
    let top = r.bottom + 6;
    setPos({ top, left, width, anchorX: r.left + r.width / 2, maxHeight: Math.max(180, vh - top - M) });
  };
  return [pos, open, () => setPos(null)];
}

function Caret({ pos }) {
  if (!pos) return null;
  const left = Math.max(12, Math.min(pos.anchorX - pos.left, pos.width - 20));
  return <span className="twc-dt__caret" style={{ left }} />;
}

function EditCell({ col, value, options, onChange, onCommit, onCommitValue, onCancel, onKeyDown }) {
  const ref = React.useRef(null);
  const isSelect = col.editType === "select" || (options && col.editType !== "text");

  React.useEffect(() => {
    if (isSelect) {
      // auto-open the Twico Select popover so one double-click is enough
      const t = setTimeout(() => ref.current?.querySelector(".twc-sel__trigger")?.click(), 0);
      return () => clearTimeout(t);
    }
    const el = ref.current; if (!el) return;
    el.focus();
    if (el.select && col.type !== "number") el.select();
  }, [isSelect]);

  if (isSelect) {
    const opts = options || (col.valueOptions || []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));
    return (
      <div className="twc-dt__editor-wrap" ref={ref}
        onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onCancel(); } }}>
        <Select size="sm" value={value ?? ""} options={opts} placeholder="Select…"
          onChange={(v) => onCommitValue(v)} />
      </div>
    );
  }
  return (
    <div className="twc-dt__editor-wrap">
      <input
        ref={ref}
        className="twc-dt__editor"
        type={col.type === "number" ? "number" : "text"}
        value={value ?? ""}
        aria-label={`Edit ${col.headerName}`}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onCommit}
      />
    </div>
  );
}

export function Datatable({
  columns, rows, loading = false, rowKey, checkboxSelection = false,
  density: densityProp = "standard", pageSize = 10, pageSizeOptions = [5, 10, 25, 50],
  height = 440, serverMode = false, rowCount, onServerChange, batchActions = [],
  showExport = true, exportFilename = "export", aggregationValues = null,
  disableColumnReorder = false, disableColumnResize = false,
  editMode = false, onRowUpdate, onRowsChange, onBatchUpdate,
  showPageJumper = true,
  selectionMode = "none", onRowClick, onCellClick, onActiveCellChange,
  showAggregation = false, ariaLabel = "Data table", "aria-label": ariaLabelAttr, rowGrouping = [],
  rowPinning = false, rowReorder = false, rowResize = false, onRowOrderChange,
  pivot = null, pivotMode = false,
  virtualized = false, overscan = 8, rowHeight,
  className = "", ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-dt-styles")) return;
    const el = document.createElement("style"); el.id = "twc-dt-styles"; el.textContent = DT_CSS;
    document.head.appendChild(el);
  }, []);

  const cols = React.useMemo(() => columns.map((c) => {
    const isActions = c.type === "actions";
    return {
      width: isActions ? 120 : 160, type: "string",
      sortable: !isActions, filterable: !isActions, hideable: !isActions, pinnable: true,
      groupable: !isActions && c.type !== "number",
      disableColumnMenu: false, headerName: isActions ? "Actions" : c.field,
      align: c.type === "number" ? "right" : isActions ? "right" : "left", ...c,
    };
  }), [columns]);

  const keyOf = rowKey || ((r, i) => r.id ?? i);
  const [sort, setSort] = React.useState(null);
  const [filters, setFilters] = React.useState([]);
  const [hidden, setHidden] = React.useState(() => new Set());
  const [pins, setPins] = React.useState(() => {
    const left = [], right = [];
    columns.forEach((c) => { if (c.pinned === "left") left.push(c.field); else if (c.pinned === "right") right.push(c.field); });
    return { left, right };
  });
  const [density, setDensity] = React.useState(densityProp);
  const [quick, setQuick] = React.useState("");
  const [selected, setSelected] = React.useState(() => new Set());
  const [activeRow, setActiveRow] = React.useState(null);
  const [activeCell, setActiveCell] = React.useState(null); // { key, field }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(pageSize > 0 ? pageSize : 10);
  const [colQuery, setColQuery] = React.useState("");
  const [widths, setWidths] = React.useState({});
  const [order, setOrder] = React.useState(() => columns.map((c) => c.field));
  const [drag, setDrag] = React.useState({ from: null, over: null, after: false });
  const [aggOn, setAggOn] = React.useState(showAggregation);
  const [focus, setFocus] = React.useState({ r: 0, c: 0 });
  const gridRef = React.useRef(null);
  const [groupBy, setGroupBy] = React.useState(rowGrouping || []);
  const [collapsed, setCollapsed] = React.useState(() => new Set());
  const [pinnedRows, setPinnedRows] = React.useState({ top: [], bottom: [] });
  const [headH, setHeadH] = React.useState(41);
  const theadRef = React.useRef(null);
  const [rowOrder, setRowOrder] = React.useState(null);
  const [rowHeights, setRowHeights] = React.useState({});
  const [rowDrag, setRowDrag] = React.useState({ from: null, over: null, after: false });
  // Keyboard row reorder ("grab" mode): { key, index } where index is the live target slot among middleRows.
  const [rowGrab, setRowGrab] = React.useState(null);
  const [reorderMsg, setReorderMsg] = React.useState("");
  const rowFocusRef = React.useRef(null); // key to restore focus to after a keyboard drop
  // Collapse the toolbar to icon-only when the grid is too narrow for full labels.
  const rootRef = React.useRef(null);
  const [compact, setCompact] = React.useState(false);
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const measure = () => setCompact((el.clientWidth || 0) < 720);
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(el);
    else if (typeof window !== "undefined") window.addEventListener("resize", measure);
    return () => {
      if (ro) ro.disconnect();
      else if (typeof window !== "undefined") window.removeEventListener("resize", measure);
    };
  }, []);
  // Row virtualization scroll state.
  const scrollRef = React.useRef(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportH, setViewportH] = React.useState(0);
  const [pivotOn, setPivotOn] = React.useState(pivotMode);
  // Runtime, user-editable aggregation config: { [field]: "sum"|"avg"|"min"|"max"|"count" }
  const [aggConfig, setAggConfig] = React.useState(() => {
    const m = {}; (columns || []).forEach((c) => { if (typeof c.aggregation === "string") m[c.field] = c.aggregation; });
    return m;
  });
  // Effective aggregation for a column: user config wins, else a function preset on the column.
  const aggOf = (c) => aggConfig[c.field] || (typeof c.aggregation === "function" ? c.aggregation : null);
  // Runtime, user-editable pivot model.
  const [pivotConfig, setPivotConfig] = React.useState(() => ({
    rows: (pivot && pivot.rows) || [], columns: (pivot && pivot.columns) || [],
    values: (pivot && pivot.values) || [],
  }));
  const pivotActive = pivotOn && pivotConfig.rows.length > 0 && pivotConfig.values.length > 0;

  // Keep custom order in sync if the columns prop changes (add new, drop removed).
  React.useEffect(() => {
    setOrder((prev) => {
      const fields = columns.map((c) => c.field);
      const kept = prev.filter((f) => fields.includes(f));
      const added = fields.filter((f) => !kept.includes(f));
      return [...kept, ...added];
    });
  }, [columns]);

  // Live-sync the props that seed internal toolbar state: changing the prop re-applies it
  // (the user can still adjust each one from the toolbar between prop changes).
  React.useEffect(() => { setDensity(densityProp); }, [densityProp]);
  React.useEffect(() => { setAggOn(showAggregation); }, [showAggregation]);
  // Keyed on content (not array identity) so inline `rowGrouping={[…]}` literals don't reset the user's grouping.
  const rowGroupingKey = (rowGrouping || []).join("\u0000");
  const rowGroupingKeyRef = React.useRef(rowGroupingKey);
  React.useEffect(() => {
    if (rowGroupingKeyRef.current === rowGroupingKey) return;
    rowGroupingKeyRef.current = rowGroupingKey;
    setGroupBy(rowGrouping || []);
  }, [rowGroupingKey]);

  const widthOf = (c) => widths[c.field] ?? c.width ?? 160;

  const [colMenu, setColMenu] = React.useState(null);
  const [menuPos, openMenu, closeMenu] = useFloating();
  const [panel, setPanel] = React.useState(null);
  const [panelPos, openPanel, closePanel] = useFloating();
  const [rowMenu, setRowMenu] = React.useState(null);
  const [rowMenuPos, openRowMenu, closeRowMenu] = useFloating();
  const [exportOpen, setExportOpen] = React.useState(false);
  const [exportPos, openExport, closeExport] = useFloating();
  // ARIA menu focus management: remember the trigger so focus returns to it on close.
  const menuTriggerRef = React.useRef(null);
  const colMenuRef = React.useRef(null);
  const rowMenuRef = React.useRef(null);
  const exportMenuRef = React.useRef(null);
  // Move focus to the first item when a menu opens; restore to the trigger when it closes.
  function focusFirstItem(container) {
    if (!container) return;
    const first = container.querySelector('[role="menuitem"]:not([disabled])');
    if (first) first.focus();
  }
  function restoreTriggerFocus() {
    const t = menuTriggerRef.current; menuTriggerRef.current = null;
    if (t && document.contains(t)) t.focus();
  }
  // Roving ArrowUp/Down + Home/End inside an open menu; Tab/Escape close-and-restore is handled by the
  // shared outside-click/Escape effects plus onKeyDown below.
  function onMenuKeyDown(e, closeFn) {
    const container = e.currentTarget;
    const items = Array.from(container.querySelectorAll('[role="menuitem"]:not([disabled])'));
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(idx + 1 + items.length) % items.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); items[(idx - 1 + items.length) % items.length].focus(); }
    else if (e.key === "Home") { e.preventDefault(); items[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === "Tab") { e.preventDefault(); closeFn(); restoreTriggerFocus(); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeFn(); restoreTriggerFocus(); }
  }
  // After each menu opens (its container mounts), pull focus to the first item.
  React.useEffect(() => { if (colMenu) focusFirstItem(colMenuRef.current); }, [colMenu]);
  React.useEffect(() => { if (rowMenu) focusFirstItem(rowMenuRef.current); }, [rowMenu]);
  React.useEffect(() => { if (exportOpen) focusFirstItem(exportMenuRef.current); }, [exportOpen]);

  React.useEffect(() => {
    if (!colMenu && !panel && !rowMenu) return;
    const closeAll = () => { setColMenu(null); closeMenu(); setPanel(null); closePanel(); setRowMenu(null); closeRowMenu(); };
    const onDown = (e) => { if (!e.target.closest(".twc-dt__pop") && !e.target.closest(".twc-pop") && !e.target.closest(".twc-dt__menu-btn") && !e.target.closest(".twc-dt__tbtn") && !e.target.closest(".twc-dt__act")) closeAll(); };
    const onKey = (e) => { if (e.key === "Escape") closeAll(); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [colMenu, panel, rowMenu]);

  // Dedicated outside-click for the export menu so it closes on ANY click outside it
  // (including other toolbar buttons like Filters).
  React.useEffect(() => {
    if (!exportOpen) return;
    const close = () => { setExportOpen(false); closeExport(); };
    const onDown = (e) => { if (!e.target.closest(".twc-dt__pop") && !e.target.closest(".twc-dt__export")) close(); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [exportOpen]);

  const colByField = React.useMemo(() => Object.fromEntries(cols.map((c) => [c.field, c])), [cols]);
  const visibleCols = cols.filter((c) => !hidden.has(c.field));
  const ordered = React.useMemo(() => {
    const orderIdx = (f) => { const i = order.indexOf(f); return i === -1 ? 9999 : i; };
    const L = pins.left.map((f) => colByField[f]).filter((c) => c && !hidden.has(c.field));
    const R = pins.right.map((f) => colByField[f]).filter((c) => c && !hidden.has(c.field));
    const mid = visibleCols
      .filter((c) => !pins.left.includes(c.field) && !pins.right.includes(c.field))
      .sort((a, b) => orderIdx(a.field) - orderIdx(b.field));
    return [...L, ...mid, ...R];
  }, [pins, hidden, visibleCols, colByField, order]);

  const stickyOf = (field) => {
    if (pins.left.includes(field)) {
      let off = checkboxSelection ? 44 : 0;
      for (const f of pins.left) { if (f === field) break; off += widthOf(colByField[f] || {}); }
      const isEdge = pins.left[pins.left.length - 1] === field;
      return { style: { left: off }, pin: "left", edge: isEdge ? "left" : undefined };
    }
    if (pins.right.includes(field)) {
      let off = 0; const rev = [...pins.right].reverse();
      for (const f of rev) { if (f === field) break; off += widthOf(colByField[f] || {}); }
      const isEdge = pins.right[0] === field;
      return { style: { right: off }, pin: "right", edge: isEdge ? "right" : undefined };
    }
    return {};
  };

  const processed = React.useMemo(() => {
    if (serverMode) {
      if (rowOrder) { const idx = new Map(rowOrder.map((k, i) => [k, i])); return [...rows].sort((a, b) => (idx.get(keyOf(a)) ?? 1e9) - (idx.get(keyOf(b)) ?? 1e9)); }
      return rows;   // server already returns the filtered/sorted page
    }
    let out = rows;
    if (quick.trim()) {
      const q = quick.trim().toLowerCase();
      out = out.filter((r) => visibleCols.some((c) => String(r[c.field] ?? "").toLowerCase().includes(q)));
    }
    for (const f of filters) {
      const col = colByField[f.field]; if (!col) continue;
      out = out.filter((r) => testFilter(r[f.field], f.op, f.value, col.type));
    }
    if (sort) {
      const col = colByField[sort.field];
      out = [...out].sort((a, b) => {
        const av = a[sort.field], bv = b[sort.field];
        if (av == null) return 1; if (bv == null) return -1;
        const r = col?.type === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sort.dir === "desc" ? -r : r;
      });
    }
    if (rowOrder && !sort) {
      const idx = new Map(rowOrder.map((k, i) => [k, i]));
      out = [...out].sort((a, b) => (idx.get(keyOf(a)) ?? 1e9) - (idx.get(keyOf(b)) ?? 1e9));
    }
    return out;
  }, [rows, quick, filters, sort, visibleCols, colByField, serverMode, rowOrder]);

  const paginated = pageSize > 0;
  const serverTotal = rowCount == null ? processed.length : rowCount;
  const totalRows = serverMode ? serverTotal : processed.length;
  const totalPages = paginated ? Math.max(1, Math.ceil(totalRows / rowsPerPage)) : 1;
  const paged = !paginated || serverMode ? processed : processed.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  React.useEffect(() => { if (page > totalPages - 1) setPage(0); }, [totalPages]);

  // ---- Row grouping ----
  // Groups the rendered page by one or more fields into collapsible group rows.
  // (Operates over the current page; disable pagination with pageSize={0} to group all client rows.)
  const activeGroupBy = React.useMemo(() => groupBy.filter((f) => colByField[f]), [groupBy, colByField]);
  function subtotalText(rowsIn) {
    const parts = [];
    for (const c of ordered) {
      const agg = aggOf(c);
      if (!agg) continue;
      const v = computeAgg({ ...c, aggregation: agg }, rowsIn);
      if (v == null) continue;
      const disp = c.aggregationFormatter ? c.aggregationFormatter(v) : c.valueFormatter ? c.valueFormatter(v, null) : (typeof v === "number" ? v.toLocaleString() : v);
      parts.push(`${c.headerName} ${disp}`);
    }
    return parts;
  }
  function computeAgg(col, data) {
    const agg = col.aggregation; if (!agg) return null;
    const raw = data.map((r) => r[col.field]).filter((v) => v != null && v !== "");
    if (typeof agg === "function") return agg(raw, data);
    if (agg === "count") return raw.length;
    const nums = raw.map(Number).filter((n) => !Number.isNaN(n));
    if (!nums.length) return null;
    if (agg === "sum") return nums.reduce((a, b) => a + b, 0);
    if (agg === "avg") return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
    if (agg === "min") return Math.min(...nums);
    if (agg === "max") return Math.max(...nums);
    return null;
  }
  const displayItems = React.useMemo(() => {
    if (!activeGroupBy.length) return null;
    const build = (rowsIn, depth, prefix) => {
      if (depth >= activeGroupBy.length) return rowsIn.map((row) => ({ kind: "leaf", row }));
      const field = activeGroupBy[depth];
      const map = new Map();
      for (const r of rowsIn) { const v = r[field] == null || r[field] === "" ? "—" : r[field]; if (!map.has(v)) map.set(v, []); map.get(v).push(r); }
      const items = [];
      for (const [value, rs] of map) {
        const key = `${prefix}/${field}:${value}`;
        const isCollapsed = collapsed.has(key);
        items.push({ kind: "group", key, field, value, depth, count: rs.length, rows: rs, collapsed: isCollapsed });
        if (!isCollapsed) items.push(...build(rs, depth + 1, key));
      }
      return items;
    };
    return build(paged, 0, "");
  }, [activeGroupBy, collapsed, paged, ordered, aggOn]);
  const leafRows = displayItems ? displayItems.filter((i) => i.kind === "leaf").map((i) => i.row) : paged;
  function toggleGroup(key) { setCollapsed((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; }); }
  function toggleGroupField(field) { setGroupBy((g) => (g.includes(field) ? g.filter((f) => f !== field) : [...g, field])); }

  // ---- Row pinning (sticky pinned rows above/below the scroll body) ----
  const pinSideOf = (key) => pinnedRows.top.includes(key) ? "top" : pinnedRows.bottom.includes(key) ? "bottom" : null;
  function pinRow(key, side) {
    setPinnedRows((p) => {
      const top = p.top.filter((k) => k !== key), bottom = p.bottom.filter((k) => k !== key);
      if (side === "top") top.push(key); else if (side === "bottom") bottom.push(key);
      return { top, bottom };
    });
  }
  React.useEffect(() => {
    if (!rowPinning) return;
    const measure = () => { if (theadRef.current) setHeadH(theadRef.current.offsetHeight || 41); };
    measure();
    const ro = window.ResizeObserver ? new ResizeObserver(measure) : null;
    if (ro && theadRef.current) ro.observe(theadRef.current);
    return () => ro && ro.disconnect();
  }, [rowPinning, density]);
  // Partition leaf rows: pinned rows render in sticky bands (only when not grouping).
  const canPinRows = rowPinning && !activeGroupBy.length;
  const pinnedTopRows = canPinRows ? pinnedRows.top.map((k) => leafRows.find((r, i) => keyOf(r, i) === k)).filter(Boolean) : [];
  const pinnedBottomRows = canPinRows ? pinnedRows.bottom.map((k) => leafRows.find((r, i) => keyOf(r, i) === k)).filter(Boolean) : [];
  const middleRows = canPinRows ? leafRows.filter((r, i) => !pinSideOf(keyOf(r, i))) : leafRows;
  const keyIndex = React.useMemo(() => { const m = new Map(); leafRows.forEach((r, i) => m.set(keyOf(r, i), i)); return m; }, [leafRows]);
  // Position of each key within middleRows — used by keyboard reorder to highlight the live target slot.
  const keyIndexMid = React.useMemo(() => { const m = new Map(); middleRows.forEach((r, i) => m.set(keyOf(r, keyIndex.get(keyOf(r)) ?? i), i)); return m; }, [middleRows, keyIndex]);

  // ---- Row reordering (drag) + row resizing (drag bottom edge) ----
  const canReorderRows = rowReorder && !activeGroupBy.length && !sort;
  function onRowDrop(targetKey) {
    const fromKey = rowDrag.from;
    setRowDrag({ from: null, over: null, after: false });
    if (fromKey == null || fromKey === targetKey) return;
    const base = (rowOrder && rowOrder.length ? rowOrder.slice() : processed.map((r) => keyOf(r)));
    for (const r of processed) { const k = keyOf(r); if (!base.includes(k)) base.push(k); }
    const next = base.filter((k) => k !== fromKey);
    let idx = next.indexOf(targetKey);
    if (idx === -1) return;
    if (rowDrag.after) idx += 1;
    next.splice(idx, 0, fromKey);
    setRowOrder(next); onRowOrderChange?.(next);
  }
  function startRowResize(e, key, tr) {
    e.preventDefault(); e.stopPropagation();
    const startY = e.clientY; const startH = rowHeights[key] || tr?.offsetHeight || 44;
    const onMove = (ev) => { const h = Math.max(32, Math.round(startH + (ev.clientY - startY))); setRowHeights((m) => ({ ...m, [key]: h })); };
    const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
  }

  // Commit a keyboard reorder that moves `fromKey` to the slot occupied by `middleRows[targetIndex]`,
  // sharing the same persistence path as drag-drop (setRowOrder/onRowOrderChange). Targeting by the
  // neighbor's key (not a raw index) keeps it correct when pinned rows are interleaved.
  function commitRowMove(fromKey, targetIndex) {
    const targetRow = middleRows[Math.max(0, Math.min(targetIndex, middleRows.length - 1))];
    const targetKey = targetRow ? keyOf(targetRow, keyIndex.get(keyOf(targetRow)) ?? 0) : null;
    const base = (rowOrder && rowOrder.length ? rowOrder.slice() : processed.map((r) => keyOf(r)));
    for (const r of processed) { const k = keyOf(r); if (!base.includes(k)) base.push(k); }
    const fromIdx = base.indexOf(fromKey);
    if (fromIdx === -1) return;
    base.splice(fromIdx, 1);
    let insertAt = targetKey == null ? base.length : base.indexOf(targetKey);
    if (insertAt === -1) insertAt = base.length;
    // Moving down past the target lands after it; moving up lands before it.
    const fromMid = keyIndexMid.get(fromKey);
    if (fromMid != null && targetIndex > fromMid) insertAt += 1;
    base.splice(insertAt, 0, fromKey);
    setRowOrder(base); onRowOrderChange?.(base);
  }
  // Keyboard reorder on a row drag handle: Enter/Space grabs & drops, ArrowUp/Down move, Escape cancels.
  function onRowHandleKey(e, key, currentIdx, rowLabel) {
    const grabbed = rowGrab && rowGrab.key === key;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!grabbed) {
        setRowGrab({ key, index: currentIdx });
        setReorderMsg(`${rowLabel} grabbed, row ${currentIdx + 1} of ${middleRows.length}. Use the up and down arrow keys to move, Enter to drop, Escape to cancel.`);
      } else {
        rowFocusRef.current = key;
        commitRowMove(key, rowGrab.index);
        setReorderMsg(`${rowLabel} dropped at row ${rowGrab.index + 1} of ${middleRows.length}.`);
        setRowGrab(null);
      }
    } else if (grabbed && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      const next = Math.max(0, Math.min(rowGrab.index + (e.key === "ArrowDown" ? 1 : -1), middleRows.length - 1));
      if (next !== rowGrab.index) { setRowGrab({ key, index: next }); setReorderMsg(`${rowLabel} moved to row ${next + 1} of ${middleRows.length}. Press Enter to drop.`); }
    } else if (grabbed && e.key === "Escape") {
      e.preventDefault();
      rowFocusRef.current = key;
      setRowGrab(null);
      setReorderMsg("Reorder cancelled.");
    }
  }
  // Restore focus to a moved row's drag handle after a keyboard drop/cancel re-renders the rows.
  React.useEffect(() => {
    if (rowFocusRef.current == null) return;
    const key = rowFocusRef.current; rowFocusRef.current = null;
    const root = gridRef.current; if (!root) return;
    const sel = (typeof CSS !== "undefined" && CSS.escape) ? CSS.escape(String(key)) : String(key).replace(/"/g, '\\"');
    const el = root.querySelector(`.twc-dt__row-handle[data-row-key="${sel}"]`);
    if (el) el.focus();
  });

  // ---- Row virtualization (opt-in) ----
  // Estimated fixed row height from density (overridable via rowHeight). Windowing only kicks in
  // when there's a fixed scroll viewport to measure against AND pagination is off, and never while
  // row grouping is active (group rows have variable structure) — see docs for the trade-off.
  const estRowH = rowHeight ?? (density === "compact" ? 36 : density === "comfortable" ? 56 : 44);
  // Only window when pagination is off (a paginated slice is already small) and not grouping/loading.
  const virtualizing = virtualized && !paginated && !activeGroupBy.length && !loading;
  // Measure the scroll viewport so the window matches what's actually visible.
  React.useEffect(() => {
    if (!virtualizing) return;
    const el = scrollRef.current; if (!el) return;
    const measure = () => setViewportH(el.clientHeight);
    measure();
    const ro = window.ResizeObserver ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(el);
    return () => ro && ro.disconnect();
  }, [virtualizing, height]);
  const onScrollVirtual = React.useCallback((e) => { setScrollTop(e.currentTarget.scrollTop); }, []);
  // Window the middle (non-pinned) rows. Pinned top/bottom rows always render (they're sticky).
  const vh = viewportH || (typeof height === "number" ? height : 440);
  const vWindow = React.useMemo(() => {
    if (!virtualizing) return null;
    const total = middleRows.length;
    const visCount = Math.ceil(vh / estRowH) + 1;
    let start = Math.max(0, Math.floor(scrollTop / estRowH) - overscan);
    let end = Math.min(total, Math.floor(scrollTop / estRowH) + visCount + overscan);
    if (start > end) start = end;
    return { start, end, padTop: start * estRowH, padBottom: Math.max(0, (total - end) * estRowH) };
  }, [virtualizing, middleRows.length, vh, estRowH, scrollTop, overscan]);

  // Server-side: report state changes so the parent can fetch the right slice (debounced).
  const onServerChangeRef = React.useRef(onServerChange);
  onServerChangeRef.current = onServerChange;
  React.useEffect(() => {
    if (!serverMode) return;
    const t = setTimeout(() => {
      onServerChangeRef.current?.({
        page, pageSize: rowsPerPage, sort,
        filters: filters.map(({ id, ...f }) => f),
        quickFilter: quick.trim(),
      });
    }, 250);
    return () => clearTimeout(t);
  }, [serverMode, page, rowsPerPage, sort, filters, quick]);

  function cycleSort(field) {
    setSort((s) => !s || s.field !== field ? { field, dir: "asc" } : s.dir === "asc" ? { field, dir: "desc" } : null);
  }
  function addFilter(field) {
    const col = colByField[field] || cols[0];
    setFilters((f) => [...f, { id: Date.now() + Math.random(), field: col.field, op: opsFor(col.type)[0].value, value: "" }]);
  }
  function setPin(field, side) {
    setPins((p) => {
      const left = p.left.filter((f) => f !== field), right = p.right.filter((f) => f !== field);
      if (side === "left") left.push(field); else if (side === "right") right.unshift(field);
      return { left, right };
    });
  }
  function toggleHiddenField(field) {
    setHidden((h) => { const n = new Set(h); n.has(field) ? n.delete(field) : n.add(field); return n; });
  }
  // The visible, unpinned columns in current order — the movable "middle" band that the
  // drag-reorder path can rearrange (pinned/left/right + actions stay put). Shared by the
  // keyboard moveCol() below and the column menu's Move left/right enable gate.
  const movableMidFields = React.useMemo(
    () => ordered.filter((c) => !pins.left.includes(c.field) && !pins.right.includes(c.field)).map((c) => c.field),
    [ordered, pins]
  );
  // Keyboard alternative to drag-reorder: move a column one slot among the visible, unpinned
  // columns. Goes through the same `order` state the drag path mutates (no public callback exists
  // for columns) and announces via the shared aria-live region.
  function moveCol(field, dir) {
    const mid = movableMidFields;
    const i = mid.indexOf(field); const j = i + dir;
    if (i === -1 || j < 0 || j >= mid.length) return;
    const other = mid[j];
    setOrder((prev) => {
      const next = prev.filter((f) => f !== field);
      const b = next.indexOf(other);
      if (b === -1) return prev;
      next.splice(dir > 0 ? b + 1 : b, 0, field);
      return next;
    });
    const label = colByField[field]?.headerName || field;
    setReorderMsg(`Moved ${label} ${dir < 0 ? "left" : "right"}.`);
  }

  // Distinct value options for "is any of" filters (column.valueOptions, else derived from rows).
  function optionsForField(field) {
    const col = colByField[field];
    if (col?.valueOptions) return col.valueOptions.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
    const set = new Set();
    for (const r of rows) { const v = r[field]; if (v != null && v !== "") set.add(String(v)); if (set.size > 80) break; }
    return [...set].sort((a, b) => a.localeCompare(b)).map((v) => ({ value: v, label: v }));
  }

  // ---- Column resize (pointer drag on the right edge) ----
  const [resizing, setResizing] = React.useState(false);
  function startResize(e, field) {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX; const startW = widthOf(colByField[field]);
    setResizing(true);
    const onMove = (ev) => {
      const w = Math.max(72, Math.round(startW + (ev.clientX - startX)));
      setWidths((m) => ({ ...m, [field]: w }));
    };
    const onUp = () => { setResizing(false); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
  }

  // ---- Column reorder (HTML5 drag-and-drop on header label) ----
  function onColDrop(targetField) {
    const fromField = drag.from;
    setDrag({ from: null, over: null, after: false });
    if (!fromField || fromField === targetField) return;
    setOrder((prev) => {
      const next = prev.filter((f) => f !== fromField);
      let idx = next.indexOf(targetField);
      if (idx === -1) return prev;
      if (drag.after) idx += 1;
      next.splice(idx, 0, fromField);
      return next;
    });
  }

  // ---- Export (client mode: all filtered+sorted rows; server mode: loaded page) ----
  function exportData(format = "csv") {
    const expCols = ordered.filter((c) => c.type !== "actions");
    const source = serverMode ? paged : processed;
    const cellValue = (c, row) => c.exportValue ? c.exportValue(row[c.field], row) : row[c.field];
    const fname = (ext) => `${exportFilename}.${ext}`;
    const download = (text, mime, ext) => {
      const blob = new Blob([text], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = fname(ext);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    // Neutralize spreadsheet formula injection (CWE-1236): cells whose text starts with
    // = + - @ (after optional whitespace) would execute as formulas in Excel/Sheets, so
    // prefix them with a literal apostrophe. Real JS numbers can't carry a payload.
    const defang = (v, s) => (typeof v !== "number" && /^\s*[=+\-@]/.test(s) ? "'" + s : s);

    if (format === "json") {
      const data = source.map((row) => Object.fromEntries(expCols.map((c) => [c.field, cellValue(c, row)])));
      download(JSON.stringify(data, null, 2), "application/json;charset=utf-8;", "json");
      return;
    }
    if (format === "excel") {
      // Excel opens an HTML table saved as .xls — no library needed.
      const esc = (v) => defang(v, String(v == null ? "" : v)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const head = `<tr>${expCols.map((c) => `<th>${esc(c.headerName)}</th>`).join("")}</tr>`;
      const body = source.map((row) => `<tr>${expCols.map((c) => `<td>${esc(cellValue(c, row))}</td>`).join("")}</tr>`).join("");
      const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">${head}${body}</table></body></html>`;
      download(html, "application/vnd.ms-excel;charset=utf-8;", "xls");
      return;
    }
    // csv (default) or tsv
    const sep = format === "tsv" ? "\t" : ",";
    const escape = (v) => {
      const s = defang(v, v == null ? "" : String(v));
      return (format === "tsv" ? /[\t\n]/ : /[",\n]/).test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = expCols.map((c) => escape(c.headerName)).join(sep);
    const lines = source.map((row) => expCols.map((c) => escape(cellValue(c, row))).join(sep));
    const text = "\uFEFF" + [header, ...lines].join("\r\n");
    download(text, format === "tsv" ? "text/tab-separated-values;charset=utf-8;" : "text/csv;charset=utf-8;", format === "tsv" ? "tsv" : "csv");
  }

  // ---- Aggregation / summary footer ----
  function aggregate(col) {
    const agg = aggOf(col);
    if (!agg) return null;
    if (aggregationValues && col.field in aggregationValues) {
      const pre = aggregationValues[col.field];
      // Per-function map { sum, avg, … } honors the user's chosen function; a scalar/node is used as-is.
      if (pre && typeof pre === "object" && !React.isValidElement(pre)) {
        if (typeof agg === "string" && agg in pre) return pre[agg];
      } else {
        return pre;
      }
    }
    const data = serverMode ? paged : processed;
    const raw = data.map((r) => r[col.field]).filter((v) => v != null && v !== "");
    if (typeof agg === "function") return agg(raw, data);
    if (agg === "count") return raw.length;
    const nums = raw.map(Number).filter((n) => !Number.isNaN(n));
    if (!nums.length) return null;
    if (agg === "sum") return nums.reduce((a, b) => a + b, 0);
    if (agg === "avg") return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
    if (agg === "min") return Math.min(...nums);
    if (agg === "max") return Math.max(...nums);
    return null;
  }
  const aggLabels = { sum: "Sum", avg: "Avg", min: "Min", max: "Max", count: "Count" };
  const hasAggregation = ordered.some((c) => aggOf(c));

  const filteredFields = new Set(filters.map((f) => f.field));
  const allSel = paged.length > 0 && paged.every((r) => selected.has(keyOf(r)));
  const someSel = paged.some((r) => selected.has(keyOf(r)));
  function toggleAll() {
    setSelected((s) => { const n = new Set(s); if (allSel) paged.forEach((r) => n.delete(keyOf(r))); else paged.forEach((r) => n.add(keyOf(r))); return n; });
  }
  function toggleRow(k) { setSelected((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; }); }

  // Click-to-select (row or cell mode). Ignores clicks on interactive cell content.
  function handleRowClick(e, k, row) {
    if (selectionMode === "none") return;
    if (e.target.closest("button, a, input, select, .twc-dt__check, .twc-dt__editor-wrap")) return;
    if (selectionMode === "row") {
      setActiveRow(k);
      onRowClick?.(row, k);
      onActiveCellChange?.(null);
    }
  }
  function handleCellClick(e, k, row, col) {
    if (selectionMode !== "cell") return;
    if (e.target.closest("button, a, input, select, .twc-dt__check, .twc-dt__editor-wrap")) return;
    const next = { key: k, field: col.field };
    setActiveCell(next);
    setActiveRow(k);
    onCellClick?.(row[col.field], row, col.field);
    onActiveCellChange?.(next);
  }

  // ---- Keyboard grid navigation (roving tabindex over data cells) ----
  function focusCell(r, c) {
    const el = gridRef.current?.querySelector(`.twc-dt__td[data-r="${r}"][data-c="${c}"]`);
    if (el) el.focus();
  }
  function onGridKeyDown(e) {
    if (editing) return;
    const td = e.target.closest(".twc-dt__td[data-r]");
    if (!td) return;
    let r = +td.getAttribute("data-r"), c = +td.getAttribute("data-c");
    const maxR = leafRows.length - 1, maxC = ordered.length - 1;
    let handled = true;
    switch (e.key) {
      case "ArrowDown": r = Math.min(r + 1, maxR); break;
      case "ArrowUp": r = Math.max(r - 1, 0); break;
      case "ArrowRight": c = Math.min(c + 1, maxC); break;
      case "ArrowLeft": c = Math.max(c - 1, 0); break;
      case "Home": c = e.ctrlKey ? (r = 0, 0) : 0; break;
      case "End": c = maxC; if (e.ctrlKey) r = maxR; break;
      case "Enter": case " ": {
        const col = ordered[c];
        if (col && isColEditable(col)) { e.preventDefault(); beginEdit(keyOf(leafRows[r], r), col, leafRows[r]); return; }
        if (selectionMode === "cell") { e.preventDefault(); handleCellClick({ target: td }, keyOf(leafRows[r], r), leafRows[r], ordered[c]); return; }
        if (selectionMode === "row") { e.preventDefault(); setActiveRow(keyOf(leafRows[r], r)); onRowClick?.(leafRows[r], keyOf(leafRows[r], r)); return; }
        handled = false; break;
      }
      default: handled = false;
    }
    if (handled) { e.preventDefault(); setFocus({ r, c }); focusCell(r, c); }
  }
  React.useEffect(() => { setFocus((f) => ({ r: Math.min(f.r, Math.max(0, leafRows.length - 1)), c: Math.min(f.c, Math.max(0, ordered.length - 1)) })); }, [leafRows.length, ordered.length, page]);

  const selectedRows = React.useMemo(() => rows.filter((r, i) => selected.has(keyOf(r, i))), [rows, selected]);
  function clearSelection() { setSelected(new Set()); }

  // ---- Inline editing ----
  const [editing, setEditing] = React.useState(null); // { key, field, value }
  const isColEditable = (c) => c.type !== "actions" && (c.editable ?? (editMode && c.editable !== false));

  function beginEdit(rowK, col, row) {
    if (!isColEditable(col)) return;
    setEditing({ key: rowK, field: col.field, value: row[col.field] ?? "" });
  }
  function cancelEdit() { setEditing(null); }
  function commitEdit(override) {
    if (!editing) return;
    const col = colByField[editing.field];
    let next = override !== undefined ? override : editing.value;
    if (col?.type === "number") { next = next === "" ? null : Number(next); if (Number.isNaN(next)) next = null; }
    const row = paged.find((r, i) => keyOf(r, i) === editing.key);
    setEditing(null);
    if (!row || row[editing.field] === next) return;
    const updated = { ...row, [editing.field]: next };
    onRowUpdate?.(updated, row, editing.field);
    if (onRowsChange) {
      onRowsChange(rows.map((r, i) => (keyOf(r, i) === editing.key ? updated : r)));
    }
  }
  function onEditKey(e) {
    if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
    else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
  }

  // ---- Batch edit: update one or more columns across all selected rows at once ----
  const batchEditableCols = React.useMemo(
    () => cols.filter((c) => c.type !== "actions" && (c.editable ?? (editMode && c.editable !== false))),
    [cols, editMode]
  );
  const [batchEdit, setBatchEdit] = React.useState(null); // { fields: {field:true}, values: {field:val} }
  const [batchEditPos, openBatchEdit, closeBatchEdit] = useFloating();

  function openBatchEditor(el) {
    setBatchEdit({ fields: {}, values: {} });
    openBatchEdit(el, "left", 320);
  }
  // Outside-click / Escape closes the batch-edit panel.
  React.useEffect(() => {
    if (!batchEdit) return;
    const close = () => { setBatchEdit(null); closeBatchEdit(); };
    const onDown = (e) => { if (!e.target.closest(".twc-dt__pop") && !e.target.closest(".twc-dt__batch")) close(); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [batchEdit]);

  function applyBatchEdit() {
    if (!batchEdit) return;
    const active = batchEditableCols.filter((c) => batchEdit.fields[c.field]);
    if (!active.length) { setBatchEdit(null); closeBatchEdit(); return; }
    const patch = {};
    active.forEach((c) => {
      let v = batchEdit.values[c.field];
      if (c.type === "number" || c.type === "currency") { v = v === "" || v == null ? null : Number(v); if (Number.isNaN(v)) v = null; }
      patch[c.field] = v;
    });
    const selKeys = new Set(selected);
    const changedRows = [];
    const nextAll = rows.map((r, i) => {
      const k = keyOf(r, i);
      if (!selKeys.has(k)) return r;
      const updated = { ...r, ...patch };
      changedRows.push(updated);
      return updated;
    });
    onBatchUpdate?.(changedRows, patch, [...selected]);
    onRowsChange?.(nextAll);
    setBatchEdit(null); closeBatchEdit();
  }

  // Dismiss an active editor when clicking outside it (and outside any popover it spawned).
  React.useEffect(() => {
    if (!editing) return;
    const onDown = (e) => {
      if (e.target.closest(".twc-dt__editor-wrap") || e.target.closest(".twc-pop")) return;
      setEditing(null);
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [editing]);

  function renderActions(col, row) {
    const items = (col.getActions ? col.getActions(row) : []) || [];
    const inline = items.filter((a) => !a.showInMenu);
    const pinItems = canPinRows ? (() => {
      const key = keyOf(row); const side = pinSideOf(key);
      return [
        { label: side === "top" ? "Unpin from top" : "Pin to top", icon: <Svg d={I.pinUp} />, showInMenu: true, onClick: () => pinRow(key, side === "top" ? null : "top") },
        { label: side === "bottom" ? "Unpin from bottom" : "Pin to bottom", icon: <Svg d={I.pinDown} />, showInMenu: true, onClick: () => pinRow(key, side === "bottom" ? null : "bottom") },
      ];
    })() : [];
    const menu = [...items.filter((a) => a.showInMenu), ...pinItems];
    return (
      <div className="twc-dt__actions" style={{ justifyContent: col.align === "right" ? "flex-end" : "flex-start" }}>
        {inline.map((a, i) => (
          <button type="button" key={i} className="twc-dt__act" data-danger={a.danger || undefined} title={a.label} aria-label={a.label}
            disabled={a.disabled} onClick={(e) => { e.stopPropagation(); a.onClick?.(row); }}>{a.icon}</button>
        ))}
        {menu.length ? (
          <button type="button" className="twc-dt__act" aria-label="More actions" title="More"
            aria-haspopup="menu" aria-expanded={(rowMenu && rowMenu.row === row) || undefined}
            onClick={(e) => { e.stopPropagation(); menuTriggerRef.current = e.currentTarget; setColMenu(null); setPanel(null); setRowMenu({ items: menu, row }); openRowMenu(e.currentTarget, "right", 200); }}>
            <Svg d={I.more} />
          </button>
        ) : null}
      </div>
    );
  }

  const tableMinWidth = (checkboxSelection ? 44 : 0) + ordered.reduce((a, c) => a + widthOf(c), 0);
  const filterableCols = cols.filter((c) => c.filterable);
  const orderIdxOf = (f) => { const i = order.indexOf(f); return i === -1 ? 9999 : i; };
  const shownColRows = cols
    .filter((c) => c.headerName.toLowerCase().includes(colQuery.trim().toLowerCase()))
    .sort((a, b) => orderIdxOf(a.field) - orderIdxOf(b.field));
  const rppOptions = Array.from(new Set([...(pageSizeOptions || []), pageSize].filter((n) => n > 0))).sort((a, b) => a - b).map((n) => ({ value: String(n), label: String(n) }));

  const totalCols = ordered.length + (checkboxSelection ? 1 : 0);
  function renderGroupRow(item) {
    const subs = aggOn ? subtotalText(item.rows) : [];
    return (
      <tr key={`g${item.key}`} className="twc-dt__group-row" role="row">
        <td className="twc-dt__group-cell" role="gridcell" colSpan={totalCols} style={{ maxWidth: "none" }}>
          <button type="button" className="twc-dt__group-toggle" style={{ marginLeft: item.depth * 18 }}
            aria-expanded={!item.collapsed} onClick={() => toggleGroup(item.key)}>
            <span className="twc-dt__group-chev" data-open={!item.collapsed || undefined}><Svg d={I.chevDown} /></span>
            <span className="twc-dt__group-name">{colByField[item.field]?.headerName || item.field}:</span>
            <span className="twc-dt__group-val">{String(item.value)}</span>
            <span className="twc-dt__group-count">{item.count}</span>
          </button>
          {subs.length ? <span className="twc-dt__group-sub">{subs.map((s, i) => <span key={i}>{s}</span>)}</span> : null}
        </td>
      </tr>
    );
  }
  // Focusable keyboard drag handle for a reorderable row (mirrors the Kanban grab pattern).
  function rowHandle(k, midIdx, row) {
    const grabbed = rowGrab && rowGrab.key === k;
    const label = String(row[ordered[0]?.field] ?? `Row ${(midIdx ?? 0) + 1}`);
    return (
      <button type="button" className="twc-dt__row-handle" data-row-key={k} data-grabbed={grabbed || undefined}
        aria-label={`Reorder ${label}`} aria-roledescription="Draggable row" aria-pressed={grabbed || undefined}
        title="Drag, or press Enter to reorder with the keyboard"
        onKeyDown={(e) => onRowHandleKey(e, k, midIdx ?? 0, label)}
        onClick={(e) => e.stopPropagation()}
        onBlur={() => { if (rowGrab && rowGrab.key === k) { setRowGrab(null); } }}>
        <Svg d={I.grip} aria-hidden="true" />
      </button>
    );
  }
  function renderLeaf(row, ri, pinSide, midIdx) {
    const k = keyOf(row, ri); const sel = selected.has(k);
    const rowActive = selectionMode === "row" && activeRow === k;
    const stickyStyle = pinSide === "top" ? { position: "sticky", top: headH, zIndex: 5 } : pinSide === "bottom" ? { position: "sticky", bottom: 0, zIndex: 5 } : undefined;
    const h = rowHeights[k];
    const rowStyle = { ...(stickyStyle || {}), ...(h ? { height: h } : {}) };
    const reorderable = canReorderRows && !pinSide;
    const grabbed = rowGrab && rowGrab.key === k;
    // The grabbed row's live target slot lights up the row currently occupying that index.
    const grabTarget = rowGrab && !grabbed && midIdx != null && rowGrab.index === midIdx
      ? (rowGrab.index >= keyIndexMid.get(rowGrab.key) ? "after" : "before") : undefined;
    return (
      <tr key={(pinSide ? "p-" : "") + k} className="twc-dt__row" role="row" aria-rowindex={(paginated && !serverMode ? page * rowsPerPage : 0) + ri + 2}
        aria-selected={(checkboxSelection ? sel : rowActive) || undefined}
        data-selected={sel || undefined} data-active={rowActive || undefined}
        data-pinned-row={pinSide || undefined}
        data-reorderable={reorderable || undefined}
        data-row-dragging={rowDrag.from === k || undefined}
        data-row-grabbed={grabbed || undefined}
        data-row-grabtarget={grabTarget}
        data-row-dropbefore={(reorderable && rowDrag.over === k && !rowDrag.after) || undefined}
        data-row-dropafter={(reorderable && rowDrag.over === k && rowDrag.after) || undefined}
        data-selectable={selectionMode !== "none" || undefined}
        style={Object.keys(rowStyle).length ? rowStyle : undefined}
        draggable={reorderable || undefined}
        onDragStart={reorderable ? (e) => { setRowDrag({ from: k, over: null, after: false }); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(k)); } : undefined}
        onDragOver={reorderable && rowDrag.from != null ? (e) => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); const after = e.clientY > r.top + r.height / 2; setRowDrag((d) => (d.over === k && d.after === after ? d : { ...d, over: k, after })); } : undefined}
        onDrop={reorderable && rowDrag.from != null ? (e) => { e.preventDefault(); onRowDrop(k); } : undefined}
        onDragEnd={reorderable ? () => setRowDrag({ from: null, over: null, after: false }) : undefined}
        onClick={(e) => handleRowClick(e, k, row)}>
        {checkboxSelection ? (
          <td className="twc-dt__td" role="gridcell" data-pin="left" data-pin-edge={pins.left.length ? undefined : "left"} style={{ left: 0, width: 44 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {reorderable ? rowHandle(k, midIdx, row) : null}
              <span className="twc-dt__check" data-checked={sel || undefined} onClick={() => toggleRow(k)}
                role="checkbox" aria-checked={sel} aria-label="Select row" tabIndex={0}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleRow(k); } }}><Svg d={I.check} /></span>
            </span>
            {rowResize && !pinSide ? <span className="twc-dt__row-resizer" title="Drag to resize row" onPointerDown={(e) => startRowResize(e, k, e.currentTarget.closest("tr"))} onClick={(e) => e.stopPropagation()} /> : null}
          </td>
        ) : null}
        {ordered.map((c, ci) => {
          const st = stickyOf(c.field); const val = row[c.field];
          const isActions = c.type === "actions";
          const editable = isColEditable(c);
          const isEditing = editing && editing.key === k && editing.field === c.field;
          const cellActive = selectionMode === "cell" && activeCell && activeCell.key === k && activeCell.field === c.field;
          return (
            <td key={c.field} className="twc-dt__td" role="gridcell" data-r={ri} data-c={ci} aria-colindex={ci + 1 + (checkboxSelection ? 1 : 0)}
              tabIndex={focus.r === ri && focus.c === ci ? 0 : -1}
              data-num={c.type === "number" || undefined} data-actions={isActions || undefined}
              data-editable={editable && !isEditing || undefined} data-editing={isEditing || undefined}
              data-cell-active={cellActive || undefined}
              data-pin={st.pin} data-pin-edge={st.edge}
              style={{ width: widthOf(c), ...st.style }} title={isActions || c.renderCell || editable ? undefined : String(val ?? "")}
              onClick={selectionMode === "cell" ? (e) => handleCellClick(e, k, row, c) : undefined}
              onFocus={() => setFocus((f) => (f.r === ri && f.c === ci ? f : { r: ri, c: ci }))}
              onDoubleClick={editable ? () => beginEdit(k, c, row) : undefined}>
              {!checkboxSelection && reorderable && ci === 0 && !isEditing ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%" }}>
                  {rowHandle(k, midIdx, row)}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {isActions ? renderActions(c, row) : c.renderCell ? c.renderCell(val, row) : c.valueFormatter ? c.valueFormatter(val, row) : val}
                  </span>
                </span>
              ) : isEditing ? (
                <EditCell col={c} value={editing.value} options={c.valueOptions ? optionsForField(c.field) : null}
                  onChange={(v) => setEditing((e) => ({ ...e, value: v }))}
                  onCommit={() => commitEdit()} onCommitValue={(v) => commitEdit(v)} onCancel={cancelEdit} onKeyDown={onEditKey} />
              ) : isActions ? renderActions(c, row) : c.renderCell ? c.renderCell(val, row) : c.valueFormatter ? c.valueFormatter(val, row) : val}
              {editable && !isEditing ? <span className="twc-dt__edit-hint" aria-hidden="true"><Svg d={I.pencil} /></span> : null}
            </td>
          );
        })}
      </tr>
    );
  }

  function renderPivot() {
    const rFields = pivotConfig.rows, cFields = pivotConfig.columns || [], values = pivotConfig.values;
    const rowKeyOf = (r) => rFields.map((f) => r[f] ?? "—").join("  ·  ");
    const colPathOf = (r) => cFields.map((f) => String(r[f] ?? "—"));
    const aggOf = (subset, v) => computeAgg({ field: v.field, aggregation: v.agg || "sum" }, subset || []);
    const fmt = (val, v) => { if (val == null) return "—"; const col = colByField[v.field]; const f = v.valueFormatter || col?.valueFormatter; return f ? f(val, null) : (typeof val === "number" ? val.toLocaleString() : val); };
    const vlabel = (v) => v.label || (colByField[v.field]?.headerName || v.field);
    const rowFieldLabel = rFields.map((f) => colByField[f]?.headerName || f).join(" / ");

    // Build the leaf column paths (ordered, distinct) and the per-level header spans.
    const leafPaths = [];
    const seen = new Set();
    for (const r of rows) {
      const path = colPathOf(r); const key = path.join("\u0000");
      if (!seen.has(key)) { seen.add(key); leafPaths.push(path); }
    }
    leafPaths.sort((a, b) => a.join("\u0000").localeCompare(b.join("\u0000")));
    // Header rows: one per column field. Each produces {label, span, key} cells by run-length on the path prefix.
    const headerLevels = cFields.map((_, lvl) => {
      const cells = []; let i = 0;
      while (i < leafPaths.length) {
        const label = leafPaths[i][lvl];
        const prefix = leafPaths[i].slice(0, lvl + 1).join("\u0000");
        let span = 0; let j = i;
        while (j < leafPaths.length && leafPaths[j].slice(0, lvl + 1).join("\u0000") === prefix) { span++; j++; }
        cells.push({ label, span: span * values.length, key: prefix });
        i = j;
      }
      return cells;
    });
    const leafKey = (path) => path.join("\u0000");
    const rowsForLeaf = (subset, path) => subset.filter((r) => leafKey(colPathOf(r)) === leafKey(path));

    const rowMap = new Map();
    for (const r of rows) { const rk = rowKeyOf(r); if (!rowMap.has(rk)) rowMap.set(rk, []); rowMap.get(rk).push(r); }
    const rowKeys = [...rowMap.keys()].sort((a, b) => String(a).localeCompare(String(b)));
    const totalHeaderRows = Math.max(cFields.length, 1) + 1; // column levels + the value-label row

    const ValueHead = ({ v, total }) => (
      <span className="twc-dt__pivot-vh">
        <span className="twc-dt__pivot-vh-label">{vlabel(v)}</span>
        <span className="twc-dt__pivot-vh-agg">{v.agg || "sum"}</span>
      </span>
    );

    return (
      <div className="twc-dt__scroll" style={{ maxHeight: height }}>
        <table className="twc-dt__table twc-dt__pivot" role="grid" aria-label={(ariaLabelAttr || ariaLabel) + " (pivot)"}>
          <thead>
            {/* One row per column-grouping field (e.g. Year, then Month) */}
            {cFields.map((cf, lvl) => (
              <tr role="row" key={`lvl${lvl}`}>
                {lvl === 0 ? (
                  <th className="twc-dt__th twc-dt__pivot-corner" data-pin="left" data-pin-edge="left" style={{ left: 0 }} rowSpan={totalHeaderRows} scope="col">
                    <span className="twc-dt__pivot-corner-label">{rowFieldLabel}</span>
                  </th>
                ) : null}
                {headerLevels[lvl].map((cell) => (
                  <th key={cell.key} className="twc-dt__th twc-dt__pivot-colgroup" colSpan={cell.span} scope="colgroup">{cell.label}</th>
                ))}
                {lvl === 0 ? (
                  <th className="twc-dt__th twc-dt__pivot-total-h" colSpan={values.length} rowSpan={Math.max(cFields.length, 1)} scope="colgroup">Total</th>
                ) : null}
              </tr>
            ))}
            {/* Value-label row (field name + aggregation) */}
            <tr role="row">
              {leafPaths.map((path) => values.map((v, vi) => (
                <th key={leafKey(path) + v.field + (v.agg || "")} className="twc-dt__th twc-dt__pivot-vhcell" data-num="true" data-group-start={vi === 0 || undefined} scope="col"><ValueHead v={v} /></th>
              )))}
              {values.map((v, vi) => (
                <th key={"t" + v.field + (v.agg || "")} className="twc-dt__th twc-dt__pivot-vhcell twc-dt__pivot-total-h" data-num="true" data-group-start={vi === 0 || undefined} scope="col"><ValueHead v={v} total /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((rk, rIdx) => {
              const subset = rowMap.get(rk);
              return (
                <tr key={rk} className="twc-dt__row" role="row" data-zebra={rIdx % 2 === 1 || undefined}>
                  <th className="twc-dt__td twc-dt__pivot-rowhead" scope="row" data-pin="left" data-pin-edge="left" style={{ left: 0 }}>
                    {rk} <span className="twc-dt__pivot-rowcount">({subset.length})</span>
                  </th>
                  {leafPaths.map((path) => { const cell = rowsForLeaf(subset, path); return values.map((v, vi) => {
                    const val = cell.length ? aggOf(cell, v) : null;
                    return <td key={leafKey(path) + v.field} className="twc-dt__td twc-dt__pivot-cell" role="gridcell" data-num="true" data-group-start={vi === 0 || undefined} data-empty={val == null || undefined}>{fmt(val, v)}</td>;
                  }); })}
                  {values.map((v, vi) => <td key={"t" + v.field} className="twc-dt__td twc-dt__pivot-cell twc-dt__pivot-total" role="gridcell" data-num="true" data-group-start={vi === 0 || undefined}>{fmt(aggOf(subset, v), v)}</td>)}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr role="row">
              <th className="twc-dt__pivot-rowhead twc-dt__pivot-grand" data-pin="left" data-pin-edge="left" style={{ left: 0 }} scope="row">Total</th>
              {leafPaths.map((path) => { const sub = rowsForLeaf(rows, path); return values.map((v, vi) => <td key={leafKey(path) + v.field} data-num="true" data-group-start={vi === 0 || undefined} className="twc-dt__pivot-cell twc-dt__pivot-grand">{fmt(sub.length ? aggOf(sub, v) : null, v)}</td>); })}
              {values.map((v, vi) => <td key={"t" + v.field} data-num="true" data-group-start={vi === 0 || undefined} className="twc-dt__pivot-cell twc-dt__pivot-grand twc-dt__pivot-total">{fmt(aggOf(rows, v), v)}</td>)}
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  return (
    <div className={`twc-dt ${className}`} ref={rootRef} data-density={density} data-resizing={resizing || undefined} {...rest}>
      {/* PIVOT_RENDER_ANCHOR */}
      {/* Toolbar */}
      <div className="twc-dt__toolbar" data-compact={compact || undefined}>
        {batchActions.length && selected.size > 0 ? (
          <div className="twc-dt__batch">
            <button type="button" className="twc-dt__batch-x" onClick={clearSelection} aria-label="Clear selection"><Svg d={I.x} /></button>
            <span className="twc-dt__batch-count">{selected.size} selected</span>
            <div className="twc-dt__batch-actions">
              {batchEditableCols.length ? (
                <button type="button" className="twc-dt__batch-btn" onClick={(e) => openBatchEditor(e.currentTarget)}>
                  <Svg d={I.pencil} />Edit
                </button>
              ) : null}
              {batchActions.map((a, i) => (
                <button type="button" key={i} className="twc-dt__batch-btn" data-danger={a.danger || undefined} disabled={a.disabled}
                  onClick={() => a.onClick?.([...selected], selectedRows, clearSelection)}>
                  {a.icon}{a.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <button type="button" className="twc-dt__tbtn" data-active={panel === "columns" || undefined} data-tip="Show or hide columns"
          onClick={(e) => { if (panel === "columns") { setPanel(null); closePanel(); } else { setColQuery(""); setPanel("columns"); setColMenu(null); openPanel(e.currentTarget, "left", 268); } }}>
          <Svg d={I.columns} /><span className="twc-dt__tlabel">Columns</span>{hidden.size ? <span className="twc-dt__tbadge">{cols.length - hidden.size}</span> : null}
        </button>
        <button type="button" className="twc-dt__tbtn" data-active={panel === "filters" || undefined} data-tip="Filter rows"
          onClick={(e) => { if (panel === "filters") { setPanel(null); closePanel(); } else { setPanel("filters"); setColMenu(null); openPanel(e.currentTarget, "left", 480); } }}>
          <Svg d={I.filter} /><span className="twc-dt__tlabel">Filters</span>{filters.length ? <span className="twc-dt__tbadge">{filters.length}</span> : null}
        </button>
        <button type="button" className="twc-dt__tbtn" data-tip="Change row density" onClick={() => setDensity((d) => d === "compact" ? "standard" : d === "standard" ? "comfortable" : "compact")}>
          <Svg d={I.density} /><span className="twc-dt__tlabel">{density[0].toUpperCase() + density.slice(1)}</span>
        </button>
        <button type="button" className="twc-dt__tbtn" data-active={panel === "agg" || aggOn || undefined} aria-haspopup="dialog" aria-expanded={panel === "agg"} data-tip="Configure aggregation"
          onClick={(e) => { if (panel === "agg") { setPanel(null); closePanel(); } else { setPanel("agg"); setColMenu(null); openPanel(e.currentTarget, "left", 300); } }}>
          <Svg d={I.sigma} /><span className="twc-dt__tlabel">Aggregation</span>{aggOn && hasAggregation ? <span className="twc-dt__tbadge">{ordered.filter((c) => aggOf(c)).length}</span> : null}
        </button>
        <button type="button" className="twc-dt__tbtn" data-active={panel === "pivot" || pivotActive || undefined} aria-haspopup="dialog" aria-expanded={panel === "pivot"} data-tip="Configure pivot"
          onClick={(e) => { if (panel === "pivot") { setPanel(null); closePanel(); } else { setPanel("pivot"); setColMenu(null); openPanel(e.currentTarget, "left", 320); } }}>
          <Svg d={I.pivot} /><span className="twc-dt__tlabel">Pivot</span>{pivotActive ? <span className="twc-dt__tdot" aria-label="on" role="img" /> : null}
        </button>
        {showExport ? (
          <span className="twc-dt__export">
            <button type="button" className="twc-dt__export-main" onClick={() => exportData("csv")} aria-label="Export to CSV">
              <Svg d={I.download} /><span className="twc-dt__tlabel">Export</span>
            </button>
            <button type="button" className="twc-dt__export-toggle" aria-label="More export formats" aria-haspopup="menu" aria-expanded={exportOpen}
              onClick={(e) => { if (exportOpen) { setExportOpen(false); closeExport(); } else { menuTriggerRef.current = e.currentTarget; setColMenu(null); setPanel(null); setRowMenu(null); setExportOpen(true); openExport(e.currentTarget, "right", 180); } }}>
              <Svg d={I.chevronDown} />
            </button>
          </span>
        ) : null}
        <div className="twc-dt__search">
          <Svg d={I.search} />
          <input placeholder="Search…" aria-label="Search rows" value={quick} onChange={(e) => { setQuick(e.target.value); setPage(0); }} />
        </div>
      </div>

      {/* Active row-grouping chips */}
      {!pivotActive && activeGroupBy.length ? (
        <div className="twc-dt__groupbar">
          <Svg d={I.group} />
          <span className="twc-dt__groupbar-label">Grouped by</span>
          {activeGroupBy.map((f) => (
            <span key={f} className="twc-dt__groupchip">
              {colByField[f]?.headerName || f}
              <button type="button" className="twc-dt__groupchip-x" aria-label={`Stop grouping by ${colByField[f]?.headerName || f}`} onClick={() => toggleGroupField(f)}><Svg d={I.x} /></button>
            </span>
          ))}
          <button type="button" className="twc-dt__groupbar-clear" onClick={() => setGroupBy([])}>Clear all</button>
        </div>
      ) : null}

      {/* Visually-hidden live region for keyboard-reorder announcements */}
      <div className="twc-dt__sr" role="status" aria-live="polite">{reorderMsg}</div>

      {/* Grid */}
      {pivotActive ? renderPivot() : (
      <div className="twc-dt__scroll" style={{ maxHeight: height }} ref={scrollRef} onScroll={virtualizing ? onScrollVirtual : undefined}>
        <table className="twc-dt__table" style={{ width: tableMinWidth, minWidth: "100%" }}
          ref={gridRef} role="grid" aria-label={ariaLabelAttr || ariaLabel}
          aria-rowcount={totalRows + 1} aria-colcount={ordered.length + (checkboxSelection ? 1 : 0)}
          aria-busy={loading || undefined} onKeyDown={onGridKeyDown}>
          <thead ref={theadRef}>
            <tr role="row" aria-rowindex={1}>
              {checkboxSelection ? (
                <th className="twc-dt__th" role="columnheader" aria-label="Select" data-pin="left" data-pin-edge={pins.left.length ? undefined : "left"} style={{ left: 0, width: 44, minWidth: 44 }}>
                  <div className="twc-dt__th-inner" style={{ justifyContent: "center", padding: 0 }}>
                    <span className="twc-dt__check" data-checked={allSel || undefined} data-indeterminate={(!allSel && someSel) || undefined} onClick={toggleAll}
                      role="checkbox" aria-checked={allSel ? true : someSel ? "mixed" : false} aria-label="Select all rows" tabIndex={0}
                      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleAll(); } }}>
                      <Svg d={allSel ? I.check : I.minus} />
                    </span>
                  </div>
                </th>
              ) : null}
              {ordered.map((c) => {
                const st = stickyOf(c.field);
                const sorted = sort && sort.field === c.field ? sort.dir : undefined;
                const w = widthOf(c);
                const reorderable = !disableColumnReorder && st.pin == null && c.type !== "actions";
                const resizable = !disableColumnResize && c.resizable !== false;
                const hasMenu = !c.disableColumnMenu && (c.sortable || c.filterable || c.pinnable || c.hideable);
                return (
                  <th key={c.field} className="twc-dt__th" role="columnheader" scope="col"
                    aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : (c.sortable ? "none" : undefined)}
                    data-num={c.type === "number" || undefined} data-actions-col={c.type === "actions" || undefined}
                    data-sorted={sorted} data-pin={st.pin} data-pin-edge={st.edge}
                    data-dragging={drag.from === c.field || undefined}
                    data-dropbefore={(drag.over === c.field && !drag.after) || undefined}
                    data-dropafter={(drag.over === c.field && drag.after) || undefined}
                    style={{ width: w, minWidth: w, ...st.style }}
                    onDragOver={reorderable && drag.from ? (e) => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); const after = e.clientX > r.left + r.width / 2; setDrag((d) => (d.over === c.field && d.after === after ? d : { ...d, over: c.field, after })); } : undefined}
                    onDrop={reorderable && drag.from ? (e) => { e.preventDefault(); onColDrop(c.field); } : undefined}>
                    <div className="twc-dt__th-inner">
                      <span className="twc-dt__th-label"
                        role={c.sortable ? "button" : undefined} tabIndex={c.sortable ? 0 : undefined}
                        aria-label={c.sortable ? `${c.headerName}, sort` : undefined}
                        draggable={reorderable || undefined}
                        onDragStart={reorderable ? (e) => { setDrag({ from: c.field, over: null, after: false }); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.field); } : undefined}
                        onDragEnd={reorderable ? () => setDrag({ from: null, over: null, after: false }) : undefined}
                        onClick={() => c.sortable && cycleSort(c.field)}
                        onKeyDown={c.sortable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycleSort(c.field); } } : undefined}>
                        {reorderable ? <span className="twc-dt__grip" aria-hidden="true"><Svg d={I.grip} /></span> : null}
                        {filteredFields.has(c.field) ? <span className="twc-dt__filterdot" /> : null}
                        {c.headerName}
                        {c.sortable ? <span className="twc-dt__sort"><Svg d={I.arrow} /></span> : null}
                      </span>
                      {hasMenu ? (
                        <button type="button" className="twc-dt__menu-btn" aria-label="Column menu"
                          aria-haspopup="menu" aria-expanded={colMenu?.field === c.field || undefined}
                          onClick={(e) => { e.stopPropagation(); menuTriggerRef.current = e.currentTarget; setPanel(null); setColMenu({ field: c.field }); openMenu(e.currentTarget, "right", 230); }}>
                          <Svg d={I.more} />
                        </button>
                      ) : null}
                    </div>
                    {resizable ? <span className="twc-dt__resizer" data-active={resizing || undefined}
                      role="separator" aria-orientation="vertical" aria-label={`Resize ${c.headerName} column`}
                      aria-valuenow={w} aria-valuemin={72} tabIndex={0}
                      onPointerDown={(e) => startResize(e, c.field)} onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                        e.preventDefault(); e.stopPropagation();
                        const delta = e.key === "ArrowRight" ? 10 : -10;
                        setWidths((m) => ({ ...m, [c.field]: Math.max(72, (m[c.field] ?? c.width ?? 160) + delta) }));
                      }}
                      title="Drag to resize" /> : null}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: paginated ? Math.min(rowsPerPage, 8) : 8 }).map((_, ri) => (
                <tr key={ri} className="twc-dt__row">
                  {checkboxSelection ? <td className="twc-dt__td" data-pin="left" style={{ left: 0, width: 44 }}><span className="twc-dt__sk" style={{ "--_w": "18px", height: 18, borderRadius: 4 }} /></td> : null}
                  {ordered.map((c, ci) => {
                    const st = stickyOf(c.field);
                    return <td key={c.field} className="twc-dt__td" data-num={c.type === "number" || undefined} data-pin={st.pin} data-pin-edge={st.edge} style={{ width: widthOf(c), ...st.style }}>
                      <span className="twc-dt__sk" style={{ "--_w": `${45 + ((ri * 13 + ci * 29) % 45)}%` }} />
                    </td>;
                  })}
                </tr>
              ))
            ) : leafRows.length === 0 ? (
              <tr><td className="twc-dt__td" colSpan={totalCols} style={{ maxWidth: "none" }}>
                <div className="twc-dt__empty">No rows match your filters</div>
              </td></tr>
            ) : displayItems ? (() => {
              let li = -1;
              return displayItems.map((item) => item.kind === "group" ? renderGroupRow(item) : renderLeaf(item.row, ++li));
            })() : (<>
              {pinnedTopRows.map((row) => renderLeaf(row, keyIndex.get(keyOf(row)), "top"))}
              {vWindow ? (<>
                {vWindow.padTop > 0 ? <tr aria-hidden="true" className="twc-dt__vspacer"><td colSpan={totalCols} style={{ height: vWindow.padTop, padding: 0, border: "none", maxWidth: "none" }} /></tr> : null}
                {middleRows.slice(vWindow.start, vWindow.end).map((row, i) => renderLeaf(row, keyIndex.get(keyOf(row)), undefined, vWindow.start + i))}
                {vWindow.padBottom > 0 ? <tr aria-hidden="true" className="twc-dt__vspacer"><td colSpan={totalCols} style={{ height: vWindow.padBottom, padding: 0, border: "none", maxWidth: "none" }} /></tr> : null}
              </>) : (
                middleRows.map((row, i) => renderLeaf(row, keyIndex.get(keyOf(row)), undefined, i))
              )}
              {pinnedBottomRows.map((row) => renderLeaf(row, keyIndex.get(keyOf(row)), "bottom"))}
            </>)}
          </tbody>
          {hasAggregation && aggOn && !loading && paged.length > 0 ? (
            <tfoot>
              <tr role="row">
                {checkboxSelection ? <td data-pin="left" data-pin-edge={pins.left.length ? undefined : "left"} style={{ left: 0, width: 44 }} /> : null}
                {ordered.map((c) => {
                  const st = stickyOf(c.field);
                  const v = aggregate(c);
                  const display = v == null ? null : (c.aggregationFormatter ? c.aggregationFormatter(v) : c.valueFormatter ? c.valueFormatter(v, null) : (typeof v === "number" ? v.toLocaleString() : v));
                  return (
                    <td key={c.field} data-num={c.type === "number" || undefined} data-pin={st.pin} data-pin-edge={st.edge} style={{ width: widthOf(c), ...st.style }}>
                      {v == null ? null : (<>
                        {typeof aggOf(c) === "string" ? <span className="twc-dt__agg-label">{aggLabels[aggOf(c)]}</span> : null}
                        <span className="twc-dt__agg-val">{display}</span>
                      </>)}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      )}

      {/* Footer with pagination */}
      {!pivotActive ? (
      <div className="twc-dt__footer">
        <div className="twc-dt__footer-row" data-bottom="true">
          <span className="twc-dt__status">
            {loading ? "Loading…" : (() => {
              const nf = (n) => n.toLocaleString();
              if (totalRows === 0) return "No rows";
              const shown = paged.length;
              const start = paginated ? page * rowsPerPage + 1 : 1;
              const end = paginated ? start + shown - 1 : shown;
              return (
                <>
                  {paginated
                    ? <>Showing <b>{nf(start)}–{nf(end)}</b> of <b>{nf(totalRows)}</b> {totalRows === 1 ? "row" : "rows"}</>
                    : <><b>{nf(totalRows)}</b> {totalRows === 1 ? "row" : "rows"}</>}
                  {selected.size ? <> · <b>{nf(selected.size)}</b> selected</> : null}
                </>
              );
            })()}
          </span>
          {paginated ? (
            <div className="twc-dt__rpp">
              <span className="twc-dt__rpp-label">Rows per page</span>
              <div style={{ width: 78 }}>
                <Select size="sm" value={String(rowsPerPage)} options={rppOptions} placement="top" onChange={(v) => { setRowsPerPage(Number(v)); setPage(0); }} />
              </div>
            </div>
          ) : null}
        </div>
        {paginated ? (
          <div className="twc-dt__footer-row" data-pager="true">
            <Pagination size="sm" page={page + 1} total={totalPages} boundaries={3} showJumper={showPageJumper && totalPages > 5} onChange={(p) => setPage(p - 1)} />
          </div>
        ) : null}
      </div>
      ) : null}

      {/* Export options menu */}
      {exportOpen && exportPos ? (
        <div className="twc-dt__pop" role="menu" aria-label="Export format" ref={exportMenuRef}
          onKeyDown={(e) => onMenuKeyDown(e, () => { setExportOpen(false); closeExport(); })}
          style={{ top: exportPos.top, left: exportPos.left, width: exportPos.width, maxHeight: exportPos.maxHeight, overflowY: "auto" }}>
          <Caret pos={exportPos} />
          {[
            { fmt: "csv", label: "CSV (.csv)", icon: I.fileText },
            { fmt: "excel", label: "Excel (.xls)", icon: I.sheet },
            { fmt: "tsv", label: "TSV (.tsv)", icon: I.fileText },
            { fmt: "json", label: "JSON (.json)", icon: I.braces },
          ].map((o) => (
            <button type="button" key={o.fmt} role="menuitem" className="twc-dt__mi" onClick={() => { exportData(o.fmt); setExportOpen(false); closeExport(); restoreTriggerFocus(); }}>
              <Svg d={o.icon} /> {o.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Batch edit panel — set columns across all selected rows */}
      {batchEdit && batchEditPos ? (
        <div className="twc-dt__pop twc-dt__cfg" style={{ top: batchEditPos.top, left: batchEditPos.left, width: 320 }}>
          <Caret pos={batchEditPos} />
          <div className="twc-dt__cfg-head">Edit {selected.size} selected {selected.size === 1 ? "row" : "rows"}</div>
          <div className="twc-dt__cfg-list">
            {batchEditableCols.map((c) => {
              const on = !!batchEdit.fields[c.field];
              const opts = c.valueOptions ? c.valueOptions.map((o) => (typeof o === "string" ? { value: o, label: o } : o)) : null;
              return (
                <div key={c.field} className="twc-dt__be-row" data-on={on || undefined}>
                  <label className="twc-dt__be-check">
                    <input type="checkbox" checked={on} onChange={(e) => setBatchEdit((b) => ({ ...b, fields: { ...b.fields, [c.field]: e.target.checked } }))} />
                    <span>{c.headerName}</span>
                  </label>
                  <div className="twc-dt__be-ctl">
                    {opts ? (
                      <Select size="sm" portal searchable placeholder="New value…" value={batchEdit.values[c.field] ?? ""} options={opts} disabled={!on}
                        onChange={(v) => setBatchEdit((b) => ({ ...b, fields: { ...b.fields, [c.field]: true }, values: { ...b.values, [c.field]: v } }))} />
                    ) : (
                      <Input size="sm" type={c.type === "number" || c.type === "currency" ? "number" : "text"} placeholder="New value…" value={batchEdit.values[c.field] ?? ""} disabled={!on}
                        onChange={(e) => setBatchEdit((b) => ({ ...b, values: { ...b.values, [c.field]: e.target.value } }))} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="twc-dt__cfg-foot">
            <button type="button" className="twc-dt__cfg-btn" onClick={() => { setBatchEdit(null); closeBatchEdit(); }}>Cancel</button>
            <button type="button" className="twc-dt__cfg-btn" data-primary="true" onClick={applyBatchEdit}>Apply to {selected.size}</button>
          </div>
        </div>
      ) : null}

      {/* Column header menu */}
      {colMenu && menuPos ? (
        <div className="twc-dt__pop" role="menu" aria-label="Column options" ref={colMenuRef}
          onKeyDown={(e) => onMenuKeyDown(e, () => { setColMenu(null); closeMenu(); })}
          style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width, maxHeight: menuPos.maxHeight, overflowY: "auto" }}>
          <Caret pos={menuPos} />
          {(() => {
            const c = colByField[colMenu.field]; const close = () => { setColMenu(null); closeMenu(); restoreTriggerFocus(); };
            const hasTop = c.sortable || c.filterable;
            const hasBottom = c.pinnable || c.hideable;
            return (<>
              {c.sortable ? (<>
                <button type="button" role="menuitem" className="twc-dt__mi" data-active={sort?.field === c.field && sort.dir === "asc" || undefined} onClick={() => { setSort({ field: c.field, dir: "asc" }); close(); }}><Svg d={I.arrow} /> Sort ascending</button>
                <button type="button" role="menuitem" className="twc-dt__mi" data-active={sort?.field === c.field && sort.dir === "desc" || undefined} onClick={() => { setSort({ field: c.field, dir: "desc" }); close(); }}><Svg d={I.arrow} style={{ transform: "rotate(180deg)" }} /> Sort descending</button>
              </>) : null}
              {c.filterable ? <button type="button" role="menuitem" className="twc-dt__mi" onClick={(e) => { addFilter(c.field); setColMenu(null); closeMenu(); restoreTriggerFocus(); setPanel("filters"); openPanel(document.querySelector(".twc-dt__toolbar .twc-dt__tbtn:nth-child(2)"), "left", 480); }}><Svg d={I.filter} /> Filter</button> : null}
              {hasTop && hasBottom ? <div className="twc-dt__sep" /> : null}
              {c.groupable ? <button type="button" role="menuitem" className="twc-dt__mi" data-active={groupBy.includes(c.field) || undefined} onClick={() => { toggleGroupField(c.field); close(); }}><Svg d={I.group} /> {groupBy.includes(c.field) ? "Stop grouping" : "Group by this column"}</button> : null}
              {!disableColumnReorder && c.type !== "actions" && !pins.left.includes(c.field) && !pins.right.includes(c.field) ? (() => {
                // Position within the movable middle band — same set the drag path can rearrange.
                const midIdx = movableMidFields.indexOf(c.field);
                const atFirst = midIdx <= 0;
                const atLast = midIdx === -1 || midIdx >= movableMidFields.length - 1;
                return (<>
                  <button type="button" role="menuitem" className="twc-dt__mi" disabled={atFirst} aria-disabled={atFirst || undefined} onClick={() => { moveCol(c.field, -1); close(); }}><Svg d={I.arrow} style={{ transform: "rotate(-90deg)" }} /> Move left</button>
                  <button type="button" role="menuitem" className="twc-dt__mi" disabled={atLast} aria-disabled={atLast || undefined} onClick={() => { moveCol(c.field, 1); close(); }}><Svg d={I.arrow} style={{ transform: "rotate(90deg)" }} /> Move right</button>
                </>);
              })() : null}
              {c.pinnable ? (<>
                <button type="button" role="menuitem" className="twc-dt__mi" data-active={pins.left.includes(c.field) || undefined} onClick={() => { setPin(c.field, pins.left.includes(c.field) ? null : "left"); close(); }}><Svg d={I.pinL} /> {pins.left.includes(c.field) ? "Unpin" : "Pin to left"}</button>
                <button type="button" role="menuitem" className="twc-dt__mi" data-active={pins.right.includes(c.field) || undefined} onClick={() => { setPin(c.field, pins.right.includes(c.field) ? null : "right"); close(); }}><Svg d={I.pin} /> {pins.right.includes(c.field) ? "Unpin" : "Pin to right"}</button>
              </>) : null}
              {c.hideable ? <button type="button" role="menuitem" className="twc-dt__mi" onClick={() => { setHidden((h) => new Set(h).add(c.field)); close(); }}><Svg d={I.eyeOff} /> Hide column</button> : null}
            </>);
          })()}
        </div>
      ) : null}

      {/* Row actions overflow menu */}
      {rowMenu && rowMenuPos ? (
        <div className="twc-dt__pop" role="menu" aria-label="Row actions" ref={rowMenuRef}
          onKeyDown={(e) => onMenuKeyDown(e, () => { setRowMenu(null); closeRowMenu(); })}
          style={{ top: rowMenuPos.top, left: rowMenuPos.left, width: rowMenuPos.width, maxHeight: rowMenuPos.maxHeight, overflowY: "auto" }}>
          <Caret pos={rowMenuPos} />
          {rowMenu.items.map((a, i) => (
            <button type="button" key={i} role="menuitem" className="twc-dt__mi" disabled={a.disabled}
              style={a.danger ? { color: "var(--color-danger-subtle-fg)" } : undefined}
              onClick={() => { a.onClick?.(rowMenu.row); setRowMenu(null); closeRowMenu(); restoreTriggerFocus(); }}>
              {a.icon || null}{a.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Columns panel (searchable) */}
      {panel === "columns" && panelPos ? (
        <div className="twc-dt__pop twc-dt__cols" style={{ top: panelPos.top, left: panelPos.left }} role="dialog" aria-label="Column settings">
          <div className="twc-dt__panel-head">
            <span className="twc-dt__panel-title">Columns</span>
            <div>
              <button type="button" className="twc-dt__link" onClick={() => setHidden(new Set())}>Show all</button>
              <button type="button" className="twc-dt__link" onClick={() => setHidden(new Set(cols.filter((c) => c.hideable).map((c) => c.field)))}>Hide all</button>
            </div>
          </div>
          <div className="twc-dt__col-search">
            <Svg d={I.search} />
            <input autoFocus placeholder="Find column…" aria-label="Find column" value={colQuery} onChange={(e) => setColQuery(e.target.value)} />
          </div>
          <div className="twc-dt__col-list">
            {shownColRows.length === 0 ? <div className="twc-dt__empty" style={{ padding: "18px 12px" }}>No columns found</div> :
              shownColRows.map((c) => {
                const canDrag = !disableColumnReorder && !colQuery.trim();
                return (
                <div key={c.field} className="twc-dt__col-row"
                  data-dragging={drag.from === c.field || undefined}
                  data-dropbefore={(drag.over === c.field && !drag.after) || undefined}
                  data-dropafter={(drag.over === c.field && drag.after) || undefined}
                  draggable={canDrag || undefined}
                  onDragStart={canDrag ? (e) => { setDrag({ from: c.field, over: null, after: false }); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.field); } : undefined}
                  onDragEnd={canDrag ? () => setDrag({ from: null, over: null, after: false }) : undefined}
                  onDragOver={canDrag && drag.from ? (e) => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); const after = e.clientY > r.top + r.height / 2; setDrag((d) => (d.over === c.field && d.after === after ? d : { ...d, over: c.field, after })); } : undefined}
                  onDrop={canDrag && drag.from ? (e) => { e.preventDefault(); onColDrop(c.field); } : undefined}
                  onClick={() => c.hideable && toggleHiddenField(c.field)}>
                  {canDrag ? <span className="twc-dt__col-grip" aria-hidden="true"><Svg d={I.grip} /></span> : null}
                  <span className="twc-dt__col-name">{c.headerName}</span>
                  <span className="twc-dt__sw" data-on={!hidden.has(c.field) || undefined}
                    role="switch" aria-checked={!hidden.has(c.field)} aria-label={c.headerName}
                    aria-disabled={!c.hideable || undefined} tabIndex={c.hideable ? 0 : -1}
                    onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && c.hideable) { e.preventDefault(); toggleHiddenField(c.field); } }}
                    style={c.hideable ? undefined : { opacity: 0.4 }} />
                </div>
              );
              })}
          </div>
        </div>
      ) : null}

      {/* Aggregation config panel */}
      {panel === "agg" && panelPos ? (
        <div className="twc-dt__pop twc-dt__cfg" style={{ top: panelPos.top, left: panelPos.left, width: 300 }} role="dialog" aria-label="Aggregation settings">
          <div className="twc-dt__panel-head">
            <span className="twc-dt__panel-title">Aggregation</span>
            <button type="button" className="twc-dt__link" onClick={() => setAggConfig({})}>Clear</button>
          </div>
          <div className="twc-dt__cfg-toggle">
            <span>Show totals row</span>
            <span className="twc-dt__sw" data-on={aggOn || undefined} role="switch" aria-checked={aggOn} tabIndex={0}
              onClick={() => setAggOn((v) => !v)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setAggOn((v) => !v); } }} />
          </div>
          <div className="twc-dt__cfg-list">
            {ordered.filter((c) => c.type !== "actions" && typeof c.aggregation !== "function").map((c) => {
              const numeric = c.type === "number";
              const opts = numeric
                ? [{ value: "", label: "None" }, { value: "sum", label: "Sum" }, { value: "avg", label: "Avg" }, { value: "min", label: "Min" }, { value: "max", label: "Max" }, { value: "count", label: "Count" }]
                : [{ value: "", label: "None" }, { value: "count", label: "Count" }];
              return (
                <div className="twc-dt__cfg-row" key={c.field}>
                  <span className="twc-dt__cfg-name">{c.headerName}</span>
                  <div className="twc-dt__cfg-ctl">
                    <Select size="sm" value={aggConfig[c.field] || ""} options={opts} portal
                      onChange={(v) => { setAggConfig((m) => { const n = { ...m }; if (!v) delete n[c.field]; else n[c.field] = v; return n; }); if (v) setAggOn(true); }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Pivot config panel */}
      {panel === "pivot" && panelPos ? (() => {
        const fieldOpts = ordered.filter((c) => c.type !== "actions").map((c) => ({ value: c.field, label: c.headerName }));
        const aggOpts = [{ value: "sum", label: "Sum" }, { value: "avg", label: "Avg" }, { value: "min", label: "Min" }, { value: "max", label: "Max" }, { value: "count", label: "Count" }];
        const valueFieldOpts = ordered.filter((c) => c.type !== "actions" && !pivotConfig.values.some((v) => v.field === c.field)).map((c) => ({ value: c.field, label: c.headerName }));
        return (
        <div className="twc-dt__pop twc-dt__cfg" style={{ top: panelPos.top, left: panelPos.left, width: 320 }} role="dialog" aria-label="Pivot settings">
          <div className="twc-dt__panel-head">
            <span className="twc-dt__panel-title">Pivot</span>
            <button type="button" className="twc-dt__link" onClick={() => { setPivotConfig({ rows: [], columns: [], values: [] }); setPivotOn(false); }}>Reset</button>
          </div>
          <div className="twc-dt__cfg-toggle">
            <span>Pivot mode</span>
            <span className="twc-dt__sw" data-on={pivotOn || undefined} role="switch" aria-checked={pivotOn} tabIndex={0}
              onClick={() => setPivotOn((v) => !v)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPivotOn((v) => !v); } }} />
          </div>
          {!pivotActive && pivotOn ? <div className="twc-dt__cfg-hint">Add at least one <b>Row</b> field and one <b>Value</b> to see the pivot.</div> : null}
          <div className="twc-dt__cfg-section">
            <span className="twc-dt__cfg-label">Rows</span>
            <MultiSelect placeholder="Add row fields…" value={pivotConfig.rows} options={fieldOpts}
              onChange={(vals) => { setPivotConfig((p) => ({ ...p, rows: vals })); if (vals.length) setPivotOn(true); }} />
          </div>
          <div className="twc-dt__cfg-section">
            <span className="twc-dt__cfg-label">Columns</span>
            <MultiSelect placeholder="Add column fields…" value={pivotConfig.columns} options={fieldOpts}
              onChange={(vals) => setPivotConfig((p) => ({ ...p, columns: vals }))} />
          </div>
          <div className="twc-dt__cfg-section">
            <span className="twc-dt__cfg-label">Values</span>
            {pivotConfig.values.map((v, i) => (
              <div className="twc-dt__cfg-row" key={v.field + i}>
                <span className="twc-dt__cfg-name">{colByField[v.field]?.headerName || v.field}</span>
                <div className="twc-dt__cfg-ctl">
                  <Select size="sm" value={v.agg || "sum"} options={aggOpts} portal
                    onChange={(a) => setPivotConfig((p) => ({ ...p, values: p.values.map((x, j) => (j === i ? { ...x, agg: a } : x)) }))} />
                </div>
                <button type="button" className="twc-dt__cfg-x" aria-label={`Remove ${colByField[v.field]?.headerName || v.field}`}
                  onClick={() => setPivotConfig((p) => ({ ...p, values: p.values.filter((_, j) => j !== i) }))}><Svg d={I.x} /></button>
              </div>
            ))}
            {valueFieldOpts.length ? (
              <div className="twc-dt__cfg-add">
                <Select size="sm" placeholder="Add value field…" value="" options={valueFieldOpts} portal searchable searchPlaceholder="Search fields…"
                  onChange={(f) => { if (f) { setPivotConfig((p) => (p.values.some((x) => x.field === f) ? p : { ...p, values: [...p.values, { field: f, agg: "sum" }] })); setPivotOn(true); } }} />
              </div>
            ) : null}
          </div>
        </div>
        );
      })() : null}

      {/* Filters panel (uses Select + Input components) */}
      {panel === "filters" && panelPos ? (
        <div className="twc-dt__pop twc-dt__filters" style={{ top: panelPos.top, left: panelPos.left }}>
          <div className="twc-dt__panel-head">
            <span className="twc-dt__panel-title">Filters</span>
            {filters.length ? <button type="button" className="twc-dt__link" onClick={() => setFilters([])}>Clear all</button> : null}
          </div>
          {filters.length === 0 ? <div className="twc-dt__empty" style={{ padding: "16px 12px" }}>No filters applied</div> :
            filters.map((f) => {
              const col = colByField[f.field] || cols[0]; const ops = opsFor(col.type);
              const op = ops.find((o) => o.value === f.op) || ops[0];
              return (
                <div className="twc-dt__frow" key={f.id}>
                  <div className="twc-dt__f-col">
                    <Select size="sm" value={f.field}
                      options={filterableCols.map((c) => ({ value: c.field, label: c.headerName }))}
                      onChange={(v) => { const nc = colByField[v]; setFilters((arr) => arr.map((x) => x.id === f.id ? { ...x, field: v, op: opsFor(nc.type)[0].value, value: "" } : x)); }} />
                  </div>
                  <div className="twc-dt__f-op">
                    <Select size="sm" value={f.op}
                      options={ops.map((o) => ({ value: o.value, label: o.label }))}
                      onChange={(v) => setFilters((arr) => arr.map((x) => {
                        if (x.id !== f.id) return x;
                        const nextMulti = isMultiOp(v); const wasArr = Array.isArray(x.value);
                        return { ...x, op: v, value: nextMulti ? (wasArr ? x.value : []) : (wasArr ? "" : x.value) };
                      }))} />
                  </div>
                  <div className="twc-dt__f-val">
                    {op.noInput ? null : op.multi ? (
                      <MultiSelect placeholder="Any of…" value={Array.isArray(f.value) ? f.value : []}
                        options={optionsForField(f.field)}
                        onChange={(vals) => setFilters((arr) => arr.map((x) => x.id === f.id ? { ...x, value: vals } : x))} />
                    ) : (
                      <Input size="sm" type={col.type === "number" ? "number" : "text"} placeholder="Value" value={f.value}
                        onChange={(e) => setFilters((arr) => arr.map((x) => x.id === f.id ? { ...x, value: e.target.value } : x))} />
                    )}
                  </div>
                  <button type="button" className="twc-dt__frm-x" aria-label="Remove filter" onClick={() => setFilters((arr) => arr.filter((x) => x.id !== f.id))}><Svg d={I.x} /></button>
                </div>
              );
            })}
          <div style={{ padding: "6px 4px 2px" }}>
            <button type="button" className="twc-dt__mi" style={{ color: "var(--color-primary)" }} onClick={() => addFilter(cols[0].field)}><Svg d={I.plus} style={{ color: "var(--color-primary)" }} /> Add filter</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
