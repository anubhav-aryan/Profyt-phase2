import { auth } from "@/lib/auth";
import { isAuthBypassEmail } from "@/lib/auth-bypass";
import { getPhase1QualitativeBundle } from "@/lib/qualitative/phase1-mongo";
import { NextRequest, NextResponse } from "next/server";

/**
 * Latest Phase 1 qualitative assessments (MongoDB) for one email.
 *
 * Authorization:
 * - Regular users: always their own session email only (query `email` is ignored).
 * - `AUTH_BYPASS_EMAILS`: may pass `?email=` to load any participant (analyst workflow).
 * Replace with Neon-backed roles when the platform has an engagement model.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const sessionEmail = session?.user?.email?.trim().toLowerCase() ?? "";

  if (!session?.user || !sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "client") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const requestedRaw = searchParams.get("email")?.trim() ?? "";
  const requested = requestedRaw.toLowerCase();

  let targetEmail: string;

  if (isAuthBypassEmail(sessionEmail)) {
    targetEmail = requested || sessionEmail;
  } else {
    targetEmail = sessionEmail;
  }

  if (!targetEmail) {
    return NextResponse.json(
      { error: "Missing email (or sign in again)" },
      { status: 400 }
    );
  }

  try {
    const bundle = await getPhase1QualitativeBundle(targetEmail);
    return NextResponse.json(bundle);
  } catch (err) {
    console.error("qualitative phase1 fetch:", err);
    return NextResponse.json(
      { error: "Failed to load qualitative history" },
      { status: 500 }
    );
  }
}
