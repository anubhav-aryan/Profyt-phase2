import { auth } from "@/lib/auth";
import { isValidTemplateId, MODEL_TEMPLATES } from "@/lib/templates/model-templates";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templateId } = await params;

  if (!isValidTemplateId(templateId)) {
    return NextResponse.json({ error: "Invalid template ID" }, { status: 400 });
  }

  const template = MODEL_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "templates",
    template.filename
  );

  if (!existsSync(filePath)) {
    return NextResponse.json(
      {
        error: `Template file "${template.filename}" is not yet available. Drop it into public/templates/ to enable downloads.`,
      },
      { status: 404 }
    );
  }

  const buffer = await readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${template.filename}"`,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "no-store",
    },
  });
}
