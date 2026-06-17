// twico-ui/colors — the primitive color scales as plain JS objects.
//
// Mirrors Material UI's `@mui/material/colors`: given a HUE and a SHADE you can
// import a hex string directly —
//
//   import { indigo } from "twico-ui/colors";
//   const color = indigo[500]; // "#6366f1"
//
// These are the same raw values declared as `--indigo-*` / `--slate-*` / … in
// tokens/colors.css; tests/colors.test.ts asserts the two never drift. Use these
// when a CSS custom property is awkward (charts, canvas, inline style maths, JS
// theme objects). For app theming prefer the SEMANTIC aliases (`var(--color-primary)`,
// `var(--color-surface)`, …) which also flip under dark mode — JS primitives do not.

/** Indigo — the brand scale. Remap `--brand-*` (CSS) to reskin the library. */
export const indigo = {
  50: "#eef2ff",
  100: "#e0e7ff",
  200: "#c7d2fe",
  300: "#a5b4fc",
  400: "#818cf8",
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#312e81",
  950: "#1e1b4b",
} as const;

/** Slate — the neutral scale (surfaces, borders, text). */
export const slate = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
  950: "#020617",
} as const;

/** Emerald — the success hue. */
export const emerald = {
  50: "#ecfdf5",
  400: "#34d399",
  500: "#10b981",
  600: "#059669",
} as const;

/** Amber — the warning hue. */
export const amber = {
  50: "#fffbeb",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
} as const;

/** Rose — the danger hue. */
export const rose = {
  50: "#fff1f2",
  400: "#fb7185",
  500: "#f43f5e",
  600: "#e11d48",
} as const;

/** Sky — the info hue. */
export const sky = {
  50: "#f0f9ff",
  400: "#38bdf8",
  500: "#0ea5e9",
  600: "#0284c7",
} as const;

/** Alias of {@link indigo} — mirrors the CSS `--brand-*` → `--indigo-*` aliasing. */
export const brand = indigo;

/** Every primitive scale, keyed by hue name. */
export const colors = { indigo, slate, emerald, amber, rose, sky } as const;

export default colors;
