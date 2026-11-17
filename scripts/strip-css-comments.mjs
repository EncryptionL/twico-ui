// Strips CSS comments and indentation from the scoped-style template literals, at BUILD time only.
//
// Why this exists (#534): every component renders its own CSS from a JS template literal passed to
// `useScopedStyles(id, css)`. A comment inside a template literal is STRING CONTENT, not a comment,
// so no minifier touches it - tsup, esbuild and terser all strip `//` and block comments from CODE
// and leave string bytes alone. Measured on 1.51.1: dist/index.mjs carried 96,366 bytes of block
// comments, 8.5% of the raw bundle, and removing them was worth 19.47 kB brotli after minification -
// 13.5% of the published size, roughly four times the colors and icons entry points combined.
//
// The comments stay in `components/**` exactly as written. They are some of the best documentation in
// the repo and the source is what contributors and the guard tests read; only the SHIPPED copy loses
// them. It runs as an esbuild onLoad hook rather than as a post-build rewrite of dist/ so that
// esbuild generates the sourcemaps from this text: a map produced here is self-consistent (it embeds
// the same stripped source it points into), where shifting a finished map past thousands of removed
// lines would not be.
//
// It is a LEXER, not a regex over the file, because a regex cannot tell these apart:
//   - a block comment in real JS code, which esbuild already removes
//   - a block comment inside a CSS literal, which is what we are here for
//   - `content: "/*"` - a CSS string that merely contains the opening delimiter
//   - `url(//fonts/...)` - a protocol-relative URL, which is not a line comment
//   - a `${...}` interpolation, whose contents are code again and may nest a further literal
// Getting that wrong does not fail loudly; it produces a subtly broken stylesheet at runtime.

/**
 * The one lexer. Walks `src` and calls `fn(text)` for every run of template-literal TEXT, splicing
 * the result back in; everything else - code, code strings, code comments, ${...} expressions - is
 * copied through byte for byte.
 *
 * State is a single STACK, not a pair of counters. A template literal may contain ${...} which may
 * contain another template literal, to any depth, so "am I in literal text" is a property of the
 * innermost frame and nothing else. The first cut of this used `tpl > 0 && exprDepth === 0` and got
 * a literal nested inside an interpolation wrong: tpl was 2 while the expression depth was still 1,
 * so the inner literal's text was treated as code and its comments survived.
 *
 * @param {string} src
 * @param {(text: string) => string} fn
 */
function walkLiteralText(src, fn) {
  const n = src.length;
  const stack = []; // {t:"tpl"} | {t:"expr", braces:number}
  const top = () => stack[stack.length - 1];
  const inText = () => stack.length > 0 && top().t === "tpl";
  let out = "";
  let buf = "";
  let i = 0;
  const flush = () => { if (buf) { out += fn(buf); buf = ""; } };

  while (i < n) {
    const c = src[i], c2 = src[i + 1];

    if (inText()) {
      if (c === "\\") { buf += c + (c2 ?? ""); i += 2; continue; }
      if (c === "`") { flush(); stack.pop(); out += c; i++; continue; }
      if (c === "$" && c2 === "{") { flush(); stack.push({ t: "expr", braces: 0 }); out += "${"; i += 2; continue; }
      buf += c; i++;
      continue;
    }

    // ---- code ----
    if (c === "`") { out += c; stack.push({ t: "tpl" }); i++; continue; }
    if (stack.length > 0 && top().t === "expr") {
      if (c === "{") { top().braces++; out += c; i++; continue; }
      if (c === "}") {
        if (top().braces === 0) { stack.pop(); out += c; i++; continue; }
        top().braces--; out += c; i++; continue;
      }
    }
    // code strings and code comments are copied whole, so their contents never steer the scanner
    if (c === '"' || c === "'") {
      const q = c;
      out += c; i++;
      while (i < n) {
        if (src[i] === "\\") { out += src[i] + (src[i + 1] ?? ""); i += 2; continue; }
        out += src[i];
        if (src[i] === q) { i++; break; }
        i++;
      }
      continue;
    }
    if (c === "/" && (c2 === "*" || c2 === "/")) {
      const end = c2 === "*" ? src.indexOf("*/", i + 2) : src.indexOf("\n", i);
      const stop = end === -1 ? n : c2 === "*" ? end + 2 : end;
      out += src.slice(i, stop); i = stop; continue;
    }
    out += c; i++;
  }
  flush();
  return out;
}

