# QA notes — Field

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- Label renders with required asterisk when required=true (lines 45-46)
- Hint/error conditional rendering with error taking precedence (lines 50-52)
- Stable `${id}-desc` id exposed for consumer aria-describedby (line 40)
- htmlFor attribute on label correctly links to control (line 45)
- Auto-ID generation via React.useId when id not provided (line 36)
- Layout is flex column with proper gap spacing (line 6)
- data-size attribute exposed for styling consistency (line 43)
- Children render between label and hint/error (line 49)
- Consumer responsible for wiring aria-invalid/aria-describedby (documented in JSDoc)
- No inline styles, uses CSS class exclusively
- Works with any child control, not coupled to specific components
- SSR-safe: useInsertionEffect pattern for style injection
