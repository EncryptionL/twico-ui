import React from "react";
import { useScopedStyles } from "./_styles.js";

// ---------------------------------------------------------------------------
// `sx` — a style-prop escape hatch for the primitives (#53).
//
// Inline `style` is the only styling channel under the library's no-className
// policy, but it cannot express pseudo-classes (:hover / :focus-visible),
// ::placeholder, or media/container/supports queries. `sx` fills that gap:
//
//   <Box sx={{
//     padding: 20,                               // flat  -> inline style
//     "&:hover": { color: "var(--color-primary)" }, // nested -> scoped <style>
//     "@media (min-width: 600px)": { display: "none" },
//   }} />
//
// Flat (top-level primitive) declarations are returned as an inline-style object
// so they win over the component's base style, matching MUI's precedence. Nested
// keys (anything whose value is an object, or a key starting with & / : / @) are
// compiled to CSS scoped under `[data-twc-sx="<uid>"]` and injected via
// useScopedStyles (so they inherit the CSP nonce and SSR hoisting for free).
//
// Internal: NOT exported from the public hooks barrel.
// ---------------------------------------------------------------------------

// CSS properties whose numeric values are unitless (no `px` appended). Mirrors
// React's own list so `sx` numbers behave like inline-style numbers.
const UNITLESS = new Set([
  "animationIterationCount", "aspectRatio", "borderImageOutset", "borderImageSlice",
  "borderImageWidth", "boxFlex", "boxFlexGroup", "boxOrdinalGroup", "columnCount",
  "columns", "flex", "flexGrow", "flexShrink", "flexPositive", "flexNegative",
  "flexOrder", "gridArea", "gridRow", "gridRowEnd", "gridRowSpan", "gridRowStart",
  "gridColumn", "gridColumnEnd", "gridColumnSpan", "gridColumnStart", "fontWeight",
  "lineClamp", "lineHeight", "opacity", "order", "orphans", "tabSize", "widows",
  "zIndex", "zoom", "fillOpacity", "floodOpacity", "stopOpacity", "strokeDasharray",
  "strokeDashoffset", "strokeMiterlimit", "strokeOpacity", "strokeWidth", "scale",
]);

const isObject = (v) => v != null && typeof v === "object" && !Array.isArray(v);
// A key that opens a nested block rather than setting a declaration.
const isNestedKey = (k, v) => isObject(v) || k.charCodeAt(0) === 38 /* & */ || k.charCodeAt(0) === 64 /* @ */ || k.charCodeAt(0) === 58 /* : */;

// camelCase -> kebab-case; leave custom properties (--foo) and already-kebab keys intact.
function kebab(prop) {
  if (prop.startsWith("--")) return prop;
  return prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

// `key` is the original (camelCase) prop so the UNITLESS allowlist matches.
function cssValue(key, value) {
  if (typeof value !== "number") return String(value);
  if (value === 0 || key.startsWith("--") || UNITLESS.has(key)) return String(value);
  return `${value}px`;
}

// Resolve a nested key against the current scope selector.
//   "&:hover"     -> "<sel>:hover"        (& replaced by the scope)
//   ":hover"      -> "<sel>:hover"        (pseudo appended)
//   "& > .x"      -> "<sel> > .x"
//   ".x" / "span" -> "<sel> .x"           (descendant)
function resolveSelector(key, scope) {
  if (key.includes("&")) return key.replace(/&/g, scope);
  if (key.charCodeAt(0) === 58 /* : */) return `${scope}${key}`;
  return `${scope} ${key}`;
}

/**
 * Compile a style object into CSS text scoped under `selector`. Flat declarations
 * become `selector { … }`; nested keys recurse; `@`-rules wrap their inner block.
 * Returns "" when there is nothing to emit.
 */
export function compileSx(obj, selector) {
  if (!isObject(obj)) return "";
  let decls = "";
  let rules = "";
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (isNestedKey(key, value)) {
      if (!isObject(value)) continue; // & / : / @ key with a non-object value is ignored
      if (key.charCodeAt(0) === 64 /* @ */) {
        // media / supports / container — re-scope the inner block under the same selector.
        const inner = compileSx(value, selector);
        if (inner) rules += `${key} { ${inner.trim()} }\n`;
      } else {
        rules += compileSx(value, resolveSelector(key, selector));
      }
    } else {
      decls += `${kebab(key)}: ${cssValue(key, value)}; `;
    }
  }
  let out = "";
  if (decls) out += `${selector} { ${decls.trimEnd()} }\n`;
  out += rules;
  return out;
}

