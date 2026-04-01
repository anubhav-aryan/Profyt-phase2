import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isAuthBypassEmail } from "@/lib/auth-bypass";
import { authConfig } from "@/lib/auth.config";

const CLIENT_PROFILES_COLLECTION = "clientprofiles";

const secret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "development"
    ? "profyt-phase2-dev-secret-min-32-chars"
    : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret,
  providers: [
    // Keep Google from the base config unchanged
    ...authConfig.providers.filter((p) => {
      const id = typeof p === "object" && "id" in p ? p.id : null;
      return id !== "client";
    }),
    // Full Credentials provider with Node.js-only authorize logic
    Credentials({
      id: "client",
      name: "Client",
      credentials: {
        clientCode: { label: "Client ID", type: "text" },
        email: { label: "User ID or email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const clientCode = credentials?.clientCode?.toString().trim();
        const emailRaw = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString() ?? "";

        if (!clientCode || !emailRaw || !password) return null;

        const { prisma } = await import("@/lib/prisma");
        const bcrypt = await import("bcryptjs");

        const client = await prisma.client.findFirst({
          where: { clientCode, isActive: true },
        });
        if (!client) return null;

        const clientUser = await prisma.clientUser.findFirst({
          where: { clientId: client.id, email: emailRaw, isActive: true },
        });
        if (!clientUser) return null;

        const ok = await bcrypt.compare(password, clientUser.passwordHash);
        if (!ok) return null;

        return {
          id: clientUser.id,
          email: clientUser.email,
          name: clientUser.name || "",
          role: "client" as const,
          clientId: client.id,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "client") {
        return !!user;
      }
      if (account?.provider !== "google") return false;
      const email = user?.email?.trim().toLowerCase();
      if (!email) return false;
      if (isAuthBypassEmail(email)) return true;

      const { getMongoDb } = await import("@/lib/mongo");
      const db = await getMongoDb();
      const doc = await db
        .collection(CLIENT_PROFILES_COLLECTION)
        .findOne({ email }, { projection: { _id: 1 } });

      return doc !== null;
    },
  },
});
