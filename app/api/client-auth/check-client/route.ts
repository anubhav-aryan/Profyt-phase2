import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/** Public: validate client code before credentials sign-in (step 1 of portal login). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientCode =
      typeof body.clientCode === "string" ? body.clientCode.trim() : "";

    if (!clientCode) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findFirst({
      where: { clientCode, isActive: true },
      select: { companyName: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 404 });
    }

    return NextResponse.json({ companyName: client.companyName });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
