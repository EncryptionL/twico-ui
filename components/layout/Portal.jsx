import { usePortal } from "../_overlay.js";

/** Render `children` into `document.body` (a thin wrapper over usePortal); null on the server. */
export function Portal({ children }) {
  const render = usePortal();
  return render(children);
}
