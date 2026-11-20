# Releases & versioning

Releases are **fully automated** with [semantic-release](https://semantic-release.gitbook.io/) and
follow [Semantic Versioning](https://semver.org/). **No one bumps the version by hand.**

## How a release happens

1. Work lands on `dev` via Conventional Commits.
2. `dev → main` is merged.
3. `.github/workflows/release.yml` runs on the push to `main` and:
   - analyzes commits since the last release tag,
   - computes the next version,
   - publishes to **npm** (with provenance),
   - tags **`vX.Y.Z`**,
   - writes/updates **`CHANGELOG.md`**,
   - bumps **`package.json`**,
   - opens a **GitHub Release**,
   - commits the changelog + `package.json` back to `main` with `[skip ci]`.

A push to `main` with no release-worthy commits does nothing.

### If the merge produced no release run

`release.yml` also has a **`workflow_dispatch`** trigger, and dispatching it on `main` does exactly
what the push would have: semantic-release reads the Conventional Commits since the last tag, and is a
no-op if there are none.

```bash
gh workflow run release.yml --ref main
```

It exists because the push trigger is the single point of failure for the entire release. During the
v1.45 release, GitHub silently created **no run at all** for pushes to `dev` and for a `pull_request`
into `main` — no workflow run, no check suite, nothing queued — while `workflow_dispatch` worked
normally throughout and the service status page reported Actions operational. Every workflow was
`active`, the YAML was valid, and the repo was public and not disabled. Without a manual trigger the
only recovery is to push another commit to `main` and hope, which leaves `main` ahead of the last tag
with nothing published in the meantime.

Check for that state with:

```bash
gh api "repos/EncryptionL/twico-ui/commits/<sha>/check-suites" --jq .total_count   # 0 == none created
```

`interaction.yml`, `visual.yml` and `deploy-docs.yml` already had `workflow_dispatch`; `ci.yml` still
does not, so a missing CI run has to be verified locally (`npm run build && npm run typecheck &&
npm run test:run && …`, per CLAUDE.md §8) rather than re-triggered.

## Version bumps (from commit types)

| Commit | Bump |
| --- | --- |
| `fix:` | patch — `x.y.Z` |
| `feat:` | minor — `x.Y.0` |
| `feat!:` or a `BREAKING CHANGE:` footer | major — `X.0.0` |
| `docs:` / `chore:` / `ci:` / `refactor:` / `test:` / `style:` | no release |

## Version sync (repo ↔ npm)

`package.json` holds a **real** version (starts at `0.1.0`). After every release the bot commits the
bumped `package.json` (+ `CHANGELOG.md`) back to `main`, so **the version on `main` always matches
the latest npm release** — they never drift. Don't edit the version manually; let the bot own it.

## First release baseline

A `v0.0.0` git tag was seeded so the **first** automated release would be `0.1.0` (not
semantic-release's default of `1.0.0`), keeping the library on its 0.x line until a
`feat!:`/`BREAKING CHANGE:` takes it to `1.0.0`.

**However, `0.1.0` was published to npm manually** (2026-06-11, from commit `90893af`) before
semantic-release ever ran. With only the `v0.0.0` tag, the next release run would recompute
`0.1.0` and **fail on the npm publish collision**. The fix (done 2026-06-12): an annotated
`v0.1.0` tag now points at `90893af`, so semantic-release's baseline matches reality and the
next `dev → main` merge computes from there (the pending `feat:` commits → `0.2.0`).

## Why you don't see version bumps in `dev` commits

This is by design. Version numbers are owned by the bot and only ever change **on `main`, at
release time**: semantic-release analyzes the commits since the last tag, picks the bump, updates
`package.json` + `CHANGELOG.md`, tags `vX.Y.Z`, publishes to npm, and commits the bump back to
`main`. Commits on `dev` intentionally never touch the version — the Conventional Commit *types*
(`feat:`/`fix:`/…) are the version record until they land on `main`. To "see" the pending version:
every `feat:` on dev = minor bump queued, every `fix:` = patch queued.

## Changelog

Every version's changes are recorded automatically in two places, both generated from the
Conventional Commits in that release — **never edit them by hand**:

- [`CHANGELOG.md`](../CHANGELOG.md) at the repo root (grouped by version, newest first), written by
  `@semantic-release/changelog` and committed back to `main` by `@semantic-release/git`.
- The [GitHub Releases](https://github.com/EncryptionL/twico-ui/releases) page, created by
  `@semantic-release/github`.

The docs website links to the changelog from its header ("Changelog").

### Write issue numbers in a commit BODY carefully

`conventional-changelog` harvests **every** `#NNN` in a commit message as a closes-reference, not
just the ones after a `Closes`/`Fixes` keyword — and it renders each as a link in the changelog
entry. A commit body that explains itself by citing prior issues therefore produces a long
`closes [#536] [#530] [#537] …` tail with duplicates, and a range written as a bare
hyphenated pair is parsed as one malformed reference: `#530-#533` became
`https://github.com/530-/issues/533`. Both happened in 1.52.0 — the entry is accurate and the real
links resolve, but it is noisy.

It is cosmetic, and `CHANGELOG.md` must not be hand-edited to fix it (it is regenerated, and
correcting it would mean a push to `main`). Avoid it at the source instead: in a commit **body**,
name past work as "issue 530" rather than with a bare hash, and keep the hash form for the real
`Closes` footers — one per issue, since a comma-separated `Closes #a, #b` only closes the first.

## Configuration

- `.releaserc.json` — plugins: commit-analyzer, release-notes-generator, changelog, npm, github, git.
- `.github/workflows/release.yml` — runs `npx semantic-release` on push to `main`.

## Requirements

- **Node ≥ 26.13** on the *release* runner. semantic-release reads its own `engines.node` at
  **runtime** — `bin/semantic-release.js` compares `process.version` and exits — so the floor moves
  with the tool, and npm only *warns* about it at install time. v26.0.1 requires `>=26.13`
  (v26.13.1 "Lithium" is the current LTS); v25 required `^22.14.0 || >= 24.10.0`.

  `release.yml` therefore pins `node-version: "26"` while **every other workflow stays on 22** —
  nothing else runs semantic-release, and 22 is a deliberate mid-range test of the package's own
  `engines: ">=18"`. Do not "normalise" release.yml back to 22.

  **This is guarded**, because it got through once: Dependabot auto-merged v25 → v26 (#546) and
  `release.yml` is the only workflow that runs the tool *and* it fires only on a push to `main`, so
  no job on `dev` exercised the combination — the first sign would have been a failed release run
  on `main`, after the merge.
  [`tests/release-node-version.test.js`](../tests/release-node-version.test.js) now ties the pinned
  version to the installed `engines.node`, so the next such bump is a red suite on `dev`. It is
  dependency-free on purpose (`js-yaml` and `semver` are only transitive here) and **strict**: an
  `engines` range or a `node-version` spelling it does not understand *fails* rather than passing
  vacuously, and it fails if another workflow starts running semantic-release. It also allows for a
  bare major: `node-version: "26"` resolves to the newest 26.x, so it is compared as `26.∞` rather
  than `26.0.0`.
- **`NPM_TOKEN`** repository secret (npm automation token with publish rights). Already configured.
- `GITHUB_TOKEN` (provided automatically) for tags, the release, and the changelog commit.
- If you enable **branch protection** on `main`, allow the `github-actions` bot to push the changelog
  commit, or run semantic-release with a personal access token.
