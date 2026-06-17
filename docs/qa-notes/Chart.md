# QA notes — Chart

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Bar chart rendering:** Groups bars per data point; multi-series bars nest with gap + offset math. Hover shows tooltip on <title> element (browser native).
- **Line chart rendering:** Smooth line via cubic path interpolation (M/L commands); dots positioned correctly. Tooltips on both lines and dots.
- **Axis scaling (niceCeil):** Smart rounding to [1, 2, 5, 10] × power-of-10 steps. Prevents ugly decimals.
- **Grid lines:** Exactly `ticks + 1` lines evenly spaced; correct alignment with axis labels.
- **Legend:** Renders only when multi-series (keys.length > 1) + showLegend=true.
- **Color cycling:** Palette cycles (palette[si % palette.length]) when series > colors. Defaults to the 5-color brand palette.
- **SVG accessibility:** role="img" + aria-label (ariaLabelProp > ariaLabel > default); preserveAspectRatio="none" scales to container.
- **Height prop:** Scales viewBox Y coordinate; affects inner height calculation.
