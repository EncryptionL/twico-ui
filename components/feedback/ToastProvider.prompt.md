# ToastProvider + useToast

An imperative toast manager. Wrap your app in `<ToastProvider>` once — it owns the toast list and
renders a single `ToastViewport` — then fire toasts from anywhere with the `useToast()` hook. No more
hand-managing a toast array in state.

```jsx
import { ToastProvider, useToast, Button } from "twico-ui";

function App() {
  return (
    <ToastProvider limit={4}>
      <Page />
    </ToastProvider>
  );
}

function Page() {
  const { toast } = useToast();
  return (
    <>
      <Button onClick={() => toast.success("Saved", { description: "Your changes are live." })}>
        Save
      </Button>
      <Button onClick={() => toast.error({ title: "Failed", description: "Could not connect." })}>
        Break it
      </Button>
    </>
  );
}
```

- Tone helpers: `toast.success / warning / danger / error / info(title, options?)`; or `toast(opts)`.
- Each toast auto-dismisses on the shared timer (`duration`, default 4500ms; pass `0` to keep it open);
  `limit` caps how many show at once. `dismiss(id)` / `clear()` remove toasts manually.
- `useToast()` throws if called outside a `<ToastProvider>`.
