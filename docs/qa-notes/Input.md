# QA notes — Input

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] Textarea styling leakage** — The `twc-textarea__el` selector uses `data-size` and `data-tone` attributes that conflict with Input CSS logic if both exist on same page. The textarea uses inline `data-*` attributes (line 68-69) but Input applies them to a wrapper `.twc-input` div (line 110). When both load, CSS specificity could cause misalignment. _Fix:_ Namespace textarea styles separately or ensure wrapper element always takes precedence. `Input.jsx:110`, `Textarea.jsx:68-69`. — ✓ fixed 2026-06-17

- [x] **[P1] Input renders invisibly under React 19 (shared style-id dedup)** — the core `.twc-input` box
  rules (border/background/focus/tone) lived inside `FIELD_CSS`, injected under the **shared** id
  `twc-field-styles` (7 field-family components). React 19 hoists `<style href precedence>` and keeps the
  **first** content per href, so when a sibling with the shorter `.twc-field*`-only `FIELD_CSS` (DatePicker,
  TimePicker, …) mounted first, Input's `.twc-input` rules were dropped and the input rendered borderless —
  most visibly the **CardGrid search** and any Datatable filter/edit input under React 19 + Tailwind's
  border reset (#234). _Fix:_ moved the `.twc-input*` rules to the **component-unique** `twc-input-extra-styles`
  block; `twc-field-styles` now carries only the identical `.twc-field*` set across all 7. Guarded by
  `tests/scoped-style-id-dedup.test.js` (no id may map to two CSS bodies). See `docs/ssr-styles.md` → Conventions.
  — ✓ fixed 2026-07-14

## Verified OK

- Controlled/uncontrolled input works with value/defaultValue/onChange
- Password type gets built-in reveal/hide toggle (lines 86-101)
- rightIcon replaces password toggle when provided (lines 87-90)
- Required asterisk renders when required=true (line 107)
- Error state tints border danger + shows error message (lines 119-120, 125)
- Hint text shows when no error (line 125)
- All tones apply to focus ring and border accent (lines 26-31)
- Size variants (sm/md/lg) scale height and padding correctly
- aria-required, aria-invalid, aria-describedby wired properly (lines 118-120)
- Label conditionally rendered with correct htmlFor (lines 105-109)
- Focus ring visible on input element (line 53)
- Disabled state reduces opacity and prevents pointer events
- Password reveal button has proper aria-label and aria-pressed (lines 92)
- SSR-safe: window checks via useInsertionEffect
- RTL-safe: uses padding-inline and gap for spacing
