import * as React from "react";

/** A friendly, partial token surface. Each entry maps to a `--<group>-<key>` CSS variable. */
export interface ThemeTokens {
  /** `--color-*` (e.g. `{ primary: "#5b5bd6" }`). */
  colors?: Record<string, string>;
  /** `--space-*`. */
  space?: Record<string, string>;
  /** `--radius-*`. */
  radius?: Record<string, string>;
  /** `--font-*`. */
  font?: Record<string, string>;
  /** `--shadow-*`. */
  shadow?: Record<string, string>;
  /** Motion vars (e.g. `{ "ease-out": "…", "duration-base": "…" }`) — keyed by the full var suffix. */
  motion?: Record<string, string>;
}

/** A CSS custom-property style object (`{ "--color-primary": "…" }`). */
export type Theme = Record<`--${string}`, string>;

/** Map a partial token object onto a `--*` CSS-variable style object. */
export function createTheme(partial: ThemeTokens): Theme;

export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A `createTheme()` result, or a raw partial token object. */
  theme?: Theme | ThemeTokens;
  /** `"inline"` sets the vars inline (SSR-safe); `"stylesheet"` injects a scoped, nonce-aware rule. @default "inline" */
  mode?: "inline" | "stylesheet";
}

export function ThemeProvider(props: ThemeProviderProps): React.JSX.Element;
