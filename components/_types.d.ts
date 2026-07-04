import * as React from "react";

// Shared, library-wide type vocabulary. Types only — no runtime. Re-exported from
// the package root so consumers can name the same unions the components use, instead
// of re-deriving them. See docs/tone-variant-system.md and docs/prop-conventions.md.

/** The canonical six-value color/intent scale used by status & control components. */
export type Tone = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

/** Action controls (Button, IconButton) — brand or destructive only. */
export type ActionTone = "primary" | "danger";

/** Text roles, the full color scale, and `"inherit"` (adopt the parent color) — Text. */
export type TextTone = "default" | "muted" | "subtle" | "inherit" | Tone;

/** Toast tone vocabulary — `"neutral"` is an alias of `"default"`. */
export type ToastTone = "default" | "neutral" | "success" | "warning" | "danger" | "info";

/** Progress / Timeline bar tones — the scale minus `"neutral"` (no neutral bar state). */
export type BarTone = Exclude<Tone, "neutral">;

/**
 * The `as` prop of the polymorphic primitives — any intrinsic tag name (`"div"`)
 * OR a React component (`as={Link}`), whose props then flow through `{...rest}`.
 */
export type PolymorphicAs = React.ElementType;
