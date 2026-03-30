"use client";

import { useEffect, useState } from "react";
import type {
  Phase1LeakageSubmission,
  Phase1QualitativeBundle,
  Phase1ScaleRiskSubmission,
} from "@/types/phase1-qualitative";
import { LeakageForm } from "./LeakageForm";
import { ScaleRiskForm } from "./ScaleRiskForm";

type View = "loading" | "both-complete" | "leakage-form" | "scale-risk-form";

export function AssessmentGate() {
  const [view, setView] = useState<View>("loading");
  const [bundle, setBundle] = useState<Phase1QualitativeBundle | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/portal/assessments", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Phase1QualitativeBundle) => {
        if (!mounted) return;
        setBundle(data);
        if (data.leakage && data.scaleRisk) {
          setView("both-complete");
        } else if (!data.leakage) {
          setView("leakage-form");
        } else {
          setView("scale-risk-form");
        }
      })
      .catch(() => {
        if (!mounted) return;
        setView("leakage-form");
      });
    return () => {
      mounted = false;
    };
  }, []);

  function reload() {
    setView("loading");
    fetch("/api/portal/assessments", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Phase1QualitativeBundle) => {
        setBundle(data);
        if (data.leakage && data.scaleRisk) {
          setView("both-complete");
        } else if (!data.leakage) {
          setView("leakage-form");
        } else {
          setView("scale-risk-form");
        }
      })
      .catch(() => {
        setView("leakage-form");
      });
  }

  if (view === "loading") {
    return (
      <div className="profyt-card max-w-lg p-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-wider text-mid">
          Loading assessments…
        </p>
      </div>
    );
  }

  if (view === "both-complete") {
    return (
      <AssessmentSummary
        leakage={bundle!.leakage!}
        scaleRisk={bundle!.scaleRisk!}
      />
    );
  }

  if (view === "leakage-form") {
    return <LeakageForm onComplete={reload} />;
  }

  return <ScaleRiskForm onComplete={reload} />;
}

function AssessmentSummary({
  leakage,
  scaleRisk,
}: {
  leakage: Phase1LeakageSubmission;
  scaleRisk: Phase1ScaleRiskSubmission;
}) {
  return (
    <div className="space-y-8">
      <div className="profyt-card p-8">
        <h2 className="font-serif text-2xl text-black">Leakage Map</h2>
        <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-mid">
          Completed on{" "}
          {leakage.submittedAt
            ? new Date(leakage.submittedAt).toLocaleDateString()
            : "unknown"}
        </p>
        <div className="mt-6 border-t border-pale pt-6">
          <p className="text-sm text-mid">
            <span className="font-medium text-black">Total leakage:</span>{" "}
            {leakage.totalPct}%
          </p>
          <p className="mt-2 text-sm text-mid">
            <span className="font-medium text-black">Verdict:</span>{" "}
            {leakage.verdictTitle}
          </p>
        </div>
      </div>

      <div className="profyt-card p-8">
        <h2 className="font-serif text-2xl text-black">Scale Risk Score</h2>
        <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-mid">
          Completed on{" "}
          {scaleRisk.submittedAt
            ? new Date(scaleRisk.submittedAt).toLocaleDateString()
            : "unknown"}
        </p>
        <div className="mt-6 border-t border-pale pt-6">
          <p className="text-sm text-mid">
            <span className="font-medium text-black">Composite:</span>{" "}
            {scaleRisk.composite}
          </p>
          <p className="mt-2 text-sm text-mid">
            <span className="font-medium text-black">Band:</span> {scaleRisk.band}
          </p>
          <p className="mt-2 text-sm text-mid">
            <span className="font-medium text-black">Growth:</span> {scaleRisk.growthPct}%
            , <span className="font-medium text-black">Capital:</span>{" "}
            {scaleRisk.capitalPct}%
          </p>
        </div>
      </div>
    </div>
  );
}
