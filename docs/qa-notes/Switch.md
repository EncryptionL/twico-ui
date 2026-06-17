# QA notes — Switch

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- Controlled/uncontrolled mode works (checked/defaultChecked/onChange)
- role="switch" correctly set on input (line 72)
- All tone variants apply to track background when checked (lines 24-29)
- aria-required and aria-invalid wired when props present (lines 79-80)
- Error state displayed below with aria-describedby (lines 65, 99)
- Size variants (sm/md) scale track width and height (lines 39)
- Disabled state opacity reduced and cursor not-allowed
- Label and description conditional rendering works
- Focus ring visible on track via :focus-visible (line 48)
- Thumb animation smooth via CSS transform (line 47)
- Active state scales thumb (line 49)
- SSR-safe: window checks via useInsertionEffect
- RTL-safe: flex layout, no physical positioning
