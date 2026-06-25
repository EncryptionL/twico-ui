#!/usr/bin/env node
/**
 * Generate `llms.txt` — the LLM/AI usage guide for the twico-ui npm package.
 *
 * It concatenates a hand-authored guidelines preamble (`scripts/llms-preamble.md`)
 * with a reference generated from the library's own sources of truth, so the API an
 * AI sees can never drift from what ships:
 *   - component reference  <- site/src/data/components.js (generated from each .d.ts)
 *   - group order          <- site/src/data/site.js
 *   - hooks                <- hooks/index.d.ts
 *
 * The per-component "Props" lists drop the generic inherited DOM props that
 * enrich-props.mjs appends (onClick/id/style/.../...rest) — identified by their
 * canonical descriptions — and the preamble states that convention once.
 *
 * Outputs two identical copies:
 *   - llms.txt               (repo root; ships in the npm tarball, served on GitHub)
 *   - site/public/llms.txt   (served by the docs site at /twico-ui/llms.txt)
 *
 *   npm run gen:llms           regenerate both
 *   npm run gen:llms -- --check  exit 1 if either is stale (CI guard)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(ROOT, "site");
const OUTS = [join(ROOT, "llms.txt"), join(SITE, "public", "llms.txt")];

const preamble = (await readFile(join(ROOT, "scripts", "llms-preamble.md"), "utf8")).trimEnd();

// Import the generated data modules (cache-busted, like enrich-props.mjs).
const imp = async (rel) =>
  import(pathToFileURL(join(SITE, rel)).href + "?t=" + Date.now());
const { components } = await imp("src/data/components.js");
const { GROUP_ORDER, groupedComponents } = await imp("src/data/site.js");

// --- generic inherited DOM props to omit (canonical descriptions from enrich-props.mjs) ---
const DROP_DESC = new Set([
  "Click handler — fires when the element is clicked or tapped.",
  "Fires when the element receives keyboard or pointer focus.",
  "Fires when the element loses focus.",
  "Key-down handler on the element, for custom keyboard shortcuts.",
  "Fires when the pointer enters the element (e.g. to open a hovercard).",
  "Fires when the pointer leaves the element.",
  "Id applied to the root element, handy for labels and aria wiring.",
  "Inline styles merged onto the root element after the component's own.",
]);
const keepProp = (r) => r.prop !== "...rest" && !DROP_DESC.has(r.description);

function propLine(r) {
  const meta = r.required
    ? "**required**"
    : r.default && r.default !== "—"
      ? "default `" + r.default + "`"
      : "";
  return "- `" + r.prop + "` — `" + r.type + "`" + (meta ? " · " + meta : "") + " — " + r.description;
}

function componentSection(c) {
  const out = [`#### ${c.name}`, ""];
  if (c.summary) out.push(c.summary, "");
  out.push("`import { " + c.importName + ' } from "twico-ui"`', "");
  const props = (c.propsRows || []).filter(keepProp);
  if (props.length) {
    out.push("Props:");
    for (const r of props) out.push(propLine(r));
    out.push("");
  }
  if (c.snippet) out.push("```jsx", c.snippet, "```", "");
  return out.join("\n");
}

// --- components, grouped & ordered like the docs site ---
const groups = groupedComponents(components);
const componentDoc = [`## Component reference (${components.length} components)`, ""];
for (const [group, list] of groups) {
  componentDoc.push(`### ${group}`, "");
  for (const c of list) componentDoc.push(componentSection(c));
}

// --- hooks, parsed from hooks/index.d.ts (description + exact signature) ---
const hooksSrc = await readFile(join(ROOT, "hooks", "index.d.ts"), "utf8");
const clean = (s) =>
  s
    .replace(/^\s*\*\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s*@\w+.*$/, "")
    .trim();

const hooks = [];
for (const m of hooksSrc.matchAll(/export\s+(?:function|const)\s+(use\w+)/g)) {
  const start = m.index;
  // Signature: balanced scan to the first top-level ';' (return-type object
  // literals contain ';' at brace depth > 0, so plain "first ;" would truncate).
  let depth = 0;
  let i = start;
  for (; i < hooksSrc.length; i++) {
    const ch = hooksSrc[i];
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth--;
    else if (ch === ";" && depth === 0) break;
  }
  const sig = hooksSrc.slice(start, i + 1).replace(/\s+/g, " ").trim();
  // Description = the JSDoc block immediately preceding this declaration: take the
  // LAST /** */ before `start` and accept it only if just whitespace follows it.
  const before = hooksSrc.slice(0, start);
  const blocks = [...before.matchAll(/\/\*\*([\s\S]*?)\*\//g)];
  const last = blocks[blocks.length - 1];
  const desc = last && /^\s*$/.test(before.slice(last.index + last[0].length)) ? clean(last[1]) : "";
  hooks.push({ name: m[1], desc, sig });
}

const hookDoc = [`## Hooks (${hooks.length})`, ""];
for (const h of hooks) {
  hookDoc.push(`### ${h.name}`, "");
  if (h.desc) hookDoc.push(h.desc, "");
  hookDoc.push("```ts", h.sig, "```", "");
}

const footer = [
  "---",
  "",
  "_Generated by `scripts/gen-llms.mjs`. Do not edit by hand — run `npm run gen:llms`. " +
    "Source of truth: the component `.d.ts` files and `hooks/index.d.ts`._",
  "",
];

const doc =
  [preamble, "", "---", "", componentDoc.join("\n"), hookDoc.join("\n"), footer.join("\n")].join("\n").replace(/\n{3,}/g, "\n\n") + "\n";

const check = process.argv.includes("--check");
if (check) {
  let stale = false;
  for (const out of OUTS) {
    let cur = "";
    try {
      cur = await readFile(out, "utf8");
    } catch {}
    if (cur.replace(/\r\n/g, "\n") !== doc.replace(/\r\n/g, "\n")) {
      console.error(`✗ ${out} is stale. Run \`npm run gen:llms\` and commit.`);
      stale = true;
    }
  }
  if (stale) process.exit(1);
  console.log("✓ llms.txt is up to date (root + site/public).");
} else {
  for (const out of OUTS) {
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, doc, "utf8");
  }
  console.log(
    `✓ Wrote llms.txt (${components.length} components, ${hooks.length} hooks) to root + site/public.`
  );
}
