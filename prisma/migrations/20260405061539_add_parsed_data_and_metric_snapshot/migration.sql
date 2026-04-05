-- AlterTable
ALTER TABLE "ModelSubmission" ADD COLUMN     "parsedAt" TIMESTAMP(3),
ADD COLUMN     "parsedData" JSONB;

-- CreateTable
CREATE TABLE "MetricSnapshot" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "sheetName" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "metricKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "numericValue" DOUBLE PRECISION,
    "textValue" TEXT,
    "period" TEXT,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MetricSnapshot_clientId_templateId_idx" ON "MetricSnapshot"("clientId", "templateId");

-- CreateIndex
CREATE INDEX "MetricSnapshot_metricKey_idx" ON "MetricSnapshot"("metricKey");

-- AddForeignKey
ALTER TABLE "MetricSnapshot" ADD CONSTRAINT "MetricSnapshot_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ModelSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricSnapshot" ADD CONSTRAINT "MetricSnapshot_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
