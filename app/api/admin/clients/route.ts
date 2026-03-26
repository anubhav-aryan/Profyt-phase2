import { requireSuperAdmin } from "@/lib/require-superadmin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { session, error } = await requireSuperAdmin();
  if (error || !session) return error!;

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true } },
    },
  });

  return NextResponse.json({
    clients: clients.map((c) => ({
      id: c.id,
      clientCode: c.clientCode,
      companyName: c.companyName,
      isActive: c.isActive,
      createdAt: c.createdAt,
      userCount: c._count.users,
    })),
  });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireSuperAdmin();
  if (error || !session) return error!;

  try {
    const body = await request.json();
    const companyName =
      typeof body.companyName === "string" ? body.companyName.trim() : "";
    const clientCode =
      typeof body.clientCode === "string" ? body.clientCode.trim() : "";

    if (!companyName || !clientCode) {
      return NextResponse.json(
        { error: "companyName and clientCode are required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: { companyName, clientCode },
    });

    return NextResponse.json(
      {
        client: {
          id: client.id,
          clientCode: client.clientCode,
          companyName: client.companyName,
          isActive: client.isActive,
          createdAt: client.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Client ID already in use" },
        { status: 409 }
      );
    }
    console.error("admin clients POST:", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
