import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  computeScaleRiskScores,
  type ScaleRiskAnswers,
} from "@/lib/assessments/scale-risk-scoring";
import {
  writeScaleRiskSubmission,
  type WriteScaleRiskPayload,
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
      answers: ScaleRiskAnswers;
      mobile?: string;
      arrRange?: string;
      stage?: string;
      challenge?: string;
      sector?: string;
    };

    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Missing answers" },
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

    const scores = computeScaleRiskScores(answers);

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const payload: WriteScaleRiskPayload = {
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
      composite: scores.composite,
      growthPct: scores.growthPct,
      capitalPct: scores.capitalPct,
      band: scores.band,
      bucketScores: scores.bucketScores,
      ipAddress,
    };

    const id = await writeScaleRiskSubmission(payload);

    return NextResponse.json(
      {
        success: true,
        id,
        scores,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("portal scale-risk POST:", err);
    return NextResponse.json(
      { error: "Failed to submit scale risk assessment" },
      { status: 500 }
    );
  }
}
