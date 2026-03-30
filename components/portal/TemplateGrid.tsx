"use client";

import { useEffect, useState } from "react";
import { TemplateCard } from "./TemplateCard";

type Submission = {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  uploadedAt: string;
} | null;

type TemplateRow = {
  id: string;
  name: string;
  filename: string;
  description: string;
  hint: string;
  submission: Submission;
};

export function TemplateGrid() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/portal/templates", { credentials: "include" })
      .then((res) => res.json())
      .then((data: { templates?: TemplateRow[]; error?: string }) => {
        if (data.error) {
          setFetchError(data.error);
        } else {
          setTemplates(data.templates ?? []);
          setFetchError(null);
        }
      })
      .catch(() => setFetchError("Failed to load templates"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let mounted = true;
    fetch("/api/portal/templates", { credentials: "include" })
      .then((res) => res.json())
      .then((data: { templates?: TemplateRow[]; error?: string }) => {
        if (!mounted) return;
        if (data.error) {
          setFetchError(data.error);
        } else {
          setTemplates(data.templates ?? []);
        }
      })
      .catch(() => {
        if (mounted) setFetchError("Failed to load templates");
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
          Loading templates…
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="profyt-card max-w-lg p-8">
        <p className="text-sm text-mid">{fetchError}</p>
      </div>
    );
  }

  const uploadedCount = templates.filter((t) => t.submission !== null).length;

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-dark">
          {uploadedCount} / {templates.length} uploaded
        </p>
        <div className="h-px flex-1 bg-pale" />
      </div>

      {/* 2 × 2 grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            {...t}
            onUploadComplete={load}
          />
        ))}
      </div>
    </div>
  );
}
