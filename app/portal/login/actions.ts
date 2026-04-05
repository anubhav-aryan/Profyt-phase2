"use server";

import { encode } from "@auth/core/jwt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

const SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "development"
    ? "profyt-phase2-dev-secret-min-32-chars"
    : undefined);

const SESSION_COOKIE = "authjs.session-token";
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export type PortalSignInResult =
  | { ok: true }
  | { ok: false; error: "credentials" | "config" };

/**
 * Validates portal client credentials, then manually mints a NextAuth-compatible
 * JWT and sets the session cookie — bypassing the Credentials provider flow
 * which has known issues in NextAuth v5 beta with Server Actions.
 */
export async function portalClientSignIn(
  clientCodeRaw: string,
  emailRaw: string,
  passwordRaw: string,
  callbackUrl: string
): Promise<PortalSignInResult> {
  console.log("[portalClientSignIn] Starting...", { clientCodeRaw, emailRaw });
  
  if (!SECRET) {
    console.error("[portalClientSignIn] AUTH_SECRET is not set");
    return { ok: false, error: "config" };
  }

  const clientCode = clientCodeRaw.trim();
  const email = emailRaw.trim().toLowerCase();
  const password = passwordRaw; // do NOT trim passwords — spaces are valid

  if (!clientCode || !email || !password) {
    console.error("[portalClientSignIn] Missing required fields");
    return { ok: false, error: "credentials" };
  }

  // 1. Find active client
  console.log("[portalClientSignIn] Looking up client:", clientCode);
  const client = await prisma.client.findFirst({
    where: { clientCode: { equals: clientCode, mode: "insensitive" }, isActive: true },
  });
  if (!client) {
    console.error("[portalClientSignIn] Client not found");
    return { ok: false, error: "credentials" };
  }

  // 2. Find active user
  console.log("[portalClientSignIn] Looking up user:", email);
  const clientUser = await prisma.clientUser.findFirst({
    where: { clientId: client.id, email, isActive: true },
  });
  if (!clientUser) {
    console.error("[portalClientSignIn] User not found");
    return { ok: false, error: "credentials" };
  }

  // 3. Verify password
  console.log("[portalClientSignIn] Verifying password...");
  const ok = await compare(password, clientUser.passwordHash);
  if (!ok) {
    console.error("[portalClientSignIn] Password verification failed");
    return { ok: false, error: "credentials" };
  }

  // 4. Build JWT token (same shape as authConfig jwt callback produces)
  console.log("[portalClientSignIn] Building JWT token...");
  const now = Math.floor(Date.now() / 1000);
  const jwtToken = await encode({
    secret: SECRET,
    salt: SESSION_COOKIE,
    maxAge: MAX_AGE,
    token: {
      sub: clientUser.id,
      email: clientUser.email,
      name: clientUser.name || "",
      role: "client",
      clientId: client.id,
      iat: now,
      exp: now + MAX_AGE,
      jti: crypto.randomUUID(),
    },
  });

  // 5. Set session cookie (same name / options NextAuth uses)
  console.log("[portalClientSignIn] Setting session cookie...");
  const isSecure =
    (process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http:").startsWith(
      "https:"
    );
  const jar = await cookies();
  jar.set(SESSION_COOKIE, jwtToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecure,
    maxAge: MAX_AGE,
  });

  console.log("[portalClientSignIn] Success!");
  return { ok: true };
}
