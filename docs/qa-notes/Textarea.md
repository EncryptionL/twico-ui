# QA notes — Textarea

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Enhancements

- **[#328] `clearable` — trailing clear ✕** — opt-in `clearable` (default false) renders a ✕ positioned
  top-inline-end of the textarea (dodging the bottom-right resize grip), shown only when non-empty and
  interactive. It empties the value and fires `onChange` with `""` for controlled + uncontrolled callers
  (native `HTMLTextAreaElement.prototype.value` setter + dispatched `input` event, which also drives
  `autosize` back to collapsed via `onInput`), then refocuses. The `<textarea>` is wrapped in a
  `.twc-textarea__wrap` positioning context; `ref` forwarding to the inner `<textarea>` is unchanged.
  2 tests in `tests/input-clearable.test.jsx`. — added 2026-08-04

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
