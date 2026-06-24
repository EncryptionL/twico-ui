"use client";

import { ToastProvider } from "twico-ui";

/** App-wide client providers. ToastProvider lets any component call useToast(). */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider limit={4}>{children}</ToastProvider>;
}
