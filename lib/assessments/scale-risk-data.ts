export interface ScaleRiskAnswer {
  label: string;
  score: number;
}

export interface ScaleRiskQuestion {
  text: string;
  hint: string;
  answers: ScaleRiskAnswer[];
}

export interface ScaleRiskBucket {
  id: string;
  num: string;
  title: string;
  sub: string;
  questions: ScaleRiskQuestion[];
}

export const BUCKETS: ScaleRiskBucket[] = [
  {
    id: "growth",
    num: "01",
    title: "Growth Trajectory",
    sub: "Assess the ambition, engine and margin scalability of your planned growth.",
    questions: [
      {
        text: "What is your target revenue growth over the next 18 months?",
        hint: "Growth rate sets the amplification multiplier — the same capital weakness is far more dangerous at 3× than at 1.3×.",
        answers: [
          { label: "Under 15% — consolidation pace", score: 0 },
          { label: "15–30% — measured, achievable with current base", score: 1 },
          { label: "30–50% — aggressive, requires deliberate prep", score: 2 },
          { label: "50–100% — high-growth, foundations will be tested", score: 3 },
          { label: "100%+ or undefined — hypergrowth or no clear plan", score: 4 },
        ],
      },
      {
        text: "What is the primary engine of your planned growth?",
        hint: "Expansion revenue from existing customers is the most capital-efficient growth. New products carry the highest execution risk.",
        answers: [
          { label: "Expansion from existing customers — retention-led", score: 0 },
          { label: "New customers in proven segments — known CAC and conversion", score: 1 },
          { label: "New geographies or channels — unproven distribution", score: 2 },
          { label: "New customer segments — different buyer, unknown CAC", score: 3 },
          { label: "New products or business model — unproven fit and costs", score: 4 },
        ],
      },
      {
        text: "How has your gross margin trended as revenue grew over the last 4 quarters?",
        hint: "Margin direction under growth is the clearest signal of whether your cost structure is built to scale.",
        answers: [
          { label: "Improving — margin expands with volume", score: 0 },
          { label: "Stable — holding within ±2%", score: 1 },
          { label: "Compressing slightly — 3–5% decline", score: 2 },
          { label: "Compressing materially — more than 5% decline", score: 3 },
          { label: "Not tracked or unknown — no margin trend visibility", score: 4 },
        ],
      },
      {
        text: "At 2× your current revenue, what do you expect to happen to gross margin?",
        hint: "Management's own view on margin scalability is one of the most important forward indicators of scale readiness.",
        answers: [
          { label: "Will improve — operating leverage is structural and identifiable", score: 0 },
          { label: "Will hold — costs and revenue scale proportionally", score: 1 },
          { label: "Will compress slightly — understood and planned for", score: 2 },
          { label: "Will compress materially — no clear mitigation in place", score: 3 },
          { label: "Unknown — no forward model or scenario plan exists", score: 4 },
        ],
      },
      {
        text: "What is the primary characteristic of your revenue model?",
        hint: "Recurring revenue compounds. One-time or services revenue resets each period — growth requires constant new sales.",
        answers: [
          { label: "Recurring / subscription — fully contracted ARR", score: 0 },
          { label: "Transactional with strong retention — high repeat rate", score: 1 },
          { label: "Transactional with moderate retention — mixed repeat", score: 2 },
          { label: "Project or milestone-based — lumpy, pipeline-dependent", score: 3 },
          { label: "One-time or services — revenue resets each period", score: 4 },
        ],
      },
    ],
  },
  {
    id: "capital",
    num: "02",
    title: "Capital & Runway Efficiency",
    sub: "Assess whether the growth plan is financially viable and capital-efficient.",
    questions: [
      {
        text: "What is your current burn multiple? (Net cash burn ÷ net new ARR added in the period)",
        hint: "Burn multiple is the most honest single measure of capital efficiency. Above 2.5×, growth is consuming more than it creates.",
        answers: [
          { label: "Below 1× — generating more ARR than cash burned", score: 0 },
          { label: "1–1.5× — within healthy range for current stage", score: 1 },
          { label: "1.5–2.5× — elevated, warrants close monitoring", score: 2 },
          { label: "2.5–4× — capital-intensive, burning more than value added", score: 3 },
          { label: "Above 4× or not calculated — critical inefficiency", score: 4 },
        ],
      },
      {
        text: "At your planned growth rate, how many months of runway do you currently have?",
        hint: "Runway under the growth scenario — not base case — is the relevant number. Most businesses underestimate growth-adjusted burn.",
        answers: [
          { label: "24 months or more — fully funded for the growth cycle", score: 0 },
          { label: "18–24 months — comfortable, time to execute before next raise", score: 1 },
          { label: "12–18 months — adequate but fundraise must run in parallel", score: 2 },
          { label: "6–12 months — constrained, execution and raise are racing", score: 3 },
          { label: "Under 6 months or requires immediate raise", score: 4 },
        ],
      },
      {
        text: "How is the growth plan funded?",
        hint: "Growth contingent on an equity raise carries execution and market risk that operational plans do not.",
        answers: [
          { label: "Fully from operating cash flows — self-funded growth", score: 0 },
          { label: "Existing cash covers the full plan — capital is secured", score: 1 },
          { label: "Partially funded — requires debt within 18 months", score: 2 },
          { label: "Requires equity raise within 12 months — dual execution risk", score: 3 },
          { label: "Requires equity raise within 6 months or funding is unclear", score: 4 },
        ],
      },
      {
        text: "How much additional working capital does each ₹1 Cr of new revenue require?",
        hint: "Working capital drag is often invisible until it becomes a crisis. High-intensity businesses fund their growth before collecting it.",
        answers: [
          { label: "Negative or zero — collect before delivering", score: 0 },
          { label: "Under ₹8L — very low working capital intensity", score: 1 },
          { label: "₹8–20L — moderate, manageable with good forecasting", score: 2 },
          { label: "₹20–40L — high intensity, significant pre-financing", score: 3 },
          { label: "Above ₹40L or unknown — every rupee of growth is heavy", score: 4 },
        ],
      },
      {
        text: "What is your CAC payback period and how do you expect it to change at scale?",
        hint: "If CAC payback is extending as you grow, acquisition is becoming less efficient — a compounding problem at high growth rates.",
        answers: [
          { label: "Under 6 months and improving or stable", score: 0 },
          { label: "6–12 months and stable — healthy range", score: 1 },
          { label: "12–18 months or extending slightly — warrants attention", score: 2 },
          { label: "18–24 months or extending materially", score: 3 },
          { label: "Above 24 months, deteriorating, or not measured", score: 4 },
        ],
      },
    ],
  },
];

