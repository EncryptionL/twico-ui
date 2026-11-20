import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

// -------------------------------------------------------------------------------------------------
// The release tool's runtime requirement has to be tied to the workflow that runs it.
//
// semantic-release enforces its own `engines.node` at RUNTIME, not just at install time:
// bin/semantic-release.js reads engines.node, compares it against process.version, and exits with
//   [semantic-release]: node version >=X is required. Found vY.
// npm only *warns* on an engines mismatch during `npm ci`, so the install succeeds and the failure
// lands later.
//
// Dependabot auto-merged semantic-release 25.0.9 -> 26.0.1 (#546), which moved that floor to
// >=26.13 while release.yml ran Node 22. release.yml is the ONLY workflow that runs it and it fires
// only on a push to `main`, so nothing on `dev` exercised the combination: the first sign would have
// been a failed release run on main, after the merge.
//
// This test closes exactly that gap, so the next major bump of the release tool is a red suite on
// `dev` — a one-line fix — instead of a broken release on `main`.
//
// Deliberately dependency-free. `js-yaml` and `semver` are only TRANSITIVE deps here, and a guard
// that stops running when an unrelated package drops them is not a guard. Both parsers below are
// strict: anything they do not understand FAILS rather than passing vacuously, which is the whole
// point — a check that can only report success is worthless.
// -------------------------------------------------------------------------------------------------

const root = (p) => resolve(process.cwd(), p);
const WORKFLOWS = root(".github/workflows");

/** Every `node-version:` that belongs to an `actions/setup-node` step in one workflow file. */
function setupNodeVersions(file) {
  const lines = readFileSync(resolve(WORKFLOWS, file), "utf8").split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/uses:\s*actions\/setup-node@/.test(lines[i])) continue;
    // The matching `with:` block follows within a few lines and is more indented than the step.
    for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
      if (/uses:\s*\S/.test(lines[j]) || /^\s*-\s+name:/.test(lines[j])) break; // next step
      const m = /^\s*node-version:\s*["']?([^"'#\s]+)["']?/.exec(lines[j]);
      if (m) { out.push(m[1]); break; }
    }
  }
  return out;
}

/**
 * Lowest version a `>=`-style range accepts, as [major, minor, patch].
 * Throws on anything else, so an unrecognised range fails the suite instead of skipping it.
 */
function floorOf(range) {
  const m = /^>=\s*(\d+)(?:\.(\d+))?(?:\.(\d+))?$/.exec(String(range).trim());
  if (!m) throw new Error(`release-node-version: cannot read a floor out of engines.node "${range}" — widen this parser deliberately rather than loosening the assertion`);
  return [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)];
}

/**
 * Highest version an `actions/setup-node` spelling can resolve to, as [major, minor, patch].
 * A bare major like "26" installs the newest 26.x, so comparing "26.0.0" against ">=26.13" would
 * fail a config that is in fact correct.
 */
function ceilingOf(spec) {
  const m = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/.exec(String(spec).trim());
  if (!m) throw new Error(`release-node-version: cannot read a Node version out of "${spec}" — if release.yml now uses a range or an alias like lts/*, teach this parser about it`);
  const BIG = 1e9;
  return [Number(m[1]), m[2] === undefined ? BIG : Number(m[2]), m[3] === undefined ? BIG : Number(m[3])];
}

const gte = (a, b) => (a[0] !== b[0] ? a[0] > b[0] : a[1] !== b[1] ? a[1] > b[1] : a[2] >= b[2]);

describe("release.yml's Node satisfies semantic-release's engines", () => {
  const sr = JSON.parse(readFileSync(root("node_modules/semantic-release/package.json"), "utf8"));
  const required = sr.engines && sr.engines.node;

  it("semantic-release declares a Node floor we can read", () => {
    expect(required, "engines.node is missing — revisit this guard").toBeTruthy();
    expect(() => floorOf(required)).not.toThrow();
  });

  it("release.yml pins at least one setup-node version", () => {
    const vs = setupNodeVersions("release.yml");
    expect(vs.length, "found no actions/setup-node step — the parser or the workflow changed").toBeGreaterThan(0);
  });

  it("every setup-node version in release.yml clears that floor", () => {
    const floor = floorOf(required);
    for (const v of setupNodeVersions("release.yml")) {
      const ceil = ceilingOf(v);
      expect(
        gte(ceil, floor),
        `release.yml runs semantic-release ${sr.version} on Node "${v}", but it requires ` +
          `"${required}" and enforces that at runtime — the release would fail on main`
      ).toBe(true);
    }
  });

  it("the runtime check this guards against is really in the installed bin", () => {
    // If semantic-release ever stops enforcing engines itself, this guard protects nothing and
    // should be revisited rather than quietly kept.
    const bin = readFileSync(root("node_modules/semantic-release/bin/semantic-release.js"), "utf8");
    expect(bin).toContain("engines");
    expect(bin).toMatch(/satisfies\(process\.version/);
  });

  it("release.yml is still the only workflow that runs semantic-release", () => {
    // If another workflow starts running it, that one needs the same floor and this test should
    // cover it too. Reads the directory rather than a hardcoded list, so a NEW workflow counts.
    const runners = readdirSync(WORKFLOWS)
      .filter((f) => /\.ya?ml$/.test(f))
      .filter((f) => /semantic-release/.test(readFileSync(resolve(WORKFLOWS, f), "utf8")));
    expect(runners).toEqual(["release.yml"]);
  });
});
