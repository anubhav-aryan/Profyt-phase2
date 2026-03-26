import { AdminClientDetail } from "@/components/admin/AdminClientDetail";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminClientPage({ params }: PageProps) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      users: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
        },
      },
    },
  });

  if (!client) notFound();

  return (
    <AdminClientDetail
      clientId={client.id}
      clientCode={client.clientCode}
      companyName={client.companyName}
      clientIsActive={client.isActive}
      users={client.users}
    />
  );
}
