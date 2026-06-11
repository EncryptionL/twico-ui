import React from "react";

export function Spinner({
  size = "md",
  tone = "current",
  label = "Loading",
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-spinner-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-spinner-styles";
    el.textContent = `
.twc-spinner {
  --_sz: 24px; --_bw: 2.5px;
  display: inline-block; width: var(--_sz); height: var(--_sz);
  /* Default to currentColor so the spinner is visible in any context — including
     inside a solid button, where it inherits the button's (light) text color. */
  border: var(--_bw) solid var(--_track, color-mix(in srgb, currentColor 25%, transparent));
  border-top-color: var(--_c, currentColor);
  border-radius: var(--radius-full); animation: twico-spin 0.65s linear infinite;
}
.twc-spinner[data-size="sm"] { --_sz: 16px; --_bw: 2px; }
.twc-spinner[data-size="lg"] { --_sz: 36px; --_bw: 3.5px; }
.twc-spinner[data-size="xl"] { --_sz: 52px; --_bw: 4px; }
.twc-spinner[data-tone="primary"] { --_c: var(--color-primary); --_track: var(--color-border); }
.twc-spinner[data-tone="white"] { --_c: #fff; --_track: rgba(255,255,255,0.35); }
.twc-spinner[data-tone="neutral"] { --_c: var(--color-text); --_track: var(--color-border); }
/* A loading spinner conveys state — keep it spinning even under reduced motion. */
@media (prefers-reduced-motion: reduce) {
  .twc-spinner { animation-duration: 0.65s !important; animation-iteration-count: infinite !important; }
}
`;
    document.head.appendChild(el);
  }, []);

  return <span className={`twc-spinner ${className}`} data-size={size} data-tone={tone} role="status" aria-label={label} {...rest} />;
}
