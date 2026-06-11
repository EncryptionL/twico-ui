#!/usr/bin/env node
/**
 * Regenerate the hardcoded HOOKS list inside `site/src/data/exports.js` from the
 * real `hooks/index.js`, so the docs-site "expand snippet" import derivation can
 * never drift from the actual public hooks API.
 *
 *   node scripts/gen-exports.mjs            rewrite exports.js
 *   node scripts/gen-exports.mjs --check    exit 1 if it is stale (CI guard)
 *
 * (The component half of EXPORT_NAMES is already derived from components.js at
 * runtime; only the hooks list needs syncing here.)
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(SITE, "..");
const HOOKS_SRC = join(ROOT, "hooks", "index.js");
const OUT = join(SITE, "src", "data", "exports.js");

const src = await readFile(HOOKS_SRC, "utf8");
const hooks = [...src.matchAll(/^export (?:function|const) (use[A-Za-z0-9]+)/gm)].map((m) => m[1]);
if (!hooks.length) {
  console.error("✗ No hooks found in hooks/index.js");
  process.exit(2);
}

// Render the HOOKS array, four per line to match the existing style.
const lines = [];
for (let i = 0; i < hooks.length; i += 4) {
  lines.push("  " + hooks.slice(i, i + 4).map((h) => `"${h}"`).join(", ") + ",");
}

const next = `import { components } from "./components.js";

// Hooks exported from twico-ui. GENERATED from hooks/index.js by
// scripts/gen-exports.mjs — run \`npm run gen:exports\` after adding a hook.
const HOOKS = [
${lines.join("\n")}
];

// Every named export of "twico-ui" — used to derive the import line when a snippet
// is expanded to its full, runnable form.
export const EXPORT_NAMES = Array.from(
  new Set([
    ...components.flatMap((c) => c.importName.split(",").map((s) => s.trim())),
    ...HOOKS,
  ])
).filter(Boolean);
`;

if (process.argv.includes("--check")) {
  let cur = "";
  try { cur = await readFile(OUT, "utf8"); } catch {}
  if (cur.replace(/\r\n/g, "\n") !== next.replace(/\r\n/g, "\n")) {
    console.error("✗ site/src/data/exports.js is stale. Run `npm run gen:exports` and commit.");
    process.exit(1);
  }
  console.log("✓ exports.js hooks list is up to date (" + hooks.length + " hooks).");
} else {
  await writeFile(OUT, next, "utf8");
  console.log("✓ Wrote exports.js with " + hooks.length + " hooks.");
}
