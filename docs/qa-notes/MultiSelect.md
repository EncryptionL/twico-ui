# QA notes — MultiSelect

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Enhancements

- **[#342] `disabled` suppresses per-chip remove + popover open** — only the main "Clear all" ✕ guarded
  `!disabled`; the **per-chip remove ✕** and the **chevron** did not, so a disabled MultiSelect still let you
  remove chips and — via the chevron, which called `setOpen` directly (unlike the `!disabled`-guarded control
  body) — open the popover to add/remove options, all firing `onChange`. Now the per-chip ✕ isn't rendered
  when disabled (symmetric chip padding restored via `.twc-ms__control[data-disabled="true"] .twc-ms__chip`),
  the chevron onClick is `!disabled`-guarded (no open), and `commit()` early-returns on `disabled` as a sink
  guard covering every path (chip ✕, option toggle, Backspace, Clear-all). Tests in
  `tests/disabled-clear-affordance.test.jsx`. — fixed 2026-08-11

- **[#326] Richer options — `renderOption` + option `icon`/`hint`** — options may add `icon` (leading, in
  `.twc-opt__icon`) and `hint` (trailing muted, in `.twc-opt__hint`); `renderOption(option, { selected, active })
  => node` replaces the row body while twico keeps the `.twc-opt` chrome **including the selection checkbox**
  (`.twc-opt__box` stays outside the custom body). `renderOption` wins over `icon`/`hint` and **disables
  `virtualized`** (variable-height rows; `warnOnce` key `multiselect-renderoption-virtualized`). Mirrors
  Combobox/Select. Shared tests in `tests/select-family-render-option.test.jsx`. — added 2026-08-04

- **[#92] Opt-in option-list virtualization** — `virtualized` (+ `overscan`, default 8) windows the
  checkable option list to the visible slice for long lists; aria-activedescendant / keyboard indexing
  spans the full list and nav scrolls unrendered options into view. Off by default. — added 2026-07-04

## Verified OK

- Controlled/uncontrolled multi-select (value/defaultValue/onChange)
- Type-to-filter behavior works among chips
- Portal mode with fixed positioning and auto-flip (lines 146-164)
- Chips render as selected indicators with remove buttons (lines 257-264)
- Backspace on empty input removes last chip (line 193)
- Keyboard navigation: ArrowDown/Up navigate, Enter toggles, Escape closes (lines 188-192)
- Checkbox options show checked state (line 217)
- Clearable button removes all selections (line 272)
- aria-multiselectable correctly set on listbox (line 205)
- aria-expanded, aria-autocomplete, aria-activedescendant wired (lines 265-267)
- Placeholder hides when chips present (line 268)
- Input focuses on chip removal (line 186)
- Empty state message renders when no results
- Grouped options with descriptions render
- RTL-safe: uses inset-inline-start/end
- SSR-safe: portal fallback detection
