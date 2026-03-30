import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  computeLeakageScores,
  type LeakageAnswers,
} from "@/lib/assessments/leakage-scoring";
import {
  writeLeakageSubmission,
  type WriteLeakagePayload,
} from "@/lib/qualitative/phase1-mongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const clientId = session?.user?.clientId;

  if (!session?.user || session.user.role !== "client" || !clientId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      answers: LeakageAnswers;
      notes: Record<string, string>;
      mobile?: string;
      arrRange?: string;
      stage?: string;
      challenge?: string;
      sector?: string;
    };

    const { answers, notes } = body;

    if (!answers || typeof answers !== "object" || !notes || typeof notes !== "object") {
      return NextResponse.json(
        { error: "Missing answers or notes" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { companyName: true },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const scores = computeLeakageScores(answers);

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const payload: WriteLeakagePayload = {
      founderName: session.user.name || "Unknown",
      companyName: client.companyName,
      email,
      mobile: body.mobile ?? "",
      arrRange: body.arrRange ?? "",
      stage: body.stage ?? "",
      challenge: body.challenge ?? "",
      consent: true,
      sector: body.sector ?? "",
      answers,
      notes,
      totalPct: scores.totalPct,
      verdictTitle: scores.verdictTitle,
      bucketScores: scores.bucketScores,
      patternsDetected: [],
      criticalRiskCount: 0,
      executiveSummary: "",
      ipAddress,
    };

    const id = await writeLeakageSubmission(payload);

    return NextResponse.json(
      {
        success: true,
        id,
        scores,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("portal leakage POST:", err);
    return NextResponse.json(
      { error: "Failed to submit leakage assessment" },
      { status: 500 }
    );
  }
}
