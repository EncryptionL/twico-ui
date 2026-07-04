import * as React from "react";

// Shared, library-wide type vocabulary. Types only — no runtime. Re-exported from
// the package root so consumers can name the same unions the components use, instead
// of re-deriving them. See docs/tone-variant-system.md and docs/prop-conventions.md.

/** The canonical six-value color/intent scale used by status & control components. */
export type Tone = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

/** Action controls (Button, IconButton) — brand or destructive only. */
export type ActionTone = "primary" | "danger";

/** Text roles, the full color scale, and `"inherit"` (adopt the parent color) — Text. */
export type TextTone = "default" | "muted" | "subtle" | "inherit" | Tone;

/** Toast tone vocabulary — `"neutral"` is an alias of `"default"`. */
export type ToastTone = "default" | "neutral" | "success" | "warning" | "danger" | "info";

/** Progress / Timeline bar tones — the scale minus `"neutral"` (no neutral bar state). */
export type BarTone = Exclude<Tone, "neutral">;

/**
 * The `as` prop of the polymorphic primitives — any intrinsic tag name (`"div"`)
 * OR a React component (`as={Link}`), whose props then flow through `{...rest}`.
 */
export type PolymorphicAs = React.ElementType;

/**
 * The `sx` style-prop escape hatch (#53). Top-level CSS properties are applied as inline
 * style (and win over the component's base style, MUI-style); any nested object — a
 * selector key (`"&:hover"`, `":focus-visible"`, `"& > .child"`) or an at-rule
 * (`"@media (min-width: 600px)"`, `"@supports …"`, `"@container …"`) — is compiled to a
 * scoped stylesheet. Use design tokens for values, e.g. `color: "var(--color-primary)"`.
 * See docs/sx.md.
 */
export type Sx = React.CSSProperties & {
  [selector: string]: React.CSSProperties[keyof React.CSSProperties] | string | number | Sx | undefined;
};

// ── Polymorphic component type kit ────────────────────────────────────────────
// Powers the `as`-driven primitives (Box, Stack, Grid, Container, Text, Heading).
// Passing `as="a"` narrows the accepted props to that element's attributes (href,
// target, …) and types `ref` as the matching element (HTMLAnchorElement); the
// component's own style props always merge on top. `as={RouterLink}` accepts that
// component's props instead. See docs/polymorphic-types.md and docs/prop-conventions.md.

/** The `ref` type for a given `as` element `C` (e.g. `HTMLAnchorElement` for `"a"`). */
export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>["ref"];

/** Own props merged over `E`'s props — the component's own props win on a name clash. */
type Merge<E, Own> = Own & Omit<E, keyof Own>;

/** Own props + `as={C}`, merged with `C`'s intrinsic props (own props win on a name clash). */
export type PolymorphicProps<C extends React.ElementType, Own = {}> =
  Merge<React.ComponentPropsWithoutRef<C>, Own> & { as?: C };

/** {@link PolymorphicProps} plus a correctly-typed `ref` for the resolved element. */
export type PolymorphicPropsWithRef<C extends React.ElementType, Own = {}> =
  PolymorphicProps<C, Own> & { ref?: PolymorphicRef<C> };

/**
 * The callable type of a polymorphic `forwardRef` component whose default element is `D`.
 *
 * Two overloads keep prop-checking strict in both directions: when `as` is omitted the
 * default element `D` is used and its props (plus the own props) are enforced; when
 * `as={C}` is given, `C`'s props and a matching `ref` are enforced instead. A single
 * generic signature would let JSX fall back to the `ElementType` constraint and silently
 * accept anything, so the overloads are deliberate.
 */
export interface PolymorphicComponent<Own, D extends React.ElementType> {
  (
    props: Merge<React.ComponentPropsWithoutRef<D>, Own> & { as?: never; ref?: PolymorphicRef<D> },
  ): React.ReactElement | null;
  <C extends React.ElementType>(
    props: Merge<React.ComponentPropsWithoutRef<C>, Own> & { as: C; ref?: PolymorphicRef<C> },
  ): React.ReactElement | null;
  displayName?: string;
}
