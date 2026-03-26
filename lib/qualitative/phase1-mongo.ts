import type { Db, Document } from "mongodb";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongo";
import {
  LEAKAGE_SUBMISSIONS_COLLECTION,
  SCALE_RISK_SUBMISSIONS_COLLECTION,
} from "@/lib/mongodb/collections";
import type {
  Phase1LeakageSubmission,
  Phase1QualitativeBundle,
  Phase1ScaleRiskSubmission,
} from "@/types/phase1-qualitative";

const emailCollation = { locale: "en", strength: 2 } as const;

function asIso(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString();
  return null;
}

function idString(id: unknown): string {
  if (id instanceof ObjectId) return id.toHexString();
  if (typeof id === "string") return id;
  return "";
}

function serializeLeakage(raw: Document & { _id?: unknown }): Phase1LeakageSubmission {
  const rest = { ...(raw as Record<string, unknown>) };
  const _id = rest._id;
  delete rest._id;
  delete rest.__v;
  return {
    ...rest,
    id: idString(_id),
    founderName: String(rest.founderName ?? ""),
    companyName: String(rest.companyName ?? ""),
    email: String(rest.email ?? ""),
    mobile: String(rest.mobile ?? ""),
    arrRange: String(rest.arrRange ?? ""),
    stage: String(rest.stage ?? ""),
    challenge: String(rest.challenge ?? ""),
    consent: Boolean(rest.consent),
    sector: String(rest.sector ?? ""),
    answers: rest.answers,
    notes: rest.notes,
    totalPct: typeof rest.totalPct === "number" ? rest.totalPct : Number(rest.totalPct),
    verdictTitle: String(rest.verdictTitle ?? ""),
    bucketScores: rest.bucketScores,
    patternsDetected: Array.isArray(rest.patternsDetected)
      ? (rest.patternsDetected as string[])
      : [],
    criticalRiskCount:
      typeof rest.criticalRiskCount === "number"
        ? rest.criticalRiskCount
        : Number(rest.criticalRiskCount) || 0,
    executiveSummary: String(rest.executiveSummary ?? ""),
    submittedAt: asIso(rest.submittedAt),
    ipAddress: String(rest.ipAddress ?? ""),
    createdAt: asIso(rest.createdAt),
    updatedAt: asIso(rest.updatedAt),
  } as Phase1LeakageSubmission;
}

function serializeScaleRisk(
  raw: Document & { _id?: unknown }
): Phase1ScaleRiskSubmission {
  const rest = { ...(raw as Record<string, unknown>) };
  const _id = rest._id;
  delete rest._id;
  delete rest.__v;
  return {
    ...rest,
    id: idString(_id),
    founderName: String(rest.founderName ?? ""),
    companyName: String(rest.companyName ?? ""),
    email: String(rest.email ?? ""),
    mobile: String(rest.mobile ?? ""),
    arrRange: String(rest.arrRange ?? ""),
    stage: String(rest.stage ?? ""),
    challenge: String(rest.challenge ?? ""),
    consent: Boolean(rest.consent),
    sector: String(rest.sector ?? ""),
    answers: rest.answers,
    composite: typeof rest.composite === "number" ? rest.composite : Number(rest.composite),
    growthPct: typeof rest.growthPct === "number" ? rest.growthPct : Number(rest.growthPct),
    capitalPct: typeof rest.capitalPct === "number" ? rest.capitalPct : Number(rest.capitalPct),
    band: String(rest.band ?? ""),
    bucketScores: rest.bucketScores,
    submittedAt: asIso(rest.submittedAt),
    ipAddress: String(rest.ipAddress ?? ""),
    createdAt: asIso(rest.createdAt),
    updatedAt: asIso(rest.updatedAt),
  } as Phase1ScaleRiskSubmission;
}

export async function getLatestLeakageSubmissionByEmail(
  db: Db,
  email: string
): Promise<Phase1LeakageSubmission | null> {
  const normalized = email.trim();
  if (!normalized) return null;

  const raw = await db.collection(LEAKAGE_SUBMISSIONS_COLLECTION).findOne(
    { email: normalized },
    {
      sort: { submittedAt: -1 },
      collation: emailCollation,
    }
  );

  if (!raw) return null;
  return serializeLeakage(raw);
}

export async function getLatestScaleRiskSubmissionByEmail(
  db: Db,
  email: string
): Promise<Phase1ScaleRiskSubmission | null> {
  const normalized = email.trim();
  if (!normalized) return null;

  const raw = await db.collection(SCALE_RISK_SUBMISSIONS_COLLECTION).findOne(
    { email: normalized },
    {
      sort: { submittedAt: -1 },
      collation: emailCollation,
    }
  );

  if (!raw) return null;
  return serializeScaleRisk(raw);
}

/** Latest Leakage Map + latest Scale Risk for one participant email (each may be null). */
export async function getPhase1QualitativeBundle(
  email: string
): Promise<Phase1QualitativeBundle> {
  const db = await getMongoDb();
  const trimmed = email.trim();
  const key = trimmed.toLowerCase();

  const [leakage, scaleRisk] = await Promise.all([
    getLatestLeakageSubmissionByEmail(db, trimmed),
    getLatestScaleRiskSubmissionByEmail(db, trimmed),
  ]);

  return {
    email: key,
    leakage,
    scaleRisk,
  };
}
