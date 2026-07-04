import * as React from "react";

export interface TwicoProviderProps {
  /** CSP nonce stamped on every injected `<style>` (for `style-src 'nonce-…'` without `unsafe-inline`). */
  nonce?: string;
  children?: React.ReactNode;
}

export function TwicoProvider(props: TwicoProviderProps): React.JSX.Element;
