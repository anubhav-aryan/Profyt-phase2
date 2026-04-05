"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type {
  Phase1LeakageSubmission,
  Phase1QualitativeBundle,
  Phase1ScaleRiskSubmission,
} from "@/types/phase1-qualitative";

export function AssessmentGate() {
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<Phase1QualitativeBundle | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/portal/assessments", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Phase1QualitativeBundle) => {
        if (!mounted) return;
        setBundle(data);
      })
      .catch(() => {
        if (!mounted) return;
        setBundle({ email: "", leakage: null, scaleRisk: null });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="profyt-card max-w-lg p-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-wider text-mid">
          Loading assessments…
        </p>
      </div>
    );
  }

  const leakage = bundle?.leakage ?? null;
  const scaleRisk = bundle?.scaleRisk ?? null;
  const anyIncomplete = !leakage || !scaleRisk;

  return (
    <div className="space-y-8">
      {anyIncomplete ? (
        <p className="max-w-2xl text-sm leading-relaxed text-mid">
          Some qualitative assessments are not yet filled by you. When you are
          ready, open an assessment below to complete it in full.
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <AssessmentCard
          title="Leakage Map"
          description="Seven buckets covering revenue quality, unit economics, cost architecture, and more."
          complete={!!leakage}
          href="/portal/assessments/leakage"
          ctaLabel="Start Leakage Map"
        >
          {leakage ? <LeakageSummarySnippet data={leakage} /> : null}
        </AssessmentCard>

        <AssessmentCard
          title="Scale Risk Score"
          description="Growth and capital risk signals aligned with the Phase 1 methodology."
          complete={!!scaleRisk}
          href="/portal/assessments/scale-risk"
          ctaLabel="Start Scale Risk"
        >
          {scaleRisk ? <ScaleRiskSummarySnippet data={scaleRisk} /> : null}
        </AssessmentCard>
      </div>
    </div>
  );
}

function AssessmentCard({
  title,
  description,
  complete,
  href,
  ctaLabel,
  children,
}: {
  title: string;
  description: string;
  complete: boolean;
  href: string;
  ctaLabel: string;
  children?: ReactNode;
}) {
  if (complete) {
    return (
      <div className="profyt-card flex h-full flex-col p-6 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl text-black">{title}</h2>
          <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-dark">
            Completed
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-mid">{description}</p>
        <div className="mt-6 border-t border-pale pt-6">{children}</div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="profyt-card group flex h-full flex-col justify-between gap-4 p-6 transition-colors hover:border-black md:p-8"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl text-black">{title}</h2>
          <span className="mt-1 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-wider text-light group-hover:text-black">
            →
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-mid">{description}</p>
        <p className="mt-4 border border-pale bg-off px-3 py-2 text-xs text-dark">
          Not yet completed — click this card to fill in the assessment.
        </p>
      </div>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-black underline underline-offset-4">
        {ctaLabel}
      </span>
    </Link>
  );
}

function LeakageSummarySnippet({ data }: { data: Phase1LeakageSubmission }) {
  return (
    <div className="space-y-2 text-sm text-mid">
      <p>
        <span className="font-medium text-black">Submitted:</span>{" "}
        {data.submittedAt
          ? new Date(data.submittedAt).toLocaleDateString()
          : "—"}
      </p>
      <p>
        <span className="font-medium text-black">Total leakage:</span>{" "}
        {data.totalPct}%
      </p>
      <p>
        <span className="font-medium text-black">Verdict:</span>{" "}
        {data.verdictTitle}
      </p>
    </div>
  );
}

function ScaleRiskSummarySnippet({ data }: { data: Phase1ScaleRiskSubmission }) {
  return (
    <div className="space-y-2 text-sm text-mid">
      <p>
        <span className="font-medium text-black">Submitted:</span>{" "}
        {data.submittedAt
          ? new Date(data.submittedAt).toLocaleDateString()
          : "—"}
      </p>
      <p>
        <span className="font-medium text-black">Composite:</span> {data.composite}{" "}
        · <span className="font-medium text-black">Band:</span> {data.band}
      </p>
      <p>
        <span className="font-medium text-black">Growth:</span> {data.growthPct}%
        , <span className="font-medium text-black">Capital:</span>{" "}
        {data.capitalPct}%
      </p>
    </div>
  );
}
