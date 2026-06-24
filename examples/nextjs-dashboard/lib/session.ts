import { SignJWT, jwtVerify } from "jose";
import type { Role } from "./rbac";
import type { SessionUser } from "./types";

// ---------------------------------------------------------------------------
// Session token (signed JWT in an httpOnly cookie).
//
// `jose` is Edge-runtime compatible, so the same verify runs in middleware
// (Edge) and in Server Components (Node). The secret comes from AUTH_SECRET,
// with a DEV-ONLY fallback so `npm run dev` works with zero setup.
// ---------------------------------------------------------------------------

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "twico-dev-insecure-secret-change-me-0123456789abcdef"
);

export const SESSION_COOKIE = "twico_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || typeof payload.role !== "string") return null;
    return {
      id: payload.sub,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role as Role,
    };
  } catch {
    // Expired, tampered, or malformed token.
    return null;
  }
}
