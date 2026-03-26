/**
 * Phase 1 Mongoose models: LeakageSubmission, ScaleRiskSubmission (no custom `collection` option).
 * Default lowercase pluralized collection names per Mongoose — confirm in Atlas if you ever add custom names.
 *
 * Override via env if your cluster used different names.
 */
export const LEAKAGE_SUBMISSIONS_COLLECTION =
  process.env.MONGODB_LEAKAGE_COLLECTION ?? "leakagesubmissions";

export const SCALE_RISK_SUBMISSIONS_COLLECTION =
  process.env.MONGODB_SCALERISK_COLLECTION ?? "scalerisksubmissions";
