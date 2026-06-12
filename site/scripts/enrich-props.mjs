#!/usr/bin/env node
/**
 * Post-process `src/data/components.js` to document the common **inherited DOM
 * props** each component forwards via `...rest` (onClick, onChange, id, style, …),
 * derived from the root element in each component's `.d.ts` `extends` clause.
 *
 * gen-docs.mjs writes the component-specific props from each `.d.ts`; this step
 * appends the standard handlers/attributes so the reference is complete (e.g.
 * Button explicitly lists `onClick`). Idempotent — already-present props are
 * skipped, so it is safe to re-run.
 *
 *   node scripts/enrich-props.mjs          enrich in place
 *   node scripts/enrich-props.mjs --check   exit 1 if components.js would change (CI guard)
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(SITE, "..");
const COMP = join(SITE, "src", "data", "components.js");

const dtsPaths = {};
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith(".d.ts")) dtsPaths[e.name.replace(/\.d\.ts$/, "")] = p;
  }
}
await walk(join(ROOT, "components"));

const P = {
  onClick: ["(e: React.MouseEvent) => void", "Click handler — fires when the element is clicked or tapped."],
  onClickBtn: ["(e: React.MouseEvent) => void", "Click handler — fires on click/tap and on Enter or Space."],
  onFocus: ["(e: React.FocusEvent) => void", "Fires when the element receives keyboard or pointer focus."],
  onBlur: ["(e: React.FocusEvent) => void", "Fires when the element loses focus."],
  onKeyDown: ["(e: React.KeyboardEvent) => void", "Key-down handler on the element, for custom keyboard shortcuts."],
  onMouseEnter: ["(e: React.MouseEvent) => void", "Fires when the pointer enters the element (e.g. to open a hovercard)."],
  onMouseLeave: ["(e: React.MouseEvent) => void", "Fires when the pointer leaves the element."],
  onChange: ["(e: React.ChangeEvent) => void", "Native change handler on the underlying form control."],
  id: ["string", "Id applied to the root element, handy for labels and aria wiring."],
  style: ["React.CSSProperties", "Inline styles merged onto the root element after the component's own."],
  type: ['"button" | "submit" | "reset"', 'Native button type — use "submit" to submit a surrounding form.', '"button"'],
  disabled: ["boolean", "Disables the control — no interaction and a dimmed appearance.", "false"],
  autoFocus: ["boolean", "Focus the element automatically when it mounts.", "false"],
  name: ["string", "Form field name submitted with the value."],
  placeholder: ["string", "Placeholder text shown while the field is empty."],
  readOnly: ["boolean", "Makes the field non-editable while still focusable/selectable.", "false"],
  required: ["boolean", "Marks the field required for native form validation.", "false"],
  autoComplete: ["string", 'Browser autocomplete hint (e.g. "email", "off").'],
  rows: ["number", "Visible number of text rows."],
  href: ["string", "Link destination (rendered as an anchor)."],
  target: ["string", 'Where to open the link, e.g. "_blank".'],
  rel: ["string", 'Link relationship, e.g. "noopener noreferrer" with target="_blank".'],
};
const row = (prop, key, def) => {
  const d = P[key];
  return { prop, type: d[0], required: false, default: def ?? d[2] ?? "—", description: d[1] };
};
const CATS = {
  button: () => [row("onClick", "onClickBtn"), row("onFocus", "onFocus"), row("onBlur", "onBlur"), row("type", "type"), row("disabled", "disabled"), row("autoFocus", "autoFocus"), row("id", "id"), row("style", "style")],
  anchor: () => [row("onClick", "onClick"), row("href", "href"), row("target", "target"), row("rel", "rel"), row("id", "id"), row("style", "style")],
  input: () => [row("onChange", "onChange"), row("onFocus", "onFocus"), row("onBlur", "onBlur"), row("onKeyDown", "onKeyDown"), row("name", "name"), row("placeholder", "placeholder"), row("disabled", "disabled"), row("readOnly", "readOnly"), row("required", "required"), row("autoComplete", "autoComplete"), row("id", "id"), row("style", "style")],
  textarea: () => [row("onChange", "onChange"), row("onFocus", "onFocus"), row("onBlur", "onBlur"), row("onKeyDown", "onKeyDown"), row("name", "name"), row("placeholder", "placeholder"), row("rows", "rows"), row("disabled", "disabled"), row("readOnly", "readOnly"), row("required", "required"), row("id", "id"), row("style", "style")],
  generic: () => [row("onClick", "onClick"), row("onMouseEnter", "onMouseEnter"), row("onMouseLeave", "onMouseLeave"), row("onFocus", "onFocus"), row("onBlur", "onBlur"), row("onKeyDown", "onKeyDown"), row("id", "id"), row("style", "style")],
};
const ELEMENT_LABEL = { button: "<button>", anchor: "<a>", input: "<input>", textarea: "<textarea>", generic: "the root element" };
const REST_TYPE = {
  button: "React.ButtonHTMLAttributes<HTMLButtonElement>", input: "React.InputHTMLAttributes<HTMLInputElement>",
  textarea: "React.TextareaHTMLAttributes<HTMLTextAreaElement>", anchor: "React.AnchorHTMLAttributes<HTMLAnchorElement>",
  generic: "React.HTMLAttributes<HTMLElement>",
};
function categorize(ext) {
  if (!ext) return null;
  if (/ButtonHTMLAttributes/.test(ext)) return "button";
  if (/AnchorHTMLAttributes/.test(ext)) return "anchor";
  if (/InputHTMLAttributes/.test(ext)) return "input";
  if (/TextareaHTMLAttributes/.test(ext)) return "textarea";
  if (/HTMLAttributes/.test(ext)) return "generic";
  return null;
}

const mod = await import("file:///" + COMP.replace(/\\/g, "/") + "?t=" + Date.now());
const comps = mod.components;
let enriched = 0;
for (const c of comps) {
  const dts = dtsPaths[c.name];
  if (!dts) continue;
  const src = await readFile(dts, "utf8");
  const mm = src.match(new RegExp("interface\\s+" + c.name + "Props(?:<[^>]*>)?\\s+extends\\s+([^{]+){"));
  const cat = categorize(mm && mm[1]);
  if (!cat) continue;
  const present = new Set((c.propsRows || []).map((r) => r.prop));
  const inherited = CATS[cat]().filter((r) => !present.has(r.prop));
  let rows = (c.propsRows || []).filter((r) => r.prop !== "...rest").concat(inherited);
  rows.push({
    prop: "...rest", type: REST_TYPE[cat], required: false, default: "—",
    description: `Every other standard prop for ${ELEMENT_LABEL[cat]} — remaining event handlers, plus \`data-*\` and \`aria-*\` attributes — is forwarded to it.`,
  });
  c.propsRows = rows;
  enriched++;
}

const header = "// AUTO-GENERATED — gen-docs.mjs (component reference) then enrich-props.mjs (inherited DOM props). Do not edit by hand.\n";
const next = header + "export const components = " + JSON.stringify(comps, null, 2) + ";\n";

if (process.argv.includes("--check")) {
  const cur = await readFile(COMP, "utf8");
  if (cur.replace(/\r\n/g, "\n") !== next.replace(/\r\n/g, "\n")) {
    console.error("✗ components.js is not enriched. Run `npm run gen:props` and commit.");
    process.exit(1);
  }
  console.log("✓ components.js inherited-prop enrichment is up to date.");
} else {
  await writeFile(COMP, next, "utf8");
  console.log(`✓ Enriched ${enriched} components with inherited DOM props.`);
}
