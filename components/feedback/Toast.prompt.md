Transient notification. Manage a list in state and render inside a ToastViewport.

```jsx
import { Toast, ToastViewport } from "./Toast";

const [toasts, setToasts] = React.useState([]);
const push = (t) => setToasts((s) => [...s, { id: Date.now(), ...t }]);
const remove = (id) => setToasts((s) => s.filter((t) => t.id !== id));

<ToastViewport>
  {toasts.map((t) => (
    <Toast key={t.id} tone={t.tone} title={t.title} onClose={() => remove(t.id)}>{t.body}</Toast>
  ))}
</ToastViewport>
```

Tones: default/success/warning/danger/info. `Toast` props: `title`, `icon`, `onClose`.
