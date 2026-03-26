import { SignOutButton } from "@/components/SignOutButton";
import { ProfytWordmark } from "@/components/ProfytWordmark";
import { auth } from "@/lib/auth";
import { isSuperAdminEmail } from "@/lib/superadmin";
import Link from "next/link";

const wrap = "mx-auto max-w-[1100px] px-5 md:px-12";

export default async function Home() {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const showAdmin =
    session?.user?.role === "analyst" && isSuperAdminEmail(email);

  return (
    <div className="min-h-screen bg-off pb-16 pt-10">
      <header className={`${wrap} flex flex-col gap-6 border-b border-pale pb-8`}>
        <ProfytWordmark href="/" />
        <div>
          <h1 className="font-serif text-3xl text-black md:text-4xl">
            Analyst workspace
          </h1>
          <p className="mt-2 max-w-xl font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-dark">
            PROFYT diagnostics platform — phase 2
          </p>
        </div>
      </header>

      <main className={`${wrap} mt-10`}>
        <div className="profyt-card max-w-lg p-8 md:p-10">
          <p className="text-sm leading-relaxed text-mid">
            Signed in as{" "}
            <span className="font-medium text-black">{email || "Unknown"}</span>.
            Reporting and data layers will connect here as the product grows.
          </p>

          <ul className="mt-8 list-none space-y-3 p-0">
            <li>
              <Link href="/portal/login" className="profyt-link">
                Client portal (founders)
              </Link>
            </li>
            {showAdmin ? (
              <li>
                <Link href="/admin/clients" className="profyt-link">
                  Superadmin — clients
                </Link>
              </li>
            ) : null}
          </ul>

          <div className="mt-10">
            <SignOutButton />
          </div>
        </div>
      </main>
    </div>
  );
}
