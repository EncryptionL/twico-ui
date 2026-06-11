---
name: twico-ui-design
description: Use this skill to generate well-branded interfaces and assets for Twico UI, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Twico UI is a free, open-source React + Tailwind component library — crisp & professional,
Indigo (#6366F1) primary, Plus Jakarta Sans type, Lucide icons, rounded geometry, full dark
mode, and lively spring/ripple motion.

Key files:
- `DESIGN-SYSTEM.md` — the full design guide (content voice, visual foundations, iconography, manifest).
- `styles.css` — single CSS entry point (link this); pulls in `tokens/` + fonts + `base.css`.
- `tokens/` — colors, typography, spacing, radius/shadows, motion, fonts.
- `components/` — 61 React components (`.jsx` + `.d.ts` props + `.prompt.md` usage), grouped into
  8 directories matching the docs-site taxonomy: buttons / layout / typography / inputs /
  data-display / navigation / feedback / overlay.
- `assets/` — self-hosted fonts + `twico-icons.js` (Lucide → React helper).
- `ui_kits/showcase/` — the landing-page / live playground recreation.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and
create static HTML files for the user to view — link `styles.css`, load the component bundle,
and read components from `window.<Namespace>` (see any `*.card.html` for the exact pattern).
If working on production code, copy assets and read the rules here to become an expert in
designing with this brand; the `.d.ts` files are the real prop contracts.

If the user invokes this skill without any other guidance, ask them what they want to build or
design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.
