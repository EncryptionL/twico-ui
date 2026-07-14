import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// #234 regression guard.
//
// Under React 19 style hoisting, `useScopedStyles(id, css)` renders `<style href={id}
// precedence="twc-ui">` and React DEDUPES by `href`, keeping the FIRST content it sees for a
// given href. So if two components render the same id with DIFFERENT css, whichever mounts first
// wins and the other's rules are silently dropped (this made Input's `.twc-input` box invisible
// because it rode the shared `twc-field-styles` id whose sibling content is shorter).
//
// Invariant: every scoped-style id must map to exactly ONE css body across the whole library.

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "components");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".jsx") || name.endsWith(".js")) out.push(p);
  }
  return out;
}

// Extract `const NAME = `...`;` template-literal bodies from a source file.
function cssConstants(src) {
  const map = {};
  const re = /const\s+([A-Z][A-Z0-9_]*)\s*=\s*`([\s\S]*?)`;/g;
  let m;
  // Normalize line endings — CRLF vs LF is benign (esbuild normalizes the built bundle and CSS
  // ignores whitespace); the guard should flag only genuine rule differences.
  while ((m = re.exec(src))) map[m[1]] = m[2].replace(/\r\n/g, "\n");
  return map;
}

describe("scoped-style id → single css body (#234)", () => {
  const files = walk(ROOT);
  // id -> array of { file, body }
  const byId = new Map();
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const consts = cssConstants(src);
    const re = /useScopedStyles\(\s*"([^"]+)"\s*,\s*([A-Za-z_$][\w$]*)\s*\)/g;
    let m;
    while ((m = re.exec(src))) {
      const [, id, constName] = m;
      const body = consts[constName];
      if (body == null) continue; // css built inline / not a top-level const — skip
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push({ file: file.replace(ROOT, "components"), body });
    }
  }

  it("finds the shared field-family id in use (sanity)", () => {
    expect(byId.has("twc-field-styles")).toBe(true);
    expect(byId.get("twc-field-styles").length).toBeGreaterThanOrEqual(6);
  });

  it("every id maps to exactly one css body (no first-wins drop)", () => {
    const conflicts = [];
    for (const [id, entries] of byId) {
      const bodies = new Set(entries.map((e) => e.body));
      if (bodies.size > 1) conflicts.push(`${id}: ${entries.length} uses, ${bodies.size} distinct bodies (${[...new Set(entries.map((e) => e.file))].join(", ")})`);
    }
    expect(conflicts).toEqual([]);
  });
});
