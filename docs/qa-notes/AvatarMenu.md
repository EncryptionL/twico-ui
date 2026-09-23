# QA notes — AvatarMenu

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-09-23

## Open issues

- [x] **[#416] fullWidth couldnt replace a real account menu** — added header/headerExtra/menuWidth; fullWidth squares the trigger (radius-md) + matches the menu to the trigger width; the chevron rotates while open. `AvatarMenu.jsx`/`.d.ts` — ✓ 2026-09-23

- [x] **[#402] the trigger couldnt stretch to a full-width sidebar footer account row** — added `fullWidth` (the trigger + its Menu wrap stretch, the name/subtitle column grows, the chevron pins to the inline-end). `tests/sidebar-footer-scroll.test.jsx`. `AvatarMenu.jsx`/`.d.ts` — ✓ fixed 2026-09-22

(none)

## Verified OK

- **Keyboard operable trigger:** Enter/Space on the span[role="button"] correctly calls .click() to open the portaled Menu.
- **Chevron toggle:** showChevron defaults to showName (logical fallback); both control the chevron + text visibility.
- **Menu header:** Avatar + name/email render inside Menu's header prop with proper semantic structure via Menu's built-in header layout.
- **Portal anchoring:** Delegates to Menu, which is portal-anchored to trigger (already verified fixed).
- **Subtitle fallback:** subtitle ?? email ensures a sensible secondary line; aria-label on trigger is descriptive.
- **Size cascade:** Avatar in trigger uses the `size` prop; Avatar in Menu header is hardcoded to "md" (appropriate for header).
- **Presence status:** Status dot visible on both trigger and header Avatar, consistent visual identity.
- **Align prop:** "start" / "end" passed through to Menu.align; RTL-aware via Menu's logical positioning.
