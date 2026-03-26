-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "AppMeta" (
    "key" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "AppMeta_pkey" PRIMARY KEY ("key")
);

