Full-height application shell: a fixed sidebar beside a scrollable content area, with an optional fixed topbar. The content fills the remaining space (and expands when the sidebar collapses); only the content scrolls.

```jsx
import { AppShell, Sidebar, Button } from "twico-ui";

<AppShell
  sidebar={
    <Sidebar
      brand={<strong>Acme</strong>}
      items={[{ label: "Home", active: true }, { label: "Settings" }]}
    />
  }
  header={
    <>
      <strong>Dashboard</strong>
      <Button size="sm">New</Button>
    </>
  }
>
  <h1>Welcome back</h1>
</AppShell>
```

`sidebar` and `header` are slots; `children` is the scrollable main region. The frame owns the
full-height layout (`height` defaults to `100dvh`), so the sidebar and topbar stay fixed while the
content scrolls. The `header` is a flex row with `space-between` — pass a left group and a right
group. Pair with `Sidebar` and drive its collapse from your own control (`collapsed` +
`collapsible={false}` to hide the built-in toggle). `padded` (default `true`) toggles content
padding; pass a fixed `height` to embed the shell in a smaller area. A visually-hidden-until-focused
skip-to-content link is the shell's first child (WCAG 2.4.1), targeting the `<main>` (`mainId`, default
`"twc-main"`); customise it with `skipLinkLabel` or pass `skipLinkLabel={false}` to opt out.
