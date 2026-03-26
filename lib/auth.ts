import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { isAuthBypassEmail } from "@/lib/auth-bypass";

const CLIENT_PROFILES_COLLECTION = "clientprofiles";

const secret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "development"
    ? "profyt-phase2-dev-secret-min-32-chars"
    : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
          where: {
            clientId: client.id,
            email: emailRaw,
            isActive: true,
          },
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
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        token.role = "analyst";
        token.clientId = null;
        token.sub = user.id ?? token.sub;
      }
      if (account?.provider === "client" && user) {
        token.role = "client";
        token.clientId = user.clientId ?? null;
        token.sub = user.id ?? token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role =
          token.role === "client" ? "client" : "analyst";
        session.user.clientId =
          typeof token.clientId === "string" ? token.clientId : null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
});
