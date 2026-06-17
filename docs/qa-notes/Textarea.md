# QA notes — Textarea

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- All tone variants apply to focus border and ring (lines 40-45)
- Required asterisk shows when required=true (line 62)
- Error message replaces hint when both present (line 78)
- aria-required, aria-invalid, aria-describedby correctly wired (lines 73-75)
- Size variants (sm/md/lg) adjust padding (lines 35-36)
- Disabled state applies opacity and cursor:not-allowed (line 48)
- min-height set to prevent collapse (line 27)
- resize:vertical allows user to expand vertically but not shrink
- Placeholder color appropriate (line 37)
- Hover state shows stronger border when not focused (line 38)
- Focus visible ring renders correctly (focus state line 46)
- Field label with required indicator renders correctly
- SSR-safe: useInsertionEffect guards style injection
- RTL-safe: uses padding inline values
