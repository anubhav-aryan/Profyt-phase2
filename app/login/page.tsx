"use client";

import { ProfytWordmark } from "@/components/ProfytWordmark";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off px-5">
      <div className="mb-10 flex w-full max-w-[420px] flex-col items-center gap-4">
        <ProfytWordmark href="/" />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-dark">
          Analyst sign-in
        </p>
      </div>

      <div className="profyt-card w-full max-w-[420px] p-10">
        <h1 className="font-serif text-3xl text-black">Sign in</h1>
        <p className="mb-8 mt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-light">
          Continue with your Google account from profyt.in
        </p>

        {error === "AccessDenied" ? (
          <p className="mb-6 border border-l2/40 bg-l1/30 px-3 py-2 text-xs leading-relaxed text-l4">
            Access denied. Your email is not on the allowlist yet (no client
            profile in the main app). Ask your team to add you, or use an email
            in <code className="font-mono text-[10px]">AUTH_BYPASS_EMAILS</code>{" "}
            for internal access.
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="profyt-btn-primary w-full"
        >
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-xs leading-[1.6] text-mid">
          For founders using a Client ID, use the client portal instead.
        </p>
        <p className="mt-3 text-center">
          <Link href="/portal/login" className="profyt-link">
            Client portal
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
      <LoginInner />
    </Suspense>
  );
}
