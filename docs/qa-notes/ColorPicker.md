# QA notes — ColorPicker

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] Portal not detected at runtime** — Not a real risk: `createPortal` is a guaranteed `react-dom` peer dependency and ColorPicker imports it directly (`import { createPortal } from "react-dom"`). Select's `window.ReactDOM` fallback exists only for a niche UMD/global-React scenario; the direct import is correct and standard. Not a defect.

- [x] **[P2] Hex input blur does not clamp precision** — ✓ fixed 2026-06-17 (onBlur reverts an invalid hex to the last valid committed color via lastValidRef; onChange is never called with garbage). `ColorPicker.jsx`.

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
