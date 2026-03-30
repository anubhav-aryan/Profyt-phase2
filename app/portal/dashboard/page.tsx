import { auth } from "@/lib/auth";
import { ClientSignOutButton } from "@/components/ClientSignOutButton";
import { ProfytWordmark } from "@/components/ProfytWordmark";
import { AssessmentGate } from "@/components/portal/AssessmentGate";
import { redirect } from "next/navigation";
import Link from "next/link";

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

      <main className={`${wrap} mt-10 space-y-12`}>
        {/* Qualitative assessments */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-dark">
              Qualitative assessments
            </p>
            <div className="h-px flex-1 bg-pale" />
          </div>
          <AssessmentGate />
        </section>

        {/* Phase 1 quantitative templates */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-dark">
              Quantitative templates
            </p>
            <div className="h-px flex-1 bg-pale" />
          </div>
          <Link
            href="/portal/assessment"
            className="profyt-card group flex items-start justify-between gap-4 p-6 transition-colors hover:border-black md:p-8"
          >
            <div>
              <h2 className="font-serif text-xl text-black">
                Phase 1 Assessment
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mid">
                Download the 4 Excel templates (P&amp;L, Unit Economics, Cash Flow,
                Revenue Model), fill them in, and upload your completed files.
              </p>
            </div>
            <span className="mt-1 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-wider text-light group-hover:text-black">
              →
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
