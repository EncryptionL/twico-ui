# QA notes — Checkbox

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

- [x] **[#454] the unchecked box border was 1.49:1** - the boundary is the only indication the control exists, so SC 1.4.11 asks 3:1 of it, and `--color-border-strong` (tuned for card/divider edges) did not deliver. Added `--color-control-border` (4.76:1 on white, 6.96:1 on the dark surface) and used it here. `Checkbox.jsx:36` - fixed 2026-10-07

## Verified OK

- Controlled/uncontrolled dual mode works correctly (checked + defaultChecked + onChange)
- Indeterminate state properly managed via ref.current.indeterminate (line 69)
- All tone variants render with correct accent colors (primary/success/warning/danger/info/neutral)
- aria-required and aria-invalid wired when props present (lines 85-86)
- Error state displays below checkbox with aria-describedby linking (lines 70-71, 107-108)
- Size variants (sm/md) scale appropriately
- Disabled state with reduced opacity and cursor:not-allowed
- Label and description rendering conditional and correct
- Focus ring visible on :focus-visible (line 53)
- RTL-safe: uses logical class naming, no physical positioning
- SSR-safe: window checks in useInsertionEffect, no window at module scope
- prefers-reduced-motion respected (animation timings available via CSS variables)
