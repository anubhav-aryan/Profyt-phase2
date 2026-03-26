import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="max-w-lg text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          PROFYT Analyst Tool
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          You are signed in as{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {session?.user?.email ?? "Unknown"}
          </span>
          . Product routes and data layers will connect here next.
        </p>
      </div>
      <SignOutButton />
    </div>
  );
}
