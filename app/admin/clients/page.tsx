import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-black">Clients</h1>
          <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-mid">
            Manage Client IDs and portal users
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="profyt-btn-primary inline-block px-6 text-center no-underline"
        >
          New client
        </Link>
      </div>

      <div className="profyt-card mt-10 overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-pale bg-off">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
                Client ID
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
                Company
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
                Users
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
                Active
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-mid">
                  No clients yet. Create one to issue Client IDs.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="border-b border-pale last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${c.id}`}
                      className="font-mono text-sm font-medium text-black underline-offset-2 hover:text-l3 hover:underline"
                    >
                      {c.clientCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-mid">{c.companyName}</td>
                  <td className="px-4 py-3 text-mid">{c._count.users}</td>
                  <td className="px-4 py-3">
                    {c.isActive ? (
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-dark">
                        Yes
                      </span>
                    ) : (
                      <span className="text-light">No</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
