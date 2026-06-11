import React from "react";
import { Button, Toast, ToastViewport } from "twico-ui";

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
  </svg>
);

// Interactive: push/dismiss toasts in a real ToastViewport.
function ToastQueueExample() {
  const [toasts, setToasts] = React.useState([]);
  const push = (t) =>
    setToasts((s) => [...s, { id: Date.now() + Math.random(), ...t }]);
  const remove = (id) => setToasts((s) => s.filter((t) => t.id !== id));
  const samples = [
    { tone: "success", title: "Saved", body: "Your changes were saved." },
    { tone: "danger", title: "Failed", body: "Could not reach the server." },
    { tone: "info", title: "Update ready", body: "A new version is available." },
  ];
  return (
    <>
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
    </>
  );
}

const variations = [
  {
    title: "Tones",
    description: "Five semantic tones, each with a matching accent and icon.",
    code: `<Toast tone="default" title="Note">Something happened.</Toast>
<Toast tone="success" title="Saved">Your changes were saved.</Toast>
<Toast tone="warning" title="Heads up">Storage is almost full.</Toast>
<Toast tone="danger" title="Failed">Could not connect to server.</Toast>
<Toast tone="info" title="FYI">A new version is available.</Toast>`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Toast tone="default" title="Note">Something happened.</Toast>
        <Toast tone="success" title="Saved">Your changes were saved.</Toast>
        <Toast tone="warning" title="Heads up">Storage is almost full.</Toast>
        <Toast tone="danger" title="Failed">Could not connect to server.</Toast>
        <Toast tone="info" title="FYI">A new version is available.</Toast>
      </div>
    ),
  },
  {
    title: "Title only",
    description: "Omit the body for a compact single-line toast.",
    code: `<Toast tone="success" title="Profile updated" />
<Toast tone="info" title="Synced just now" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Toast tone="success" title="Profile updated" />
        <Toast tone="info" title="Synced just now" />
      </div>
    ),
  },
  {
    title: "Dismissable",
    description: "Pass onClose to show the close button and handle dismissal.",
    code: `<Toast tone="warning" title="Heads up" onClose={() => {}}>
  Click the X to dismiss this toast.
</Toast>`,
    render: () => (
      <Toast tone="warning" title="Heads up" onClose={() => {}}>
        Click the X to dismiss this toast.
      </Toast>
    ),
  },
  {
    title: "Custom icon",
    description: "Override the tone icon with any node.",
    code: `<Toast tone="info" title="Deploy started" icon={<RocketIcon />}>
  Shipping your build to production.
</Toast>`,
    render: () => (
      <Toast tone="info" title="Deploy started" icon={<RocketIcon />}>
        Shipping your build to production.
      </Toast>
    ),
  },
  {
    title: "Live queue",
    description: "Push toasts into a fixed ToastViewport and remove them on close.",
    code: `const [toasts, setToasts] = React.useState([]);
const push = (t) => setToasts((s) => [...s, { id: Date.now(), ...t }]);
const remove = (id) => setToasts((s) => s.filter((t) => t.id !== id));

<>
  <Button variant="soft" size="sm" onClick={() => push({ tone: "success", title: "Saved", body: "Your changes were saved." })}>
    Show success
  </Button>
  <ToastViewport>
    {toasts.map((t) => (
      <Toast key={t.id} tone={t.tone} title={t.title} onClose={() => remove(t.id)}>
        {t.body}
      </Toast>
    ))}
  </ToastViewport>
</>`,
    render: () => <ToastQueueExample />,
  },
];

export default variations;
