# QA notes — ColorPicker

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P1] Portal not detected at runtime** — ColorPicker uses `createPortal` but doesn't fallback like Select/Combobox do (line 253 in Select vs ColorPicker line ~260). If createPortal is unavailable, the popover will not render. _Fix:_ Add fallback like Select does: check for createPortal availability before using it. `ColorPicker.jsx:~260`.

- [ ] **[P2] Hex input blur does not clamp precision** — User can type "ABCDEFGH" (8 chars) and blur; Component should validate/clamp to 6-char hex. Currently no blur handler normalizes input. _Fix:_ Add onBlur handler to hex input that calls a normalization function. `ColorPicker.jsx:~line-where-hex-input-is`.

## Verified OK

- Controlled/uncontrolled color value (value/defaultValue/onChange)
- HSV color space math implemented correctly (hsvToRgb, rgbToHex, hexToHsv)
- Saturation + Value 2D selector with crosshair handle
- Hue slider with visual gradient
- Hex input field editable and reflects picker changes
- Preset colors clickable and highlight when selected
- Portal mode with fixed positioning
- Tone variants apply to hex input focus ring (lines 42-48)
- Required asterisk and error message support
- Label, hint, error rendering
- Disabled state reduces opacity
- SVG icons render correctly
- SSR-safe: useInsertionEffect guards style injection
