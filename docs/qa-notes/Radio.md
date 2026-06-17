# QA notes — Radio

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- Controlled/uncontrolled with value/name/defaultChecked/onChange
- Required grouping via shared name attribute works (line 77)
- Indeterminate state NOT supported (not a native radio feature, correct)
- All tone variants render with correct accent colors (primary/success/warning/danger/info/neutral)
- aria-required and aria-invalid wired when props present (lines 84-86)
- Error state displays below radio with aria-describedby linking (lines 69, 102)
- Size variants (sm/md) scale appropriately
- Disabled state with reduced opacity and cursor:not-allowed
- Label and description rendering conditional and correct
- Focus ring visible on :focus-visible (line 53)
- Group layout via flex with proper gap
- SSR-safe: window checks in useInsertionEffect
- RTL-safe: no physical left/right, uses align-items/gap
