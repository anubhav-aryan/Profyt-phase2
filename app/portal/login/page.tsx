"use client";

import { ProfytWordmark } from "@/components/ProfytWordmark";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function PortalLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/portal/dashboard";

  const [step, setStep] = useState<1 | 2>(1);
  const [clientCode, setClientCode] = useState("");
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onValidateClient(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/client-auth/check-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientCode: clientCode.trim() }),
      });
      const data = (await res.json()) as { companyName?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Invalid client ID");
        return;
      }
      setCompanyName(data.companyName ?? null);
      setStep(2);
    } catch {
      setError("Could not validate client ID");
    } finally {
      setLoading(false);
    }
  }

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("client", {
        clientCode: clientCode.trim(),
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("Invalid email or password");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off px-5 py-12">
      <div className="mb-8 flex w-full max-w-[420px] flex-col items-center gap-3">
        <ProfytWordmark href="/portal/login" />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-dark">
          Client portal
        </p>
        <p className="text-center text-xs text-mid">
          Analyst account?{" "}
          <Link href="/login" className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-black underline underline-offset-4 hover:text-l3">
            Analyst sign-in
          </Link>
        </p>
      </div>

      <div className="profyt-card w-full max-w-[420px] p-8 md:p-10">
        <h1 className="font-serif text-3xl text-black">
          {step === 1 ? "Client ID" : "Sign in"}
        </h1>
        <p className="mb-8 mt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-light">
          {step === 1
            ? "Enter the ID your administrator gave you"
            : "Use the user ID (or email) and password they configured"}
        </p>

        {process.env.NODE_ENV === "development" ? (
          <p className="mb-6 border border-pale bg-off px-3 py-2 text-[11px] leading-relaxed text-mid">
            <span className="font-mono font-semibold text-dark">Dev:</span> run{" "}
            <code className="font-mono text-[10px]">npm run db:seed</code> then
            try Client ID <code className="font-mono text-black">demo-client</code>
            , user <code className="font-mono text-black">demo-user</code>,
            password <code className="font-mono text-black">profyt</code>.
          </p>
        ) : null}

        {error ? (
          <p className="mb-6 border border-l2/40 bg-l1/30 px-3 py-2 text-xs text-l4">
            {error}
          </p>
        ) : null}

        {step === 1 ? (
          <form onSubmit={onValidateClient} className="space-y-5">
            <div>
              <label
                htmlFor="clientCode"
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark"
              >
                Client ID
              </label>
              <input
                id="clientCode"
                name="clientCode"
                autoComplete="off"
                className="profyt-input mt-2"
                value={clientCode}
                onChange={(e) => setClientCode(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="profyt-btn-primary w-full"
            >
              {loading ? "Checking…" : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={onSignIn} className="space-y-5">
            {companyName ? (
              <p className="border border-pale bg-off px-3 py-2 text-sm text-dark">
                <span className="font-medium text-black">{companyName}</span>
                <span className="text-mid"> — verified</span>
              </p>
            ) : null}
            <div>
              <label
                htmlFor="email"
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark"
              >
                User ID or email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                className="profyt-input mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="profyt-input mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPassword("");
                  setError(null);
                }}
                className="profyt-btn-secondary flex-1"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="profyt-btn-primary flex-1"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-off text-mid">
          <p className="font-mono text-[11px] uppercase tracking-wider">
            Loading…
          </p>
        </div>
      }
    >
      <PortalLoginInner />
    </Suspense>
  );
}
