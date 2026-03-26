import { auth } from "@/lib/auth";
import { isSuperAdminEmail } from "@/lib/superadmin";
import { ProfytWordmark } from "@/components/ProfytWordmark";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }
  if (session.user.role !== "analyst") {
    redirect("/login?error=AccessDenied");
  }
  if (!isSuperAdminEmail(session.user.email)) {
    redirect("/login?error=AccessDenied");
  }

  return (
    <div className="min-h-screen bg-off md:flex">
      <aside className="w-full border-b border-pale bg-white p-5 md:min-h-screen md:w-72 md:border-r md:border-b-0 md:p-7">
        <div className="mb-7 border-b border-pale pb-5">
          <ProfytWordmark href="/" />
          <p className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-dark">
            Superadmin
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          <Link
            href="/admin/clients"
            className="px-1 py-2 font-mono text-[14px] font-semibold uppercase tracking-[0.12em] text-dark no-underline transition-colors hover:text-black"
          >
            Clients
          </Link>
          <Link
            href="/"
            className="px-1 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-mid no-underline transition-colors hover:text-black"
          >
            Analyst home
          </Link>
        </nav>
      </aside>
      <main className="flex-1 px-5 py-8 md:px-12">{children}</main>
    </div>
  );
}
