#!/usr/bin/env node
/**
 * Convert the source variable `.ttf` webfonts to WOFF2 and mirror the shipped set into
 * `styles/fonts/` (what `twico-ui/styles.css` resolves `./fonts/` against).
 *
 *   npm run build:fonts          regenerate (run on demand, commit the result)
 *   npm run build:fonts:check    verify the committed output (used in CI)
 *
 * Why (#450): the `@font-face` rules live in the shipped stylesheet, so a consumer cannot
 * change the format without re-declaring all three faces. TTF is compressed only by the
 * transport, so the saving depended on host config; WOFF2 is brotli-compressed *inside the
 * container*, which is both smaller and no longer the host's problem.
 *
 * Like `src/brand-icons.tsx`, the `.woff2` files are COMMITTED artifacts — this never runs in
 * CI or on publish, because a `wawoff2` version bump would change the output bytes and fail a
 * Dependabot PR for no reason. `--check` therefore validates the committed set rather than
 * re-compressing it.
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "assets", "fonts");
const SHIP = join(ROOT, "styles", "fonts");
const check = process.argv.includes("--check");

const exists = async (p) => { try { await stat(p); return true; } catch { return false; } };
const list = async (dir, ext) => (await readdir(dir)).filter((f) => f.endsWith(ext)).sort();

const ttf = await list(SRC, ".ttf");
const licences = (await readdir(SRC)).filter((f) => /^OFL-.*\.txt$/.test(f)).sort();
if (!ttf.length) { console.error("✗ no .ttf sources in assets/fonts/"); process.exit(1); }

let problems = 0;
const fail = (m) => { console.error("  ✗ " + m); problems++; };

if (check) {
  // (a) every source .ttf has a committed sibling .woff2
  for (const f of ttf) {
    const w = f.replace(/\.ttf$/, ".woff2");
    if (!(await exists(join(SRC, w)))) fail(`assets/fonts/${w} is missing. Run \`npm run build:fonts\`.`);
  }
  // (b) styles/fonts/ mirrors exactly the .woff2 + licences, byte-for-byte, and ships no .ttf
  const shippedTtf = await list(SHIP, ".ttf");
  if (shippedTtf.length) fail(`styles/fonts/ still ships ${shippedTtf.join(", ")} - WOFF2 replaced them.`);
  const want = ttf.map((f) => f.replace(/\.ttf$/, ".woff2")).concat(licences);
  for (const f of want) {
    const a = join(SRC, f), b = join(SHIP, f);
    if (!(await exists(b))) { fail(`styles/fonts/${f} is missing (assets/fonts/ and styles/fonts/ must stay in sync).`); continue; }
    if (!(await readFile(a)).equals(await readFile(b))) fail(`styles/fonts/${f} differs from assets/fonts/${f}.`);
  }
  const extra = (await readdir(SHIP)).filter((f) => !want.includes(f));
  if (extra.length) fail(`styles/fonts/ has unexpected file(s): ${extra.join(", ")}`);
  // (c) every url() in tokens/fonts.css resolves to a real file - a 404 webfont is a silent
  //     fallback, not a page error, so nothing else in CI would catch it
  const css = await readFile(join(ROOT, "tokens", "fonts.css"), "utf8");
  for (const [, url] of css.matchAll(/url\("([^"]+)"\)/g)) {
    if (!(await exists(join(ROOT, "tokens", url)))) fail(`tokens/fonts.css references ${url}, which does not exist.`);
  }
  if (problems) { console.error(`\n✗ webfonts are out of date (${problems} problem(s)).`); process.exit(1); }
  console.log(`✓ webfonts are generated and mirrored (${want.length} files).`);
} else {
  let wawoff2;
  try { wawoff2 = (await import("wawoff2")).default; }
  catch { console.error("✗ wawoff2 is not installed. Run: npm i -D wawoff2"); process.exit(1); }
  for (const f of ttf) {
    const src = await readFile(join(SRC, f));
    const out = Buffer.from(await wawoff2.compress(src));
    if (out.subarray(0, 4).toString("latin1") !== "wOF2") {
      console.error(`✗ ${f}: compress() did not return a WOFF2 (bad signature)`); process.exit(1);
    }
    const name = f.replace(/\.ttf$/, ".woff2");
    await writeFile(join(SRC, name), out);
    await writeFile(join(SHIP, name), out);
    const pct = ((1 - out.length / src.length) * 100).toFixed(1);
    console.log(`  ${basename(name)}  ${(src.length / 1024).toFixed(1)} KiB ttf -> ${(out.length / 1024).toFixed(1)} KiB woff2  (-${pct}%)`);
  }
  for (const f of licences) await writeFile(join(SHIP, f), await readFile(join(SRC, f)));
  console.log(`✓ Wrote ${ttf.length} WOFF2 face(s) to assets/fonts/ and styles/fonts/.`);
}
