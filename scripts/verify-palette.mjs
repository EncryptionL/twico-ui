#!/usr/bin/env node
/**
 * Guard: assert the standalone color-palette preview `palette.html` stays in
 * sync with the real design tokens in `tokens/colors.css`.
 *
 * `palette.html` is a self-contained preview: it hard-codes the *resolved* hex /
 * rgb value of every primitive step and every `--color-*` semantic alias (light
 * AND dark) so it can render without loading the stylesheet. That makes it prone
 * to silent drift whenever a token changes. This script re-resolves every token
 * in `tokens/colors.css` (following the full `var()` chain, for both `:root` and
 * `.dark`) and compares it against the values baked into `palette.html`.
 *
 *   npm run verify:palette        fail (exit 1) and list every mismatch
 *
 * It is read-only — it never rewrites `palette.html`; on drift you fix the
 * preview (or the token) by hand. Mirrors the `build:css:check` drift guard.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Strip CSS comments first: tokens/colors.css mentions ".dark" inside a header
// comment, which would otherwise hijack the .dark selector match below.
const css = (await readFile(join(ROOT, "tokens", "colors.css"), "utf8")).replace(
  /\/\*[\s\S]*?\*\//g,
  ""
);
const html = await readFile(join(ROOT, "palette.html"), "utf8");

/** Parse `--name: value;` declarations out of a CSS block body. */
function parseBlock(text) {
  const map = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(text))) map[m[1]] = m[2].trim();
  return map;
}

const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
const darkMatch = css.match(/\.dark\s*,\s*\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);
if (!rootMatch || !darkMatch) {
  console.error("✗ Could not locate the :root and/or .dark blocks in tokens/colors.css.");
  process.exit(1);
}
const rootVars = parseBlock(rootMatch[1]);
const darkVars = parseBlock(darkMatch[1]);

/** Resolve a token to its final value, following the whole var() chain. */
function makeResolver(scope) {
  return function resolve(name) {
    let v = scope[name];
    if (v == null) return null;
    let guard = 0;
    while (/var\(\s*--[\w-]+\s*\)/.test(v) && guard++ < 25) {
      v = v.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, r) =>
        scope[r] != null ? scope[r] : `var(${r})`
      );
    }
    return v.trim();
  };
}
const resolveLight = makeResolver(rootVars);
const resolveDark = makeResolver({ ...rootVars, ...darkVars });

/** Normalize a color so equal colors compare equal (#abc -> #aabbcc, rgb tuples). */
function norm(v) {
  if (v == null) return null;
  v = v.trim().toLowerCase();
  const rgb = v.match(
    /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)\s*(?:\/\s*|,\s*)?([\d.]+)?\s*\)/
  );
  if (rgb) {
    let a = rgb[4] == null ? "1" : rgb[4];
    if (a.startsWith(".")) a = "0" + a;
    return `rgb:${rgb[1]},${rgb[2]},${rgb[3]},${a}`;
  }
  if (/^#([0-9a-f]{3})$/.test(v)) v = "#" + [...v.slice(1)].map((c) => c + c).join("");
  return v;
}

let problems = 0;
let checked = 0;

// --- semantic aliases: ["--color-x", "<light>", "<dark>"] tuples in palette.html ---
const sem = [...html.matchAll(/\["(--color-[\w-]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\]/g)];
const paletteTokens = new Set(sem.map((m) => m[1]));
for (const [, token, light, dark] of sem) {
  const cl = resolveLight(token);
  const cd = resolveDark(token);
  checked += 2;
  if (cl == null) {
    console.log(`  ✗ ${token}: present in palette.html but not in tokens/colors.css`);
    problems++;
    continue;
  }
  if (norm(cl) !== norm(light)) {
    console.log(`  ✗ LIGHT ${token}: palette=${light}  tokens=${cl}`);
    problems++;
  }
  if (norm(cd) !== norm(dark)) {
    console.log(`  ✗ DARK  ${token}: palette=${dark}  tokens=${cd}`);
    problems++;
  }
}
// semantic tokens defined in colors.css but missing from the preview
for (const k of Object.keys(rootVars)) {
  if (k.startsWith("--color-") && !paletteTokens.has(k)) {
    console.log(`  ! tokens/colors.css defines ${k} but palette.html does not show it`);
    problems++;
  }
}

// --- primitive scales: PRIMITIVES = [{ name, steps: { 50: "#..", ... } }] ---
for (const [, name, body] of html.matchAll(/name:\s*"(\w+)"[\s\S]*?steps:\s*\{([\s\S]*?)\}/g)) {
  const ln = name.toLowerCase();
  for (const [, step, hex] of body.matchAll(/(\d+):\s*"(#[0-9a-fA-F]{3,6})"/g)) {
    const tokenHex = rootVars[`--${ln}-${step}`];
    checked++;
    if (!tokenHex) {
      console.log(`  ! palette primitive --${ln}-${step} is not defined in tokens/colors.css`);
      problems++;
      continue;
    }
    if (norm(tokenHex) !== norm(hex)) {
      console.log(`  ✗ PRIMITIVE --${ln}-${step}: palette=${hex}  tokens=${tokenHex}`);
      problems++;
    }
  }
}

if (problems) {
  console.error(
    `\n✗ palette.html is out of sync with tokens/colors.css (${problems} discrepancy(ies) of ${checked} values).`
  );
  console.error("  Update palette.html's PRIMITIVES/SEMANTIC data to the resolved token values.");
  process.exit(1);
}
console.log(`✓ palette.html matches tokens/colors.css (${checked} values checked).`);
