# QA notes — FileUpload

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- Controlled/uncontrolled file list (value/defaultValue/onChange)
- Drop zone drag-and-drop functional with visual feedback (line 17)
- Drag active state changes background and border color (line 25)
- Click to open file picker integration
- Multiple vs single file mode (line 93)
- File size formatting (fmtSize function, lines 49-53)
- File list displays name, size, and remove button for each
- Required asterisk and error message support
- Label, hint, error rendering conditional
- Disabled state reduces opacity and prevents interaction
- Tone variants apply to drop zone border and background
- All tone variants have proper color intents
- aria-label on remove buttons (line 260 in source)
- Hidden file input element (position:absolute, opacity:0)
- Accepts MIME type filtering via `accept` prop
- File extension icon not rendered (just generic file icon)
- SSR-safe: useInsertionEffect
