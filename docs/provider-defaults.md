# Provider component defaults — `TwicoProvider defaults={…}` (#554)

A way to say "every `Datatable` in this app has this prop", so adopting a capability is not a call-site
sweep.

Related: [architecture.md](./architecture.md) · [datatable.md](./datatable.md) ·
[prop-conventions.md](./prop-conventions.md) · [ssr-styles.md](./ssr-styles.md)

---

## The problem

Adopting #542 (`rowResize`) across one app meant **24 call-site edits** — one prop on every `<Datatable>` —
because `TwicoProviderProps` was `{ nonce?, children? }` and there was no defaults channel.

The edits are not the cost. **The sweep is the part that rots:** the next grid someone adds is the one that
silently lacks the prop, and nothing fails. A missing optional boolean is invisible by construction — there is
no type error, no runtime warning, and the feature simply isn't there.

It is not specific to `rowResize` either. The same shape fits any prop a design system wants to **standardise**
rather than decide per call site: `rowResize`, `resizablePopovers`, `density`, `pageSizeOptions`,
`selectionPlacement`, `retainSelectedRows`. A wrapper component is the usual answer and it works — for the
grids a consumer mounts *through its own wrapper*. Not for the ones mounted directly, which is where the drift
starts.

## The API

```tsx
<TwicoProvider defaults={{ Datatable: { rowResize: true, resizablePopovers: true } }}>
  <App />
</TwicoProvider>
```

