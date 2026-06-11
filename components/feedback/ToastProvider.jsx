import React from "react";
import { Toast, ToastViewport } from "./Toast.jsx";

const ToastContext = React.createContext(null);

/**
 * Imperative toast API. Must be called under a <ToastProvider>.
 * Returns { toast, dismiss, clear, toasts } where `toast` is callable
 * (toast({ title, ... })) and has tone helpers: toast.success/warning/
 * danger/error/info(title, options?).
 */
export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>.");
  return ctx;
}

/**
 * Drops a ready-to-use toast manager into the tree: holds the toast list,
 * renders a single <ToastViewport> (with limit + default duration), and
 * exposes the imperative API via useToast(). No more hand-managed arrays.
 */
export function ToastProvider({ children, limit = 4, duration = 4500, ...viewportProps }) {
  const [toasts, setToasts] = React.useState([]);
  const idRef = React.useRef(0);

  const dismiss = React.useCallback((id) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);
  const clear = React.useCallback(() => setToasts([]), []);

  const api = React.useMemo(() => {
    const push = (opts) => {
      const id = (idRef.current += 1);
      const next =
        typeof opts === "string" ? { title: opts } : opts && typeof opts === "object" ? opts : {};
      setToasts((s) => [...s, { id, ...next }]);
      return id;
    };
    const withTone = (tone) => (title, options) =>
      push(typeof title === "object" && title !== null ? { tone, ...title } : { tone, title, ...options });

    const toast = (opts) => push(opts);
    toast.success = withTone("success");
    toast.warning = withTone("warning");
    toast.danger = withTone("danger");
    toast.error = withTone("danger");
    toast.info = withTone("info");
    toast.show = withTone("default");
    return { toast, dismiss, clear };
  }, [dismiss, clear]);

  const value = React.useMemo(() => ({ ...api, toasts }), [api, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport limit={limit} {...viewportProps}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            tone={t.tone}
            title={t.title}
            icon={t.icon}
            duration={t.duration != null ? t.duration : duration}
            onClose={() => dismiss(t.id)}
          >
            {t.description != null ? t.description : t.children}
          </Toast>
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}
