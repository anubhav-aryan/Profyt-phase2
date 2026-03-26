"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          PROFYT Analyst Tool
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Sign in with the same Google account you use on the PROFYT website.
        </p>
        {error === "AccessDenied" ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
            Access denied. Your email is not on the allowlist yet (no client
            profile in the main app). Ask your team to add you, or use an
            email listed in <code className="text-xs">AUTH_BYPASS_EMAILS</code>{" "}
            for internal access.
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Continue with Google
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 items-center justify-center text-zinc-500">
          Loading…
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
