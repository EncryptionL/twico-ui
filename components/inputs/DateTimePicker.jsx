import React from "react";
import { useScopedStyles } from "../_styles.js";
import { DatePicker } from "./DatePicker.jsx";
import { TimePicker } from "./TimePicker.jsx";

const FIELD_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`;

const DTP_CSS = `
.twc-dtp { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-dtp__row { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: flex-start; }
.twc-dtp__date { flex: 1 1 11rem; min-width: 9rem; }
.twc-dtp__time { flex: 0 1 8rem; min-width: 7rem; }
`;

// DateTimePicker = DatePicker (calendar) + TimePicker (columns) over a single Date value.
// Composite by design (§5): it reuses the two sibling pickers rather than re-implementing
// the calendar or the time columns. min/max bound the DATE via DatePicker; the time is free.
export function DateTimePicker({
  label,
  hint,
  error,
  required = false,
  value,
  defaultValue = null,
  disabled = false,
  tone = "primary",
  size = "md",
  clearable = true,
  min,
  max,
  disabledDate,
  minuteStep = 5,
  secondStep = 5,
  granularity = "minute",
  hourCycle = 24,
  locale,
  weekStartsOn = 0,
  dateFormat,
  timeFormat,
  datePlaceholder = "Select date",
  timePlaceholder = "Time",
  onChange,
  id,
  className = "",
  ...rest
}) {
  const __twcStyles0 = useScopedStyles("twc-field-styles", FIELD_CSS);
  const __twcStyles1 = useScopedStyles("twc-datetimepicker-styles", DTP_CSS);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const descId = `${fieldId}-desc`;
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = value !== undefined ? value : internal;

  const commitVal = (d) => { if (value === undefined) setInternal(d); onChange?.(d); };

  // Merge a newly-picked date part with the existing time (or midnight when none yet).
  const onDateChange = (d) => {
    if (!d) return commitVal(null);
    const b = selected;
    commitVal(new Date(d.getFullYear(), d.getMonth(), d.getDate(), b ? b.getHours() : 0, b ? b.getMinutes() : 0, b ? b.getSeconds() : 0, 0));
  };
  // Merge a newly-picked time with the existing date (or the time's own date when none yet).
  const onTimeChange = (t) => {
    if (!t) return;
    const b = selected;
    commitVal(new Date(b ? b.getFullYear() : t.getFullYear(), b ? b.getMonth() : t.getMonth(), b ? b.getDate() : t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), 0));
  };

  // On error, recolor both controls via tone (red border/ring) while the message shows once
  // on the wrapper — avoids a duplicated error string under each control.
  const childTone = error ? "danger" : tone;

  return (
    <div className={`twc-dtp twc-field ${className}`} id={fieldId} {...rest}>
      {__twcStyles0}
      {__twcStyles1}
      {label ? (
        <label className="twc-field__label" id={`${fieldId}-label`}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </label>
      ) : null}
      <div className="twc-dtp__row" role="group" aria-labelledby={label ? `${fieldId}-label` : undefined} aria-describedby={error || hint ? descId : undefined}>
        <div className="twc-dtp__date">
          <DatePicker value={selected} onChange={onDateChange} disabled={disabled} tone={childTone} size={size}
            clearable={clearable} min={min} max={max} disabledDate={disabledDate} locale={locale} weekStartsOn={weekStartsOn}
            format={dateFormat} placeholder={datePlaceholder} aria-label="Date" />
        </div>
        <div className="twc-dtp__time">
          <TimePicker value={selected} onChange={onTimeChange} disabled={disabled} tone={childTone} size={size}
            clearable={false} minuteStep={minuteStep} secondStep={secondStep} granularity={granularity} hourCycle={hourCycle}
            locale={locale} referenceDate={selected || undefined} format={timeFormat} placeholder={timePlaceholder} aria-label="Time" />
        </div>
      </div>
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
