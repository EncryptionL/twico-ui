#!/usr/bin/env node
/**
 * String-aware CSS minifier, used by scripts/build-css.mjs to derive
 * `styles/twico-ui.min.css` from the authoring copy (#539).
 *
 * WHY THIS IS NOT A REGEX. A CSS string may legally contain the comment delimiter, and
 * `url(//host/path)` is a protocol-relative URL rather than a line comment. #534 stripped the
 * generated stylesheet with a string-aware walker for exactly that reason; this file keeps the
 * walker and adds the whitespace/punctuation pass a `.min.css` name promises.
 *
 * WHAT IT WILL NOT DO. Every transform here leaves the CSSOM byte-for-byte identical - which is
 * what .work/css/cssom.mjs and tests/css-minify.test.js assert, rule by rule and declaration by
 * declaration. It does not reorder, merge, dedupe, shorten colours, or drop "redundant"
 * declarations, and it never touches a string, an unquoted `url()`, or a CUSTOM PROPERTY VALUE.
 *
 * The custom-property carve-out is the interesting one. A custom property's value is an opaque
 * token stream, and Chrome's CSSOM hands back the ORIGINAL TEXT for it - so collapsing the newline
 * inside `--font-sans: "Plus Jakarta Sans",\n    ui-sans-serif, ...` produces a stylesheet that
 * renders identically and compares DIFFERENT. Measured, leaving all ~200 of them verbatim costs
 * 601 bytes of 12.7 kB. That buys the difference between "equivalent, if you accept an argument
 * about CSS tokenisation" and "identical, and here is the diff" - on the file every consumer loads,
 * at 5% of a 56% saving. Leading and trailing whitespace around the value IS dropped, because the
 * CSSOM trims exactly that.
 */

const NUL = String.fromCharCode(0);
const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
const TAB = String.fromCharCode(9);
const FF = String.fromCharCode(12);
const DQ = String.fromCharCode(34);
const SQ = String.fromCharCode(39);
const BS = String.fromCharCode(92);

// A space is dropped when the token on that side cannot need one. `)` is in the BEFORE set and `(`
// in the AFTER set so `:is( .a, .b )` tightens, while `>`, `+`, `~` and `!` are in NEITHER - those
// are combinators and `calc()` operators, where the space is part of the grammar.
const DROP_BEFORE = "{};,)";
const DROP_AFTER = "{};,(";

const isWS = (c) => c === " " || c === LF || c === TAB || c === CR || c === FF;

/**
 * Splits CSS into text / string / comment / url segments. Only `text` is ever rewritten; the other
 * three pass through byte for byte.
 */
function scan(css) {
  const out = [];
  const n = css.length;
  let i = 0;
  let buf = "";
  const flush = () => { if (buf) { out.push({ t: "text", v: buf }); buf = ""; } };
  while (i < n) {
    const c = css[i];
    if (c === DQ || c === SQ) {
      flush();
      const q = c;
      let v = c;
      i++;
      while (i < n) {
        if (css[i] === BS) { v += css[i] + (css[i + 1] ?? ""); i += 2; continue; }
        v += css[i];
        if (css[i] === q) { i++; break; }
        i++;
      }
      out.push({ t: "string", v });
      continue;
    }
    if (c === "/" && css[i + 1] === "*") {
      flush();
      const end = css.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      out.push({ t: "comment", v: css.slice(i, stop) });
      i = stop;
      continue;
    }
    // An UNQUOTED url() is opaque: a data URI carries `:` `;` and `,` that mean something else
    // there, and the tightener must not see them. A quoted one is owned by the string branch above.
    if ((c === "u" || c === "U") && css.slice(i, i + 4).toLowerCase() === "url(") {
      let j = i + 4;
      while (j < n && isWS(css[j])) j++;
      if (css[j] !== DQ && css[j] !== SQ) {
        const close = css.indexOf(")", j);
        if (close !== -1) {
          flush();
          out.push({ t: "url", v: css.slice(i, close + 1) });
          i = close + 1;
          continue;
        }
      }
    }
    buf += c;
    i++;
  }
  flush();
  return out;
}

/**
 * Collapses whitespace, drops the spaces CSS cannot need, and drops the final `;` of a block.
 *
 * Brace depth is tracked so `:` is tightened only inside a declaration block - at depth 0 a `:` is
 * a pseudo-class, where `a :hover` (descendant) and `a:hover` (same element) are different
 * selectors. `propStart` marks where the current property name began in the output, which is how a
 * custom property is recognised at its colon without looking ahead.
 */
function compress(s) {
  let out = "";
  let depth = 0;
  let propStart = 0;
  let custom = false; // inside a custom property's value: emit verbatim
  let i = 0;
  const n = s.length;
  const trimEnd = () => { while (out.length && isWS(out[out.length - 1])) out = out.slice(0, -1); };
  while (i < n) {
    const c = s[i];

    if (custom) {
      if (c === ";" || c === "}") { custom = false; trimEnd(); continue; }
      out += c;
      i++;
      continue;
    }

    if (isWS(c)) {
      let j = i;
      while (j < n && isWS(s[j])) j++;
      const next = s[j] ?? "";
      const prev = out[out.length - 1] ?? "";
      const drop =
        out === "" || j >= n ||
        DROP_BEFORE.includes(next) || DROP_AFTER.includes(prev) ||
        (prev === ":" && depth > 0);
      if (!drop) out += " ";
      i = j;
      continue;
    }

    if (c === ":" && depth > 0 && out.slice(propStart).startsWith("--")) {
      out += c;
      i++;
      while (i < n && isWS(s[i])) i++; // the CSSOM trims the value's leading whitespace too
      custom = true;
      continue;
    }

    if (c === "{") { depth++; out += c; i++; propStart = out.length; continue; }
    if (c === "}") {
      depth = Math.max(0, depth - 1);
      if (out.endsWith(";")) out = out.slice(0, -1);
      out += c;
      i++;
      propStart = out.length;
      continue;
    }
    if (c === ";") { out += c; i++; propStart = out.length; continue; }

    out += c;
    i++;
  }
  return out;
}

/** Minifies one stylesheet. Throws on a NUL byte, which the segment placeholders use. */
export function minifyCss(input) {
  if (input.includes(NUL)) throw new Error("minifyCss: input contains a NUL byte");
  const keep = [];
  let s = "";
  for (const seg of scan(input.split(CR).join(""))) {
    // A comment becomes ONE space, never nothing: `margin:0/**/auto` is two tokens, and joining
    // them would change the declaration rather than shrink it. The collapse below removes the
    // space again wherever it turns out not to separate anything.
    if (seg.t === "comment") { s += " "; continue; }
    if (seg.t === "text") { s += seg.v; continue; }
    keep.push(seg.v);
    s += NUL + (keep.length - 1) + NUL;
  }
  s = compress(s);
  // Restored by SPLITTING on the sentinel, not by a regex. The placeholder is NUL<index>NUL, so a
  // split on NUL alternates text / index / text / index - and the restore then needs no escape
  // sequence at all, which is one less thing between this file and what it was written as.
  const parts = s.split(NUL);
  let out = parts[0];
  for (let k = 1; k < parts.length; k += 2) out += keep[Number(parts[k])] + (parts[k + 1] ?? "");
  return out.trim() + LF;
}

export default minifyCss;