Keyed by component name; each value is a `Partial` of that component's props. An object literal written inline
is the documented spelling and is fine — see [Identity](#identity) below.

## Precedence: built-in < provider default < prop

A call site **always** wins:

```tsx
<TwicoProvider defaults={{ Datatable: { rowResize: true } }}>
  <Datatable … />                   {/* rowResize: true   — from the provider */}
  <Datatable … rowResize={false} />  {/* rowResize: false  — the call site wins */}
</TwicoProvider>
```

This is the rule `defaultColumn` already establishes one level down inside `Datatable` (built-in <
`defaultColumn` < column), so the two read consistently.

**A prop passed as `undefined` does not veto the default.** `rowResize={flag ? true : undefined}` and omitting
`rowResize` have to mean the same thing, and React hands the component `undefined` in both cases, so
`useComponentDefaults` copies only *defined* props over the defaults. That is also what keeps each component's
own signature defaults (`rowResize = false`) working when neither the provider nor the call site supplies a
value.

Nesting works the way context does: the nearest provider wins, so a subtree can opt back out.

## How it is wired

`components/_defaults.js` — a new shared internal helper, alongside `_styles.js`, `_warn.js` and `_overlay.js`.

```js
export const DefaultsContext = React.createContext(null);
export const DEFAULTABLE = ["Datatable", "CardGrid"];
export function useComponentDefaults(name, props) { … }
```

A component opts in by taking its props through the hook instead of destructuring the signature:

```jsx
export function Datatable(twcProps) {
  const {
    columns: columnsProp, rows: rowsProp = [], /* … */ className = "", ...rest
  } = useComponentDefaults("Datatable", twcProps);
```

That is the whole opt-in: the props object has to exist before it can be merged into, so the destructure moves
one line down. Everything after it is unchanged, including the `=` defaults.

### Three decisions worth keeping

**1. Plain context, never a module-level registry.** Two apps rendering in one Node process would otherwise
share one set of defaults, and the second request would be served the first's. Nothing about this feature is
allowed to be process-global.

**2. A per-component allow-list, not "any prop of any component".** A defaults blob is written once and read
never, so a key that silently does nothing is *worse* than no feature — it is the exact failure mode this
exists to remove, so it must not become this feature's own. `DEFAULTABLE` is what lets the provider say so:
`TwicoDefaults` rejects an unknown key at compile time, and `warnUnknownDefaults` names one in development
(deduped via `warnOnce`, no-op in production) and lists the components that *do* read the channel.

**3. No `undefined` punch-through**, as above.

### What the allow-list does not catch

`TwicoDefaults` rejects an unknown **component** key and an unknown **prop** name — but only for an object
*literal*, where TypeScript's excess-property check applies:

```tsx
<TwicoProvider defaults={{ Datatable: { rowReesize: true } }}>
//                                     ~~~~~~~~~~ TS2561: Did you mean 'rowResize'?
```

Hoist the same blob to a `const` without annotating it and that check no longer applies, so the typo compiles.
Annotate it — `const appDefaults: TwicoDefaults = { … }` — or write it inline. React still logs an
unknown-prop error at runtime, because an unrecognised key reaches the component's `{...rest}` DOM spread, so
it is not silent; it is just later than it should be.

### DiffTable inherits `defaults.Datatable`

`DiffTable` is a thin wrapper over `Datatable`'s diff mode (#239), so a `Datatable` default reaches its inner
grid even though `DiffTable` is not in `DEFAULTABLE`. **This is intended** — a `DiffTable` *is* a `Datatable`,
and standardising `density` or `rowResize` app-wide should reach it — but it was undocumented, which made it a
surprise rather than a decision. It is now asserted in the tests.

`DiffTable` is deliberately **not** added to `DEFAULTABLE`: its own signature does not accept `rowResize` and
friends, so `defaults.DiffTable.rowResize` would land in `{...rest}` and be spread onto a `<div>`. A key that
reaches the DOM instead of the component is worse than one that routes through the wrapper.

### Identity

`useStableDefaults` keeps the previous `defaults` object while the next one is **structurally equal** to it.

Without it, the documented spelling — an object literal in JSX — would be a new object on every render of the
provider's parent, so every opted-in component in the tree would see a new context value and re-render. A ref
compared by value is the only way to memoize a dependency that is itself unstable; it is idempotent and
observes nothing outside the render, so it is safe to write during one.

**How deep it reaches, exactly.** The first version compared leaf values with `===`, and this doc asserted the
guarantee unconditionally — which was false for any non-primitive. Measured over three parent renders:

| inline default | distinct context values | |
| --- | --- | --- |
| `{ Datatable: { rowResize: true } }` | 1 | stable |
| `{ Datatable: { pageSizeOptions: [5, 10, 25] } }` | **6** | every grid re-rendered |
| `{ Datatable: { defaultColumn: { … } } }` | **6** | every grid re-rendered |

Both of those are props #554 itself names. The comparison now reaches **primitives, arrays of primitives, and
plain objects of primitives**, so all three cases above are stable.

It does **not** reach a function, a nested array/object, a `Map`, or anything with a prototype — there is no
comparison for those that is both correct and cheap. An inline `isRowSelectable: (r) => …` is a new value every
render and this cannot tell otherwise: **hoist it to a module constant or `useMemo` it.** That is the limit,
stated as a limit. `tests/issue-554-provider-defaults.test.jsx` pins all five cases, the function one included.

## Opting another component in

1. Add its name to `DEFAULTABLE` in `components/_defaults.js`.
2. Add its entry to `TwicoDefaults` in `components/TwicoProvider.d.ts`
   (`Name?: Partial<NameProps>`).
3. In the component, replace `export function Name({ … }) {` with
   `export function Name(twcProps) { const { … } = useComponentDefaults("Name", twcProps);`.
4. Add a test to `tests/issue-554-provider-defaults.test.jsx` asserting a default reaches it and a call site
   beats it.

`Datatable` and `CardGrid` are wired today — the two data grids, and the components whose props a design system
most often wants to standardise. The rest are deliberately not: each opt-in is a behaviour surface, and the
issue that asked for this argued for a curated list over a blanket one.

## Tests

`tests/issue-554-provider-defaults.test.jsx` — a default reaching a directly-mounted grid, the precedence rule
in both directions, `undefined` not vetoing, the built-in default still applying, nested providers, no provider
at all, a provider with no defaults, `CardGrid`, `DiffTable`'s transitive inheritance, the unknown-key warning
(and its silence on a known key), and composition with the `nonce` context #57 already put there.

Two of those were added after review found them missing, and both had been *provable* holes rather than
theoretical ones:

- **Context identity** (five cases). Nothing referenced `useStableDefaults`, which is why the non-primitive
  defect above shipped. 
- **SSR isolation.** A module-level-registry implementation — the exact thing the issue said not to build —
  passed every behavioural assertion in the file. The test now interleaves `renderToString` of an
  opted-in app, a bare app, and the opted-in app again in one process, and asserts no bleed.

Every one of those was verified by **putting the bug back** — five separate reverts of `_defaults.js`, each
caught by the test that claims to guard it. See [development.md](./development.md) → "Prove the assertion works
by breaking the code".
