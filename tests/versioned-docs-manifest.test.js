import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

// CLAUDE.md §7 requires the versioned-docs manifest to roll on every MINOR release: bump Latest, add
// the previous minor as a frozen snapshot, drop the oldest, and keep DOC_SNAPSHOTS in
// deploy-docs.yml matched to it. It is a hand step, and it has been silently skipped before (v1.23 to
// v1.29, then again at v1.44 — the switcher kept offering "v1.43 · latest" while the live site was
// already serving v1.44).
//
// What this guard CAN do: catch a half-roll (one file updated, not the other), a snapshot naming a
// tag that does not exist, and a manifest left behind after a release has landed.
//
// What it CANNOT do, stated plainly so nobody trusts it further than it goes: at release-PR time
// package.json still holds the OLD version — semantic-release bumps it after the merge — so it cannot
// know the PR is about to cut a new minor. It catches a missed roll on the first push after the
// release syncs back, not before. The release checklist is still the first line of defence.

const ROOT = process.cwd();
const manifest = JSON.parse(readFileSync(resolve(ROOT, "site/public/versions.json"), "utf8"));
const workflow = readFileSync(resolve(ROOT, ".github/workflows/deploy-docs.yml"), "utf8");
const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));

const items = manifest.items;
const latest = items.find((i) => i.latest);
const snapshots = items.filter((i) => !i.latest);

/** `DOC_SNAPSHOTS: "1.43=v1.43.0 1.42=v1.42.1"` -> [["1.43","v1.43.0"], ...] */
const docSnapshots = (workflow.match(/DOC_SNAPSHOTS:\s*"([^"]*)"/)?.[1] ?? "")
  .split(/\s+/)
  .filter(Boolean)
  .map((pair) => pair.split("="));

const minorOf = (v) => String(v).replace(/^v/, "").split(".").slice(0, 2).join(".");

describe("versioned docs manifest (CLAUDE.md §7)", () => {
  it("has exactly one Latest entry, served from the root base", () => {
    expect(items.filter((i) => i.latest)).toHaveLength(1);
    expect(latest.base).toBe("/twico-ui/");
    expect(latest.version).toMatch(/^v\d+\.\d+$/);
  });

  it("Latest is not behind the released package version", () => {
    // The case that actually went wrong: 1.44.0 shipped while the switcher still said v1.43.
    expect(
      minorOf(latest.version),
      `versions.json says Latest is ${latest.version} but package.json is ${pkg.version} — roll the manifest`
    ).toBe(minorOf(pkg.version));
  });

  it("DOC_SNAPSHOTS matches the snapshot entries exactly", () => {
    // Either file alone is easy to update; CLAUDE.md §7 calls out keeping them matched.
    expect(docSnapshots.map(([minor]) => minor)).toEqual(snapshots.map((s) => minorOf(s.label)));
  });

  it("every snapshot's base path agrees with its label", () => {
    for (const s of snapshots) expect(s.base).toBe(`/twico-ui/${s.label}/`);
  });

  it("every tag DOC_SNAPSHOTS builds from exists", () => {
    // A typo'd tag fails the docs deploy at build time, long after the merge.
    //
    // This needs tag data, and the CI job that runs the unit tests checks out shallow (ci.yml's
    // "Build & type-check" step has no fetch-depth/fetch-tags), so `git tag -l` is empty there. An
    // empty list means "this checkout has no tags", NOT "every tag is missing" — asserting against it
    // would fail for an environment reason rather than a real one, which is worse than not checking.
    // So it degrades: full clones (local, and the fetch-depth: 0 job) get the real check.
    let tags = [];
    try {
      tags = execFileSync("git", ["tag", "-l"], { encoding: "utf8" }).split("\n").map((t) => t.trim()).filter(Boolean);
    } catch {
      /* not a git checkout at all */
    }
    if (tags.length === 0) {
      expect(docSnapshots.length, "no tag data in this checkout — skipping the existence check").toBeGreaterThan(0);
      return;
    }
    const known = new Set(tags);
    const missing = docSnapshots.filter(([, tag]) => !known.has(tag)).map(([minor, tag]) => `${minor} -> ${tag}`);
    expect(missing, "DOC_SNAPSHOTS names a tag that does not exist").toEqual([]);
  });

  it("keeps the switcher short — Latest plus at most three snapshots", () => {
    expect(snapshots.length).toBeGreaterThan(0);
    expect(snapshots.length).toBeLessThanOrEqual(3);
  });

  it("lists the snapshots newest first", () => {
    const nums = snapshots.map((s) => Number(minorOf(s.label)));
    expect(nums).toEqual([...nums].sort((a, b) => b - a));
  });
});
