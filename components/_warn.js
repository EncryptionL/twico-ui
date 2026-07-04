// Internal: dev-only, deduped console.warn. Used for development-time API
// misuse / deprecation notices. No-ops in production (NODE_ENV === "production")
// and after the first time a given key fires, so a warning never spams a render
// loop. Consumers' production bundlers dead-code-eliminate the call sites via the
// static process.env.NODE_ENV replacement. SSR/browser-safe: guards `process`.

const seen = new Set();

export function warnOnce(key, message) {
  if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production") return;
  if (seen.has(key)) return;
  seen.add(key);
  if (typeof console !== "undefined" && console.warn) console.warn(message);
}
