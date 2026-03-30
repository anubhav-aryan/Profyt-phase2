import { GROWTH_MULT, VERDICTS } from "./scale-risk-data";

export type ScaleRiskAnswers = Record<string, (number | null)[]>;

export type ScaleRiskScoreResult = {
  composite: number;
  growthPct: number;
  capitalPct: number;
  band: string;
  bucketScores: Record<string, number>;
};

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computeScaleRiskScores(answers: ScaleRiskAnswers): ScaleRiskScoreResult {
  const gArray = answers.growth ?? [];
  const cArray = answers.capital ?? [];

  const gScore0 = gArray[0] ?? 0;
  const growthMultIndex = clamp(0, GROWTH_MULT.length - 1, gScore0);
  const growthMult = GROWTH_MULT[growthMultIndex];

  const gTotal = gArray.reduce((acc: number, v) => acc + (v ?? 0), 0);
  const cTotal = cArray.reduce((acc: number, v) => acc + (v ?? 0), 0);

  const growthPct = Math.round((gTotal / 20) * 100);
  const capitalPct = Math.round((cTotal / 20) * 100);

  const composite = clamp(
    0,
    100,
    Math.round(growthPct * growthMult * 0.55 + capitalPct * 0.45)
  );

  const verdict =
    VERDICTS.find((v) => composite >= v.min && composite <= v.max) ??
    VERDICTS[VERDICTS.length - 1];

  return {
    composite,
    growthPct,
    capitalPct,
    band: verdict.band,
    bucketScores: {
      growth: growthPct,
      capital: capitalPct,
    },
  };
}
