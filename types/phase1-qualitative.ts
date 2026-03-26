/**
 * Phase 1 MongoDB qualitative assessments (Leakage Map + Scale Risk).
 * `answers`, `notes`, and `bucketScores` stay flexible until the scoring engine pins shapes.
 */

export type Phase1Mixed = unknown;

export type Phase1LeakageSubmission = {
  id: string;
  founderName: string;
  companyName: string;
  email: string;
  mobile: string;
  arrRange: string;
  stage: string;
  challenge: string;
  consent: boolean;
  sector: string;
  answers: Phase1Mixed;
  notes: Phase1Mixed;
  totalPct: number;
  verdictTitle: string;
  bucketScores: Phase1Mixed;
  patternsDetected: string[];
  criticalRiskCount: number;
  executiveSummary: string;
  submittedAt: string | null;
  ipAddress: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Phase1ScaleRiskSubmission = {
  id: string;
  founderName: string;
  companyName: string;
  email: string;
  mobile: string;
  arrRange: string;
  stage: string;
  challenge: string;
  consent: boolean;
  sector: string;
  answers: Phase1Mixed;
  composite: number;
  growthPct: number;
  capitalPct: number;
  band: string;
  bucketScores: Phase1Mixed;
  submittedAt: string | null;
  ipAddress: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Phase1QualitativeBundle = {
  email: string;
  leakage: Phase1LeakageSubmission | null;
  scaleRisk: Phase1ScaleRiskSubmission | null;
};