export const GROWTH_MULT = [0.7, 0.9, 1.1, 1.3, 1.5];

export interface ScaleRiskVerdict {
  min: number;
  max: number;
  band: string;
  color: number;
  title: string;
  body: string;
}

export const VERDICTS: ScaleRiskVerdict[] = [
  {
    min: 0,
    max: 25,
    band: "Scale-Ready",
    color: 0,
    title: "Financial foundations support the growth ambition.",
    body: "The combination of growth trajectory and capital efficiency indicates the business can absorb the planned growth rate without structural breakdown. Maintain discipline and monitor amplification signals quarterly.",
  },
  {
    min: 26,
    max: 45,
    band: "Conditional",
    color: 1,
    title: "Specific constraints must be resolved before scaling.",
    body: "The growth plan is viable but specific financial constraints will compound under pressure. Targeted interventions now prevent structural problems at the point of acceleration.",
  },
  {
    min: 46,
    max: 65,
    band: "High Risk",
    color: 2,
    title: "Scaling at the planned rate will amplify existing problems.",
    body: "The combination of growth ambition and capital position creates compounding risk across multiple dimensions. Proceeding without intervention will accelerate value destruction.",
  },
  {
    min: 66,
    max: 100,
    band: "Not Scale-Ready",
    color: 3,
    title: "The financial structure cannot safely support this growth plan.",
    body: "Pursuing growth at this pace without resolving the identified constraints will amplify risk faster than value is created. Fix fundamentals before accelerating.",
  },
];

export interface AmpBucket {
  id: string;
  title: string;
  amp: number;
  weight: number;
  consequence: string;
}

