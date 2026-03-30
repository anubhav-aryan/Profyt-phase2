"use client";

import { useRef, useState } from "react";

type Submission = {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  uploadedAt: string;
  updatedAt?: string;
} | null;

type TemplateCardProps = {
  id: string;
  name: string;
  filename: string;
  description: string;
  hint: string;
  submission: Submission;
  onUploadComplete: () => void;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    uploaded: "Uploaded",
    processing: "Processing",
    validated: "Validated",
    error: "Error",
  };
  return map[status] ?? status;
}

export function TemplateCard({
  id,
  name,
  description,
  hint,
  submission,
  onUploadComplete,
}: TemplateCardProps) {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleDownload() {
    setError(null);
    setDownloading(true);
    try {
      const res = await fetch(`/api/portal/templates/${id}/download`, {
        credentials: "include",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Download failed");
        return;
      }

      // Trigger browser file download from the blob
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Get filename from Content-Disposition header, or fall back
      const cd = res.headers.get("content-disposition") ?? "";
      const match = cd.match(/filename="?([^"]+)"?/);
      a.download = match?.[1] ?? `${id}_template.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Download request failed");
    } finally {
      setDownloading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/portal/templates/${id}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      onUploadComplete();
    } catch {
      setError("Upload request failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!submission) return;
    setError(null);
    setUploading(true);
    try {
      const res = await fetch(`/api/portal/templates/${id}/upload`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Delete failed");
        return;
      }
      onUploadComplete();
    } catch {
      setError("Delete request failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="profyt-card flex flex-col p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 border-b border-pale pb-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-light">
          Template {id}
        </p>
        <h3 className="mt-1 font-serif text-xl text-black">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mid">{description}</p>
      </div>

      {/* Hint */}
      <p className="mb-6 text-xs leading-relaxed text-light">{hint}</p>

      {/* Upload status */}
      {submission ? (
        <div className="mb-6 border border-pale bg-off px-4 py-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-dark">
              {statusBadge(submission.status)}
            </p>
            <p
              className="mt-1 truncate text-xs text-mid"
              title={submission.fileName}
            >
              {submission.fileName}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-light">
              {formatBytes(submission.fileSize)} ·{" "}
              {new Date(submission.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 border border-pale bg-off px-4 py-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-light">
            Not uploaded
          </p>
          <p className="mt-1 text-xs text-light">
            Download the template, fill it in, then upload below.
          </p>
        </div>
      )}

      {error ? (
        <p className="mb-4 border border-pale bg-off px-3 py-2 text-xs text-l4">
          {error}
        </p>
      ) : null}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          disabled={downloading}
          onClick={handleDownload}
          className="profyt-btn-secondary block px-4 text-center disabled:opacity-50"
        >
          {downloading ? "Downloading…" : "Download Template"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="profyt-btn-primary px-4 disabled:opacity-50"
        >
          {uploading
            ? "Uploading…"
            : submission
            ? "Replace Upload"
            : "Upload Completed Sheet"}
        </button>

        {submission ? (
          <button
            type="button"
            disabled={uploading}
            onClick={handleDelete}
            className="font-mono text-[10px] font-semibold uppercase tracking-wider text-mid underline underline-offset-4 hover:text-black disabled:opacity-50"
          >
            Remove upload
          </button>
        ) : null}
      </div>
    </div>
  );
}
