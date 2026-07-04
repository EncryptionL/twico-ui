# Security standards

The goal: **zero vulnerabilities reach consumers of the npm package**, and the build/release
pipeline is hardened. The user-facing security policy is in [`/SECURITY.md`](../SECURITY.md); this
doc is the engineering detail. `npm audit --omit=dev` must stay at **0**.

## Consumer-facing surface (must stay clean)

- **Zero runtime dependencies.** The shipped tarball is `dist/` + `styles/` only; `react`/`react-dom`
  are peers. Never add a runtime dependency without strong justification — it widens every consumer's
  install surface. CI's `npm pack --dry-run` shows exactly what ships.
- **URL sanitization.** Components that render consumer-supplied links (`Breadcrumb`, `Navbar`,
  `Sidebar`, `List`) run every `href` through a `safeHref` guard that strips `javascript:`/`data:`/
  `vbscript:` schemes (including whitespace/control-char obfuscation that browsers ignore) before it
  reaches the DOM. `Avatar` applies the same idea to its image `src` via a `safeSrc` guard: it blocks
  `javascript:`/`vbscript:` and any `data:` URL that is **not** `data:image/` (so `data:image/…`
  previews and `blob:` stay allowed, but `data:text/html` and friends are rejected). **Any new
  component that renders a consumer `href`/`src` must do the same.** Still document that callers treat
  URLs from untrusted data as a trust boundary.
- **No dangerous sinks.** No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, or
  string-argument `setTimeout`/`setInterval` in shipped components.
- **Safe inline-script construction.** `getColorSchemeScript`/`ColorSchemeScript` build a small
  theme-init IIFE **string** from the consumer-supplied `storageKey`/`attribute`/`defaultScheme`. Each
  value is serialized with `JSON.stringify` and then run through `encodeScriptLiteral`, which
  re-encodes `<`, `>`, `&` (and the U+2028/U+2029 line separators) to their `\uXXXX` form. `JSON.stringify`
  escapes for JSON, **not** for an HTML `<script>` context — a raw `<` would let a value like
  `</script>` / `<!--` break out of the element if the string reached a raw-HTML sink. The escape keeps
  the *parsed* runtime value byte-identical while guaranteeing the emitted text carries no literal
  `<`/`>`/`&`. That `.replace()` on the `JSON.stringify` result is also the barrier CodeQL's
  `js/bad-code-sanitization` (CWE-116, `StringReplaceCallAsSanitizer`) recognizes, so the alert stays
  clear. Regression tests: `tests/primitives.test.jsx` (breakout + line-separator escaping, round-trip).
- **SSR-safe.** No `window`/`document`/`localStorage` at module or render scope; only in effects and
  handlers. Overlays portal to `document.body` only while open.

## No CDNs (self-host everything)

Fonts are self-hosted `.ttf` (`styles/fonts/`); icons are inline SVG. **Nothing is fetched from a
third-party CDN at runtime**, so consumers behind firewalls or a strict Content-Security-Policy never
hit `403`/blocked-asset failures.

- Enforced by a **CI guard** (`ci.yml` → "Guard - no CDN references in shipped source") that fails the
  build if `googleapis`/`gstatic`/`cdnjs`/`unpkg`/`jsdelivr`/`esm.sh`/`skypack`/`//cdn.` appears in
  `components/`, `src/`, `styles/`, `tokens/`, or `base.css`.
- Exception: `*.card.html` and `ui_kits/*.html` are standalone **preview** files (load React/Babel
  from CDN to render in a browser). They are **never shipped to npm and never part of the docs site**,
  so consumers are unaffected. Do not import them from product code.

## CI/CD hardening

- **Least privilege.** Every workflow declares minimal `GITHUB_TOKEN` permissions (`ci.yml`:
  `contents: read`; `release.yml`/`deploy-docs.yml`/`codeql.yml`: only what they need).
- **No untrusted interpolation** of `${{ github.event.* }}` into `run:` blocks; no
  `pull_request_target` with checkout of untrusted code.
- **npm provenance** on publish.
- Actions are official `actions/*` / `github/codeql-action/*` pinned to major tags.

## Automated scanning

- **CodeQL** (`.github/workflows/codeql.yml`) — `security-and-quality` queries on push/PR + weekly.
  Requires code scanning (free for public repos; GitHub Advanced Security for private). Configured via
  [`.github/codeql/codeql-config.yml`](../.github/codeql/codeql-config.yml), which **excludes generated
  artifacts** (`_ds_bundle.js`, `src/brand-icons.tsx`) from analysis — those are produced by build
  scripts and must never be hand-edited, so findings inside them are not actionable. The generators are
  still scanned, so any real issue is caught at its source. The config also excludes
  `scripts/fetch-brand-icons.mjs` — a dev-only icon-vendoring script (not shipped, not in CI, not in the
  docs site) whose sole purpose is "network → file" (an inherent `js/http-to-file-access` finding) and
  whose committed output (`scripts/brand-icons.json`) is code-reviewed; it is still hardened in code with
  a strict SVG-path allowlist + printable-ASCII title sanitization. Triage findings on the **Security ›
  Code scanning** tab; fix at the source file (don't edit generated/excluded output).
- **Dependabot** (`.github/dependabot.yml`) — weekly npm (root + `site/`) and github-actions updates,
  PRs targeting `dev`.

## Triaging advisories

1. Run `npm audit --omit=dev`. If it's **non-zero, that's consumer-facing — fix it** (bump the dep,
   or remove it).
2. Dev-only advisories (`npm audit` full) don't reach consumers but should still be assessed and, where
   exploitable in CI, fixed. Document accepted/not-applicable ones in [`/SECURITY.md`](../SECURITY.md)
   with rationale (e.g. the esbuild dev-server advisory doesn't apply to our static `vite build`).
3. Prefer non-breaking fixes; weigh breaking bumps against pipeline stability.

## Reporting

Vulnerabilities are reported privately via GitHub Security Advisories — see [`/SECURITY.md`](../SECURITY.md).
