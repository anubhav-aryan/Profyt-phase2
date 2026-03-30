import { auth } from "@/lib/auth";
import { getPhase1QualitativeBundle } from "@/lib/qualitative/phase1-mongo";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  if (!session?.user || session.user.role !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bundle = await getPhase1QualitativeBundle(email);
    return NextResponse.json(bundle);
  } catch (err) {
    console.error("portal assessments GET:", err);
    return NextResponse.json(
      { error: "Failed to load qualitative data" },
      { status: 500 }
    );
  }
}
