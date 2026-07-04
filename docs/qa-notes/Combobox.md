# QA notes — Combobox

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Backspace with selected item keeps selection** — Line 182 has a comment "keep selection; user can clear" but the logic does nothing — just returns early. User expects Backspace to be able to clear the field when empty. Consider allowing a second press to clear, or document this behavior. `Combobox.jsx:182`.

## Enhancements

- **[#92] Opt-in option-list virtualization** — `virtualized` (+ `overscan`, default 8) windows the
  option list to the visible slice for long client-side sets; keyboard nav scrolls unrendered options
  into view. Off by default. For server-backed sets, prefer the async `onInputChange` + `filter={false}`
  path (#88). — added 2026-07-04

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
