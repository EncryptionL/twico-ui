"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials } from "./users";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "./session";

// Server Actions that mutate the session (sign in / sign out).

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  const user = verifyCredentials(email, password);
  if (!user) return { error: "Invalid email or password." };

  const token = await signSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // Only allow redirecting back into the app (avoid open-redirects).
  redirect(next.startsWith("/dashboard") ? next : "/dashboard");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
