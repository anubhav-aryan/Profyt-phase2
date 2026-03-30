"use client";

import { useState } from "react";
import { BUCKETS } from "@/lib/assessments/scale-risk-data";
import type { ScaleRiskAnswers } from "@/lib/assessments/scale-risk-scoring";

type Props = {
  onComplete: () => void;
};

export function ScaleRiskForm({ onComplete }: Props) {
  const [bucketIdx, setBucketIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<ScaleRiskAnswers>(
    () =>
      Object.fromEntries(
        BUCKETS.map((b) => [b.id, new Array(b.questions.length).fill(null)])
      ) as ScaleRiskAnswers
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentBucket = BUCKETS[bucketIdx];
  const currentQuestion = currentBucket.questions[questionIdx];
  const currentAnswer = answers[currentBucket.id]?.[questionIdx] ?? null;

  const isLastQuestionInBucket = questionIdx === currentBucket.questions.length - 1;
  const isLastBucket = bucketIdx === BUCKETS.length - 1;

  function selectAnswer(score: number) {
    setAnswers((prev) => {
      const bucketId = currentBucket.id;
      const arr = [...(prev[bucketId] ?? [])];
      arr[questionIdx] = score;
      return { ...prev, [bucketId]: arr };
    });
  }

  function handleNext() {
    if (currentAnswer === null) return;

    if (isLastQuestionInBucket && isLastBucket) {
      void submitAssessment();
    } else if (isLastQuestionInBucket) {
      setBucketIdx((i) => i + 1);
      setQuestionIdx(0);
    } else {
      setQuestionIdx((i) => i + 1);
    }
  }

  function handleBack() {
    if (questionIdx > 0) {
      setQuestionIdx((i) => i - 1);
    } else if (bucketIdx > 0) {
      setBucketIdx((i) => i - 1);
      setQuestionIdx(BUCKETS[bucketIdx - 1].questions.length - 1);
    }
  }

  async function submitAssessment() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/assessments/scale-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Submit failed");
        return;
      }
      onComplete();
    } catch {
      setError("Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  const totalQuestions = BUCKETS.reduce(
    (acc, b) => acc + b.questions.length,
    0
  );
  const answeredCount = Object.values(answers).flat().filter((v) => v !== null)
    .length;

  return (
    <div className="profyt-card max-w-2xl p-8 md:p-10">
      <div className="mb-8 border-b border-pale pb-6">
        <h1 className="font-serif text-3xl text-black">Scale Risk Score</h1>
        <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-mid">
          {currentBucket.num} — {currentBucket.title}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-mid">
          {currentBucket.sub}
        </p>
        <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-light">
          Progress: {answeredCount} / {totalQuestions}
        </p>
      </div>

      {error ? (
        <p className="mb-6 border border-l2/40 bg-l1/30 px-3 py-2 text-xs text-l4">
          {error}
        </p>
      ) : null}

      <div className="space-y-8">
        <div>
          <p className="text-lg font-medium leading-snug text-black">
            {currentQuestion.text}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mid">
            {currentQuestion.hint}
          </p>
        </div>

        <div className="space-y-3">
          {currentQuestion.answers.map((ans) => {
            const selected = currentAnswer === ans.score;
            return (
              <button
                key={ans.score}
                type="button"
                onClick={() => selectAnswer(ans.score)}
                disabled={submitting}
                className={`w-full border px-4 py-3 text-left text-sm transition-colors ${
                  selected
                    ? "border-black bg-off text-black"
                    : "border-pale bg-white text-mid hover:border-dark hover:text-black"
                } disabled:opacity-50`}
              >
                {ans.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex gap-3 border-t border-pale pt-6">
        {bucketIdx > 0 || questionIdx > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="profyt-btn-secondary flex-1"
          >
            Back
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentAnswer === null || submitting}
          className="profyt-btn-primary flex-1"
        >
          {submitting
            ? "Submitting…"
            : isLastQuestionInBucket && isLastBucket
            ? "Submit"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
