import React, { useState } from "react";
import { Button, Toast, ToastViewport } from "twico-ui";

const samples = [
  { tone: "success", title: "Saved", body: "Your changes were saved." },
  { tone: "warning", title: "Heads up", body: "Storage is almost full." },
  { tone: "danger", title: "Failed", body: "Could not connect to server." },
  { tone: "info", title: "FYI", body: "A new version is available." },
];

export default function ToastDemo() {
  const [toasts, setToasts] = useState([]);
  const push = (t) => setToasts((s) => [...s, { id: Date.now() + Math.random(), ...t }]);
  const remove = (id) => setToasts((s) => s.filter((t) => t.id !== id));
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      {samples.map((s) => (
        <Button key={s.tone} variant="soft" size="sm" onClick={() => push(s)}>
          Show {s.tone}
        </Button>
      ))}
      <ToastViewport>
        {toasts.map((t) => (
          <Toast key={t.id} tone={t.tone} title={t.title} onClose={() => remove(t.id)}>
            {t.body}
          </Toast>
        ))}
      </ToastViewport>
    </div>
  );
}
