# QA notes — Switch

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

- [x] **[#454] the off-state track was 1.49:1 against the surface** - now `--color-control-border` (see Checkbox). `Switch.jsx:35` - fixed 2026-10-07

- [x] **[#454 review] the first version of this fix traded one 1.4.11 failure for another** - moving the track to `--color-control-border` fixed track-vs-surface but dropped the white thumb to **2.56:1** against the track in dark mode (from 10.35:1), and the thumb's position is what conveys on/off. The two constraints pull opposite ways, so the track now has its own token: `--color-control-track` is slate-500 in light (where a white thumb on a white surface is invisible, so the track must carry identification at 4.76:1) and stays slate-700 in dark (where the thumb already reads at 10.35:1 against the track and ~14:1 against the surface). `tests/tokens-a11y.test.js` now asserts BOTH halves so neither can be traded away again. `Switch.jsx:35` - fixed 2026-10-07

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
