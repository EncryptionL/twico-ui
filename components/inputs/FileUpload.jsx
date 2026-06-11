import React from "react";

const UPLOAD_CSS = `
.twc-upload { font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-3); }
.twc-upload__zone {
  display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  gap: 6px; padding: var(--space-8) var(--space-6); cursor: pointer;
  border: var(--border-medium) dashed var(--color-border-strong); border-radius: var(--radius-xl);
  background: var(--color-surface); color: var(--color-text-muted);
  transition: border-color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard);
}
.twc-upload__zone:hover { border-color: var(--color-primary); background: var(--color-surface-sunken); }
.twc-upload__zone[data-drag="true"] { border-color: var(--color-primary); background: var(--color-primary-subtle); }
.twc-upload__zone[data-disabled="true"] { opacity: 0.6; cursor: not-allowed; }
.twc-upload__zone:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-upload__icon { display: inline-grid; place-items: center; width: 46px; height: 46px; border-radius: var(--radius-lg);
  background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); margin-bottom: 4px; }
.twc-upload__icon svg { width: 24px; height: 24px; }
.twc-upload__title { font-size: var(--text-sm); color: var(--color-text); font-weight: var(--font-semibold); }
.twc-upload__title em { color: var(--color-primary); font-style: normal; }
.twc-upload__hint { font-size: var(--text-xs); color: var(--color-text-subtle); }
.twc-upload__input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.twc-upload__list { display: flex; flex-direction: column; gap: 8px; }
.twc-upload__file { display: flex; align-items: center; gap: var(--space-3); padding: 9px 12px;
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); }
.twc-upload__file-ic { flex: none; display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: var(--radius-sm);
  background: var(--color-surface-sunken); color: var(--color-text-muted); }
.twc-upload__file-ic svg { width: 16px; height: 16px; }
.twc-upload__file-main { flex: 1; min-width: 0; }
.twc-upload__file-name { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.twc-upload__file-size { font-size: var(--text-xs); color: var(--color-text-subtle); }
.twc-upload__file-x { flex: none; display: inline-grid; place-items: center; width: 26px; height: 26px; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-full); transition: background-color var(--duration-fast), color var(--duration-fast); }
.twc-upload__file-x:hover { background: var(--color-danger-subtle); color: var(--color-danger-subtle-fg); }
.twc-upload__file-x svg { width: 15px; height: 15px; }
`;

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function FileUpload({
  accept,
  multiple = false,
  disabled = false,
  hint,
  value,
  defaultValue = [],
  onChange,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-upload-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-upload-styles";
    el.textContent = UPLOAD_CSS;
    document.head.appendChild(el);
  }, []);

  const [internal, setInternal] = React.useState(defaultValue);
  const files = value !== undefined ? value : internal;
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);

  const set = (next) => { if (value === undefined) setInternal(next); onChange?.(next); };

  function addFiles(list) {
    const arr = Array.from(list);
    set(multiple ? [...files, ...arr] : arr.slice(0, 1));
  }
  function remove(i) { set(files.filter((_, idx) => idx !== i)); }

  return (
    <div className={`twc-upload ${className}`} {...rest}>
      <div
        className="twc-upload__zone" data-drag={drag || undefined} data-disabled={disabled || undefined}
        role="button" tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (!disabled && e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
      >
        <span className="twc-upload__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
        </span>
        <span className="twc-upload__title"><em>Click to upload</em> or drag and drop</span>
        <span className="twc-upload__hint">{hint || (accept ? accept.replace(/\./g, "").toUpperCase() : "Any file")}</span>
        <input ref={inputRef} className="twc-upload__input" type="file" accept={accept} multiple={multiple} disabled={disabled}
          onChange={(e) => { if (e.target.files.length) addFiles(e.target.files); e.target.value = ""; }} />
      </div>
      {files.length ? (
        <div className="twc-upload__list">
          {files.map((f, i) => (
            <div className="twc-upload__file" key={i}>
              <span className="twc-upload__file-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/></svg>
              </span>
              <span className="twc-upload__file-main">
                <span className="twc-upload__file-name">{f.name}</span>
                <span className="twc-upload__file-size">{fmtSize(f.size)}</span>
              </span>
              <button className="twc-upload__file-x" aria-label={`Remove ${f.name}`} onClick={() => remove(i)} type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
