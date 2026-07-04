import React from "react";

/**
 * Returns the theme-init IIFE string. It mirrors useColorScheme's read()+apply():
 * read the stored scheme, fall back to `prefers-color-scheme` (or `defaultScheme`),
 * then apply it. Deliberately free of `<`, `>`, `&` so it can render as a plain
 * `<script>` text child (React escapes those in a text node — no dangerouslySetInnerHTML).
 */
export function getColorSchemeScript({ storageKey = "twico-theme", attribute = "class", defaultScheme } = {}) {
  const k = JSON.stringify(storageKey);
  const a = JSON.stringify(attribute);
  const d = defaultScheme === "dark" || defaultScheme === "light" ? JSON.stringify(defaultScheme) : "null";
  return `(function(){try{var k=${k},a=${a},d=${d},t=localStorage.getItem(k);if(t!=='light'){if(t!=='dark'){t=d?d:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}}if(a==='class'){document.documentElement.classList.toggle('dark',t==='dark');}else{document.documentElement.setAttribute(a,t);}}catch(e){}})();`;
}

/**
 * Drop into your SSR document `<head>` to apply the persisted color scheme before
 * first paint — eliminating the theme flash. Pairs with `useColorScheme`.
 */
export function ColorSchemeScript({ storageKey = "twico-theme", attribute = "class", nonce, defaultScheme }) {
  return React.createElement("script", { nonce }, getColorSchemeScript({ storageKey, attribute, defaultScheme }));
}
