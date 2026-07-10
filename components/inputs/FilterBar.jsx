import React from "react";
import { useScopedStyles } from "../_styles.js";
import { MultiSelect } from "./MultiSelect.jsx";
import { DateRangePicker } from "./DateRangePicker.jsx";
import { Select } from "./Select.jsx";
import { Input } from "./Input.jsx";

const FILTERBAR_CSS = `
.twc-fbar { font-family: var(--font-sans); display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--space-3); }
.twc-fbar__field { display: flex; flex-direction: column; min-width: 170px; }
.twc-fbar__field[data-type="search"], .twc-fbar__field[data-type="text"] { flex: 1 1 200px; }
.twc-fbar__field[data-type="daterange"] { min-width: 220px; }
.twc-fbar__field[data-type="boolean"], .twc-fbar__field[data-type="number"] { min-width: 130px; }
.twc-fbar__labelrow { display: flex; align-items: center; gap: 6px; min-height: 18px; margin-bottom: var(--space-1); }
.twc-fbar__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-fbar__clearone { display: inline-grid; place-items: center; width: 16px; height: 16px; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-full); padding: 0; }
.twc-fbar__clearone:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-fbar__clearone svg { width: 11px; height: 11px; }
.twc-fbar__actions { display: flex; align-items: center; gap: var(--space-2); }
.twc-fbar__clearall { display: inline-flex; align-items: center; gap: 6px; height: var(--control-h-md); padding: 0 var(--space-3); border: var(--border-thin) solid var(--color-border); background: var(--color-surface); color: var(--color-text-muted); border-radius: var(--radius-md); cursor: pointer; font-family: inherit; font-size: var(--text-sm); font-weight: var(--font-medium); transition: background-color var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast); }
.twc-fbar__clearall:hover:not(:disabled) { background: var(--color-surface-sunken); color: var(--color-text); border-color: var(--color-border-strong); }
.twc-fbar__clearall:disabled { opacity: 0.5; cursor: not-allowed; }
.twc-fbar__clearall svg { width: 15px; height: 15px; }
`;

const isEmpty = (f, v) => {
  if (v == null) return true;
  if (f.type === "multiselect" || f.type === "select-multiple") return !Array.isArray(v) || v.length === 0;
  if (f.type === "daterange") return v.start == null && v.end == null;
  return v === "";
};
const emptyFor = (f) => (f.type === "multiselect" ? [] : f.type === "daterange" ? { start: null, end: null } : undefined);

// Per-field value map -> normalized clause list [{ field, op, value }].
function valuesToClauses(fields, values) {
  const out = [];
  for (const f of fields) {
    const v = values[f.field];
    if (isEmpty(f, v)) continue;
    if (f.type === "multiselect") out.push({ field: f.field, op: "isAnyOf", value: v });
    else if (f.type === "daterange") {
      if (v.start != null) out.push({ field: f.field, op: ">=", value: v.start });
      if (v.end != null) out.push({ field: f.field, op: "<", value: v.end });
    } else if (f.type === "search" || f.type === "text") out.push({ field: f.field, op: f.op || "contains", value: v });
    else if (f.type === "number") out.push({ field: f.field, op: f.op || "=", value: v });
    else if (f.type === "boolean") out.push({ field: f.field, op: "=", value: v });
    else out.push({ field: f.field, op: f.op || "=", value: v }); // select
  }
  return out;
}
// Normalized clause list -> per-field value map (the inverse, for controlled `value`).
function clausesToValues(fields, clauses) {
  const v = {};
  for (const f of fields) v[f.field] = emptyFor(f);
  for (const c of clauses || []) {
    const f = fields.find((x) => x.field === c.field);
    if (!f) continue;
    if (f.type === "daterange") {
      v[f.field] = { ...(v[f.field] || { start: null, end: null }) };
      if (c.op === ">=" || c.op === ">") v[f.field].start = c.value;
      else if (c.op === "<" || c.op === "<=") v[f.field].end = c.value;
    } else if (f.type === "multiselect") {
      v[f.field] = Array.isArray(c.value) ? c.value : [];
    } else {
      v[f.field] = c.value;
    }
  }
  return v;
}

const xIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
);

export function FilterBar({
  fields = [],
  value,
  defaultValue = [],
  onChange,
  onValuesChange,
  showClearAll = false,
  clearAllLabel = "Clear all",
  showFieldClear = true,
  size = "md",
  tone = "primary",
  disabled = false,
  id,
  className = "",
  ...rest
}) {
  const styles = useScopedStyles("twc-filterbar-styles", FILTERBAR_CSS);
  const autoId = React.useId();
  const fieldId = id || autoId;

  const [internal, setInternal] = React.useState(defaultValue);
  const clauses = value !== undefined ? value : internal;
  const values = React.useMemo(() => clausesToValues(fields, clauses), [fields, clauses]);

  const emit = (nextValues) => {
    const next = valuesToClauses(fields, nextValues);
    if (value === undefined) setInternal(next);
    onChange?.(next);
    onValuesChange?.(nextValues);
  };
  const setField = (f, v) => emit({ ...values, [f.field]: v });
  const clearField = (f) => setField(f, emptyFor(f));
  const clearAll = () => {
    const cleared = {};
    for (const f of fields) cleared[f.field] = emptyFor(f);
    emit(cleared);
  };

  const activeCount = fields.reduce((n, f) => n + (isEmpty(f, values[f.field]) ? 0 : 1), 0);

  const control = (f) => {
    const v = values[f.field];
    const name = f.label || f.field;
    const opts = typeof f.options === "function" ? f.options(values) : f.options;
    const common = { size, disabled: disabled || f.disabled, "aria-label": name };
    if (f.type === "multiselect") {
      return <MultiSelect {...common} options={opts || []} value={v || []} placeholder={f.placeholder || "Any"} clearable
        onChange={(next) => setField(f, next)} />;
    }
    if (f.type === "daterange") {
      return <DateRangePicker {...common} tone={tone} value={v || { start: null, end: null }} clearable
        onChange={(range) => setField(f, range)} />;
    }
    if (f.type === "boolean") {
      const boolOpts = [{ value: "", label: f.anyLabel || "Any" }, { value: "true", label: f.trueLabel || "Yes" }, { value: "false", label: f.falseLabel || "No" }];
      return <Select {...common} searchable={false} options={boolOpts} value={v == null ? "" : String(v)}
        onChange={(next) => setField(f, next === "" ? undefined : next === "true")} />;
    }
    if (f.type === "select") {
      return <Select {...common} searchable={f.searchable} options={opts || []} value={v ?? ""} placeholder={f.placeholder || "Any"} portal={f.portal}
        onChange={(next) => setField(f, next === "" ? undefined : next)} />;
    }
    if (f.type === "number") {
      return <Input {...common} type="number" value={v ?? ""} placeholder={f.placeholder}
        onChange={(e) => setField(f, e.target.value === "" ? undefined : Number(e.target.value))} />;
    }
    // search | text
    return <Input {...common} type={f.type === "search" ? "search" : "text"} value={v ?? ""} placeholder={f.placeholder || (f.type === "search" ? "Search…" : "")}
      onChange={(e) => setField(f, e.target.value)} />;
  };

  return (
    <div className={`twc-fbar ${className}`} id={fieldId} role="group" aria-label="Filters" {...rest}>
      {styles}
      {fields.map((f) => {
        const active = !isEmpty(f, values[f.field]);
        return (
          <div key={f.field} className="twc-fbar__field" data-type={f.type}>
            <div className="twc-fbar__labelrow">
              <span className="twc-fbar__label">{f.label || f.field}</span>
              {showFieldClear && active && !disabled ? (
                <button type="button" className="twc-fbar__clearone" aria-label={`Clear ${f.label || f.field}`} onClick={() => clearField(f)}>{xIcon}</button>
              ) : null}
            </div>
            {control(f)}
          </div>
        );
      })}
      {showClearAll ? (
        <div className="twc-fbar__actions">
          <button type="button" className="twc-fbar__clearall" onClick={clearAll} disabled={disabled || activeCount === 0}>
            {xIcon}{clearAllLabel}{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      ) : null}
    </div>
  );
}
