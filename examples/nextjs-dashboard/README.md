# Twico UI — Next.js dashboard (auth + RBAC)

An admin dashboard built with **[Twico UI](https://www.npmjs.com/package/twico-ui)** on
**Next.js 15 (App Router)** + **React 19** + **TypeScript**. It shows the library used across a real
app — layout, data display, inputs, overlays, and feedback — together with **authentication** and
**role-based authorization** enforced on the server.

```bash
cd examples/nextjs-dashboard
npm install
npm run dev      # http://localhost:3000
```

No environment variables are required to run the demo (a dev-only session secret is built in).
Copy `.env.example` to `.env` and set `AUTH_SECRET` for anything beyond local play.

## Demo accounts

All three use the password **`demo1234`**. Sign in as each to see the UI, navigation, and
permissions change.

| Email | Role | Can do |
| --- | --- | --- |
| `admin@twico.dev` | **Admin** | Everything — including Users (manage roles) and Settings. |
| `manager@twico.dev` | **Manager** | Overview, Reports, Team (+ manage), Settings, Profile. |
| `member@twico.dev` | **Member** | Overview, Team (view), Profile. |

## What it demonstrates

**Twico UI in full** — every area of the library:

- **Layout / typography:** `Sidebar`, `Grid`, `Stack`, `Divider`, `Heading`, `Text`, `Card`
- **Data display:** `Datatable` (users, with inline role editing), `Table` (sortable), `Chart`
  (bar + line), `Stat`, `Timeline`, `Avatar`, `AvatarMenu`, `Badge`, `Tag`, `Progress`
- **Inputs:** `Input`, `Textarea`, `Select`, `Switch`, `Button`, `IconButton`
- **Navigation / overlay / feedback:** `Tabs`, `Dialog`, `Tooltip`, `Alert`, `EmptyState`,
  `ToastProvider` + `useToast`
- **Theming:** dark mode via `useColorScheme`, plus a live **density** + **RTL** preview on the
  Settings page — all from design tokens, no extra CSS.

**Authentication (authn)** — *who you are*:

- Sign-in is a **Server Action** ([`lib/auth-actions.ts`](lib/auth-actions.ts)) that verifies
  credentials and issues a **signed JWT** ([`jose`](https://github.com/panva/jose)) stored in an
  **httpOnly cookie** ([`lib/session.ts`](lib/session.ts)).
- **Edge middleware** ([`middleware.ts`](middleware.ts)) verifies the session on every
  `/dashboard/*` request and bounces anonymous users to `/login` (with a `next` return path).

**Authorization (authz) — RBAC** — *what you may do*:

- One source of truth ([`lib/rbac.ts`](lib/rbac.ts)): `Role`s map to `Permission`s, checked by
  `can(role, permission)`.
- Enforced in **three** layers, defense-in-depth:
  1. **Middleware** — coarse gate (must be signed in).
  2. **Per-page guard** — every protected page calls `requirePermission(...)`
     ([`lib/auth.ts`](lib/auth.ts)) and redirects to `/forbidden` if the role lacks it. *This is the
     security boundary.*
  3. **UI** — the sidebar only shows links the role may use, and action buttons (invite, edit role)
     are hidden without the permission. *This is UX, not security.*

> Hiding a button never protects a route — the server guard does. Try navigating a Member straight
> to `/dashboard/users`: the page redirects to `/forbidden` even though the link is hidden.

## Role → permission matrix

| Permission | Admin | Manager | Member |
| --- | :-: | :-: | :-: |
| `dashboard:view` | ✓ | ✓ | ✓ |
| `team:view` | ✓ | ✓ | ✓ |
| `profile:edit` | ✓ | ✓ | ✓ |
| `reports:view` | ✓ | ✓ | — |
| `team:manage` | ✓ | ✓ | — |
| `settings:manage` | ✓ | ✓ | — |
| `users:view` / `users:manage` | ✓ | — | — |
| `billing:view` | ✓ | — | — |

## Project structure

```
app/
  layout.tsx              root: imports twico-ui/styles.css, theme script, ToastProvider
  page.tsx                "/" → redirect to /dashboard
  login/page.tsx          public sign-in
  forbidden/page.tsx      403 (where requirePermission sends you)
  not-found.tsx           404
  dashboard/
    layout.tsx            requireSession() + role-filtered nav → <DashboardShell>
    page.tsx              Overview (Stat, Chart, Timeline, live RBAC panel)
    reports/page.tsx      Tabs of Chart + Table  (reports:view)
    team/page.tsx         member cards            (team:view, manage gated)
    users/page.tsx        Datatable + role editor (users:view / users:manage)
    settings/page.tsx     Tabs of forms           (settings:manage)
    profile/page.tsx      profile form            (profile:edit)
components/               DashboardShell, LoginForm, UsersTable, SettingsForm, ProfileForm, icons …
lib/                      rbac · session · auth · auth-actions · users · nav · types
middleware.ts            edge session gate
```

## Notes & going to production

This is a **demo**. To make it real:

- Replace [`lib/users.ts`](lib/users.ts) (in-memory, plaintext passwords) with a database and
  hashed passwords (argon2/bcrypt). Or drop in **Auth.js / NextAuth** for the authn half — the RBAC
  layer (`lib/rbac.ts` + `requirePermission`) stays the same.
- Set a strong `AUTH_SECRET` and serve over HTTPS (the cookie is already `httpOnly` + `sameSite=lax`
  and `secure` in production).
- The data mutations (invite, edit role, save settings) are client-side only here — wire them to
  real Server Actions / your API.
