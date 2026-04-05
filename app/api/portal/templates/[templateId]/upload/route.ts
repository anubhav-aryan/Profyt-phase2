import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidTemplateId } from "@/lib/templates/model-templates";
import { getParser } from "@/lib/parsers";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "client" || !session.user.clientId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templateId } = await params;

  if (!isValidTemplateId(templateId)) {
    return NextResponse.json({ error: "Invalid template ID" }, { status: 400 });
  }

  const clientId = session.user.clientId;
  const userId = session.user.id;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return NextResponse.json(
      { error: "Only .xlsx files are accepted" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds the 10 MB limit" },
      { status: 400 }
    );
  }

  // Save to disk: uploads/{clientId}/{templateId}/{originalName}
  const uploadDir = path.join(UPLOADS_ROOT, clientId, templateId);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Remove old file if one exists for this client+template
  const existing = await prisma.modelSubmission.findUnique({
    where: { clientId_templateId: { clientId, templateId } },
    select: { id: true, filePath: true },
  });
  if (existing) {
    const oldPath = path.join(process.cwd(), existing.filePath);
    try {
      await unlink(oldPath);
    } catch {
      // Old file already gone — continue
    }

    // Delete old metrics
    await prisma.metricSnapshot.deleteMany({
      where: { submissionId: existing.id },
    });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(uploadDir, safeName);
  const relativePath = path.relative(process.cwd(), filePath);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // Parse the Excel file
  const parser = getParser(templateId);
  let parseResult;
  let parseError: string | null = null;

  if (parser) {
    try {
      parseResult = await parser(buffer);
    } catch (error) {
      parseError = error instanceof Error ? error.message : "Unknown parsing error";
      console.error(`Failed to parse ${templateId}:`, error);
    }
  } else {
    parseError = `No parser available for template ${templateId}`;
  }

  // Upsert the submission with parsed data
  const submission = await prisma.modelSubmission.upsert({
    where: { clientId_templateId: { clientId, templateId } },
    update: {
      fileName: file.name,
      filePath: relativePath,
      fileSize: file.size,
      status: parseError ? "error" : "validated",
      uploadedById: userId ?? "",
      parsedData: parseResult ? (parseResult.rawData as Prisma.InputJsonValue) : Prisma.JsonNull,
      parsedAt: parseError ? null : new Date(),
    },
    create: {
      clientId,
      templateId,
      fileName: file.name,
      filePath: relativePath,
      fileSize: file.size,
      status: parseError ? "error" : "validated",
      uploadedById: userId ?? "",
      parsedData: parseResult ? (parseResult.rawData as Prisma.InputJsonValue) : Prisma.JsonNull,
      parsedAt: parseError ? null : new Date(),
    },
  });

  // Insert metrics if parsing succeeded
  if (parseResult && parseResult.metrics.length > 0) {
    await prisma.metricSnapshot.createMany({
      data: parseResult.metrics.map((metric) => ({
        submissionId: submission.id,
        clientId,
        templateId,
        sheetName: metric.sheetName,
        section: metric.section,
        metricKey: metric.metricKey,
        label: metric.label,
        numericValue: metric.numericValue,
        textValue: metric.textValue,
        period: metric.period,
        unit: metric.unit,
      })),
    });
  }

  return NextResponse.json(
    {
      success: true,
      submission: {
        id: submission.id,
        templateId: submission.templateId,
        fileName: submission.fileName,
        fileSize: submission.fileSize,
        status: submission.status,
        uploadedAt: submission.createdAt.toISOString(),
        metricsCount: parseResult?.metrics.length || 0,
        parseError,
      },
    },
    { status: 201 }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "client" || !session.user.clientId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templateId } = await params;

  if (!isValidTemplateId(templateId)) {
    return NextResponse.json({ error: "Invalid template ID" }, { status: 400 });
  }

  const clientId = session.user.clientId;

  const existing = await prisma.modelSubmission.findUnique({
    where: { clientId_templateId: { clientId, templateId } },
    select: { id: true, filePath: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  // Delete file from disk
  const absPath = path.join(process.cwd(), existing.filePath);
  try {
    await unlink(absPath);
  } catch {
    // File already deleted — continue
  }

  await prisma.modelSubmission.delete({ where: { id: existing.id } });

  return NextResponse.json({ success: true });
}
