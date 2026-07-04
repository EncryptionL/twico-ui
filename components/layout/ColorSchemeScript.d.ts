import * as React from "react";

export interface ColorSchemeScriptOptions {
  /** localStorage key holding the theme (matches useColorScheme). @default "twico-theme" */
  storageKey?: string;
  /** How the scheme is applied: the `dark` class, or a `[data-…]` attribute value. @default "class" */
  attribute?: string;
  /** Scheme to use when nothing is stored (skips the prefers-color-scheme probe). */
  defaultScheme?: "light" | "dark";
}

export interface ColorSchemeScriptProps extends ColorSchemeScriptOptions {
  /** CSP nonce for the inline `<script>`. */
  nonce?: string;
}

/** The theme-init IIFE as a string, for consumers who inject the script themselves. */
export function getColorSchemeScript(options?: ColorSchemeScriptOptions): string;

/** A `<script>` for the SSR `<head>` that applies the persisted color scheme before first paint. */
export function ColorSchemeScript(props: ColorSchemeScriptProps): React.JSX.Element;
