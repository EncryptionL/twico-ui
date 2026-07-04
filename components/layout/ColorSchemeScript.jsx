import React from "react";

// Serialize a value as a JS string literal that is ALSO safe to embed as text inside an
// HTML `<script>` element. `JSON.stringify` encodes for JSON (quotes, backslashes, control
// chars) but leaves the HTML metacharacters `<` `>` `&` — and the U+2028/U+2029 line
// separators — raw: a literal `<` lets a value such as `</script>` or `<!--` break out of the
// element when the result lands in a raw-HTML sink, and a raw line separator can corrupt the
// string literal in pre-ES2019 parsers. Re-encoding them to their `\uXXXX` form keeps the
// *parsed* runtime value byte-for-byte identical (inside a JS string literal `"<" === "<"`),
// while guaranteeing the emitted text never contains a literal `<` `>` or `&`. That
// `.replace()` on the `JSON.stringify` result is also the barrier CodeQL's
// `js/bad-code-sanitization` (CWE-116) recognizes — its `StringReplaceCallAsSanitizer` treats
// any `String.prototype.replace` on the serialized value as adequate sanitization — applied
// here on every consumer-supplied path (storageKey / attribute / defaultScheme).
// The regex uses explicit `\u2028`/`\u2029` escapes so the source has no invisible characters
// a formatter could strip, and the computed replacement yields lowercase `<`/`>`/`&`.
function encodeScriptLiteral(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
}

/**
 * Returns the theme-init IIFE string. It mirrors useColorScheme's read()+apply():
 * read the stored scheme, fall back to `prefers-color-scheme` (or `defaultScheme`),
 * then apply it. Deliberately free of `<`, `>`, `&` so it can render as a plain
 * `<script>` text child (React escapes those in a text node — no dangerouslySetInnerHTML).
 */
export function getColorSchemeScript({ storageKey = "twico-theme", attribute = "class", defaultScheme } = {}) {
  const k = encodeScriptLiteral(storageKey);
  const a = encodeScriptLiteral(attribute);
  const d = defaultScheme === "dark" || defaultScheme === "light" ? encodeScriptLiteral(defaultScheme) : "null";
  return `(function(){try{var k=${k},a=${a},d=${d},t=localStorage.getItem(k);if(t!=='light'){if(t!=='dark'){t=d?d:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}}if(a==='class'){document.documentElement.classList.toggle('dark',t==='dark');}else{document.documentElement.setAttribute(a,t);}}catch(e){}})();`;
}

/**
 * Drop into your SSR document `<head>` to apply the persisted color scheme before
 * first paint — eliminating the theme flash. Pairs with `useColorScheme`.
 */
export function ColorSchemeScript({ storageKey = "twico-theme", attribute = "class", nonce, defaultScheme }) {
  return React.createElement("script", { nonce }, getColorSchemeScript({ storageKey, attribute, defaultScheme }));
}
