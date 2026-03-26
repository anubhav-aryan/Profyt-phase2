import { auth } from "@/lib/auth";
import { isSuperAdminEmail } from "@/lib/superadmin";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";

export type SuperAdminResult =
  | { session: Session; error: null }
  | { session: null; error: NextResponse };

export async function requireSuperAdmin(): Promise<SuperAdminResult> {
  const session = await auth();
  const email = session?.user?.email ?? "";

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.user.role !== "analyst") {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  if (!isSuperAdminEmail(email)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, error: null };
}
