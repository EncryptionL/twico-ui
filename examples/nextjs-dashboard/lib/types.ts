import type { Role } from "./rbac";

/** A user record as shown in the app (no password). */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  department: string;
  status: "active" | "invited" | "suspended";
  joinedAt: string; // YYYY-MM-DD
}

/** The minimal identity stored in the signed session cookie. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
