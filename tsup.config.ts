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
export default {
  entry: { index: "src/index.ts", colors: "src/colors.ts", icons: "src/icons.ts" },
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
