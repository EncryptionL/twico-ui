#!/usr/bin/env node
// Drift guard for the committed Claude Code skill bundle `_ds_bundle.js`.
//
// Why this exists: `_ds_bundle.js` (+ `_ds_manifest.json`, `SKILL.md`) is a browser-global
// bundle generated OUT OF BAND by the `twico-ui-design` skill (see SKILL.md) and committed
// to the repo. Unlike `build:css` / `gen:llms`, there is no in-repo generator for it, so it
// silently goes stale whenever `components/**` change without a manual skill re-run. (Do NOT
// confuse it with the design-sync `./ds-bundle/` output, which is gitignored — see
// docs/design-sync.md.)
//
// We can't reproduce the skill's converter (or its opaque source-hash algorithm) here, so this
// is a STALENESS check rather than a content-equivalence check: the bundle's own header declares
// its input files; if any of them changed in git AFTER the bundle's last commit, the bundle is
// stale and must be regenerated via the skill.
//
//   node scripts/check-ds-bundle.mjs          # exit 1 on drift (blocking — npm run check:ds-bundle)
//   node scripts/check-ds-bundle.mjs --warn   # emit ::warning:: annotations, exit 0 (non-blocking CI)
//
// See issue tracking the regen + flipping CI to blocking once the bundle is fresh.
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const WARN = process.argv.includes("--warn");
const BUNDLE = "_ds_bundle.js";

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!existsSync(BUNDLE)) fail(`✗ ${BUNDLE} not found at repo root.`);

// 1. Parse the `/* @ds-bundle: {…} */` header to learn the bundle's declared input files.
const head = readFileSync(BUNDLE, "utf8").slice(0, 200_000);
const m = head.match(/@ds-bundle:\s*([\s\S]*?)\s*\*\//);
if (!m) fail(`✗ Could not find the @ds-bundle header in ${BUNDLE}.`);
let meta;
try {
  meta = JSON.parse(m[1]);
} catch (e) {
  fail(`✗ Could not parse the @ds-bundle header JSON: ${e.message}`);
}

const inputs = new Set([
  ...Object.keys(meta.sourceHashes || {}),
  ...(meta.components || []).map((c) => c.sourcePath).filter(Boolean),
]);
if (inputs.size === 0) fail(`✗ The @ds-bundle header lists no input files — cannot check drift.`);

// 2. Find the commit that last touched the committed bundle.
let bundleSha = "";
try {
  bundleSha = execFileSync("git", ["rev-list", "-1", "HEAD", "--", BUNDLE], { encoding: "utf8" }).trim();
} catch {
  /* not a git checkout */
}
if (!bundleSha) {
  console.log(`• ${BUNDLE} has no git history yet — skipping drift check.`);
  process.exit(0);
}

// 3. Which declared inputs changed (committed or working-tree) since the bundle's commit?
let changed = [];
try {
  const out = execFileSync("git", ["diff", "--name-only", bundleSha, "--", ...inputs], { encoding: "utf8" });
  changed = out.split("\n").map((s) => s.trim()).filter(Boolean);
} catch (e) {
  fail(`✗ git diff failed: ${e.message}`);
}

if (changed.length === 0) {
  console.log(`✓ ${BUNDLE} is in sync — none of its ${inputs.size} declared inputs changed since ${bundleSha.slice(0, 7)}.`);
  process.exit(0);
}

// 4. Drift found.
const lines = [
  `${BUNDLE} is STALE: ${changed.length} of its declared input file(s) changed since the bundle was last regenerated (${bundleSha.slice(0, 7)}):`,
  ...changed.map((f) => `    - ${f}`),
  `Regenerate it with the \`twico-ui-design\` skill packaging (it owns the format:3 bundle + _ds_manifest.json), then commit the refreshed artifacts.`,
];
const report = lines.join("\n");

if (WARN) {
  // Non-blocking: surface as a GitHub Actions warning annotation but don't fail the build.
  console.log(`::warning title=_ds_bundle.js is stale::${changed.length} bundle input(s) changed since ${bundleSha.slice(0, 7)} — regenerate via the twico-ui-design skill.`);
  console.log(report);
  process.exit(0);
}

console.error(`::error title=_ds_bundle.js is stale::${changed.length} bundle input(s) changed since ${bundleSha.slice(0, 7)}.`);
fail(report);
