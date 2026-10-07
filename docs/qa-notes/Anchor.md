# QA notes — Anchor

- **Group:** navigation
- **Status:** clean
- **Reviewed:** 2026-10-07

## Open issues

- [x] **[#451] link text used `--color-primary`** - brand-500 as text is 4.00-4.47:1 in light and 3.27:1 on the dark raised surface, under the 4.5:1 AA floor for body text. Now `--color-primary-subtle-fg` (7.07:1 light), and the same change was made to `base.css`'s global `a` rule so an unstyled link in consumer content inherits the accessible colour too. `Anchor.jsx:5` - fixed 2026-10-07

- [ ] **[note] `{...rest}` is spread after `{...extra}`, so a consumer can drop `rel="noopener noreferrer"`** - `<Anchor external rel="nofollow">` replaces the whole `rel`, taking `noopener` with it and handing the opened document a live `window.opener`. This follows the library-wide attribute-override convention (a consumer's `...rest` wins), which is why it is recorded rather than "fixed" - but `rel` on an `external` link is the one attribute where merging would be safer than replacing. `Anchor.jsx:25`

- [ ] **[note] `href` is only sanitized when `as` is the default `"a"`** - `href={Tag === "a" ? safeHref(href) : href}`, so an `as={RouterLink}` receives the raw value. Defensible (a router link takes `to`, not `href`, and the wrapped component owns its own navigation) but it means the trust boundary moves to the consumer the moment `as` is used. `Anchor.jsx:25`

## Verified OK

- Consumer `href` is sanitized through `safeHref` before it reaches a real DOM `href`: `javascript:` / `data:` / `vbscript:` are dropped, including whitespace- and control-char-obfuscated forms (`[\x00-\x20]` is stripped before the comparison), and `null`/`undefined` collapse to no attribute at all.
- `external` renders `target="_blank"` together with `rel="noopener noreferrer"`, so the opened document cannot reach `window.opener` (see the note above for the override caveat), and appends an `aria-hidden` ↗ glyph so the marker is not announced twice.
- Hover colour is `--color-primary-hover`, which is a text-grade step in both themes: brand-600 = 6.29:1 on white, brand-400 = 5.98:1 on the dark surface. The `var(--color-primary)` fallback in that declaration is unreachable (the token is defined in both scopes) - which is just as well, since it would measure 4.47:1.
- Underline is applied on hover only (`text-decoration: none` at rest), so the resting link is distinguished from body text by colour alone. That is acceptable here because the component is for in-prose links where the surrounding text supplies the contrast cue, but it is the reason `base.css` keeps the global `a` rule in step.
- Focus-visible shows the shared `--ring` box-shadow and clears the native outline; the ring token is a solid brand colour, so it clears 3:1 against the surface.
- RTL-safe: the external-link glyph uses `margin-inline-start`, and nothing else sets a physical offset.
- Forwards a ref (`React.forwardRef` + `displayName`), so it composes with router links and focus management.
- SSR-safe: no `window`/`document` access; styling goes through `useScopedStyles`.
