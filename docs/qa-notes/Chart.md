# QA notes — Chart

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

- [x] **[#455] two palette slots were the same colour** - slot 1 was `var(--brand-500)` and slot 6 `var(--indigo-500)`, and `--brand-500` aliases `--indigo-500`, so series 1 and 6 painted identically (1.00:1) with two identical legend swatches - and `paletteAt` cycling made the effective palette six colours, not seven. CHART_PALETTE now points at the theme-aware `--color-chart-1...7` ramp: seven distinct hues, >=3:1 on their own surface in both themes, closest pair 23.8 dE76 apart. Guarded by `tests/chart-palette.test.js`. `_chart.js:15` - fixed 2026-10-07
- [x] **[#453] a toggled-off legend entry was dimmed to 1.93:1** - it is an enabled `role="button"` with `tabIndex=0`, so `opacity: 0.4` over `--color-text-muted` was not exempt. It now uses an AA-clearing subtle colour plus a line-through (which also stops the off state being signalled by colour alone, SC 1.4.1); only the swatch, which repeats the label, is faded. `_chart.js:190` - fixed 2026-10-07

## Verified OK

- **Bar chart rendering:** Groups bars per data point; multi-series bars nest with gap + offset math. Hover shows tooltip on <title> element (browser native).
- **Line chart rendering:** Smooth line via cubic path interpolation (M/L commands); dots positioned correctly. Tooltips on both lines and dots.
- **Axis scaling (niceCeil):** Smart rounding to [1, 2, 5, 10] × power-of-10 steps. Prevents ugly decimals.
- **Grid lines:** Exactly `ticks + 1` lines evenly spaced; correct alignment with axis labels.
- **Legend:** Renders only when multi-series (keys.length > 1) + showLegend=true.
- **Color cycling:** Palette cycles (palette[si % palette.length]) when series > colors. Defaults to the 5-color brand palette.
- **SVG accessibility:** role="img" + aria-label (ariaLabelProp > ariaLabel > default); preserveAspectRatio="none" scales to container.
- **Height prop:** Scales viewBox Y coordinate; affects inner height calculation.
