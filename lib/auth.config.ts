import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * Edge-safe NextAuth config — imported by middleware.ts.
 * No Node.js-only modules (Prisma, bcryptjs, mongodb) here.
 * The Credentials authorize callback lives in lib/auth.ts (Node.js runtime only).
 */
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Stub — authorize is handled in lib/auth.ts (Node.js only).
    // Middleware only decodes the JWT; it never calls authorize.
    Credentials({ id: "client", credentials: {} }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        token.role = "analyst";
        token.clientId = null;
        token.sub = user.id ?? token.sub;
      }
      if (account?.provider === "client" && user) {
        token.role = "client";
        token.clientId =
          (user as { clientId?: string | null }).clientId ?? null;
        token.sub = user.id ?? token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role === "client" ? "client" : "analyst";
        session.user.clientId =
          typeof token.clientId === "string" ? token.clientId : null;
      }
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  trustHost: true,
};
