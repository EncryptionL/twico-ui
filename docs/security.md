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
  reaches the DOM. **Any new component that renders a consumer `href`/`src` must do the same.** Still
  document that callers treat URLs from untrusted data as a trust boundary.
- **No dangerous sinks.** No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, or
  string-argument `setTimeout`/`setInterval` in shipped components.
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
  Requires code scanning (free for public repos; GitHub Advanced Security for private).
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
