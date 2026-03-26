import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Dev-only fixtures: `demo-client` / `demo-user` / `profyt` */
async function main() {
  const passwordHash = await bcrypt.hash("profyt", 10);

  const client = await prisma.client.upsert({
    where: { clientCode: "demo-client" },
    update: {
      companyName: "Demo Client (development)",
      isActive: true,
    },
    create: {
      clientCode: "demo-client",
      companyName: "Demo Client (development)",
      isActive: true,
    },
  });

  await prisma.clientUser.upsert({
    where: {
      clientId_email: {
        clientId: client.id,
        email: "demo-user",
      },
    },
    update: {
      passwordHash,
      isActive: true,
      name: "Demo User",
    },
    create: {
      clientId: client.id,
      email: "demo-user",
      passwordHash,
      name: "Demo User",
      isActive: true,
    },
  });

  console.log("Seed OK: clientCode=demo-client, user=demo-user, password=profyt");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
