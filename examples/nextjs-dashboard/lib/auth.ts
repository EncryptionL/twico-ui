import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "./session";
import { can, type Permission } from "./rbac";
import type { SessionUser } from "./types";

// ---------------------------------------------------------------------------
// Server-side auth helpers for Server Components / Server Actions.
// (Authentication = who you are; authorization = what you may do.)
// ---------------------------------------------------------------------------

/** The current user, or null if not signed in. Never throws. */
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Require a signed-in user, or redirect to /login. (Authentication gate.) */
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * Require a specific permission, or redirect to /forbidden.
 * (Authorization gate — call at the top of a protected page/action.)
 */
export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const session = await requireSession();
  if (!can(session.role, permission)) redirect("/forbidden");
  return session;
}
