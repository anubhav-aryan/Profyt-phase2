import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MODEL_TEMPLATES } from "@/lib/templates/model-templates";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "client" || !session.user.clientId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = session.user.clientId;

  const submissions = await prisma.modelSubmission.findMany({
    where: { clientId },
    select: {
      id: true,
      templateId: true,
      fileName: true,
      fileSize: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const submissionMap = new Map(submissions.map((s) => [s.templateId, s]));

  const templates = MODEL_TEMPLATES.map((t) => {
    const sub = submissionMap.get(t.id);
    return {
      id: t.id,
      name: t.name,
      filename: t.filename,
      description: t.description,
      hint: t.hint,
      downloadUrl: `/templates/${t.filename}`,
      submission: sub
        ? {
            id: sub.id,
            fileName: sub.fileName,
            fileSize: sub.fileSize,
            status: sub.status,
            uploadedAt: sub.createdAt.toISOString(),
            updatedAt: sub.updatedAt.toISOString(),
          }
        : null,
    };
  });

  return NextResponse.json({ templates });
}
