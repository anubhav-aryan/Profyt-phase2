"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewClientPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyName: companyName.trim(),
          clientCode: clientCode.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string; client?: { id: string } };
      if (!res.ok) {
        setError(data.error ?? "Create failed");
        return;
      }
      if (data.client?.id) {
        router.push(`/admin/clients/${data.client.id}`);
        router.refresh();
      }
    } catch {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <Link
        href="/admin/clients"
        className="profyt-link"
      >
        Back to clients
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-black">New client</h1>
      <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-mid">
        Issue a Client ID for the portal
      </p>

      {error ? (
        <p className="mt-6 border border-l2/40 bg-l1/30 px-3 py-2 text-xs text-l4">
          {error}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="profyt-card mt-8 space-y-5 p-8">
        <div>
          <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
            Company name
          </label>
          <input
            className="profyt-input mt-2"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
            Client ID
          </label>
          <input
            className="profyt-input mt-2 font-mono text-sm"
            value={clientCode}
            onChange={(e) => setClientCode(e.target.value)}
            placeholder="e.g. PROF-001"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="profyt-btn-primary w-full"
        >
          {loading ? "Creating…" : "Create client"}
        </button>
      </form>
    </div>
  );
}
