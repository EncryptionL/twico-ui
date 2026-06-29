# Building with Twico UI

Twico UI is a zero-runtime-dependency React component library (62 components + hooks). Every design is composed from the real shipped components on `window.TwicoUI.*`. Build with the components and the design tokens below — don't reinvent their markup or class names.

## Setup — no provider needed

Components are self-contained: each renders its own scoped CSS (SSR-safe), so there is **no root provider or ThemeProvider to wrap**. Just make sure the stylesheet is loaded once — `styles.css`, which `@import`s the fonts and `_ds_bundle.css` (these carry every design token and all component styles).

Theming is **attribute-driven** on any ancestor (usually `<html>`):
- **Dark mode:** `class="dark"` or `data-theme="dark"` — only semantic color aliases flip.
- **Density:** `data-density="comfortable"` or `data-density="compact"` — retunes control heights everywhere, no per-component code.
- **RTL:** `dir="rtl"` — the CSS uses logical properties, so the UI mirrors automatically.

**One exception:** toasts need context. Wrap the app once in `<ToastProvider>` and fire toasts with the `useToast()` hook. Nothing else requires a provider.

## Styling idiom — props + tokens, never utility classes

Twico has **no utility-class system**. Style components through their **props**, and write your own layout glue with **inline styles that reference design tokens** (`var(--…)`). Do not target the library's internal `twc-*` class names.

Shared prop vocabulary (most components accept these):
- `variant` — emphasis: `"solid" | "soft" | "outline" | "ghost"` (Card adds `"elevated"`).
- `tone` — color intent: `"primary" | "neutral" | "info" | "success" | "warning" | "danger"` (Text also has `"default" | "muted" | "subtle"`).
- `size` — `"xs" | "sm" | "md" | "lg"`.

Design tokens — use these real names for your own spacing, color, and type:
- **Color:** `--color-primary`, `--color-danger`, `--color-success`, `--color-info`, `--color-warning`, `--color-neutral` — each with `-fg`, `-hover`, `-subtle`, `-subtle-fg` variants; plus `--color-bg`, `--color-border`, `--color-divider`, `--color-overlay`.
- **Spacing:** `--space-1` … `--space-20`, plus half-steps `--space-0-5`, `--space-1-5`, `--space-2-5`.
- **Radius:** `--radius-xs|sm|md|lg|xl|2xl|full`. **Shadow:** `--shadow-xs|sm|md|lg|xl|brand`.
- **Type:** `--text-body|base|2xl…7xl`, `--font-sans`, `--font-mono`, weights `--font-normal|medium|semibold|bold|extrabold`, `--leading-*`, `--tracking-*`.
- **Layout/motion:** `--container-sm|md|lg|xl|2xl`, `--duration-*`, `--ease-*`, `--z-*`, focus ring `--ring-*`.

## Where the truth lives

Before composing a component, read the bound `styles.css` (and its `@import`s — `fonts/fonts.css`, `_ds_bundle.css`) for the full token set, and that component's `<Name>.prompt.md` (usage) + `<Name>.d.ts` (props contract).

## Idiomatic example

```jsx
import { Card, Heading, Text, Stack, Button } from 'twico-ui';

export function PlanCard() {
  return (
    <Card variant="elevated" style={{ maxWidth: 'var(--container-sm)', padding: 'var(--space-6)' }}>
      <Stack direction="column" gap="var(--space-3)">
        <Heading level={3}>Pro plan</Heading>
        <Text tone="muted">Everything in Starter, plus advanced controls.</Text>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="solid">Upgrade</Button>
          <Button variant="ghost">Compare</Button>
        </div>
      </Stack>
    </Card>
  );
}
```

Toasts (the one provider): wrap once, then fire from anywhere.

```jsx
import { ToastProvider, useToast, Button } from 'twico-ui';

function SaveButton() {
  const { toast } = useToast();
  return <Button variant="solid" onClick={() => toast.success('Saved', { description: 'Your changes are live.' })}>Save</Button>;
}
// Wrap the app: <ToastProvider><SaveButton /></ToastProvider>
```
