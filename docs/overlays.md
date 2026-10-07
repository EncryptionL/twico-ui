# Overlays — the shared modal pattern

`Dialog`, `Drawer`, `CommandPalette`, and `Sidebar` (in its off-canvas `overlay`
mode) are **modal overlays**: they portal to `document.body`, animate in *and* out,
lock body scroll, trap focus, and close on `Escape` / backdrop. This doc records the
pattern and the two hooks these components share.

## The pattern

All three follow the overlay conventions from [CLAUDE.md §5](../CLAUDE.md):

- **Portal to `document.body`** so the overlay escapes any ancestor with
  `transform` / `filter` / `backdrop-filter` (which would otherwise become the
  containing block for `position: fixed` — the docs-site navbar's `backdrop-filter`
  bit us here). Rendered client-only, so there is no hydration mismatch.
- **Mount only while open**, then stay mounted through a `var(--duration-exit)`
  exit animation driven by a `data-state="open" | "closed"` attribute, and unmount
  on a 170 ms timeout kept in lockstep with that token. `prefers-reduced-motion`
  collapses the animations to ~1 ms.
- **Lock body scroll** while open (restore the previous `overflow` on close).
- **Focus management:** move focus inside on open, cycle `Tab`/`Shift+Tab` within
  the panel, and restore focus to the trigger on close.
- **Dismissal:** `Escape` closes; a backdrop `onMouseDown` with an
  `e.target === e.currentTarget` guard closes (unless `closeOnBackdrop={false}`).

## The two extracted hooks (#177)

The focus-trap and portal logic was hand-rolled — and drifting — in all three
components. It now lives in **`components/_overlay.js`** and is exported publicly as
`useFocusTrap` / `usePortal`. `Sidebar`'s off-canvas mode (#138) reuses the same two
hooks rather than re-deriving the pattern.

### `useFocusTrap(ref, active = true, { restoreFocus = true } = {})`

- On **activate** (`active` becomes `true`): saves `document.activeElement`, then
  focuses the first focusable inside `ref.current` (or the container itself).
- While active: a document `keydown` listener cycles `Tab` / `Shift+Tab` within the
  region's *visible* focusables (`offsetParent !== null`).
- On **deactivate**: restores focus to the saved element unless `restoreFocus:false`.
- It does **not** own `Escape` — closing is component-specific, so each overlay keeps
  its own tiny Escape handler.

> **Gotcha — this is a passive effect, not a layout effect.** React restores focus to
> the *pre-commit* active element during the commit's layout phase. A focus-restore
> done in `useLayoutEffect` therefore gets clobbered (React re-focuses the old element
> *after* our restore). Running the restore in a passive `useEffect` — which fires
> after React's own restoration — makes it win. (Verified by `tests/useFocusTrap.test.jsx`.)

### `usePortal()`

Returns a stable `render(node)` callback that portals `node` to `document.body`, or
`null` on the server (no `document`). Centralizes the `createPortal` derivation the
three overlays each repeated.

### `useScrollLock(locked)` and `useInertBackground(ref, active)`

