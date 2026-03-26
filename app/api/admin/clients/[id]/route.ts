import { requireSuperAdmin } from "@/lib/require-superadmin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: Ctx) {
  const { session, error } = await requireSuperAdmin();
  if (error || !session) return error!;

  const { id } = await ctx.params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ client });
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { session, error } = await requireSuperAdmin();
  if (error || !session) return error!;

  const { id } = await ctx.params;

  try {
    const body = await request.json();
    const companyName =
      typeof body.companyName === "string"
        ? body.companyName.trim()
        : undefined;
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : undefined;

    if (companyName === undefined && isActive === undefined) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        ...(companyName !== undefined ? { companyName } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    return NextResponse.json({ client });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("admin clients PATCH:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
