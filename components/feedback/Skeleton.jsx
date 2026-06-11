import React from "react";

export function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  className = "",
  style,
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-skeleton-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-skeleton-styles";
    el.textContent = `
.twc-skeleton {
  position: relative; overflow: hidden;
  background: var(--color-surface-sunken); border-radius: var(--radius-md);
}
.twc-skeleton::after {
  content: ""; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-text) 8%, transparent), transparent);
  animation: twico-shimmer 1.4s infinite;
}
.twc-skeleton[data-variant="text"] { height: 0.9em; border-radius: var(--radius-sm); }
.twc-skeleton[data-variant="circle"] { border-radius: var(--radius-full); }
.twc-skeleton[data-variant="rect"] { border-radius: var(--radius-lg); }
.twc-skeleton__group { display: flex; flex-direction: column; gap: 8px; }
.twc-skeleton__group .twc-skeleton:last-child { width: 70%; }
/* The shimmer signals loading — keep it animating even under reduced motion. */
@media (prefers-reduced-motion: reduce) {
  .twc-skeleton::after { animation-duration: 1.4s !important; animation-iteration-count: infinite !important; }
}
`;
    document.head.appendChild(el);
  }, []);

  if (variant === "text" && lines > 1) {
    return (
      <div className={`twc-skeleton__group ${className}`} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <span key={i} className="twc-skeleton" data-variant="text" style={{ width: width || "100%" }} />
        ))}
      </div>
    );
  }

  return (
    <span
      className={`twc-skeleton ${className}`}
      data-variant={variant}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
