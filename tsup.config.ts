// Builds the twico-ui npm package.
// (Plain object export — tsup accepts this; no `defineConfig` import needed, which
// also keeps the design-system compiler from flagging a build-only dependency.)
//
// - JS: esbuild bundles src/index.ts, resolving each "../components/<dir>/<Name>"
//   import to its .jsx (esbuild tries .tsx/.ts/.jsx/.js — there is no .ts, so .jsx wins).
// - Types: rollup-plugin-dts (via dts:true) uses tsc, which resolves the SAME
//   specifiers to the hand-written sibling .d.ts (allowJs:false in tsconfig),
//   and rolls them into a single dist/index.d.ts.
// react / react-dom stay external (peer deps).
//
// Next.js: every component uses hooks/refs/browser APIs, so the published entry
// needs a top-of-file `"use client"` directive to be importable from an App
// Router *Server* Component. A tsup `banner` does NOT survive bundling (esbuild
// strips module-level directives — "...was ignored"), so we prepend it after the
// build via `onSuccess` -> scripts/add-use-client.mjs. In a plain React app
// (Vite/CRA) the directive is an inert string literal — harmless.
//
// #534: the scoped CSS lives in template literals, so its comments are STRING content and no
// minifier touches them - tsup, esbuild and terser all strip comments from CODE and leave string
// bytes alone. The library was therefore shipping 96,366 bytes of its own CSS commentary to every
// consumer, 8.5% of the raw bundle. `stripCssCommentsPlugin` removes it at LOAD time, so esbuild
// generates the sourcemaps from the stripped text and each map stays self-consistent - it embeds
// the same source it points into. Doing it as a post-build rewrite of dist/ would mean shifting a
// finished map past thousands of removed lines. The comments stay in components/** untouched: the
// source is what contributors and the guard tests read, and only the shipped copy loses them.
import { stripCssCommentsPlugin } from "./scripts/strip-css-comments.mjs";

export default {
  entry: { index: "src/index.ts", colors: "src/colors.ts", icons: "src/icons.ts" },
  esbuildPlugins: [stripCssCommentsPlugin()],
  format: ["esm", "cjs"],
  onSuccess: "node scripts/add-use-client.mjs",
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ["react", "react-dom", "react/jsx-runtime", "lucide-react"],
  outExtension({ format }) {
    return { js: format === "esm" ? ".mjs" : ".cjs" };
  },
  esbuildOptions(options) {
    // Components use classic JSX with `import React from "react"`.
    options.jsx = "transform";
    options.resolveExtensions = [".tsx", ".ts", ".jsx", ".js"];
  },
};
