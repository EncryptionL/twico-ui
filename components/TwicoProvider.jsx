import React from "react";
import { NonceContext } from "./_styles.js";

/**
 * App-level provider for Twico UI. Currently supplies a CSP `nonce` that every
 * component's injected `<style>` stamps, so the library works under a strict
 * `style-src 'nonce-…'` policy without `unsafe-inline` (#57).
 */
export function TwicoProvider({ nonce, children }) {
  return React.createElement(NonceContext.Provider, { value: nonce }, children);
}
