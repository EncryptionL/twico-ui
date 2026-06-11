import React from "react";

// Simple brand mark: four rounded tiles in the primary color + a wordmark.
export default function Logo({ size = 26, withText = true }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="9" height="9" rx="2.6" fill="var(--color-primary)" />
        <rect x="13" y="2" width="9" height="9" rx="2.6" fill="var(--color-primary)" opacity="0.55" />
        <rect x="2" y="13" width="9" height="9" rx="2.6" fill="var(--color-primary)" opacity="0.55" />
        <rect x="13" y="13" width="9" height="9" rx="2.6" fill="var(--color-primary)" />
      </svg>
      {withText ? (
        <span style={{ fontWeight: "var(--font-extrabold, 800)", fontSize: 18, letterSpacing: "-0.02em", color: "var(--color-text)" }}>
          Twico UI
        </span>
      ) : null}
    </span>
  );
}
