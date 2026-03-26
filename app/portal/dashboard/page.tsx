import { auth } from "@/lib/auth";
import { ClientSignOutButton } from "@/components/ClientSignOutButton";
import { ProfytWordmark } from "@/components/ProfytWordmark";
import { redirect } from "next/navigation";

const wrap = "mx-auto max-w-[1100px] px-5 md:px-12";

export default async function PortalDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "client") {
    redirect("/portal/login");
  }

  return (
    <div className="min-h-screen bg-off pb-16 pt-8">
      <header className={`${wrap} flex flex-col gap-4 border-b border-pale pb-8`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <ProfytWordmark href="/portal/dashboard" />
          <ClientSignOutButton />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-black md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-dark">
            Client portal
          </p>
        </div>
      </header>

      <main className={`${wrap} mt-10`}>
        <div className="profyt-card max-w-lg p-8 md:p-10">
          <p className="text-sm leading-relaxed text-mid">
            Welcome
            {session.user.name ? (
              <span className="text-black">, {session.user.name}</span>
            ) : null}
            . Signed in as{" "}
            <span className="font-medium text-black">{session.user.email}</span>.
            Engagement summaries and diagnostics will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}
