import { BUCKETS, VERDICTS, type LeakageVerdict } from "./leakage-data";

export type LeakageAnswers = Record<string, (number | null)[]>;

const WEIGHTS: Record<string, number> = {
  revenue: 15,
  unit: 25,
  cost: 10,
  cash: 15,
  governance: 10,
  forecast: 15,
  capital: 10,
};

export function getBucketPct(bucketId: string, answers: LeakageAnswers): number {
  const arr = answers[bucketId];
  if (!Array.isArray(arr)) return 0;
  const total = arr.reduce((acc: number, v) => acc + (v ?? 0), 0);
  const maxPossible = arr.length * 4;
  if (maxPossible === 0) return 0;
  return Math.round((total / maxPossible) * 100);
}

export function getTotalPct(answers: LeakageAnswers): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const bucket of BUCKETS) {
    const pct = getBucketPct(bucket.id, answers);
    const weight = WEIGHTS[bucket.id] ?? 0;
    weightedSum += pct * weight;
    totalWeight += weight;
  }
  if (totalWeight === 0) return 0;
  return Math.round(weightedSum / totalWeight);
}

export function getVerdict(totalPct: number): LeakageVerdict | null {
  return VERDICTS.find((v) => totalPct >= v.min && totalPct <= v.max) ?? null;
}

export type LeakageScoreResult = {
  totalPct: number;
  bucketScores: Record<string, number>;
  verdictTitle: string;
};

export function computeLeakageScores(answers: LeakageAnswers): LeakageScoreResult {
  const totalPct = getTotalPct(answers);
  const bucketScores: Record<string, number> = {};
  for (const bucket of BUCKETS) {
    bucketScores[bucket.id] = getBucketPct(bucket.id, answers);
  }
  const verdict = getVerdict(totalPct);
  return {
    totalPct,
    bucketScores,
    verdictTitle: verdict?.title ?? "Unknown",
  };
}
