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

## Configuration

- `.releaserc.json` — plugins: commit-analyzer, release-notes-generator, changelog, npm, github, git.
- `.github/workflows/release.yml` — runs `npx semantic-release` on push to `main`.

## Requirements

- **`NPM_TOKEN`** repository secret (npm automation token with publish rights). Already configured.
- `GITHUB_TOKEN` (provided automatically) for tags, the release, and the changelog commit.
- If you enable **branch protection** on `main`, allow the `github-actions` bot to push the changelog
  commit, or run semantic-release with a personal access token.
