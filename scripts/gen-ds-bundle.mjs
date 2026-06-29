#!/usr/bin/env node
// Regenerates the root `_ds_bundle.js` IN-REPO so it stops drifting behind the library.
//
// `_ds_bundle.js` is the browser-global bundle that the repo-only preview files read:
// every `*.card.html` and `ui_kits/*/index.html` loads React/ReactDOM (UMD, from a CDN),
// then `_ds_bundle.js`, then reads components off `window.TwicoUiDesignSystem_f2f16a`.
// It is NOT shipped to npm and NOT part of the docs site.
//
// This regenerator reproduces that runtime CONTRACT (the `window.<ns>.*` exports) by
// bundling the built `dist/` into an IIFE, with react/react-dom mapped to the UMD globals
// the previews provide. It is a *best-effort* generator: it does not reproduce the
// `twico-ui-design` skill's exact internal layout — the skill re-emits canonically on its
// next packaging — but it keeps the previews on the current component code.
//
//   npm run build && node scripts/gen-ds-bundle.mjs
import { build } from "esbuild";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";

const NS = "TwicoUiDesignSystem_f2f16a"; // the global the preview files already read
const ENTRY = "dist/index.mjs";
const OUT = "_ds_bundle.js";

if (!existsSync(ENTRY)) {
  console.error(`✗ ${ENTRY} not found — run \`npm run build\` first.`);
  process.exit(1);
}

// Map bare react specifiers to the UMD globals the preview pages load before this bundle.
// (The UMD build has no `react/jsx-runtime`, so synthesize jsx/jsxs from React.createElement.)
const reactGlobals = {
  name: "react-globals",
  setup(b) {
    const cjs = {
      react: "module.exports = (globalThis.React || window.React);",
      "react-dom": "module.exports = (globalThis.ReactDOM || window.ReactDOM);",
      "react-dom/client": "module.exports = (globalThis.ReactDOM || window.ReactDOM);",
    };
    b.onResolve({ filter: /^react(-dom(\/client)?)?$/ }, (a) => ({ path: a.path, namespace: "rg" }));
    b.onResolve({ filter: /^react\/jsx-(dev-)?runtime$/ }, (a) => ({ path: a.path, namespace: "rg" }));
    b.onLoad({ filter: /.*/, namespace: "rg" }, (a) => {
      if (cjs[a.path]) return { contents: cjs[a.path], loader: "js" };
      return {
        loader: "js",
        // Spread array children as positional createElement args — same shape the original
        // classic-createElement bundle used. Real .map()'d children keep their keys; static
        // sibling arrays become separate positional args (no spurious key warnings).
        contents: `
const R = (globalThis.React || window.React);
export const Fragment = R.Fragment;
export function jsx(type, props, key) {
  const p = Object.assign({}, props);
  const c = p.children;
  delete p.children;
  if (key !== undefined && key !== null) p.key = key;
  if (c === undefined) return R.createElement(type, p);
  return Array.isArray(c) ? R.createElement(type, p, ...c) : R.createElement(type, p, c);
}
export const jsxs = jsx;
export const jsxDEV = jsx;
export default { Fragment, jsx, jsxs, jsxDEV };
`,
      };
    });
  },
};

const result = await build({
  entryPoints: [ENTRY],
  bundle: true,
  format: "iife",
  // Bare identifier: a top-level `var` in the classic <script> the previews use becomes a
  // window property (window.<NS>). A dotted "window.<NS>" would make esbuild assign to the
  // getter-only `window` global and throw.
  globalName: NS,
  platform: "browser",
  target: "es2020",
  legalComments: "none",
  write: false,
  plugins: [reactGlobals],
});
const body = result.outputFiles[0].text;

// Header: declares the bundle's source inputs so `check:ds-bundle` can detect future drift.
function walkJsx(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) walkJsx(p, acc);
    else if (e.name.endsWith(".jsx")) acc.push(p);
  }
  return acc;
}
const sources = walkJsx("components").sort();
const hash = (rel) => createHash("sha256").update(readFileSync(rel)).digest("hex").slice(0, 12);
const sourceHashes = Object.fromEntries(sources.map((rel) => [rel, hash(rel)]));
if (existsSync("src/index.ts")) sourceHashes["src/index.ts"] = hash("src/index.ts");

const manifest = existsSync("_ds_manifest.json") ? JSON.parse(readFileSync("_ds_manifest.json", "utf8")) : { components: [] };
const meta = {
  format: 3,
  namespace: NS,
  components: (manifest.components || []).map((c) => ({ name: c.name, sourcePath: c.sourcePath })),
  sourceHashes,
  inlinedExternals: [],
  builtBy: "scripts/gen-ds-bundle.mjs",
};
const header = `/* @ds-bundle: ${JSON.stringify(meta).replace(/\*\//g, "*\\/")} */\n`;
writeFileSync(OUT, header + body);
console.log(`✓ wrote ${OUT} (${(Buffer.byteLength(header + body) / 1024).toFixed(0)} KB) — ${sources.length} component sources hashed, global window.${NS}`);
