# Security Policy

## Supported versions

The latest version of `twico-ui` published to npm receives security fixes.

## Reporting a vulnerability

**Please do not open a public issue for security reports.**

Report privately via GitHub Security Advisories:
**repo → Security → Report a vulnerability** (`https://github.com/EncryptionL/twico-ui/security/advisories/new`).

Include reproduction steps and affected versions. We aim to acknowledge within 7 days and to ship a fix or mitigation as quickly as the severity warrants, crediting reporters who wish to be credited.

## Security posture

- **Zero runtime dependencies.** The published tarball ships only `dist/` + `styles/`; `react`/`react-dom` are peer dependencies. `npm audit --omit=dev` reports **0 vulnerabilities**, so the install surface for consumers is minimal.
- **No CDNs.** Fonts are self-hosted (OFL `.ttf` files shipped under `styles/fonts/`) and icons are inline SVG. Nothing is fetched from a third-party CDN at runtime, so consumers behind strict networks, firewalls, or a tight Content-Security-Policy are unaffected (no 403/blocked-asset failures). A CI guard fails the build if a CDN reference is introduced into shipped source.
- **URL sanitization.** Navigation components (`Breadcrumb`, `Navbar`, `Sidebar`, `List`) strip `javascript:` / `data:` / `vbscript:` schemes (including whitespace/control-char obfuscation) before a consumer-supplied `href` reaches the DOM. Even so, treat any `href` you pass from untrusted/user-influenced data as a trust boundary.
- **SSR-safe.** No `window`/`document` access at module or render scope; all browser access is inside effects/handlers.
- **Least-privilege CI.** Each workflow declares minimal `GITHUB_TOKEN` permissions. Releases publish with npm provenance.
- **Automated scanning.** CodeQL static analysis (`.github/workflows/codeql.yml`) and Dependabot dependency updates (`.github/dependabot.yml`) run continuously.

## Known dev-only advisories (do not affect the published package)

Because the shipped tarball has no runtime dependencies, the following advisories are confined to the build/release/docs **toolchain** and never reach consumers of the npm package:

| Advisory | Where | Why it doesn't affect consumers |
| --- | --- | --- |
| `esbuild` ≤0.24.2 (GHSA-67mh-4wv8-2f99) | via `vite`, docs-site tooling | Affects only the local dev server; the docs deploy uses a static `vite build`, which is not exposed. |
| `brace-expansion`, `ip-address`, `picomatch` | inside the npm CLI bundled by `@semantic-release/npm` | Used only inside the CI release job; not installed by, or shipped to, consumers. |

These are tracked by Dependabot and updated as upstream fixes land. Run `npm audit --omit=dev` to confirm the consumer-facing surface stays clean.