Added to `_overlay.js` in the a11y pass (#115/#116). `useScrollLock` is the one
**refcounted** body scroll-lock — nested/out-of-order overlay opens don't clobber each
other's saved `overflow`, and it compensates for the scrollbar gutter on the 0→1
transition so the page doesn't shift. It's re-exported publicly as `useScrollLock`
(moved out of `hooks/index.js`; the public API and its `.d.ts` are unchanged).
`useInertBackground(ref, active)` marks every sibling of the overlay's portal subtree
`inert` + `aria-hidden` while active, so a screen-reader virtual cursor / mobile swipe
can't reach the page behind a `Dialog`/`Drawer`. `Popover` also now reuses `useFocusTrap`
(with `restoreFocus:false`, since it owns a conditional restore) and is `aria-modal`.

## Why `components/_overlay.js` and not `hooks/index.js`

CLAUDE.md §5 says components import only `react` / `react-dom`, the shared internal
helpers (`_styles.js`, `_warn.js`, and now `_overlay.js`), and composite siblings —
**never** the public `hooks/` barrel. So the implementations live in the internal
`components/_overlay.js`, the overlays `import { useFocusTrap, usePortal } from
"../_overlay.js"`, and `hooks/index.js` re-exports them as the public API (mirroring
how it already re-exports `warnOnce`'s neighbours). This keeps the components
self-contained while still shipping the hooks publicly. `_overlay.js` itself imports
only `react` + `react-dom`, so there is no circular dependency with the hooks barrel.

The site's `gen:exports` scans `hooks/index.js` for `export function|const use…`, so
the re-export is written as `export const useFocusTrap = …` (not `export … from`) to
stay discoverable.

## The dismissable-layer stack (#389)

Before this, `Dialog`/`Drawer` called `onClose()` on **every** document `Escape` and closed on any backdrop
`mousedown`, with no idea what was open on top. So pressing `Escape` to dismiss a nested `Menu`, `Select`,
`Popover`, `Tooltip` or a second `Dialog` **also** closed the parent — throwing away, e.g., unsaved changes.

`components/_overlay.js` now exports a lightweight `useLayer(active)` primitive: every open overlay registers
while `active`, and the returned `isTop()` reports whether it is the topmost open layer (highest of a
module-level sequence set; cleanup runs after commit, so within one `Escape`/pointer event the just-closed child
is still registered and its parent correctly yields). Wiring:

- **Dialog / Drawer / CommandPalette** — their document `Escape` handler bails on `e.defaultPrevented` (a child
  React `onKeyDown` ran first) **or** `!isTop()`, and the backdrop `mousedown` is gated on `isTop()`.
- **Popover / Menu** — outside-pointer dismissal gates on `isTop()`; `Popover` also `preventDefault`s `Escape`
  so an enclosing Dialog stands down (`Menu` already `preventDefault`s it in its React handler).
- **Tooltip** — deliberately **not** a layer: a shown tooltip hides on `Escape` but does **not** consume it
  (no `preventDefault`), matching Radix/MUI, so the same `Escape` still closes an enclosing Dialog on the first
  press. A transient hover/focus tooltip isn't a modal layer.
- **Select / Combobox / MultiSelect** — `preventDefault` on `Escape` **only while the list is open**, so the
  enclosing Dialog's `defaultPrevented` guard sees it.

Tested in `tests/overlay-layer-stack.test.jsx` (nested Dialog Escape hits only the inner; an open Select inside
a Dialog closes the Select, not the Dialog; a lone Dialog still closes — no regression).

## The `trigger` contract (#447)

Popover and Menu **clone** the element you pass as `trigger` so a real `Button`/`IconButton` keeps its
own semantics, and inject `tabIndex`, `aria-expanded`, `aria-haspopup`, `aria-controls` and the open
handler onto it. **Pass a single focusable control.** Those attributes are only correct on something
that already is one: `aria-expanded` is not a global ARIA attribute, so on a `div`'s implicit
`role="generic"` it is *prohibited* (axe `aria-allowed-attr`, and it fires at rest because React
serializes `aria-expanded="false"`), and the element becomes a tab stop that announces nothing.

It is easy to hit, because wrapping is the natural way to overlay a badge on a button:

```jsx
/* two tab stops for one control, and an axe violation */
<Popover trigger={<Box sx={{ position: "relative" }}><IconButton …/><Badge>{n}</Badge></Box>} />

/* the control is the trigger; the decoration sits outside */
<Box sx={{ position: "relative" }}>
  <Popover trigger={<IconButton …/>} />
  <Badge>{n}</Badge>
</Box>
```

Since #447 the easy thing is at least *correct*: `triggerIsControl` (in `components/_overlay.js`)
detects a cloned non-control trigger, and both components then add `role="button"` - Popover also adds
Enter/Space activation, which its clone branch had never had, so such a trigger used to be focusable
but impossible to operate by keyboard. (Menu needed no handler: `span.twc-menu-wrap` carries
`onKeyDown` and Enter/Space/ArrowDown bubble to it.) An explicit `role` you set yourself always wins,
which is how `AvatarMenu` keeps its own `span role="button"`. Popover's injected handler bails on
`e.defaultPrevented` and when `e.target !== e.currentTarget`, so a real control nested inside the
trigger keeps its own activation instead of toggling twice.

A dev-only `useTriggerAudit` (also in `_overlay.js`) covers what static inspection cannot: a component
type like `Box`/`Stack` renders a div but `triggerIsControl` cannot see through it, so no role is
injected. In development it warns, naming the prop, when the trigger is a Tooltip, when it wraps a
focusable control (two tab stops for one control), or when it is a role-less non-control. It stays quiet
once the element carries a role - including the one this module injected - because by then there is
nothing left to report. `warnOnce` dedupes by key and no-ops in production.

### Tooltip goes OUTSIDE, not inside

Tooltip composes the other way round: it clones its child only to merge `aria-describedby` and spreads
everything else onto its own wrapper span. So `trigger={<Tooltip><IconButton/></Tooltip>}` *moves* the
problem onto `span.twc-tooltip-wrap` rather than fixing it, and the tooltip text stops being announced
on focus. Put Tooltip on the outside:

```jsx
<Tooltip label="Filters"><Popover trigger={<IconButton aria-label="Filters" …/>} …/></Tooltip>
```

That works because Popover/Menu forward a *received* `aria-describedby` to the cloned trigger (#420),
and it is what the `.twc-tooltip-wrap :is(.twc-menu-wrap, .twc-popover-wrap)` CSS from #398/#420
already assumes.

## Disabled triggers (#398)

A native `disabled` control swallows the pointer events a `Tooltip` opens from, so a disabled button's "why it's
disabled" tooltip often never showed. `Tooltip` CSS now sets `pointer-events: none` on a disabled/`aria-disabled`
child of `.twc-tooltip-wrap` (hover reaches the wrap) with a `not-allowed` cursor. `Button`/`IconButton` gained
`focusableWhenDisabled`, which renders `aria-disabled` instead of native `disabled` so the trigger stays
focusable (tooltip reachable by keyboard) while click + `Enter`/`Space` stay blocked.

## Handler composition: `{...rest}` must not delete an internal handler (#452)

Five components attached their own handler to the element they also spread `{...rest}` onto, with the spread
placed **after** the handler. Prop order wins in JSX, so a consumer passing the same-named prop silently replaced
the component's handler and the component stopped working with no warning at all:

| Component | Consumer prop | What it deleted |
| --- | --- | --- |
| `Menu` | `onKeyDown` | every bit of keyboard navigation (arrows, type-ahead, Escape, activation) |
| `TreeView` | `onKeyDown` | the whole WAI-ARIA tree keyboard pattern |
| `ToggleGroup` | `onKeyDown` | roving focus |
| `Carousel` | `onMouseEnter` | the autoplay hover-pause |
| `Tooltip` | `onMouseEnter` / `onFocus` | hover- and focus-open — the tooltip never appeared |

The fix is `compose(theirs, ours)` in `components/_compose.js`, with the composed handler wired **after** the
spread: the consumer's handler runs first, ours runs next unless they called `preventDefault()`, and the other
entries in `rest` still override our attributes exactly as before. Same contract as the Popover trigger
composition from #447. `tests/rest-spread-handler-composition.test.jsx` covers all three halves per component
(internal behaviour survives, consumer handler is called, `preventDefault` opts out).

## Menu follows the APG focus model, not roving activedescendant (#459)

`Menu` used to keep DOM focus on the trigger and advertise the highlighted item with `aria-activedescendant` on
it. That attribute is **not permitted on `role="button"`** — AT discards it — so for a keyboard user the
highlight was announced by nothing at all, and `aria-allowed-attr` fired as soon as they arrowed in. There is no
role that fixes it in place (`combobox` would allow the attribute but cannot carry `aria-haspopup="menu"`), so
`Menu` moves real DOM focus onto the highlighted item instead, as the APG menu-button pattern prescribes:

- focus follows **keyboard-driven** highlight changes only (an internal `kbdRef` flag), so hovering the menu
  with a pointer moves the highlight without stealing focus;
- items stay at `tabIndex={-1}`, so `Tab` still leaves the menu rather than walking the items;
- focus returns to the trigger on close, so `Escape`, `Tab` and activation never drop focus to `<body>`;
- the keydown handler stays on the wrapper — React portal events propagate up the React tree, not the DOM tree,
  so it keeps receiving keys once focus is inside the portaled menu.

`Select`'s trigger took the other route available to it: it is now the APG **select-only combobox**
(`role="combobox"`), a role that legally owns `aria-expanded`/`aria-controls`/`aria-activedescendant`, and it
claims `aria-activedescendant` only while it actually holds focus (i.e. when no search field is rendered).

## Tests

- `tests/useFocusTrap.test.jsx` — focus-in, restore (and `restoreFocus:false`), and
  `Tab`/`Shift+Tab` wrapping (jsdom reports `offsetParent` as `null`, so the wrap test
  fakes it).
- `tests/usePortal.test.jsx` — portals to `<body>`, stable callback identity.
- `tests/rest-spread-handler-composition.test.jsx` — a consumer handler never deletes an internal one (#452).
- `tests/menu-keyboard-activation.test.jsx` — Space activates the highlighted item (#457); the trigger carries
  no `aria-activedescendant`, focus follows the keyboard highlight, hover does not steal it, and focus returns
  to the trigger on close (#459).
- `tests/select-combobox-aria.test.jsx` — the trigger's combobox role + activedescendant ownership, and that the
  listbox owns only options (#459).
- `tests/overlays.test.jsx` — each overlay still portals, moves focus inside, closes
  on `Escape`/backdrop, and (CommandPalette) keeps Arrow/Enter navigation.
- `tests/Sidebar.test.jsx` — `overlay` mode renders a labelled `role="dialog"`, moves
  focus inside, and fires `onOpenChange(false)` on `Escape`/backdrop; `tests/AppShell.test.jsx`
  covers the shell forwarding overlay props to the sidebar (#138).