/**
 * Removes CSS block comments from one run of literal text, and copies CSS strings through whole so
 * that `content: "/*"` survives. `//` is NOT a comment here: CSS has no line comments and
 * url(//host/path) is a protocol-relative URL.
 *
 * A comment containing `${` is KEPT. A template literal knows nothing about CSS comments, so an
 * interpolation written inside one is evaluated and substituted for real; the values this library
 * puts there are plain string constants, so dropping them would in fact be safe, but "this comment
 * is prose" and "this expression has no effect" are different claims and only the first is ours to
 * make. Several comments in FieldRow.jsx quote ${ROW} and ${SOLO} while explaining a rule.
 */
function dropComments(text) {
  let out = "";
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i], c2 = text[i + 1];
    if (c === "\\") { out += c + (c2 ?? ""); i += 2; continue; }
    if (c === '"' || c === "'") {
      const q = c;
      out += c; i++;
      while (i < n) {
        if (text[i] === "\\") { out += text[i] + (text[i + 1] ?? ""); i += 2; continue; }
        out += text[i];
        if (text[i] === q) { i++; break; }
        i++;
      }
      continue;
    }
    if (c === "/" && c2 === "*") {
      const end = text.indexOf("*/", i + 2);
      if (end === -1) { out += text.slice(i); break; }
      const whole = text.slice(i, end + 2);
      if (whole.includes("${")) out += whole;   // cannot occur via this walker, kept for direct use
      i = end + 2;
      continue;
    }
    out += c; i++;
  }
  return out;
}

/** Strips per-line indentation and the blank lines a removed comment leaves behind. Whitespace is
 *  insignificant in CSS outside strings, and CSS strings are copied whole by dropComments.
 *
 *  The BOUNDARIES of a run are load-bearing and must keep one whitespace character if they had any.
 *  The walker hands this function one run per gap between interpolations, so a run's edges sit
 *  against a ${...} or against the literal's own delimiter - and squeezing an edge away splices two
 *  CSS tokens together. Harmless in `{ ${rules} }`, fatal in `margin: ${top} ${left}` (10px10px) or
 *  across `${BAND_COLS}\n${CELL}` if either side stops ending in a brace. This was shipped wrong
 *  once and caught by diffing the normalised bundles, not by a test. */
function squeeze(input) {
  // Line-ending agnostic, so the bundle is byte-identical built from a CRLF working copy and from
  // the LF checkout CI uses. A line ending in a space then a CR hides that space from a $-anchored
  // strip, which is exactly how the sibling stylesheet generator came to differ only on CI.
  const text = input.split(CR).join("");
  const lead = /^[ \t\n]+/.exec(text);
  const trail = /[ \t\n]+$/.exec(text);
  const core = text.slice(lead ? lead[0].length : 0, trail ? text.length - trail[0].length : text.length);
  const edge = (m) => (!m ? "" : m[0].includes("\n") ? "\n" : " ");
  if (core === "") return edge(lead || trail);
  const lines = core.split("\n").map((l) => l.replace(/^[ \t]+/, "").replace(/[ \t]+$/, ""));
  const kept = [];
  for (const l of lines) if (l !== "" || kept[kept.length - 1] !== "") kept.push(l);
  return edge(lead) + kept.join("\n") + edge(trail);
}

/**
 * @param {string} src a JS/JSX module
 * @returns {string} the same module with block comments removed from inside its template literals,
 *   and nothing else changed
 */
export function stripCssComments(src) {
  return walkLiteralText(src, dropComments);
}

/** Collapses the whitespace a stripped literal leaves behind. */
export function collapseCssWhitespace(src) {
  return walkLiteralText(src, squeeze);
}

/** An esbuild plugin applying both passes to every module that has a template literal. */
export function stripCssCommentsPlugin() {
  return {
    name: "strip-css-comments",
    setup(build) {
      build.onLoad({ filter: /\.(jsx?|tsx?)$/ }, async (args) => {
        const { readFile } = await import("node:fs/promises");
        const raw = await readFile(args.path, "utf8");
        if (!raw.includes("`")) return null;
        const code = collapseCssWhitespace(stripCssComments(raw));
        if (code === raw) return null;
        const ext = args.path.slice(args.path.lastIndexOf(".") + 1);
        return { contents: code, loader: ext === "js" ? "jsx" : ext };
      });
    },
  };
}

const CR = String.fromCharCode(13);
