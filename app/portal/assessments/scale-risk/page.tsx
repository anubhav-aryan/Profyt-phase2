import { auth } from "@/lib/auth";
import { ClientSignOutButton } from "@/components/ClientSignOutButton";
import { ProfytWordmark } from "@/components/ProfytWordmark";
import { ScaleRiskForm } from "@/components/portal/ScaleRiskForm";
import { redirect } from "next/navigation";
import Link from "next/link";

const wrap = "mx-auto max-w-[1100px] px-5 md:px-12";

export default async function PortalScaleRiskAssessmentPage() {
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
          <Link
            href="/portal/dashboard"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-mid hover:text-black"
          >
            ← Dashboard
          </Link>
          <h1 className="mt-3 font-serif text-3xl text-black md:text-4xl">
            Scale Risk Score
          </h1>
          <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-dark">
            Qualitative assessment
          </p>
        </div>
      </header>

      <main className={`${wrap} mt-10`}>
        <ScaleRiskForm redirectTo="/portal/dashboard" />
      </main>
    </div>
  );
}
