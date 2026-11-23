import * as React from "react";
import type { DatatableProps } from "./data-display/Datatable";
import type { CardGridProps } from "./data-display/CardGrid";

/**
 * #554: app-wide component defaults. Keyed by component name; every key is optional, and the value is
 * a partial of that component's own props.
 *
 * An allow-list rather than "any prop of any component": a defaults blob is written once and read
 * never, so a key that silently does nothing is worse than no feature — this type rejects one at
 * compile time, and `TwicoProvider` warns about one in development.
 */
export interface TwicoDefaults {
  /** Defaults for every `<Datatable>` in the tree. */
  Datatable?: Partial<DatatableProps>;
  /** Defaults for every `<CardGrid>` in the tree. */
  CardGrid?: Partial<CardGridProps>;
}

export interface TwicoProviderProps {
  /** CSP nonce stamped on every injected `<style>` (for `style-src 'nonce-…'` without `unsafe-inline`). */
  nonce?: string;
  /**
   * #554: defaults applied to every opted-in component in the tree, merged **under** its own props —
   * built-in < provider default < prop, so a call site always wins. The same precedence
   * `defaultColumn` establishes one level down inside `Datatable`.
   *
   * ```tsx
   * <TwicoProvider defaults={{ Datatable: { rowResize: true, resizablePopovers: true } }}>
   * ```
   *
   * An object literal written inline is fine: the provider keeps the previous value while the next one
   * is structurally equal, so it does not re-render the tree on every render of its own parent.
   */
  defaults?: TwicoDefaults;
  children?: React.ReactNode;
}

export function TwicoProvider(props: TwicoProviderProps): React.JSX.Element;