// ---------------------------------------------------------------------------
// #188: box-model shorthand normalization for the FLAT (inline-style) channel.
// The primitives (Box/Stack/Grid/…) also emit physical longhands (paddingTop/…), so a
// flat `sx` box SHORTHAND (padding/margin/inset + logical block/inline) lands on the same
// node as its longhands and trips React's dev warning ("Removing a style property during
// rerender (padding) when a conflicting property is set (paddingBottom)"). Expanding the
// shorthand to leaf longhands here keeps the ergonomic API while emitting only leaves.
// The nested compileSx channel emits CSS text (never reconciled as inline style), so it
// is intentionally left untouched.
// ---------------------------------------------------------------------------
const BOX_EDGE4 = {
  padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
  margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
  inset: ["top", "right", "bottom", "left"],
};
const BOX_EDGE2 = {
  paddingBlock: ["paddingBlockStart", "paddingBlockEnd"],
  paddingInline: ["paddingInlineStart", "paddingInlineEnd"],
  marginBlock: ["marginBlockStart", "marginBlockEnd"],
  marginInline: ["marginInlineStart", "marginInlineEnd"],
};

// Split a CSS shorthand string on top-level whitespace only — whitespace inside
// parentheses (calc(), var(), min/max/clamp()) is NOT a separator.
function splitShorthand(value) {
  const s = String(value).trim();
  if (!s) return [];
  const out = [];
  let depth = 0, cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(") { depth++; cur += c; }
    else if (c === ")") { depth = Math.max(0, depth - 1); cur += c; }
    else if (depth === 0 && (c === " " || c === "\t" || c === "\n" || c === "\r")) {
      if (cur) { out.push(cur); cur = ""; }
    } else cur += c;
  }
  if (cur) out.push(cur);
  return out;
}

// Expand a box-model shorthand into ordered [longhand, value] pairs, or null if `key`
// isn't one. Numeric values stay numeric per edge so React still appends `px`.
function expandBoxShorthand(key, value) {
  const four = BOX_EDGE4[key];
  const two = BOX_EDGE2[key];
  if ((!four && !two) || value == null) return null;
  if (typeof value === "number") return (four || two).map((edge) => [edge, value]);
  const p = splitShorthand(value);
  if (p.length === 0) return null;
  if (two) return [[two[0], p[0]], [two[1], p.length > 1 ? p[1] : p[0]]];
  let top, right, bottom, left; // physical TRBL from 1–4 values (CSS shorthand rules)
  if (p.length === 1) top = right = bottom = left = p[0];
  else if (p.length === 2) { top = bottom = p[0]; right = left = p[1]; }
  else if (p.length === 3) { top = p[0]; right = left = p[1]; bottom = p[2]; }
  else { [top, right, bottom, left] = p; }
  return [[four[0], top], [four[1], right], [four[2], bottom], [four[3], left]];
}

// Split the top level: flat declarations -> inline style object; nested keys -> CSS.
// Exported for unit tests (internal module — not in the public hooks barrel).
export function buildSx(sx, uid) {
  if (!isObject(sx)) return { flatStyle: undefined, css: "" };
  const scope = `[data-twc-sx="${uid}"]`;
  let flatStyle;
  let css = "";
  for (const key of Object.keys(sx)) {
    const value = sx[key];
    if (isNestedKey(key, value)) {
      if (!isObject(value)) continue;
      if (key.charCodeAt(0) === 64 /* @ */) {
        const inner = compileSx(value, scope);
        if (inner) css += `${key} { ${inner.trim()} }\n`;
      } else {
        css += compileSx(value, resolveSelector(key, scope));
      }
    } else {
      const expanded = expandBoxShorthand(key, value);
      if (expanded) {
        flatStyle ||= {};
        // Insertion order: a longhand written after a shorthand overrides it (matches CSS
        // source-order); one written before is (correctly) overwritten by the shorthand.
        for (const [k, v] of expanded) flatStyle[k] = v;
      } else {
        (flatStyle ||= {})[key] = value;
      }
    }
  }
  return { flatStyle, css };
}

/**
 * Hook used by every primitive. Returns:
 *   - `flatStyle`: inline-style declarations from `sx`'s top level (merge AFTER the
 *     base + user `style` so `sx` wins);
 *   - `styleNode`: a scoped `<style>` element for the nested/pseudo/media rules
 *     (null when there are none) — render it inside the component root;
 *   - `sxAttr`: the value for `data-twc-sx` (undefined when there are no scoped rules).
 */
export function useSx(sx) {
  const rawId = React.useId();
  const uid = `sx${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const { flatStyle, css } = React.useMemo(() => buildSx(sx, uid), [sx, uid]);
  const styleNode = useScopedStyles(`twc-sx-${uid}`, css);
  return { flatStyle, styleNode, sxAttr: css ? uid : undefined };
}
