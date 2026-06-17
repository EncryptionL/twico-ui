# QA notes — Input

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] Textarea styling leakage** — The `twc-textarea__el` selector uses `data-size` and `data-tone` attributes that conflict with Input CSS logic if both exist on same page. The textarea uses inline `data-*` attributes (line 68-69) but Input applies them to a wrapper `.twc-input` div (line 110). When both load, CSS specificity could cause misalignment. _Fix:_ Namespace textarea styles separately or ensure wrapper element always takes precedence. `Input.jsx:110`, `Textarea.jsx:68-69`. — ✓ fixed 2026-06-17

## Verified OK

- Controlled/uncontrolled input works with value/defaultValue/onChange
- Password type gets built-in reveal/hide toggle (lines 86-101)
- rightIcon replaces password toggle when provided (lines 87-90)
- Required asterisk renders when required=true (line 107)
- Error state tints border danger + shows error message (lines 119-120, 125)
- Hint text shows when no error (line 125)
- All tones apply to focus ring and border accent (lines 26-31)
- Size variants (sm/md/lg) scale height and padding correctly
- aria-required, aria-invalid, aria-describedby wired properly (lines 118-120)
- Label conditionally rendered with correct htmlFor (lines 105-109)
- Focus ring visible on input element (line 53)
- Disabled state reduces opacity and prevents pointer events
- Password reveal button has proper aria-label and aria-pressed (lines 92)
- SSR-safe: window checks via useInsertionEffect
- RTL-safe: uses padding-inline and gap for spacing
