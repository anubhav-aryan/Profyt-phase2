import { requireSuperAdmin } from "@/lib/require-superadmin";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; userId: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { session, error } = await requireSuperAdmin();
  if (error || !session) return error!;

  const { id: clientId, userId } = await ctx.params;

  try {
    const body = await request.json();
    const name =
      typeof body.name === "string" ? body.name.trim() : undefined;
    const password =
      typeof body.password === "string" && body.password.length > 0
        ? body.password
        : undefined;
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : undefined;

    if (name === undefined && password === undefined && isActive === undefined) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const existing = await prisma.clientUser.findFirst({
      where: { id: userId, clientId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const passwordHash =
      password !== undefined ? await bcrypt.hash(password, 10) : undefined;

    const user = await prisma.clientUser.update({
      where: { id: userId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(passwordHash !== undefined ? { passwordHash } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (e) {
    console.error("admin client user PATCH:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { session, error } = await requireSuperAdmin();
  if (error || !session) return error!;

  const { id: clientId, userId } = await ctx.params;

  const existing = await prisma.clientUser.findFirst({
    where: { id: userId, clientId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.clientUser.update({
    where: { id: userId },
    data: { isActive: false },
  });

  return NextResponse.json({ ok: true });
}
