#!/usr/bin/env node
/**
 * Build a flat index of every "Variations" example title so the docs-site search
 * can surface them (e.g. searching "loading" finds Button → Loading). The titles
 * live in lazy `src/demos/*Variations.jsx` files, so we can't read them at runtime
 * without bundling them all; instead we extract them at build time into
 * `src/data/variations.js`.
 *
 *   node scripts/gen-variations-index.mjs           rewrite the index
 *   node scripts/gen-variations-index.mjs --check    exit 1 if it is stale (CI guard)
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEMOS = join(SITE, "src", "demos");
const OUT = join(SITE, "src", "data", "variations.js");

const files = (await readdir(DEMOS)).filter((f) => /Variations\.jsx$/.test(f)).sort();
// Match an indented `title: "..."` line (the per-example title), not title= attrs
// inside code strings.
const TITLE_RE = /^\s{2,}title:\s*(["'`])(.*?)\1/gm;

const index = [];
for (const f of files) {
  const component = f.replace(/Variations\.jsx$/, "");
  const src = await readFile(join(DEMOS, f), "utf8");
  let i = 0; // matches the `variation-${i}` anchor id rendered by Variations.jsx
  for (const m of src.matchAll(TITLE_RE)) {
    const title = m[2].trim();
    if (title) index.push({ component, title, i });
    i += 1;
  }
}

const next =
  "// GENERATED from src/demos/*Variations.jsx by scripts/gen-variations-index.mjs —\n" +
  "// run `npm run gen:variations` after adding/renaming a variation. Used by Search.\n" +
  "export const VARIATIONS = " +
  JSON.stringify(index, null, 2) +
  ";\n";

if (process.argv.includes("--check")) {
  let cur = "";
  try { cur = await readFile(OUT, "utf8"); } catch {}
  if (cur.replace(/\r\n/g, "\n") !== next.replace(/\r\n/g, "\n")) {
    console.error("✗ src/data/variations.js is stale. Run `npm run gen:variations` and commit.");
    process.exit(1);
  }
  console.log(`✓ variations index up to date (${index.length} examples).`);
} else {
  await writeFile(OUT, next, "utf8");
  console.log(`✓ Wrote variations.js with ${index.length} example titles from ${files.length} files.`);
}