export const AMP_BUCKETS: AmpBucket[] = [
  {
    id: "unit",
    title: "Unit Economics",
    amp: 1.4,
    weight: 25,
    consequence:
      "Thin contribution margins compress further under volume — every unit of growth consumes more capital than it creates.",
  },
  {
    id: "cash",
    title: "Cash Conversion",
    amp: 1.3,
    weight: 15,
    consequence:
      "Working capital traps grow faster than revenue — each rupee of growth requires disproportionate pre-financing.",
  },
  {
    id: "revenue",
    title: "Revenue Quality",
    amp: 1.2,
    weight: 15,
    consequence:
      "Customer concentration and discounting habits become structural margin problems — a single departure can trigger a material shortfall.",
  },
  {
    id: "cost",
    title: "Cost Architecture",
    amp: 1.1,
    weight: 10,
    consequence:
      "Fixed cost rigidity becomes visible as revenue scales — overhead grows ahead of revenue, compressing operating leverage.",
  },
  {
    id: "forecast",
    title: "Forecast Integrity",
    amp: 1.1,
    weight: 15,
    consequence:
      "Planning failures compound under growth pressure — every missed forecast delays hiring, investment and fundraising decisions.",
  },
  {
    id: "governance",
    title: "Decision Governance",
    amp: 1.0,
    weight: 10,
    consequence:
      "Decision bottlenecks slow execution — founder dependency and weak controls become operational ceilings.",
  },
  {
    id: "capital",
    title: "Capital Allocation",
    amp: 1.0,
    weight: 10,
    consequence:
      "Poor investment discipline amplifies at scale — committed capital to low-return initiatives crowds out growth investment.",
  },
];

export type Answers = Record<string, (number | null)[]>;

export function getBucketPct(bucketId: string, answers: Answers): number {
  const b = BUCKETS.find((x) => x.id === bucketId);
  if (!b) return 0;
  const total =
    answers[bucketId]?.reduce((a: number, v) => a + (v ?? 0), 0) ?? 0;
  const max = b.questions.length * 4;
  return max ? Math.round((total / max) * 100) : 0;
}

export interface ComputeScoreResult {
  composite: number;
  growthPct: number;
  capitalPct: number;
  growthMult: number;
  growthScore: number;
}

export function computeScore(answers: Answers): ComputeScoreResult {
  const growthScore = answers["growth"]?.[0] ?? 0;
  const growthMult = GROWTH_MULT[Math.min(growthScore, 4)] ?? 1.0;

  const gTotal = (answers["growth"] ?? []).reduce((a: number, v) => a + (v ?? 0), 0);
  const growthPct = Math.round(
    (gTotal / (BUCKETS[0].questions.length * 4)) * 100
  );

  const cTotal = (answers["capital"] ?? []).reduce((a: number, v) => a + (v ?? 0), 0);
  const capitalPct = Math.round(
    (cTotal / (BUCKETS[1].questions.length * 4)) * 100
  );

  const composite = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (growthPct * growthMult) * 0.55 + capitalPct * 0.45
      )
    )
  );

  return {
    composite,
    growthPct,
    capitalPct,
    growthMult,
    growthScore,
  };
}

export interface AmpDataItem extends AmpBucket {
  orig: number;
  amplified: number;
  delta: number;
}

export function buildAmpData(
  answers: Answers,
  growthMult: number
): AmpDataItem[] {
  const proxyScores: Record<string, number> = {
    unit:
      ((answers["growth"]?.[2] ?? 0) * 1.2 + (answers["growth"]?.[3] ?? 0) * 0.8) /
      2,
    cash:
      ((answers["capital"]?.[3] ?? 0) * 1.0 + (answers["capital"]?.[1] ?? 0) * 0.8) /
      2,
    revenue:
      ((answers["growth"]?.[1] ?? 0) * 1.0 + (answers["growth"]?.[4] ?? 0) * 0.8) /
      2,
    cost:
      ((answers["growth"]?.[2] ?? 0) * 0.8 + (answers["capital"]?.[0] ?? 0) * 0.6) /
      2,
    forecast:
      ((answers["growth"]?.[3] ?? 0) * 0.9 + (answers["capital"]?.[1] ?? 0) * 0.5) /
      2,
    governance:
      ((answers["growth"]?.[1] ?? 0) * 0.7 + (answers["capital"]?.[0] ?? 0) * 0.5) /
      2,
    capital:
      ((answers["capital"]?.[0] ?? 0) * 1.0 + (answers["capital"]?.[2] ?? 0) * 0.7) /
      2,
  };

  return AMP_BUCKETS.map((b) => {
    const origRaw = proxyScores[b.id] ?? 0;
    const orig = Math.round((origRaw / 4) * 100);
    const amplified = Math.min(
      100,
      Math.round(orig * b.amp * growthMult)
    );
    return { ...b, orig, amplified, delta: amplified - orig };
  }).sort((a, b) => b.delta - a.delta);
}

export function getVerdict(composite: number): ScaleRiskVerdict {
  return (
    VERDICTS.find((v) => composite >= v.min && composite <= v.max) ??
    VERDICTS[0]
  );
}

