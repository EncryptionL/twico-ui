# QA notes — Combobox

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Backspace with selected item keeps selection** — Line 182 has a comment "keep selection; user can clear" but the logic does nothing — just returns early. User expects Backspace to be able to clear the field when empty. Consider allowing a second press to clear, or document this behavior. `Combobox.jsx:182`.

## Enhancements

- **[#342] `disabled` fully suppresses the clear ✕** — the clear "✕" render condition
  (`clearable && selected && !open`) lacked a `!disabled` term, so a disabled Combobox still rendered a
  clickable clear that fired `onChange(null)` — a disabled (read-only) control could be value-wiped
  (`.twc-cb__control[data-disabled]` sets only opacity, no `pointer-events: none`). Added `!disabled` to the
  render (matching Select/DatePicker) **and** a `if (disabled) return;` sink guard at the top of `commit()`,
  so no path (clear ✕, Backspace-to-clear) mutates value while disabled. Tests in
  `tests/disabled-clear-affordance.test.jsx`. — fixed 2026-08-11

- **[#326] Richer options — `renderOption` + option `icon`/`hint`** — the shared `Option` type gains optional
  `icon` (leading node, rendered in `.twc-opt__icon`) and `hint` (trailing muted node in `.twc-opt__hint`, e.g.
  a shortcut/count) for a lift with no custom render. For full control, `renderOption(option, { selected, active })
  => node` replaces the row **body** while twico keeps the row chrome (the `.twc-opt` button, keyboard nav, ARIA
  `aria-selected`/active, and the clear affordance). `renderOption` takes precedence over `icon`/`hint`. Like
  `wrapOptions`, it **disables `virtualized`** (custom/variable-height rows can't be windowed by the fixed
  `rowH`) and `warnOnce`s in dev if both are set (`combobox-var-height-virtualized`). Mirrored on Select +
  MultiSelect (same `.twc-opt` markup; MultiSelect keeps its checkbox around the custom body). Shared tests in
  `tests/select-family-render-option.test.jsx`. — added 2026-08-04

- **[#92] Opt-in option-list virtualization** — `virtualized` (+ `overscan`, default 8) windows the
  option list to the visible slice for long client-side sets; keyboard nav scrolls unrendered options
  into view. Off by default. For server-backed sets, prefer the async `onInputChange` + `filter={false}`
  path (#88). — added 2026-07-04

- **[#300] `wrapOptions` — multi-line option text** — `.twc-opt__label`/`__desc` truncate to one line
  (`white-space: nowrap` + ellipsis), so options sharing a long common prefix (e.g. catalog descriptions that
  share a leading code) were indistinguishable when the differing tail was cut off. `wrapOptions`
  (default false) flips a `data-wrap` attribute on each option row; scoped CSS then sets
  `white-space: normal` + `overflow-wrap: anywhere` (the latter also breaks a single very long token so it
  can't overflow the popover edge) and top-aligns the check icon. **Takes precedence over `virtualized`**
  — wrapped rows are variable-height, which the fixed-`rowH` (36/48) windowing can't measure; passing both
  disables virtualization and `warnOnce`s in dev. Default single-line behavior is unchanged. 4 tests in
  `tests/combobox-wrap-options.test.jsx`. Not (yet) mirrored on Select/MultiSelect (same `.twc-opt` markup,
  could be added if requested). — added 2026-07-30

## Verified OK

- Controlled/uncontrolled single-select (value/defaultValue/onChange)
- Type-to-filter behavior works (displays query while open)
- Portal mode with fixed positioning and viewport flip (lines 138-156)
- Keyboard navigation: ArrowDown/Up navigate, Enter selects, Escape closes (lines 177-180)
- Grouped options with descriptions render correctly
- Clearable button shows when value selected (line 257)
- aria-expanded, aria-autocomplete, aria-activedescendant wired (lines 247-249)
- Focus management: opens menu on focus if not already open (line 252)
- Visible options list auto-scrolls to keep active option visible (line 169)
- Selected label shows when menu closed (line 185)
- Empty state message renders when no results (line 195)
- RTL-safe: uses inset-inline-start/end (line 46)
- SSR-safe: portal fallback detection
