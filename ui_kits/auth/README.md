# Auth — UI kit

A self-contained, multi-screen authentication flow built from Twico UI primitives.

- `index.html` — split-screen auth: a branded gradient aside + a form panel that switches between
  **Sign in**, **Sign up**, **Reset password**, and a **success** state (in-memory `screen` state).

Composes `Input` (with password reveal toggle), `Button`, `Checkbox`, `Divider`, and Lucide icons.
Responsive: the aside hides below 860px. No primitives are re-implemented — layout + copy only.
