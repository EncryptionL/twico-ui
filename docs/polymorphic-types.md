# Polymorphic component types (`as`)

Six primitives change their rendered element via an `as` prop: **Box**, **Stack**, **Grid**,
**Container** (layout) and **Text**, **Heading** (typography). Since #55 the TypeScript types are
fully **polymorphic** — the accepted props and the `ref` type are inferred from `as`.

```tsx
<Box as="a" href="/docs" ref={anchorRef} p={4} />   // href/target/rel typed; ref is HTMLAnchorElement
<Stack as="button" type="submit" disabled />         // button-only attrs typed
<Text as={RouterLink} to="/home" size="lg" />        // RouterLink's own props typed
```

## The type kit

Lives in [`components/_types.d.ts`](../components/_types.d.ts) (types only, no runtime) and is
re-exported from the package root so consumers can reuse it when wrapping a primitive:

| Type | Purpose |
| --- | --- |
| `PolymorphicRef<C>` | The `ref` element type for `as={C}` (e.g. `HTMLAnchorElement` for `"a"`). |
| `PolymorphicProps<C, Own>` | `Own` props merged over `C`'s intrinsic props + `as?: C` (own props win on a name clash). |
| `PolymorphicPropsWithRef<C, Own>` | The above plus a correctly-typed `ref`. |
| `PolymorphicComponent<Own, D>` | The callable component type; default element `D`. |

Each primitive exports an `XOwnProps` interface (its non-polymorphic style props) and a generic
`XProps<C = "div">` alias, plus the value typed as `PolymorphicComponent<XOwnProps, D>`:

```ts
export interface BoxOwnProps { p?: number | string; bg?: string; /* … */ }
export type BoxProps<C extends React.ElementType = "div"> = PolymorphicPropsWithRef<C, BoxOwnProps>;
export declare const Box: PolymorphicComponent<BoxOwnProps, "div">;
```

The runtime is a plain `React.forwardRef` in the sibling `.jsx`; the `.d.ts` is the type contract.

## Why two call signatures

`PolymorphicComponent` deliberately declares **two overloads** rather than one generic signature:

```ts
export interface PolymorphicComponent<Own, D extends React.ElementType> {
  (props: Merge<React.ComponentPropsWithoutRef<D>, Own> & { as?: never; ref?: PolymorphicRef<D> }): React.ReactElement | null;
  <C extends React.ElementType>(props: Merge<React.ComponentPropsWithoutRef<C>, Own> & { as: C; ref?: PolymorphicRef<C> }): React.ReactElement | null;
  displayName?: string;
}
```

A single `<C extends ElementType = D>` signature *looks* correct but regresses checking: when `as`
is omitted JSX has nothing to infer `C` from and falls back to the **`ElementType` constraint**,
whose component branch is `(props: any) => …` — so the props type widens to `any` and even the
component's **own** props stop being checked (`<Text size={5} />` would compile). The first overload
pins the no-`as` case to the concrete default element `D`; the second (requiring `as: C`) handles
the explicit case. This keeps prop-checking strict in both directions.

**Known soft spot:** none — the overloads close the gap. (Earlier drafts that used a single generic
signature accepted anchor-only attrs like `href` on a default `<Box>`; the two-overload form rejects
them.)

## Verification

Compile-only fixture: [`tests/types/polymorphic.tsx`](../tests/types/polymorphic.tsx), checked by
`npm run typecheck` (the root `tsconfig.json` includes `tests/types`). It asserts the positive cases
above and, with `@ts-expect-error`, that these are rejected:

- `href` on a default `<Box>` (div has no `href`)
- `size={5}` on `<Text>` (own token union excludes `number`)
- `disabled` on `<Box as="a">` (button-only attribute)
- an `HTMLButtonElement` ref on `<Box as="a">` (ref element mismatch)
- `<Box as={CustomLink} />` missing `CustomLink`'s required `to` prop

## Runtime note

The runtime already sanitizes consumer-supplied `href`/`target`/`rel` (scheme allow-list) whenever a
primitive renders an anchor — see [security.md](./security.md) and `safeHref`. The type change is
purely additive at the type level and does not alter emitted JS.
